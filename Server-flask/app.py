from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from flask_mail import Mail, Message
from models import db, User, Admin,Address,Product,Category,Favorite,Cart,CartItem,Order,OrderDetail
from sqlalchemy.exc import SQLAlchemyError
import mysql.connector
from mysql.connector import Error
from datetime import datetime

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
# AGREGAR PRODUCTO A FAVORITOS
# =====================================
@app.route("/favorites/add", methods=["POST"])
def add_to_favorites():
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        if not data or 'user_id' not in data or 'product_id' not in data:
            return jsonify({
                "status": "error",
                "message": "Se requieren user_id y product_id"
            }), 400
        
        user_id = data['user_id']
        product_id = data['product_id']
        
        # Verificar si el usuario existe
        user = User.query.get(user_id)
        if not user:
            return jsonify({
                "status": "error",
                "message": "Usuario no encontrado"
            }), 404
        
        # Verificar si el producto existe y está activo
        product = Product.query.get(product_id)
        if not product:
            return jsonify({
                "status": "error",
                "message": "Producto no encontrado"
            }), 404
        
        if not product.activo:
            return jsonify({
                "status": "error",
                "message": "El producto no está disponible"
            }), 400
        
        # Verificar si ya está en favoritos
        existing_favorite = Favorite.query.filter_by(
            user_id=user_id, 
            product_id=product_id
        ).first()
        
        if existing_favorite:
            return jsonify({
                "status": "error",
                "message": "El producto ya está en tus favoritos"
            }), 400
        
        # Crear nuevo favorito
        new_favorite = Favorite(
            user_id=user_id,
            product_id=product_id,
            agregado_en=datetime.utcnow()
        )
        
        db.session.add(new_favorite)
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Producto agregado a favoritos",
            "data": {
                "favorite_id": new_favorite.id,
                "user_id": user_id,
                "product_id": product_id,
                "agregado_en": new_favorite.agregado_en.isoformat(),
                "producto": {
                    "nombre": product.nombre,
                    "precio": float(product.precio),
                    "imagen_url": product.imagen_url
                }
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": f"Error al agregar a favoritos: {str(e)}"
        }), 500
# =====================================
# ELIMINAR PRODUCTO DE FAVORITOS
# =====================================
@app.route("/favorites/remove", methods=["DELETE"])
def remove_from_favorites():
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        if not data or 'user_id' not in data or 'product_id' not in data:
            return jsonify({
                "status": "error",
                "message": "Se requieren user_id y product_id"
            }), 400
        
        user_id = data['user_id']
        product_id = data['product_id']
        
        # Buscar el favorito
        favorite = Favorite.query.filter_by(
            user_id=user_id, 
            product_id=product_id
        ).first()
        
        if not favorite:
            return jsonify({
                "status": "error",
                "message": "El producto no está en tus favoritos"
            }), 404
        
        # Eliminar el favorito
        db.session.delete(favorite)
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Producto eliminado de favoritos",
            "data": {
                "user_id": user_id,
                "product_id": product_id
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": f"Error al eliminar de favoritos: {str(e)}"
        }), 500
