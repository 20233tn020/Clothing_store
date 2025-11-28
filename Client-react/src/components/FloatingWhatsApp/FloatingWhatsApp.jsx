import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "./FloatingWhatsApp.css";

export const FloatingWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef(null);

  // Mensaje de bienvenida automático con delay
  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      if (!isOpen && messages.length === 0) {
        setUnreadCount(1);
      }
    }, 1500);

    return () => clearTimeout(welcomeTimer);
  }, [isOpen, messages.length]);

  // Simular cambios de estado de conexión
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Animaciones mejoradas
  const floatAnimation = {
    initial: { scale: 0, y: 50, rotate: -180 },
    animate: { 
      scale: 1, 
      y: 0,
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 400,
        damping: 15
      }
    },
    hover: { 
      scale: 1.1,
      y: -5,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.9 }
  };

  const windowAnimation = {
    initial: { opacity: 0, y: 30, scale: 0.9 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: { 
      opacity: 0, 
      y: 30, 
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  const messageAnimation = {
    initial: { opacity: 0, y: 10, scale: 0.8 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  // Inicializar conversación con mensaje de bienvenida mejorado
  const initializeChat = () => {
    if (messages.length === 0) {
      const welcomeMessage = {
        id: 1,
        text: "¡Hola! Soy Alex, tu especialista en Fashion Luxt. Estoy aquí para ayudarte con cualquier consulta sobre nuestros productos, pedidos o servicios corporativos.",
        isBot: true,
        timestamp: new Date(),
        type: "welcome",
        options: [
          "📦 Seguimiento de pedido",
          "🎯 Consultar productos", 
          "💼 Servicio corporativo",
          "🛠️ Soporte técnico",
          "👨‍💼 Hablar con agente"
        ]
      };
      setMessages([welcomeMessage]);
    }
  };

  const handleFloatClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
      initializeChat();
    } else {
      setIsMinimized(!isMinimized);
    }
  };

  const handleQuickAction = async (action) => {
    switch(action) {
      case "👨‍💼 Hablar con agente":
        await Swal.fire({
          title: 'Conectar con Agente',
          html: `
            <div class="agent-modal">
              <div class="agent-avatar">👨‍💼</div>
              <h4>¿Preferiría hablar con un agente humano?</h4>
              <p>Podemos conectarle inmediatamente con nuestro equipo de soporte.</p>
              <div class="contact-options">
                <button class="contact-btn whatsapp">📱 WhatsApp</button>
                <button class="contact-btn phone">📞 Llamada</button>
                <button class="contact-btn email">✉️ Email</button>
              </div>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: 'Solicitar contacto',
          confirmButtonColor: 'var(--primary)',
          customClass: {
            popup: 'corporate-swal'
          }
        });
        break;
      
      case "💼 Servicio corporativo":
        await Swal.fire({
          title: 'Servicio Corporativo',
          html: `
            <div class="corporate-modal">
              <h4>Fashion Luxt Business</h4>
              <p>Soluciones para empresas y mayoristas:</p>
              <ul>
                <li>✅ Descuentos corporativos</li>
                <li>✅ Pedidos personalizados</li>
                <li>✅ Facturación electrónica</li>
                <li>✅ Account management</li>
              </ul>
            </div>
          `,
          confirmButtonText: 'Solicitar información',
          confirmButtonColor: 'var(--primary)'
        });
        break;
    }
  };

  const handleResponse = async (option) => {
    const userMessage = {
      id: Date.now(),
      text: option,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Manejar acciones rápidas
    if (option === "👨‍💼 Hablar con agente" || option === "💼 Servicio corporativo") {
      await handleQuickAction(option);
    }

    setIsTyping(true);
    
    setTimeout(() => {
      let botResponse;
      switch(option) {
        case "📦 Seguimiento de pedido":
          botResponse = {
            id: Date.now() + 1,
            text: "Para localizar su pedido, puedo ayudarle de varias formas. ¿Tiene a mano su número de orden o prefiere buscarlo por email?",
            isBot: true,
            timestamp: new Date(),
            options: ["🔢 Número de orden", "📧 Buscar por email", "📞 Llamar a logística", "⬅️ Menú principal"]
          };
          break;
        case "🎯 Consultar productos":
          botResponse = {
            id: Date.now() + 1,
            text: "Perfecto. Tenemos varias categorías disponibles. ¿Le interesa ver nuestra nueva colección o busca algo específico?",
            isBot: true,
            timestamp: new Date(),
            options: ["🆕 Nueva colección", "🔥 Productos populares", "🎁 Ofertas especiales", "🔍 Búsqueda personalizada"]
          };
          break;
        case "🛠️ Soporte técnico":
          botResponse = {
            id: Date.now() + 1,
            text: "Para soporte técnico, puedo ayudarle con:\n\n• Problemas con la web\n• Consultas de cuenta\n• Facturación\n• Otros temas técnicos",
            isBot: true,
            timestamp: new Date(),
            options: ["🌐 Problemas web", "👤 Cuenta usuario", "🧾 Facturación", "⚙️ Otros temas"]
          };
          break;
        case "⬅️ Menú principal":
          botResponse = {
            id: Date.now() + 1,
            text: "Volviendo al menú principal. ¿En qué más puedo asistirle hoy?",
            isBot: true,
            timestamp: new Date(),
            options: [
              "📦 Seguimiento de pedido",
              "🎯 Consultar productos", 
              "💼 Servicio corporativo",
              "🛠️ Soporte técnico",
              "👨‍💼 Hablar con agente"
            ]
          };
          break;
        default:
          botResponse = {
            id: Date.now() + 1,
            text: "Entendido. He tomado nota de su consulta y nuestro equipo se pondrá en contacto si es necesario. ¿Hay algo más en lo que pueda asistirle?",
            isBot: true,
            timestamp: new Date(),
            options: ["📦 Seguimiento", "🎯 Productos", "💼 Corporativo", "🛠️ Soporte"]
          };
      }

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const userMessage = {
        id: Date.now(),
        text: inputMessage,
        isBot: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage("");
      
      setIsTyping(true);
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          text: "Gracias por su mensaje. Lo he registrado en nuestro sistema y nuestro equipo se pondrá en contacto con usted si es necesario. ¿Puedo ayudarle con algo más mientras tanto?",
          isBot: true,
          timestamp: new Date(),
          options: ["📦 Seguimiento", "🎯 Productos", "💼 Corporativo", "🛠️ Soporte"]
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1800);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    if (messages.length > 0) {
      setUnreadCount(prev => prev + 1);
    }
  };

  return (
    <div className="corporate-chatbot-enhanced">
      {/* Botón flotante mejorado */}
      <motion.div
        className="corporate-chat-float-enhanced"
        onClick={handleFloatClick}
        variants={floatAnimation}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
      >
        <motion.div 
          className="float-icon-enhanced"
          animate={{ 
            rotate: [0, -10, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatDelay: 5
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
          </svg>
        </motion.div>
        
        {unreadCount > 0 && (
          <motion.div 
            className="unread-badge-enhanced"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {unreadCount}
          </motion.div>
        )}

        {/* Efecto de pulso sutil */}
        <div className="pulse-ring"></div>
      </motion.div>

      {/* Ventana de chat mejorada */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            className="corporate-chat-window-enhanced"
            variants={windowAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Header mejorado */}
            <div className="corporate-chat-header-enhanced">
              <div className="chat-header-info-enhanced">
                <div className="company-avatar-enhanced">
                  <span>FL</span>
                  <div className={`online-status ${isOnline ? 'online' : 'away'}`}></div>
                </div>
                <div className="chat-header-text-enhanced">
                  <h4>Fashion Luxt Support</h4>
                  <span className="chat-status-enhanced">
                    {isOnline ? (
                      <>
                        <div className="status-indicator-online"></div>
                        En línea • Responde al instante
                      </>
                    ) : (
                      <>
                        <div className="status-indicator-away"></div>
                        Fuera de línea • Responderemos pronto
                      </>
                    )}
                  </span>
                </div>
              </div>
              <div className="chat-header-actions-enhanced">
                <button 
                  className="header-btn-enhanced video-btn"
                  title="Video llamada"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                  </svg>
                </button>
                <button 
                  className="header-btn-enhanced minimize-btn"
                  onClick={handleMinimize}
                  title="Minimizar"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13H5v-2h14v2z"/>
                  </svg>
                </button>
                <button 
                  className="header-btn-enhanced close-btn"
                  onClick={() => setIsOpen(false)}
                  title="Cerrar"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Área de mensajes mejorada */}
            <div className="corporate-chat-messages-enhanced">
              <div className="chat-welcome-note">
                <div className="welcome-avatar">FL</div>
                <div className="welcome-text">
                  <strong>Fashion Luxt Assistant</strong>
                  <span>Normalmente responde en segundos</span>
                </div>
              </div>

              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    className={`corporate-message-enhanced ${message.isBot ? 'bot-message' : 'user-message'} ${message.type === 'welcome' ? 'welcome-message' : ''}`}
                    variants={messageAnimation}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="message-content-enhanced">
                      {message.isBot && (
                        <div className="bot-avatar">FL</div>
                      )}
                      <div className="message-bubble-enhanced">
                        <p>{message.text}</p>
                        <span className="message-time-enhanced">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    {message.options && (
                      <motion.div 
                        className="message-options-enhanced"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {message.options.map((option, index) => (
                          <motion.button
                            key={index}
                            className="option-button-enhanced"
                            onClick={() => handleResponse(option)}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {option}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div 
                  className="typing-indicator-enhanced"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="typing-avatar">FL</div>
                  <div className="typing-content">
                    <div className="typing-dots-enhanced">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span>Escribiendo...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de mensaje mejorado */}
            <div className="corporate-chat-input-enhanced">
              <div className="quick-actions">
                <button className="quick-btn">📎</button>
                <button className="quick-btn">😊</button>
                <button className="quick-btn">📷</button>
              </div>
              <div className="input-container-enhanced">
                <input
                  type="text"
                  placeholder="Escribe tu mensaje..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="message-input-enhanced"
                />
                <motion.button 
                  onClick={handleSendMessage}
                  className="send-button-enhanced"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!inputMessage.trim()}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat minimizado mejorado */}
      {isMinimized && (
        <motion.div
          className="corporate-chat-minimized-enhanced"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          onClick={() => setIsMinimized(false)}
        >
          <div className="minimized-content-enhanced">
            <div className="minimized-avatar">
              <span>FL</span>
              <div className="minimized-status"></div>
            </div>
            <div className="minimized-text">
              <span>Fashion Luxt</span>
              {unreadCount > 0 && (
                <div className="minimized-badge">{unreadCount} nuevo{unreadCount > 1 ? 's' : ''}</div>
              )}
            </div>
            <button 
              className="minimized-close"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                setIsMinimized(false);
              }}
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};