import axios from 'axios';

const api = 'http://localhost:3068/PE/courses/';

const courseRequest = axios.create({
  baseURL: api,
  withCredentials: true,
});

export const getAllCourses = () => courseRequest.get('/getAllCourses');

export const asignarContenido = (id, contentFile) => {
  const formData = new FormData();
  formData.append('content', contentFile);
  return courseRequest.post(`/asignarContenido/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const asignarLinkContenido = (id, texto) => {
  const data = { texto };
  return courseRequest.post(`/asignarLinkContenido/${id}`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const deleteResource = (courseId, resourceIndex) => {
  return courseRequest.delete(`/courses/${courseId}/resources/${resourceIndex}`);
};

export const getCourse = (id) => courseRequest.get(`/getCourse/${id}`);

export const createCourse = async (courseData) => {
  try {
    const formData = new FormData();
    formData.append('title', courseData.title);
    formData.append('description', courseData.description);
    formData.append('category', courseData.category);
    formData.append('userId', courseData.userId);
    formData.append('duracion', courseData.duracion);
    formData.append('nivel', courseData.nivel); 

    if (courseData.image) {
      formData.append('image', courseData.image);
    }

    const response = await courseRequest.post('/createCourse', formData, {
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

    return courseRequest.put(`/updateCourse/${id}`, formData, {
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
  return courseRequest.put(`/actualizarContenidoArchivo/${id}/${index}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const actualizarLinkContenido = (id, nuevoTexto, index) => {
  const data = { nuevoTexto, index };
  return courseRequest.put(`/actualizarLinkContenido/${id}`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const notifyAllUsersInCourse = (courseId) => {
  return courseRequest.post(`/${courseId}/notify-all`);
};

export const notifySpecificUser = (courseId, email) => {
  const data = { email };
  return courseRequest.post(`/${courseId}/notify-specific`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const deleteCourse = (id) => courseRequest.delete(`/deleteCourse/${id}`);

export const getCoursesByCategory = (categoryName) => courseRequest.get(`/category/${categoryName}`);

export default courseRequest;