# =====================================
# OBTENER TODOS LOS FAVORITOS DE UN USUARIO 
# =====================================
@app.route("/favorites/<user_id>", methods=["GET"])
def get_user_favorites(user_id):
    try:
        # Verificar si el usuario existe
        user = User.query.get(user_id)
        if not user:
            return jsonify({
                "status": "error",
                "message": "Usuario no encontrado"
            }), 404

        # Obtener todos los favoritos del usuario con información completa del producto
        favorites = Favorite.query.filter_by(user_id=user_id).all()
        
        favorites_list = []
        for favorite in favorites:
            product = Product.query.get(favorite.product_id)
            if product:  # Solo si el producto existe
                product_data = {
                    "id": product.id,
                    "nombre": product.nombre,
                    "descripcion": product.descripcion,
                    "precio": float(product.precio),
                    "stock": product.stock,
                    "imagen_url": product.imagen_url,
                    "genero": product.genero,
                    "categoria_id": product.categoria_id,
                    "activo": product.activo
                }
                
                # Agregar categoría nombre si existe
                if product.categoria:
                    product_data["categoria_nombre"] = product.categoria.nombre
                
                # Agregar fechas si existen
                if product.creado_en:
                    product_data["creado_en"] = product.creado_en.isoformat()
                
                favorites_list.append({
                    "favorite_id": favorite.id,
                    "agregado_en": favorite.agregado_en.isoformat() if favorite.agregado_en else None,
                    "producto": product_data
                })
        
        return jsonify({
            "status": "success",
            "data": favorites_list,
            "total": len(favorites_list),
            "user_info": {
                "user_id": user.id,
                "nombre": f"{user.Nombre} {user.Apellido}",
                "email": user.Email
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error al obtener favoritos: {str(e)}"
        }), 500
# =====================================
# VERIFICAR SI UN PRODUCTO ESTÁ EN FAVORITOS 
# =====================================
@app.route("/favorites/check", methods=["POST"])
def check_favorite():
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        if not data or 'user_id' not in data or 'product_id' not in data:
            return jsonify({
                "status": "error",
                "message": "Se requieren user_id y product_id"
            }), 400
        
        user_id = data['user_id']
        product_id = data['product_id']
        
        # Verificar si el usuario existe
        user = User.query.get(user_id)
        if not user:
            return jsonify({
                "status": "error",
                "message": "Usuario no encontrado"
            }), 404
        
        # Verificar si el producto existe
        product = Product.query.get(product_id)
        if not product:
            return jsonify({
                "status": "error",
                "message": "Producto no encontrado"
            }), 404
        
        # Verificar si existe en favoritos
        favorite = Favorite.query.filter_by(
            user_id=user_id, 
            product_id=product_id
        ).first()
        
        is_favorite = favorite is not None
        
        response_data = {
            "is_favorite": is_favorite
        }
        
        # Solo agregar estos campos si existe el favorito
        if favorite:
            response_data.update({
                "favorite_id": favorite.id,
                "agregado_en": favorite.agregado_en.isoformat() if favorite.agregado_en else None
            })
        
        return jsonify({
            "status": "success",
            "data": response_data
        }), 200
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error al verificar favorito: {str(e)}"
        }), 500

# =====================================
# CONTAR FAVORITOS DE UN USUARIO
# =====================================
@app.route("/favorites/<user_id>/count", methods=["GET"])
def count_user_favorites(user_id):
    try:
        # Verificar si el usuario existe
        user = User.query.get(user_id)
        if not user:
            return jsonify({
                "status": "error",
                "message": "Usuario no encontrado"
            }), 404
        
        # Contar favoritos del usuario
        favorites_count = Favorite.query.filter_by(user_id=user_id).count()
        
        return jsonify({
            "status": "success",
            "data": {
                "user_id": user_id,
                "total_favorites": favorites_count,
                "user_info": {
                    "nombre": f"{user.Nombre} {user.Apellido}",
                    "email": user.Email
                }
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error al contar favoritos: {str(e)}"
        }), 500





# =====================================
# AGREGAR PRODUCTO AL CARRITO
# =====================================
@app.route("/cart/add", methods=["POST"])
def add_to_cart():
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        if not data or 'user_id' not in data or 'product_id' not in data:
            return jsonify({
                "status": "error",
                "message": "Se requieren user_id y product_id"
            }), 400
        
        user_id = data['user_id']
        product_id = data['product_id']
        cantidad = data.get('cantidad', 1)  # Default 1 si no se especifica
        
        # Verificar si el usuario existe
        user = User.query.get(user_id)
        if not user:
            return jsonify({
                "status": "error",
                "message": "Usuario no encontrado"
            }), 404
        
        # Verificar si el producto existe y está activo
        product = Product.query.get(product_id)
        if not product:
            return jsonify({
                "status": "error",
                "message": "Producto no encontrado"
            }), 404
        
        if not product.activo:
            return jsonify({
                "status": "error",
                "message": "El producto no está disponible"
            }), 400
        
        # Verificar stock disponible
        if product.stock < cantidad:
            return jsonify({
                "status": "error",
                "message": f"Stock insuficiente. Solo quedan {product.stock} unidades"
            }), 400
        
        # Buscar o crear carrito para el usuario
        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            cart = Cart(user_id=user_id)
            db.session.add(cart)
            db.session.commit()
        
        # Verificar si el producto ya está en el carrito
        cart_item = CartItem.query.filter_by(
            cart_id=cart.id, 
            product_id=product_id
        ).first()
        
        if cart_item:
            # Actualizar cantidad si ya existe
            nueva_cantidad = cart_item.cantidad + cantidad
            
            # Verificar stock nuevamente
            if product.stock < nueva_cantidad:
                return jsonify({
                    "status": "error",
                    "message": f"Stock insuficiente. Máximo disponible: {product.stock} unidades"
                }), 400
            
            cart_item.cantidad = nueva_cantidad
            cart_item.subtotal = nueva_cantidad * product.precio
        else:
            # Crear nuevo item en el carrito
            subtotal = cantidad * product.precio
            cart_item = CartItem(
                cart_id=cart.id,
                product_id=product_id,
                cantidad=cantidad,
                subtotal=subtotal
            )
            db.session.add(cart_item)
        
        # Actualizar timestamp del carrito
        cart.actualizado_en = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Producto agregado al carrito",
            "data": {
                "cart_id": cart.id,
                "item_id": cart_item.id,
                "product_id": product_id,
                "cantidad": cart_item.cantidad,
                "precio_unitario": float(product.precio),
                "subtotal": float(cart_item.subtotal),
                "producto": {
                    "nombre": product.nombre,
                    "imagen_url": product.imagen_url
                }
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": f"Error al agregar al carrito: {str(e)}"
        }), 500

