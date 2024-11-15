import axios from "../axios";

// Función para obtener todas las entidades
export const getEntity = () => axios.get('/entities/getEntity');

export const getEntityById = (id) => axios.get(`/entities/getEntityById/${id}`)

// Función para crear una entidad
export const createEntity = async (entityData) => {
    try {
        const formData = new FormData();
        formData.append('name', entityData.name);
        formData.append('type', entityData.type);
        
        // Realiza la solicitud POST
        return axios.post('/entities/createEntity', formData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Error al crear una Entidad:", error);
        throw error;
    }
};

// Función para editar una entidad
export const updateEntity = async (id, entityData) => {
    try {
        const formData = new FormData();
        formData.append('name', entityData.name);
        formData.append('type', entityData.type);

        // Realiza la solicitud PUT
        return axios.put(`/entities/updateEntity/${id}`, formData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Error al actualizar Entidad:", error);
        throw error;
    }
};

// Función para eliminar un tema
export const deleteEntity = (id) => axios.delete(`/entities/deleteEntity/${id}`);