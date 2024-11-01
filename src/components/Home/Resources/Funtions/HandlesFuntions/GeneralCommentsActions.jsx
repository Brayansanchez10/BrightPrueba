import React, { useState } from "react";
import Swal from "sweetalert2";

const GeneralCommentsActions = ({
  generalComments,
  userGeneralComment,
  setUserGeneralComment,
  setEditingGeneralCommentId,
  editedGeneralCommentContent,
  setEditedGeneralCommentContent,
  user,
  courseId,
  addGeneralComment,
  editGeneralComment,
  fetchGeneralComments,
  removeGeneralComment
}) => {

  const handleGeneralCommentSubmit = async (e) => {
    e.preventDefault();
    if (userGeneralComment.trim() !== "" && user?.data?.id) {
      try {
        const existingComment = generalComments.find(comment => comment.userId === user.data.id);
        if (existingComment) {
          Swal.fire({icon: "warning", title: "Ya has comentado",  text: "Solo puedes hacer un comentario general por curso. Puedes editar tu comentario existente."});
          return;
        }
        await addGeneralComment({content: userGeneralComment, userId: user.data.id, courseId: parseInt(courseId)});
        setUserGeneralComment("");
        await fetchGeneralComments(courseId);
        Swal.fire({icon: "success", title: "Comentario enviado", text: "Tu comentario general ha sido publicado exitosamente."});
      } catch (error) {
        console.error("Error al enviar comentario general:", error);
        Swal.fire({icon: "error", title: "Error", text: "Ocurrió un error al enviar el comentario general. Por favor, intenta de nuevo más tarde."});
      }
    } else {
      Swal.fire({icon: "warning", title: "Advertencia", text: "Por favor, escribe un comentario antes de enviar."});
    }
  };

  const handleEditGeneralComment = (commentId, currentContent) => {
    setEditingGeneralCommentId(commentId);
    setEditedGeneralCommentContent(currentContent);
  };

  const handleSaveEditedGeneralComment = async (commentId) => {
    if (editedGeneralCommentContent.trim() !== "") {
      try {
        await editGeneralComment(commentId, { content: editedGeneralCommentContent });
        await fetchGeneralComments(courseId);
        setEditingGeneralCommentId(null);
        setEditedGeneralCommentContent("");
        Swal.fire({icon: "success", title: "Comentario general actualizado", text: "Tu comentario general ha sido actualizado exitosamente."});
      } catch (error) {
        console.error("Error al editar el comentario general:", error);
        Swal.fire({icon: "error", title: "Error", text: "Ocurrió un error al editar el comentario general. Por favor, intenta de nuevo más tarde."});
      }
    }
  };

  const handleDeleteGeneralComment = async (commentId) => {
    try {
      const result = await Swal.fire({title: "¿Estás seguro?", text: "No podrás revertir esta acción", icon: "warning", showCancelButton: true, confirmButtonColor: "#3085d6", cancelButtonColor: "#d33", confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar"});

      if (result.isConfirmed) {
        await removeGeneralComment(commentId);
        await fetchGeneralComments(courseId);
        Swal.fire("Eliminado", "Tu comentario general ha sido eliminado.", "success");
      }
    } catch (error) {
      console.error("Error al eliminar el comentario general:", error);
      Swal.fire({icon: "error", title: "Error", text: "Ocurrió un error al eliminar el comentario general. Por favor, intenta de nuevo más tarde."});
    }
  };

  return {
    handleGeneralCommentSubmit,
    handleEditGeneralComment,
    handleSaveEditedGeneralComment,
    handleDeleteGeneralComment,
  };
};

export default GeneralCommentsActions;
