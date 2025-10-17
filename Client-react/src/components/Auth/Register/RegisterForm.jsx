import React, { useState } from "react";
import ProgressBar from "./ProgressBar";
import "./RegisterForm.css";
import { Footer } from "../../Layout/footer/Footer";
import axios from "axios";

const RegisterForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [formData, setFormData] = useState({
    // Paso 1 - Campos obligatorios para tu BD
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Paso 1 - Campos opcionales
    telefono: '',
    fecha_nacimiento: '',
    genero: '',
    // Paso 2 - Dirección (opcional)
    direccion: '',
    ciudad: '',
    estado_provincia: '',
    codigo_postal: '',
    pais: '',
    tipo_direccion: 'casa',
    // Paso 3 - Preferencias (no van a la BD)
    preferences: [],
    sizes: [],
    referral: '',
    terms: false,
    newsletter: false
  });
  
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateStep = (step) => {
    if (step === 1) {
      const { nombre, apellido, email, password, confirmPassword } = formData;
      
      if (!nombre || !apellido || !email || !password || !confirmPassword) {
        showMessage('Por favor, completa todos los campos obligatorios.', 'error');
        return false;
      } else if (!isValidEmail(email)) {
        showMessage('Por favor, ingresa un correo electrónico válido.', 'error');
        return false;
      } else if (password !== confirmPassword) {
        showMessage('Las contraseñas no coinciden.', 'error');
        return false;
      } else if (password.length < 6) {
        showMessage('La contraseña debe tener al menos 6 caracteres.', 'error');
        return false;
      }
    }
    return true;
  };

  const goToStep = (step) => {
    if (step < 1 || step > totalSteps) return;
    
    if (step > currentStep && !validateStep(currentStep)) {
      return;
    }
    
    setCurrentStep(step);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.terms) {
      showMessage('Debes aceptar los términos y condiciones.', 'error');
      return;
    }

    try {
      // ✅ CORREGIDO: Enviar datos con los nombres de tu BD
      const response = await axios.post('http://127.0.0.1:5000/Signup', {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono || null,
        fecha_nacimiento: formData.fecha_nacimiento || null,
        genero: formData.genero || null,
        direccion: formData.direccion || null,
        ciudad: formData.ciudad || null,
        estado_provincia: formData.estado_provincia || null,
        codigo_postal: formData.codigo_postal || null,
        pais: formData.pais || null,
        tipo_direccion: formData.tipo_direccion || null
      });

      console.log('Registro exitoso:', response.data);
      showMessage('¡Cuenta creada exitosamente! Redirigiendo...', 'success');
      
      // Redirigir después del éxito
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      
    } catch (error) {
      console.log('Error en registro:', error);
      if (error.response && error.response.status === 409) {
        showMessage('El email ya está registrado.', 'error');
      } else if (error.response && error.response.status === 401) {
        showMessage('Credenciales inválidas.', 'error');
      } else {
        showMessage('Error al crear la cuenta. Intenta nuevamente.', 'error');
      }
    }
  };

  return (
    <div className="">
      <header>
        <div className="logo">Fashion Luxe</div>
      </header>
      <br /><br /><br /><br /><br /><br />
      <div className="register-form-container">
        <div className="register-header">
          <h2>Únete a Fashion Luxe</h2>
          <p>Crea tu cuenta para disfrutar de una experiencia de compra personalizada</p>
        </div>
        <br />
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        
        <form className="register-form" onSubmit={handleSubmit}>
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
          
          {/* Paso 1: Información Personal */}
          <div className={`form-step ${currentStep === 1 ? 'active' : ''}`}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  className="form-input"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="apellido">Apellidos</label>
                <input
                  type="text"
                  className="form-input"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  placeholder="Tus apellidos"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                className="form-input"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="password">Contraseña</label>
                <input
                  type={showPassword.password ? "text" : "password"}
                  className="form-input"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Tu contraseña"
                  required
                />
                <span 
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('password')}
                >
                  <i className={`fas fa-eye${showPassword.password ? '-slash' : ''}`}></i>
                </span>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  className="form-input"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Repite tu contraseña"
                  required
                />
                <span 
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                >
                  <i className={`fas fa-eye${showPassword.confirmPassword ? '-slash' : ''}`}></i>
                </span>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="telefono">Teléfono</label>
              <input
                type="tel"
                className="form-input"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="Tu número de teléfono"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
              <input
                type="date"
                className="form-input"
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Género</label>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {['masculino', 'femenino', 'otro'].map(gender => (
                  <label key={gender} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input
                      type="radio"
                      name="genero"
                      value={gender}
                      checked={formData.genero === gender}
                      onChange={handleInputChange}
                    />
                    {gender === 'masculino' ? 'Hombre' : gender === 'femenino' ? 'Mujer' : 'Otro'}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-buttons">
              <button type="button" className="btn-next" onClick={() => goToStep(2)}>
                Siguiente <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
          
          {/* Paso 2: Dirección */}
          <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
            <div className="form-group">
              <label className="form-label" htmlFor="direccion">Dirección</label>
              <input
                type="text"
                className="form-input"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                placeholder="Calle y número"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="ciudad">Ciudad</label>
                <input
                  type="text"
                  className="form-input"
                  id="ciudad"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleInputChange}
                  placeholder="Tu ciudad"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="estado_provincia">Estado/Provincia</label>
                <input
                  type="text"
                  className="form-input"
                  id="estado_provincia"
                  name="estado_provincia"
                  value={formData.estado_provincia}
                  onChange={handleInputChange}
                  placeholder="Tu estado o provincia"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="codigo_postal">Código Postal</label>
                <input
                  type="text"
                  className="form-input"
                  id="codigo_postal"
                  name="codigo_postal"
                  value={formData.codigo_postal}
                  onChange={handleInputChange}
                  placeholder="Código postal"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="pais">País</label>
                <select
                  className="form-input"
                  id="pais"
                  name="pais"
                  value={formData.pais}
                  onChange={handleInputChange}
                >
                  <option value="">Selecciona tu país</option>
                  <option value="México">México</option>
                  <option value="España">España</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Estados Unidos">Estados Unidos</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="tipo_direccion">Tipo de dirección</label>
              <select
                className="form-input"
                id="tipo_direccion"
                name="tipo_direccion"
                value={formData.tipo_direccion}
                onChange={handleInputChange}
              >
                <option value="casa">Casa</option>
                <option value="oficina">Oficina</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            
            <div className="form-buttons">
              <button type="button" className="btn-prev" onClick={() => goToStep(1)}>
                <i className="fas fa-arrow-left"></i> Anterior
              </button>
              <button type="button" className="btn-next" onClick={() => goToStep(3)}>
                Siguiente <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
          
          {/* Paso 3: Preferencias */}
          <div className={`form-step ${currentStep === 3 ? 'active' : ''}`}>
            <div className="form-group">
              <label className="form-label">Preferencias de moda</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', marginTop: '10px' }}>
                {['casual', 'formal', 'deportivo', 'vintage', 'moderno', 'bohemio'].map(pref => (
                  <label key={pref} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input
                      type="checkbox"
                      value={pref}
                      checked={formData.preferences.includes(pref)}
                      onChange={() => handleCheckboxChange('preferences', pref)}
                    />
                    {pref.charAt(0).toUpperCase() + pref.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Tallas de interés</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                {['xs', 's', 'm', 'l', 'xl', 'xxl'].map(size => (
                  <label key={size} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input
                      type="checkbox"
                      value={size}
                      checked={formData.sizes.includes(size)}
                      onChange={() => handleCheckboxChange('sizes', size)}
                    />
                    {size.toUpperCase()}
                </label>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="referral">¿Cómo nos conociste?</label>
              <select
                className="form-input"
                id="referral"
                name="referral"
                value={formData.referral}
                onChange={handleInputChange}
              >
                <option value="">Selecciona una opción</option>
                <option value="social">Redes Sociales</option>
                <option value="friend">Recomendación de un amigo</option>
                <option value="search">Búsqueda en Internet</option>
                <option value="ad">Publicidad</option>
                <option value="other">Otro</option>
              </select>
            </div>
            
            <div className="terms-conditions">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="terms">Acepto los <a href="#">Términos y Condiciones</a> y la <a href="#">Política de Privacidad</a></label>
            </div>
            
            <div className="terms-conditions">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleInputChange}
              />
              <label htmlFor="newsletter">Deseo recibir ofertas exclusivas y novedades por correo electrónico</label>
            </div>
            
            <div className="form-buttons">
              <button type="button" className="btn-prev" onClick={() => goToStep(2)}>
                <i className="fas fa-arrow-left"></i> Anterior
              </button>
              <button type="submit" className="btn-register">
                <i className="fas fa-user-plus"></i> Crear Cuenta
              </button>
            </div>
          </div>
        </form>
      </div>
      <br />
      <Footer />
    </div>
  );
};

export default RegisterForm;