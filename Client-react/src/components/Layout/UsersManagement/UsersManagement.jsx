import { useState, useEffect } from "react";
import styles from "./UsersManagement.module.css";
import clsx from "clsx";
import Swal from "sweetalert2";
import axios from "axios";
import "animate.css";


export default function UsersManagement() {
  const [users, setUsers] = useState([]);

  // Cargar los usuarios desde Flask
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/users") 
      .then((response) => {
        setUsers(response.data.users); 
      })
      .catch((error) => {
        console.error("Error al obtener usuarios:", error);
        Swal.fire({
          icon: "error",
          title: "Error al cargar usuarios",
          text: "No se pudieron obtener los usuarios desde el servidor.",
        });
      });
  }, []);


  // Función para formatear fecha
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) return 'N/A';
    
    // Formato dd/mm/aaaa
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return 'N/A';
  }
}

// Función para formatear fecha en formato YYYY-MM-DD (para input type="date")
function formatDateForInput(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formateando fecha para input:', error);
    return '';
  }
}
 async function showEditUserModal(id) {
  const user = users.find(u => String(u.id) === String(id));
  if (!user) {
    console.warn("Usuario no encontrado:", id);
    return;
  }

  await Swal.fire({
    title: `Editar Usuario: ${user.Nombre}`,
    html: `
      <div style="overflow-x: auto; max-width: 100%; white-space: nowrap;">
        <table style="min-width: 1200px; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; width: 100%;">
          <thead>
            <tr>
              <th style="padding: 10px; background: #ffc107; border: 1px solid #ddd;">Campo</th>
              <th style="padding: 10px; background: #ffc107; border: 1px solid #ddd;">Valor Actual</th>
              <th style="padding: 10px; background: #ffc107; border: 1px solid #ddd;">Nuevo Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:10px; font-weight:bold;">Id</td>
              <td style="padding:10px;">${user.id}</td>
              <td style="padding:10px;">
                <label id="edit-id" class="swal2-input" style="width:90%;">${user.id}</label>
              </td>
            </tr>
            <tr>
              <td style="padding:10px; font-weight:bold;">Nombre</td>
              <td style="padding:10px;">${user.Nombre}</td>
              <td style="padding:10px;">
                <input type="text" value="${user.Nombre}" id="edit-nombre" class="swal2-input" style="width:90%;">
              </td>
            </tr>
            <tr>
              <td style="padding:10px; font-weight:bold;">Apellido</td>
              <td style="padding:10px;">${user.Apellido}</td>
              <td style="padding:10px;">
                <input type="text" value="${user.Apellido}" id="edit-apellido" class="swal2-input" style="width:90%;">
              </td>
            </tr>
            <tr>
              <td style="padding:10px; font-weight:bold;">Email</td>
              <td style="padding:10px;">${user.Email}</td>
              <td style="padding:10px;">
                <input type="email" value="${user.Email}" id="edit-email" class="swal2-input" style="width:90%;">
              </td>
            </tr>
            <tr>
              <td style="padding:10px; font-weight:bold;">Teléfono</td>
              <td style="padding:10px;">${user.Telefono}</td>
              <td style="padding:10px;">
                <input type="text" value="${user.Telefono}" id="edit-telefono" class="swal2-input" style="width:90%;">
              </td>
            </tr>
            <tr>
              <td style="padding:10px; font-weight:bold;">Género</td>
              <td style="padding:10px;">${user.Genero || 'N/A'}</td>
              <td style="padding:10px;">
                <select id="edit-genero" class="swal2-input" style="width:90%;">
                  <option value="">Seleccionar</option>
                  <option value="Masculino" ${user.Genero === 'Masculino' ? 'selected' : ''}>Masculino</option>
                  <option value="Femenino" ${user.Genero === 'Femenino' ? 'selected' : ''}>Femenino</option>
                  <option value="Otro" ${user.Genero === 'Otro' ? 'selected' : ''}>Otro</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Guardar Cambios",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    width: "95%",
    preConfirm: () => ({
      id: document.getElementById("edit-id").textContent.trim(),
      Nombre: document.getElementById("edit-nombre").value.trim(),
      Apellido: document.getElementById("edit-apellido").value.trim(),
      Email: document.getElementById("edit-email").value.trim(),
      Telefono: document.getElementById("edit-telefono").value.trim(),
      Genero: document.getElementById("edit-genero").value
    })
  }).then(async (result) => {
    if (result.isConfirmed) {
      const updatedData = result.value;

      try {
        const response = await axios.put("http://127.0.0.1:5000/UpdateUser", updatedData);

        // Actualizar el estado local
        setUsers(prevUsers =>
          prevUsers.map(u => (u.id === id ? { ...u, ...updatedData } : u))
        );

        Swal.fire({
          icon: "success",
          title: "¡Usuario actualizado!",
          text: response.data.message || "Los datos han sido actualizados correctamente.",
          confirmButtonColor: "#3085d6"
        });
      } catch (error) {
        console.error("Error al actualizar usuario:", error);
        Swal.fire({
          icon: "error",
          title: "Error al actualizar",
          text: error.response?.data?.error || error.message,
          confirmButtonColor: "#d33"
        });
      }
    }
  });
}


const confirmDeleteUser = async (id) => {
  const user = users.find(u => u.id === id);
  if (!user) return;

  const result = await Swal.fire({
    title: `¿Eliminar Usuario?`,
    html: `
      <div style="text-align: center; padding: 20px;">
        <i class="fas fa-exclamation-triangle" style="font-size: 60px; color: #e74c3c; margin-bottom: 20px;"></i>
        <p style="font-size: 18px; margin-bottom: 10px;">¿Estás seguro de que deseas eliminar al usuario?</p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin: 15px 0;">
          <p style="margin: 5px 0; font-weight: bold;">${user.Nombre} ${user.Apellido}</p>
          <p style="margin: 5px 0; color: #666;">ID: ${user.id}</p>
          <p style="margin: 5px 0; color: #666;">Email: ${user.Email}</p>
        </div>
        <p style="color: #e74c3c; font-weight: bold;">
          <i class="fas fa-exclamation-circle"></i> Esta acción no se puede deshacer
        </p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    background: '#f9f9f9',
    showClass: { popup: 'animate__animated animate__fadeInDown' },
    hideClass: { popup: 'animate__animated animate__fadeOutUp' },
    width: '500px'
  });

  if (result.isConfirmed) {
    try {
      // DELETE enviando todos los campos requeridos por Flask
      const response = await axios.delete("http://127.0.0.1:5000/DeleteUser", {
        data: {
          id: user.id,
          Nombre: user.Nombre,
          Email: user.Email
        }
      });

      // Actualizar el estado en React
      setUsers(prev => prev.filter(u => u.id !== id));

      // Confirmación de éxito
      Swal.fire({
        title: '¡Eliminado!',
        html: `
          <div style="text-align: center; padding: 10px;">
            <i class="fas fa-check-circle" style="font-size: 50px; color: #28a745; margin-bottom: 15px;"></i>
            <p style="font-size: 16px;">El usuario <strong>${user.Nombre} ${user.Apellido}</strong> ha sido eliminado correctamente.</p>
          </div>
        `,
        confirmButtonColor: '#3085d6',
        background: '#f9f9f9',
        width: '450px'
      });

    } catch (error) {
      console.error('Error al eliminar usuario:', error);

      Swal.fire({
        title: 'Error',
        html: `
          <div style="text-align: center; padding: 10px;">
            <i class="fas fa-times-circle" style="font-size: 50px; color: #e74c3c; margin-bottom: 15px;"></i>
            <p style="font-size: 16px;">No se pudo eliminar el usuario.</p>
            <p style="font-size: 14px; color: #666; margin-top: 10px;">Error: ${error.response?.data?.error || error.message}</p>
          </div>
        `,
        confirmButtonColor: '#3085d6',
        background: '#f9f9f9',
        width: '450px'
      });
    }
  }
};


