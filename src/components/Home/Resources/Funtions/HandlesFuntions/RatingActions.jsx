import Swal from "sweetalert2";

const RatingActions = ({
  updateRating,
  deleteRating,
  fetchRatingsByResource,
  id,
  setEditingRatingId,
  setEditedRatingScore,
  setEditedRatingComment,
  setUserExistingRating,
  setUserRating,
  setRatingComment,
  userRating,
  ratingComment,
  userExistingRating,
  user,
  addRating,
  courseId,
}) => {
  const handleEditRating = (ratingId, currentScore, currentComment) => {
    setEditingRatingId(ratingId);
    setEditedRatingScore(currentScore);
    setEditedRatingComment(currentComment);
  };

  const handleSaveEditedRating = async (ratingId, editedRatingScore, editedRatingComment) => {
    console.log("Información: ", ratingId);
    console.log("Información: ", editedRatingScore);
    console.log("Información: ", editedRatingComment);
    if (editedRatingScore > 0) {
      try {
        await updateRating(ratingId, {
          score: editedRatingScore,
          comment: editedRatingComment,
        });
        await fetchRatingsByResource(id);
        setEditingRatingId(null);
        setEditedRatingScore(0);
        setEditedRatingComment("");
        Swal.fire({
          icon: "success",
          title: "Calificación actualizada",
          text: "Tu calificación ha sido actualizada exitosamente.",
        });
        console.log("Información", ratingId);
      } catch (error) {
        console.error("Error al editar la calificación:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al editar la calificación. Por favor, intenta de nuevo más tarde.",
        });
      }
    }
  };

  const handleDeleteRating = async (ratingId) => {
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
        await deleteRating(ratingId);
        await fetchRatingsByResource(id);
        setUserExistingRating(null);
        setUserRating(0);
        setRatingComment("");
        Swal.fire("Eliminada", "Tu calificación ha sido eliminada.", "success");
      }
    } catch (error) {
      console.error("Error al eliminar la calificación:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al eliminar la calificación. Por favor, intenta de nuevo más tarde.",
      });
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (userRating > 0 && user?.data?.id) {
      try {
        if (userExistingRating) {
          await updateRating(userExistingRating.id, {
            score: userRating,
            comment: ratingComment,
          });
          Swal.fire({
            icon: "success",
            title: "Valoración actualizada",
            text: "Tu valoración ha sido actualizada exitosamente.",
          });
        } else {
          await addRating(courseId, id, {
            userId: user.data.id,
            score: userRating,
            comment: ratingComment,
          });
          Swal.fire({
            icon: "success",
            title: "¡Gracias por tu valoración!",
            text: "Tu valoración ha sido registrada exitosamente.",
          });
        }

        await fetchRatingsByResource(id);
      } catch (error) {
        console.error("Error al enviar calificación:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al enviar la calificación. Por favor, intenta de nuevo más tarde.",
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor, selecciona una calificación antes de enviar.",
      });
    }
  };

  return {
    handleEditRating,
    handleSaveEditedRating,
    handleDeleteRating,
    handleRatingSubmit,
  };
};

export default RatingActions;
