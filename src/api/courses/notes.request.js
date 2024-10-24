import axios from '../axios';

// Función para crear una nota
export const createNote = (courseId, noteData) => 
    axios.post(`/notes/courses/${courseId}`, noteData);

// Función para añadir una nota a un recurso
export const addResourceNote = (resourceId, noteData) => 
    axios.post(`/notes/resources/${resourceId}/notes`, noteData);

// Función para obtener las notas de un curso
export const getCourseNotes = (courseId, userId) => 
    axios.get(`/notes/getNotes/courses/${courseId}?userId=${userId}`);

// Función para obtener las notas de un recurso específico
export const getResourceNotes = (courseId, resourceId, userId) => 
    axios.get(`/notes/getNotes/courses/${courseId}/resources/${resourceId}?userId=${userId}`);

// Función para actualizar una nota
export const updateNote = (id, noteData) => 
    axios.put(`/notes/updateNote/${id}`, noteData);

// Función para actualizar una nota de recurso
export const updateResourceNote = (noteId, noteData) => 
    axios.put(`/notes/updateResourceNote/resource/${noteId}`, noteData);

// Función para eliminar una nota
export const deleteNote = (id) => 
    axios.delete(`/notes/deleteNote/${id}`);

// Función para eliminar una nota de recurso
export const deleteResourceNote = (noteId) => 
    axios.delete(`/notes/deleteResourceNote/resource/${noteId}`);
