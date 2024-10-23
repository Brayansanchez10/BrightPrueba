import axios from "axios";

const api = 'http://localhost:3068/PE/forumCategory/';

const categoryRequest = axios.create({
    baseURL: api,
    withCredentials: true,
});

// Función para obtnr todos las categorias

export const getAllForumCategories = () => categoryRequest.get('/getAll');

// Función para crear un Forum Categories
export const createForumCategories = async (categoriesData) => {
    try {
        const formData = new FormData();
        formData.append('name', categoriesData.name);
        formData.append('description', categoriesData.description);

        //Agregar imagen si existe
        if (categoriesData.image) {
            formData.append('image', categoriesData.image);
        }

        // Realizar la solicitud POST
        return categoryRequest.post('/create', formData, {
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
        return categoryRequest.put(`/update/${id}`, formData, {
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
export const deleteForumCategory = (id) => categoryRequest.delete(`/delete/${id}`);


export default categoryRequest;