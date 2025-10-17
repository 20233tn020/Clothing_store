import { useState, useCallback } from 'react';

export const useAlert = () => {
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'info'
  });

  const showAlert = useCallback((message, type = 'info') => {
    // Cancelar alerta anterior si existe
    setAlert(prev => ({ ...prev, show: false }));
    
    // Pequeño delay para permitir la animación de salida
    setTimeout(() => {
      setAlert({ 
        show: true, 
        message, 
        type 
      });
    }, 50);
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, show: false }));
  }, []);

  return { alert, showAlert, hideAlert };
};