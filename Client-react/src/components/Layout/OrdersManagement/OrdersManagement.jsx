import { useState, useEffect } from "react";
import styles from "./OrdersManagement.module.css";
import clsx from "clsx";
import Swal from "sweetalert2";
import "animate.css";

export default function OrdersManagement() {
  const [pedidos, setPedidos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPedidos, setFilteredPedidos] = useState([]);

  useEffect(() => {
    const mockPedidos = [
      { Id_Pedido: "ORD-001", Cliente: "Christian", Fecha: "12/10/2025", Productos: "3", Total: "245.00", Estado: "Entregado" },
      { Id_Pedido: "ORD-002", Cliente: "Carlos", Fecha: "13/10/2025", Productos: "2", Total: "180.00", Estado: "Pendiente" },
      { Id_Pedido: "ORD-003", Cliente: "Lucía", Fecha: "13/10/2025", Productos: "1", Total: "99.99", Estado: "Enviado" },
      { Id_Pedido: "ORD-004", Cliente: "María", Fecha: "14/10/2025", Productos: "5", Total: "340.00", Estado: "Cancelado" },
      { Id_Pedido: "ORD-005", Cliente: "José", Fecha: "14/10/2025", Productos: "4", Total: "275.00", Estado: "Procesando" },
    ];
    setPedidos(mockPedidos);
    setFilteredPedidos(mockPedidos);
  }, []);

  // 🔍 Función de búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredPedidos(pedidos);
      return;
    }

    const filtered = pedidos.filter(pedido => 
      pedido.Id_Pedido.toLowerCase().includes(term.toLowerCase()) ||
      pedido.Cliente.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredPedidos(filtered);

  };
  

  //  Ver detalles del pedido
  function viewPedido(Id_Pedido) {
    const pedido = pedidos.find((u) => u.Id_Pedido === Id_Pedido);
    if (!pedido) return;

    Swal.fire({
      background: "#f9f9f9",
      showClass: { popup: "animate__animated animate__fadeInDown" },
      hideClass: { popup: "animate__animated animate__fadeOutUp" },
      confirmButtonColor: "#3085d6",
      title: `Detalles de ${pedido.Cliente}`,
      html: `
        <div style="overflow-x: auto; max-width: 100%; white-space: nowrap;">
          <table style="min-width: 1200px; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; width: 100%;">
            <thead>
              <tr>
                <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd;">ID Pedido</th>
                <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd;">Cliente</th>
                <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd;">Fecha</th>
                <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd;">Total</th>
                <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd;">Estado</th>
                <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd;">Productos</th>
                <th style="padding: 10px; background: #fabc66; border: 1px solid #ddd;">Dirección de Envío</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">${pedido.Id_Pedido}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${pedido.Cliente}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${pedido.Fecha || "N/A"}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">$${pedido.Total || "N/A"}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${pedido.Estado || "••••••"}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${pedido.Productos || "N/A"}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${pedido.Direccion_envio || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
      confirmButtonText: "Cerrar",
      width: "95%",
      customClass: {
        popup: styles.swalPopup,
      },
    });
  }

  function showEditUserModal(Id_Pedido) {
    const pedido = pedidos.find((u) => u.Id_Pedido === Id_Pedido);
    if (!pedido) return;

    const estadoMap = {
      'pending': 'Pendiente',
      'processing': 'Procesando', 
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };

    const getSelectedEstado = (estado) => {
      const entries = Object.entries(estadoMap);
      const found = entries.find(([key, value]) => value === estado);
      return found ? found[0] : 'pending';
    };

    Swal.fire({
      title: `Editar Pedido de: ${pedido.Cliente}`,
      html: `
        <form id="editOrderForm">
          <div class="form-group">
            <label class="form-label">Estado</label>
            <select class="form-control" id="orderStatus" required>
              <option value="pending" ${getSelectedEstado(pedido.Estado) === 'pending' ? 'selected' : ''}>Pendiente</option>
              <option value="processing" ${getSelectedEstado(pedido.Estado) === 'processing' ? 'selected' : ''}>Procesando</option>
              <option value="shipped" ${getSelectedEstado(pedido.Estado) === 'shipped' ? 'selected' : ''}>Enviado</option>
              <option value="delivered" ${getSelectedEstado(pedido.Estado) === 'delivered' ? 'selected' : ''}>Entregado</option>
              <option value="cancelled" ${getSelectedEstado(pedido.Estado) === 'cancelled' ? 'selected' : ''}>Cancelado</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Notas</label>
            <textarea class="form-control" id="orderNotes" rows="3">${pedido.Notas || 'Pedido entregado satisfactoriamente'}</textarea>
          </div>
        </form>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar Cambios",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      width: "500px",
      preConfirm: () => {
        return {
          Estado: document.getElementById('orderStatus').value,
          Notas: document.getElementById('orderNotes').value
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          const updatedData = result.value;
          
          setPedidos(prevPedidos => 
            prevPedidos.map(p => 
              p.Id_Pedido === Id_Pedido ? { 
                ...p, 
                Estado: estadoMap[updatedData.Estado] || updatedData.Estado,
                Notas: updatedData.Notas
              } : p
            )
          );
          
          Swal.fire({
            title: '¡Pedido actualizado!',
            html: `
              <div style="text-align: center; padding: 10px;">
                <i class="fas fa-check-circle" style="font-size: 50px; color: #28a745; margin-bottom: 15px;"></i>
                <p style="font-size: 16px;"> El pedido de <strong>${pedido.Cliente}</strong> ha sido actualizado correctamente.</p>
              </div>`,
            confirmButtonColor: "#3085d6",
            background: '#f9f9f9',
            width: '450px'
          });

        } catch (error) {
          console.error('Error al actualizar pedido:', error);
          Swal.fire({
            title: 'Error',
            html: ` 
            <div style="text-align: center; padding: 10px;">
             <i class="fas fa-times-circle" style="font-size: 50px; color: #e74c3c; margin-bottom: 15px;"></i>
                           <p style="font-size: 16px;">No se pudo actualizar el pedido. Por favor, intenta nuevamente.</p>
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
  }

  return (
    <div>
      {/*  Filtros de búsqueda */}
      <div className={styles.search_filters}>
        <div className={styles.search_box}>
          <input 
            type="text" 
            className={styles.form_control} 
            placeholder="Buscar por ID o nombre del cliente..." 
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <i className="fas fa-search"></i>
        </div>

        <select className={`${styles.form_control} ${styles.filter_select}`}>
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="processing">Procesando</option>
          <option value="shipped">Enviado</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
        </select>

        <input type="date" className={styles.form_control} />
        <input type="date" className={styles.form_control} />
      </div>

      {/* 📊 Información de resultados */}
      <div className={styles.search_info}>
        <p>
          Mostrando <strong>{filteredPedidos.length}</strong> de <strong>{pedidos.length}</strong> pedidos
          {searchTerm && (
            <span> para: <strong>"{searchTerm}"</strong></span>
          )}
        </p>
      </div>

      {/* 📋 Tabla de pedidos */}
      <div className={styles.table_container}>
        <table>
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos.length === 0 ? (
              <tr>
                <td colSpan="7" className={styles.no_results}>
                  <i className="fas fa-search"></i>
                  <p>No se encontraron pedidos</p>
                </td>
              </tr>
            ) : (
              filteredPedidos.map((pedido) => (
                <tr key={pedido.Id_Pedido}>
                  <td>#{pedido.Id_Pedido}</td>
                  <td>{pedido.Cliente}</td>
                  <td>{pedido.Fecha}</td>
                  <td>{pedido.Productos} productos</td>
                  <td>${pedido.Total}</td>
                  <td>
                    <span className={clsx( 
                      styles.badge, 
                      pedido.Estado === "Entregado" ? styles.badgeSuccess : 
                      pedido.Estado === "Pendiente" ? styles.badgeWarning :
                      pedido.Estado === "Enviado" ? styles.badgeBlue :
                      pedido.Estado === "Procesando" ? styles.badgeGray : 
                      styles.badgedanger 
                    )}>
                      {pedido.Estado}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button className="btn btn-sm btn-info" onClick={() => viewPedido(pedido.Id_Pedido)}>
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="btn btn-sm btn-warning" onClick={() => showEditUserModal(pedido.Id_Pedido)}>
                      <i className="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}