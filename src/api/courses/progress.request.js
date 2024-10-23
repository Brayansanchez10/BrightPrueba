import axios from 'axios';

const api = `http://localhost:3068/PE/progress`;

// Función para obtener el progreso de un curso para un usuario específico
export const getCourseProgress = async (userId, courseId) => {
  try {
    const response = await axios.get(`${api}/getProgress/${userId}/${courseId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener o crear el progreso del curso:", error);
    throw error;
  }
};

// Función para actualizar el progreso de un curso para un usuario específico
export const updateCourseProgress = async (userId, courseId, progress) => {
  try {
    const response = await axios.post(`${api}/updateProgress`, {
      userId,
      courseId,
      progress,
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el progreso del curso:", error);
    throw error;
  }
};