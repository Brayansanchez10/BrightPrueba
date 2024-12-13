import axios from "../axios";

export const getAnswersByComment = (commentsId) => axios.get(`/answerAdmin/comments/${commentsId}/answers`);

export const createAnswer = async (answerData) => {
    try {
        const formData = new FormData(); // Crear una instancia de FormData
        formData.append('content', answerData.content);
        formData.append('userId', answerData.userId);
        formData.append('commentsId', answerData.commentsId);

        // Realizar la solicitud POST utilizando Axios
      return axios.post('/answerAdmin/create', formData, {
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
      return axios.put(`/answerAdmin/update/${id}`, formData, {
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
export const deleteAnswer = (id) => axios.delete(`/answerAdmin/delete/${id}`);
