import { Link, useNavigate } from "react-router-dom";

function LogoutLink() {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      // Llamar al backend para cerrar sesión
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include", // MUY IMPORTANTE para usar la sesión Flask
      });
      

      // Limpiar el almacenamiento local del frontend
      localStorage.removeItem("userData");
      sessionStorage.clear();

      // Redirigir al inicio
      navigate("/");
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  };

  return (
    <Link to="/" onClick={handleLogout}>
      <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
    </Link>
  );
}

export default LogoutLink;
