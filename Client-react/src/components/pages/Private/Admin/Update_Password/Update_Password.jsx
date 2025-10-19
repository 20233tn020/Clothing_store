import React from 'react';
import styles from "./Update_Password.module.css";

export const Update_Password = () => {

  const saveSecuritySettings = () => {
    console.log("Configuraciones de seguridad actualizadas ✅");
  };

  return (
    <div>
      <form>
        <div className={styles.form_group}>
          <label className={styles.form_label}>Cambiar Contraseña</label>
          <input
            type="password"
            className={styles.form_control}
            placeholder="Contraseña actual"
          />
          <input
            type="password"
            className={styles.form_control}
            placeholder="Nueva contraseña"
            style={{ marginTop: "10px" }}
          />
          <input
            type="password"
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
          <select defaultValue="60" className={styles.form_control}>
            <option value="15">15 minutos</option>
            <option value="30">30 minutos</option>
            <option value="60">1 hora</option>
            <option value="120">2 horas</option>
          </select>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={saveSecuritySettings}
        >
          Actualizar Seguridad
        </button>
      </form>
    </div>
  );
};
