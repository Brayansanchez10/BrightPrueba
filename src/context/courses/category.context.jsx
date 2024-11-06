import React, { useState, createContext, useContext, useEffect } from 'react';
import { createCategory as createCategoryApi, getCategories as getCategoriesApi, updateCategory as updateCategoryApi, deleteCategory as deleteCategoryApi, deleteOnlyCategory as deleteOnlyCategoryApi } from '../../api/courses/category.request'; // Importa las funciones de tu archivo api

export const CategoryContext = createContext();

export const useCategoryContext = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error("useCategoryContext debe ser usado dentro de CategoryProvider");
    }
    return context;
};

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);

    const createCategory = async ({ name, description, entityId }) => {
        try {
            const newCategoryData = {
                name,
                description,
                entityId,
            };
            const res = await createCategoryApi(newCategoryData);
            setCategories([...categories, res.data]);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const getCategories = async () => {
        try {
            const res = await getCategoriesApi();
            setCategories(res.data);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const updateCategory = async (id, { name, description }) => {
        try {
            const updatedCategoryData = {
                name,
                description,
            };
            const res = await updateCategoryApi(id, updatedCategoryData);
            setCategories(categories.map(cat => (cat._id === id ? res.data : cat)));
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const deleteCategory = async (id) => {
        try {
            await deleteCategoryApi(id);
            setCategories(categories.filter(cat => cat._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const deleteOnlyCategory = async (id) => {
        try {
            await deleteOnlyCategoryApi(id);
            setCategories(categories.filter(cat => cat._id !== id));
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <CategoryContext.Provider value={{ categories, createCategory, getCategories, updateCategory, deleteCategory, deleteOnlyCategory }}>
            {children}
        </CategoryContext.Provider>
    );
};
