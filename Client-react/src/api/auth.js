// src/api/auth.js
export const login = async (email, password) => {
  try {
    const response = await fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }), // el backend espera username
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Error al iniciar sesión');
    }

    return await response.json(); // contiene { access_token }
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};
