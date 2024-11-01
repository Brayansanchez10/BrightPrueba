import React, { useEffect, useState, useRef, useCallback } from "react";
import { FiChevronLeft, FiChevronRight, FiCheckCircle, FiMenu, FiX } from 'react-icons/fi';

const ContentResourceView = ({
  isOpen,
  toggleSidebar,
  currentProgress,
  course,
  resource,
  creator,
  error,
  currentResourceIndex,
  resources,
  handlePrevious,
  handleNext,
  handleFinishCourse,
  renderQuiz,
  renderContent,
  renderStartQuizView,
  renderQuizSummary,
  renderResourceList,
  renderRightSideContent,
  isQuizCompleted,
  t,
}) => {
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    
  return (
    <div className="flex flex-col sm:flex-row">
      <div className="hidden sm:block">
        <div
          className={`${
            isOpen ? 'w-56' : 'w-16'
          } fixed left-0 top-16 h-full bg-[#200E3E] transition-all duration-300 ease-in-out overflow-hidden z-40`}
        >
          <button
            onClick={toggleSidebar}
            className="absolute top-4 left-2 p-[10px] bg-[#5D4B8A] text-white rounded-full shadow-lg hover:bg-[#3D2A5F] transition-colors"
          >
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <div className="mt-16 p-4">{renderResourceList()}</div>
        </div>
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out pt-20 px-4 sm:px-6 ${
          isOpen ? 'sm:ml-56' : 'sm:ml-16'
        }`}
      >
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm sm:text-base font-medium text-white font-bungee">
              {t('resource_view.progress')}
            </span>
            <span className="text-sm sm:text-base font-medium text-white font-bungee">
              {currentProgress}%
            </span>
          </div>
          <div className="w-full bg-white rounded-full h-6">
            <div
              className="bg-[#9869E3] h-6 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${currentProgress}%` }}
            ></div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-2/3 bg-[#200E3E] rounded-lg shadow-lg pb-4 mb-4">
            <h1 className="flex justify-center text-2xl font-bungee text-white mb-4">
              {course?.title}
            </h1>
            <div className="mb-4">
            {
                resource?.quizzes && resource.quizzes.length > 0
                  ? !isQuizStarted
                    ? renderStartQuizView()
                    : isQuizCompleted
                    ? renderQuizSummary()
                    : renderQuiz()
                  : renderContent(resource?.files)
              }

              {error && <p className="text-red-500 text-center">{error}</p>}
            </div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <img
                  src={course?.image}
                  alt={course?.title}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div className="flex flex-col -mt-2">
                  <h2 className="text-xl font-bungee text-white">
                    {resource.title}
                  </h2>
                  <p className="text-xs font-bungee text-gray-400">
                    {creator?.username}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handlePrevious}
                  disabled={currentResourceIndex === 0}
                  className={`p-2.5 mr-2 rounded-full transition-colors ${
                    currentResourceIndex === 0
                      ? 'bg-[#DDDDDD] text-white cursor-not-allowed'
                      : 'bg-[#9869E3] text-white hover:bg-[#8A5CD6]'
                  }`}
                >
                  <FiChevronLeft size={24} />
                </button>
                <button
                  onClick={
                    currentResourceIndex === resources.length - 1
                      ? handleFinishCourse
                      : handleNext
                  }
                  className={`p-2.5 ml-2 rounded-full transition-colors ${
                    currentResourceIndex === resources.length - 1
                      ? 'bg-[#9869E3] text-white hover:bg-[#8A5CD6]'
                      : 'bg-[#9869E3] text-white hover:bg-[#8A5CD6]'
                  }`}
                >
                  {currentResourceIndex === resources.length - 1 ? (
                    <FiCheckCircle size={24} />
                  ) : (
                    <FiChevronRight size={24} />
                  )}
                </button>
              </div>
            </div>
            <div className="max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl text-sm sm:text-base text-white ml-4 mt-4">
              <p className="break-words whitespace-pre-wrap">
                {resource.description}
              </p>
            </div>
          </div>
          <div className="w-full lg:w-1/3 pt-[52px]">
            {renderRightSideContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentResourceView;
