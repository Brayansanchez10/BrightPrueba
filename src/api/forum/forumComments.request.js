import axios from "../axios";

export const getCommentsByTopic = (topicId) =>  axios.get(`/forumComments/comments/${topicId}`);

// Función para crear un curso
export const createForumComments = async (commentData) => {
    try {
      const formData = new FormData(); // Crear una instancia de FormData
      formData.append('content', commentData.content);
      formData.append('userId', commentData.userId);
      formData.append('topicId', commentData.topicId);
  

      // Realizar la solicitud POST utilizando Axios
      return axios.post('/forumComments/comments', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error("Error al crear un Comentario:", error);
      throw error;
    }  
};

// Función para actualizar un curso
export const updateForumComments = async (id, commentData) => {
    try {
      const formData = new FormData(); // Crear una instancia de FormData
      formData.append('content', commentData.content);
      formData.append('userId', commentData.userId);
      formData.append('topicId', commentData.topicId);
  
  
      // Realizar la solicitud PUT utilizando Axios
      return axios.put(`/forumComments/comments/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error("Error al actualizar Comentario:", error);
      throw error;
    }
};

// Función para eliminar un curso
export const deleteForumComments = (id) => axios.delete(`/forumComments/delete/${id}`);

