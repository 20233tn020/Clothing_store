import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pagar.css';
import { Header, Finalizar_Compra } from '../../Layout/header/Header';
import { Footer } from '../../Layout/footer/Footer';
import axios from "axios";
import Swal from "sweetalert2";
export default function Pagar() {
  const navigate = useNavigate();
  const [cardData, setCardData] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: ''
  });
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [cardType, setCardType] = useState('');
  const [cardLogo, setCardLogo] = useState(<i className="fas fa-credit-card"></i>);

  const orderItems = [
    {
      id: 1,
      name: "Camisa Formal Azul Marino",
      quantity: 1,
      price: 49.99,
      image: "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?auto=format&fit=crop&w=100&q=80"
    },
    {
      id: 2,
      name: "Camisa Casual a Cuadros",
      quantity: 1,
      price: 36.79,
      image: "https://images.unsplash.com/photo-1593030103066-0093718efeb9?auto=format&fit=crop&w=100&q=80"
    }
  ];

  const subtotal = 86.78;
  const shipping = 5.99;
  const discount = 10.00;
  const total = 82.77;

  const detectCardType = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) {
      setCardType('visa');
      setCardLogo(<i className="fab fa-cc-visa"></i>);
    } else if (cleanNumber.startsWith('5')) {
      setCardType('mastercard');
      setCardLogo(<i className="fab fa-cc-mastercard"></i>);
    } else if (cleanNumber.startsWith('3')) {
      setCardType('amex');
      setCardLogo(<i className="fab fa-cc-amex"></i>);
    } else if (cleanNumber.startsWith('6')) {
      setCardType('discover');
      setCardLogo(<i className="fab fa-cc-discover"></i>);
    } else {
      setCardType('');
      setCardLogo(<i className="fas fa-credit-card"></i>);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    }
    return value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'number') {
      formattedValue = formatCardNumber(value);
      detectCardType(value);
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
    }
    
    setCardData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    const cardNumber = cardData.number.replace(/\s/g, '');
    if (cardNumber.length < 16) {
        Swal.fire({
          title: "Error",
          html: `
            <div style="text-align: center; padding: 15px;">
              <i class="fa-solid fa-circle-xmark" 
                 style="font-size: 60px; color: #ef4444; margin-bottom: 15px; animation: shake 0.4s ease;"></i>
              <p style="font-size: 16px; color: #010101ff;">
                Por favor, ingresa un número de tarjeta válido
              </p>
            </div>
          `,
          color: "#262626ff",
          confirmButtonText: "Reintentar",
          width: "420px",
          customClass: {
            popup: "swal2-glass",
            confirmButton: "swal2-button",
          },
          showClass: {
            popup: "animate__animated animate__shakeX",
          },
        });
      return;
    }
    
    if (cardData.holder.length < 3) {
              Swal.fire({
          title: "Error",
          html: `
            <div style="text-align: center; padding: 15px;">
              <i class="fa-solid fa-circle-xmark" 
                 style="font-size: 60px; color: #ef4444; margin-bottom: 15px; animation: shake 0.4s ease;"></i>
              <p style="font-size: 16px; color: #010101ff;">
               Por favor, ingresa el nombre del titular de la tarjeta
              </p>
            </div>
          `,
          color: "#262626ff",
          confirmButtonText: "Reintentar",
          width: "420px",
          customClass: {
            popup: "swal2-glass",
            confirmButton: "swal2-button",
          },
          showClass: {
            popup: "animate__animated animate__shakeX",
          },
        });
      return;
    }
    
    if (cardData.expiry.length !== 5) {
                    Swal.fire({
          title: "Error",
          html: `
            <div style="text-align: center; padding: 15px;">
              <i class="fa-solid fa-circle-xmark" 
                 style="font-size: 60px; color: #ef4444; margin-bottom: 15px; animation: shake 0.4s ease;"></i>
              <p style="font-size: 16px; color: #010101ff;">
              Por favor, ingresa una fecha de vencimiento válida (MM/AA)
              </p>
            </div>
          `,
          color: "#262626ff",
          confirmButtonText: "Reintentar",
          width: "420px",
          customClass: {
            popup: "swal2-glass",
            confirmButton: "swal2-button",
          },
          showClass: {
            popup: "animate__animated animate__shakeX",
          },
        });
      return;
    }
    
    if (cardData.cvv.length < 3) {
                          Swal.fire({
          title: "Error",
          html: `
            <div style="text-align: center; padding: 15px;">
              <i class="fa-solid fa-circle-xmark" 
                 style="font-size: 60px; color: #ef4444; margin-bottom: 15px; animation: shake 0.4s ease;"></i>
              <p style="font-size: 16px; color: #010101ff;">
              Por favor, ingresa un CVV válido
              </p>
            </div>
          `,
          color: "#262626ff",
          confirmButtonText: "Reintentar",
          width: "420px",
          customClass: {
            popup: "swal2-glass",
            confirmButton: "swal2-button",
          },
          showClass: {
            popup: "animate__animated animate__shakeX",
          },
        });
      return;
    }
    
    // Simular procesamiento de pago
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    submitBtn.disabled = true;
    
// Guardar el estado original del botón

submitBtn.innerHTML = `
  <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
    <div class="spinner-border spinner-border-sm" 
         style="width: 16px; height: 16px; border-width: 2px;"></div>
    Procesando pago...
  </div>
`;
submitBtn.disabled = true;

