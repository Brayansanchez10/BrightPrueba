// Resource.request.js
import axios from "axios";

const api = `http://localhost:3068/PE/resource/`;

const resourceRequest = axios.create({
    baseURL: api,
    withCredentials: true,
});

// Funcipon para obtener todos los recursos
export const getAllResources = () => resourceRequest.get('/getAllResources');
// Función para obtener los recursos
export const getResource = (courseId) => resourceRequest.get(`/getResource/${courseId}`);

//Función obtenere Recursos vista Usuario
export const getResourceUser = (id) => resourceRequest.get(`/getResourceUser/${id}`);


// Función para obtener un recurso con sus quizzes
export const getResourceWithQuizzes = (id) => resourceRequest.get(`/getResourceWithQuizzes/${id}`);

// Nueva función para obtener el progreso del usuario en un recurso
export const getUserResourceProgress = (userId, resourceId) => resourceRequest.get(`/user/${userId}/resource/${resourceId}/progress`);

// Función para crear un recurso
export const createResource = async (resourceData) => {
    try {
        const formData = new FormData();
        if (resourceData.courseId) formData.append('courseId', resourceData.courseId);
        if (resourceData.title) formData.append('title', resourceData.title);
        if (resourceData.subcategoryId) formData.append('subcategoryId', resourceData.subcategoryId);
        if (resourceData.description) formData.append('description', resourceData.description);
        if (resourceData.attempts) formData.append('attempts', resourceData.attempts);
        if (resourceData.file) formData.append('file', resourceData.file);
        if (resourceData.link) formData.append('link', resourceData.link);

        // Añadir quizzes si existen
        if (resourceData.quizzes && resourceData.quizzes.length > 0) {
            resourceData.quizzes.forEach((quiz, index) => {
                formData.append(`quizzes[${index}][question]`, quiz.question);
                formData.append(`quizzes[${index}][options]`, JSON.stringify(quiz.options)); // Opciones como string
                formData.append(`quizzes[${index}][correctAnswer]`, quiz.correctAnswer);
            });
        }

        console.log([...formData]);  // Verifica qué datos estás enviando

        return resourceRequest.post('/createResource', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error("Error al crear recurso:", error);
        throw error;
    }
};

// Función para editar un recurso
export const updateResource = async (id, resourceData) => {
    try {
        const formData = new FormData();
        if (resourceData.title) formData.append('title', resourceData.title);
        if (resourceData.subcategoryId) formData.append('subcategoryId', resourceData.subcategoryId);
        if (resourceData.description) formData.append('description', resourceData.description);
        if (resourceData.attempts) formData.append('attempts', Number(resourceData.attempts));
        if (resourceData.file) formData.append('file', resourceData.file);
        if (resourceData.link) formData.append('link', resourceData.link);

        // Añadir quizzes si existen
        if (resourceData.quizzes && resourceData.quizzes.length > 0) {
            resourceData.quizzes.forEach((quiz, index) => {
                formData.append(`quizzes[${index}][question]`, quiz.question);
                formData.append(`quizzes[${index}][options]`, JSON.stringify(quiz.options));
                formData.append(`quizzes[${index}][correctAnswer]`, quiz.correctAnswer);
            });
        }

        // Verifica qué datos estás enviando
        console.log([...formData]);

        return resourceRequest.put(`/updateResource/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error("Error al actualizar recurso:", error);
        throw error;
    }
};
// Función para eliminar un recurso
export const deleteResource = (id) => resourceRequest.delete(`/deleteResource/${id}`);

// Función para completar un quiz y actualizar el progreso del usuario
export const completeQuiz = async (userId, resourceId, score) => {
    try {
        const response = await resourceRequest.post('/complete-quiz', {
            userId,
            resourceId,
            score,
        });
        return response.data; // Retorna la respuesta de la API
    } catch (error) {
        console.error("Error al completar el quiz:", error);
        throw error; // Lanza el error para manejarlo en el componente que llame a esta función
    }
};

export default resourceRequest;
