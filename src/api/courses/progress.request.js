import axios from 'axios';

const api = `https://apibrightmind.mesadoko.com/PE/progress`;

// Función para obtener el progreso de un curso para un usuario específico
export const getCourseProgress = async (userId, courseId) => {
  try {
    const response = await axios.get(`${api}/getProgress/${userId}/${courseId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching course progress:", error);
    throw error; // o maneja el error como prefieras
  }
};

// Función para actualizar el progreso de un curso para un usuario específico
export const updateCourseProgress = async (userId, courseId, progress) => {
  console.log("userID: " + userId);
  console.log("courseID: " + courseId);
  console.log("progress: " + progress);

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
    console.error("Error updating course progress:", error);
    throw error;
  }
};