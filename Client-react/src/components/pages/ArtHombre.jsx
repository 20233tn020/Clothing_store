import React, { useState, useEffect } from 'react';
import { Header } from '../Layout/header/Header';
import Swal from 'sweetalert2';
import './ArtHombre.css';
import { Footer } from '../Layout/footer/Footer';
import { FloatingWhatsApp } from '../FloatingWhatsApp/FloatingWhatsApp';
export default function ArtHombre() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [sortBy, setSortBy] = useState('popularidad');

  // Datos de ejemplo más completos
  const mockProducts = [
    {
      id: 1,
      name: "Camiseta Básica Premium",
      description: "Camiseta de algodón 100% de alta calidad, perfecta para looks casuales y elegantes. Confeccionada con materiales sostenibles y acabados de primera.",
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
      name: "Camisa Formal Clásica",
      description: "Camisa de vestir en algodón egipcio, ideal para ocasiones formales y de negocios. Diseño elegante con cuello italiano.",
      price: 59.99,
      oldPrice: 79.99,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80",
      badge: "-25%",
      rating: 4.8,
      category: "formales",
      stock: 8,
      sizes: ["M", "L", "XL", "XXL"],
      colors: ["Blanco", "Azul claro", "Rosa palo"],
      details: "• Algodón egipcio 200 hilos\n• Corte slim fit\n• Botones de madreperla\n• Planchado permanente"
    },
    {
      id: 3,
      name: "Camisa Manga Larga Casual",
      description: "Camisa casual de manga larga, perfecta para el día a día con estilo relajado pero sofisticado.",
      price: 45.99,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
      badge: null,
      rating: 4.3,
      category: "casuales",
      stock: 20,
      sizes: ["S", "M", "L"],
      colors: ["Azul marino", "Verde oliva", "Beige"],
      details: "• Mezcla algodón-lino\n• Corte regular fit\n• Bolsillo de parche\n• Lavable a máquina"
    },
    {
      id: 4,
      name: "Camisa Deportiva Performance",
      description: "Tecnología de secado rápido, ideal para actividades deportivas y outdoor. Con protección UV.",
      price: 39.99,
      oldPrice: 49.99,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=80",
      badge: "Más Vendido",
      rating: 4.7,
      category: "deportivas",
      stock: 0,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Negro", "Gris oscuro", "Azul eléctrico"],
      details: "• Tecnología dry-fit\n• Protección UV 50+\n• Costuras planas\n• Secado rápido"
    },
    {
      id: 5,
      name: "Camisa Lino Verano",
      description: "Camisa de lino natural, fresca y cómoda para los días calurosos de verano. Estilo mediterráneo.",
      price: 69.99,
      image: "https://images.unsplash.com/photo-1525479932692-5b18280efb45?auto=format&fit=crop&w=500&q=80",
      badge: "Eco",
      rating: 4.6,
      category: "verano",
      stock: 12,
      sizes: ["M", "L", "XL"],
      colors: ["Blanco natural", "Crudo", "Azul claro"],
      details: "• 100% lino natural\n• Corte oversize\n• Tejido transpirable\n• Fabricación sostenible"
    },
    {
      id: 6,
      name: "Camisa Cuadros Vintage",
      description: "Estilo retro con cuadros clásicos, perfecta para looks casuales con personalidad y carácter.",
      price: 52.99,
      oldPrice: 62.99,
      image: "https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?auto=format&fit=crop&w=500&q=80",
      badge: "Vintage",
      rating: 4.4,
      category: "casuales",
      stock: 7,
      sizes: ["S", "M", "L"],
      colors: ["Rojo/Negro", "Azul/Blanco", "Verde/Rojo"],
      details: "• Algodón brushed\n• Estilo vintage\n• Botones de madera\n• Acabados envejecidos"
    },
    {
      id: 7,
      name: "Camisa Denim Moderna",
      description: "Denim de alta calidad con corte contemporáneo. Perfecta para looks urbanos y casuales.",
      price: 65.99,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=500&q=80",
      badge: "Trending",
      rating: 4.5,
      category: "denim",
      stock: 10,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Azul claro", "Azul oscuro", "Negro"],
      details: "• Denim premium\n• Corte slim fit\n• Lavado ecológico\n• Bolsillos funcionales"
    },
    {
      id: 8,
      name: "Camisa Elegante Negra",
      description: "Camisa de vestir en color negro, ideal para eventos formales y ocasiones especiales.",
      price: 75.99,
      oldPrice: 89.99,
      image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=500&q=80",
      badge: "-15%",
      rating: 4.9,
      category: "formales",
      stock: 5,
      sizes: ["M", "L", "XL"],
      colors: ["Negro", "Charcoal", "Navy"],
      details: "• Popelín de algodón\n• Corte modern fit\n• Detalles en contraste\n• Para eventos"
    }
  ];

  const categories = [
    { id: 'todos', name: 'Todas las Camisas', count: mockProducts.length },
    { id: 'camisetas', name: 'Camisetas Básicas', count: mockProducts.filter(p => p.category === 'camisetas').length },
    { id: 'formales', name: 'Camisas Formales', count: mockProducts.filter(p => p.category === 'formales').length },
    { id: 'casuales', name: 'Casuales', count: mockProducts.filter(p => p.category === 'casuales').length },
    { id: 'deportivas', name: 'Deportivas', count: mockProducts.filter(p => p.category === 'deportivas').length },
    { id: 'verano', name: 'Verano', count: mockProducts.filter(p => p.category === 'verano').length },
    { id: 'denim', name: 'Denim', count: mockProducts.filter(p => p.category === 'denim').length }
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
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [products, searchTerm, selectedCategory, sortBy]);