# =====================================
# OBTENER CARRITO DE USUARIO
# =====================================
@app.route("/cart/<user_id>", methods=["GET"])
def get_cart(user_id):
    try:
        # Verificar si el usuario existe
        user = User.query.get(user_id)
        if not user:
            return jsonify({
                "status": "error",
                "message": "Usuario no encontrado"
            }), 404

        # Buscar carrito del usuario
        cart = Cart.query.filter_by(user_id=user_id).first()
        
        if not cart:
            return jsonify({
                "status": "success",
                "data": {
                    "cart_id": None,
                    "items": [],
                    "total_items": 0,
                    "total_precio": 0.0,
                    "usuario": {
                        "user_id": user_id,
                        "nombre": f"{user.Nombre} {user.Apellido}"
                    }
                }
            }), 200
        
        # Obtener items del carrito con información completa
        cart_items = []
        total_precio = 0.0
        total_items = 0
        
        for item in cart.items:
            product = Product.query.get(item.product_id)
            if product and product.activo:  # Solo productos activos
                item_data = {
                    "item_id": item.id,
                    "product_id": product.id,
                    "nombre": product.nombre,
                    "descripcion": product.descripcion,
                    "precio_unitario": float(product.precio),
                    "cantidad": item.cantidad,
                    "subtotal": float(item.subtotal),
                    "imagen_url": product.imagen_url,
                    "stock_disponible": product.stock,
                    "categoria": product.categoria.nombre if product.categoria else None
                }
                cart_items.append(item_data)
                total_precio += item.subtotal
                total_items += item.cantidad
        
        return jsonify({
            "status": "success",
            "data": {
                "cart_id": cart.id,
                "items": cart_items,
                "total_items": total_items,
                "total_precio": float(total_precio),
                "usuario": {
                    "user_id": user_id,
                    "nombre": f"{user.Nombre} {user.Apellido}",
                    "email": user.Email
                },
                "fechas": {
                    "creado_en": cart.creado_en.isoformat() if cart.creado_en else None,
                    "actualizado_en": cart.actualizado_en.isoformat() if cart.actualizado_en else None
                }
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error al obtener carrito: {str(e)}"
        }), 500

# =====================================
# ACTUALIZAR CANTIDAD EN CARRITO
# =====================================
@app.route("/cart/update", methods=["PUT"])
def update_cart_item():
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        if not data or 'item_id' not in data or 'cantidad' not in data:
            return jsonify({
                "status": "error",
                "message": "Se requieren item_id y cantidad"
            }), 400
        
        item_id = data['item_id']
        nueva_cantidad = data['cantidad']
        
        # Validar cantidad
        if nueva_cantidad < 0:
            return jsonify({
                "status": "error",
                "message": "La cantidad no puede ser negativa"
            }), 400
        
        if nueva_cantidad == 0:
            # Si cantidad es 0, eliminar el item
            return remove_from_cart()
        
        # Buscar el item del carrito
        cart_item = CartItem.query.get(item_id)
        if not cart_item:
            return jsonify({
                "status": "error",
                "message": "Item del carrito no encontrado"
            }), 404
        
        # Verificar producto y stock
        product = Product.query.get(cart_item.product_id)
        if not product:
            return jsonify({
                "status": "error",
                "message": "Producto no encontrado"
            }), 404
        
        if not product.activo:
            return jsonify({
                "status": "error",
                "message": "El producto ya no está disponible"
            }), 400
        
        if product.stock < nueva_cantidad:
            return jsonify({
                "status": "error",
                "message": f"Stock insuficiente. Solo quedan {product.stock} unidades"
            }), 400
        
        # Actualizar cantidad y subtotal
        cart_item.cantidad = nueva_cantidad
        cart_item.subtotal = nueva_cantidad * product.precio
        
        # Actualizar timestamp del carrito
        cart = Cart.query.get(cart_item.cart_id)
        if cart:
            cart.actualizado_en = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Carrito actualizado",
            "data": {
                "item_id": cart_item.id,
                "product_id": cart_item.product_id,
                "cantidad": cart_item.cantidad,
                "precio_unitario": float(product.precio),
                "subtotal": float(cart_item.subtotal),
                "producto": {
                    "nombre": product.nombre,
                    "stock_disponible": product.stock
                }
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": f"Error al actualizar carrito: {str(e)}"
        }), 500

