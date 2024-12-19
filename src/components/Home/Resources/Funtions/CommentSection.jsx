// CommentsSection.jsx
import React, { useState, useEffect } from "react";
import { FiSend, FiMoreVertical, FiEdit, FiTrash2 } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { useAnswers } from "../../../../context/courses/answerQuestion.contex.jsx";
import { BsFillReplyFill } from "react-icons/bs";
import Swal from "sweetalert2";

const CommentsSection = ({ comments, userComment, setUserComment, handleCommentSubmit, user, editingCommentId, setEditingCommentId, editedCommentContent, setEditedCommentContent, handleEditComment, handleSaveEditedComment, handleDeleteComment, showDropdown, setShowDropdown, t,
}) => {
  const { answers, createAnswer, getAnswersByComment, updateAnswer, deleteAnswer,} = useAnswers();
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState({});
  const [loadingReplies, setLoadingReplies] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null); // Estado para activar campo de respuesta
  const [replies, setReplies] = useState({}); // Estado para guardar las respuestas de cada comentario
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editedReplyContent, setEditedReplyContent] = useState("");
  const [errorMessage, setErrorMessage] = useState({
    content: "",
  });
  const MAX_CONTENT_LENGHT = 800;

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchAllReplies = async () => {
      const repliesByComment = {};
      for (const comment of comments) { // Asumiendo que tienes un array `comments`
        const fetchedReplies = await getAnswersByComment(comment.id);
        repliesByComment[comment.id] = fetchedReplies;
      }
      setReplies(repliesByComment);
    };
  
    fetchAllReplies();
  }, [comments]);

  const handleShowReplies = async (commentId) => {
    // Cerrar todas las respuestas abiertas previamente
    setShowReplies({});
  
    if (!showReplies[commentId]) {
      setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));
  
      // Obtén las respuestas del comentario
      const fetchedReplies = await getAnswersByComment(commentId);
  
      // Si no hay respuestas, no actualices el estado para mostrar
      if (fetchedReplies.length > 0) {
        setReplies((prev) => ({ ...prev, [commentId]: fetchedReplies }));
        setShowReplies({ [commentId]: true });
      }
  
      setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const handleReplySubmit = async (commentId) => {
    if (!replyContent.trim()) return;
    await createAnswer({
      content: replyContent,
      userId: user.data.id,
      commentsId: commentId,
    });
    Swal.fire({
      icon: "success",
      title: t("resource_view.AnswerSubmitAlertTitle"),
      text: t("resource_view.AnswerSubmitAlertText"),
      timer: 1500,
      showConfirmButton: false,
    });
    setReplyContent("");
    handleShowReplies(commentId);
    await getAnswersByComment(commentId); // Refresh answers
  };

  const handleEditReply = (replyId, replyContent) => {
    setEditingReplyId(replyId);
    setEditedReplyContent(replyContent);
  };

  const handleSaveEditedReply = async (replyId, commentId) => {
    if (!editedReplyContent.trim()) return;

    await updateAnswer(replyId, {
      content: editedReplyContent,
      userId: user.data.id, // Agrega el userId
    });

    setEditingReplyId(null);
    setEditedReplyContent("");

    await getAnswersByComment(commentId); // Refresca las respuestas usando el commentId correcto
    Swal.fire({
      icon: "success",
      title: t("resource_view.AnswerUpdateAlertTitle"),
      text: t("resource_view.AnswerUpdateAlertText"),
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleDeleteReply = async (replyId) => {
    try {
      const result = await Swal.fire({
        title: t("Topic.alertDelete"),
        text: t("Topic.texAlertDelete"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("Topic.yesDelete"),
        cancelButtonText: t("Topic.buttonCancel"),
      });

      if (result.isConfirmed) {
        await deleteAnswer(replyId);
        await getAnswersByComment(replyId); // Refresh answers
        Swal.fire({
          icon: "success",
          title: t("resource_view.AnswerDeleteAlertTitle"),
          text: t("resource_view.AnswerDeleteAlertText"),
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error al eliminar respuesta:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: t("resource_view.AnswerDeleteAlertError"),
      });
    }
  };

  // Función de validación de campo:
  const validateField =(name, value) => {
    switch (name) {
      case "content":
        if (!value) {
          setErrorMessage((prev) => ({ ...prev, name: t("createCategoryForm.nameRequired") }));
        } else if (value.length < 3) { 
          setErrorMessage((prev) => ({ ...prev, name: t("createCategoryForm.nameTooShort") }));
        } else if (value.length > 800) { 
          setErrorMessage((prev) => ({ ...prev, name: t("createCategoryForm.nameTooLong") }));
        } else {
          setErrorMessage((prev) => ({ ...prev, name: "" }));
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-[#200E3E] p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-roboto text-white mb-4">
        {comments.length} {t("resource_view.comments")}
      </h3>
      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="text"
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            placeholder={t("resource_view.placeholder")}
            className="w-full bg-transparent border-b border-[#8D8282] focus:outline-none focus:border-white text-[#8D8282] placeholder-[#8D8282] focus:text-white"
          />
        </div>
        <div className="flex justify-end mt-2">
          <button
            onClick={handleCommentSubmit}
            className="px-4 py-2 bg-[#4B2F7A] font-bungee text-white rounded-md hover:bg-[#6e46b4] transition-colors flex items-center text-xs"
          >
            <FiSend className="mr-2" /> {t("resource_view.comment")}
          </button>
        </div>
      </div>
      <div className="space-y-4 max-h-[30rem] custom-scrollbar-y">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex items-start space-x-3 pb-3 border-b border-gray-700"
          >
            <div className="flex-shrink-0">
              {comment.user.userImage ? (
                <img
                  src={comment.user.userImage}
                  alt={comment.user.username}
                  className="w-8 sm:w-10 h-8 sm:h-10 rounded-full"
                />
              ) : (
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <FaUser className="text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-white">
                    {comment.user.username}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
                {user.data.id === comment.userId && (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowDropdown(
                          showDropdown === comment.id ? null : comment.id
                        )
                      }
                      className="text-gray-400 hover:text-white"
                    >
                      <FiMoreVertical />
                    </button>
                    {showDropdown === comment.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                        <button
                          onClick={() => {
                            handleEditComment(comment.id, comment.content);
                            setShowDropdown(null);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <FiEdit className="inline-block mr-2" />
                          {t("resource_view.edit")}
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteComment(comment.id);
                            setShowDropdown(null);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <FiTrash2 className="inline-block mr-2" />
                          {t("resource_view.delete")}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {editingCommentId === comment.id ? (
                <div className="mt-2">
                  <textarea
                    value={editedCommentContent}
                    onChange={(e) => setEditedCommentContent(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded p-2"
                    rows="3"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleSaveEditedComment(comment.id)}
                      className="px-4 py-2 bg-[#4B2F7A] font-bungee text-white rounded-md hover:bg-[#6e46b4] transition-colors text-xs mr-2"
                    >
                      {t("resource_view.save")}
                    </button>
                    <button
                      onClick={() => setEditingCommentId(null)}
                      className="px-4 py-2 bg-gray-500 font-bungee text-white rounded-md hover:bg-gray-600 transition-colors text-xs"
                    >
                      {t("resource_view.cancel")}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-gray-300">
                  {comment.content}
                </p>
              )}

              {/* Respuestas */}
              <div className="mt-4 space-y-3">
                {/* Botones de ver/ocultar respuestas y responder */}
                <div className="flex items-center space-x-4">
                  {replies[comment.id]?.length > 0 ? (
                    loadingReplies[comment.id] ? (
                      <span className="text-gray-400 text-sm">{t("resource_view.loading")}</span>
                    ) : (
                      <button
                        onClick={() => handleShowReplies(comment.id)}
                        className="text-xs text-blue-400 hover:underline"
                      >
                        {showReplies[comment.id]
                          ? t("resource_view.hideReplies")
                          : `${t("resource_view.showReplies")} (${replies[comment.id].length})`}
                      </button>
                    )
                  ) : (
                    <span className="text-gray-400 text-sm">{t("resource_view.noReplies")}</span>
                  )}

                  <button
                    onClick={() =>
                      setActiveReplyId(activeReplyId === comment.id ? null : comment.id)
                    }
                    className={`text-xs flex items-center rounded px-2 py-1 transition-colors ${
                      activeReplyId === comment.id
                        ? "bg-blue-500 text-white" // Clases para el estado activo
                        : "text-blue-400 hover:bg-blue-100 hover:text-blue-500" // Clases para el estado normal
                    }`}
                  >
                    <BsFillReplyFill
                      className={`mr-1 transition-colors ${
                        activeReplyId === comment.id ? "text-white" : "text-blue-400"
                      }`}
                    />
                    {t("resource_view.AnswerSubmit")}
                  </button>
                </div>

                {/* Respuestas cargando */}
                {loadingReplies[comment.id] && (
                  <p className="text-xs text-gray-400">{t("loading")}</p>
                )}

                {showReplies[comment.id] &&
                  answers
                    .filter((answer) => answer.commentsId === comment.id)
                    .map((reply) => (
                      <div
                        key={reply.id}
                        className="ml-6 border-l border-gray-100 pl-4 mt-3"
                      >
                        {editingReplyId === reply.id ? (
                          <div>
                            <textarea
                              value={editedReplyContent}
                              onChange={(e) =>
                                setEditedReplyContent(e.target.value)
                              }
                              className="w-full bg-gray-700 text-white rounded p-2"
                              rows="2"
                              maxLength={MAX_CONTENT_LENGHT}
                            />
                             <div className="text-gray-300 text-right">
                                {editedReplyContent.length}/{MAX_CONTENT_LENGHT}
                              </div>
                            <div className="flex justify-end mt-2">
                              <button
                                onClick={() =>
                                  handleSaveEditedReply(reply.id, comment.id)
                                }
                                className="px-4 py-2 bg-[#4B2F7A] text-white rounded-md hover:bg-[#6e46b4] transition-colors text-xs mr-2"
                              >
                                {t("resource_view.save")}
                              </button>
                              <button
                                onClick={() => setEditingReplyId(null)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-xs"
                              >
                                {t("resource_view.cancel")}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-start">
                            <p className="text-sm text-gray-300 flex flex-col">
                              <strong className="text-gray-100">
                                {reply.user?.username || t("Anonymous")}:
                              </strong>
                              <span className="text-gray-200">
                                {reply.content}
                              </span>
                              <span className="text-gray-400 text-xs mt-1">
                                {formatDate(reply.createdAt)}
                              </span>
                            </p>
                            {user.data.id === reply.userId && (
                              <div className="space-x-2 flex items-center">
                                <button
                                  onClick={() =>
                                    handleEditReply(reply.id, reply.content)
                                  }
                                  className="text-gray-400 hover:text-white text-xs"
                                >
                                  <FiEdit className="text-blue-600" />
                                </button>
                                <button
                                  onClick={() => handleDeleteReply(reply.id)}
                                  className="text-gray-400 hover:text-white text-xs"
                                >
                                  <FiTrash2 className="text-red-600" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                {/* Campo para responder */}
                {activeReplyId === comment.id && (
                  <div className="flex flex-wrap items-center mt-3 space-x-2">
                    <input
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={t("resource_view.AnswerPlaceHolder")}
                      className="flex-1 bg-transparent border-b border-[#8D8282] focus:outline-none focus:border-white text-[#8D8282] placeholder-[#8D8282] focus:text-white text-xs sm:text-sm"
                      maxLength={MAX_CONTENT_LENGHT}
                    />
                    <div className="text-gray-300 text-right text-xs">
                      {replyContent.length}/{MAX_CONTENT_LENGHT}
                    </div>
                    {errorMessage.content && (
                      <p className="text-red-500 text-sm mt-1">{errorMessage.content}</p>
                    )}
                    <button
                      onClick={() => handleReplySubmit(comment.id)}
                      className="px-3 py-1.5 bg-[#4B2F7A] font-bungee text-white rounded-md hover:bg-[#6e46b4] transition-colors flex items-righ text-xs"
                    >
                      <FiSend />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
