import axios from "axios";

const api = `http://localhost:3068/PE/forumTopic/`;

const topicRequest = axios.create({
    baseURL: api,
    withCredentials: true,
});

// Función para obtener todos los temas
export const getAllForumTopic = () => topicRequest.get('/getAll');

// Función para obtener un tema relacionado a una categoría de un foro
export const getForumTopicByCategoryId = (forumCategoryId) => topicRequest.get(`/forumCategory/${forumCategoryId}`);

// Función para obtener un tema por su ID
export const getTopicById = (id) => topicRequest.get(`/topic/${id}`);

// Función para crear un nuevo tema
export const createForumTopic = async (topicData) => {
  try {
    const formData = new FormData(); // Crear una instancia de FormData
    formData.append('title', topicData.title);
    formData.append('Content', topicData.Content);
    formData.append('userId', topicData.userId);
    formData.append('forumCategoryId', Number(topicData.forumCategoryId));

    // Realizar la solicitud POST utilizando Axios
    return topicRequest.post('/create', formData, {
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

        return topicRequest.put(`/update/${id}`, formData, {
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
export const deleteForumTopic = (id) => topicRequest.delete(`/delete/${id}`);

export default topicRequest;