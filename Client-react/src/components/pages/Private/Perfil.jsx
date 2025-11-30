  import { useState, useEffect } from "react";
import { Header, Mi_Cuenta } from "../../Layout/header/Header";
import { Footer } from "../../Layout/footer/Footer";
import { FloatingWhatsApp } from "../../FloatingWhatsApp/FloatingWhatsApp";
import LogoutLink from "../../Auth/logout/LogoutLink";
import "./Perfil.css";
import "react-profile/themes/default";
import { openEditor } from "react-profile";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation,useNavigate,useSearchParams } from "react-router-dom"; // Correcto

// Servicio para manejar las llamadas a la API
const apiService = {
  async getUserOrders(userId) {
    try {
      const response = await fetch(`http://localhost:5000/orders/user/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  async getOrderDetails(orderId) {
    try {
      const response = await fetch(`http://localhost:5000/orders/${orderId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }
};





export default function Perfil() {
const location = useLocation();
const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  // Direcciones del usuario desde la API
  const [addresses, setAddresses] = useState([]);

    const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [formData, setFormData] = useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
  });

   useEffect(() => {
    console.log(' Location state recibido:', location.state);
    
    if (location.state?.activeSection) {
      console.log(' Cambiando a sección:', location.state.activeSection);
      setActiveSection(location.state.activeSection);
      
      // Opcional: Limpiar el state para evitar que persista
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);



const fetchAddresses = async () => {
  if (!user?.id) return;
  try {
    const res = await axios.get(`http://127.0.0.1:5000/user/${user.id}/addresses`);
    if (res.data.direcciones && res.data.direcciones.length > 0) {
      const mapped = res.data.direcciones.map((addr) => ({
        id: addr.id,
        street: addr.direccion,
        city: addr.ciudad,
        state: addr.estado_provincia,
        zip: addr.codigo_postal,
        country: addr.pais,
        tipo: addr.tipo_direccion,
        isDefault: addr.principal === 1 || addr.principal === true,
      }));
      setAddresses(mapped);
    } else {
      setAddresses([]);
    }
  } catch (error) {
    console.error("Error al cargar direcciones:", error);
  }
};


  // Cargar órdenes del usuario
  const fetchUserOrders = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingOrders(true);
      const ordersData = await apiService.getUserOrders(user.id);
      
      if (ordersData.status === 'success') {
        setOrders(ordersData.data.orders || []);
      } else {
        console.error('Error loading orders:', ordersData);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };


// Luego el useEffect solo la llama
useEffect(() => {
  if (user?.id) {
    fetchAddresses();
          if (activeSection === 'orders') {
        fetchUserOrders();
      }
  }
}, [user,activeSection]);

useEffect(() => {
  if (location.state?.activeSection) {
    setActiveSection(location.state.activeSection);
  }
}, [location]);

  // 🔹 Cargar datos del usuario desde localStorage y normalizar campos
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);

      const normalizedUser = {
        id: parsedUser.id || parsedUser.ID || parsedUser.Id || "",
        Nombre: parsedUser.Nombre || parsedUser.nombre || parsedUser.name || "",
        Apellido:
          parsedUser.Apellido || parsedUser.apellido || parsedUser.lastname || "",
        Email: parsedUser.Email || parsedUser.email || "",
        Password: parsedUser.Password || parsedUser.password || "",
        Telefono: parsedUser.Telefono || parsedUser.telefono || parsedUser.phone || "",
        Genero: parsedUser.Genero || parsedUser.genero || "",
        Direccion:
          parsedUser.Direccion || parsedUser.direccion || parsedUser.address || "",
        Ciudad: parsedUser.Ciudad || parsedUser.ciudad || parsedUser.city || "",
        Estado_provincia:
          parsedUser.Estado_provincia ||
          parsedUser.estado_provincia ||
          parsedUser.state ||
          "",
        Codigo_postal:
          parsedUser.Codigo_postal ||
          parsedUser.codigo_postal ||
          parsedUser.zip ||
          "",
        Pais: parsedUser.Pais || parsedUser.pais || parsedUser.country || "",
        Tipo_direccion:
          parsedUser.Tipo_direccion || parsedUser.tipo_direccion || "",
        Fecha_creacion:
          parsedUser.Fecha_creacion || parsedUser.fecha_creacion || parsedUser.created_at || "",
        // conserva posibles campos originales por si los necesitas
        raw: parsedUser,
      };

      setUser(normalizedUser);
    }
  }, []);

  // 🔹 Manejar cambios en inputs (usa las keys normalizadas: Nombre, Apellido, Email...)
  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [id]: value,
    }));
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

