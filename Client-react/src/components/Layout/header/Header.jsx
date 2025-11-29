import { useState, useEffect } from 'react';
import Perfil from '../../pages/Private/perfil';
import LogoutLink from '../../Auth/logout/LogoutLink';
import './header.css';
import { Link } from 'react-router-dom';

// Servicio para obtener los favoritos del usuario
const favoritesService = {
  async getFavoritesCount(userId) {
    try {
      const response = await fetch(`http://localhost:5000/favorites/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching favorites count:', error);
      return { status: 'error', data: [] };
    }
  }
};

export const Header = () => {
  const [user, setUser] = useState(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [hasLoadedFavorites, setHasLoadedFavorites] = useState(false);

  // Función para normalizar los datos del usuario
  const normalizeUser = (raw) => {
    if (!raw) return null;
    const r = typeof raw === "string" ? JSON.parse(raw) : raw;
    return {
      id: r.id || r.ID || null,
      nombre: r.nombre || r.Nombre || r.name || "",
      apellido: r.apellido || r.Apellido || r.lastname || "",
      genero: r.genero || r.Genero || "",
      email: r.email || r.Email || "",
      telefono: r.telefono || r.Telefono || "",
      foto: r.foto || r.Foto || r.avatar || "",
    };
  };

  // Cargar el usuario al montar el componente (SOLO UNA VEZ)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = normalizeUser(storedUser);
      setUser(userData);
    }

    // Cargar carrito desde localStorage (SOLO UNA VEZ)
    const cart = localStorage.getItem('cart');
    if (cart) {
      try {
        const cartItems = JSON.parse(cart);
        setCartCount(cartItems.length || 0);
      } catch (error) {
        console.error('Error parsing cart:', error);
      }
    }
  }, []); // ← Array de dependencias vacío para que solo se ejecute una vez

  // Cargar favoritos solo cuando el usuario esté disponible
  useEffect(() => {
    if (user && user.id && !hasLoadedFavorites) {
      loadFavoritesCount(user.id);
    }
  }, [user, hasLoadedFavorites]);

  // Función para cargar el contador de favoritos (SOLO UNA VEZ)
  const loadFavoritesCount = async (userId) => {
    try {
      console.log('🔄 Loading favorites count for user:', userId);
      const favoritesData = await favoritesService.getFavoritesCount(userId);
      
      if (favoritesData.status === 'success') {
        const count = favoritesData.data.length;
        console.log('✅ Favorites count:', count);
        setFavoritesCount(count);
        setHasLoadedFavorites(true); // Marcar como cargado
      } else {
        console.error('❌ Error loading favorites count:', favoritesData);
        setFavoritesCount(0);
        setHasLoadedFavorites(true);
      }
    } catch (error) {
      console.error('❌ Error loading favorites count:', error);
      setFavoritesCount(0);
      setHasLoadedFavorites(true);
    }
  };

  // Función para forzar actualización manual (opcional, para usar desde otros componentes)
  const refreshFavoritesCount = () => {
    if (user && user.id) {
      setHasLoadedFavorites(false); // Permitir recarga
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('cart'); // Limpiar carrito también
    setFavoritesCount(0);
    setCartCount(0);
    setHasLoadedFavorites(false);
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
            <li><Link to={"/Hombre"}><i className="fas fa-male"></i> Hombres</Link>
              <ul>
                <li><Link to={"/ArtHombre"}>Camisas</Link></li>
                <li><Link to={"/PantalonHombres"}>Pantalones</Link></li>
                <li><Link to={"/Chaquetas"}>Chaquetas</Link></li>
              </ul>
            </li>
            <li><Link to={"/Mujer"}><i className="fas fa-female"></i> Mujeres</Link>
              <ul>
                <li><a href="#">Vestidos</a></li>
                <li><a href="#">Blusas</a></li>
                <li><a href="#">Zapatos</a></li>
              </ul>
            </li>
            <li><Link to={"/Accesorios"}><i className="fas fa-gem"></i> Accesorios</Link>
              <ul>
                <li><a href="#">Bolsos</a></li>
                <li><a href="#">Relojes</a></li>
              </ul>
            </li>
            <li><Link to={"/Ofertas"}><i className="fas fa-tag"></i> Ofertas</Link></li>
          </ul>
        </nav>
      
        {/*ICONOS DE USUARIO LOGEADO*/} 
        <div className="user-actions">
           
          <div className="icon-with-badge" title="Favoritos">
            <Link to={"/Favorito"}>
              <i className="fas fa-heart"></i>
              {favoritesCount > 0 && (
                <span className="badge" id="favorites-count">
                  {favoritesCount > 99 ? '99+' : favoritesCount}
                </span>
              )}
            </Link>
          </div>

          <div className="icon-with-badge" title="Carrito de compras">
            <Link to={"/Carrito"}>
              <i className="fas fa-shopping-cart"></i>
              {cartCount > 0 && (
                <span className="badge" id="cart-count">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
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
};

// Exportar función para actualizar manualmente desde otros componentes
export const refreshHeaderCounts = () => {
  // Esta función puede ser llamada desde otros componentes cuando sea necesario
  window.dispatchEvent(new CustomEvent('refreshHeader'));
};
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