// Simular el procesamiento del pago
setTimeout(() => {
  // Mostrar alerta de éxito con estilo
  Swal.fire({
    title: "¡Pago exitoso!",
    html: `
      <div style="text-align: center; padding: 15px;">
        <i class="fa-solid fa-circle-check" 
           style="font-size: 60px; color: #4ade80; margin-bottom: 15px; animation: pop 0.4s ease;"></i>
        <p style="font-size: 16px; color: #000000ff; margin-bottom: 5px;">
          ¡Pago procesado exitosamente!
        </p>
        <p style="font-size: 14px; color: #666; margin: 0;">
          Tu pedido ha sido confirmado.
        </p>
      </div>
    `,
    color: "#262626ff",
    confirmButtonColor: "#6366F1",
    confirmButtonText: "Ver mis pedidos",
    width: "420px",
    customClass: {
      popup: "swal2-glass",
      confirmButton: "swal2-confirm-button"
    },
    showClass: {
      popup: "animate__animated animate__fadeInDown"
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp"
    }
  }).then((result) => {
    // Cuando el usuario hace clic en "Ver mis pedidos"
    if (result.isConfirmed) {
      // Navegar al perfil con la sección de pedidos activa
      navigate('/Perfil', { 
        state: { 
          activeSection: 'orders'
        } 
      });
    }
  });

  // Restaurar el botón
  submitBtn.innerHTML = originalText;
  submitBtn.disabled = false;
}, 2000);


  };

  const handleBackToCart = () => {
    navigate('/carrito');
  };

  return (
    <div className="pagar-page">
      <Header/>
      <Finalizar_Compra/>
    

      {/* CONTENIDO PRINCIPAL DEL PAGO */}
      <div className="payment-container">
        <div className="section-title">
          <h2>Información de Pago</h2>
        </div>
        <p className="section-subtitle">Completa tus datos de pago de forma segura</p>
        
        <div className="payment-content">
          {/* FORMULARIO DE PAGO */}
          <div className="payment-form-container">
            <div className="payment-form">
              <h3 className="form-title">Detalles de la Tarjeta</h3>
              
              {/* TARJETA DIGITAL */}
              <div className="card-container">
                <div 
                  className={`card ${cardType} ${isCardFlipped ? 'flipped' : ''}`} 
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                >
                  {/* FRENTE DE LA TARJETA */}
                  <div className="card-front">
                    <div className="card-logo">
                      {cardLogo}
                    </div>
                    <div className="card-chip"></div>
                    <div className="card-number">
                      {cardData.number || '**** **** **** ****'}
                    </div>
                    <div className="card-details">
                      <div className="card-holder">
                        <div className="card-label">TITULAR DE LA TARJETA</div>
                        <div>{cardData.holder.toUpperCase() || 'NOMBRE DEL TITULAR'}</div>
                      </div>
                      <div className="card-expiry">
                        <div className="card-label">VÁLIDO HASTA</div>
                        <div>{cardData.expiry || 'MM/AA'}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* REVERSO DE LA TARJETA */}
                  <div className="card-back">
                    <div className="card-stripe"></div>
                    <div className="card-signature">
                      <div>Firma del titular</div>
                    </div>
                    <div className="card-cvv">
                      <div className="card-label">CVV</div>
                      <div>{cardData.cvv || '***'}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* FORMULARIO */}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Número de Tarjeta</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    value={cardData.number}
                    onChange={(e) => handleInputChange('number', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Nombre del Titular</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Como aparece en la tarjeta"
                    value={cardData.holder}
                    onChange={(e) => handleInputChange('holder', e.target.value)}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-col">
                    <div className="form-group">
                      <label className="form-label">Fecha de Vencimiento</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="MM/AA"
                        maxLength="5"
                        value={cardData.expiry}
                        onChange={(e) => handleInputChange('expiry', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-col">
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="123"
                        maxLength="3"
                        value={cardData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        onFocus={() => setIsCardFlipped(true)}
                        onBlur={() => setIsCardFlipped(false)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="payment-actions">
                  <button type="button" className="btn-secondary" onClick={handleBackToCart}>
                    <i className="fas fa-arrow-left"></i> Volver al Carrito
                  </button>
                  <button type="submit" className="btn-primary">
                    <i className="fas fa-lock"></i> Pagar Ahora
                  </button>
                </div>
                
                <div className="secure-payment">
                  <i className="fas fa-shield-alt"></i>
                  <span>Pago 100% seguro y encriptado</span>
                </div>
              </form>
            </div>
          </div>
          
          {/* RESUMEN DE COMPRA */}
          <div className="order-summary">
            <h3 className="summary-title">Resumen de Pedido</h3>
            
            <div className="summary-row">
              <span>Subtotal (2 productos)</span>
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
            
            <div style={{marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee'}}>
              <h4 style={{marginBottom: '10px'}}>Productos en el pedido:</h4>
              {orderItems.map(item => (
                <div key={item.id} style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{width: '50px', height: '50px', borderRadius: '5px', marginRight: '10px'}}
                  />
                  <div>
                    <div style={{fontSize: '0.9rem'}}>{item.name}</div>
                    <div style={{fontSize: '0.8rem', color: '#666'}}>Cantidad: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer/>
    </div>
  );
}