from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from flask_mail import Mail, Message
from models import db, User, Admin,Address,Product,Category
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
            print(" Base de datos 'tienda_online' creada/verificada")
    except Error as e:
        print(f" Error creando base de datos: {e}")
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

@app.route("/Signup", methods=["POST"])
def signup():
    data = request.json
    try:
        Nombre = data.get("Nombre")
        Apellido = data.get("Apellido")
        Email = data.get("Email")
        Password = data.get("Password")

        if not all([Nombre, Apellido, Email, Password]):
            return jsonify({"error": "Faltan campos obligatorios"}), 400

        # ======== DATOS OPCIONALES ========
        Telefono = data.get("Telefono")
        Fecha_nacimiento = data.get("Fecha_nacimiento")
        Genero = data.get("Genero")

        # ======== DATOS DE DIRECCIÓN ========
        Direccion = data.get("Direccion")
        Ciudad = data.get("Ciudad")
        Estado_provincia = data.get("Estado_provincia")
        Codigo_postal = data.get("Codigo_postal")
        Pais = data.get("Pais")
        Tipo_direccion = data.get("Tipo_direccion", "Casa")

        # ======== VALIDAR EMAIL EXISTENTE ========
        if User.query.filter_by(Email=Email).first():
            return jsonify({"error": "El correo ya está registrado"}), 409

        # ======== HASH PASSWORD ========
        hashed_password = bcrypt.generate_password_hash(Password).decode('utf-8')

        # ======== CREAR USUARIO ========
        new_user = User(
            Nombre=Nombre,
            Apellido=Apellido,
            Email=Email,
            Password=hashed_password,
            Telefono=Telefono,
            Genero=Genero
        )

        # Convertir fecha si viene
        if Fecha_nacimiento:
            from datetime import datetime
            new_user.Fecha_nacimiento = datetime.strptime(Fecha_nacimiento, "%Y-%m-%d").date()

        db.session.add(new_user)
        db.session.commit()  # Comitea primero para obtener el ID

        # ======== CREAR DIRECCIÓN (si se envió) ========
        if Direccion:  # <== Evita error si viene vacía
            nueva_direccion = Address(
                user_id=new_user.id,
                direccion=Direccion,
                ciudad=Ciudad,
                estado_provincia=Estado_provincia,
                codigo_postal=Codigo_postal,
                pais=Pais,
                tipo_direccion=Tipo_direccion,
                principal=True
            )
            db.session.add(nueva_direccion)
            db.session.commit()
        else:
            print(" No se proporcionó dirección, se omite Address.")

        # ======== SESIÓN OPCIONAL ========
        session["user_id"] = new_user.id

        # ======== RESPUESTA ========
        return jsonify({
            "id": new_user.id,
            "nombre": new_user.Nombre,
            "apellido": new_user.Apellido,
            "email": new_user.Email,
            "direccion": Direccion,
            "ciudad": Ciudad,
            "estado": Estado_provincia,
            "pais": Pais
        }), 201

    except Exception as e:
        db.session.rollback()
        print(" Error en registro:", e)
        return jsonify({"error": "Error interno del servidor", "detalle": str(e)}), 500



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
        })
    else:
        response["Rol"] = user.Rol

    return jsonify({
        "message": f"Inicio de sesión exitoso como {user_type}.",
        "user": response
    }), 200


