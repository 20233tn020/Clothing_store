from flask import Flask,request, jsonify, session # <=  Jsonify es una función de Flask que convierte datos Python en respuestas JSON para APIs
from models import db, User  # <= Aqui importamos lo que tenemos en model  la db y usuarios :> 
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
    nombre = data.get("nombre")
    apellido = data.get("apellido")
    email = data.get("email")
    password = data.get("password")
    
    # DATOS OPCIONALES
    telefono = data.get("telefono")
    fecha_nacimiento = data.get("fecha_nacimiento")
    genero = data.get("genero")
    direccion = data.get("direccion")
    ciudad = data.get("ciudad")
    estado_provincia = data.get("estado_provincia")
    codigo_postal = data.get("codigo_postal")
    pais = data.get("pais")
    tipo_direccion = data.get("tipo_direccion")

    # VERIFICA SI EL USUARIO EXISTE
    user_exists = User.query.filter_by(email=email).first() is not None
    
    if user_exists:
        return jsonify({"error": "Email already exists"}), 409
    
    # OCUPAMOS EL hash para incriptar las contraseñas 
    hashed_password = bcrypt.generate_password_hash(password)
    
    #  CREAR USUARIO CON TODOS LOS CAMPOS
    new_user = User(
        nombre=nombre,
        apellido=apellido,
        email=email, 
        password=hashed_password,
        #  CAMPOS OPCIONALES
        telefono=telefono,
        fecha_nacimiento=fecha_nacimiento,
        genero=genero,
        direccion=direccion,
        ciudad=ciudad,
        estado_provincia=estado_provincia,
        codigo_postal=codigo_postal,
        pais=pais,
        tipo_direccion=tipo_direccion
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    session["user_id"] = new_user.id

    #  DEVOLVER TODOS LOS DATOS DEL USUARIO
    return jsonify({
        "id": new_user.id,
        "nombre": new_user.nombre,
        "apellido": new_user.apellido,
        "email": new_user.email,
        "telefono": new_user.telefono,
        "genero": new_user.genero,
        "direccion": new_user.direccion,
        "ciudad": new_user.ciudad
    })


@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]
    
    # busca un usuario en la base de datos
    user = User.query.filter_by(email=email).first()
    
    # Si no encontramos al usuario, rechaza el acceso
    if user is None:
        return jsonify({"error":"Unauthorized Access"}), 401

    # Si la contraseña no coincide, rechaza el acceso
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
    
    # Guarda el ID del usuario en la sesión
    session["user_id"] = user.id

    #  DEVOLVER TODOS LOS DATOS DEL USUARIO
    return jsonify({
        "id": user.id,
        "nombre": user.nombre,
        "apellido": user.apellido,
        "telefono":user.telefono,
        "email": user.email,
        "fecha_nacimiento": user.fecha_nacimiento,
        "genero":user.genero,
        "fecha_creacion":user.fecha_creacion,
    })

if __name__ == "__main__":
    app.run(debug=True)

    # FIRMA 