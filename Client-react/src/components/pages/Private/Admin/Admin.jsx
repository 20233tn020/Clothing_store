import { useState } from "react";
import styles from './Admin.module.css';
import clsx from 'clsx';
import SalesChart from "../../../Common/Dashboard/SalesChart";
import ProductChart from "../../../Common/Dashboard/ProductChart";
import UsersManagement from "../../../Layout/UsersManagement/UsersManagement";
import OrdersManagement from "../../../Layout/OrdersManagement/OrdersManagement";
import ProductManagement from "../../../Layout/ProductManagement/ProductManagement";
import ReportAnalyze from "../../../Common/Dashboard/RportAnalyze";
import Notifications from "../../../Layout/notifications/notifications";
export default function Admin() {
  // Estado de pestaña activa
  const [activeTab, setActiveTab] = useState('dashboard');

  // Funciones de acción de ejemplo
  const viewOrder = (id) => alert(`Ver pedido ${id}`);
  const editOrder = (id) => alert(`Editar pedido ${id}`);
  const addOrder = () => alert("Agregar nuevo pedido");



  const categoryData = {
    labels: ["Electrónicos", "Ropa", "Hogar", "Deportes", "Juguetes"],
    datasets: [
      {
        data: [45, 20, 15, 12, 8],
        backgroundColor: [
          "rgba(67, 97, 238, 0.7)",
          "rgba(76, 201, 240, 0.7)",
          "rgba(248, 150, 30, 0.7)",
          "rgba(247, 37, 133, 0.7)",
          "rgba(72, 149, 239, 0.7)",
        ],
      },
    ],
  };

  const paymentData = {
    labels: ["Tarjeta Crédito", "Tarjeta Débito", "PayPal", "Transferencia", "Efectivo"],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          "rgba(67, 97, 238, 0.7)",
          "rgba(76, 201, 240, 0.7)",
          "rgba(248, 150, 30, 0.7)",
          "rgba(247, 37, 133, 0.7)",
          "rgba(72, 149, 239, 0.7)",
        ],
      },
    ],
  };
        const regionData = {
            labels: ['Norte', 'Sur', 'Este', 'Oeste', 'Centro'],
            datasets: [{
                label: 'Ventas por Región',
                data: [8500, 7200, 6300, 5900, 4100],
                backgroundColor: [
                    'rgba(67, 97, 238, 0.7)',
                    'rgba(76, 201, 240, 0.7)',
                    'rgba(248, 150, 30, 0.7)',
                    'rgba(247, 37, 133, 0.7)',
                    'rgba(72, 149, 239, 0.7)'
                ]
            }]
        };
               const performanceData = {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Meta',
                data: [18000, 19000, 20000, 21000, 22000, 23000],
                borderColor: 'rgba(247, 37, 133, 1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4
            }, {
                label: 'Real',
                data: [12000, 19000, 15000, 22000, 18000, 24580],
                borderColor: 'rgba(67, 97, 238, 1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4
            }]
        };
  return (
    <div className={styles.container}>
      <title>Panel de Administración - Tienda</title>

      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Panel Administrado</h2>
          <p>FASHION LUXE</p>
        </div>

        <div className={styles.sidebarMenu}>
          <ul className={styles.menuList}>
            {[
              { tab: 'dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' },
              { tab: 'users', icon: 'fa-users', label: 'Usuarios' },
              { tab: 'orders', icon: 'fa-shopping-cart', label: 'Pedidos' },
              { tab: 'products', icon: 'fa-box', label: 'Productos' },
              { tab: 'reports', icon: 'fa-chart-bar', label: 'Reportes' },
              { tab: 'settings', icon: 'fa-cog', label: 'Configuración' },
            ].map(item => (
              <li
                key={item.tab}
                className={clsx(styles.menuItem, activeTab === item.tab && styles.menuItemActive)}
                onClick={() => setActiveTab(item.tab)}
              >
                <a href="#" className={styles.menuLink}>
                  <i className={`fas ${item.icon} ${styles.menuIcon}`}></i>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Contenido principal */}
      <div className={styles.main_content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.header_left}>
            <h1>Panel de Administración</h1>
          </div>
          <div className={styles.header_right}>
            <div className={styles.user_info}>
              <div className={styles.user_avatar}>A</div>
              <div>
                <div>Administrador</div>
                <small>admin@fashionluxe.com</small>
              </div>
            </div>
            <button className="btn btn-light" onClick={() => alert("Salir")}>
              <i className={`fas fa-sign-out-alt ${styles.menuIcon}`}></i> Salir
            </button>
          </div>
        </div>

        {/* Contenido dinámico */}
        <div className={styles.content}>
          {activeTab === 'dashboard' && (
            <div className={styles.tabContent}>
              {/* Dashboard cards */}
              <div className={styles.dashboard_cards}>
                <div className={styles.card}>
                  <div className={styles.card_header}>
                    <div className={styles.card_title}>Ventas Totales</div>
                    <div className={clsx(styles.card_icon, 'sales')}>
                      <i className='fas fa-shopping-cart'></i>
                    </div>
                  </div>
                  <div className={styles.card_value}>$24,580</div>
                  <div className={styles.card_title}>+12% respecto al mes anterior</div>
                </div>
                <div className={styles.card}>
                  <div className={styles.card_header}>
                    <div className={styles.card_title}>Usuarios Registrados</div>
                    <div className={clsx(styles.card_icon, 'users')}>
                      <i className='fas fa-users'></i>
                    </div>
                  </div>
                  <div className={styles.card_value}>1,248</div>
                  <div className={styles.card_title}>+12% respecto al mes anterior</div>
                </div>
                <div className={styles.card}>
                  <div className={styles.card_header}>
                    <div className={styles.card_title}>Productos Activos</div>
                    <div className={clsx(styles.card_icon, 'products')}>
                      <i className='fas fa-box'></i>
                    </div>
                  </div>
                  <div className={styles.card_value}>365</div>
                  <div className={styles.card_title}>+8 productos nuevos</div>
                </div>
                <div className={styles.card}>
                  <div className={styles.card_header}>
                    <div className={styles.card_title}>Ingresos Netos</div>
                    <div className={clsx(styles.card_icon, 'revenue')}>
                      <i className='fas fa-dollar-sign'></i>
                    </div>
                  </div>
                  <div className={styles.card_value}>$18,420</div>
                  <div className={styles.card_title}>+15% respecto al mes anterior</div>
                </div>
              </div>

              {/* Charts */}
              <div className={styles.charts}>
                <div className={styles.chart_container}>
                  <div className={styles.chart_title}>Ventas Mensuales</div>
                  <div className={styles.chart}>
                    <SalesChart />
                  </div>
                </div>
                <div className={styles.chart_container}>
                  <div className={styles.chart_title}>Productos más vendidos</div>
                  <div className={styles.chart}>
                    <ProductChart />
                  </div>
                </div>
              </div>

              {/* Pedidos recientes */}
              <div className={styles.table_container}>
                <div className={styles.page_title}>
                  <h2>Pedidos Recientes</h2>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>ID Pedido</th>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                        <tbody>
                          <tr>
                            <td>#ORD-001</td>
                            <td>María González</td>
                            <td>15/06/2023</td>
                            <td>$245.00</td>
                            <td><span className={clsx(styles.badge, styles.badgeSuccess)}>Completado</span></td>
                          </tr> 
                          <tr>
                            <td>#ORD-002</td>
                            <td>Carlos López</td>
                            <td>14/06/2023</td>
                            <td>$189.50</td>
                            <td><span className={clsx(styles.badge, styles.badgeWarning)}>Pendiente</span></td>

                          </tr> 
                              <tr>
                                  <td>#ORD-003</td>
                                  <td>Ana Martínez</td>
                                  <td>13/06/2023</td>
                                  <td>$320.75</td>
                                  <td><span className={clsx(styles.badge, styles.badgeSuccess)}>Completado</span></td>
                              </tr>
                              <tr>
                                  <td>#ORD-004</td>
                                  <td>Javier Rodríguez</td>
                                  <td>12/06/2023</td>
                                  <td>$145.00</td>
                                  <td><span class={clsx(styles.badge, styles.badgedanger)}>Cancelado</span></td>
    
                              </tr>
                        </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Aquí puedes agregar más pestañas dinámicas */}
          {activeTab === 'users' && <div className={styles.tabContent}>
              <div className={styles.page_title}>
                <h2>Gestion de Usuario</h2>
                <div>
                  <button class="btn btn-primary" onclick="showAddUserModal()">
                    <i class="fas fa-plus"></i> Agregar Usuario
                  </button>
                </div>
              </div>
              <div className={styles.table_container}>
                <UsersManagement />
              </div>
            </div>}
          {activeTab === 'orders' && <div className={styles.tabContent}>
            <div className={styles.page_title}>
              <h2>Gestion de Pedidos</h2>
            </div>
          <OrdersManagement/>
            </div>}
          {activeTab === 'products' && <div className={styles.tabContent}>
            <div className={styles.page_title}>
              <h2>Gestion de Productos </h2>
            </div>
            <ProductManagement/>
          </div>}
          {activeTab === 'reports' && <div className={styles.tabContent}>
            <div className={styles.page_title}>
              <h2>Reportes y Análisis</h2>
              <div>
                <button className="btn btn-primary" onclick="generateReport()">
                  <i className="fas fa-chart-pie"></i> Generar Reporte
                </button>
              </div>
              </div>
              <div  className={styles.stats_grid}>
                <div  className={styles.stat_card}>
                    <div className={styles.stat_value}>$24,580</div>
                    <div className={styles.stat_title}>Ventas Totales</div>
                </div>
                <div className={styles.stat_card}>
                        <div className={styles.stat_value}>1,248</div>
                        <div  className={styles.stat_title}>Clientes Registrados</div>
                </div>
                <div className={styles.stat_card}>
                        <div className={styles.stat_value}>356</div>
                        <div  className={styles.stat_title}>Productos Activos</div>
                </div>
                <div className={styles.stat_card}>
                        <div className={styles.stat_value}>84%</div>
                        <div  className={styles.stat_title}>Tasa de Conversión</div>
                </div>
              </div>
    <div className={styles.charts}>
      <div className={styles.chart_container}>
        <div className={styles.chart_title}>Distribución de Ventas por Categoría</div>
        <div className={styles.chart}>
          {/* Llamada con gráfico tipo doughnut */}
          <ReportAnalyze type="doughnut" data={categoryData} />
        </div>
      </div>

      <div className={styles.chart_container}>
        <div className={styles.chart_title}>Métodos de Pago</div>
        <div className={styles.chart}>
          {/* Llamada con gráfico tipo pie */}
          <ReportAnalyze type="pie" data={paymentData} />
        </div>
      </div>
    </div>

        <div className={styles.charts}>
      <div className={styles.chart_container}>
        <div className={styles.chart_title}>Rendimiento Mensual </div>
        <div className={styles.chart}>
          {/* Llamada con gráfico tipo doughnut */}
          <ReportAnalyze type="line" data={ performanceData} />
        </div>
      </div>

      <div className={styles.chart_container}>
        <div className={styles.chart_title}>Regiones con Más Ventas</div>
        <div className={styles.chart}>
          {/* Llamada con gráfico tipo pie */}
          <ReportAnalyze type="polarArea" data={regionData} />
        </div>
      </div>
    </div>
  
              </div>}
          {activeTab === 'settings' && <div className={styles.tabContent}>
            <div className={styles.page_title}>
              <h2>Configuración del Sistema</h2>
            </div>
            <div className={styles.settings_container}>
              <div className={styles.settings_card}>
                <div  className={styles.settings_title}>Información de la Tienda</div>
                <form id="storeSettings">
                  <div  className={styles.form_group}>
                      <label  className={styles.form_label}>Nombre de la Tienda</label>
                         <input type="text" className={styles.form_control} value="Fashion Luxe"
                            readOnly // evita que se edite
                            style={{ cursor: 'not-allowed' }} // cambia el cursor a prohibido
                          />
                  </div>
                  <br />
                  <div  className={styles.form_group}>
                      <label  className={styles.form_label}>Email de la tienda </label>
                         <input type="email" className={styles.form_control} value="FashionLuxe@gmail.com"
                            readOnly // evita que se edite
                            style={{ cursor: 'not-allowed' }} // cambia el cursor a prohibido
                          />
                  </div>
                  <br />
                  <div  className={styles.form_group}>
                      <label  className={styles.form_label}>Teléfono</label>
                         <input type="text" className={styles.form_control} value="7774658796"
                            readOnly // evita que se edite
                            style={{ cursor: 'not-allowed' }} // cambia el cursor a prohibido
                          />
                  </div>
                  <br />
                   <div  className={styles.form_group}>
                      <label  className={styles.form_label}>Dirección</label>
                         <input type="text" className={styles.form_control} value="Av. Principal #123, Ciudad, País"
                            readOnly // evita que se edite
                            style={{ cursor: 'not-allowed' }} // cambia el cursor a prohibido
                          />
                  </div>
                </form>
              </div>
              <div className={styles.settings_card}>
                <div className={styles.settings_title}>Configuracion de Notificaciones</div>
                <Notifications/>

                </div>
              
              
              
              
              
              
              
              
          </div>  
          </div>}
        </div>
      </div>
    </div>
  );
}
