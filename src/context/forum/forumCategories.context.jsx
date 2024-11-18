import React, { useState, createContext, useContext, useEffect } from 'react';
import { 
    getAllForumCategories as  getAllForumCategoriesApi,
    createForumCategories as  createForumCategoriesApi,
    updateForumCategories as  updateForumCategoriesApi,
    deleteForumCategory   as  deleteForumCategoryApi,
    toggleForumActivation as toggleForumActivationApi,
    getForumState as getForumStateApi,
} from '../../api/forum/forumCategories.request.js';

export const CategoriesContext = createContext();

export const useForumCategories = () => {
    const context = useContext(CategoriesContext);
    if(!context) {
        throw new Error("useForumCategories debe ser usado dentro de CoursesProvider");
    }
    return context;
};


export const ForumCategoriesProvider = ({ children }) => {
    const [ categories, setCategories ] = useState([]);
    const [forumState, setForumState] = useState(null);  // Nuevo estado para almacenar el estado del foro


    const getAllForumCategories = async () => {
        try {
            const res = await getAllForumCategoriesApi();
            setCategories(res.data);
            console.log(res.data);
    
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const createForumCategories = async ({ name, description, icons, entityId }) => {
        try {
            const newCategory = {
                name, 
                description,
                icons,
                entityId: Number(entityId),
            };
            console.log(newCategory);
            const res = await createForumCategoriesApi(newCategory);
            setCategories([...categories, res.data]);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    
    const updateForumCategories = async (id, categoriesData) => {
        try {
            const res = await updateForumCategoriesApi(id, categoriesData);
            setCategories(categories.map((category) => (category._id === id ? res.data : category)));
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    
    const deleteForumCategory = async (id) => {
        try {
            await deleteForumCategoryApi(id);
            setCategories(categories.filter(category => category.id !== id));
        } catch (error) {
            console.error(error);
            return null;
        }
    };

     // Función para activar/desactivar el foro
     const toggleForumActivation = async (entityId, userId) => {
        try {
            const result = await toggleForumActivationApi(entityId, userId);
            console.log(result.message);  // Muestra el mensaje de activación/desactivación
            return result.state;  // Devuelve el nuevo estado del foro
        } catch (error) {
            console.error('Error al activar/desactivar el foro:', error);
            throw error;
        }
    };

    // Función para obtener el estado del foro
    const getForumState = async (entityId) => {
        try {
            const state = await getForumStateApi(entityId);
            setForumState(state);  // Actualiza el estado del foro en el contexto
            return state;
        } catch (error) {
            console.error('Error al obtener el estado del foro:', error);
            throw error;
        }
    };

    
    useEffect(() => {
        getAllForumCategories();
    }, []);

    return (
        <CategoriesContext.Provider value= {{ categories, getAllForumCategories, createForumCategories, updateForumCategories, deleteForumCategory, toggleForumActivation, getForumState }}> 
            {children}
        </CategoriesContext.Provider>
    );
};
    
