import React from "react";
import { FiSend, FiMoreVertical, FiEdit, FiTrash2 } from "react-icons/fi";
import { FaUser } from "react-icons/fa";

const GeneralComments = ({
  generalComments,
  userGeneralComment,
  setUserGeneralComment,
  handleGeneralCommentSubmit,
  handleEditGeneralComment,
  handleDeleteGeneralComment,
  editingGeneralCommentId,
  setEditingGeneralCommentId,
  editedGeneralCommentContent,
  setEditedGeneralCommentContent,
  showDropdown,
  setShowDropdown,
  handleSaveEditedGeneralComment,
  user,
  formatDate,
}) => {
  return (
    <div className="bg-[#200E3E] p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-roboto text-white mb-4">
        {generalComments.length} comentarios generales
      </h3>
      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="text"
            value={userGeneralComment}
            onChange={(e) => setUserGeneralComment(e.target.value)}
            placeholder="Escribe tu opinión general del curso"
            className="w-full bg-transparent border-b border-[#8D8282] focus:outline-none focus:border-white text-[#8D8282] placeholder-[#8D8282] focus:text-white"
          />
        </div>
        <div className="flex justify-end mt-2">
          <button
            onClick={handleGeneralCommentSubmit}
            className="px-4 py-2 bg-[#4B2F7A] text-white rounded-md hover:bg-blue-600 transition-colors flex items-center text-sm font-bungee"
          >
            <FiSend className="mr-2" /> Comentar
          </button>
        </div>
      </div>
      <div className="space-y-4 max-h-[30rem] overflow-y-auto custom-scrollbar">
        {generalComments.map((comment) => (
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
                          showDropdown === `general-comment-${comment.id}`
                            ? null
                            : `general-comment-${comment.id}`
                        )
                      }
                      className="text-gray-400 hover:text-white"
                    >
                      <FiMoreVertical />
                    </button>

                    {showDropdown === `general-comment-${comment.id}` && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                        <button
                          onClick={() => {
                            handleEditGeneralComment(
                              comment.id,
                              comment.content
                            );
                            setShowDropdown(null);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <FiEdit className="inline-block mr-2" />
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteGeneralComment(comment.id);
                            setShowDropdown(null);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <FiTrash2 className="inline-block mr-2" />
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {editingGeneralCommentId === comment.id ? (
                <div className="mt-2">
                  <textarea
                    value={editedGeneralCommentContent}
                    onChange={(e) =>
                      setEditedGeneralCommentContent(e.target.value)
                    }
                    className="w-full bg-gray-700 text-white rounded p-2"
                    rows="3"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleSaveEditedGeneralComment(comment.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm mr-2"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingGeneralCommentId(null)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-gray-300">
                  {comment.content}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneralComments;
