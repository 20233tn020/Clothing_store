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
    nombre = db.Column(db.String(50), nullable=False)
    apellido = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    #  FOTO DE PERFIL (guarda la ruta/URL)
    foto_perfil = db.Column(db.String(255), nullable=True, default=None)

    # Información de contacto (OPCIONAL - mostrará NULL)
    telefono = db.Column(db.String(20), nullable=True, default=None)
    fecha_nacimiento = db.Column(db.Date, nullable=True, default=None)
    genero = db.Column(db.String(10), nullable=True, default=None)

    # Dirección (OPCIONAL - mostrará NULL)
    direccion = db.Column(db.String(150), nullable=True, default=None)
    ciudad = db.Column(db.String(100), nullable=True, default=None)
    estado_provincia = db.Column(db.String(100), nullable=True, default=None)
    codigo_postal = db.Column(db.String(10), nullable=True, default=None)
    pais = db.Column(db.String(100), nullable=True, default=None)
    tipo_direccion = db.Column(db.String(50), nullable=True, default=None)

    # Campos de auditoría
    fecha_creacion = db.Column(db.DateTime, default=db.func.now())
    fecha_actualizacion = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())
    activo = db.Column(db.Boolean, default=True)
