import React, { useState, createContext, useContext, useEffect } from 'react';
import { 
    getAllForumCategories as  getAllForumCategoriesApi,
    createForumCategories as  createForumCategoriesApi,
    updateForumCategories as  updateForumCategoriesApi,
    deleteForumCategory   as  deleteForumCategoryApi,
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

    
    useEffect(() => {
        getAllForumCategories();
    }, []);

    return (
        <CategoriesContext.Provider value= {{ categories, getAllForumCategories, createForumCategories, updateForumCategories, deleteForumCategory }}> 
            {children}
        </CategoriesContext.Provider>
    );
};
    
