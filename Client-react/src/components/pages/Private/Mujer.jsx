import React, { useState, useEffect } from 'react';
import { Header } from '../../Layout/header/Header';
import Swal from 'sweetalert2';
import styles from './Mujer.module.css';
import { Footer } from '../../Layout/footer/Footer';
import { FloatingWhatsApp } from '../../FloatingWhatsApp/FloatingWhatsApp';
export default function Mujer() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popularidad');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const productsPerPage = 12;

  // Datos de ejemplo para la sección Mujer
  const mockProducts = [
    {
      id: 1,
      name: "Vestido Elegante de Noche",
      description: "Vestido largo para ocasiones especiales con detalles de encaje y corte femenino.",
      price: 89.99,
      oldPrice: 119.99,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80",
      badge: "Nuevo",
      rating: 4.8,
      category: "vestidos",
      stock: 8,
      sizes: ["XS", "S", "M", "L"],
      colors: ["Negro", "Rojo", "Azul noche"],
      details: "• Tejido de satén premium\n• Corte sirena\n• Espalda descubierta\n• Forro interior suave"
    },
    {
      id: 2,
      name: "Blusa Floral Primaveral",
      description: "Blusa ligera con estampado floral perfecta para looks casuales y frescos.",
      price: 39.99,
      oldPrice: 49.99,
      image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=500&q=80",
      badge: "Floral",
      rating: 4.6,
      category: "blusas",
      stock: 15,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Rosa", "Blanco", "Amarillo"],
      details: "• Algodón 100%\n• Manga larga volada\n• Botones perlados\n• Lavable a máquina"
    },
    {
      id: 3,
      name: "Falda Tableada Clásica",
      description: "Falda tableada de estilo escolar con corte A-line y tejido de calidad.",
      price: 45.99,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=500&q=80",
      badge: "Clásico",
      rating: 4.7,
      category: "faldas",
      stock: 12,
      sizes: ["XS", "S", "M", "L"],
      colors: ["Negro", "Gris", "Azul marino"],
      details: "• Poliéster resistente\n• Tableados permanentes\n• Cintura elástica\n• Longitud midi"
    },
    {
      id: 4,
      name: "Jeans Mom Fit Premium",
      description: "Jeans de corte mom con tiro alto y efecto lavado vintage muy favorecedor.",
      price: 59.99,
      oldPrice: 79.99,
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&q=80",
      badge: "Trending",
      rating: 4.9,
      category: "pantalones",
      stock: 20,
      sizes: ["26", "28", "30", "32", "34"],
      colors: ["Azul claro", "Azul oscuro", "Negro"],
      details: "• Denim elastano\n• Corte mom fit\n• Tiro alto\n• 5 bolsillos funcionales"
    },
    {
      id: 5,
      name: "Abrigo de Lana Invierno",
      description: "Abrigo largo de lana merino para los días más fríos con diseño elegante.",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=500&q=80",
      badge: "Invierno",
      rating: 4.8,
      category: "abrigos",
      stock: 6,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Camel", "Negro", "Gris oscuro"],
      details: "• Lana merino 80%\n• Forro interior\n• Botones de madera\n• Bolsillos laterales"
    },
    {
      id: 6,
      name: "Top Deportivo Fitness",
      description: "Top deportivo de soporte medio ideal para entrenamientos de alta intensidad.",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1506629905607-e48b0e67d879?auto=format&fit=crop&w=500&q=80",
      badge: "Deporte",
      rating: 4.5,
      category: "deportivo",
      stock: 25,
      sizes: ["XS", "S", "M", "L"],
      colors: ["Negro", "Rosa", "Verde menta"],
      details: "• Material dry-fit\n• Soporte medio\n• Tirantes ajustables\n• Costuras planas"
    },
    {
      id: 7,
      name: "Conjunto de Playa Boho",
      description: "Set de dos piezas con estilo boho chic perfecto para vacaciones y verano.",
      price: 49.99,
      oldPrice: 69.99,
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80",
      badge: "Verano",
      rating: 4.7,
      category: "playa",
      stock: 18,
      sizes: ["XS", "S", "M", "L"],
      colors: ["Blanco", "Azul turquesa", "Coral"],
      details: "• Top y falda\n• Material ligero\n• Estampado étnico\n• Ideal para playa"
    },
    {
      id: 8,
      name: "Chaqueta de Cuero Sintético",
      description: "Chaqueta estilo biker en cuero sintético de alta calidad con cremalleras.",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=80",
      badge: "Edgy",
      rating: 4.6,
      category: "chaquetas",
      stock: 10,
      sizes: ["XS", "S", "M", "L"],
      colors: ["Negro", "Marrón", "Burdeos"],
      details: "• Cuero sintético\n• Cremalleras metálicas\n• Corte ajustado\n• Forro interior"
    },
    {
      id: 9,
      name: "Vestido Cocktail Elegante",
      description: "Vestido corto para eventos y fiestas con detalles de lentejuelas y corte princesa.",
      price: 69.99,
      oldPrice: 89.99,
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=500&q=80",
      badge: "Fiesta",
      rating: 4.9,
      category: "vestidos",
      stock: 7,
      sizes: ["XS", "S", "M"],
      colors: ["Dorado", "Plateado", "Negro"],
      details: "• Tejido con lentejuelas\n• Corte princesa\n• Escote en V\n• Largo midi"
    },
    {
      id: 10,
      name: "Sudadera Oversize Comfort",
      description: "Sudadera oversized perfecta para looks casuales y cómodos de diario.",
      price: 44.99,
      image: "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&w=500&q=80",
      badge: "Comfort",
      rating: 4.4,
      category: "sudaderas",
      stock: 22,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Gris", "Rosa blush", "Verde sage"],
      details: "• Algodón brushed\n• Corte oversized\n• Capucha con cordones\n• Bolsillo canguro"
    },
    {
      id: 11,
      name: "Pantalón Palazzo Fluido",
      description: "Pantalón palazzo de corte ancho y tejido fluido para looks elegantes.",
      price: 55.99,
      image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d77?auto=format&fit=crop&w=500&q=80",
      badge: "Elegante",
      rating: 4.7,
      category: "pantalones",
      stock: 14,
      sizes: ["XS", "S", "M", "L"],
      colors: ["Negro", "Blanco", "Azul cielo"],
      details: "• Tejido fluido\n• Corte palazzo\n• Cintura alta\n• Efecto flowy"
    },
    {
      id: 12,
      name: "Top de Encaje Romantic",
      description: "Top de encaje delicado perfecto para looks femeninos y románticos.",
      price: 35.99,
      oldPrice: 45.99,
      image: "https://images.unsplash.com/photo-1589810635657-232948472d98?auto=format&fit=crop&w=500&q=80",
      badge: "Romantic",
      rating: 4.5,
      category: "tops",
      stock: 16,
      sizes: ["XS", "S", "M"],
      colors: ["Blanco", "Negro", "Rojo"],
      details: "• Encaje delicado\n• Forro interior\n• Tirantes finos\n• Ajuste femenino"
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
      confirmButtonColor: '#ec4899'
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
      <div className={styles.mujerContainer}>
        <Header />
        <div className={styles.loading}>
          <i className="fas fa-spinner fa-spin" style={{marginRight: '10px'}}></i>
          Cargando productos para mujer...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mujerContainer}>
      <Header />

      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>COLECCIÓN MUJER</h1>
        <p className={styles.heroSubtitle}>
          Descubre nuestra exclusiva selección de moda femenina. 
          Desde looks casuales hasta elegancia sofisticada, encuentra tu estilo único.
        </p>
        
        <div className={styles.heroStats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>600+</span>
            <span className={styles.statLabel}>Productos</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>4.9</span>
            <span className={styles.statLabel}>Rating Promedio</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>99%</span>
            <span className={styles.statLabel}>Clientes Satisfechas</span>
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
              placeholder="Buscar en moda femenina..."
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
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''} para mujer
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
                        e.target.src = 'https://via.placeholder.com/300x300/fdf2f8/f9a8d4?text=Imagen+No+Disponible';
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