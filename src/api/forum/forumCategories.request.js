import axios from "../axios";

// Función para obtener todas las categorias
export const getAllForumCategories = () => axios.get('/forumCategory/getAll');

// Función para obtener una categoría por ID
export const getForumCategoryById = (id) => axios.get(`/forumCategory/forumCategory/${id}`);

// Función para crear un Forum Categories
export const createForumCategories = async (categoriesData) => {
    try {
        const formData = new FormData();
        formData.append('name', categoriesData.name);
        formData.append('description', categoriesData.description);
        formData.append('entityId', Number(categoriesData.entityId));
        formData.append('icons', categoriesData.icons);

        return axios.post('/forumCategory/create', formData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Error al crear una Categoria:", error);
        throw error;
    }
};

// Función para actualizar un forum Category
export const updateForumCategories = async (id, categoriesData) => {
    try {
        const formData = new FormData();
        formData.append('name', categoriesData.name);
        formData.append('description', categoriesData.description);
        formData.append('icons', categoriesData.icons);

        return axios.put(`/forumCategory/update/${id}`, formData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Error al actualizar Categoria:", error);
        throw error;
    }
};

// Función para eliminar 
export const deleteForumCategory = (id) => axios.delete(`/forumCategory/delete/${id}`);

// Función para activar/desactivar el foro
export const toggleForumActivation = async (entityId, userId) => {
    try {
        const response = await axios.post('/forumCategory/forum/toggle', { entityId, userId });
        return response.data; // Devuelve el mensaje y el estado actualizado
    } catch (error) {
        console.error("Error al activar/desactivar el foro:", error);
        throw error;
    }
};

// Función para obtener el estado del foro
export const getForumState = async (entityId) => {
    try {
        const response = await axios.get('/forumCategory/forum/state', { params: { entityId } });
        return response.data.state; // Devuelve el estado actual del foro
    } catch (error) {
        console.error("Error al obtener el estado del foro:", error);
        throw error;
    }
};