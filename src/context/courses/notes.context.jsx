import React, { createContext, useState, useContext, useCallback } from 'react';
import {
    createNote,
    addResourceNote,
    getCourseNotes,
    updateNote,
    updateResourceNote,
    deleteNote,
    deleteResourceNote,
    getResourceNotes
} from '../../api/courses/notes.request';

const NotesContext = createContext();

export const useNotesContext = () => useContext(NotesContext);

export const NotesProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [resourceNotes, setResourceNotes] = useState([]);

    const fetchCourseNotes = useCallback(async (courseId, userId) => {
        setLoading(true);
        try {
            const response = await getCourseNotes(courseId, userId);
            
            // Asegurarse de que estamos trabajando con un array plano
            const notesArray = Array.isArray(response.data) 
                ? response.data 
                : Object.values(response.data || {});
            
            // Aplanar el array si es necesario
            const flattenedNotesArray = notesArray.flat();
            
            console.log('Array de notas procesado:', flattenedNotesArray);
            setNotes(flattenedNotesArray);
            
        } catch (err) {
            console.error('Error al obtener las notas:', err);
            setError(err.message);
            setNotes([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchResourceNotes = useCallback(async (courseId, resourceId, userId) => {
        setLoading(true);
        try {
            const response = await getResourceNotes(courseId, resourceId, userId);
            console.log('Respuesta de getResourceNotes:', response);
            
            const notesArray = Array.isArray(response.data) 
                ? response.data 
                : Object.values(response.data || {});

            const flattenedNotesArray = notesArray.flat();
            setResourceNotes(flattenedNotesArray);
            
        } catch (err) {
            console.error('Error al obtener las notas del recurso:', err);
            setError(err.message);
            setResourceNotes([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const addNote = useCallback(async (courseId, noteData) => {
        setLoading(true);
        try {
            // Verificar si ya existe una nota general para este curso
            const existingNote = notes.find(note => note.courseId === courseId && !note.resourceId);
            if (existingNote) {
                return existingNote;
            }

            const response = await createNote(courseId, noteData);
            setNotes(prevNotes => Array.isArray(prevNotes) ? [...prevNotes, response.data] : [response.data]);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [notes]);

    const addNoteToResource = useCallback(async (resourceId, noteData) => {
        setLoading(true);
        try {
            // Verificar si ya existe una nota para este recurso específico
            const existingNote = resourceNotes.find(note => 
                note.resourceId === resourceId && 
                note.noteId === noteData.noteId
            );
            if (existingNote) {
                return existingNote;
            }

            const response = await addResourceNote(resourceId, noteData);
            setResourceNotes(prevNotes => Array.isArray(prevNotes) ? [...prevNotes, response.data] : [response.data]);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [resourceNotes]);

    const editNote = useCallback(async (noteId, noteData) => {
        setLoading(true);
        try {
            const response = await updateNote(noteId, noteData);
            setNotes(prevNotes => 
                prevNotes.map(note => note.id === noteId ? response.data : note)
            );
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const editResourceNote = useCallback(async (noteId, noteData) => {
        setLoading(true);
        try {
            const response = await updateResourceNote(noteId, noteData);
            setResourceNotes(prevNotes => 
                prevNotes.map(note => note.id === noteId ? response.data : note)
            );
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const removeNote = useCallback(async (noteId) => {
        setLoading(true);
        try {
            await deleteNote(noteId);
            setNotes(prevNotes => {
                if (Array.isArray(prevNotes)) {
                    return prevNotes.filter(note => note.id !== noteId);
                } else {
                    console.error('prevNotes no es un array:', prevNotes);
                    return Array.isArray(notes) ? notes.filter(note => note.id !== noteId) : [];
                }
            });
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [notes]);

    const removeResourceNote = useCallback(async (noteId) => {
        setLoading(true);
        try {
            await deleteResourceNote(noteId);
            setResourceNotes(prevNotes => {
                if (Array.isArray(prevNotes)) {
                    return prevNotes.filter(note => note.id !== noteId);
                } else {
                    console.error('prevNotes no es un array:', prevNotes);
                    return Array.isArray(resourceNotes) ? resourceNotes.filter(note => note.id !== noteId) : [];
                }
            });
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [resourceNotes]);

    return (
        <NotesContext.Provider value={{
            notes,
            resourceNotes,
            loading,
            error,
            fetchCourseNotes,
            fetchResourceNotes,
            addNote,
            addNoteToResource,
            editNote,
            editResourceNote,
            removeNote,
            removeResourceNote
        }}>
            {children}
        </NotesContext.Provider>
    );
};
