import React from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Sidebar({ isOpen, toggleSidebar, resources, currentProgress, handleResourceClick }) {
  const renderResourceList = () => {
    const totalResources = resources.length;
    const percentagePerResource = 100 / totalResources;

    return resources.map((res, index) => {
      const requiredProgress = Math.floor(index * percentagePerResource);
      const isUnlocked = currentProgress >= requiredProgress;

      return (
        <div
          key={res.id}
          className={`flex items-start mb-6 cursor-pointer ${
            isOpen ? "pr-4" : "justify-center"
          }`}
          onClick={() => isUnlocked && handleResourceClick(res.id, res.courseId)}
        >
          <div className="relative mr-2.5">
            <div
              className={`
                flex items-center justify-center
                w-10 h-10 rounded-full 
                ${
                  isUnlocked
                    ? "bg-white text-[#6D4F9E]"
                    : "bg-gray-500 text-gray-300 cursor-not-allowed"
                }
                text-sm font-bold
              `}
            >
              {index + 1}
            </div>
            {index < resources.length - 1 && (
              <div
                className={`absolute left-[19px] top-8 w-0.5 h-10 ${
                  isUnlocked ? "bg-white" : "bg-gray-500"
                }`}
              />
            )}
          </div>
          {isOpen && (
            <span
              className={`mt-2 text-xs ${
                isUnlocked ? "text-white font-bold" : "text-gray-500"
              }`}
            >
              {res.title}
            </span>
          )}
        </div>
      );
    });
  };

  return (
    <div className="hidden sm:block">
      <div
        className={`${
          isOpen ? "w-56" : "w-16"
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
  );
}