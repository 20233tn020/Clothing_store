import React, { useState, useEffect } from 'react';
import { Footer } from '../../Layout/footer/Footer';
import { Header } from '../../Layout/header/Header';
import { FloatingWhatsApp } from '../../FloatingWhatsApp/FloatingWhatsApp';
import Swal from 'sweetalert2';
import './PantalonHombre.css';

export default function PantalonHombres() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popularidad');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const productsPerPage = 12;

  // Datos de ejemplo específicos para pantalones de hombre
  const mockProducts = [
    {
      id: 1,
      name: "Jeans Slim Fit Modernos",
      description: "Jeans ajustados con tecnología stretch para máxima comodidad y estilo urbano.",
      price: 59.99,
      oldPrice: 79.99,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=500&q=80",
      badge: "-25%",
      rating: 4.8,
      category: "jeans",
      stock: 8,
      sizes: ["30", "32", "34", "36"],
      colors: ["Azul oscuro", "Negro", "Gris"],
      details: "• Denim elastano\n• Corte slim fit\n• Tecnología anti-arrugas\n• 5 bolsillos"
    },
    {
      id: 2,
      name: "Pantalón Chino Clásico",
      description: "Pantalón chino en algodón twill perfecto para looks casuales y semi-formales.",
      price: 45.99,
      oldPrice: 59.99,
      image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=500&q=80",
      badge: "Oferta",
      rating: 4.6,
      category: "chinos",
      stock: 15,
      sizes: ["30", "32", "34", "36", "38"],
      colors: ["Beige", "Azul claro", "Verde oliva"],
      details: "• Algodón twill\n• Corte regular fit\n• Planchado permanente\n• 4 bolsillos"
    },
    {
      id: 3,
      name: "Pantalón Deportivo Jogger",
      description: "Pantalón jogger con cintura elástica y tobillo ajustable para máximo confort.",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1506629905607-e48b0e67d879?auto=format&fit=crop&w=500&q=80",
      badge: "Deporte",
      rating: 4.5,
      category: "joggers",
      stock: 20,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Negro", "Gris", "Azul marino"],
      details: "• Tejido técnico\n• Cintura elástica\n• Tobillo ajustable\n• Bolsillo para llaves"
    },
    {
      id: 4,
      name: "Pantalón Formal de Vestir",
      description: "Pantalón de vestir en lana mezclada para ocasiones formales y de negocios.",
      price: 89.99,
      oldPrice: 119.99,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=500&q=80",
      badge: "Premium",
      rating: 4.7,
      category: "formales",
      stock: 10,
      sizes: ["30", "32", "34", "36"],
      colors: ["Negro", "Gris oscuro", "Azul marino"],
      details: "• Lana mezclada\n• Corte straight fit\n• Planchado fino\n• Forro interior"
    },
    {
      id: 5,
      name: "Shorts Casuales Verano",
      description: "Shorts de verano en lino natural para looks frescos y cómodos.",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1506629905607-e48b0e67d879?auto=format&fit=crop&w=500&q=80",
      badge: "Verano",
      rating: 4.4,
      category: "shorts",
      stock: 25,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Beige", "Azul claro", "Blanco"],
      details: "• 100% lino natural\n• Corte regular\n• Cintura elástica\n• 2 bolsillos laterales"
    },
    {
      id: 6,
      name: "Pantalón Cargo Utilitario",
      description: "Pantalón cargo con múltiples bolsillos para looks urbanos y funcionales.",
      price: 49.99,
      oldPrice: 69.99,
      image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=500&q=80",
      badge: "Utilitario",
      rating: 4.3,
      category: "cargo",
      stock: 18,
      sizes: ["30", "32", "34", "36", "38"],
      colors: ["Verde militar", "Negro", "Gris"],
      details: "• Algodón canvas\n• 6 bolsillos\n• Corte relaxed fit\n• Refuerzos en rodillas"
    },
    {
      id: 7,
      name: "Jeans Relaxed Fit",
      description: "Jeans de corte holgado para máxima comodidad sin sacrificar el estilo.",
      price: 54.99,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=500&q=80",
      badge: "Comfort",
      rating: 4.6,
      category: "jeans",
      stock: 12,
      sizes: ["32", "34", "36", "38", "40"],
      colors: ["Azul claro", "Azul oscuro", "Negro"],
      details: "• Denim stretch\n• Corte relaxed fit\n• Tiro medio\n• Lavado vintage"
    },
    {
      id: 8,
      name: "Pantalón de Traje Elegante",
      description: "Pantalón de traje en lana merino para eventos formales y especiales.",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=500&q=80",
      badge: "Lujo",
      rating: 4.9,
      category: "formales",
      stock: 6,
      sizes: ["30", "32", "34"],
      colors: ["Negro", "Gris antracita", "Azul noche"],
      details: "• Lana merino\n• Corte slim fit\n• Forro completo\n• Hecho a medida"
    }
  ];

  // Categorías específicas para pantalones
  const categories = [
    { id: 'todos', name: 'Todos los Pantalones', count: mockProducts.length },
    { id: 'jeans', name: 'Jeans', count: mockProducts.filter(p => p.category === 'jeans').length },
    { id: 'chinos', name: 'Chinos', count: mockProducts.filter(p => p.category === 'chinos').length },
    { id: 'joggers', name: 'Joggers', count: mockProducts.filter(p => p.category === 'joggers').length },
    { id: 'formales', name: 'Formales', count: mockProducts.filter(p => p.category === 'formales').length },
    { id: 'shorts', name: 'Shorts', count: mockProducts.filter(p => p.category === 'shorts').length },
    { id: 'cargo', name: 'Cargo', count: mockProducts.filter(p => p.category === 'cargo').length }
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

    // Filtrar por categoría
    if (selectedCategory !== 'todos') {
      filtered = filtered.filter(product => product.category === selectedCategory);
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
  }, [products, searchTerm, sortBy, selectedCategory]);

  // Paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleQuickView = (product) => {
    Swal.fire({
      title: product.name,
      html: `
        <div style="text-align: left;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
              <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 10px;"/>
            </div>
            <div>
              <h4 style="color: #007bff; margin-bottom: 10px;">$${product.price}${product.oldPrice ? ` <span style="color: #999; text-decoration: line-through; font-size: 0.9em;">$${product.oldPrice}</span>` : ''}</h4>
              
              <div style="margin-bottom: 15px;">
                <strong>Disponibilidad:</strong>
                <span style="color: ${product.stock > 0 ? '#28a745' : '#dc3545'}; margin-left: 10px;">
                  ${product.stock > 0 ? `En stock (${product.stock} unidades)` : 'Agotado'}
                </span>
              </div>

              <div style="margin-bottom: 15px;">
                <strong>Valoración:</strong>
                <div style="color: #ffc107; margin-top: 5px;">
                  ${renderRatingStars(product.rating)}
                  <span style="color: #666; margin-left: 10px;">${product.rating}/5</span>
                </div>
              </div>

              <div style="margin-bottom: 15px;">
                <strong>Tallas:</strong>
                <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
                  ${product.sizes.map(size => 
                    `<button type="button" style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 5px; background: white; cursor: pointer;">${size}</button>`
                  ).join('')}
                </div>
              </div>

              <div style="margin-bottom: 15px;">
                <strong>Colores:</strong>
                <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
                  ${product.colors.map(color => 
                    `<button type="button" style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 5px; background: white; cursor: pointer;">${color}</button>`
                  ).join('')}
                </div>
              </div>
            </div>
          </div>

          <div style="margin-bottom: 15px;">
            <strong>Descripción:</strong>
            <p style="color: #666; margin-top: 5px;">${product.description}</p>
          </div>

          <div>
            <strong>Características:</strong>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 8px; white-space: pre-line; font-size: 14px;">
              ${product.details}
            </div>
          </div>
        </div>
      `,
      width: 800,
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: product.stock > 0 ? 'Agregar al Carrito' : 'Notificar Disponibilidad',
      confirmButtonColor: product.stock > 0 ? '#28a745' : '#6c757d',
      cancelButtonText: 'Seguir Viendo',
      focusConfirm: false,
      preConfirm: () => {
        if (product.stock > 0) {
          handleAddToCart(product.id);
        } else {
          Swal.fire({
            title: 'Notificación Activada',
            text: `Te notificaremos cuando ${product.name} esté disponible`,
            icon: 'info',
            confirmButtonText: 'Entendido'
          });
        }
      }
    });
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
        stars.push('<i class="fas fa-star" style="color: #ffc107; margin-right: 2px;"></i>');
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push('<i class="fas fa-star-half-alt" style="color: #ffc107; margin-right: 2px;"></i>');
      } else {
        stars.push('<i class="far fa-star" style="color: #ffc107; margin-right: 2px;"></i>');
      }
    }
    return stars.join('');
  };

  if (loading) {
    return (
      <div className="art-hombre">
        <Header />
        <div className="art-loading">
          <i className="fas fa-spinner fa-spin"></i>
          Cargando pantalones para hombre...
        </div>
      </div>
    );
  }

  return (
    <div className="art-hombre">
      <Header />

      {/* PRODUCTOS DESTACADOS */}
      <section className="art-featured-products">
        <div className="container">
          <div className="art-section-title">
            <h2>Pantalones para Hombre</h2>
            <p className="art-subtitle">
              Descubre nuestra colección exclusiva de pantalones masculinos
            </p>
          </div>

          {/* BARRA DE BÚSQUEDA */}
          <div className="art-search-container">
            <form onSubmit={handleSearch} className="art-search-box">
              <input
                type="text"
                className="art-search-input"
                placeholder="Buscar pantalones por nombre, descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="art-search-button">
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>

          <div className="art-main-layout">
            {/* SIDEBAR DE CATEGORÍAS */}
            <aside className="art-categories-sidebar">
              <h3 className="art-categories-title">Categorías</h3>
              <ul className="art-category-list">
                {categories.map(category => (
                  <li
                    key={category.id}
                    className={`art-category-item ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span>{category.name}</span>
                    <span className="art-category-count">{category.count}</span>
                  </li>
                ))}
              </ul>

              {/* FILTRO DE PRECIO */}
              <div className="art-filters-section">
                <h4 className="art-filter-title">Filtrar por Precio</h4>
                <div className="art-price-filter">
                  <div className="art-price-inputs">
                    <input
                      type="number"
                      className="art-price-input"
                      placeholder="Precio mínimo"
                    />
                    <input
                      type="number"
                      className="art-price-input"
                      placeholder="Precio máximo"
                    />
                  </div>
                  <button className="art-apply-price">
                    Aplicar Precio
                  </button>
                </div>
              </div>
            </aside>

            {/* SECCIÓN DE PRODUCTOS */}
            <main className="art-products-section">
              <div className="art-products-header">
                <div className="art-products-count">
                  {filteredProducts.length} pantalón{filteredProducts.length !== 1 ? 'es' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                </div>
                <select 
                  className="art-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popularidad">Ordenar por: Popularidad</option>
                  <option value="precio_asc">Precio: Menor a Mayor</option>
                  <option value="precio_desc">Precio: Mayor a Menor</option>
                  <option value="nuevo">Más Nuevos</option>
                  <option value="valoracion">Mejor Valorados</option>
                </select>
              </div>

              <div className="art-product-grid">
                {filteredProducts.length === 0 ? (
                  <div className="art-no-products">
                    <i className="fas fa-search fa-3x mb-3"></i>
                    <h3>No se encontraron pantalones</h3>
                    <p>Intenta con otros términos de búsqueda o categorías</p>
                  </div>
                ) : (
                  currentProducts.map((product) => (
                    <div key={product.id} className="art-product-card">
                      {product.badge && (
                        <div className="art-product-badge">{product.badge}</div>
                      )}
                      
                      <div className="art-product-image">
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x300?text=Imagen+No+Disponible';
                          }}
                        />
                        <div className="art-product-actions">
                          <button 
                            onClick={() => handleQuickView(product)}
                            title="Vista rápida"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            onClick={() => handleAddToWishlist(product.id)}
                            title="Añadir a favoritos"
                          >
                            <i className="fas fa-heart"></i>
                          </button>
                        </div>
                      </div>
                      
                      <div className="art-product-info">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        
                        <div className="art-product-rating">
                          <span className="art-rating-stars" dangerouslySetInnerHTML={{__html: renderRatingStars(product.rating)}} />
                          <span className="art-rating-count">({product.rating})</span>
                        </div>
                        
                        <div className="art-product-price">
                          <div className="art-price-container">
                            {product.oldPrice && (
                              <span className="art-old-price">${product.oldPrice}</span>
                            )}
                            <span className="art-price">${product.price}</span>
                          </div>
                          <button 
                            className="art-add-to-cart"
                            onClick={() => handleAddToCart(product.id)}
                            disabled={product.stock === 0}
                            title="Añadir al carrito"
                          >
                            <i className="fas fa-shopping-cart"></i>
                            Agregar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="art-pagination">
                  <button 
                    className="art-pagination-button"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      className={`art-pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button 
                    className="art-pagination-button"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
      <Footer/>
      <FloatingWhatsApp/>
    </div>
  );
}