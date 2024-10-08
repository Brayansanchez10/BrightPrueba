import axios from 'axios';

const api = 'http://localhost:3068/PE/courses/'; 

const courseRequest = axios.create({
  baseURL: api,
  withCredentials: true,
});

// Función para obtener todos los cursos
export const getAllCourses = () => courseRequest.get('/getAllCourses');

// Función para asignar contenido a un curso
export const asignarContenido = (id, contentFile) => {
  const formData = new FormData(); // Crear una instancia de FormData

  // Agregar el archivo de contenido al FormData
  formData.append('content', contentFile);

  // Realizar la solicitud POST utilizando Axios
  return courseRequest.post(`/asignarContenido/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

//Función para asignar texto a un contenido
export const asignarLinkContenido = (id, texto) => {
  //Crear un objeto Json con el texto
  const data = { texto };

  //Realizar la solicitud POST utilizando axios
  return courseRequest.post(`/asignarLinkContenido/${id}`, data,{
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Función para eliminar un recurso de un curso
export const deleteResource = (courseId, resourceIndex) => {
  return courseRequest.delete(`/courses/${courseId}/resources/${resourceIndex}`);
};


// Función para obtener un curso por ID
export const getCourse = (id) => courseRequest.get(`/getCourse/${id}`);

// Función para crear un curso
export const createCourse = async (courseData) => {
  try {
    const formData = new FormData(); // Crear una instancia de FormData
    formData.append('title', courseData.title);
    formData.append('description', courseData.description);
    formData.append('category', courseData.category);
    formData.append('userId', courseData.userId);

    // Agregar la imagen si existe
    if (courseData.image) {
      formData.append('image', courseData.image);
    }

    // Realizar la solicitud POST utilizando Axios
    return courseRequest.post('/createCourse', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error("Error al crear un Curso:", error);
    throw error;
  }  
};

// Función para actualizar un curso
export const updateCourse = async (id, courseData) => {
  try {
    const formData = new FormData(); // Crear una instancia de FormData

    // Agregar los datos del curso al FormData
    formData.append('title', courseData.title);
    formData.append('description', courseData.description);
    formData.append('category', courseData.category);
    formData.append('content', courseData.content);

    // Agregar la imagen si existe
    if (courseData.image) {
      formData.append('image', courseData.image);
    }

    // Realizar la solicitud PUT utilizando Axios
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

// Función para actualizar el contenido de un archivo en un curso
export const actualizarContenidoArchivo = (id, index, nuevoArchivo) => {
  const formData = new FormData(); // Crear una instancia de FormData

  // Agregar el nuevo archivo de contenido al FormData
  formData.append('content', nuevoArchivo);

  // Realizar la solicitud PUT utilizando Axios
  return courseRequest.put(`/actualizarContenidoArchivo/${id}/${index}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Función para actualizar el texto o enlace en un curso
export const actualizarLinkContenido = (id, nuevoTexto, index) => {
  const data = { nuevoTexto, index };

  // Realizar la solicitud PUT utilizando Axios
  return courseRequest.put(`/actualizarLinkContenido/${id}`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Función para notificar a todos los usuarios inscritos en un curso
export const notifyAllUsersInCourse = (courseId) => {
  return courseRequest.post(`/${courseId}/notify-all`);
};

// Función para notificar a un usuario específico
export const notifySpecificUser = (courseId, email) => {
  const data = { email }; // Crear un objeto con el correo del usuario

  return courseRequest.post(`/${courseId}/notify-specific`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Función para eliminar un curso
export const deleteCourse = (id) => courseRequest.delete(`/deleteCourse/${id}`);
export const getCoursesByCategory = (categoryName) => courseRequest.get(`/category/${categoryName}`);

export default courseRequest;