# =====================================
# ELIMINAR PRODUCTO DEL CARRITO
# =====================================
@app.route("/cart/remove", methods=["DELETE"])
def remove_from_cart():
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        if not data or 'item_id' not in data:
            return jsonify({
                "status": "error",
                "message": "Se requiere item_id"
            }), 400
        
        item_id = data['item_id']
        
        # Buscar el item del carrito
        cart_item = CartItem.query.get(item_id)
        if not cart_item:
            return jsonify({
                "status": "error",
                "message": "Item del carrito no encontrado"
            }), 404
        
        # Guardar info para la respuesta
        product_info = {
            "product_id": cart_item.product_id,
            "item_id": cart_item.id
        }
        
        # Eliminar el item
        db.session.delete(cart_item)
        
        # Actualizar timestamp del carrito
        cart = Cart.query.get(cart_item.cart_id)
        if cart:
            cart.actualizado_en = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Producto eliminado del carrito",
            "data": product_info
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": f"Error al eliminar del carrito: {str(e)}"
        }), 500

# =====================================
# VACIAR CARRITO COMPLETO
# =====================================
@app.route("/cart/<user_id>/clear", methods=["DELETE"])
def clear_cart(user_id):
    try:
        # Verificar si el usuario existe
        user = User.query.get(user_id)
        if not user:
            return jsonify({
                "status": "error",
                "message": "Usuario no encontrado"
            }), 404
        
        # Buscar carrito del usuario
        cart = Cart.query.filter_by(user_id=user_id).first()
        
        if not cart or not cart.items:
            return jsonify({
                "status": "success",
                "message": "El carrito ya está vacío",
                "data": {
                    "user_id": user_id,
                    "items_eliminados": 0
                }
            }), 200
        
        # Contar items a eliminar
        items_count = len(cart.items)
        
        # Eliminar todos los items
        for item in cart.items:
            db.session.delete(item)
        
        # Actualizar timestamp del carrito
        cart.actualizado_en = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": f"Carrito vaciado correctamente",
            "data": {
                "user_id": user_id,
                "items_eliminados": items_count,
                "cart_id": cart.id
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": f"Error al vaciar carrito: {str(e)}"
        }), 500