# =====================================
# MOSTRAR TODOS LOS CLIENTES CON SUS DIRECCIONES
# =====================================
@app.route("/users", methods=["GET"])
def get_all_users():
    try:
        users = User.query.all()

        if not users:
            return jsonify({"message": "No hay usuarios registrados"}), 404

        user_list = []
        for u in users:
            user_data = {
                "id": u.id,
                "Nombre": u.Nombre,
                "Apellido": u.Apellido,
                "Email": u.Email,
                "Foto": u.Foto_perfil,
                "Telefono": u.Telefono,
                "Fecha_Nacimiento": u.Fecha_nacimiento,
                "Genero": u.Genero,
                "Fecha_creacion": u.Fecha_creacion,
                "Fecha_actualizacion": u.Fecha_actualizacion,
                "Activo": u.Activo,
                "Direcciones": []  # Aquí guardaremos todas las direcciones del usuario
            }

            # Agregar direcciones (si existen)
            for d in u.Direcciones:
                user_data["Direcciones"].append({
                    "id": d.id,
                    "direccion": d.direccion,
                    "ciudad": d.ciudad,
                    "estado_provincia": d.estado_provincia,
                    "codigo_postal": d.codigo_postal,
                    "pais": d.pais,
                    "tipo_direccion": d.tipo_direccion,
                    "principal": d.principal
                })

            user_list.append(user_data)

        return jsonify({"users": user_list}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Error al consultar la base de datos",
            "details": str(e)
        }), 500
    except Exception as e:
        return jsonify({
            "error": "Error interno del servidor",
            "details": str(e)
        }), 500

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

        # Validar campos obligatorios
        if not id or not Email:
            return jsonify({
                "error": "Faltan campos obligatorios",
                "detalles": "Se requiere 'id' y 'Email'"
            }), 400

        # Buscar el usuario
        user = User.query.filter_by(id=id, Email=Email).first()
        if not user:
            return jsonify({
                "error": "Usuario no encontrado",
                "detalles": f"No existe usuario con ID={id} y Email='{Email}'"
            }), 404

        # Validar nombre (si se envió)
        if Nombre and user.Nombre != Nombre:
            return jsonify({
                "error": "Nombre no coincide",
                "detalles": f"El nombre '{Nombre}' no corresponde al usuario con Email '{Email}'"
            }), 400


        # Borrar todas las direcciones asociadas al usuario
        deleted_rows = Address.query.filter_by(user_id=id).delete()
        if deleted_rows > 0:
            print(f"Se eliminaron {deleted_rows} direcciones del usuario con ID {id}")

        # ELIMINAR EL USUARIO
        db.session.delete(user)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": f"Usuario '{user.Nombre}' y sus datos relacionados fueron eliminados correctamente",
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
        Activo = data.get("Activo")

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
        if Nombre is not None:
            user.Nombre = Nombre
        if Apellido is not None:
            user.Apellido = Apellido
        if Email is not None:
            user.Email = Email

        # Encriptar contraseña si fue enviada
        if Password:
            hashed_password = bcrypt.generate_password_hash(Password).decode('utf-8')
            user.Password = hashed_password

        if Telefono is not None:
            user.Telefono = Telefono
        if Genero is not None:
            user.Genero = Genero
        if Activo is not None:
            user.Activo = Activo

        # Guardar cambios
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
                "Activo": user.Activo
            }
        }), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Error en la base de datos",
            "detalles": str(e.__dict__.get('orig', e))
        }), 500

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Error interno del servidor",
            "detalles": str(e)
        }), 500


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
# OBTENER DIRECCIONES DE UN USUARIO
# =====================================
@app.route("/user/<string:user_id>/addresses", methods=["GET"])
def get_user_addresses(user_id):
    try:
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        addresses = Address.query.filter_by(user_id=user.id).all()
        if not addresses:
            return jsonify({"message": "El usuario no tiene direcciones registradas"}), 200

        address_list = [{
            "id": addr.id,
            "direccion": addr.direccion,
            "ciudad": addr.ciudad,
            "estado_provincia": addr.estado_provincia,
            "codigo_postal": addr.codigo_postal,
            "pais": addr.pais,
            "tipo_direccion": addr.tipo_direccion,
            "principal":addr.principal
        } for addr in addresses]

        return jsonify({
            "usuario": {
                "id": user.id,
                "Nombre": user.Nombre,
                "Email": user.Email
            },
            "direcciones": address_list
        }), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Error en la base de datos",
            "detalles": str(e.__dict__.get("orig", e))
        }), 500

    except Exception as e:
        return jsonify({
            "error": "Error interno del servidor",
            "detalles": str(e)
        }), 500


