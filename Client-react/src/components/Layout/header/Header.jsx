import { useState, useEffect } from 'react';
import Perfil from '../../pages/Private/perfil';
import LogoutLink from '../../Auth/logout/LogoutLink';
import './header.css';
import { Link } from 'react-router-dom';

export const Header = () => {
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

  return (
    <div>
      <header>
        <div className="logo">Fashion Luxe</div>
        <i className="fas fa-bars menu-toggle"></i>
        <nav>
          <ul>
            <li><Link to={"/Shop"}><i className="fas fa-home"></i> Inicio</Link></li>
            <li><a href="#"><i className="fas fa-male"></i> Hombres</a>
              <ul>
                <li><a href="#">Camisas</a></li>
                <li><a href="#">Pantalones</a></li>
                <li><a href="#">Chaquetas</a></li>
              </ul>
            </li>
            <li><a href="#"><i className="fas fa-female"></i> Mujeres</a>
              <ul>
                <li><a href="#">Vestidos</a></li>
                <li><a href="#">Blusas</a></li>
                <li><a href="#">Zapatos</a></li>
              </ul>
            </li>
            <li><a href="#"><i className="fas fa-gem"></i> Accesorios</a>
              <ul>
                <li><a href="#">Bolsos</a></li>
                <li><a href="#">Relojes</a></li>
              </ul>
            </li>
            <li><a href="#"><i className="fas fa-tag"></i> Ofertas</a></li>
          </ul>
        </nav>
      
        {/*ICONOS DE USUARIO LOGEADO*/} 
        <div className="user-actions">
           
          <div className="icon-with-badge" title="Favoritos">
            <Link to={"/Favorito"}>
              <i className="fas fa-heart"></i>
              <span className="badge" id="favorites-count">2</span>
            </Link>
          </div>

          <div className="icon-with-badge" title="Carrito de compras">
            <Link to={"/Carrito"}>
              <i className="fas fa-shopping-cart"></i>
              <span className="badge" id="cart-count">5</span>
            </Link>
          </div>
        
          <div className="user-profile">
            <div className="user-avatar">
              {user?.nombre && user?.apellido 
                ? `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase()
                : user?.nombre 
                  ? user.nombre.charAt(0).toUpperCase()
                  : 'US'
              }
            </div>
            <span>
              {user?.nombre || ''} {user?.apellido || ''}
              {!user?.nombre && !user?.apellido && 'Usuario'}
            </span>
            <div className="user-dropdown">
              <Link to={"/Perfil"}><i className="fas fa-user"></i> Mi Perfil</Link>
              <LogoutLink/>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export const Mi_Cuenta = () => {
  return (
    <section className="profile-hero">
      <h1 className='Titulo'>Mi Cuenta</h1>
    </section>
  );
}

export const Favoritos = () => {
  return (
    <section className="profile-hero">
      <h1 className='Titulo'>Mis Favoritos</h1>
    </section>
  );
}

export const Header_Carrito = () => {
  return (
    <section className="profile-hero">
      <h1 className='Titulo'>Mi Carrito</h1>
    </section>
  );
}

export const Finalizar_Compra = () => {
  return (
    <section className="profile-hero">
      <h1 className='Titulo' style={{color: 'white', fontSize: '2.5rem'}}>Finalizar Compra</h1>
    </section>
  );
}