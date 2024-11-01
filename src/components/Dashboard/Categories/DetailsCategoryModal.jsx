import React from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import zorroImage from "../../../assets/img/Zorro.png";
import "../css/Custom.css";

const DetailsCategoryModal = ({ visible, onClose, category }) => {
  const { t } = useTranslation("global");

  if (!category) return false; 

  return (
    <Modal 
      className="custom-modal w-[543px] h-[680px] bg-white rounded-3xl"
      onCancel={onClose} 
      closable={false}
      visible={visible}
      centered
      footer={null}
      bodyStyle={{
        overflow: "hidden",
      }}
    >
      <div className="p-0">
        <div className="relative w-full h-[125px] bg-gradient-to-r from-[#350B48] to-[#905BE8] flex items-center justify-center">
          <img
            src={zorroImage}
            alt="Zorro"
            className="absolute w-[146px] h-[155px] top-0 left-1/2 transform -translate-x-1/2 mt-4"
          />
          <button
            className="absolute top-2 right-5 bg-transparent text-white text-3xl font-bold cursor-pointer"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="px-5 py-6">
          <h1 className="text-center text-[#350B48] text-2xl mt-10 mb-5 font-bungee">
            {t("detailsCategoryModal.title")}
          </h1>
          <div>
            <div className="mb-5">
              <strong className="text-black font-bold text-xl">{t('detailsCategoryModal.name')}</strong>
              <p className="text-black text-lg">{category.name}</p>
            </div>
            <div className="mb-5">
              <strong className="text-black font-bold text-xl">{t('detailsCategoryModal.description')}</strong>
              <p className="text-black text-lg">{category.description}</p>
            </div>
            <div className="flex justify-center mt-8">
              {category.image && (
                <img
                  className="max-w-full rounded-lg"
                  src={category.image}
                  alt={t('detailsCategoryModal.imagePreview')}
                />
              )}
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button 
              className="px-4 py-2 bg-neutral-700 text-base rounded-lg hover:bg-neutral-600 font-black text-white"
              onClick={onClose}
            >
              {t("detailsCategoryModal.closeButton")}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DetailsCategoryModal;