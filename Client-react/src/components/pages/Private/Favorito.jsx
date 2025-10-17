import  { useState, useEffect } from 'react';
import './Favorito.css';
import { Footer } from '../../Layout/footer/Footer';
import { Favoritos, Header } from '../../Layout/header/Header';
import { FloatingWhatsApp } from '../../FloatingWhatsApp/FloatingWhatsApp';

export default function Favorito() {
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: "Camisa Formal Azul Marino",
      description: "Camisa de vestir en algodón egipcio, perfecta para ocasiones formales.",
      price: 49.99,
      oldPrice: 59.99,
      image: "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?auto=format&fit=crop&w=500&q=80",
      badge: "-20%",
      category: "camisas",
      color: "azul"
    },
    {
      id: 2,
      name: "Camisa Casual a Cuadros",
      description: "Estilo relajado con diseño a cuadros, ideal para looks informales.",
      price: 36.79,
      image: "https://images.unsplash.com/photo-1593030103066-0093718efeb9?auto=format&fit=crop&w=500&q=80",
      category: "camisas",
      color: "rojo"
    },
    {
      id: 3,
      name: "Camisa Oxford Gris",
      description: "Clásica camisa Oxford en color gris, versátil para looks casuales.",
      price: 42.99,
      image: "https://images.unsplash.com/photo-1525450824782-b60f5a1d654a?auto=format&fit=crop&w=500&q=80",
      badge: "Nuevo",
      category: "camisas",
      color: "gris"
    }
  ]);

  const [cartCount, setCartCount] = useState(2);
  const [filters, setFilters] = useState({
    categories: {
      camisas: true,
      pantalones: false,
      chaquetas: false,
      accesorios: false
    },
    colors: {
      azul: false,
      negro: true,
      blanco: false,
      gris: false
    },
    price: {
      "price-1": false,
      "price-2": true,
      "price-3": false
    }
  });
  const [sortBy, setSortBy] = useState('recent');
  const [addedToCart, setAddedToCart] = useState({});

  // Eliminar producto de favoritos
  const removeFavorite = (id) => {
    const product = document.getElementById(`favorite-${id}`);
    if (product) {
      product.style.animation = 'fadeOut 0.5s forwards';
      
      setTimeout(() => {
        setFavorites(prev => prev.filter(item => item.id !== id));
      }, 500);
    }
  };

  // Añadir producto al carrito
  const addToCart = (id) => {
    setAddedToCart(prev => ({
      ...prev,
      [id]: true
    }));

    setCartCount(prev => prev + 1);

    setTimeout(() => {
      setAddedToCart(prev => ({
        ...prev,
        [id]: false
      }));
    }, 1500);
  };

  // Aplicar filtros
  const applyFilters = () => {
    // Aquí implementarías la lógica de filtrado
    console.log('Aplicando filtros:', filters);
  };

  // Ordenar productos
  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Manejar cambios en filtros
  const handleFilterChange = (type, key) => {
    setFilters(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: !prev[type][key]
      }
    }));
  };

  // Efecto para añadir estilos de animación
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(20px); }
      }
      
      .cart-badge-animation {
        animation: badgePulse 0.3s ease-in-out;
      }
      
      @keyframes badgePulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div>
      <Header/>
    <Favoritos/>

      <div className="favorites-container">
        <div className="section-title">
          <h2>Artículos que te encantan</h2>
        </div>
        <p className="section-subtitle">Guarda tus productos favoritos para comprarlos más tarde</p>
        
        <div className="favorites-content">
          {/* Filters Sidebar */}
          <div className="filters-sidebar">
            <div className="filter-section">
              <div className="filter-title">
                <span>Filtrar por</span>
              </div>
            </div>
            
            <div className="filter-section">
              <div className="filter-title">
                <span>Categorías</span>
              </div>
              <ul className="filter-options">
                {Object.entries(filters.categories).map(([key, value]) => (
                  <li key={key}>
                    <input 
                      type="checkbox" 
                      id={`cat-${key}`}
                      checked={value}
                      onChange={() => handleFilterChange('categories', key)}
                    />
                    <label htmlFor={`cat-${key}`}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="filter-section">
              <div className="filter-title">
                <span>Colores</span>
              </div>
              <ul className="filter-options">
                {Object.entries(filters.colors).map(([key, value]) => (
                  <li key={key}>
                    <input 
                      type="checkbox" 
                      id={`color-${key}`}
                      checked={value}
                      onChange={() => handleFilterChange('colors', key)}
                    />
                    <label htmlFor={`color-${key}`}>
                      <div className={`color-option color-${key}`}></div>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="filter-section">
              <div className="filter-title">
                <span>Precio</span>
              </div>
              <ul className="filter-options">
                <li>
                  <input 
                    type="checkbox" 
                    id="price-1"
                    checked={filters.price['price-1']}
                    onChange={() => handleFilterChange('price', 'price-1')}
                  />
                  <label htmlFor="price-1">Menos de $50</label>
                </li>
                <li>
                  <input 
                    type="checkbox" 
                    id="price-2"
                    checked={filters.price['price-2']}
                    onChange={() => handleFilterChange('price', 'price-2')}
                  />
                  <label htmlFor="price-2">$50 - $100</label>
                </li>
                <li>
                  <input 
                    type="checkbox" 
                    id="price-3"
                    checked={filters.price['price-3']}
                    onChange={() => handleFilterChange('price', 'price-3')}
                  />
                  <label htmlFor="price-3">Más de $100</label>
                </li>
              </ul>
            </div>
            
            <button className="btn-primary" onClick={applyFilters} style={{width: '100%', marginTop: '20px'}}>
              Aplicar Filtros
            </button>
          </div>
          
          {/* Favorites Main */}
          <div className="favorites-main">
            <div className="sort-options">
              <div className="favorites-count">
                {favorites.length} artículo{favorites.length !== 1 ? 's' : ''} en favoritos
              </div>
              <div>
                <label htmlFor="sort">Ordenar por: </label>
                <select 
                  id="sort" 
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Más recientes</option>
                  <option value="price-low">Precio: menor a mayor</option>
                  <option value="price-high">Precio: mayor a menor</option>
                  <option value="name">Nombre A-Z</option>
                </select>
              </div>
            </div>
            
            {favorites.length > 0 ? (
              <div className="favorites-grid">
                {sortedFavorites.map(product => (
                  <div 
                    key={product.id} 
                    id={`favorite-${product.id}`}
                    className="favorite-card"
                  >
                    {product.badge && (
                      <div className="favorite-badge">{product.badge}</div>
                    )}
                    <div className="favorite-actions">
                      <button 
                        className="favorite-remove" 
                        title="Eliminar de favoritos"
                        onClick={() => removeFavorite(product.id)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    <div className="favorite-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="favorite-info">
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <div className="favorite-price">
                        <div>
                          {product.oldPrice && (
                            <span className="old-price">${product.oldPrice}</span>
                          )}
                          <span className="price">${product.price}</span>
                        </div>
<button 
  className={`add-to-cart ${addedToCart[product.id] ? 'added' : ''}`}
  onClick={() => addToCart(product.id)}
>
  <i className={`fas ${addedToCart[product.id] ? 'fa-check' : 'fa-shopping-cart'}`}></i>
  {addedToCart[product.id] ? 'Añadido' : 'Añadir'}
</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="far fa-heart"></i>
                </div>
                <h3 className="empty-title">No hay artículos favoritos</h3>
                <p className="empty-text">
                  Aún no has guardado ningún producto en tu lista de favoritos. 
                  Explora nuestra colección y guarda los artículos que más te gusten.
                </p>
                <a href="#" className="btn-primary">Explorar Productos</a>
              </div>
            )}
          </div>
        </div>
      </div>
<Footer/>
<FloatingWhatsApp/>
    </div>
  );
}