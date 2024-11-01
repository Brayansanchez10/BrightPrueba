import Swal from "sweetalert2";

const CommentActions = ({
    editedCommentContent, setEditedCommentContent, setEditingCommentId, updateComment, fetchCommentsByResource, id, deleteComment, addComment, userComment, user, setUserComment, courseId
}) => {
    
    const handleEditComment = (commentId, currentContent) => {
        setEditingCommentId(commentId);
        setEditedCommentContent(currentContent);
    };
    
    const handleSaveEditedComment = async (commentId) => {
      if (editedCommentContent.trim() !== "") {
        try {
          await updateComment(commentId, { content: editedCommentContent });
          await fetchCommentsByResource(id);
          setEditingCommentId(null);
          setEditedCommentContent("");
          Swal.fire({
            icon: "success",
            title: "Comentario actualizado",
            text: "Tu comentario ha sido actualizado exitosamente.",
          });
        } catch (error) {
          console.error("Error al editar el comentario:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un error al editar el comentario. Por favor, intenta de nuevo más tarde.",
          });
        }
      }
    };
    
      const handleDeleteComment = async (commentId) => {
        try {
          const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
          });
    
          if (result.isConfirmed) {
            await deleteComment(commentId);
            await fetchCommentsByResource(id);
            Swal.fire("Eliminado", "Tu comentario ha sido eliminado.", "success");
          }
        } catch (error) {
          console.error("Error al eliminar el comentario:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un error al eliminar el comentario. Por favor, intenta de nuevo más tarde.",
          });
        }
    };

    const handleCommentSubmit = async (e) => {
      e.preventDefault();
      if (userComment.trim() !== "" && user?.data?.id) {
        try {
          await addComment(courseId, id, {
            content: userComment,
            userId: user.data.id,
          });
          setUserComment("");
          await fetchCommentsByResource(id);
          Swal.fire({
            icon: "success",
            title: "Comentario enviado",
            text: "Tu comentario ha sido publicado exitosamente.",
          });
        } catch (error) {
          console.error("Error al enviar comentario:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un error al enviar el comentario. Por favor, intenta de nuevo más tarde.",
          });
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: "Advertencia",
          text: "Por favor, escribe un comentario antes de enviar.",
        });
      }
    };

    return{ 
        handleDeleteComment,
        handleEditComment,
        handleSaveEditedComment,
        handleCommentSubmit,
        handleSaveEditedComment,
    };
};

export default CommentActions;