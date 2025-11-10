from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4  # <= sirve para generar identificadores únicos universales (UUID) que se usan como IDs en bases de datos y APIs.

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex #  <= uuid4() genera un ID único aleatorio
    # algo como: 5b7c3a8d-2e1f-4a9b-8c7d-6e5f4a3b2c1d


# Aqui  DEFINIREMOS LA BASE DE DATOS las tablas  : ) 

# ===========================
# TABLA DE USUARIOS
# ===========================

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(36), primary_key=True, default=get_uuid)  

    # Información personal (OBLIGATORIO para registro)
    Nombre = db.Column(db.String(50), nullable=False)
    Apellido = db.Column(db.String(100), nullable=False)
    Email = db.Column(db.String(150), unique=True, nullable=False)
    Password = db.Column(db.String(255), nullable=False)

    #  FOTO DE PERFIL (guarda la ruta/URL)
    Foto_perfil = db.Column(db.String(255), nullable=True, default=None)

    # Información de contacto (OPCIONAL - mostrará NULL)
    Telefono = db.Column(db.String(20), nullable=True, default=None)
    Fecha_nacimiento = db.Column(db.Date, nullable=True, default=None)
    Genero = db.Column(db.String(10), nullable=True, default=None)

    # Campos de auditoría
    Fecha_creacion = db.Column(db.DateTime, default=db.func.now())
    Fecha_actualizacion = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())
    Activo = db.Column(db.String(15), nullable=False, default='Activo')

    # Compras   # Relaciones #Direcciones 
    Direcciones = db.relationship("Address", backref="user", lazy=True)
    Carrito = db.relationship("Cart", backref="user", lazy=True)
    Favoritos = db.relationship("Favorite", backref="user", lazy=True)
    Ordenes = db.relationship("Order", backref="user", lazy=True)

# ===========================
# TABLA DE Direcciones 
# ===========================

class Address(db.Model):
    __tablename__ = "addresses"
    id = db.Column(db.String(36), primary_key=True, default=get_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    direccion = db.Column(db.String(150), nullable=False)
    ciudad = db.Column(db.String(100))
    estado_provincia = db.Column(db.String(100))
    codigo_postal = db.Column(db.String(10))
    pais = db.Column(db.String(100))
    tipo_direccion = db.Column(db.String(50))
    principal = db.Column(db.Boolean, default=False)

# ===========================
# TABLA DE FAVORITOS
# ===========================
class Favorite(db.Model):
    __tablename__ = "favorites"
    id = db.Column(db.String(36), primary_key=True, default=get_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    product_id = db.Column(db.String(36), db.ForeignKey("products.id"), nullable=False)
    agregado_en = db.Column(db.DateTime, default=db.func.now())

# ===========================
# TABLA DE CARRITO
# ===========================
class Cart(db.Model):
    __tablename__ = "cart"
    id = db.Column(db.String(36), primary_key=True, default=get_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    creado_en = db.Column(db.DateTime, default=db.func.now())
    actualizado_en = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())
    items = db.relationship("CartItem", backref="carrito", lazy=True)

# ===========================
# TABLA DE ITEMS DEL CARRITO
# ===========================
class CartItem(db.Model):
    __tablename__ = "cart_items"
    id = db.Column(db.String(36), primary_key=True, default=get_uuid)
    cart_id = db.Column(db.String(36), db.ForeignKey("cart.id"), nullable=False)
    product_id = db.Column(db.String(36), db.ForeignKey("products.id"), nullable=False)
    cantidad = db.Column(db.Integer, nullable=False, default=1)
    subtotal = db.Column(db.Float, nullable=False)

# ===========================
# TABLA DE PRODUCTOS
# ===========================
class Product(db.Model):
    __tablename__ = "products"
    id = db.Column(db.String(36), primary_key=True, default=get_uuid)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    precio = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, default=0)
    imagen_url = db.Column(db.String(255))
    genero = db.Column(db.String(20), nullable=False)  # Ej: 'Hombre', 'Mujer', 'Unisex', 'Niños'
    categoria_id = db.Column(db.String(36), db.ForeignKey("categories.id"), nullable=False)

    # Campos de auditoría
    activo = db.Column(db.Boolean, default=True)
    creado_en = db.Column(db.DateTime, default=db.func.now())
    actualizado_en = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    categoria = db.relationship("Category", backref="productos")

# ===========================
# TABLA DE CATEGORIA
# ===========================
class Category(db.Model):
    __tablename__ = "categories"
    id = db.Column(db.String(36), primary_key=True, default=get_uuid)
    nombre = db.Column(db.String(100), nullable=False, unique=True)  # Ej. "Camisas", "Jeans", "Zapatos"
    descripcion = db.Column(db.String(255))

# ===========================
# TABLAS DE PEDIDOS
# ===========================
class Order(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.String(36), primary_key=True, default=get_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    total = db.Column(db.Float, nullable=False)
    estado = db.Column(db.String(50), default="Pendiente")
    metodo_pago = db.Column(db.String(50))
    creado_en = db.Column(db.DateTime, default=db.func.now())
    detalles = db.relationship("OrderDetail", backref="orden", lazy=True)

# ==========================
# TABLA DE PEDIDO DETALLES
# ==========================

class OrderDetail(db.Model):
    __tablename__ = "order_details"
    id = db.Column(db.String(36), primary_key=True, default=get_uuid)
    order_id = db.Column(db.String(36), db.ForeignKey("orders.id"), nullable=False)
    product_id = db.Column(db.String(36), db.ForeignKey("products.id"), nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    precio_unitario = db.Column(db.Float, nullable=False)
    subtotal = db.Column(db.Float, nullable=False)


class Admin(db.Model):
    __tablename__ = "Admins"
    id = db.Column(db.String(36), primary_key=True, default=get_uuid)
    Nombre = db.Column(db.String(30), nullable=False)
    Email = db.Column(db.String(40), nullable=False)
    Password = db.Column(db.String(255), nullable=False)
    Rol = db.Column(db.String(10), nullable=False)
    Fecha_creacion = db.Column(db.DateTime, default=db.func.now())


