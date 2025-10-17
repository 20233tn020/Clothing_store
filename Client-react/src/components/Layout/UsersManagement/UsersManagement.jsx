import { useState, useEffect } from "react";
import styles from "./UsersManagement.module.css";
import clsx from "clsx";
import Swal from "sweetalert2";
import "animate.css";


export default function UsersManagement() {
  const [users, setUsers] = useState([]);

  // Simular carga de datos
  useEffect(() => {
    const mockUsers = [
      { id: "USR-001", name: "Christian", last_name: "Domingo Flores", email: "Chrs@gmail.com", password: "123456", phone: "7772161132",Fecha_Nacimiento:"08/09/2005",Genero :"Hombre",Direccion :"Calle Juárez 456",Ciudad :"Morelos",
        Estado_Provincia :"Jalisco",CP:"123456",Pais:"Mexico",Fecha_Creacion:"12/10/2025",Fecha_Actualizacion:"12/10/2025", Estado: "Activo" },
      { id: "USR-002", name: "Eder", last_name: "Peralta Jimenez", email: "eder@gmail.com", password: "987654", phone: "7775125385", Estado: "Inactivo" },
      { id: "USR-003", name: "Diego", last_name: "Loza", email: "diego@gmail.com", password: "456123", phone: "7774567896", Estado: "Temporal" },
    ];
    setUsers(mockUsers);
  }, []);

  // Funciones de acción
 function showEditUserModal(id) {
  const user = users.find(u => u.id === id);
  if (!user) return;

  Swal.fire({
    title: `Editar Usuario: ${user.name}`,
    html: `
      <div style="overflow-x: auto; max-width: 100%; white-space: nowrap;">
        <table style="min-width: 1200px; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; width: 100%;">
          <thead>
            <tr>
              <th style="padding: 10px; background: #ffc107; border: 1px solid #ddd; white-space: nowrap; position: sticky; left: 0;">Campo</th>
              <th style="padding: 10px; background: #ffc107; border: 1px solid #ddd; white-space: nowrap;">Valor Actual</th>
              <th style="padding: 10px; background: #ffc107; border: 1px solid #ddd; white-space: nowrap;">Nuevo Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: white; position: sticky; left: 0; font-weight: bold;">ID</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.id}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <input type="text" value="${user.id}" class="swal2-input" disabled style="width: 90%;">
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: white; position: sticky; left: 0; font-weight: bold;">Nombre</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.name}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <input type="text" value="${user.name}" class="swal2-input" id="edit-name" style="width: 90%;">
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: white; position: sticky; left: 0; font-weight: bold;">Apellido</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.last_name}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <input type="text" value="${user.last_name}" class="swal2-input" id="edit-last_name" style="width: 90%;">
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: white; position: sticky; left: 0; font-weight: bold;">Email</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.email}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <input type="email" value="${user.email}" class="swal2-input" id="edit-email" style="width: 90%;">
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: white; position: sticky; left: 0; font-weight: bold;">Password</td>
              <td style="padding: 10px; border: 1px solid #ddd;">••••••</td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <input type="password" placeholder="Nueva contraseña" class="swal2-input" id="edit-password" style="width: 90%;">
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: white; position: sticky; left: 0; font-weight: bold;">Teléfono</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.phone}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <input type="text" value="${user.phone}" class="swal2-input" id="edit-phone" style="width: 90%;">
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: white; position: sticky; left: 0; font-weight: bold;">Fecha Nacimiento</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Fecha_Nacimiento || 'N/A'}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <input type="date" value="${user.Fecha_Nacimiento || ''}" class="swal2-input" id="edit-fecha_nacimiento" style="width: 90%;">
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: white; position: sticky; left: 0; font-weight: bold;">Género</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Genero || 'N/A'}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <select class="swal2-input" id="edit-genero" style="width: 90%;">
                  <option value="">Seleccionar</option>
                  <option value="Masculino" ${user.Genero === 'Masculino' ? 'selected' : ''}>Masculino</option>
                  <option value="Femenino" ${user.Genero === 'Femenino' ? 'selected' : ''}>Femenino</option>
                  <option value="Otro" ${user.Genero === 'Otro' ? 'selected' : ''}>Otro</option>
                </select>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: white; position: sticky; left: 0; font-weight: bold;">Estado</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Estado}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <select class="swal2-input" id="edit-estado" style="width: 90%;">
                  <option value="Activo" ${user.Estado === 'Activo' ? 'selected' : ''}>Activo</option>
                  <option value="Inactivo" ${user.Estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                  <option value="Temporal" ${user.Estado === 'Temporal' ? 'selected' : ''}>Temporal</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Guardar Cambios",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    width: "95%",
    preConfirm: () => {
      return {
        name: document.getElementById('edit-name').value,
        last_name: document.getElementById('edit-last_name').value,
        email: document.getElementById('edit-email').value,
        password: document.getElementById('edit-password').value,
        phone: document.getElementById('edit-phone').value,
        Fecha_Nacimiento: document.getElementById('edit-fecha_nacimiento').value,
        Genero: document.getElementById('edit-genero').value,
        Estado: document.getElementById('edit-estado').value
      };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const updatedData = result.value;
      
      // Actualizar el usuario en el estado
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === id ? { ...u, ...updatedData } : u
        )
      );
      
      Swal.fire({
        icon: 'success',
        title: '¡Usuario actualizado!',
        text: `Los datos de ${updatedData.name} han sido actualizados correctamente.`,
        confirmButtonColor: "#3085d6"
      });
    }
  });
}



const confirmDeleteUser = (id) => {
  const user = users.find(u => u.id === id);
  if (!user) return;

  Swal.fire({
    title: `¿Eliminar Usuario?`,
    html: `
      <div style="text-align: center; padding: 20px;">
        <i class="fas fa-exclamation-triangle" style="font-size: 60px; color: #e74c3c; margin-bottom: 20px;"></i>
        <p style="font-size: 18px; margin-bottom: 10px;">¿Estás seguro de que deseas eliminar al usuario?</p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin: 15px 0;">
          <p style="margin: 5px 0; font-weight: bold;">${user.name} ${user.last_name}</p>
          <p style="margin: 5px 0; color: #666;">ID: ${user.id}</p>
          <p style="margin: 5px 0; color: #666;">Email: ${user.email}</p>
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
  }).then((result) => {
    if (result.isConfirmed) {
      try {
        // Simular una operación que podría fallar
        if (Math.random() < 0.1) { // 10% de probabilidad de error para prueba
          throw new Error('Error de conexión con el servidor');
        }

        // Eliminar el usuario del estado
        setUsers((prev) => prev.filter((user) => user.id !== id));
        
        // Mostrar confirmación de éxito
        Swal.fire({
          title: '¡Eliminado!',
          html: `
            <div style="text-align: center; padding: 10px;">
              <i class="fas fa-check-circle" style="font-size: 50px; color: #28a745; margin-bottom: 15px;"></i>
              <p style="font-size: 16px;">El usuario <strong>${user.name} ${user.last_name}</strong> ha sido eliminado correctamente.</p>
            </div>
          `,
          confirmButtonColor: '#3085d6',
          background: '#f9f9f9',
          width: '450px'
        });
        
      } catch (error) {
        // Manejar errores
        console.error('Error al eliminar usuario:', error);
        
        Swal.fire({
          title: 'Error',
          html: `
            <div style="text-align: center; padding: 10px;">
              <i class="fas fa-times-circle" style="font-size: 50px; color: #e74c3c; margin-bottom: 15px;"></i>
              <p style="font-size: 16px;">No se pudo eliminar el usuario.</p>
              <p style="font-size: 14px; color: #666; margin-top: 10px;">Error: ${error.message}</p>
            </div>
          `,
          confirmButtonColor: '#3085d6',
          background: '#f9f9f9',
          width: '450px'
        });
      }
    }
  });
};

function viewUser(id) {
  const user = users.find(u => u.id === id);
  if (!user) return;

  Swal.fire({
    background: "#f9f9f9",
    showClass: { popup: "animate__animated animate__fadeInDown" },
    hideClass: { popup: "animate__animated animate__fadeOutUp" },
    confirmButtonColor: "#3085d6",
    title: `Detalles de ${user.name}`,
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
              <td style="padding: 10px; border: 1px solid #ddd;">${user.name}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.last_name}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.email}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.password || '••••••'}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.phone}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Fecha_Nacimiento || 'N/A'}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Genero || 'N/A'}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Direccion || 'N/A'}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Ciudad || 'N/A'}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Estado_Provincia || 'N/A'}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.CP || 'N/A'}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Pais || 'N/A'}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Fecha_Creacion || 'N/A'}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Fecha_Actualizacion || 'N/A'}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${user.Estado}</td>
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
                <td>{user.name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>{user.phone}</td>
                <td>
                  <span
                    className={clsx(
                      styles.badge,
                      user.Estado === "Activo"
                        ? styles.badgeSuccess
                        : user.Estado === "Inactivo"
                        ? styles.badgeWarning
                        : styles.badgeGray
                    )}
                  >
                    {user.Estado}
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
