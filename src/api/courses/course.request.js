import axios from '../axios';

export const unregisterFromCourse = (userId, courseId) => axios.post(`/unregisterFromCourse/${userId}/${courseId}`); 
export const getAllCourses = () => axios.get('/courses/getAllCourses');

export const asignarContenido = (id, contentFile) => {
  const formData = new FormData();
  formData.append('content', contentFile);
  return axios.post(`/courses/asignarContenido/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const asignarLinkContenido = (id, texto) => {
  const data = { texto };
  return axios.post(`/courses/asignarLinkContenido/${id}`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const deleteResource = (courseId, resourceIndex) => {
  return axios.delete(`/courses/courses/${courseId}/resources/${resourceIndex}`);
};

export const getCourse = (id) => axios.get(`/courses/getCourse/${id}`);

export const createCourse = async (courseData) => {
  try {
    const formData = new FormData();
    formData.append('title', courseData.title);
    formData.append('description', courseData.description);
    formData.append('category', courseData.category);
    formData.append('userId', courseData.userId);
    formData.append('nivel', courseData.nivel); 
    formData.append('duracion', Number(courseData.duracion));
    formData.append('entityId', Number(courseData.entityId));

    if (courseData.image) {
      formData.append('image', courseData.image);
    }

    const response = await axios.post('/courses/createCourse', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Respuesta del servidor:', response.data);
    return response;
  } catch (error) {
    console.error("Error al crear un Curso:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateCourse = async (id, courseData) => {
  try {
    const formData = new FormData();
    formData.append('title', courseData.title);
    formData.append('description', courseData.description);
    formData.append('category', courseData.category);
    formData.append('content', courseData.content);

    if (courseData.image) {
      formData.append('image', courseData.image);
    }

    return axios.put(`/courses/updateCourse/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error("Error al crear recurso:", error);
    throw error;
  }
};

export const actualizarContenidoArchivo = (id, index, nuevoArchivo) => {
  const formData = new FormData();
  formData.append('content', nuevoArchivo);
  return axios.put(`/courses/actualizarContenidoArchivo/${id}/${index}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const actualizarLinkContenido = (id, nuevoTexto, index) => {
  const data = { nuevoTexto, index };
  return axios.put(`/courses/actualizarLinkContenido/${id}`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const notifyAllUsersInCourse = (courseId) => {
  return axios.post(`/courses/${courseId}/notify-all`);
};

export const notifySpecificUser = (courseId, email) => {
  const data = { email };
  return axios.post(`/courses/${courseId}/notify-specific`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const deleteCourse = (id) => axios.delete(`/courses/deleteCourse/${id}`);

export const getCoursesByCategory = (categoryName) => axios.get(`/courses/category/${categoryName}`);

export default courseRequest;