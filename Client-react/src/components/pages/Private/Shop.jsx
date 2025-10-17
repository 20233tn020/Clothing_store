import { useState, useEffect } from 'react';
import { Header } from '../../Layout/header/Header';
import { Footer, Suscribirme } from '../../Layout/footer/Footer';
import { FloatingWhatsApp } from '../../FloatingWhatsApp/FloatingWhatsApp';
import './Shop.css';

export default function Shop() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Obtener usuario del localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="Shop">
      <Header />
      <section className="hero">
        <div className="hero-content">
          {/* EXTRACCIÓN DEL EMAIL Y CREACIÓN DEL NOMBRE */}
         <h1>Bienvenid{user?.genero === 'femenino' ? 'a' : user?.genero === 'masculino' ? 'o' : 'o/a'}, {user?.nombre || ''}</h1>
          <p>Descubre las últimas tendencias en moda para esta temporada</p>
          <a href="#productos">Ver Nueva Colección</a>
        </div>
      </section>
      <Suscribirme/>
      <Footer/>
      <FloatingWhatsApp/>
    </div>
  );
}