# =====================================
# CONTAR ITEMS EN CARRITO
# =====================================
@app.route("/cart/<user_id>/count", methods=["GET"])
def count_cart_items(user_id):
    try:
        # Verificar si el usuario existe
        user = User.query.get(user_id)
        if not user:
            return jsonify({
                "status": "error",
                "message": "Usuario no encontrado"
            }), 404
        
        # Buscar carrito del usuario
        cart = Cart.query.filter_by(user_id=user_id).first()
        
        total_items = 0
        total_precio = 0.0
        
        if cart and cart.items:
            for item in cart.items:
                total_items += item.cantidad
                total_precio += item.subtotal
        
        return jsonify({
            "status": "success",
            "data": {
                "user_id": user_id,
                "total_items": total_items,
                "total_precio": float(total_precio),
                "usuario": {
                    "nombre": f"{user.Nombre} {user.Apellido}",
                    "email": user.Email
                }
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error al contar items del carrito: {str(e)}"
        }), 500

# =====================================
# VERIFICAR STOCK DE ITEMS EN CARRITO
# =====================================
@app.route("/cart/<user_id>/check-stock", methods=["GET"])
def check_cart_stock(user_id):
    try:
        # Verificar si el usuario existe
        user = User.query.get(user_id)
        if not user:
            return jsonify({
                "status": "error",
                "message": "Usuario no encontrado"
            }), 404
        
        # Buscar carrito del usuario
        cart = Cart.query.filter_by(user_id=user_id).first()
        
        if not cart or not cart.items:
            return jsonify({
                "status": "success",
                "message": "El carrito está vacío",
                "data": {
                    "user_id": user_id,
                    "stock_ok": True,
                    "items_sin_stock": []
                }
            }), 200
        
        # Verificar stock de cada item
        items_sin_stock = []
        
        for item in cart.items:
            product = Product.query.get(item.product_id)
            if product:
                stock_info = {
                    "item_id": item.id,
                    "product_id": product.id,
                    "nombre": product.nombre,
                    "cantidad_en_carrito": item.cantidad,
                    "stock_disponible": product.stock,
                    "suficiente": product.stock >= item.cantidad
                }
                
                if not stock_info["suficiente"]:
                    items_sin_stock.append(stock_info)
        
        return jsonify({
            "status": "success",
            "data": {
                "user_id": user_id,
                "stock_ok": len(items_sin_stock) == 0,
                "total_items_revisados": len(cart.items),
                "items_sin_stock": items_sin_stock,
                "resumen": {
                    "con_stock": len(cart.items) - len(items_sin_stock),
                    "sin_stock": len(items_sin_stock)
                }
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error al verificar stock: {str(e)}"
        }), 500



# =====================================
# CREAR NUEVA ORDEN
# =====================================
@app.route("/orders", methods=["POST"])
def create_order():
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        if not data or 'user_id' not in data or 'total' not in data:
            return jsonify({
                "status": "error",
                "message": "Se requieren user_id y total"
            }), 400
        
        user_id = data['user_id']
        total = data['total']
        metodo_pago = data.get('metodo_pago', 'credit_card')
        estado = data.get('estado', 'Pendiente')
        detalles = data.get('detalles', [])
        
        # Verificar si el usuario existe
        user = User.query.get(user_id)
        if not user:
            return jsonify({
                "status": "error",
                "message": "Usuario no encontrado"
            }), 404
        
        # Verificar que hay detalles de orden
        if not detalles:
            return jsonify({
                "status": "error",
                "message": "La orden debe contener productos"
            }), 400
        
        # Crear nueva orden
        nueva_orden = Order(
            user_id=user_id,
            total=total,
            estado=estado,
            metodo_pago=metodo_pago
        )
        
        db.session.add(nueva_orden)
        db.session.flush()  # Para obtener el ID sin hacer commit
        
        # Crear detalles de la orden
        for detalle in detalles:
            # Verificar que el producto existe
            producto = Product.query.get(detalle['product_id'])
            if not producto:
                return jsonify({
                    "status": "error",
                    "message": f"Producto con ID {detalle['product_id']} no encontrado"
                }), 404
            
            # Verificar stock
            if producto.stock < detalle['cantidad']:
                return jsonify({
                    "status": "error",
                    "message": f"Stock insuficiente para {producto.nombre}. Stock disponible: {producto.stock}"
                }), 400
            
            # Crear detalle de orden
            nuevo_detalle = OrderDetail(
                order_id=nueva_orden.id,
                product_id=detalle['product_id'],
                cantidad=detalle['cantidad'],
                precio_unitario=detalle['precio_unitario'],
                subtotal=detalle['subtotal']
            )
            
            db.session.add(nuevo_detalle)
            
            # Actualizar stock del producto
            producto.stock -= detalle['cantidad']
            producto.actualizado_en = datetime.utcnow()
        
        # Confirmar todos los cambios
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Orden creada exitosamente",
            "data": {
                "order_id": nueva_orden.id,
                "user_id": user_id,
                "total": total,
                "estado": estado,
                "metodo_pago": metodo_pago,
                "creado_en": nueva_orden.creado_en.isoformat(),
                "detalles_count": len(detalles)
            }
        }), 201
        
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": "Error en la base de datos",
            "details": str(e)
        }), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": "Error interno del servidor",
            "details": str(e)
        }), 500