const setAsDefault = async (addressId) => {
  if (!user?.id) return;

  if (!window.confirm("¿Establecer esta dirección como principal?")) return;

  try {
    const res = await axios.put(`http://127.0.0.1:5000/address/${addressId}/set_default`, {
      user_id: user.id,
    });

    if (res.data.status === "success") {
      const updated = addresses.map((a) => ({
        ...a,
        isDefault: a.id === addressId,
      }));
      setAddresses(updated);
      alert("Dirección establecida como principal");
    } else {
      alert(res.data.message || "No se pudo cambiar la dirección principal");
    }
  } catch (error) {
    console.error("Error al cambiar dirección principal:", error);
  }
};


const deleteAddress = async (addressId) => {
  if (!window.confirm("¿Eliminar esta dirección?")) return;

  try {
    const res = await axios.delete(`http://127.0.0.1:5000/address/${addressId}`, {
      headers: { "Content-Type": "application/json" },
    });

    if (res.data.status === "success") {
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
      Swal.fire({
        icon: "success",
        title: "Dirección eliminada",
        text: "Se eliminó correctamente",
        confirmButtonColor: "#6366F1",
        background: "#1E1E2F",
        color: "#FFF",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: res.data.message || "No se pudo eliminar la dirección",
        confirmButtonColor: "#6366F1",
        background: "#1E1E2F",
        color: "#FFF",
      });
    }
  } catch (error) {
    console.error("Error al eliminar dirección:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.error || "No se pudo eliminar la dirección",
      confirmButtonColor: "#6366F1",
      background: "#1E1E2F",
      color: "#FFF",
    });
  }
};




