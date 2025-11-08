import React, { useEffect, useState, useRef } from "react";
import styles from "./Update_Password.module.css";
import Swal from "sweetalert2";
import axios from "axios";

export const Update_Password = () => {
  const [sessionTimeout, setSessionTimeout] = useState(15); // minutos por defecto
  const timeoutRef = useRef(null);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Reinicia el temporizador cuando el usuario interactúa
  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const timeoutDuration = sessionTimeout * 60 * 1000;

    timeoutRef.current = setTimeout(() => {
      handleSessionExpire();
    }, timeoutDuration);
  };

  // Cierra sesión por inactividad
  const handleSessionExpire = () => {
    Swal.fire({
      icon: "warning",
      title: "Sesión expirada",
      text: "Tu sesión ha cerrado por inactividad.",
      confirmButtonText: "Iniciar sesión de nuevo",
    }).then(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/LogoutLink";
    });
  };

  // Detecta actividad del usuario
  useEffect(() => {
    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // Inicia el contador al cargar

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [sessionTimeout]);

  // Maneja cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Guardar configuración de seguridad
  const saveSecuritySettings = () => {
    Swal.fire({
      icon: "success",
      title: "Configuración actualizada",
      text: `La sesión se cerrará automáticamente tras ${sessionTimeout} minutos de inactividad.`,
      confirmButtonColor: "#3085d6",
    });
  };

  // Actualizar contraseña en la API
  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = formData;
    const user = JSON.parse(localStorage.getItem("user")); // recupera datos del admin logueado
    const token = localStorage.getItem("token");
if (!currentPassword || !newPassword || !confirmPassword) {
  Swal.fire({
    title: 'Error',
    html: `
      <div style="text-align: center; padding: 10px;">
        <i class="fas fa-times-circle" style="font-size: 50px; color: #e74c3c; margin-bottom: 15px;"></i>
        <p style="font-size: 16px;">Por favor completa todos los campos.</p>
      </div>
    `,
    confirmButtonColor: '#3085d6',
    background: '#f9f9f9',
    width: '450px'
  });
  return;
}

if (newPassword !== confirmPassword) {
  Swal.fire({
    title: 'Error',
    html: `
      <div style="text-align: center; padding: 10px;">
        <i class="fas fa-times-circle" style="font-size: 50px; color: #e74c3c; margin-bottom: 15px;"></i>
        <p style="font-size: 16px;">Las contraseñas no coinciden.</p>
      </div>
    `,
    confirmButtonColor: '#3085d6',
    background: '#f9f9f9',
    width: '450px'
  });
  return;
}


    try {
      const response = await axios.put(
        "http://127.0.0.1:5000/UpdatePasswordAdmin",
        {
          id: user.id,
          Password: currentPassword,
          NewPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


// Confirmación de éxito
Swal.fire({
  title: 'Contraseña actualizada',
  html: `
    <div style="text-align: center; padding: 10px;">
      <i class="fas fa-check-circle" style="font-size: 50px; color: #28a745; margin-bottom: 15px;"></i>
      <p style="font-size: 16px;">${
        response.data.message || "Tu contraseña ha sido actualizada correctamente."
      }</p>
    </div>
  `,
  confirmButtonColor: '#3085d6',
  background: '#f9f9f9',
  width: '450px'
});

      // Limpia los campos
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      const msg =
        error.response?.data?.error || "Ocurrió un error al actualizar la contraseña.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: msg,
      });
    }
  };

  return (
    <div>
      <form>
        <div className={styles.form_group}>
          <label className={styles.form_label}>Cambiar Contraseña</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className={styles.form_control}
            placeholder="Contraseña actual"
          />
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className={styles.form_control}
            placeholder="Nueva contraseña"
            style={{ marginTop: "10px" }}
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={styles.form_control}
            placeholder="Confirmar nueva contraseña"
            style={{ marginTop: "10px" }}
          />
        </div>

        <div className={styles.form_group}>
          <label className={styles.form_label}>Autenticación de Dos Factores</label>
          <select defaultValue="disabled" className={styles.form_control}>
            <option value="enabled">Habilitado</option>
            <option value="disabled">Deshabilitado</option>
          </select>
        </div>

        <div className={styles.form_group}>
          <label className={styles.form_label}>Sesión Automática</label>
          <select
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(Number(e.target.value))}
            className={styles.form_control}
          >
            <option value="15">15 minutos</option>
            <option value="30">30 minutos</option>
            <option value="60">1 hora</option>
            <option value="120">2 horas</option>
          </select>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleChangePassword}
          >
            Actualizar Contraseña
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={saveSecuritySettings}
          >
            Guardar Configuración
          </button>
        </div>
      </form>
    </div>
  );
};
