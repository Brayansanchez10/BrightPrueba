import axios from "../axios";

// Función para obtnr todos las categorias

export const getAllForumCategories = () => axios.get('/forumCategory/getAll');

// Función para crear un Forum Categories
export const createForumCategories = async (categoriesData) => {
    try {
        const formData = new FormData();
        formData.append('name', categoriesData.name);
        formData.append('description', categoriesData.description);
        formData.append('entityId', Number(categoriesData.entityId));

        //Agregar imagen si existe
        if (categoriesData.image) {
            formData.append('image', categoriesData.image);
        }

        // Realizar la solicitud POST
        return axios.post('/forumCategory/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
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

         //Agregar imagen si existe
         if (categoriesData.image) {
            formData.append('image', categoriesData.image);
        }

        //Realizar solicitud PUT
        return axios.put(`/forumCategory/update/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error("Error al actualizar Categoria:", error);
        throw error;
    }
};

// Función para eliminar 
export const deleteForumCategory = (id) => axios.delete(`/forumCategory/delete/${id}`);

