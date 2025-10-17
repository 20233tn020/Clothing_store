import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword = ({ onBackToLogin, onShowResetPassword }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ text: 'Por favor, ingresa tu correo electrónico', type: 'error' });
      return;
    }

    if (!isValidEmail(email)) {
      setMessage({ text: 'Por favor, ingresa un correo electrónico válido', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Simular envío de email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage({ 
        text: '¡Enlace de recuperación enviado! Revisa tu correo electrónico', 
        type: 'success' 
      });
      
      // Mostrar pantalla de verificación de código después de 3 segundos
      setTimeout(() => {
        onShowResetPassword(email);
      }, 3000);
      
    } catch (error) {
      setMessage({ 
        text: 'Error al enviar el enlace. Intenta nuevamente.', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h2>Recuperar Contraseña</h2>
          <p>Te enviaremos un enlace para restablecer tu contraseña</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Enviando...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i> Enviar Enlace
              </>
            )}
          </button>
        </form>

        <div className="forgot-password-footer">
          <button 
            type="button" 
            className="btn-back"
            onClick={onBackToLogin}
          >
            <i className="fas fa-arrow-left"></i> Volver al Inicio de Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;