const addNewAddress = async () => {
  if (!user?.id) {
    Swal.fire({
      icon: "error",
      title: "Usuario no identificado",
      text: "Inicia sesión antes de agregar una dirección.",
      confirmButtonColor: "#4F46E5",
      background: "#1E1E2F",
      color: "#FFF",
    });
    return;
  }

const { value: formValues } = await Swal.fire({
    title: "<h3 style='color:#FFF; font-weight:600;'>Agregar Nueva Dirección</h3>",
    html: `
      <style>
        .swal2-popup {
            background: rgba(0, 0, 0, 0.1) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 16px !important;
        }
        .swal2-input, .swal2-select {
           background: rgba(255, 255, 255, 0.08) !important;
          backdrop-filter: blur(30px) saturate(200%) brightness(1.2) !important;
          -webkit-backdrop-filter: blur(30px) saturate(200%) brightness(1.2) !important;
          color: #FFFFFF !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 16px !important;
          font-size: 16px !important;
          padding: 16px 18px !important;
          width: 100% !important;
          margin-bottom: 16px !important;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
          box-shadow: 
              0 8px 24px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.08),
              inset 0 -1px 0 rgba(0, 0, 0, 0.05) !important;
          font-weight: 500;
          margin-left: 0% !important;
        }
            .swal2-input::placeholder, .swal2-select::placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
          font-weight: 400;
        }
        .swal2-input:focus, .swal2-select:focus {
           outline: none !important;
          border-color: rgba(99, 102, 241, 0.6) !important;
          background: rgba(255, 255, 255, 0.12) !important;
          box-shadow: 
              0 0 0 4px rgba(99, 102, 241, 0.15),
              0 12px 32px rgba(0, 0, 0, 0.25),
              inset 0 2px 0 rgba(255, 255, 255, 0.1) !important;
          transform: translateY(-2px) scale(1.01) !important;
          backdrop-filter: blur(40px) saturate(250%) brightness(1.25) !important;
        }
        .swal2-label {
          display: block;
          margin-bottom: 4px;
          font-weight: 600;
          color: #FFFFFF;
          font-size: 13px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }
        .swal2-checkbox-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          color: #E5E7EB;
        }
        .swal2-header, .swal2-content {
          position: relative;
          z-index: 1;
        }
          swal2-input:hover, .swal2-select:hover {
          border-color: rgba(255, 255, 255, 0.18) !important;
          background: rgba(255, 255, 255, 0.1) !important;
          transform: translateY(-1px) !important;
        }
      </style>
      <style>
.swal2-validation-message {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1)) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border: 1px solid rgba(239, 68, 68, 0.3) !important;
    border-radius: 12px !important;
    color: #FECACA !important;
    font-weight: 600 !important;
    font-size: 14px !important;
    padding: 16px !important;
    margin: 20px 0 0 0 !important;
    text-align: center !important;
    box-shadow: 
        0 4px 16px rgba(239, 68, 68, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
    animation: shake 0.5s ease-in-out !important;
}

.swal2-validation-message::before {
    content: '⚠️ ';
    margin-right: 8px;
    font-size: 16px;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

/* Opcional: Estilo para inputs con error */
.swal2-input.error, .swal2-select.error {
    border-color: rgba(239, 68, 68, 0.6) !important;
    background: rgba(239, 68, 68, 0.08) !important;
    box-shadow: 
        0 0 0 3px rgba(239, 68, 68, 0.15),
        0 8px 24px rgba(239, 68, 68, 0.1) !important;
}
</style>

      <div style="text-align:left;">
        <label class="swal2-label"><i class="fas fa-road"></i> Calle y número:</label>
        <input id="swal-direccion" class="swal2-input" placeholder="Ej: Av. Reforma 123">

        <label class="swal2-label"><i class="fas fa-city"></i> Ciudad:</label>
        <input id="swal-ciudad" class="swal2-input" placeholder="Ej: Monterrey">

        <label class="swal2-label"><i class="fas fa-map"></i> Estado o provincia:</label>
        <input id="swal-estado" class="swal2-input" placeholder="Ej: Nuevo León">

        <label class="swal2-label"><i class="fas fa-mail-bulk"></i> Código postal:</label>
        <input id="swal-cp" class="swal2-input" placeholder="Ej: 64000">

        <label class="swal2-label"><i class="fas fa-flag"></i> País:</label>
        <input id="swal-pais" class="swal2-input" placeholder="Ej: México">

        <label class="swal2-label"><i class="fas fa-home"></i> Tipo de dirección:</label>
        <select id="swal-tipo" class="swal2-select">
          <option value="Casa">Casa</option>
          <option value="Oficina">Oficina</option>
          <option value="Otro">Otro</option>
        </select>

        <div class="swal2-checkbox-row">
          <input type="checkbox" id="swal-principal">
          <label for="swal-principal">Establecer como dirección principal</label>
        </div>
      </div>
    `,
    background: "transparent",
    color: "#FFFFFF",
    showCancelButton: true,
    confirmButtonText: "<i class='fas fa-save'></i> Guardar",
    cancelButtonText: "<i class='fas fa-times'></i> Cancelar",
    confirmButtonColor: "#6366F1",
    cancelButtonColor: "rgba(107, 114, 128, 0.7)",
    width: "500px",
    padding: "25px",
    customClass: {
        popup: 'glass-swal-popup'
    },
    preConfirm: () => {
      const direccion = document.getElementById("swal-direccion").value.trim();
      const ciudad = document.getElementById("swal-ciudad").value.trim();
      const estado_provincia = document.getElementById("swal-estado").value.trim();
      const codigo_postal = document.getElementById("swal-cp").value.trim();
      const pais = document.getElementById("swal-pais").value.trim();
      const tipo_direccion = document.getElementById("swal-tipo").value;
      const principal = document.getElementById("swal-principal").checked;

      if (!direccion || !ciudad) {
        
        Swal.showValidationMessage("La dirección y la ciudad son obligatorias.");
        return false;
      }

      return {
        direccion,
        ciudad,
        estado_provincia,
        codigo_postal,
        pais,
        tipo_direccion,
        principal,
      };
    },
  });

  if (!formValues) return;

  try {
    const newAddress = {
      user_id: user.id,
      ...formValues,
    };

    const res = await axios.post("http://127.0.0.1:5000/address", newAddress, {
      headers: { "Content-Type": "application/json" },
    });
// Cuando agregas una nueva dirección
if (res.data.status === "success") {
  const nueva = {
    id: res.data.address.id,
    street: res.data.address.direccion,
    city: res.data.address.ciudad,
    state: res.data.address.estado_provincia,
    zip: res.data.address.codigo_postal,
    country: res.data.address.pais,
    tipo: res.data.address.tipo_direccion,
    isDefault: res.data.address.principal === 1 || res.data.address.principal === true,
  };

  setAddresses((prev) => {
    if (nueva.isDefault) {
      // Si esta nueva es principal, las demás ya no lo son
      return prev.map((a) => ({ ...a, isDefault: false })).concat(nueva);
    } else {
      return [...prev, nueva];
    }
  });

  Swal.fire({
    icon: "success",
    title: "¡Dirección guardada!",
    text: "La nueva dirección se ha agregado correctamente.",
    confirmButtonColor: "#6366F1",
    background: "#1E1E2F",
    color: "#FFF",
  });
}
 else {
      Swal.fire({
        icon: "warning",
        title: "Aviso",
        text: res.data.message || "Error al agregar la dirección.",
        confirmButtonColor: "#6366F1",
        background: "#1E1E2F",
        color: "#FFF",
      });
    }
  } catch (error) {
    console.error("Error al agregar dirección:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo agregar la dirección.",
      confirmButtonColor: "#EF4444",
      background: "#1E1E2F",
      color: "#FFF",
    });
  }
};



