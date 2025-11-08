from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from flask_mail import Mail, Message
from models import db, User, Admin
from sqlalchemy.exc import SQLAlchemyError
import mysql.connector
from mysql.connector import Error

# =====================================
# CONFIGURACIÓN INICIAL
# =====================================
app = Flask(__name__)
app.config['SECRET_KEY'] = 'Fashion-Luxe'

# Base de datos MySQL
def create_database():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='root123'
        )
        if connection.is_connected():
            cursor = connection.cursor()
            cursor.execute("CREATE DATABASE IF NOT EXISTS tienda_online")
            print("✅ Base de datos 'tienda_online' creada/verificada")
    except Error as e:
        print(f"❌ Error creando base de datos: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

create_database()

# Configuración SQLAlchemy
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+mysqlconnector://root:root123@localhost/tienda_online"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = True

# Inicializaciones
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
db.init_app(app)

# Crear tablas
with app.app_context():
    db.create_all()

# =====================================
# CONFIGURACIÓN DEL CORREO
# =====================================
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = '20233tn020@gmail.com'
app.config['MAIL_PASSWORD'] = '64038HA6'
mail = Mail(app)

# =====================================
# RUTAS BÁSICAS
# =====================================
@app.route("/")
def hello_world():
    return "<p>Hello World</p>"

# =====================================
# REGISTRO DE USUARIO (CLIENTE)
# =====================================
@app.route("/Signup", methods=["POST"])
def signup():
    data = request.json

    # Datos obligatorios
    Nombre = data.get("Nombre")
    Apellido = data.get("Apellido")
    Email = data.get("Email")
    Password = data.get("Password")

    # Datos opcionales
    Telefono = data.get("Telefono")
    Fecha_nacimiento = data.get("Fecha_nacimiento")
    Genero = data.get("Genero")
    Direccion = data.get("Direccion")
    Ciudad = data.get("Ciudad")
    Estado_provincia = data.get("Estado_provincia")
    Codigo_postal = data.get("Codigo_postal")
    Pais = data.get("Pais")
    Tipo_direccion = data.get("Tipo_direccion")

    # Verificar si el usuario existe
    if User.query.filter_by(Email=Email).first():
        return jsonify({"error": "Email already exists"}), 409

    # Hashear contraseña
    hashed_password = bcrypt.generate_password_hash(Password)

    # Crear nuevo usuario
    new_user = User(
        Nombre=Nombre,
        Apellido=Apellido,
        Email=Email,
        Password=hashed_password,
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

    return jsonify({
        "id": new_user.id,
        "nombre": new_user.Nombre,
        "apellido": new_user.Apellido,
        "email": new_user.Email,
        "telefono": new_user.Telefono,
        "genero": new_user.Genero,
        "direccion": new_user.Direccion,
        "ciudad": new_user.Ciudad
    }), 201

# =====================================
# REGISTRO DE ADMINISTRADOR
# =====================================
@app.route("/Signup_Admin", methods=["POST"])
def signup_admin():
    data = request.json

    Nombre = data.get("Nombre")
    Email = data.get("Email")
    Password = data.get("Password")
    Rol = data.get("Rol")

    if Admin.query.filter_by(Email=Email).first():
        return jsonify({"error": "Email already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(Password)

    new_admin = Admin(
        Nombre=Nombre,
        Email=Email,
        Password=hashed_password,
        Rol=Rol
    )

    db.session.add(new_admin)
    db.session.commit()
    session["Admin_id"] = new_admin.id

    return jsonify({
        "id": new_admin.id,
        "Nombre": new_admin.Nombre,
        "Email": new_admin.Email,
        "Rol": new_admin.Rol
    }), 201

# =====================================
# LOGIN (USUARIO Y ADMIN)
# =====================================
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    Email = data.get("Email")
    Password = data.get("Password")

    if not Email or not Password:
        return jsonify({"error": "Por favor, completa todos los campos."}), 400

    # Buscar usuario o admin
    user = User.query.filter_by(Email=Email).first()
    user_type = "cliente" if user else None

    if not user:
        user = Admin.query.filter_by(Email=Email).first()
        if user:
            user_type = "admin"

    if not user:
        return jsonify({"error": "El correo no está registrado."}), 404

    if not bcrypt.check_password_hash(user.Password, Password):
        return jsonify({"error": "Contraseña incorrecta."}), 401

    session.clear()
    session["user_id" if user_type == "cliente" else "admin_id"] = user.id

    response = {
        "id": user.id,
        "Nombre": user.Nombre,
        "Email": user.Email,
        "Tipo": user_type,
        "Fecha_creacion": str(user.Fecha_creacion),
        "Activo": user.Activo if hasattr(user, 'Activo') else True
    }

    if user_type == "cliente":
        response.update({
            "Apellido": user.Apellido,
            "Telefono": user.Telefono,
            "Fecha_nacimiento": str(user.Fecha_nacimiento) if user.Fecha_nacimiento else None,
            "Genero": user.Genero,
            "Direccion": user.Direccion,
            "Ciudad": user.Ciudad,
            "Estado_provincia": user.Estado_provincia,
            "Codigo_postal": user.Codigo_postal,
            "Pais": user.Pais,
            "Tipo_direccion": user.Tipo_direccion
        })
    else:
        response["Rol"] = user.Rol

    return jsonify({
        "message": f"Inicio de sesión exitoso como {user_type}.",
        "user": response
    }), 200

# =====================================
# MOSTRAR TODOS LOS CLIENTES
# =====================================
@app.route("/users", methods=["GET"])
def get_all_users():
    try:
        users = User.query.all()

        if not users:
            return jsonify({"message": "No hay usuarios registrados"}), 404

        user_list = [{
            "id": u.id,
            "Nombre": u.Nombre,
            "Apellido": u.Apellido,
            "Email": u.Email,
            "Foto": u.Foto_perfil,
            "Telefono": u.Telefono,
            "Fecha_Nacimiento": u.Fecha_nacimiento,
            "Genero": u.Genero,
            "Direccion": u.Direccion,
            "Ciudad": u.Ciudad,
            "Estado": u.Estado_provincia,
            "CP": u.Codigo_postal,
            "Pais": u.Pais,
            "Tipo de Direccion": u.Tipo_direccion,
            "Fecha_creacion": u.Fecha_creacion,
            "Fecha_actualizacion":u.Fecha_actualizacion,
            "Activo": u.Activo
        } for u in users]

        return jsonify({"users": user_list}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Error al consultar la base de datos", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "Error interno del servidor", "details": str(e)}), 500


# =====================================
# ELIMINAR USUARIO
# =====================================
@app.route("/DeleteUser", methods=["DELETE"])
def delete_user():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No se enviaron datos"}), 400

        id = data.get("id")
        Nombre = data.get("Nombre")
        Email = data.get("Email")
        if not id or not Email:
            return jsonify({
                "error": "Faltan campos obligatorios",
                "detalles": "Se requiere 'id' y 'Email'"
            }), 400
        user = User.query.filter_by(id=id, Email=Email).first()
        if not user:
            return jsonify({
                "error": "Usuario no encontrado",
                "detalles": f"No existe usuario con ID={id} y Email='{Email}'"
            }), 404
        if Nombre and user.Nombre != Nombre:
            return jsonify({
                "error": "Nombre no coincide",
                "detalles": f"El nombre '{Nombre}' no corresponde al usuario con Email '{Email}'"
            }), 400
        db.session.delete(user)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": f"Usuario '{user.Nombre}' eliminado correctamente",
            "user": {
                "id": user.id,
                "Nombre": user.Nombre,
                "Email": user.Email
            }
        }), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Error en la base de datos",
            "detalles": str(e.__dict__.get('orig', e))
        }), 500

    except Exception as e:
        return jsonify({
            "error": "Error interno del servidor",
            "detalles": str(e)
        }), 500
# ====================================
# UPDATE USUARIOS (CLIENTES)
# ====================================
@app.route("/UpdateUser", methods=["PUT"])
def update_user():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No se enviaron datos"}), 400

        # Obtener campos enviados
        id = data.get("id")
        Nombre = data.get("Nombre")
        Apellido = data.get("Apellido")
        Email = data.get("Email")
        Password = data.get("Password")
        Telefono = data.get("Telefono")
        Genero = data.get("Genero")
        Direccion = data.get("Direccion")
        Ciudad = data.get("Ciudad")
        Estado_provincia = data.get("Estado_provincia")
        Codigo_postal = data.get("Codigo_postal")
        Pais = data.get("Pais")
        Tipo_direccion = data.get("Tipo_direccion")

        # Validación básica
        if not id:
            return jsonify({
                "error": "Faltan campos obligatorios",
                "detalles": "Se requiere 'id'"
            }), 400

        # Buscar usuario en la base de datos
        user = User.query.filter_by(id=id).first()
        if not user:
            return jsonify({
                "error": "Usuario no encontrado",
                "detalles": f"No existe usuario con ID={id}"
            }), 404

        # Actualizar solo los campos enviados
        if Nombre: user.Nombre = Nombre
        if Apellido: user.Apellido = Apellido
        if Email: user.Email = Email

        #  Encriptar contraseña si fue enviada
        if Password:
            hashed_password = bcrypt.generate_password_hash(Password).decode('utf-8')
            user.Password = hashed_password

        if Telefono: user.Telefono = Telefono
        if Genero: user.Genero = Genero
        if Direccion: user.Direccion = Direccion
        if Ciudad: user.Ciudad = Ciudad
        if Estado_provincia: user.Estado_provincia = Estado_provincia
        if Codigo_postal: user.Codigo_postal = Codigo_postal
        if Pais: user.Pais = Pais
        if Tipo_direccion: user.Tipo_direccion = Tipo_direccion

        # Guardar cambios en la base de datos
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": f"Usuario '{user.Nombre}' actualizado correctamente",
            "user": {
                "id": user.id,
                "Nombre": user.Nombre,
                "Apellido": user.Apellido,
                "Email": user.Email,
                "Telefono": user.Telefono,
                "Genero": user.Genero,
                "Direccion": user.Direccion,
                "Ciudad": user.Ciudad,
                "Estado_provincia": user.Estado_provincia,
                "Codigo_postal": user.Codigo_postal,
                "Pais": user.Pais,
                "Tipo_direccion": user.Tipo_direccion
            }
        }), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Error en la base de datos",
            "detalles": str(e.__dict__.get('orig', e))
        }), 500

    except Exception as e:
        return jsonify({
            "error": "Error interno del servidor",
            "detalles": str(e)
        }), 500


