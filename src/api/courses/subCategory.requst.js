import axios from "../axios";

// Funcion para obtener todas las subCategories
export const getAllSubcategories = () => axios.get('/subCategory/getAllSubCategory');

// Función para obtener una SubCategory por el id
export const getSubcategoryById = () => axios.get(`/subCategory/getSubCategoryId/${id}`);

// Función para obtener SubCatgories relacionadas con el courseId
export const getSubCategoryCourseId = (courseId) => axios.get(`/subCategory/getSubCategoryCourseId/${courseId}`);


// Función para crear un sub Category
export const createSubCategory = async (subCategoryData) => {
    try {
        const formData = new FormData();
        if (subCategoryData.courseId) formData.append('courseId', subCategoryData.courseId);
        if (subCategoryData.title) formData.append('title', subCategoryData.title);
        if (subCategoryData.description) formData.append('description', subCategoryData.description);

        console.log([...formData]); //Verifica qué datos estás enviando

        return axios.post('/subCategory/createSubCategory', formData, {
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

        return axios.put(`/subCategory/updateSubCategory/${id}`, formData, {
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
export const deleteSubcategory = (id) => axios.delete(`/subCategory/DeleteSubCategory/${id}`);

export default axios;