function viewUser(id) {
  const user = users.find(u => String(u.id) === String(id));
  if (!user) {
    console.warn("Usuario no encontrado:", id);
    return;
  }

  Swal.fire({
    background: "#f9f9f9",
    showClass: { popup: "animate__animated animate__fadeInDown" },
    hideClass: { popup: "animate__animated animate__fadeOutUp" },
    confirmButtonColor: "#3085d6",
    title: `Detalles de ${user.Nombre}`,
    html: `
      <div style="overflow-x: auto; max-width: 100%; white-space: nowrap;">
        <table style="min-width: 1200px; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; width: 100%;">
          <thead>
            <tr>
              <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd; white-space: nowrap; position: sticky; left: 0;">ID</th>
              <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd; white-space: nowrap;">Nombre</th>
              <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd; white-space: nowrap;">Apellido</th>
              <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd; white-space: nowrap;">Email</th>
              <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd; white-space: nowrap;">Password</th>
              <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd; white-space: nowrap;">Teléfono</th>
              <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd; white-space: nowrap;">Fecha Nac.</th>
              <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd; white-space: nowrap;">Género</th>
              <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd; white-space: nowrap;">Dirección</th>
              <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd; white-space: nowrap;">Ciudad</th>
              <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd; white-space: nowrap;">Estado</th>
              <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd; white-space: nowrap;">C.P.</th>
              <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd; white-space: nowrap;">País</th>
              <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd; white-space: nowrap;">Fecha Creación</th>
              <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd; white-space: nowrap;">Fecha Actualización</th>
              <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd; white-space: nowrap;">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: white; position: sticky; left: 0;">${user.id}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Nombre}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Apellido}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Email}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Password || '••••••'}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Telefono}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Fecha_Nacimiento || 'N/A'}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Genero || 'N/A'}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Direccion || 'N/A'}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Ciudad || 'N/A'}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Estado || 'N/A'}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.CP || 'N/A'}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Pais || 'N/A'}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Fecha_creacion || 'N/A'}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Fecha_actualizacion || 'N/A'}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Activo}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    confirmButtonText: "Cerrar",
    width: "95%",
    customClass: {
      popup: styles.swalPopup
    }
  });
}

  return (
    <div className={styles.container}>
      <h2>Gestión de Usuarios</h2>

     {users.length === 0 ? (
        <div className={styles.noUsers}>
          <i className="fas fa-user-slash"></i>
          <p>No hay usuarios registrados</p>
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Password</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>#{user.id}</td>
                <td>{user.Nombre}</td>
                <td>{user.Apellido}</td>
                <td>{user.Email}</td>
                <td>{user.Password|| '••••••'}</td>
                <td>{user.Telefono}</td>
                <td>
                    <span
                      className={clsx(
                        styles.badge,
                        user.Activo == 1 || user.Activo === true
                          ? styles.badgeSuccess
                          : user.Activo == 0 || user.Activo === false
                          ? styles.badgeWarning
                          : styles.badgeGray
                      )}
                    >
                    {user.Activo == 1 || user.Activo === true
                      ? "Activo"
                      : user.Activo == 0 || user.Activo === false
                      ? "Inactivo"
                      : "Desconocido"}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => viewUser(user.id)}
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => showEditUserModal(user.id)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => confirmDeleteUser(user.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