# ====================================
# CONTAR USUARIOS REGISTRADOS
# ====================================
@app.route("/UserCount", methods=["GET"])
def user_count():
    try:
        total_users = User.query.count()

        return jsonify({
            "status": "success",
            "total_usuarios": total_users
        }), 200

    except SQLAlchemyError as e:
        return jsonify({
            "error": "Error en la base de datos",
            "detalles": str(e.__dict__.get('orig', e))
        }), 500

    except Exception as e:
        return jsonify({
            "error": "Error interno del servidor",
            "detalles": str(e)
        }), 500
# =====================================
# Update password Administrador
# =====================================
@app.route("/UpdatePasswordAdmin", methods=["PUT"])
def update_password_admin():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No se enviaron datos"}), 400
        
        Admin_id = data.get("id")
        current_password = data.get("Password")
        new_password = data.get("NewPassword")

        # Validación de campos requeridos
        if not Admin_id or not current_password or not new_password:
            return jsonify({
                "error": "Faltan campos obligatorios",
                "detalles": "Se requiere 'id', 'Password' y 'NewPassword'"
            }), 400

        # Buscar administrador por ID
        admin = Admin.query.filter_by(id=Admin_id).first()
        if not admin:
            return jsonify({
                "error": "Administrador no encontrado",
                "detalles": f"No existe usuario con ID={Admin_id}"
            }), 404

        # Verificar contraseña actual
        if not bcrypt.check_password_hash(admin.Password, current_password):
            return jsonify({"error": "Contraseña actual incorrecta"}), 401

        # Evitar que la nueva contraseña sea igual a la anterior
        if bcrypt.check_password_hash(admin.Password, new_password):
            return jsonify({"error": "La nueva contraseña no puede ser igual a la actual"}), 400

        # Actualizar contraseña con hashing seguro
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        admin.Password = hashed_password

        # Guardar cambios
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": f"Contraseña del administrador '{admin.Nombre}' actualizada correctamente"
        }), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Error en la base de datos",
            "detalles": str(e.__dict__.get('orig', e))
        }), 500
    except Exception as e:
        return jsonify({
            "error": "Error interno del servidor",
            "detalles": str(e)
        }), 500

# =====================================
# LOGOUT
# =====================================
@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Sesión cerrada correctamente"}), 200

# =====================================
# EJECUCIÓN
# =====================================
if __name__ == "__main__":
    app.run(debug=True)
