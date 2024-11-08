import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdPlayCircleOutline } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Modal = ({ 
  isOpen, 
  onClose, 
  course, 
  creator, 
  subCategories, 
  onRegister, 
  isLoading, 
  error, 
  isRegistered,
  children 
}) => {
  const { t } = useTranslation("global");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center px-4"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-secondary rounded-lg shadow-lg w-[300px] p-4 relative"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-primary hover:text-gray-500"
          >
            X
          </button>
          {course ? (
            <>
              <div className="flex items-start mb-2">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-[38px] h-[39.63px] rounded-lg shadow-sm"
                />
                <div className="ml-2">
                  <h2 className="font-bold text-[#272C33] dark:text-primary text-[15px]">
                    {course.title}
                  </h2>
                  <p className="text-[#939599] text-[11px]">
                    {t('courseComponent.with')} <strong>{creator ? creator.username : "Cargando..."}</strong>
                  </p>
                </div>
              </div>
              <p className="text-[#676B70] dark:text-primary text-[15px] font-regular mb-2">
                {course.description}
              </p>
              <div className="mb-4 text-[14px] mt-3">
                {subCategories && subCategories.map((subCategory, index) => (
                  <div key={index} className="flex items-center mb-1">
                    <span className="text-[#939599] dark:text-primary mr-2">✓</span>
                    <span className="text-[#939599] dark:text-primary">{subCategory.title}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-8">
                <div className="flex flex-col text-[#939599] dark:text-primary text-[12px]">
                  <div className="flex items-center mt-1">
                    <AiOutlineClockCircle className="mr-1" />
                    <span>{course.duracion} {t('courseComponent.hours')}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <MdPlayCircleOutline className="mr-1" />
                    <span>{subCategories ? subCategories.length : 0} {t('courseComponent.sections')}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <FaRegChartBar className="mr-1" />
                    <span>{course.nivel}</span>
                  </div>
                </div>
                <motion.button
                  onClick={onRegister}
                  className={`bg-[#783CDA] text-white font-bold text-[13px] rounded-[5px] shadow-md px-3 !py-1 ${
                    isRegistered || isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={isRegistered || isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading
                    ? t('courseComponent.registering')
                    : isRegistered
                    ? t('courseComponent.yaregister')
                    : t('courseComponent.registerM')}
                </motion.button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </>
          ) : (
            children
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;