# =====================================
# OBTENER ÓRDENES DE UN USUARIO
# =====================================
@app.route("/orders/user/<string:user_id>", methods=["GET"])
def get_user_orders(user_id):
    try:
        # Verificar si el usuario existe
        user = User.query.get(user_id)
        if not user:
            return jsonify({
                "status": "error",
                "message": "Usuario no encontrado"
            }), 404
        
        # Obtener órdenes del usuario
        orders = Order.query.filter_by(user_id=user_id).order_by(Order.creado_en.desc()).all()
        
        orders_list = []
        for order in orders:
            order_data = {
                "id": order.id,
                "total": float(order.total),
                "estado": order.estado,
                "metodo_pago": order.metodo_pago,
                "creado_en": order.creado_en.isoformat() if order.creado_en else None,
                "detalles": []
            }
            
            # Agregar detalles de la orden
            for detalle in order.detalles:
                producto = Product.query.get(detalle.product_id)
                order_data["detalles"].append({
                    "id": detalle.id,
                    "product_id": detalle.product_id,
                    "producto_nombre": producto.nombre if producto else "Producto no disponible",
                    "producto_imagen": producto.imagen_url if producto else None,
                    "cantidad": detalle.cantidad,
                    "precio_unitario": float(detalle.precio_unitario),
                    "subtotal": float(detalle.subtotal)
                })
            
            orders_list.append(order_data)
        
        return jsonify({
            "status": "success",
            "data": {
                "user": {
                    "id": user.id,
                    "nombre": f"{user.Nombre} {user.Apellido}",
                    "email": user.Email
                },
                "orders": orders_list,
                "total_orders": len(orders_list)
            }
        }), 200
        
    except SQLAlchemyError as e:
        return jsonify({
            "status": "error",
            "message": "Error en la base de datos",
            "details": str(e)
        }), 500
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Error interno del servidor",
            "details": str(e)
        }), 500

# =====================================
# OBTENER DETALLES DE UNA ORDEN ESPECÍFICA
# =====================================
@app.route("/orders/<string:order_id>", methods=["GET"])
def get_order_details(order_id):
    try:
        # Obtener la orden
        order = Order.query.get(order_id)
        if not order:
            return jsonify({
                "status": "error",
                "message": "Orden no encontrada"
            }), 404
        
        # Obtener información del usuario
        user = User.query.get(order.user_id)
        
        order_data = {
            "id": order.id,
            "user_info": {
                "id": user.id,
                "nombre": f"{user.Nombre} {user.Apellido}",
                "email": user.Email,
                "telefono": user.Telefono
            },
            "total": float(order.total),
            "estado": order.estado,
            "metodo_pago": order.metodo_pago,
            "creado_en": order.creado_en.isoformat() if order.creado_en else None,
            "detalles": []
        }
        
        # Agregar detalles de la orden
        for detalle in order.detalles:
            producto = Product.query.get(detalle.product_id)
            order_data["detalles"].append({
                "id": detalle.id,
                "product_id": detalle.product_id,
                "producto_nombre": producto.nombre if producto else "Producto no disponible",
                "producto_descripcion": producto.descripcion if producto else None,
                "producto_imagen": producto.imagen_url if producto else None,
                "cantidad": detalle.cantidad,
                "precio_unitario": float(detalle.precio_unitario),
                "subtotal": float(detalle.subtotal)
            })
        
        return jsonify({
            "status": "success",
            "data": order_data
        }), 200
        
    except SQLAlchemyError as e:
        return jsonify({
            "status": "error",
            "message": "Error en la base de datos",
            "details": str(e)
        }), 500
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Error interno del servidor",
            "details": str(e)
        }), 500

