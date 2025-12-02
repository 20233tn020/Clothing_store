// services/api.js
const API_BASE_URL = 'http://localhost:5000'; // Ajusta según tu backend

export const apiService = {
  // Obtener todos los productos
  async getProducts() {
    const response = await fetch(`${API_BASE_URL}/products`);
    const data = await response.json();
    return data;
  },

  // Obtener todas las categorías
  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`);
    const data = await response.json();
    return data;
  },

  // Obtener productos por género
  async getProductsByGender(gender) {
    const response = await fetch(`${API_BASE_URL}/products`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.data.filter(product => 
        product.genero && product.genero.toLowerCase() === gender.toLowerCase()
      );
    }
    return [];
  },

  // Obtener productos por categoría
  async getProductsByCategory(categoryId) {
    const response = await fetch(`${API_BASE_URL}/products`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.data.filter(product => 
        product.categoria_id === categoryId
      );
    }
    return [];
  },

  // Obtener productos por género y categoría
  async getProductsByGenderAndCategory(gender, categoryId) {
    const response = await fetch(`${API_BASE_URL}/products`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.data.filter(product => 
        product.genero && 
        product.genero.toLowerCase() === gender.toLowerCase() &&
        product.categoria_id === categoryId
      );
    }
    return [];
  }
};