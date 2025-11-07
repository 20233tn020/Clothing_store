import boto3
import time
import pymysql

region = 'us-east-1'

def vpc_existente(ec2):
    vpcs = ec2.describe_vpcs()['Vpcs']
    for vpc in vpcs:
        tags = vpc.get('Tags', [])
        for tag in tags:
            if tag['Key'] == 'Name' and tag['Value'] == 'DemoVPC':
                print(f'VPC ya existe: {vpc["VpcId"]}')
                return vpc['VpcId']
    return None

def crear_vpc():
    ec2 = boto3.client('ec2', region_name=region)
    vpc_id = vpc_existente(ec2)
    if vpc_id:
        return vpc_id
    vpc = ec2.create_vpc(CidrBlock='10.0.0.0/16')
    vpc_id = vpc['Vpc']['VpcId']
    ec2.create_tags(Resources=[vpc_id], Tags=[{'Key': 'Name', 'Value': 'DemoVPC'}])
    ec2.modify_vpc_attribute(VpcId=vpc_id, EnableDnsSupport={'Value': True})
    ec2.modify_vpc_attribute(VpcId=vpc_id, EnableDnsHostnames={'Value': True})
    print(f'VPC creada: {vpc_id}')
    return vpc_id

def crear_subredes(vpc_id):
    ec2 = boto3.client('ec2', region_name=region)
    subnets = ec2.describe_subnets()['Subnets']
    existing = {subnet['CidrBlock']: subnet['SubnetId'] for subnet in subnets if subnet['VpcId'] == vpc_id}
    subnet_ids = []

    if '10.0.1.0/24' in existing:
        print(f'Subred ya existe: {existing["10.0.1.0/24"]}')
        subnet_ids.append(existing['10.0.1.0/24'])
    else:
        subnet1 = ec2.create_subnet(VpcId=vpc_id, CidrBlock='10.0.1.0/24', AvailabilityZone=region + 'a')
        subnet_ids.append(subnet1['Subnet']['SubnetId'])
        print(f'Subred creada: {subnet1["Subnet"]["SubnetId"]}')

    if '10.0.2.0/24' in existing:
        print(f'Subred ya existe: {existing["10.0.2.0/24"]}')
        subnet_ids.append(existing['10.0.2.0/24'])
    else:
        subnet2 = ec2.create_subnet(VpcId=vpc_id, CidrBlock='10.0.2.0/24', AvailabilityZone=region + 'b')
        subnet_ids.append(subnet2['Subnet']['SubnetId'])
        print(f'Subred creada: {subnet2["Subnet"]["SubnetId"]}')

    print(f'Subnet IDs: {subnet_ids} - Tipo: {type(subnet_ids)}')
    return subnet_ids

def configurar_internet_gateway(vpc_id, subnet_ids):
    ec2 = boto3.client('ec2', region_name=region)
    igws = ec2.describe_internet_gateways()['InternetGateways']
    for igw in igws:
        attachments = igw.get('Attachments', [])
        for att in attachments:
            if att['VpcId'] == vpc_id:
                print(f'Internet Gateway ya asociada: {igw["InternetGatewayId"]}')
                return

    igw = ec2.create_internet_gateway()
    igw_id = igw['InternetGateway']['InternetGatewayId']
    ec2.attach_internet_gateway(InternetGatewayId=igw_id, VpcId=vpc_id)
    print(f'Internet Gateway creada y asociada: {igw_id}')

    route_table = ec2.create_route_table(VpcId=vpc_id)
    rt_id = route_table['RouteTable']['RouteTableId']
    ec2.create_route(RouteTableId=rt_id, DestinationCidrBlock='0.0.0.0/0', GatewayId=igw_id)
    print(f'Tabla de rutas creada: {rt_id}')

    for subnet_id in subnet_ids:
        ec2.associate_route_table(RouteTableId=rt_id, SubnetId=subnet_id)
        print(f'Tabla de rutas asociada a subred: {subnet_id}')

def crear_grupo_seguridad(vpc_id):
    ec2 = boto3.client('ec2', region_name=region)
    grupos = ec2.describe_security_groups()['SecurityGroups']
    for grupo in grupos:
        if grupo['GroupName'] == 'DemoSG':
            print(f'Grupo de seguridad ya existe: {grupo["GroupId"]}')
            return grupo['GroupId']

    response = ec2.create_security_group(
        GroupName='DemoSG',
        Description='Allow all traffic',
        VpcId=vpc_id
    )
    sg_id = response['GroupId']
    ec2.authorize_security_group_ingress(
        GroupId=sg_id,
        IpPermissions=[{'IpProtocol': '-1', 'IpRanges': [{'CidrIp': '0.0.0.0/0'}]}]
    )
    try:
        ec2.authorize_security_group_egress(
            GroupId=sg_id,
            IpPermissions=[{'IpProtocol': '-1', 'IpRanges': [{'CidrIp': '0.0.0.0/0'}]}]
        )
    except boto3.exceptions.botocore.client.ClientError as e:
        if 'InvalidPermission.Duplicate' in str(e):
            print('La regla de salida ya existe, se omite.')
        else:
            raise
    print(f'Grupo de seguridad creado: {sg_id}')
    return sg_id

def rds_existente(rds):
    try:
        rds.describe_db_instances(DBInstanceIdentifier='demo-mysql-db')
        print('RDS ya existe: demo-mysql-db')
        return True
    except rds.exceptions.DBInstanceNotFoundFault:
        return False

def crear_rds(sg_id, subnet_ids):
    rds = boto3.client('rds', region_name=region)
    if rds_existente(rds):
        return
    subnet_group_name = 'demo-subnet-group'
    try:
        rds.create_db_subnet_group(
            DBSubnetGroupName=subnet_group_name,
            DBSubnetGroupDescription='Demo subnet group',
            SubnetIds=subnet_ids
        )
        print(f'Grupo de subredes creado: {subnet_group_name}')
    except rds.exceptions.DBSubnetGroupAlreadyExistsFault:
        print(f'Grupo de subredes ya existe: {subnet_group_name}')

    rds.create_db_instance(
        DBInstanceIdentifier='demo-mysql-db',
        AllocatedStorage=20,
        DBName='demo',
        Engine='mysql',
        MasterUsername='admin',
        MasterUserPassword='admin123',
        DBInstanceClass='db.t3.micro',
        VpcSecurityGroupIds=[sg_id],
        DBSubnetGroupName=subnet_group_name,
        PubliclyAccessible=True,
        BackupRetentionPeriod=0,
        MultiAZ=False,
        StorageType='gp2'
    )
    print('Esperando que la instancia RDS esté disponible...')
    waiter = rds.get_waiter('db_instance_available')
    waiter.wait(DBInstanceIdentifier='demo-mysql-db')
    print('Instancia RDS creada y disponible.')

def obtener_endpoint():
    rds = boto3.client('rds', region_name=region)
    response = rds.describe_db_instances(DBInstanceIdentifier='demo-mysql-db')
    return response['DBInstances'][0]['Endpoint']['Address']

# Ejecutar todo
if __name__ == '__main__':
    vpc_id = crear_vpc()
    subnet_ids = crear_subredes(vpc_id)
    configurar_internet_gateway(vpc_id, subnet_ids)
    sg_id = crear_grupo_seguridad(vpc_id)
    crear_rds(sg_id, subnet_ids)
    endpoint = obtener_endpoint()
    print(f'Endpoint RDS: {endpoint}')
    time.sleep(60)
    # inicializar_base_de_datos(endpoint)