import React from 'react';
import Swal from 'sweetalert2';

const CourseNotesHandler = ({
  notes,
  editingNoteId,
  userNote,
  editedNoteContent,
  resourceNotes,
  userResourceNote,
  resources,
  resource,
  course,
  user,
  setEditingNoteId,
  setUserNote,
  setEditedNoteContent,
  editedResourceNoteContent,
  setEditedResourceNoteContent,
  setEditingResourceNoteId,
  editingResourceNoteId,
  setUserResourceNote,
  removeResourceNote,
  fetchResourceNotes,
  removeNote,
  fetchCourseNotes,
  addNote,
  courseId,
  addNoteToResource,
  editNote,
  editResourceNote,
}) => {
    const handleAddNote = async (e) => {
        e.preventDefault();
        if (userNote.trim() === "") {
          Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "Por favor, escribe un apunte antes de guardar."
          });
          return;
        }

        try {
          const result = await addNote(course.id, {
            content: userNote,
            userId: user.data.id,
          });
    
          if (result) {
            setUserNote("");
            await fetchCourseNotes(course.id, user.data.id);
            Swal.fire({icon: "success", title: "Apunte creado", text: "Tu apunte ha sido creado exitosamente.",});}
        } catch (error) {
          console.error("Error al añadir nota:", error);
          Swal.fire({icon: "error", title: "Error", text: "Ocurrió un error al crear el apunte. Por favor, intenta de nuevo más tarde.",});}
      };
    
      const handleAddResourceNote = async (e) => {
        e.preventDefault();
    
        if (userResourceNote.trim() === "") {
          Swal.fire({icon: "warning", title: "Advertencia",text: "Por favor, escribe un apunte antes de guardar.",});
          return;
        }
    
        try {
          const existingResourceNote = resourceNotes.find(
            (note) => note.resourceId === resource.id
          );
          if (existingResourceNote) {
            Swal.fire({icon: "info",title: "Apunte existente",text: "Ya existe un apunte para este recurso. Puedes editarlo si deseas hacer cambios.", });
            return;
          }
          const generalNote = notes.find(
            (note) => note.courseId === parseInt(courseId) && !note.resourceId
          );
          if (!generalNote) {
            Swal.fire({icon: "error",title: "Error",text: "No se encontró una nota general para este curso. Por favor, crea una primero.",});
            return;
          }
    
          const newResourceNote = await addNoteToResource(resource.id, {
            content: userResourceNote,
            noteId: generalNote.id,
          });
          console.log("Nueva nota del recurso creada:", newResourceNote);
          await fetchResourceNotes(course.id, resource.id, user.data.id);
          setUserResourceNote("");
    
          Swal.fire({icon: "success",title: "Éxito",text: "El apunte del recurso ha sido añadido exitosamente.",});
        } catch (error) {
          console.error("Error al añadir el apunte del recurso:", error);
          Swal.fire({icon: "error",title: "Error",text: "Ocurrió un error al añadir el apunte del recurso. Por favor, intenta de nuevo más tarde.",});}
      };
    
      const handleEditNote = async (noteId, content) => {
        setEditingNoteId(noteId);
        setEditedNoteContent(content);
      };
    
      const handleSaveEditedNote = async (noteId) => {
        try {
          await editNote(noteId, { content: editedNoteContent });
          const updatedNotes = notes.map((note) =>
            note.id === noteId ? { ...note, content: editedNoteContent } : note
          );
          fetchCourseNotes(course.id, user.data.id);
          setEditingNoteId(null);
          setEditedNoteContent("");
          Swal.fire({icon: "success",title: "Apunte actualizado",text: "Tu apunte ha sido actualizado exitosamente.",});
        } catch (error) {
          console.error("Error al editar nota:", error);
          Swal.fire({icon: "error", title: "Error",text: "Ocurrió un error al editar el apunte. Por favor, intenta de nuevo más tarde.", });}
      };
    
      const handleDeleteNote = async (noteId) => {
        try {
          const result = await Swal.fire({title: "¿Estás seguro?",text: "No podrás revertir esta acción",icon: "warning",showCancelButton: true,confirmButtonColor: "#3085d6", cancelButtonColor: "#d33", confirmButtonText: "Sí, eliminar",cancelButtonText: "Cancelar", });
    
          if (result.isConfirmed) {
            await removeNote(noteId);
            await fetchCourseNotes(course.id, user.data.id);
            await fetchResourceNotes(course.id, resource.id, user.data.id);
            Swal.fire("Eliminado","Tu apunte ha sido eliminado.", "success");}
        } catch (error) {
          console.error("Error al eliminar nota:", error);
          Swal.fire({icon: "error", title: "Error",text: "Ocurrió un error al eliminar el apunte. Por favor, intenta de nuevo más tarde.", });}
      };
    
      const handleEditResourceNote = (noteId, content) => {
        setEditingResourceNoteId(noteId);
        setEditedResourceNoteContent(content);
      };
    
      const handleSaveEditedResourceNote = async (noteId) => {
        try {
          await editResourceNote(noteId, { content: editedResourceNoteContent });
          await fetchResourceNotes(course.id, resource.id, user.data.id);
          setEditingResourceNoteId(null);
          setEditedResourceNoteContent("");
          Swal.fire({icon: "success",title: "Apunte actualizado",text: "Tu apunte del recurso ha sido actualizado exitosamente.",});
        } catch (error) {
          console.error("Error al editar el apunte del recurso:", error);
          Swal.fire({icon: "error",title: "Error",text: "Ocurrió un error al editar el apunte del recurso. Por favor, intenta de nuevo más tarde.",
          });
        }
      };
    
      const handleDeleteResourceNote = async (noteId) => {
        try {
          const result = await Swal.fire({title: "¿Estás seguro?",text: "No podrás revertir esta acción",icon: "warning",showCancelButton: true,confirmButtonColor: "#3085d6",cancelButtonColor: "#d33",confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar",
          });
          if (result.isConfirmed) {
            await removeResourceNote(noteId);
            await fetchResourceNotes(course.id, resource.id, user.data.id);
            Swal.fire("Eliminado","Tu apunte del recurso ha sido eliminado.","success"
            );
          }
        } catch (error) {
          console.error("Error al eliminar el apunte del recurso:", error);
          Swal.fire({icon: "error",title: "Error",text: "Ocurrió un error al eliminar el apunte del recurso. Por favor, intenta de nuevo más tarde.",});}
      };
    
    return {
        handleAddNote,
        handleAddResourceNote,
        handleEditNote,
        handleSaveEditedNote,
        handleDeleteNote,
        handleSaveEditedResourceNote,
        handleDeleteResourceNote,
        handleEditResourceNote,
    }
};

export default CourseNotesHandler;
