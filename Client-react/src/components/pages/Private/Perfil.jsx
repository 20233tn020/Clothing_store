import { useState, useEffect } from 'react';
import { Header, Mi_Cuenta } from '../../Layout/header/Header';
import { Footer } from '../../Layout/footer/Footer';
import { FloatingWhatsApp } from '../../FloatingWhatsApp/FloatingWhatsApp';
import './Perfil.css';

//importacion de la libreria para la foto de perfil

import "react-profile/themes/default"
import {openEditor,ReactProfile} from "react-profile"

export default function Perfil() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Obtener usuario del localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };


  const [activeSection, setActiveSection] = useState('personal');
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Casa Principal',
      street: 'Av. Reforma 123',
      colonia: 'Col. Centro',
      city: 'Ciudad de México',
      state: 'CDMX',
      zip: '06000',
      phone: '+52 55 1234 5678',
      instructions: '',
      isDefault: true
    },
    {
      id: 2,
      name: 'Oficina',
      street: 'Paseo de la Reforma 505, Piso 15',
      colonia: 'Col. Juárez',
      city: 'Ciudad de México',
      state: 'CDMX',
      zip: '06500',
      phone: '+52 55 8765 4321',
      instructions: 'Recepción, piso 15',
      isDefault: false
    }
  ]);

  // Función para establecer una dirección como principal
  const setAsDefault = (addressId) => {
    if (confirm('¿Establecer como dirección principal? Esta será tu dirección de envío predeterminada.')) {
      const updatedAddresses = addresses.map(address => ({
        ...address,
        isDefault: address.id === addressId
      }));
      setAddresses(updatedAddresses);
      alert('Dirección establecida como principal');
    }
  };

  // Función para eliminar una dirección
  const deleteAddress = (addressId) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta dirección? Esta acción no se puede deshacer.')) {
      const updatedAddresses = addresses.filter(address => address.id !== addressId);
      setAddresses(updatedAddresses);
      alert('Dirección eliminada correctamente');
    }
  };

  // Función para agregar una nueva dirección
  const addNewAddress = () => {
    const name = prompt('Nombre de la dirección (Ej: Casa, Oficina):');
    if (!name) return;

    const street = prompt('Calle y número:');
    if (!street) return;

    const colonia = prompt('Colonia:');
    if (!colonia) return;

    const city = prompt('Ciudad:');
    if (!city) return;

    const state = prompt('Estado:');
    if (!state) return;

    const zip = prompt('Código Postal:');
    if (!zip) return;

    const phone = prompt('Teléfono:');
    if (!phone) return;

    const instructions = prompt('Instrucciones de entrega (opcional):') || '';

    const isDefault = confirm('¿Establecer como dirección principal?');

    const newAddress = {
      id: Date.now(),
      name,
      street,
      colonia,
      city,
      state,
      zip,
      phone,
      instructions,
      isDefault: isDefault
    };

    let updatedAddresses;
    if (isDefault) {
      updatedAddresses = addresses.map(address => ({
        ...address,
        isDefault: false
      }));
      updatedAddresses.push(newAddress);
    } else {
      updatedAddresses = [...addresses, newAddress];
    }

    setAddresses(updatedAddresses);
    alert('Dirección agregada correctamente');
  };

  // Función para editar una dirección
  const editAddress = (addressId) => {
    const address = addresses.find(addr => addr.id === addressId);
    if (!address) return;

    const name = prompt('Nombre de la dirección:', address.name) || address.name;
    const street = prompt('Calle y número:', address.street) || address.street;
    const colonia = prompt('Colonia:', address.colonia) || address.colonia;
    const city = prompt('Ciudad:', address.city) || address.city;
    const state = prompt('Estado:', address.state) || address.state;
    const zip = prompt('Código Postal:', address.zip) || address.zip;
    const phone = prompt('Teléfono:', address.phone) || address.phone;
    const instructions = prompt('Instrucciones de entrega:', address.instructions) || address.instructions;

    let isDefault = address.isDefault;
    if (!isDefault) {
      isDefault = confirm('¿Establecer como dirección principal?');
    }

    const updatedAddresses = addresses.map(addr => {
      if (addr.id === addressId) {
        return {
          ...addr,
          name,
          street,
          colonia,
          city,
          state,
          zip,
          phone,
          instructions,
          isDefault
        };
      }
      return {
        ...addr,
        isDefault: isDefault ? false : addr.isDefault
      };
    });

    setAddresses(updatedAddresses);
    alert('Dirección actualizada correctamente');
  };

  return (
    <div>
      <title>Mi Perfil - Fashion Luxe</title>
      <Header/>
      <Mi_Cuenta/>
      <div className='profile-container'>
        <div className="profile-sidebar">
          <div className="profile-picture">
             {user?.nombre && user?.apellido  ? `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase() : 'US' }
          <input type='file' className='change-photo'   accept="image/jpeg;image/png" onChange={(e)=> openEditor({src: e.target.files[0], square: true})} />
          </div>
          <div className="profile-name">{user?.nombre || ''} {user?.apellido || ''}</div>
          <div className="profile-email">{user?.email || 'Invitada'}</div>
          <div className="profile-email">
            <p>Fechas de Creacion:</p>
            <span>{user?.fecha_creacion || ''}</span>
          </div>
          
          <div className="profile-stats">
            <div className="stat">
              <div className="stat-value">12</div>
              <div className="stat-label">Pedidos</div>
            </div>
            <div className="stat">
              <div className="stat-value">8</div>
              <div className="stat-label">Favoritos</div>
            </div>
            <div className="stat">
              <div className="stat-value">{addresses.length}</div>
              <div className="stat-label">Direcciones</div>
            </div>
          </div>
          
          <ul className="sidebar-menu">
            <li>
              <a 
                href="#" 
                className={activeSection === 'personal' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveSection('personal'); }}
              >
                <i className="fas fa-user"></i> Información Personal
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={activeSection === 'orders' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveSection('orders'); }}
              >
                <i className="fas fa-shopping-bag"></i> Mis Pedidos
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={activeSection === 'favorites' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveSection('favorites'); }}
              >
                <i className="fas fa-heart"></i> Mis Favoritos
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={activeSection === 'addresses' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveSection('addresses'); }}
              >
                <i className="fas fa-map-marker-alt"></i> Direcciones
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={activeSection === 'security' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveSection('security'); }}
              >
                <i className="fas fa-lock"></i> Cambiar Contraseña
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={activeSection === 'notifications' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveSection('notifications'); }}
              >
                <i className="fas fa-bell"></i> Notificaciones
              </a>
            </li>
            <li><a href="#"><i className="fas fa-sign-out-alt"></i> Cerrar Sesión</a></li>
          </ul>
        </div>

        {/* Contenido principal */}
        <div className="profile-content">
          {/* SECCIÓN DE INFORMACIÓN PERSONAL */}
          {activeSection === 'personal' && (
            <div className="profile-section">
              <h2 className="section-title">Información Personal</h2>
              <form>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">Nombre</label>
                    <input type="text" id="firstName" className="form-control" Value={user?.nombre || ''}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Apellidos</label>
                    <input type="text" id="lastName" className="form-control" Value={user?.apellido || ''}/>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Correo Electrónico</label>
                  <input type="email" id="email" className="form-control" value={user?.email || ''}/>
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Teléfono</label>
                  <input type="tel" id="phone" className="form-control" Value={user?.telefono || ''}/>
                </div>
                
                <div className="form-group">
                  <label htmlFor="birthdate">Fecha de Nacimiento</label>
   <input 
    type="date" 
    id="birthdate" 
    className="form-control" 
    value={user?.fecha_nacimiento ? new Date(user.fecha_nacimiento).toISOString().split('T')[0] : ''}
  />       </div>
                
                <div className="form-group">
                  <label htmlFor="gender">Género</label>
                  <select id="gender" className="form-control"  value={user?.genero || ''}
    readOnly >
                    <option value="femenino">Femenino</option>
                    <option value="masculino">Masculino</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                
                <button type="submit" className="btn btn-primary">Guardar Cambios</button>
              </form>
            </div>
          )}

          {/* SECCIÓN DE DIRECCIONES - CORREGIDA */}
          {activeSection === 'addresses' && (
            <div className="profile-section">
              <h2 className="section-title">Mis Direcciones</h2>
              
              {addresses.map(address => (
                <div 
                  key={address.id} 
                  className={`address-card ${address.isDefault ? 'address-default' : ''}`}
                >
                  <div className="address-header">
                    <div className="address-name">{address.name}</div>
                    {address.isDefault && <div className="address-default-badge">Principal</div>}
                    <div className="address-actions">
                      {!address.isDefault && (
                        <button 
                          className="address-action" 
                          title="Establecer como principal" 
                          onClick={() => setAsDefault(address.id)}
                        >
                          <i className="fas fa-home"></i>
                        </button>
                      )}
                      <button 
                        className="address-action" 
                        title="Editar" 
                        onClick={() => editAddress(address.id)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="address-action" 
                        title="Eliminar" 
                        onClick={() => deleteAddress(address.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <p><strong>Dirección:</strong> {address.street}, {address.colonia}</p>
                  <p><strong>Ciudad:</strong> {address.city}, {address.state} {address.zip}</p>
                  <p><strong>Teléfono:</strong> {address.phone}</p>
                  {address.instructions && <p><strong>Instrucciones:</strong> {address.instructions}</p>}
                </div>
              ))}
              
              <button className="btn btn-primary" onClick={addNewAddress}>
                <i className="fas fa-plus"></i> Agregar Nueva Dirección
              </button>
            </div>
          )}

          {/* SECCIÓN DE PEDIDOS RECIENTES */}
          {activeSection === 'orders' && (
            <div className="profile-section">
              <h2 className="section-title">Pedidos Recientes</h2>
              
              <div className="order-card">
                <div className="order-header">
                  <div className="order-id">Pedido #FL-2023-0012</div>
                  <div className="order-status status-delivered">Entregado</div>
                </div>
                <div className="order-details">
                  <div className="order-image">
                    <img src="https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?auto=format&fit=crop&w=500&q=80" alt="Camisa Formal Azul"/>
                  </div>
                  <div className="order-info">
                    <div className="order-product">Camisa Formal Azul Marino</div>
                    <div className="order-date">Realizado el 15 de Noviembre, 2023</div>
                    <div className="order-total">Total: $49.99</div>
                  </div>
                </div>
                <div className="order-actions">
                  <button className="btn btn-outline">Ver Detalles</button>
                  <button className="btn btn-outline">Volver a Comprar</button>
                </div>
              </div>
              
              <div className="order-card">
                <div className="order-header">
                  <div className="order-id">Pedido #FL-2023-0011</div>
                  <div className="order-status status-pending">En Proceso</div>
                </div>
                <div className="order-details">
                  <div className="order-image">
                    <img src="https://images.unsplash.com/photo-1593030103066-0093718efeb9?auto=format&fit=crop&w=500&q=80" alt="Camisa Casual a Cuadros"/>
                  </div>
                  <div className="order-info">
                    <div className="order-product">Camisa Casual a Cuadros</div>
                    <div className="order-date">Realizado el 10 de Noviembre, 2023</div>
                    <div className="order-total">Total: $36.79</div>
                  </div>
                </div>
                <div className="order-actions">
                  <button className="btn btn-outline">Ver Detalles</button>
                  <button className="btn btn-outline">Seguir Pedido</button>
                </div>
              </div>
              
              <button className="btn btn-outline" style={{width: '100%'}}>Ver Todos los Pedidos</button>
            </div>
          )}

          {/* SECCIÓN DE FAVORITOS */}
          {activeSection === 'favorites' && (
            <div className="profile-section">
              <h2 className="section-title">Mis Favoritos</h2>
              
              <div className="favorite-grid">
                <div className="favorite-card">
                  <div className="favorite-image">
                    <img src="https://images.unsplash.com/photo-1525450824782-b60f5a1d654a?auto=format&fit=crop&w=500&q=80" alt="Camisa Oxford Gris"/>
                  </div>
                  <div className="favorite-info">
                    <div className="favorite-name">Camisa Oxford Gris</div>
                    <div className="favorite-price">$42.99</div>
                    <div className="favorite-actions">
                      <button className="btn btn-primary">Añadir al Carrito</button>
                      <button className="btn btn-outline"><i className="fas fa-trash"></i></button>
                    </div>
                  </div>
                </div>
                
                <div className="favorite-card">
                  <div className="favorite-image">
                    <img src="https://images.unsplash.com/photo-1574180045827-681f8a1a9622?auto=format&fit=crop&w=500&q=80" alt="Camisa Denim Azul"/>
                  </div>
                  <div className="favorite-info">
                    <div className="favorite-name">Camisa Denim Azul</div>
                    <div className="favorite-price">$34.99</div>
                    <div className="favorite-actions">
                      <button className="btn btn-primary">Añadir al Carrito</button>
                      <button className="btn btn-outline"><i className="fas fa-trash"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN DE SEGURIDAD */}
          {activeSection === 'security' && (
            <div className="profile-section">
              <h2 className="section-title">Cambiar Contraseña</h2>
              <form>
                <div className="form-group">
                  <label htmlFor="currentPassword">Contraseña Actual</label>
                  <input type="password" id="currentPassword" className="form-control" placeholder="Ingresa tu contraseña actual"/>
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">Nueva Contraseña</label>
                  <input type="password" id="newPassword" className="form-control" placeholder="Ingresa nueva contraseña"/>
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                  <input type="password" id="confirmPassword" className="form-control" placeholder="Confirma tu nueva contraseña"/>
                </div>
                <button type="submit" className="btn btn-primary">Actualizar Contraseña</button>
              </form>
            </div>
          )}

          {/* SECCIÓN DE NOTIFICACIONES */}
          {activeSection === 'notifications' && (
            <div className="profile-section">
              <h2 className="section-title">Configuración de Notificaciones</h2>
              <form>
                <div className="toggle-group">
                  <div className="toggle-text">
                    <h4>Notificaciones por Email</h4>
                    <p>Recibir notificaciones por correo electrónico</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked/>
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-group">
                  <div className="toggle-text">
                    <h4>Estado de Pedidos</h4>
                    <p>Alertas sobre el estado de tus pedidos</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked/>
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-group">
                  <div className="toggle-text">
                    <h4>Ofertas Especiales</h4>
                    <p>Descuentos y promociones exclusivas</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked/>
                    <span className="slider"></span>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary">Guardar Preferencias</button>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer/>
      <FloatingWhatsApp/>
    </div>
  );
}