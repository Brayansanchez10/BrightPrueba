import axios from "../axios";

// Función para obtener todos los temas
export const getAllForumTopic = () => axios.get('/forumTopic/getAll');

// Función para obtener un tema relacionado a una categoría de un foro
export const getForumTopicByCategoryId = (forumCategoryId) => axios.get(`/forumTopic/forumCategory/${forumCategoryId}`);

// Función para obtener un tema por su ID
export const getTopicById = (id) => axios.get(`/forumTopic/topic/${id}`);

// Función para crear un nuevo tema
export const createForumTopic = async (topicData) => {
  try {
    const formData = new FormData(); // Crear una instancia de FormData
    formData.append('title', topicData.title);
    formData.append('Content', topicData.Content);
    formData.append('userId', topicData.userId);
    formData.append('forumCategoryId', Number(topicData.forumCategoryId));

    // Realizar la solicitud POST utilizando Axios
    return axios.post('/forumTopic/create', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error al crear un Tema:", error);
    throw error;
  }  
};

// Función para Actualizar un tema
export const updateForumTopic = async (id, topicData) => {
    try {
        const formData = new FormData(); // Crear una instancia de FormData   
        formData.append('title', topicData.title);
        formData.append('Content', topicData.Content);
        formData.append('userId', topicData.userId);
        formData.append('forumCategoryId', Number(topicData.forumCategoryId));

        return axios.put(`/forumTopic/update/${id}`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
    } catch (error) {
        console.error("Error al actualizar Tema:", error);
        throw error;
    }
};

// Función para eliminar un tema
export const deleteForumTopic = (id) => axios.delete(`/forumTopic/delete/${id}`);
