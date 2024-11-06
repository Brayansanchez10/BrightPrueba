import React from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import zorroImage from "../../../assets/img/Zorro.png";
import "../css/Custom.css";
import noImg from "../../../assets/img/Imagenvacia.jpg";

const CourseDetailsModal = ({ visible, onClose, course }) => {
  const { t } = useTranslation("global");

  return (
    <Modal
      className="custom-modal w-[543px] h-auto bg-white rounded-3xl"
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
          <div className="bg-white px-5 py-6">
            <h1 className="text-center text-[#350B48] text-2xl font-extrabold mt-4 mb-5 overflow-hidden text-ellipsis whitespace-nowrap font-bungee">
              {t('courseDetails.courseTitle')}
              <br />
              <span className="font-extrabold uppercase">{course?.title.toUpperCase()}</span>
            </h1>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-5">
                <strong className="font-bold text-xl">{t('courseDetails.id')}</strong>
                <p className="text-black text-lg">{course.id}</p>
              </div>
              <div className="mb-5">
                <strong className="font-bold text-xl">{t('courseDetails.category')}</strong>
                <p className="text-black text-lg">{course.category}</p>
              </div>
              <div className="mb-5">
                <strong className="font-bold text-xl">{t('courseDetails.name')}</strong>
                <p className="text-black text-lg">{course.title}</p>
              </div>
              <div className="mb-5">
                <strong className="font-bold text-xl">{t('courseDetails.description')}</strong>
                <p className="text-black text-lg">{course.description}</p>
              </div>
              <div className="mb-5">
                <strong className="font-bold text-xl">{t('courseDetails.userCount')}</strong>
                <p className="text-black text-lg">{course.enrolledCount}</p>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <img
                className="max-w-full h-[185px] rounded-lg object-contain"
                src={course.image || noImg}
                alt={t('courseDetails.imagePreview')}
              />
            </div>
          </div>
        ) : (
          <p className="text-black">{t('courseDetails.noCourseSelected')}</p>
        )}
      </div>
    </Modal>
  );
};

export default CourseDetailsModal;
