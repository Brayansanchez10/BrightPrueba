// CommentsSection.jsx
import React, { useState } from "react";
import { FiSend, FiMoreVertical, FiEdit, FiTrash2 } from "react-icons/fi";
import { FaUser } from "react-icons/fa";

const CommentsSection = ({
  comments,
  userComment,
  setUserComment,
  handleCommentSubmit,
  user,
  editingCommentId,
  setEditingCommentId,
  editedCommentContent,
  setEditedCommentContent,
  handleEditComment,
  handleSaveEditedComment,
  handleDeleteComment,
  showDropdown,
  setShowDropdown,
  t,
}) => {
  

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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
