import axios from '../axios';

// Función para obtener usuarios y quizzes relacionados a un curso y usuario específico
export const getUsersAndQuizzesByCourseIdAndUserId = async (courseId, userId) => {
    try {
      const response = await axios.get(`/adminQuizUser/${courseId}/users-quizzes/${userId}`);
      return response.data;  // Devuelve los datos obtenidos de la respuesta
    } catch (error) {
      console.error("Error al obtener usuarios y quizzes:", error);
      throw new Error("No se pudieron obtener los datos solicitados.");
    }
};
  
// Función para actualizar el progreso de un recurso específico
export const updateUserResourceProgress = async (userId, resourceId, updates) => {
    try {
      const response = await axios.put(`/adminQuizUser/progress/${userId}/${resourceId}`, updates);
      return response.data;  // Devuelve los datos de la respuesta, que deberían ser el progreso actualizado
    } catch (error) {
      console.error("Error al actualizar el progreso:", error);
      throw new Error("No se pudo actualizar el progreso del recurso.");
    }
};
  
// Función para eliminar el progreso de un recurso específico
export const deleteUserResourceProgress = async (userId, resourceId) => {
    try {
      const response = await axios.delete(`/adminQuizUser/progress/${userId}/${resourceId}`);
      return response.data;  // Devuelve los datos de la respuesta, que deberían ser el progreso eliminado
    } catch (error) {
      console.error("Error al eliminar el progreso:", error);
      throw new Error("No se pudo eliminar el progreso del recurso.");
    }
};

// Nueva función para obtener el estado de un usuario registrado a un curso
export const getUserCourseStatus = (userId, courseId) => axios.get(`/adminQuizUser/user-courses/${userId}/${courseId}`);