# =====================================
# ACTUALIZAR ESTADO DE UNA ORDEN
# =====================================
@app.route("/orders/<string:order_id>/status", methods=["PUT"])
def update_order_status(order_id):
    try:
        data = request.get_json()
        
        if not data or 'estado' not in data:
            return jsonify({
                "status": "error",
                "message": "Se requiere el campo 'estado'"
            }), 400
        
        nuevo_estado = data['estado']
        
        # Estados válidos
        estados_validos = ['Pendiente', 'Confirmado', 'En preparación', 'Enviado', 'Entregado', 'Cancelado']
        
        if nuevo_estado not in estados_validos:
            return jsonify({
                "status": "error",
                "message": f"Estado no válido. Estados permitidos: {', '.join(estados_validos)}"
            }), 400
        
        # Obtener y actualizar la orden
        order = Order.query.get(order_id)
        if not order:
            return jsonify({
                "status": "error",
                "message": "Orden no encontrada"
            }), 404
        
        order.estado = nuevo_estado
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": f"Estado de la orden actualizado a: {nuevo_estado}",
            "data": {
                "order_id": order.id,
                "nuevo_estado": nuevo_estado
            }
        }), 200
        
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": "Error en la base de datos",
            "details": str(e)
        }), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": "Error interno del servidor",
            "details": str(e)
        }), 500

# =====================================
# CANCELAR ORDEN
# =====================================
@app.route("/orders/<string:order_id>/cancel", methods=["PUT"])
def cancel_order(order_id):
    try:
        # Obtener la orden
        order = Order.query.get(order_id)
        if not order:
            return jsonify({
                "status": "error",
                "message": "Orden no encontrada"
            }), 404
        
        # Verificar si la orden puede ser cancelada
        if order.estado in ['Entregado', 'Cancelado']:
            return jsonify({
                "status": "error",
                "message": f"No se puede cancelar una orden en estado: {order.estado}"
            }), 400
        
        # Devolver productos al stock
        for detalle in order.detalles:
            producto = Product.query.get(detalle.product_id)
            if producto:
                producto.stock += detalle.cantidad
                producto.actualizado_en = datetime.utcnow()
        
        # Actualizar estado de la orden
        order.estado = 'Cancelado'
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Orden cancelada exitosamente",
            "data": {
                "order_id": order.id,
                "estado": "Cancelado"
            }
        }), 200
        
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": "Error en la base de datos",
            "details": str(e)
        }), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": "Error interno del servidor",
            "details": str(e)
        }), 500

# =====================================
# OBTENER TODAS LAS ÓRDENES (PARA ADMIN)
# =====================================
@app.route("/orders", methods=["GET"])
def get_all_orders():
    try:
        # Parámetros de paginación
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        estado = request.args.get('estado', None)
        
        # Consulta base
        query = Order.query
        
        # Filtrar por estado si se proporciona
        if estado:
            query = query.filter_by(estado=estado)
        
        # Ordenar por fecha de creación (más recientes primero)
        query = query.order_by(Order.creado_en.desc())
        
        # Paginación
        pagination = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        orders_list = []
        for order in pagination.items:
            user = User.query.get(order.user_id)
            orders_list.append({
                "id": order.id,
                "user_info": {
                    "id": user.id,
                    "nombre": f"{user.Nombre} {user.Apellido}",
                    "email": user.Email
                },
                "total": float(order.total),
                "estado": order.estado,
                "metodo_pago": order.metodo_pago,
                "creado_en": order.creado_en.isoformat() if order.creado_en else None,
                "detalles_count": len(order.detalles)
            })
        
        return jsonify({
            "status": "success",
            "data": {
                "orders": orders_list,
                "pagination": {
                    "page": page,
                    "per_page": per_page,
                    "total": pagination.total,
                    "pages": pagination.pages
                }
            }
        }), 200
        
    except SQLAlchemyError as e:
        return jsonify({
            "status": "error",
            "message": "Error en la base de datos",
            "details": str(e)
        }), 500
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Error interno del servidor",
            "details": str(e)
        }), 500

# =====================================
# EJECUCIÓN
# =====================================
if __name__ == "__main__":
    app.run(debug=True)
