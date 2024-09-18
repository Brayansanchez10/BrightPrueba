import React from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import zorroImage from "../../../assets/img/Zorro.png";
import "../css/Custom.css";

const CourseDetailsModal = ({ visible, onClose, course }) => {
  const { t } = useTranslation("global");

  return (
    <Modal
      className="custom w-[543px] h-[700px] bg-white rounded-3xl"
      centered
      visible={visible}
      onCancel={onClose}
      footer={null}
      closable={false}
      bodyStyle={{
        overflow: "hidden",
      }}
    >
      <div className="p-0">
        <div className="relative w-full h-[125px] bg-gradient-to-r from-[#350B48] to-[#905BE8] flex items-center justify-center">
          <img
            src={zorroImage}
            alt={t('courseDetails.zorroAlt')}
            className="absolute w-[146px] h-[155px] top-0 left-1/2 transform -translate-x-1/2"
          />
          <button
            className="absolute top-2 right-5 bg-transparent text-white text-3xl font-bold cursor-pointer"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        {course ? (
          <div className="px-5 py-6">
            <h1 className="text-center text-[#350B48] text-3xl font-extrabold mt-14 mb-5 overflow-hidden text-ellipsis whitespace-nowrap">
              {t('courseDetails.courseTitle')} <span className="font-extrabold uppercase">{course?.title.toUpperCase()}</span>
            </h1>
            <div>
              <div className="mb-5">
                <strong className="text-black font-bold text-xl">{t('courseDetails.id')}</strong>
                <p className="text-black text-lg">{course._id}</p>
              </div>
              <div className="mb-5">
                <strong className="text-black font-bold text-xl">{t('courseDetails.category')}</strong>
                <p className="text-black text-lg">{course.category}</p>
              </div>
              <div className="mb-5">
                <strong className="text-black font-bold text-xl">{t('courseDetails.name')}</strong>
                <p className="text-black text-lg">{course.title}</p>
              </div>
              <div className="mb-5">
                <strong className="text-black font-bold text-xl">{t('courseDetails.description')}</strong>
                <p className="text-black text-lg">{course.description}</p>
              </div>
              <div className="flex justify-center">
                {course.image && (
                  <img
                    className="max-w-full rounded-lg"
                    src={course.image}
                    alt={t('courseDetails.imagePreview')}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>{t('courseDetails.noCourseSelected')}</p>
        )}
      </div>
    </Modal>
  );
};

export default CourseDetailsModal;
