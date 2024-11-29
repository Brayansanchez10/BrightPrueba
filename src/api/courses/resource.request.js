import axios from "../axios";

// Funcipon para obtener todos los recursos
export const getAllResources = () => axios.get('/resource/getAllResources');
// Función para obtener los recursos
export const getResource = (courseId) => axios.get(`/resource/getResource/${courseId}`);

//Función obtenere Recursos vista Usuario
export const getResourceUser = (id) => axios.get(`/resource/getResourceUser/${id}`);


// Función para obtener un recurso con sus quizzes
export const getResourceWithQuizzes = (id) => axios.get(`/resource/getResourceWithQuizzes/${id}`);

// Nueva función para obtener el progreso del usuario en un recurso
export const getUserResourceProgress = (userId, resourceId) => axios.get(`/resource/user/${userId}/resource/${resourceId}/progress`);

// Nueva función para eliminar un progreso de un usuario de un quiz.
export const deleteResourceProgress = async (userId, resourceId) => axios.delete(`/resource/user/${userId}/resource/${resourceId}/progress`);

// Función para crear un recurso
export const createResource = async (resourceData) => {
    try {
        const formData = new FormData();
        if (resourceData.courseId) formData.append('courseId', resourceData.courseId);
        if (resourceData.title) formData.append('title', resourceData.title);
        if (resourceData.subcategoryId) formData.append('subcategoryId', resourceData.subcategoryId);
        if (resourceData.description) formData.append('description', resourceData.description);
        if (resourceData.attempts) formData.append('attempts', resourceData.attempts);
        if (resourceData.percent) formData.append('percent', resourceData.percent);
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

        return axios.post('/resource/createResource', formData, {
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
        if (resourceData.percent) formData.append('percent', resourceData.percent);
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

        return axios.put(`/resource/updateResource/${id}`, formData, {
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
export const deleteResource = (id) => axios.delete(`/resource/deleteResource/${id}`);

// Función para completar un quiz y actualizar el progreso del usuario
export const completeQuiz = async (userId, resourceId, score) => {
    try {
        const response = await axios.post('/resource/complete-quiz', {
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

export const updateResourceOrder = async (data) => {
  try {
    return await axios.put('/resource/updateResourceOrder', data);
  } catch (error) {
    console.error('Error al actualizar el orden de los recursos:', error);
    throw error;
  }
};

// Función para obtener un recurso especifico de un curso
export const getResourceById = (courseId, resourceId) => axios.get(`/resource/courses/${courseId}/resources/${resourceId}`);
