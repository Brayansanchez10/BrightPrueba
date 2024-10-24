import axios from '../axios';

// Función para crear una categoría
export const createCategory = (categoryData) => {
  const formData = new FormData(); // Crea una instancia de FormData

  // Agrega los datos de la categoría al FormData
  formData.append('name', categoryData.name);
  formData.append('description', categoryData.description);
  formData.append('image', categoryData.image); // Asegúrate de que la imagen se agregue al FormData con el nombre 'image'

  // Realiza la solicitud POST utilizando la instancia de axios
  return axios.post(`/category/createCategory`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Función para obtener todas las categorías
export const getCategories = () => axios.get(`/category/getCategories`);

// Función para actualizar una categoría
export const updateCategory = (id, categoryData) => {
  const formData = new FormData(); // Crea una instancia de FormData

  // Agrega los datos de la categoría al FormData
  formData.append('name', categoryData.name);
  formData.append('description', categoryData.description);
  formData.append('image', categoryData.image); // Asegúrate de que la imagen se agregue al FormData con el nombre 'image'

  // Realiza la solicitud PUT utilizando la instancia de axios
  return axios.put(`/category/updateCategory/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Función para eliminar una categoría
export const deleteCategory = (id) => axios.delete(`/category/deleteCategory/${id}`);

// Función para eliminar solo la categoría
export const deleteOnlyCategory = (id) => axios.delete(`/category/deleteOnlyCategory/${id}`);
