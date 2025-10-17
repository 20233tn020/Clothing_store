import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { Footer } from '../../Layout/footer/Footer';
import axios from 'axios';

// Importar los componentes de recuperación de contraseña
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import ResetPassword from '../ForgotPassword/ResetPassword';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  
  // Estados para manejar la vista actual (login, forgot, reset)
  const [currentView, setCurrentView] = useState('login');
  const [userEmail, setUserEmail] = useState('');
  
  const navigate = useNavigate();

  // Función para validar email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para mostrar alertas
  const showMessage = (message, type) => {
    setAlert({ show: true, message, type });
    
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 5000);
  };

  // Mostrar/ocultar contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Manejar envío del formulario de login -  CORREGIDO
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!email || !password) {
      showMessage('Por favor, completa todos los campos', 'error');
      return;
    }
    
    if (!isValidEmail(email)) {
      showMessage('Por favor, ingresa un correo electrónico válido', 'error');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post("http://127.0.0.1:5000/login", {
        email: email,
        password: password
      });

      console.log('Login exitoso:', response.data);
      
      //  GUARDAR EN LOCALSTORAGE CON LOS DATOS REALES DEL BACKEND
      const userData = {
        id: response.data.id,
        nombre: response.data.nombre,
        apellido: response.data.apellido,
        email: response.data.email,
        telefono: response.data.telefono,
        fecha_nacimiento: response.data.fecha_nacimiento,
        genero: response.data.genero,
        loginTime: new Date().toISOString(),
        /*Direccion del usuario */ 
        direccion: response.data.direccion,
        ciudad: response.data.ciudad,
        estado_provincia: response.data.estado_provincia,
        codigo_postal: response.data.codigo_postal,
        pais: response.data.pais,
        tipo_direccion:response.data.tipo_direccion,
        fecha_creacion: response.data. fecha_creacion,
        activo: response.data.activo
        
      };
      localStorage.setItem('user', JSON.stringify(userData));
      
      showMessage('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
      
      // Redirigir después de un momento
      setTimeout(() => {
        navigate('/shop');
      }, 1500);
      
    } catch (error) {
      console.log('Error en login:', error);
      
      //  MANEJO  DE ERRORES
      if (error.response && error.response.status === 401) {
        showMessage('Email o contraseña incorrectos', 'error');
      } else if (error.response && error.response.status === 404) {
        showMessage('Servicio no disponible. Intenta más tarde.', 'error');
      } else if (error.code === 'NETWORK_ERROR') {
        showMessage('Error de conexión. Verifica tu internet.', 'error');
      } else {
        showMessage('Error al iniciar sesión. Intenta nuevamente.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Resto de tu código se mantiene igual...
  const handleSocialLogin = (provider) => {
    showMessage(`Iniciando sesión con ${provider}...`, 'success');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setCurrentView('forgot');
  };

  const handleForgotPasswordSubmit = (email) => {
    setUserEmail(email);
    setCurrentView('reset');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
    setUserEmail('');
  };

  const handleBackToForgot = () => {
    setCurrentView('forgot');
  };

  // Renderizar la vista actual (tu código se mantiene igual)...
  const renderCurrentView = () => {
    switch (currentView) {
      case 'forgot':
        return (
          <ForgotPassword 
            onBackToLogin={handleBackToLogin}
            onShowResetPassword={handleForgotPasswordSubmit}
          />
        );
      
      case 'reset':
        return (
          <ResetPassword 
            email={userEmail}
            onBackToLogin={handleBackToLogin}
            onBackToForgot={handleBackToForgot}
          />
        );
      
      case 'login':
      default:
        return renderLoginForm();
    }
  };

  // Renderizar el formulario de login (tu código se mantiene igual)...
  const renderLoginForm = () => {
    return (
      <div className="login-form-container">
        <div className="login-header">
          <h2>Bienvenido de nuevo</h2>
          <p>Ingresa a tu cuenta para continuar</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Correo Electrónico</label>
            <input 
              type="email" 
              className="form-input" 
              id="email" 
              placeholder="tu@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">Contraseña</label>
            <div className="password-input-container">
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-input" 
                id="password" 
                placeholder="Tu contraseña" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <span 
                className="password-toggle" 
                onClick={togglePasswordVisibility}
              >
                <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
              </span>
            </div>
          </div>
          
          <div className="remember-forgot">
            <div className="remember-me">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Recordarme</label>
            </div>
            <a href="#" className="forgot-password-link" onClick={handleForgotPassword}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          
          <button 
            type="submit" 
            className="btn-login"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Iniciando sesión...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i> Iniciar Sesión
              </>
            )}
          </button>
          
          <div className="social-login">
            <p>O inicia sesión con</p>
            <div className="social-buttons">
              <div 
                className="social-btn google"
                onClick={() => handleSocialLogin('Google')}
              >
                <i className="fab fa-google"></i>
              </div>
              <div 
                className="social-btn facebook"
                onClick={() => handleSocialLogin('Facebook')}
              >
                <i className="fab fa-facebook-f"></i>
              </div>
              <div 
                className="social-btn twitter"
                onClick={() => handleSocialLogin('Twitter')}
              >
                <i className="fab fa-twitter"></i>
              </div>
            </div>
          </div>
          
          <div className="signup-link">
            ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="login-page">
      <header>
        <div className="logo">Fashion Luxe</div>
      </header>
      <br /><br /><br />
      
      <div className="login-container">
        {alert.show && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}
        
        {renderCurrentView()}
      </div>

      <Footer />
    </div>
  );
}

export default LoginForm;