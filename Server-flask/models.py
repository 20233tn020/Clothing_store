from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4  # <= sirve para generar identificadores únicos universales (UUID) que se usan como IDs en bases de datos y APIs.

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex #  <= uuid4() genera un ID único aleatorio
    # algo como: 5b7c3a8d-2e1f-4a9b-8c7d-6e5f4a3b2c1d


# Aqui  DEFINIREMOS LA BASE DE DATOS las tablas  : ) 
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

    # Dirección (OPCIONAL - mostrará NULL)
    Direccion = db.Column(db.String(150), nullable=True, default=None)
    Ciudad = db.Column(db.String(100), nullable=True, default=None)
    Estado_provincia = db.Column(db.String(100), nullable=True, default=None)
    Codigo_postal = db.Column(db.String(10), nullable=True, default=None)
    Pais = db.Column(db.String(100), nullable=True, default=None)
    Tipo_direccion = db.Column(db.String(50), nullable=True, default=None)

    # Campos de auditoría
    Fecha_creacion = db.Column(db.DateTime, default=db.func.now())
    Fecha_actualizacion = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())
    Activo = db.Column(db.Boolean, default=True)

class Admin(db.Model):
    __tablename__ = "Admins"
    id = db.Column(db.String(36), primary_key=True, default=get_uuid)
    Nombre = db.Column(db.String(30), nullable=False)
    Email = db.Column(db.String(40), nullable=False)
    Password = db.Column(db.String(255), nullable=False)
    Rol = db.Column(db.String(10), nullable=False)
    Fecha_creacion = db.Column(db.DateTime, default=db.func.now())


