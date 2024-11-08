import axios from '../axios';

// Función para obtener el progreso de un curso para un usuario específico
export const getCourseProgress = async (userId, courseId) => {
  try {
    const response = await axios.get(`/progress/getProgress/${userId}/${courseId}`, {
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
    const response = await axios.post(`/progress/updateProgress`, {
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

// Función para eliminar el progreso de un curso para un usuario específico
export const deleteCourseProgress = async (userId, courseId) => {
  try {
    const response = await axios.delete(`/progress/deleteProgress/${userId}/${courseId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el progreso del curso:", error);
    throw error;
  }
};