const handleQuickView = (product) => {
  // Función para generar estrellas de rating
  const generateRatingStars = (rating) => {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars += '<i class="fas fa-star" style="color: #FFD700; font-size: 14px; text-shadow: 0 1px 2px rgba(0,0,0,0.1);"></i>';
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt" style="color: #FFD700; font-size: 14px; text-shadow: 0 1px 2px rgba(0,0,0,0.1);"></i>';
      } else {
        stars += '<i class="far fa-star" style="color: #FFD700; font-size: 14px; text-shadow: 0 1px 2px rgba(0,0,0,0.1);"></i>';
      }
    }
    return stars;
  };

  // Función para determinar color del badge
  const getBadgeColor = (badge) => {
    const colors = {
      'Nuevo': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      '-25%': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'Más Vendido': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'Eco': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'Vintage': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'Trending': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      '-15%': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    };
    return colors[badge] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  // Calcular ahorro
  const savings = product.oldPrice ? Math.round((1 - product.price/product.oldPrice) * 100) : 0;

  Swal.fire({
    title: '',
    html: `
      <div class="quickview-ultra" style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 20px; overflow: hidden;">
        
        <!-- HEADER ELEGANTE -->
        <div class="product-header" style="background: white; padding: 25px 30px 0; border-bottom: 1px solid #f1f5f9;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 15px;">
              ${product.badge ? `
                <div class="badge-premium" style="background: ${getBadgeColor(product.badge)}; color: white; padding: 10px 24px; border-radius: 30px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                  ${product.badge}
                </div>
              ` : ''}
              <div class="product-meta" style="display: flex; align-items: center; gap: 20px;">
                <div style="color: #64748b; font-size: 13px; font-weight: 600; background: #f8fafc; padding: 6px 12px; border-radius: 20px;">
                  <i class="fas fa-hashtag" style="margin-right: 5px;"></i>SKU: ${String(product.id).padStart(6, '0')}
                </div>
                <div style="color: #10b981; font-size: 13px; font-weight: 600; background: #ecfdf5; padding: 6px 12px; border-radius: 20px;">
                  <i class="fas fa-check-circle" style="margin-right: 5px;"></i>Verificado
                </div>
              </div>
            </div>
            <div class="social-share" style="display: flex; gap: 8px;">
              <button style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid #e2e8f0; background: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; color: #64748b;">
                <i class="fas fa-share-alt"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="product-main-content" style="padding: 0;">
          <div class="product-layout" style="display: grid; grid-template-columns: 480px 1fr; min-height: 600px;">
            
            <!-- SIDEBAR DE IMAGEN LUXURY -->
            <div class="image-sidebar" style="background: white; padding: 30px; border-right: 1px solid #f1f5f9; position: relative;">
              
              <!-- IMAGEN PRINCIPAL CON ZOOM -->
              <div class="main-image-container" style="position: relative; margin-bottom: 25px;">
                <div class="image-wrapper" style="width: 100%; height: 400px; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.1); position: relative;">
                  <img 
                    src="${product.image}" 
                    alt="${product.name}" 
                    style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease;"
                    onerror="this.src='https://via.placeholder.com/500x400/f8fafc/94a3b8?text=Imagen+Premium'"
                    class="zoom-image"
                  />
                  <!-- OVERLAY DE ACCIONES -->
                  <div class="image-actions" style="position: absolute; top: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px;">
                    <button class="action-btn" style="width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.95); border: 1px solid rgba(226,232,240,0.8); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(10px); box-shadow: 0 8px 25px rgba(0,0,0,0.1);">
                      <i class="fas fa-expand" style="color: #475569; font-size: 14px;"></i>
                    </button>
                    <button class="action-btn" style="width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.95); border: 1px solid rgba(226,232,240,0.8); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(10px); box-shadow: 0 8px 25px rgba(0,0,0,0.1);">
                      <i class="fas fa-heart" style="color: #ef4444; font-size: 14px;"></i>
                    </button>
                  </div>
                </div>
                
                <!-- BADGE DE STOCK FLOTANTE -->
                <div class="stock-floating" style="position: absolute; bottom: 20px; left: 20px;">
                  <div style="background: ${product.stock > 0 ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'}; color: white; padding: 10px 20px; border-radius: 25px; font-weight: 700; font-size: 13px; box-shadow: 0 8px 20px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 8px;">
                    <i class="fas ${product.stock > 0 ? 'fa-check' : 'fa-clock'}"></i>
                    ${product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
                  </div>
                </div>
              </div>

              <!-- GALLERÍA DE MINIATURAS ENHANCED -->
              <div class="thumbnail-gallery" style="display: flex; gap: 12px; justify-content: center; padding: 20px 0;">
                <div class="thumbnail active" style="width: 70px; height: 70px; border-radius: 12px; overflow: hidden; border: 3px solid #3b82f6; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);">
                  <img src="${product.image}" alt="Thumb 1" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                ${[2, 3, 4].map(i => `
                  <div class="thumbnail" style="width: 70px; height: 70px; border-radius: 12px; overflow: hidden; border: 2px solid #e2e8f0; cursor: pointer; transition: all 0.3s ease; position: relative;">
                    <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #f8fafc, #e2e8f0); display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 20px;">
                      <i class="fas fa-plus"></i>
                    </div>
                    <div style="position: absolute; bottom: 5px; right: 5px; background: #64748b; color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700;">
                      +${i}
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- FEATURES BAR LATERAL -->
              <div class="side-features" style="background: white; border-radius: 16px; padding: 25px; margin-top: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                <h4 style="color: #1e293b; font-size: 16px; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                  <i class="fas fa-gem" style="color: #8b5cf6;"></i>
                  Beneficios Exclusivos
                </h4>
                <div style="display: flex; flex-direction: column; gap: 15px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); display: flex; align-items: center; justify-content: center;">
                      <i class="fas fa-shipping-fast" style="color: white; font-size: 14px;"></i>
                    </div>
                    <div>
                      <div style="font-weight: 600; color: #1e293b; font-size: 14px;">Envío Express</div>
                      <div style="color: #64748b; font-size: 12px;">Entrega en 24-48h</div>
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, #10b981, #059669); display: flex; align-items: center; justify-content: center;">
                      <i class="fas fa-shield-alt" style="color: white; font-size: 14px;"></i>
                    </div>
                    <div>
                      <div style="font-weight: 600; color: #1e293b; font-size: 14px;">Garantía Extendida</div>
                      <div style="color: #64748b; font-size: 12px;">2 años oficial</div>
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, #f59e0b, #d97706); display: flex; align-items: center; justify-content: center;">
                      <i class="fas fa-undo" style="color: white; font-size: 14px;"></i>
                    </div>
                    <div>
                      <div style="font-weight: 600; color: #1e293b; font-size: 14px;">Devolución Fácil</div>
                      <div style="color: #64748b; font-size: 12px;">30 días sin preguntas</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- CONTENIDO PRINCIPAL LUXURY -->
            <div class="product-content" style="background: white; padding: 30px 40px; position: relative;">
              
              <!-- NOMBRE Y RATING -->
              <div class="product-title-section" style="margin-bottom: 25px;">
                <h1 class="product-name" style="font-size: 32px; font-weight: 800; color: #0f172a; line-height: 1.2; margin-bottom: 15px; background: linear-gradient(135deg, #0f172a, #475569); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                  ${product.name}
                </h1>
                
                <div class="rating-section" style="display: flex; align-items: center; gap: 20px; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9;">
                  <div class="stars" style="display: flex; align-items: center; gap: 6px;">
                    ${generateRatingStars(product.rating)}
                    <span style="color: #475569; font-size: 15px; font-weight: 600; margin-left: 10px;">${product.rating}/5</span>
                  </div>
                  <div class="reviews" style="color: #3b82f6; font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: underline;">
                    128 reseñas verificadas
                  </div>
                  <div class="best-seller" style="background: #fef3c7; color: #d97706; padding: 4px 12px; border-radius: 15px; font-size: 12px; font-weight: 700;">
                    <i class="fas fa-crown" style="margin-right: 5px;"></i>Best Seller
                  </div>
                </div>
              </div>

              <!-- PRECIO Y DESCUENTO -->
              <div class="price-section" style="margin-bottom: 30px;">
                <div class="price-display" style="display: flex; align-items: center; gap: 20px; margin-bottom: 10px;">
                  <span style="font-size: 42px; font-weight: 900; color: #0f172a; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">$${product.price}</span>
                  ${product.oldPrice ? `
                    <div style="display: flex; align-items: center; gap: 15px;">
                      <span style="font-size: 24px; color: #94a3b8; text-decoration: line-through; font-weight: 600;">$${product.oldPrice}</span>
                      <span style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 8px 16px; border-radius: 25px; font-size: 16px; font-weight: 800; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);">
                        -${savings}% OFF
                      </span>
                    </div>
                  ` : ''}
                </div>
                <div class="price-savings" style="color: #059669; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                  <i class="fas fa-piggy-bank"></i>
                  ${savings > 0 ? `Estás ahorrando $${(product.oldPrice - product.price).toFixed(2)}` : 'Precio final • IVA incluido'}
                </div>
              </div>

              <!-- SELECTOR DE OPCIONES -->
              <div class="options-section" style="margin-bottom: 35px;">
                
                <!-- SELECTOR DE TALLA -->
                <div class="size-selector" style="margin-bottom: 25px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <label style="font-weight: 700; color: #1e293b; font-size: 16px;">Selecciona tu talla:</label>
                    <a href="#" style="color: #3b82f6; font-size: 14px; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 6px;">
                      <i class="fas fa-ruler"></i>Guía de tallas
                    </a>
                  </div>
                  <div class="size-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
                    ${product.sizes.map((size, index) => `
                      <button 
                        type="button"
                        class="size-option ${index === 2 ? 'active' : ''}"
                        style="padding: 16px 8px; border: 2px solid ${index === 2 ? '#3b82f6' : '#e2e8f0'}; 
                               background: ${index === 2 ? '#3b82f6' : 'white'}; 
                               color: ${index === 2 ? 'white' : '#475569'}; 
                               border-radius: 12px; 
                               font-weight: 700;
                               font-size: 15px;
                               cursor: pointer;
                               transition: all 0.3s ease;
                               position: relative;"
                      >
                        ${size}
                        ${index === 2 ? '<div style="position: absolute; top: -5px; right: -5px; width: 20px; height: 20px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px;"><i class="fas fa-check"></i></div>' : ''}
                      </button>
                    `).join('')}
                  </div>
                </div>

                <!-- SELECTOR DE COLOR -->
                <div class="color-selector" style="margin-bottom: 30px;">
                  <label style="font-weight: 700; color: #1e293b; font-size: 16px; display: block; margin-bottom: 15px;">Color:</label>
                  <div class="color-grid" style="display: flex; gap: 12px; flex-wrap: wrap;">
                    ${product.colors.map((color, index) => `
                      <button 
                        type="button"
                        class="color-option ${index === 0 ? 'active' : ''}"
                        style="padding: 14px 20px; 
                               border: 2px solid ${index === 0 ? '#3b82f6' : '#e2e8f0'}; 
                               background: white; 
                               color: #475569; 
                               border-radius: 12px; 
                               font-weight: 600;
                               cursor: pointer;
                               transition: all 0.3s ease;
                               display: flex;
                               align-items: center;
                               gap: 10px;
                               min-width: 160px;
                               min-height: 60px"
                      >
                        <div style="width: 20px; height: 20px; border-radius: 50%; background: ${getColorHex(color)}; border: 2px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"></div>
                        ${color}
                      </button>
                    `).join('')}
                  </div>
                </div>

                <!-- SELECTOR DE CANTIDAD Y ACCIONES -->
                <div class="action-section" style="display: grid; grid-template-columns: auto 1fr; gap: 15px; align-items: center;">
                  <div class="quantity-selector" style="display: flex; align-items: center; border: 2px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: white;">
                    <button style="width: 50px; height: 50px; border: none; background: #f8fafc; cursor: pointer; font-size: 18px; color: #475569; transition: all 0.3s ease;">-</button>
                    <input type="text" value="1" style="width: 70px; height: 50px; border: none; text-align: center; font-weight: 700; background: white; font-size: 16px; color: #1e293b;" readonly>
                    <button style="width: 50px; height: 50px; border: none; background: #f8fafc; cursor: pointer; font-size: 18px; color: #475569; transition: all 0.3s ease;">+</button>
                  </div>
                  
                  <button 
                    class="add-to-cart-main"
                    style="height: 54px; 
                           background: ${product.stock > 0 ? 'linear-gradient(135deg, #0f172a, #1e293b)' : '#94a3b8'}; 
                           color: white; 
                           border: none; 
                           border-radius: 12px; 
                           font-weight: 700; 
                           font-size: 16px;
                           cursor: ${product.stock > 0 ? 'pointer' : 'not-allowed'};
                           transition: all 0.3s ease;
                           display: flex;
                           align-items: center;
                           justify-content: center;
                           gap: 12px;
                           box-shadow: 0 8px 25px rgba(0,0,0,0.15);"
                  >
                    <i class="fas fa-shopping-cart"></i>
                    ${product.stock > 0 ? 'Agregar al Carrito - $' + product.price : 'Producto Agotado'}
                  </button>
                </div>
              </div>

              <!-- GARANTÍA PREMIUM -->
              <div class="premium-guarantee" style="background: linear-gradient(135deg, #fef7ed, #fffbeb); border: 1px solid #fed7aa; border-radius: 16px; padding: 20px; margin-bottom: 25px;">
                <div style="display: flex; align-items: center; gap: 15px;">
                  <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #d97706); display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-crown" style="color: white; font-size: 16px;"></i>
                  </div>
                  <div>
                    <div style="font-weight: 800; color: #92400e; font-size: 16px; margin-bottom: 4px;">Garantía Premium</div>
                    <div style="color: #b45309; font-size: 14px;">Este producto incluye 2 años de garantía extendida y soporte premium</div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    `,
    width: 1100,
    showCloseButton: true,
    showCancelButton: true,
    confirmButtonText: product.stock > 0 ? 
      `<div style="display: flex; align-items: center; gap: 10px; font-weight: 700;">
        <i class="fas fa-bolt"></i>
        Comprar Ahora
      </div>` : 
      `<div style="display: flex; align-items: center; gap: 10px; font-weight: 700;">
        <i class="fas fa-bell"></i>
        Notificar Disponibilidad
      </div>`,
    confirmButtonColor: product.stock > 0 ? '#059669' : '#64748b',
    cancelButtonText: `<div style="display: flex; align-items: center; gap: 10px; font-weight: 700;">
      <i class="fas fa-shopping-cart"></i>
      Agregar al Carrito
    </div>`,
    cancelButtonColor: '#3b82f6',
    focusConfirm: false,
    customClass: {
      popup: 'ultra-premium-popup',
      actions: 'premium-actions',
      confirmButton: 'premium-confirm-btn',
      cancelButton: 'premium-cancel-btn'
    },
    showDenyButton: true,
    denyButtonText: `<div style="display: flex; align-items: center; gap: 10px; font-weight: 700;">
      <i class="far fa-heart"></i>
      Favoritos
    </div>`,
    denyButtonColor: '#ef4444',
    preConfirm: () => {
      if (product.stock > 0) {
        Swal.fire({
          title: '🚀 ¡Compra Rápida!',
          html: `
            <div style="text-align: center; padding: 30px;">
              <div style="font-size: 5em; margin-bottom: 20px;">🎉</div>
              <h3 style="color: #0f172a; margin-bottom: 15px; font-weight: 800;">Redirigiendo al checkout seguro...</h3>
              <p style="color: #475569; line-height: 1.6; font-size: 16px;">
                Estamos preparando tu pedido de <strong style="color: #059669;">${product.name}</strong><br>
                Serás redirigido en segundos a nuestro sistema de pago seguro.
              </p>
            </div>
          `,
          icon: 'success',
          showConfirmButton: false,
          timer: 2500,
          background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)'
        });
      } else {
        Swal.fire({
          title: '🔔 Notificación Premium',
          html: `
            <div style="text-align: center; padding: 30px;">
              <div style="font-size: 5em; color: #3b82f6; margin-bottom: 20px;">⭐</div>
              <h3 style="color: #0f172a; margin-bottom: 15px; font-weight: 800;">Te avisaremos primero</h3>
              <p style="color: #475569; line-height: 1.6; font-size: 16px;">
                Has sido añadido a la lista de espera exclusiva para<br>
                <strong style="color: #3b82f6;">${product.name}</strong>.<br>
                Recibirás una notificación premium cuando esté disponible.
              </p>
            </div>
          `,
          confirmButtonText: '¡Perfecto!',
          confirmButtonColor: '#3b82f6',
          background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)'
        });
      }
    }
  });
};

// Función auxiliar para colores (la misma de antes)
const getColorHex = (color) => {
  const colorMap = {
    'Blanco': '#FFFFFF',
    'Negro': '#000000',
    'Azul': '#3B82F6',
    'Gris': '#6B7280',
    'Azul claro': '#93C5FD',
    'Rosa palo': '#FBCFE8',
    'Azul marino': '#1E3A8A',
    'Verde oliva': '#84CC16',
    'Beige': '#FEF3C7',
    'Gris oscuro': '#374151',
    'Azul eléctrico': '#2563EB',
    'Blanco natural': '#F9FAFB',
    'Crudo': '#F3F4F6',
    'Rojo/Negro': '#DC2626',
    'Azul/Blanco': '#1D4ED8',
    'Verde/Rojo': '#15803D',
    'Charcoal': '#334155',
    'Navy': '#1E40AF'
  };
  return colorMap[color] || '#6B7280';
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
      showCancelButton: true,
      confirmButtonText: 'Ver Carrito',
      cancelButtonText: 'Seguir Comprando',
      confirmButtonColor: '#007bff'
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirigir al carrito
        console.log('Ir al carrito');
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // La búsqueda se maneja automáticamente por el useEffect
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
    return <span className="art-rating-stars">{stars}</span>;
  };

  if (loading) {
    return (
      <div className="art-hombre">
        <Header />
        <div className="art-loading">
          <i className="fas fa-spinner fa-spin me-2"></i>
          Cargando productos...
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
            <h2>Camisas para Hombre</h2>
            <p className="art-subtitle">
              Descubre nuestra colección exclusiva de camisas masculinas
            </p>
          </div>

          {/* BARRA DE BÚSQUEDA */}
          <div className="art-search-container">
            <form onSubmit={handleSearch} className="art-search-box">
              <input
                type="text"
                className="art-search-input"
                placeholder="Buscar camisas por nombre, descripción..."
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
                      placeholder="Mín"
                    />
                    
                    <input
                      type="number"
                      className="art-price-input"
                      placeholder="Máx"
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
                  {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
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
                    <i className="fas fa-search fa-3x mb-3" style={{color: '#ddd'}}></i>
                    <h3>No se encontraron productos</h3>
                    <p>Intenta con otros términos de búsqueda o categorías</p>
                  </div>
                ) : (
                  filteredProducts.map((product) => (
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
                            title="Vista rápida"
                            onClick={() => handleQuickView(product)}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            title="Añadir a favoritos"
                            onClick={() => handleAddToWishlist(product.id)}
                          >
                            <i className="fas fa-heart"></i>
                          </button>
                          <button title="Comparar producto">
                            <i className="fas fa-exchange-alt"></i>
                          </button>
                        </div>
                      </div>
                      
                      <div className="art-product-info">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        
                        <div className="art-product-rating">
                          {renderRatingStars(product.rating)}
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
                            title="Añadir al carrito"
                            onClick={() => handleAddToCart(product.id)}
                            disabled={product.stock === 0}
                          >
                            <i className="fas fa-shopping-cart"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </main>
          </div>
        </div>
      </section>
            <Footer/>
            <FloatingWhatsApp/>
    </div>
  );
}