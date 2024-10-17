import axios from "axios";

const api = 'http://localhost:3068/PE/subCategory/';

const subCategoryRequest = axios.create({
    baseURL: api,
    withCredentials: true,
});

// Funcion para obtener todas las subCategories
export const getAllSubcategories = () => subCategoryRequest.get('/getAllSubCategory');

// Función para obtener una SubCategory por el id
export const getSubcategoryById = () => subCategoryRequest.get(`/getSubCategoryId/${id}`);

// Función para obtener SubCatgories relacionadas con el courseId
export const getSubCategoryCourseId = (courseId) => subCategoryRequest.get(`/getSubCategoryCourseId/${courseId}`);


// Función para crear un sub Category
export const createSubCategory = async (subCategoryData) => {
    try {
        const formData = new FormData();
        if (subCategoryData.courseId) formData.append('courseId', subCategoryData.courseId);
        if (subCategoryData.title) formData.append('title', subCategoryData.title);
        if (subCategoryData.description) formData.append('description', subCategoryData.description);

        console.log([...formData]); //Verifica qué datos estás enviando

        return subCategoryRequest.post('/createSubCategory', formData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Error al crear subCategory:", error);
        throw error;
    }
};

// Función para actualizar una subCategory
export const updateSubCategory = async (id, subCategoryData) => {
    try {
        const formData = new FormData();
        if (subCategoryData.courseId) formData.append('courseId', subCategoryData.courseId);
        if (subCategoryData.title) formData.append('title', subCategoryData.title);
        if (subCategoryData.description) formData.append('description', subCategoryData.description);

        console.log([...formData]); //Verifica qué datos estás enviando

        return subCategoryRequest.put(`/updateSubCategory/${id}`, formData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Error al actualizar subCategory:", error);
        throw error;
    }
};

// Función para eliminar una SubCategory
export const deleteSubcategory = (id) => subCategoryRequest.delete(`/DeleteSubCategory/${id}`);

export default subCategoryRequest;