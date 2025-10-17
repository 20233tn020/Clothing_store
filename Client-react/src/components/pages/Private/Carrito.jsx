import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Carrito.css';
import { Header, Header_Carrito } from '../../Layout/header/Header';
import { Footer } from '../../Layout/footer/Footer';
import { FloatingWhatsApp } from '../../FloatingWhatsApp/FloatingWhatsApp';

export default function Carrito() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(2);
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Camisa Formal Azul Marino",
      description: "Camisa de vestir en algodón egipcio, perfecta para ocasiones formales.",
      price: 49.99,
      oldPrice: 59.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      name: "Camisa Casual a Cuadros",
      description: "Estilo relajado con diseño a cuadros, ideal para looks informales.",
      price: 36.79,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1593030103066-0093718ufeb9?auto=format&fit=crop&w=500&q=80"
    }
  ]);

  const handleProceedToPay = () => {
    navigate('/Pagar');
  };

  const handleRemoveItem = (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    setCartItems(updatedItems.length);
  };

  const handleQuantityChange = (id, change) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return { ...item, quantity: newQuantity >= 1 ? newQuantity : 1 };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const handleClearCart = () => {
    setItems([]);
    setCartItems(0);
  };

  const handleAddRecommended = (product) => {
    const newItem = {
      id: Date.now(),
      name: product.name,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice,
      quantity: 1,
      image: product.image
    };
    setItems([...items, newItem]);
    setCartItems(cartItems + 1);
  };

  // Calcular totales
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 5.99;
  const discount = 10.00;
  const total = subtotal + shipping - discount;

  const recommendedProducts = [
    {
      id: 1,
      name: "Camisa Oxford Gris",
      description: "Clásica camisa Oxford en color gris, versátil para looks casuales.",
      price: 42.49,
      oldPrice: 49.99,
      image: "https://images.unsplash.com/photo-1525450824782-b60f5a1d654a?auto=format&fit=crop&w=500&q=80",
      badge: "-15%"
    },
    {
      id: 2,
      name: "Polo Clásico Blanco",
      description: "Polo de algodón pima, ideal para looks casuales y semi-formales.",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
      badge: "Nuevo"
    },
    {
      id: 3,
      name: "Camisa Denim Azul",
      description: "Camisa de mezclilla resistente, perfecta para un estilo casual.",
      price: 45.99,
      image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=500&q=80"
    }
  ];

  return (
    <div className="carrito-page">
      <Header/>
      <Header_Carrito/>
      
      <div className="cart-container">
        <div className="section-title">
          <h2>Tu selección de productos</h2>
        </div>
        <p className="section-subtitle">Revisa y modifica los artículos antes de finalizar tu compra</p>

        <div className="cart-content">
          <div className="cart-main">
            <div className="cart-header">
              <div className="cart-count">{cartItems} artículo{cartItems !== 1 ? 's' : ''} en el carrito</div>
              {cartItems > 0 && (
                <button className="clear-cart" onClick={handleClearCart}>
                  Vaciar carrito
                </button>
              )}
            </div>

            {cartItems === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <h3 className="empty-title">Tu carrito está vacío</h3>
                <p className="empty-text">Aún no has añadido ningún producto a tu carrito. Explora nuestra colección y añade los artículos que más te gusten.</p>
                <a href="#" className="btn-primary">Explorar Productos</a>
              </div>
            ) : (
              <>
                <div className="cart-items" id="cart-items">
                  {items.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        <img src={item.image} alt={item.name}/>
                      </div>
                      <div className="cart-item-details">
                        <div>
                          <h3 className="cart-item-title">{item.name}</h3>
                          <p className="cart-item-description">{item.description}</p>
                          <div className="cart-item-price">
                            {item.oldPrice && (
                              <span className="cart-item-old-price">${item.oldPrice}</span>
                            )}
                            <span className="price">${item.price}</span>
                          </div>
                        </div>
                        <div className="cart-item-controls">
                          <div className="quantity-controls">
                            <button 
                              className="quantity-btn minus" 
                              onClick={() => handleQuantityChange(item.id, -1)}
                            >
                              -
                            </button>
                            <input 
                              type="text" 
                              className="quantity-input" 
                              value={item.quantity} 
                              readOnly
                            />
                            <button 
                              className="quantity-btn plus" 
                              onClick={() => handleQuantityChange(item.id, 1)}
                            >
                              +
                            </button>
                          </div>
                          <button 
                            className="remove-item"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <i className="fas fa-trash"></i> Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="recommendations">
                  <h3 className="section-title" style={{fontSize: '1.8rem', textAlign: 'left'}}>
                    Productos que te pueden gustar
                  </h3>
                  <div className="recommendations-grid">
                    {recommendedProducts.map(product => (
                      <div key={product.id} className="product-card">
                        {product.badge && (
                          <div className="product-badge">{product.badge}</div>
                        )}
                        <div className="product-image">
                          <img src={product.image} alt={product.name}/>
                        </div>
                        <div className="product-info">
                          <h3>{product.name}</h3>
                          <p>{product.description}</p>
                          <div className="product-price">
                            <div>
                              {product.oldPrice && (
                                <span className="old-price">${product.oldPrice}</span>
                              )}
                              <span className="price">${product.price}</span>
                            </div>
                            <button 
                              className="add-to-cart"
                              onClick={() => handleAddRecommended(product)}
                            >
                              <i className="fas fa-plus"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          
          {cartItems > 0 && (
            <div className="cart-summary">
              <h3 className="summary-title">Resumen de compra</h3>
              
              <div className="summary-row">
                <span>Subtotal ({cartItems} producto{cartItems !== 1 ? 's' : ''})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Envío</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Descuento</span>
                <span style={{color: '#4CAF50'}}>-${discount.toFixed(2)}</span>
              </div>
              
              <div className="summary-row summary-total">
                <span>Total</span>
                <span className="amount">${total.toFixed(2)}</span>
              </div>
              
              <div className="promo-code">
                <p style={{marginBottom: '10px', fontWeight: '600'}}>¿Tienes un código de descuento?</p>
                <div className="promo-input">
                  <input type="text" placeholder="Ingresa tu código"/>
                  <button className="btn-apply">Aplicar</button>
                </div>
              </div>
              
              <button className="checkout-btn" onClick={handleProceedToPay}>
                <i className="fas fa-lock"></i> Proceder al pago
              </button>
              
              <div className="secure-checkout">
                <i className="fas fa-shield-alt"></i>
                <span>Compra 100% segura y protegida</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer/>
      <FloatingWhatsApp/>
    </div>
  );
}