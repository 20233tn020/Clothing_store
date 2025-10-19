from flask import Flask,request, jsonify, session # <=  Jsonify es una función de Flask que convierte datos Python en respuestas JSON para APIs
from models import db, User, Admin  # <= Aqui importamos lo que tenemos en model  la db y usuarios :> 
from flask_bcrypt import Bcrypt # <= PROTEGER CONTRASEÑAS de tus usuarios (las incripta)
from flask_cors import CORS, cross_origin

#Session guarda los datos temporales 
import mysql.connector
from mysql.connector import Error
app = Flask(__name__)

app.config['SECRET_KEY']= 'Fashion-Luxe'
# configure the SQLite database, relative to the app instance folder
# #app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"

def create_database():
    try:
         # Conectar a MySQL sin especificar base de datos
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='root123'
        ) 
        if connection.is_connected():
            cursor = connection.cursor()
            # Crear base de datos si no existe
            cursor.execute("CREATE DATABASE IF NOT EXISTS tienda_online")
            print(" Base de datos 'tienda_online' creada/verificada")
            
    except Error as e:
        print(f" Error creando base de datos: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
create_database()

# CAMBIA de SQLite a MySQL:
#app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+mysqlconnector://usuario:password@localhost/nombre_base_datos"

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+mysqlconnector://root:root123@localhost/tienda_online"

# SQLALCHEMY_TRACK_MODIFICATIONS = False  <= DESACTIVA el seguimiento de modificaciones para mejor rendimiento
# Evita que SQLAlchemy rastree cada cambio en los objetos (ahorra memoria y CPU)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# SQLALCHEMY_ECHO = True  <= ACTIVA el modo "eco" para ver las consultas SQL en la terminal
# Muestra todas las consultas SQL que SQLAlchemy ejecuta (útil para debugging)
app.config["SQLALCHEMY_ECHO"] = True

# initialize the app with the extension
bcrypt = Bcrypt(app)
#permite la conexion dede otro sitio (como el front)
CORS(app, supports_credentials=True)
db.init_app(app)
# Crea todas las tablas definidas en los modelos
# El contexto 'with app.app_context():' es necesario para trabajar con la base de datos
with app.app_context():
    db.create_all()# <= Crea las tablas en la base de datos si no existen

@app.route("/")
def hello_world():
    return "<p>Hello World</p>"


@app.route("/Signup", methods=["POST"])
def signup():
    # DATOS OBLIGATORIOS 
    data = request.json
    Nombre = data.get("Nombre")
    Apellido = data.get("Apellido")
    Email = data.get("Email")
    Password = data.get("Password")
    
    # DATOS OPCIONALES
    Telefono = data.get("Telefono")
    Fecha_nacimiento = data.get("Fecha_nacimiento")
    Genero = data.get("Genero")
    Direccion = data.get("Direccion")
    Ciudad = data.get("Ciudad")
    Estado_provincia = data.get("Estado_provincia")
    Codigo_postal = data.get("Codigo_postal")
    Pais = data.get("Pais")
    Tipo_direccion = data.get("Tipo_direccion")

    # VERIFICA SI EL USUARIO EXISTE
    User_exists = User.query.filter_by(Email=Email).first() is not None
    
    if User_exists:
        return jsonify({"error": "Email already exists"}), 409
    
    # OCUPAMOS EL hash para incriptar las contraseñas 
    hashed_password = bcrypt.generate_password_hash(Password)
    
    #  CREAR USUARIO CON TODOS LOS CAMPOS
    new_user = User(
        Nombre=Nombre,
        Apellido=Apellido,
        Email=Email, 
        Password=hashed_password,
        #  CAMPOS OPCIONALES
        Telefono=Telefono,
        Fecha_nacimiento=Fecha_nacimiento,
        Genero=Genero,
        Direccion=Direccion,
        Ciudad=Ciudad,
        Estado_provincia=Estado_provincia,
        Codigo_postal=Codigo_postal,
        Pais=Pais,
        Tipo_direccion=Tipo_direccion
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    session["user_id"] = new_user.id

    #  DEVOLVER TODOS LOS DATOS DEL USUARIO
    return jsonify({
        "id": new_user.id,
        "nombre": new_user.Nombre,
        "apellido": new_user.Apellido,
        "email": new_user.Email,
        "telefono": new_user.Telefono,
        "genero": new_user.Genero,
        "direccion": new_user.Direccion,
        "ciudad": new_user.Ciudad
    })


@app.route("/Signup_Admin", methods =["POST"])
def Signup_Admin():
    # DATOS OBLIGATORIOS 
    data = request.json
    Nombre = data.get("Nombre")
    Email = data.get("Email")
    Password = data.get("Password")
    Rol = data.get("Rol")
    # VERIFICA SI EL USUARIO EXISTE
    user_exists = Admin.query.filter_by(Email=Email).first() is not None
    
    if user_exists:
        return jsonify({"error": "Email already exists"}), 409
    
    # OCUPAMOS EL hash para incriptar las contraseñas 
    hashed_password = bcrypt.generate_password_hash(Password)
    
    #  CREAR USUARIO CON TODOS LOS CAMPOS
    new_UserAdmin = Admin(
        Nombre=Nombre,
        Email=Email, 
        Password=hashed_password,
        Rol = Rol
    )
    db.session.add(new_UserAdmin)
    db.session.commit()
    session["Admin_id"] = new_UserAdmin.id

    #  DEVOLVER TODOS LOS DATOS DEL USUARIO
    return jsonify({
        "id": new_UserAdmin.id,
        "Nombre": new_UserAdmin.Nombre,
        "email": new_UserAdmin.Email,
        "Rol": new_UserAdmin.Rol
    })


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    Email = data.get("Email")
    Password = data.get("Password")

    if not Email or not Password:
        return jsonify({"error": "Faltan campos"}), 400

    # Buscar primero en usuarios normales
    user = User.query.filter_by(Email=Email).first()

    user_type = None

    # Si no hay usuario, buscar en admins
    if not user:
        user = Admin.query.filter_by(Email=Email).first()
        if user:
            user_type = "admin"
        else:
            return jsonify({"error": "Usuario no encontrado"}), 401
    else:
        user_type = "cliente"

    # Obtener la contraseña (ambos modelos usan Password con mayúscula)
    stored_password = user.Password

    # Validar la contraseña con bcrypt
    if not bcrypt.check_password_hash(stored_password, Password):
        return jsonify({"error": "Contraseña incorrecta"}), 401

    # Guardar sesión
    if user_type == "admin":
        session["admin_id"] = user.id
    else:
        session["user_id"] = user.id

    # Devolver los datos del usuario
    return jsonify({
        "id": user.id,
        "Nombre": user.Nombre,
        "Email": user.Email,
        "Rol": getattr(user, "Rol", "cliente"),  # Solo los admins tienen Rol
        "Tipo": user_type,
        "Fecha_creacion": str(user.Fecha_creacion)
    }), 200

if __name__ == "__main__":
    app.run(debug=True)

    # FIRMA 