const editAddress = async (addressId) => {
  const address = addresses.find((a) => a.id === addressId);
  if (!address) return;

  const { value: formValues } = await Swal.fire({
    title: `<h3 style="color:#FFF; font-weight:600;">Editar Dirección</h3>`,
    html: `
      <style>
        .swal2-popup {
            background: rgba(0, 0, 0, 0.1) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 16px !important;
        }
        .swal2-input, .swal2-select {
           background: rgba(255, 255, 255, 0.08) !important;
          backdrop-filter: blur(30px) saturate(200%) brightness(1.2) !important;
          -webkit-backdrop-filter: blur(30px) saturate(200%) brightness(1.2) !important;
          color: #FFFFFF !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 16px !important;
          font-size: 16px !important;
          padding: 16px 18px !important;
          width: 100% !important;
          margin-bottom: 16px !important;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
          box-shadow: 
              0 8px 24px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.08),
              inset 0 -1px 0 rgba(0, 0, 0, 0.05) !important;
          font-weight: 500;
          margin-left: 0% !important;
        }
            .swal2-input::placeholder, .swal2-select::placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
          font-weight: 400;
        }
        .swal2-input:focus, .swal2-select:focus {
           outline: none !important;
          border-color: rgba(99, 102, 241, 0.6) !important;
          background: rgba(255, 255, 255, 0.12) !important;
          box-shadow: 
              0 0 0 4px rgba(99, 102, 241, 0.15),
              0 12px 32px rgba(0, 0, 0, 0.25),
              inset 0 2px 0 rgba(255, 255, 255, 0.1) !important;
          transform: translateY(-2px) scale(1.01) !important;
          backdrop-filter: blur(40px) saturate(250%) brightness(1.25) !important;
        }
        .swal2-label {
          display: block;
          margin-bottom: 4px;
          font-weight: 600;
          color: #FFFFFF;
          font-size: 13px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }
        .swal2-checkbox-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          color: #E5E7EB;
        }
        .swal2-header, .swal2-content {
          position: relative;
          z-index: 1;
        }
          swal2-input:hover, .swal2-select:hover {
          border-color: rgba(255, 255, 255, 0.18) !important;
          background: rgba(255, 255, 255, 0.1) !important;
          transform: translateY(-1px) !important;
        }
      </style>

      <div style="text-align:left;">

        <label class="swal2-label"><i class="fas fa-road"></i> Calle y número:</label>
        <input id="swal-street" class="swal2-input" value="${address.street || ""}" placeholder="Ej: Av. Reforma 123">


        <label class="swal2-label"><i class="fas fa-city"></i> Ciudad:</label>
        <input id="swal-city" class="swal2-input" value="${address.city || ""}" placeholder="Ej: Monterrey">

        <label class="swal2-label"><i class="fas fa-map"></i> Estado:</label>
        <input id="swal-state" class="swal2-input" value="${address.state || ""}" placeholder="Ej: Nuevo León">

        <label class="swal2-label"><i class="fas fa-mail-bulk"></i> Código postal:</label>
        <input id="swal-zip" class="swal2-input" value="${address.zip || ""}" placeholder="Ej: 64000">

        <label class="swal2-label"><i class="fas fa-phone"></i> Teléfono:</label>
        <input id="swal-phone" class="swal2-input" value="${address.phone || ""}" placeholder="Ej: 8123456789">

        <label class="swal2-label"><i class="fas fa-sticky-note"></i> Instrucciones de entrega:</label>
        <input id="swal-instructions" class="swal2-input" value="${address.instructions || ""}" placeholder="Ej: Tocar timbre dos veces">

        <div class="swal2-checkbox-row">
          <input type="checkbox" id="swal-default" ${address.isDefault ? "checked" : ""}>
          <label for="swal-default">Establecer como dirección principal</label>
        </div>
      </div>
    `,
    background: "#1E1E2F",
    color: "#FFF",
    showCancelButton: true,
    confirmButtonText: "<i class='fas fa-save'></i> Guardar cambios",
    cancelButtonText: "<i class='fas fa-times'></i> Cancelar",
    confirmButtonColor: "#6366F1",
    cancelButtonColor: "#6B7280",
    width: "520px",
    padding: "25px",
    focusConfirm: false,
    preConfirm: () => {
      const name = document.getElementById("swal-name").value.trim();
      const street = document.getElementById("swal-street").value.trim();
      const colonia = document.getElementById("swal-colonia").value.trim();
      const city = document.getElementById("swal-city").value.trim();
      const state = document.getElementById("swal-state").value.trim();
      const zip = document.getElementById("swal-zip").value.trim();
      const phone = document.getElementById("swal-phone").value.trim();
      const instructions = document.getElementById("swal-instructions").value.trim();
      const isDefault = document.getElementById("swal-default").checked;

      if (!name || !street || !city) {
        Swal.showValidationMessage("Los campos 'nombre', 'calle' y 'ciudad' son obligatorios.");
        return false;
      }

      return { name, street, colonia, city, state, zip, phone, instructions, isDefault };
    },
  });

  if (!formValues) return;

const updatedAddresses = addresses.map((addr) =>
  addr.id === addressId
    ? { ...addr, ...formValues }
    : { ...addr, isDefault: formValues.isDefault ? false : addr.isDefault }
);

if (formValues.isDefault) {
  // Si se marcó como principal, desactiva las demás
  setAddresses(
    updatedAddresses.map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }))
  );
} else {
  setAddresses(updatedAddresses);
}


  Swal.fire({
    icon: "success",
    title: "¡Dirección actualizada!",
    text: "Los cambios se guardaron correctamente.",
    confirmButtonColor: "#6366F1",
    background: "#1E1E2F",
    color: "#FFF",
    showClass: {
      popup: "animate__animated animate__fadeInUp animate__faster",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutDown animate__faster",
    },
  });
};

 const viewOrderDetails = async (orderId) => {
    try {
      const orderDetails = await apiService.getOrderDetails(orderId);
      
      if (orderDetails.status === 'success') {
        const order = orderDetails.data;
        
        // Crear HTML para mostrar los detalles
        const productsHtml = order.detalles.map(detalle => `
          <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px;">
            <img src="${detalle.producto_imagen || 'https://via.placeholder.com/60x60?text=Imagen'}" 
                 alt="${detalle.producto_nombre}" 
                 style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; margin-right: 15px;">
            <div style="flex: 1;">
              <div style="font-weight: 600; color: #fff; margin-bottom: 5px;">${detalle.producto_nombre}</div>
              <div style="color: #ccc; font-size: 14px;">
                Cantidad: ${detalle.cantidad} × $${detalle.precio_unitario}
              </div>
              <div style="color: #4ade80; font-weight: 600;">Subtotal: $${detalle.subtotal}</div>
            </div>
          </div>
        `).join('');

        Swal.fire({
          title: `<h3 style="color: #fff; margin-bottom: 20px;">Detalles del Pedido #${order.id.substring(0, 8).toUpperCase()}</h3>`,
          html: `
            <div style="text-align: left; color: #fff;">
              <div style="margin-bottom: 15px;">
                <strong>Estado:</strong> 
                <span style="padding: 4px 12px; border-radius: 20px; background: ${
                  order.estado === 'Entregado' ? '#4ade80' : 
                  order.estado === 'Pendiente' ? '#f59e0b' : 
                  order.estado === 'Cancelado' ? '#ef4444' : '#6366f1'
                }; margin-left: 10px; font-size: 12px; font-weight: 600;">
                  ${order.estado}
                </span>
              </div>
              <div style="margin-bottom: 15px;">
                <strong>Método de pago:</strong> ${order.metodo_pago || 'No especificado'}
              </div>
              <div style="margin-bottom: 15px;">
                <strong>Fecha:</strong> ${new Date(order.creado_en).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div style="margin-bottom: 20px;">
                <strong>Total:</strong> <span style="color: #4ade80; font-size: 18px; font-weight: 700;">$${order.total}</span>
              </div>
              
              <h4 style="color: #fff; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 5px;">Productos:</h4>
              ${productsHtml}
            </div>
          `,
          background: "#1E1E2F",
          width: "600px",
          confirmButtonColor: "#6366F1",
          confirmButtonText: "Cerrar"
        });
      } else {
        throw new Error(orderDetails.message || 'Error al cargar los detalles');
      }
    } catch (error) {
      console.error('Error loading order details:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los detalles del pedido",
        confirmButtonColor: "#6366F1",
        background: "#1E1E2F",
        color: "#FFF",
      });
    }
  };


  // Función para obtener el color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'Entregado': return '#4ade80';
      case 'Pendiente': return '#f59e0b';
      case 'Cancelado': return '#ef4444';
      case 'Enviado': return '#6366f1';
      case 'Confirmado': return '#8b5cf6';
      default: return '#6b7280';
    }
  };


  // Función para formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  //  Enviar actualización al backend Flask
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    Swal.fire({
      title: "Actualizando...",
      text: "Por favor espera un momento",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // aquí mandamos el objeto user normalizado (con campos Nombre, Apellido, Email, etc.)
      const res = await axios.put("http://127.0.0.1:5000/UpdateUser", user, {
        headers: { "Content-Type": "application/json" },
      });

      Swal.close();

      if (res.data.status === "success") {
          await fetchAddresses(); //  recarga las direcciones del usuario
        Swal.fire({
          title: "Datos actualizados",
          html: `
            <div style="text-align: center; padding: 10px;">
              <i class="fas fa-check-circle" style="font-size: 50px; color: #28a745; margin-bottom: 15px;"></i>
              <p style="font-size: 16px;">${res.data.message}</p>
            </div>
          `,
          confirmButtonColor: "#3085d6",
          background: "#f9f9f9",
          width: "450px",
        });

        // Actualiza localStorage y estado con la respuesta del backend (si viene user en la respuesta)
        const updatedUser = res.data.user
          ? {
              ...res.data.user,
              // por si backend devuelve en minúsculas, siempre normalizamos
              Nombre: res.data.user.Nombre || res.data.user.nombre || res.data.user.name || user.Nombre,
              Apellido: res.data.user.Apellido || res.data.user.apellido || user.Apellido,
              Email: res.data.user.Email || res.data.user.email || user.Email,
              Telefono: res.data.user.Telefono || res.data.user.telefono || user.Telefono,
              Direccion: res.data.user.Direccion || res.data.user.direccion || user.Direccion,
              Ciudad: res.data.user.Ciudad || res.data.user.ciudad || user.Ciudad,
              Fecha_creacion: res.data.user.Fecha_creacion || res.data.user.fecha_creacion || user.Fecha_creacion,
            }
          : user;

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        window.dispatchEvent(new CustomEvent("userUpdated", { detail: updatedUser }));

      } else {
        // Si backend responde con otro status, mostrar mensaje
        Swal.fire({
          title: "Aviso",
          html: `<div style="text-align:center"><p>${res.data.message || "Respuesta inesperada"}</p></div>`,
          confirmButtonColor: "#3085d6",
          background: "#f9f9f9",
        });
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        title: "Error",
        html: `
          <div style="text-align: center; padding: 10px;">
            <i class="fas fa-times-circle" style="font-size: 50px; color: #e74c3c; margin-bottom: 15px;"></i>
            <p style="font-size: 16px;">${
              error.response?.data?.error ||
              error.response?.data?.message ||
              "No se pudo actualizar el usuario."
            }</p>
          </div>
        `,
        confirmButtonColor: "#3085d6",
        background: "#f9f9f9",
        width: "450px",
      });
    }
  };


    // Actualizar contraseña en la API
