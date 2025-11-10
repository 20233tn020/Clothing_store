import { useState, useEffect } from 'react';
import { Header } from '../../Layout/header/Header';
import { Footer, Suscribirme } from '../../Layout/footer/Footer';
import { FloatingWhatsApp } from '../../FloatingWhatsApp/FloatingWhatsApp';
import './Shop.css';

export default function Shop() {
  const [user, setUser] = useState(null);

  const normalizeUser = (raw) => {
    if (!raw) return null;
    const r = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return {
      nombre: r.nombre || r.Nombre || r.name || '',
      apellido: r.apellido || r.Apellido || r.lastname || '',
      genero: r.genero || r.Genero || '',
      email: r.email || r.Email || '',
      raw: r,
    };
  };

  useEffect(() => {
    // cargar al montar
    const raw = localStorage.getItem('user');
    setUser(normalizeUser(raw));

    // storage (otras pestañas)
    const onStorage = (e) => {
      if (e.key === 'user') {
        setUser(normalizeUser(e.newValue));
      }
    };

    // evento custom (misma pestaña)
    const onUserUpdated = (e) => {
      setUser(normalizeUser(e.detail));
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('userUpdated', onUserUpdated);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('userUpdated', onUserUpdated);
    };
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
          <h1>
            Bienvenid{user?.genero === 'Femenino' || user?.genero === 'femenino' ? 'a' :
                     user?.genero === 'Masculino' || user?.genero === 'masculino' ? 'o' : 'o/a'}, {user?.nombre || ''}
          </h1>
          <p>Descubre las últimas tendencias en moda para esta temporada</p>
          <a href="#productos">Ver Nueva Colección</a>
        </div>
      </section>
      <Suscribirme />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
