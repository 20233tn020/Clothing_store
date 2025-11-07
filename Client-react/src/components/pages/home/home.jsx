import { useState, useEffect } from 'react'
import './home.css'
import { useAlert } from '../../../hooks/useAlert'        // ← Ajusta la ruta si es necesario
import Alert from '../../Common/Alert/Alert'
import { Link } from 'react-router-dom'
import { Footer } from '../../Layout/footer/Footer'
import {FloatingWhatsApp} from '../../FloatingWhatsApp/FloatingWhatsApp'
import { useNavigate } from 'react-router-dom'  //  ← sirve para navegar entre paginas :v


export default function Home() {
  const [users, setUsers] = useState([])
  const [isMenuActive, setIsMenuActive] = useState(false)

  const { alert, showAlert, hideAlert } = useAlert()
   const navigate = useNavigate() // ← Esto ahora funcionará

  const handleAddToCart = (productName) => {
    showAlert(`${productName} añadido al carrito`, 'success')
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    showAlert('¡Te has suscrito correctamente!', 'success')
  }



  useEffect(() => {
    const checkScroll = () => {
      const elements = document.querySelectorAll('.fade-in')
      elements.forEach((el) => {
        const top = el.getBoundingClientRect().top
        if (top < window.innerHeight - 100) el.classList.add('visible')
      })
    }
    checkScroll()
    window.addEventListener('scroll', checkScroll)
    return () => window.removeEventListener('scroll', checkScroll)
  }, [])

  const toggleMenu = () => setIsMenuActive(!isMenuActive)
const handleRedirect = () => {
  showAlert('Redirigiendo a Login...', 'info');
  setTimeout(() => {
    try {
      navigate('/login');
    } catch (error) {
      console.error('Error al redirigir:', error);
      showAlert('Error: La página de login no existe', 'error');
    }
  },5200);
};

  return (
    <>
      <Alert alert={alert} onClose={hideAlert} />

      <header>
        <div className="logo">Fashion Luxe</div>
        <i
          className="fas fa-bars menu-toggle"
          onClick={toggleMenu}
          style={{ cursor: 'pointer' }}
        ></i>
        <nav className={isMenuActive ? 'active' : ''}>
          <ul>
            <li>
              <a href="#inicio" onClick={() => showAlert('Ya estás en la página de inicio', 'info')}>
                Inicio
              </a>
            </li>
            <li>
              <a href="#hombres">Hombres</a>
              <ul>
                <li><a href="#camisas">Camisas</a></li>
                <li><a href="#pantalones">Pantalones</a></li>
                <li><a href="#chaquetas">Chaquetas</a></li>
              </ul>
            </li>
            <li>
              <a href="#mujeres">Mujeres</a>
              <ul>
                <li><a href="#vestidos">Vestidos</a></li>
                <li><a href="#blusas">Blusas</a></li>
                <li><a href="#zapatos">Zapatos</a></li>
              </ul>
            </li>
            <li>
              <a href="#accesorios">Accesorios</a>
              <ul>
                <li><a href="#bolsos">Bolsos</a></li>
                <li><a href="#relojes">Relojes</a></li>
              </ul>
            </li>
            <li><a href="#ofertas">Ofertas</a></li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <Link to="/login">Login</Link>
          <Link to="/Registro">Registro</Link>
        </div>
      </header>

      {/* --- Hero --- */}
      <section className="home-hero">
        <div className="hero-content">
          <h1>Nueva Colección 2025</h1>
          <p>Descubre las últimas tendencias en moda para él y para ella</p>
          <a href="#productos" onClick={() => showAlert('Redirigiendo a productos...', 'info')}>
            Comprar Ahora
          </a>
        </div>
      </section>

      {users.length > 0 && (
        <section className="users-section">
          <h2>Usuarios Registrados: {users.length}</h2>
        </section>
      )}

     
      {/* PRODUCTOS DESTACADOS */}
      <section className="featured-products">
        <div className="container">
          <div className="section-title">
            <h2>Productos Destacados</h2>
            <p>Los artículos más populares y mejor valorados por nuestros clientes</p>
          </div>
          <div className="product-grid">
            {/* Cada producto */}
            {/* Producto 1 */}
            <div className="product-card fade-in">
              <div className="product-badge">Nuevo</div>
              <div className="product-image">
                <img
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=500&q=80"
                  alt="Camiseta Básica"
                />
                <div className="product-actions">
                  <button title="Ver detalles"><i className="fas fa-eye"></i></button>
                  <button title="Añadir a favoritos"><i className="fas fa-heart"></i></button>
                  <button title="Comparar producto"><i className="fas fa-exchange-alt"></i></button>
                </div>
              </div>
              <div className="product-info">
                <h3>Camiseta Básica Premium</h3>
                <p>Camiseta de algodón 100% de alta calidad, perfecta para looks casuales y elegantes.</p>
                <div className="product-price">
                  <div>
                    <span className="old-price">$39.99</span>
                    <span className="price">$29.99</span>
                  </div>
                  <button className="add-to-cart" title="Añadir al carrito" onClick={handleRedirect} >
                    <i className="fas fa-shopping-cart"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Producto 2 */}
            <div className="product-card fade-in">
              <div className="product-badge">-25%</div>
              <div className="product-image">
                <img
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80"
                  alt="Zapatos Deportivos"
                />
                <div className="product-actions">
                  <button title="Ver detalles"><i className="fas fa-eye"></i></button>
                  <button title="Añadir a favoritos"><i className="fas fa-heart"></i></button>
                  <button title="Comparar producto"><i className="fas fa-exchange-alt"></i></button>
                </div>
              </div>
              <div className="product-info">
                <h3>Zapatos Deportivos Elite</h3>
                <p>Comodidad y estilo para tu día a día. Diseño moderno con tecnología de amortiguación.</p>
                <div className="product-price">
                  <div>
                    <span className="old-price">$119.99</span>
                    <span className="price">$89.99</span>
                  </div>
                  <button className="add-to-cart" title="Añadir al carrito" onClick={handleRedirect}>
                    <i className="fas fa-shopping-cart"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Producto 3 */}
            <div className="product-card fade-in">
              <div className="product-image">
                <img
                  src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=500&q=80"
                  alt="Reloj Elegante"
                />
                <div className="product-actions">
                  <button title="Ver detalles"><i className="fas fa-eye"></i></button>
                  <button title="Añadir a favoritos"><i className="fas fa-heart"></i></button>
                  <button title="Comparar producto"><i className="fas fa-exchange-alt"></i></button>
                </div>
              </div>
              <div className="product-info">
                <h3>Reloj Elegante Clásico</h3>
                <p>Precisión suiza con diseño atemporal. La elección perfecta para ocasiones especiales.</p>
                <div className="product-price">
                  <span className="price">$199.99</span>
                  <button className="add-to-cart" title="Añadir al carrito" onClick={handleRedirect}>
                    <i className="fas fa-shopping-cart"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Producto 4 */}
            <div className="product-card fade-in">
              <div className="product-badge">Más Vendido</div>
              <div className="product-image">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80"
                  alt="Auriculares"
                />
                <div className="product-actions">
                  <button title="Ver detalles"><i className="fas fa-eye"></i></button>
                  <button title="Añadir a favoritos"><i className="fas fa-heart"></i></button>
                  <button title="Comparar producto"><i className="fas fa-exchange-alt"></i></button>
                </div>
              </div>
              <div className="product-info">
                <h3>Auriculares Inalámbricos</h3>
                <p>Sonido premium con cancelación de ruido. Hasta 30 horas de autonomía.</p>
                <div className="product-price">
                  <span className="price">$149.99</span>
                  <button className="add-to-cart" title="Añadir al carrito"  onClick={handleRedirect}>
                    <i className="fas fa-shopping-cart"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="newsletter">
        <h2>Suscríbete a nuestro boletín</h2>
        <p>Recibe ofertas exclusivas y novedades directamente en tu correo</p>
        <form onSubmit={handleSubscribe}>
          <input type="email" placeholder="Ingresa tu correo" required />
          <button type="submit">Suscribirme</button>
        </form>
      </section>
      <Footer/>
      <FloatingWhatsApp/>
    </>
  )
}
