import React from "react";
import { FaStar, FaUser } from "react-icons/fa";
import { FiSend, FiEdit, FiTrash2, FiMoreVertical } from "react-icons/fi";

const RatingsComponent = ({
  ratings,
  t,
  userRating,
  setUserRating,
  ratingComment,
  setRatingComment,
  handleRatingSubmit,
  userExistingRating,
  formatDate,
  editingRatingId,
  setEditingRatingId,
  setEditedRatingScore,
  editedRatingScore,
  editedRatingComment,
  setEditedRatingComment,
  handleSaveEditedRating,
  handleEditRating,
  handleDeleteRating,
  showDropdown,
  setShowDropdown,
  user,
}) => {
  return (
    <div className="bg-[#200E3E] p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-roboto text-white mb-4">
        {ratings.length} {t("resource_view.ratings")}
      </h3>
      <div className="mb-4">
        <div className="flex items-center">
          <div className="flex-grow">
            <div className="flex items-center space-x-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setUserRating(star)}
                  className={`text-2xl ${
                    star <= userRating ? "text-yellow-400" : "text-gray-400"
                  }`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
            <input
              type="text"
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              placeholder={t("resource_view.placeholderR")}
              className="w-full bg-transparent border-b border-[#8D8282] focus:outline-none focus:border-white text-[#8D8282] placeholder-[#8D8282] focus:text-white"
            />
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <button
            onClick={handleRatingSubmit}
            className="px-4 py-2 bg-[#4B2F7A] font-bungee text-white rounded-md hover:bg-[#6e46b4] transition-colors flex items-center text-xs"
          >
            <FiSend className="mr-2" />
            {userExistingRating ? (
              <>{t("resource_view.update")}</>
            ) : (
              <>{t("resource_view.qualify")}</>
            )}
          </button>
        </div>
      </div>
      {userExistingRating && (
        <p className="text-yellow-400 mb-4">{t("resource_view.already")}</p>
      )}
      <div className="space-y-4 max-h-[25.5rem] overflow-y-auto custom-scrollbar-y">
        {ratings.map((rating) => (
          <div
            key={rating.id}
            className="flex items-start space-x-3 pb-3 border-b border-gray-700"
          >
            <div className="flex-shrink-0">
              {rating.user.userImage ? (
                <img
                  src={rating.user.userImage}
                  alt={rating.user.username}
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
                    {rating.user.username}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(rating.createdAt)}
                  </p>
                </div>
                {user.data.id === rating.userId && (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowDropdown(
                          showDropdown === `rating-${rating.id}`
                            ? null
                            : `rating-${rating.id}`
                        )
                      }
                      className="text-gray-400 hover:text-white"
                    >
                      <FiMoreVertical />
                    </button>
                    {showDropdown === `rating-${rating.id}` && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                        {/* <button
                          onClick={() => {
                            handleEditRating(
                              rating.id,
                              rating.score,
                              rating.comment
                            );
                            setShowDropdown(null);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <FiEdit className="inline-block mr-2" />
                          {t("resource_view.edit")}
                        </button> */}
                        <button
                          onClick={() => {
                            handleDeleteRating(rating.id);
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
              {editingRatingId === rating.id ? (
                <div className="mt-2">
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditedRatingScore(star)}
                        className={`text-2xl ${
                          star <= editedRatingScore
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={editedRatingComment}
                    onChange={(e) => setEditedRatingComment(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded p-2"
                    rows="3"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleSaveEditedRating(rating.id)}
                      className="px-4 py-2 bg-[#4B2F7A] font-bungee text-white rounded-md hover:bg-[#6e46b4] transition-colors text-xs mr-2"
                    >
                      {t("resource_view.save")}
                    </button>
                    <button
                      onClick={() => setEditingRatingId(null)}
                      className="px-4 py-2 bg-gray-500 font-bungee text-white rounded-md hover:bg-gray-600 transition-colors text-xs"
                    >
                      {t("resource_view.cancel")}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`text-xl ${
                          star <= rating.score
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300">
                    {rating.comment}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingsComponent;
