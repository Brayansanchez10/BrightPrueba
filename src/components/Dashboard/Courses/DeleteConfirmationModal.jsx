import React from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import pulpoImage from "../../../assets/img/pulpo.png";
import "./css/Custom.css";

const DeleteConfirmationModal = ({ visible, onClose, onConfirm, courseName }) => {
  const { t } = useTranslation("global");

  return (
    <Modal
      className="custom"
      centered
      visible={visible}
      onCancel={onClose}
      closable={false}
      footer={null}
      bodyStyle={{
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      <div
        className="absolute top-5 right-8 cursor-pointer"
        onClick={onClose}
      >
        <span className="text-white text-2xl font-bold">X</span>
      </div>

      <div className="h-[125px] bg-gradient-to-r from-[#872626] to-red-500 flex justify-center items-center">
        <img src={pulpoImage} alt="Pulpo" className="w-[162px] h-[148px] mt-6 object-contain" />
      </div>

      <div className="p-5 text-center">
        <h1 className="text-2xl font-extrabold text-[#D84545] mt-5 mb-4">
          {t('deleteCourse.title')}
        </h1>
        <p className="text-lg font-semibold mb-3">
          {t('deleteCourse.confirmationMessage', { courseName })}
        </p>
        <p className="text-sm font-extrabold text-red-500 mb-6">
          {t('deleteCourse.irreversibleMessage')}
        </p>

        <div className="flex justify-center">
          <button
            className="bg-[#FF4236] text-white font-bold text-lg rounded-2xl min-w-[133px] h-9 px-4 shadow-md hover:bg-[#ff2f22] transition-all duration-300"
            onClick={onConfirm}
          >
            {t('deleteCourse.confirmButton')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
