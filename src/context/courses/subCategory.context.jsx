import React, { createContext, useContext, useState, useEffect } from "react";

import { 
    getAllSubcategories as getAllSubcategoriesApi,
    getSubCategoryCourseId as getSubCategoryCourseIdApi,
    getSubcategoryById as getSubcategoryByIdApi,
    createSubCategory as createSubCategoryApi,
    updateSubCategory as updateSubCategoryApi,
    deleteSubcategory as deleteSubcategoryApi
} from "../../api/courses/subCategory.requst.js";

// Crear el contexto
const subCategoryContext = createContext();

// Hook para usar el contexto
export const useSubCategoryContext = () => {
    const context = useContext(subCategoryContext);
    if (!context) {
        throw new Error("useSubCategoryContext debe ser usado dentro de SubCategoryProvider");
    }
    return context;
};

export const SubCategoryProvider = ({ children }) => {
    const [subCategory, setsubCategory] = useState([]);

    // Función para obtener todas las SubCategory:
    const getAllSubcategories = async () => {
        try {
            const res = await getAllSubcategoriesApi();
            setsubCategory(res.data);
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    // Función para obtener una SubCategory
    const getSubcategoryById = async () => {
        try {
            const res = await getSubcategoryByIdApi(id);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    // Función para obtener una SubCategory con relación al courseId
    const getSubCategoryCourseId = async () => {
        try {
            const res = await getSubCategoryCourseIdApi(courseId);
            setsubCategory(res.data);
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.error("Error al obtener una SubCategory", error);
            return null;
        }
    };

    // Función para crear una subCategory
    const createSubcategory = async ({courseId, title, description}) => {
        try {
            const newSubCategory = {
                courseId,
                title,
                description
            };
            console.log(newSubCategory);

            const res = await createSubCategoryApi(newSubCategory);
            setsubCategory([...subCategory, res.data]);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    // Función para actualizar una subCategory
    const updateSubcategory = async (id, {title, description}) => {
        try {
            const subCategoryData = {
                title,
                description
            };
            console.log(subCategoryData);

            const res = await updateSubCategoryApi(subCategoryData);
            setsubCategory(subCategory.map((SubCategories) => (SubCategories.id === id ? res.data : SubCategories)));
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    // Función para eliminar una SubCategory
    const deleteSubcategory = async (id) => {
        try {
            await deleteSubcategoryApi(id);
            setsubCategory(subCategory.filter(SubCategories => SubCategories.id !== id));
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    useEffect(() => {
        // Obtener todos los subCategory al montar en el componente
        getAllSubcategories();
    }, []);

    return (
        <subCategoryContext.Provider value={{subCategory, getSubcategoryById, getSubCategoryCourseId, createSubcategory, updateSubcategory, deleteSubcategory }}>
            {children}
        </subCategoryContext.Provider>
    );
};


