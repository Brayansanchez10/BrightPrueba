import React from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import "./css/CourseDetailsModal.css";
import zorroImage from "../../../assets/img/Zorro.png"; 

const CourseDetailsModal = ({ visible, onClose, course }) => {
  const { t } = useTranslation("global");

  return (
    <Modal
      className="custom-modal"
      centered
      visible={visible}
      onCancel={onClose}
      footer={null}
      closable={false}
    >
      <div className="modal-content">
        <div className="header">
          <img src={zorroImage} alt="Zorro" className="header-image" />
          <button className="close-icon" onClick={onClose}>
            ×
          </button>
        </div>
        {course ? (
          <div>
            <h1 className="title">
              CURSO DE <span className="course-title">{course?.title.toUpperCase()}</span>
            </h1>
            <div className="details">
              <div className="detail-item">
                <strong className="label">{t('courseDetails.id')}</strong>
                <p className="value">{course._id}</p>
              </div>
              <div className="detail-item">
                <strong className="label">{t('courseDetails.category')}</strong>
                <p className="value">{course.category}</p>
              </div>
              <div className="detail-item">
                <strong className="label">{t('courseDetails.name')}</strong>
                <p className="value">{course.title}</p>
              </div>
              <div className="detail-item">
                <strong className="label">{t('courseDetails.description')}</strong>
                <p className="value">{course.description}</p>
              </div>
              <div className="image-preview">
                {course.image && (
                  <img
                    className="preview-image"
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
