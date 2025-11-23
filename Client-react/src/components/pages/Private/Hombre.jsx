import React, { useState, useEffect } from 'react';
import { Header } from '../../Layout/header/Header';
import Swal from 'sweetalert2';
import styles from './Hombre.module.css';
import { Footer } from '../../Layout/footer/Footer';
import { FloatingWhatsApp } from '../../FloatingWhatsApp/FloatingWhatsApp';

export default function Hombre() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popularidad');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const productsPerPage = 12;

  // Datos de ejemplo para la sección Hombre
  const mockProducts = [
    {
      id: 1,
      name: "Camiseta Básica Premium",
      description: "Camiseta de algodón 100% de alta calidad, perfecta para looks casuales y elegantes.",
      price: 29.99,
      oldPrice: 39.99,
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=500&q=80",
      badge: "Nuevo",
      rating: 4.5,
      category: "camisetas",
      stock: 15,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Blanco", "Negro", "Azul", "Gris"],
      details: "• 100% algodón orgánico\n• Corte regular fit\n• Cuello redondo\n• Lavable a máquina"
    },
    {
      id: 2,
      name: "Jeans Slim Fit Modernos",
      description: "Jeans ajustados con tecnología stretch para máxima comodidad y estilo urbano.",
      price: 59.99,
      oldPrice: 79.99,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=500&q=80",
      badge: "-25%",
      rating: 4.8,
      category: "pantalones",
      stock: 8,
      sizes: ["30", "32", "34", "36"],
      colors: ["Azul oscuro", "Negro", "Gris"],
      details: "• Denim elastano\n• Corte slim fit\n• Tecnología anti-arrugas\n• 5 bolsillos"
    },
    {
      id: 3,
      name: "Chaqueta Deportiva Performance",
      description: "Chaqueta técnica para actividades outdoor con protección contra el viento y agua.",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=80",
      badge: "Trending",
      rating: 4.6,
      category: "chaquetas",
      stock: 12,
      sizes: ["M", "L", "XL", "XXL"],
      colors: ["Negro", "Azul marino", "Verde"],
      details: "• Material técnico\n• Impermeable y transpirable\n• Capucha integrada\n• Bolsillos seguros"
    },
    {
      id: 4,
      name: "Zapatos Casuales Urbanos",
      description: "Calzado urbano que combina estilo y comodidad para el día a día.",
      price: 79.99,
      oldPrice: 99.99,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80",
      badge: "Oferta",
      rating: 4.7,
      category: "calzado",
      stock: 20,
      sizes: ["40", "41", "42", "43", "44"],
      colors: ["Marrón", "Negro", "Azul"],
      details: "• Cuero genuino\n• Suela de goma\n• Plantilla acolchada\n• Estilo casual"
    },
    {
      id: 5,
      name: "Suéter de Lujo Merino",
      description: "Suéter de lana merino ultraligero para máxima calidez y elegancia.",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=500&q=80",
      badge: "Lujo",
      rating: 4.9,
      category: "sueters",
      stock: 6,
      sizes: ["S", "M", "L"],
      colors: ["Gris oscuro", "Negro", "Burdeos"],
      details: "• 100% lana merino\n• Ultra suave\n• Regulación térmica\n• Lavado a máquina"
    },
    {
      id: 6,
      name: "Shorts Deportivos Elite",
      description: "Shorts técnicos para entrenamiento con tecnología de secado rápido.",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1506629905607-e48b0e67d879?auto=format&fit=crop&w=500&q=80",
      badge: "Deporte",
      rating: 4.4,
      category: "shorts",
      stock: 25,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Negro", "Gris", "Azul real"],
      details: "• Tejido dry-fit\n• Secado rápido\n• Cintura elástica\n• Bolsillo para llaves"
    },
    {
      id: 7,
      name: "Camisa Formal Executive",
      description: "Camisa de vestir en algodón egipcio para ocasiones formales y de negocios.",
      price: 69.99,
      oldPrice: 89.99,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80",
      badge: "Executive",
      rating: 4.8,
      category: "camisas",
      stock: 10,
      sizes: ["M", "L", "XL"],
      colors: ["Blanco", "Azul claro", "Rosa palo"],
      details: "• Algodón egipcio\n• Corte slim fit\n• Planchado permanente\n• Botones de madreperla"
    },
    {
      id: 8,
      name: "Chándal Deportivo Completo",
      description: "Conjunto deportivo de dos piezas para entrenamiento y lifestyle.",
      price: 99.99,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=80",
      badge: "Combo",
      rating: 4.5,
      category: "conjuntos",
      stock: 18,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Negro", "Gris", "Azul marino"],
      details: "• 2 piezas\n• Material técnico\n• Bolsillos funcionales\n• Lavable a máquina"
    }
  ];

  useEffect(() => {
    // Simular carga de API
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Filtrar y ordenar productos
  useEffect(() => {
    let filtered = [...products];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar
    switch (sortBy) {
      case 'precio_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'precio_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'nuevo':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'valoracion':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Popularidad (por defecto)
        filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchTerm, sortBy]);

  // Paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleSearch = (e) => {
    e.preventDefault();
    // La búsqueda se maneja automáticamente por el useEffect
  };

  const handleQuickView = (product) => {
    // Usar la función handleQuickView que ya tienes
    // Aquí iría tu implementación de vista rápida
    alert(`Vista rápida: ${product.name}`);
  };

  const handleAddToWishlist = (productId) => {
    Swal.fire({
      title: '¡Agregado a Favoritos!',
      text: 'El producto se ha agregado a tu lista de deseos',
      icon: 'success',
      confirmButtonText: 'Continuar',
      timer: 2000
    });
  };

  const handleAddToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    Swal.fire({
      title: '¡Producto Agregado!',
      html: `
        <div style="text-align: center;">
          <img src="${product.image}" alt="${product.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 10px; margin-bottom: 15px;"/>
          <p><strong>${product.name}</strong></p>
          <p>Precio: $${product.price}</p>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#10b981'
    });
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="fas fa-star"></i>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<i key={i} className="fas fa-star-half-alt"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star"></i>);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className={styles.hombreContainer}>
        <Header />
        <div className={styles.loading}>
          <i className="fas fa-spinner fa-spin" style={{marginRight: '10px'}}></i>
          Cargando productos para hombre...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.hombreContainer}>
      <Header />

      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>COLECCIÓN HOMBRE</h1>
        <p className={styles.heroSubtitle}>
          Descubre nuestra exclusiva selección de moda masculina. 
          Desde looks casuales hasta elegancia formal, encuentra tu estilo perfecto.
        </p>
        
        <div className={styles.heroStats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>500+</span>
            <span className={styles.statLabel}>Productos</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>4.8</span>
            <span className={styles.statLabel}>Rating Promedio</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>98%</span>
            <span className={styles.statLabel}>Clientes Satisfechos</span>
          </div>
        </div>
      </section>

      {/* FILTERS BAR */}
      <section className={styles.filtersBar}>
        <div className={styles.filtersContainer}>
          <form onSubmit={handleSearch} className={styles.searchBox}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Buscar en moda masculina..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className={styles.searchButton}>
              <i className="fas fa-search"></i>
            </button>
          </form>

          <div className={styles.filterControls}>
            <select 
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popularidad">Ordenar por: Popularidad</option>
              <option value="precio_asc">Precio: Menor a Mayor</option>
              <option value="precio_desc">Precio: Mayor a Menor</option>
              <option value="nuevo">Más Nuevos</option>
              <option value="valoracion">Mejor Valorados</option>
            </select>

            <div className={styles.viewToggle}>
              <button 
                className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <i className="fas fa-th"></i>
              </button>
              <button 
                className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                onClick={() => setViewMode('list')}
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className={styles.productsSection}>
        <div className={styles.productsHeader}>
          <div className={styles.resultsCount}>
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''} para hombre
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className={styles.noProducts}>
            <div className={styles.noProductsIcon}>
              <i className="fas fa-search"></i>
            </div>
            <h3>No se encontraron productos</h3>
            <p>Intenta con otros términos de búsqueda o ajusta los filtros</p>
          </div>
        ) : (
          <>
            <div className={styles.productsGrid}>
              {currentProducts.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  {product.badge && (
                    <div className={styles.productBadge}>{product.badge}</div>
                  )}
                  
                  <div className={styles.productImage}>
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300/f8fafc/94a3b8?text=Imagen+No+Disponible';
                      }}
                    />
                    <div className={styles.productActions}>
                      <button 
                        className={styles.actionButton}
                        onClick={() => handleQuickView(product)}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        className={styles.actionButton}
                        onClick={() => handleAddToWishlist(product.id)}
                      >
                        <i className="fas fa-heart"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.productInfo}>
                    <h3 className={styles.productTitle}>{product.name}</h3>
                    <p className={styles.productDescription}>{product.description}</p>
                    
                    <div className={styles.productRating}>
                      <span className={styles.ratingStars}>
                        {renderRatingStars(product.rating)}
                      </span>
                      <span className={styles.ratingCount}>({product.rating})</span>
                    </div>
                    
                    <div className={styles.productPrice}>
                      <div className={styles.priceContainer}>
                        {product.oldPrice && (
                          <span className={styles.oldPrice}>${product.oldPrice}</span>
                        )}
                        <span className={styles.currentPrice}>${product.price}</span>
                      </div>
                      <button 
                        className={styles.addToCartButton}
                        onClick={() => handleAddToCart(product.id)}
                        disabled={product.stock === 0}
                      >
                        <i className="fas fa-shopping-cart"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button 
                  className={styles.paginationButton}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={`${styles.paginationButton} ${currentPage === index + 1 ? styles.active : ''}`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button 
                  className={styles.paginationButton}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </section>
                  <Footer/>
                  <FloatingWhatsApp/>
    </div>
  );
}