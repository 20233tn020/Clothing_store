import React from 'react';
import styles from "./Notifications.module.css";

export default function Notifications() {
  return (
    <div>
        <form action="">
    <div className={styles.form_group}>
      <label className={styles.form_label}>Notificaciones por Email</label><br /><br />

      <div className={styles.checkbox_group}>
        <label>
           <input type="checkbox"  /> Nuevos pedidos
        </label>
        <label>
          <input type="checkbox"  /> Pedidos cancelados
        </label>
        <label>
          <input type="checkbox" /> Productos con stock bajo
        </label>
        <label>
          <input type="checkbox"  /> Nuevos usuarios registrados
        </label>
      </div>
    </div><br /><br />
     <button type="button" className="btn btn-primary" >Guardar Preferencias</button>
    </form>
    </div>
  );
}
