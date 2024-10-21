import axios from 'axios';

const api = `https://apibrightmind.mesadoko.com/PE/notes`;

const notesRequest = axios.create({
    baseURL: api,
    withCredentials: true,
});

// Función para crear una nota
export const createNote = (courseId, noteData) => 
    notesRequest.post(`/courses/${courseId}`, noteData);

// Función para añadir una nota a un recurso
export const addResourceNote = (resourceId, noteData) => 
    notesRequest.post(`/resources/${resourceId}/notes`, noteData);

// Función para obtener las notas de un curso
export const getCourseNotes = (courseId, userId) => 
    notesRequest.get(`/getNotes/courses/${courseId}?userId=${userId}`);

// Función para obtener las notas de un recurso específico
export const getResourceNotes = (courseId, resourceId, userId) => 
    notesRequest.get(`/getNotes/courses/${courseId}/resources/${resourceId}?userId=${userId}`);

// Función para actualizar una nota
export const updateNote = (id, noteData) => 
    notesRequest.put(`/updateNote/${id}`, noteData);

// Función para actualizar una nota de recurso
export const updateResourceNote = (noteId, noteData) => 
    notesRequest.put(`/updateResourceNote/resource/${noteId}`, noteData);

// Función para eliminar una nota
export const deleteNote = (id) => 
    notesRequest.delete(`/deleteNote/${id}`);

// Función para eliminar una nota de recurso
export const deleteResourceNote = (noteId) => 
    notesRequest.delete(`/deleteResourceNote/resource/${noteId}`);

export default notesRequest;