# =====================================
# AGREGAR NUEVA DIRECCIÓN
# =====================================
@app.route("/address", methods=["POST"])
def add_address():
    data = request.get_json()
    try:
        new_addr = Address(
            user_id=data["user_id"],
            direccion=data["direccion"],
            ciudad=data["ciudad"],
            estado_provincia=data["estado_provincia"],
            codigo_postal=data["codigo_postal"],
            pais=data["pais"],
            tipo_direccion=data["tipo_direccion"],
            principal=data.get("principal", False),
        )
        db.session.add(new_addr)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Dirección agregada correctamente",
            "address": {
                "id": new_addr.id,
                "direccion": new_addr.direccion,
                "ciudad": new_addr.ciudad,
                "estado_provincia": new_addr.estado_provincia,
                "codigo_postal": new_addr.codigo_postal,
                "pais": new_addr.pais,
                "tipo_direccion": new_addr.tipo_direccion,
                "principal": new_addr.principal
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# =====================================
# ESTABLECER COMO PRINCIPAL
# =====================================
@app.route("/address/<int:address_id>/set_default", methods=["PUT"])
def set_default_address(address_id):
    try:
        data = request.get_json()
        user_id = data.get("user_id")

        # quitar el estado principal de las demás direcciones
        Address.query.filter_by(user_id=user_id).update({"principal": False})

        # establecer la nueva dirección principal
        addr = Address.query.get(address_id)
        if not addr:
            return jsonify({"error": "Dirección no encontrada"}), 404
        addr.principal = True

        db.session.commit()
        return jsonify({"status": "success", "message": "Dirección principal actualizada"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# =====================================
# ELIMINAR DIRECCIÓN
# =====================================
@app.route("/address/<string:address_id>", methods=["DELETE"])
def delete_address(address_id):
    try:
        addr = Address.query.get(address_id)
        if not addr:
            return jsonify({"error": "Dirección no encontrada"}), 404

        db.session.delete(addr)
        db.session.commit()
        return jsonify({"status": "success", "message": "Dirección eliminada"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# =====================================
# ACTUALIZAR LAS CONTRASEÑAS DE LOS USUARIOS (CLIENTES)
# =====================================
# =====================================

@app.route("/UpdatePasswordUser", methods=['PUT'])
def UpdatePasswordUser():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No se enviaron datos"}), 400

        user_id = data.get("id")
        current_password = data.get("password")
        new_password = data.get("newPassword")

        if not user_id or not current_password or not new_password:
            return jsonify({
                "error": "Faltan campos obligatorios",
                "detalles": "Se requiere 'id', 'password' y 'newPassword'"
            }), 400

        # Buscar usuario por ID
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({
                "error": "Usuario no encontrado",
                "detalles": f"No existe usuario con ID={user_id}"
            }), 404

        # Verificar contraseña actual
        if not bcrypt.check_password_hash(user.Password, current_password):
            return jsonify({"error": "Contraseña actual incorrecta"}), 401

        # Evitar que la nueva contraseña sea igual a la anterior
        if bcrypt.check_password_hash(user.Password, new_password):
            return jsonify({"error": "La nueva contraseña no puede ser igual a la actual"}), 400

        # Actualizar contraseña
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        user.Password = hashed_password
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": f"Contraseña de '{user.Nombre}' actualizada correctamente"
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
# OBTENER TODOS LOS PRODUCTOS
# =====================================
@app.route("/products", methods=["GET"])
def get_all_products():
    try:
        products = Product.query.all()
        products_list = []
        
        for product in products:
            products_list.append({
                "id": product.id,
                "nombre": product.nombre,
                "descripcion": product.descripcion,
                "precio": float(product.precio),
                "stock": product.stock,
                "imagen_url": product.imagen_url,
                "genero": product.genero,
                "categoria_id": product.categoria_id,
                "categoria_nombre": product.categoria.nombre if product.categoria else None,
                "activo": product.activo,
                "creado_en": product.creado_en.isoformat() if product.creado_en else None,
                "actualizado_en": product.actualizado_en.isoformat() if product.actualizado_en else None
            })
        
        return jsonify({
            "status": "success",
            "data": products_list,
            "total": len(products_list)
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# =====================================
# OBTENER TODAS LAS CATEGORÍAS
# =====================================
@app.route("/categories", methods=["GET"])
def get_all_categories():
    try:
        categories = Category.query.all()
        categories_list = []
        
        for category in categories:
            categories_list.append({
                "id": category.id,
                "nombre": category.nombre,
                "descripcion": category.descripcion,
                "total_productos": len(category.productos) if category.productos else 0
            })
        
        return jsonify({
            "status": "success",
            "data": categories_list,
            "total": len(categories_list)
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =====================================
# EJECUCIÓN
# =====================================
if __name__ == "__main__":
    app.run(debug=True)
