import React, { useState, useEffect } from "react";
import { Modal, Input } from "antd";
import { useTranslation } from "react-i18next";
import pulpoImage from "../../../assets/img/pulpo.png";
import "../css/Custom.css";

const DeleteConfirmationModal = ({ visible, onClose, onConfirm, courseName }) => {
  const { t } = useTranslation("global");
  const [confirmationInput, setConfirmationInput] = useState("");
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);

  useEffect(() => {
    setIsConfirmDisabled(confirmationInput !== courseName);
  }, [confirmationInput, courseName]);

  const handleConfirm = () => {
    if (confirmationInput === courseName) {
      onConfirm();
    }
  };

  return (
    <Modal
      className="custom-modal"
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

      <div className="bg-white p-5 text-center">
        <h1 className="text-2xl font-extrabold text-[#D84545] mt-5 mb-4">
          {t('deleteCourse.title')}
        </h1>
        <p className="text-lg font-semibold mb-3">
          {t('deleteCourse.confirmationMessage', { courseName })}
        </p>
        <p className="text-sm font-extrabold text-red-500 mb-6">
          {t('deleteCourse.irreversibleMessage')}
        </p>

        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">
            {t("deleteCourse.confirm")}
          </p>
          <Input
            placeholder={t('deleteCourse.camp')}
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            className="w-full max-w-md mx-auto"
          />
        </div>

        <div className="flex justify-center">
          <button
            className={`bg-[#FF4236] text-white font-bold text-lg rounded-2xl min-w-[133px] h-9 px-4 shadow-md transition-all duration-300 ${
              isConfirmDisabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-[#ff2f22]'
            }`}
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
          >
            {t('deleteCourse.confirmButton')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;