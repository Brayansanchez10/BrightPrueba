import axios from 'axios';

const api = `https://apibrightmind.mesadoko.com/PE`; // Reemplaza la URL base con la correcta

// Función para crear una categoría
export const createCategory = (categoryData) => {
  const formData = new FormData(); // Crea una instancia de FormData

  // Agrega los datos de la categoría al FormData
  formData.append('name', categoryData.name);
  formData.append('description', categoryData.description);
  formData.append('image', categoryData.image); // Asegúrate de que la imagen se agregue al FormData con el nombre 'image'

  // Realiza la solicitud POST utilizando Axios
  return axios.post(`${api}/category/createCategory`, formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Función para obtener todas las categorías
export const getCategories = () => axios.get(`${api}/category/getCategories`, { withCredentials: true });

// Función para actualizar una categoría
export const updateCategory = (id, categoryData) => {
  const formData = new FormData(); // Crea una instancia de FormData

  // Agrega los datos de la categoría al FormData
  formData.append('name', categoryData.name);
  formData.append('description', categoryData.description);
  formData.append('image', categoryData.image); // Asegúrate de que la imagen se agregue al FormData con el nombre 'image'

  // Realiza la solicitud PUT utilizando Axios
  return axios.put(`${api}/category/updateCategory/${id}`, formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Función para eliminar una categoría
export const deleteCategory = (id) => axios.delete(`${api}/category/deleteCategory/${id}`, { withCredentials: true });

// Función para eliminar solo la categoría
export const deleteOnlyCategory = (id) => axios.delete(`${api}/category/deleteOnlyCategory/${id}`, { withCredentials: true });