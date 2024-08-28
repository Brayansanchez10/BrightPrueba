import axios from 'axios';

const api = 'http://localhost:3068/PE/progress';

// Función para obtener el progreso de un curso para un usuario específico
export const getCourseProgress = (userId, courseId) => {
  return axios.get(`${api}/${userId}/${courseId}`, {
    withCredentials: true,
  });
};

// Función para actualizar el progreso de un curso para un usuario específico
export const updateCourseProgress = (userId, courseId, progress) => {
  console.log("userID: " + userId);
  console.log("courseID: " + courseId);
  console.log("progress: " + progress);

  return axios.post(`${api}`, {
    userId,
    courseId,
    progress,
  }, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};