const handleChangePassword = async () => {
  const { currentPassword, newPassword, confirmPassword } = formData;
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

if (!currentPassword || !newPassword || !confirmPassword) {
  Swal.fire({
    title: "Campos incompletos",
    html: `
      <div style="text-align: center; padding: 15px;">
        <i class="fa-solid fa-circle-exclamation" 
           style="font-size: 60px; color: #facc15; margin-bottom: 15px; animation: pop 0.4s ease;"></i>
        <p style="font-size: 16px; color: #000000ff;">
          Por favor completa todos los campos antes de continuar.
        </p>
      </div>
    `,   color: "#262626ff",
    confirmButtonColor: "#6366F1",
    confirmButtonText: "Entendido",
    width: "420px",
    customClass: {
      popup: "swal2-glass",
      confirmButton: "swal2-button",
    },
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
  });
  return;
}

if (newPassword !== confirmPassword) {
  Swal.fire({
    title: "Error",
    html: `
      <div style="text-align: center; padding: 15px;">
        <i class="fa-solid fa-circle-xmark" 
           style="font-size: 60px; color: #ef4444; margin-bottom: 15px; animation: shake 0.4s ease;"></i>
        <p style="font-size: 16px; color: #010101ff;">
          Las contraseñas no coinciden. Inténtalo de nuevo.
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
setIsLoading(true);
  try {
    const response = await axios.put(
      "http://127.0.0.1:5000/UpdatePasswordUser",
      {
        id: user.id,
        password: currentPassword, //
        newPassword: newPassword, 
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
setIsLoading(false);
      Swal.fire({
    title: "Contraseña actualizada",
    html: `
      <div style="text-align: center; padding: 15px;">
        <i class="fa-solid fa-circle-check" 
           style="font-size: 60px; color: #4ade80; margin-bottom: 15px; animation: pop 0.4s ease;"></i>
        <p style="font-size: 16px; color: #000000ff;">
          ${response.data.message || "Tu contraseña ha sido actualizada correctamente."}
        </p>
      </div>
    `,
    color: "#262626ff",
    confirmButtonColor: "#6366F1",
    confirmButtonText: "Aceptar",
    width: "420px",
    customClass: {
      popup: "swal2-glass",
      confirmButton: "swal2-button",
    },
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
  });

  // Limpia los campos
  setFormData({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  } catch (error) {
    Swal.fire({
   title: "Error",
    html: `
      <div style="text-align: center; padding: 15px;">
        <i class="fa-solid fa-circle-xmark" 
           style="font-size: 60px; color: #ef4444; margin-bottom: 15px; animation: shake 0.4s ease;"></i>
        <p style="font-size: 16px; color: #000000ff;">
          ${error.response?.data?.error || "Ocurrió un error al actualizar la contraseña."}
        </p>
      </div>
    `,
    color: "#262626ff",
    confirmButtonColor: "#6366F1",
    confirmButtonText: "Intentar de nuevo",
    width: "420px",
    customClass: {
      popup: "swal2-glass",
      confirmButton: "swal2-button",
    },
    showClass: {
      popup: "animate__animated animate__shakeX",
    },
    });
  }
};


const followPedido = (orderId) => {
  navigate(`/order-details/${orderId}`);
};

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div>
      <title>Mi Perfil - Fashion Luxe</title>
      <Header />
      <Mi_Cuenta />

      <div className="profile-container">
        {/* SIDEBAR */}
        <div className="profile-sidebar">
          <div className="profile-picture">
            {user?.Nombre && user?.Apellido
              ? `${user.Nombre.charAt(0)}${user.Apellido.charAt(0)}`.toUpperCase()
              : "US"}
            <input
              type="file"
              className="change-photo"
              accept="image/jpeg;image/png"
              onChange={(e) => openEditor({ src: e.target.files[0], square: true })}
            />
          </div>

          <div className="profile-name">
            {user?.Nombre || ""} {user?.Apellido || ""}
          </div>
          <div className="profile-email">{user?.Email || "Invitado"}</div>

          <div className="profile-email">
            <p>Fecha de Creación:</p>
            <span>{user?.Fecha_creacion || "No disponible"}</span>
          </div>

          <div className="profile-stats">
            <div className="stat">
              <div className="stat-value">12</div>
              <div className="stat-label">Pedidos</div>
            </div>
            <div className="stat">
              <div className="stat-value">8</div>
              <div className="stat-label">Favoritos</div>
            </div>
            <div className="stat">
              <div className="stat-value">{addresses.length}</div>
              <div className="stat-label">Direcciones</div>
            </div>
          </div>

          <ul className="sidebar-menu">
            <li>
              <a
                href="#"
                className={activeSection === "personal" ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection("personal");
                }}
              >
                <i className="fas fa-user"></i> Información Personal
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeSection === "orders" ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection("orders");
                }}
              >
                <i className="fas fa-shopping-bag"></i> Mis Pedidos
              </a>
            </li>

            <li>
              <a
                href="#"
                className={activeSection === "addresses" ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection("addresses");
                }}
              >
                <i className="fas fa-map-marker-alt"></i> Direcciones
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeSection === "security" ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection("security");
                }}
              >
                <i className="fas fa-lock"></i> Cambiar Contraseña
              </a>
            </li>
            <li>
              <LogoutLink onClick={handleLogout} />
            </li>
          </ul>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="profile-content">
          {/* INFORMACIÓN PERSONAL */}
          {activeSection === "personal" && (
            <div className="profile-section">
              <h2 className="section-title">Información Personal</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="Nombre">Nombre</label>
                    <input
                      type="text"
                      id="Nombre"
                      className="form-control"
                      value={user?.Nombre || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="Apellido">Apellidos</label>
                    <input
                      type="text"
                      id="Apellido"
                      className="form-control"
                      value={user?.Apellido || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="Email">Correo Electrónico</label>
                  <input
                    type="email"
                    id="Email"
                    className="form-control"
                    value={user?.Email || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="Telefono">Teléfono</label>
                  <input
                    type="tel"
                    id="Telefono"
                    className="form-control"
                    value={user?.Telefono || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="Genero">Género</label>
                  <select
                    id="Genero"
                    className="form-control"
                    value={user?.Genero || ""}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-3">
                  Guardar Cambios
                </button>
              </form>
            </div>
          )}


          {/* DIRECCIONES - funcional */}
{activeSection === "addresses" && (
  <div className="profile-section">
    <h2 className="section-title">Mis Direcciones</h2>

    {addresses.length === 0 ? (
      <p>No tienes direcciones registradas.</p>
    ) : (
      addresses.map((address) => (
        <div
          key={address.id}
          className={`address-card ${address.isDefault ? "address-default" : ""}`}
        >
          <div className="address-header">
            <div className="address-name">
              {address.tipo || "Dirección"} {/* tipo_direccion */}
            </div>
            {address.isDefault && (
              <div className="address-default-badge">Principal</div>
            )}
            <div className="address-actions">
              {!address.isDefault && (
                <button
                  className="address-action"
                  title="Establecer como principal"
                  onClick={() => setAsDefault(address.id)}
                >
                  <i className="fas fa-home"></i>
                </button>
              )}
              <button
                className="address-action"
                title="Editar"
                onClick={() => editAddress(address.id)}
              >
                <i className="fas fa-edit"></i>
              </button>
              <button
                className="address-action"
                title="Eliminar"
                onClick={() => deleteAddress(address.id)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <p>
            <strong>Dirección:</strong> {address.street}
          </p>
          <p>
            <strong>Ciudad:</strong> {address.city}, {address.state}{" "}
            {address.zip}
          </p>
          <p>
            <strong>País:</strong> {address.country}
          </p>
        </div>
      ))
    )}

    <button className="btn btn-primary" onClick={addNewAddress}>
      <i className="fas fa-plus"></i> Agregar Nueva Dirección
    </button>
  </div>
)}


          {/* SECCIÓN DE PEDIDOS RECIENTES */}

          {/* SECCIÓN DE FAVORITOS */}
          {activeSection === 'orders' && (
            <div id="orders-section" className="profile-section">
              <h2 className="section-title">Mis Pedidos</h2>
              
              {loadingOrders ? (
                <div className="loading-orders">
                  <i className="fas fa-spinner fa-spin"></i>
                  <p>Cargando tus pedidos...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="no-orders">
                  <i className="fas fa-shopping-bag"></i>
                  <h3>No tienes pedidos aún</h3>
                  <p>Cuando realices tu primera compra, aparecerá aquí.</p>
                  <a href="/productos" className="btn btn-primary">
                    Explorar Productos
                  </a>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-id">
                          Pedido #{order.id.substring(0, 8).toUpperCase()}
                        </div>
                        <div 
                          className="order-status"
                          style={{ 
                            backgroundColor: getStatusColor(order.estado),
                            color: '#fff'
                          }}
                        >
                          {order.estado}
                        </div>
                      </div>
                      
                      <div className="order-details">
                        <div className="order-products-preview">
                          {order.detalles.slice(0, 2).map((detalle, index) => (
                            <div key={detalle.id} className="order-product-preview">
                              <img 
                                src={detalle.producto_imagen || 'https://via.placeholder.com/50x50?text=Imagen'} 
                                alt={detalle.producto_nombre}
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/50x50?text=Imagen';
                                }}
                              />
                              {index === 0 && order.detalles.length > 2 && (
                                <div className="more-products">+{order.detalles.length - 2} más</div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <div className="order-info">
                          <div className="order-date">
                            Realizado el {formatDate(order.creado_en)}
                          </div>
                          <div className="order-items">
                            {order.detalles.length} producto{order.detalles.length !== 1 ? 's' : ''}
                          </div>
                          <div className="order-total">
                            Total: ${order.total}
                          </div>
                        </div>
                      </div>
                      
<div className="order-actions">
  <button 
    className="btn btn-outline"
    onClick={() => viewOrderDetails(order.id)}
  >
    Ver Detalles
  </button>
  
  {/* Mostrar "Seguir Pedido" para estados activos (no entregados ni cancelados) */}
  {(order.estado === 'Pendiente' || 
    order.estado === 'Confirmado' || 
    order.estado === 'En preparación' || 
    order.estado === 'Enviado' ||
   order.estado === 'cancelado' ||
  order.estado === 'Entregado')
   && (
    <button 
      className="btn btn-outline"  
      onClick={() => followPedido(order.id)}
    >
      Seguir Pedido
    </button>
  )}
  
  {order.estado === 'Entregado' && (
    <button className="btn btn-outline">
      Volver a Comprar
    </button>
  )}
</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECCIÓN DE SEGURIDAD */}
          {activeSection === "security" && (
  <div className="profile-section animate__animated animate__fadeIn">
    <h2 className="section-title text-center mb-4">
      <i className="fa-solid fa-lock me-2"></i> Cambiar Contraseña
    </h2>

    <form
      className="password-form p-4 rounded-4 shadow-lg"
      onSubmit={(e) => {
        e.preventDefault();
        handleChangePassword();
      }}
      style={{
      }}
    >
      {/* Contraseña actual */}
      <div className="form-group mb-3">
        <label
          htmlFor="currentPassword"
          className="form-label "
        >
          Contraseña Actual
        </label>
        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          className="form-control "
          placeholder="Ingresa tu contraseña actual"
        />
      </div>

      {/* Nueva contraseña */}
      <div className="form-group mb-3">
        <label
          htmlFor="newPassword"
          className="form-label "
        >
          Nueva Contraseña
        </label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          className="form-control "
          placeholder="Crea una nueva contraseña"
        />
      </div>

      {/* Confirmar contraseña */}
      <div className="form-group mb-4">
        <label
          htmlFor="confirmPassword"
          className="form-label t"
        >
          Confirmar Contraseña
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="form-control "
          placeholder="Confirma tu nueva contraseña"
        />
      </div>

      {/* Botón */}
      <div className="text-center">

        <button
          type="submit"
          className="btn btn-gradient px-5 py-2 rounded-3 fw-semibold"
          style={{
            background:
              "linear-gradient(90deg, #f8961e 0%, #ff9f1c 50%, #f8f8f8F1 100%)",
            border: "none",
            color: "#fff",
            boxShadow: "0 0 10px #f8961e",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.target.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) =>
            (e.target.style.transform = "scale(1)")
          }
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <i className="fa-solid fa-key me-2"></i> Actualizando Contraseña...
            </>
          ): (
            <>
                        <i className="fa-solid fa-key me-2"></i> Actualizar Contraseña
            </>
          )}
        </button>
      </div>
    </form>
  </div>
)}

          {/* SECCIÓN DE NOTIFICACIONES */}
          {activeSection === 'notifications' && (
            <div className="profile-section">
              <h2 className="section-title">Configuración de Notificaciones</h2>
              <form>
                <div className="toggle-group">
                  <div className="toggle-text">
                    <h4>Notificaciones por Email</h4>
                    <p>Recibir notificaciones por correo electrónico</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked/>
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-group">
                  <div className="toggle-text">
                    <h4>Estado de Pedidos</h4>
                    <p>Alertas sobre el estado de tus pedidos</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked/>
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-group">
                  <div className="toggle-text">
                    <h4>Ofertas Especiales</h4>
                    <p>Descuentos y promociones exclusivas</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked/>
                    <span className="slider"></span>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary">Guardar Preferencias</button>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer/>
      <FloatingWhatsApp/>
    </div>
  );
}