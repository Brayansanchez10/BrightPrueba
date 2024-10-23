import axios from "axios";

const api = `http://localhost:3068/PE/answers/`;

const answersRequest = axios.create({
    baseURL: api,
    withCredentials: true,
});

export const getAnswersByComment = (commentsId) => answersRequest.get(`/comments/${commentsId}/answers`);

export const createAnswer = async (answerData) => {
    try {
        const formData = new FormData(); // Crear una instancia de FormData
        formData.append('content', answerData.content);
        formData.append('userId', answerData.userId);
        formData.append('commentsId', answerData.commentsId);

        // Realizar la solicitud POST utilizando Axios
      return answersRequest.post('/create', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
        console.error("Error al crear un Respuesta:", error);
        throw error;
    }
};

export const updateAnswer = async (id, answerData) => {
    try {
        const formData = new FormData(); // Crear una instancia de FormData
        formData.append('content', answerData.content);
        formData.append('userId', answerData.userId);
        formData.append('commentsId', answerData.commentsId);

      // Realizar la solicitud PUT utilizando Axios
      return answersRequest.put(`/update/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
        console.error("Error al Actualizar una Respuesta:", error);
        throw error;
    }
};

// Función para eliminar un curso
export const deleteAnswer = (id) => answersRequest.delete(`/delete/${id}`);

export default answersRequest;