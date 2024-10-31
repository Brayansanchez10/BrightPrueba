import React from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import zorroImage from "../../../assets/img/Zorro.png";
import "../css/Custom.css";

const DetailsEntityModal = ({ visible, onClose, entities }) => {
    const { t } = useTranslation("global");

    if (!entities) return null; 

    return (
        <Modal 
          className="custom w-[543px] bg-white rounded-3xl"
          onCancel={onClose} 
          closable={false}
          visible={visible}
          centered
          footer={null}
          bodyStyle={{ padding: 0 }}
        >
          <div className="p-0">
            <div className="relative w-full h-[125px] bg-gradient-to-r from-[#350B48] to-[#905BE8] flex items-center justify-center rounded-t-3xl">
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
              <h1 className="text-center text-[#350B48] text-3xl font-extrabold mt-10 mb-5 overflow-hidden text-ellipsis whitespace-nowrap font-bungee">
                {t("detailsEntityModal.title")}
                <span className="font-extrabold uppercase"></span>
              </h1>
              <div className="flex justify-between mb-5"> 
                <div className="w-1/2 text-center"> 
                  <strong className="text-black font-bold text-xl">{t('detailsCategoryModal.name')}</strong>
                  <p className="text-black text-lg">{entities.name}</p>
                </div>
                <div className="w-1/2 text-center"> 
                  <strong className="text-black font-bold text-xl">{t("entities.type")}</strong>
                  <p className="text-black text-lg">{entities.type}</p>
                </div>
              </div>
              <div className="flex justify-center mt-4">
              </div>
            </div>
          </div>
        </Modal>
    );
};

export default DetailsEntityModal;
