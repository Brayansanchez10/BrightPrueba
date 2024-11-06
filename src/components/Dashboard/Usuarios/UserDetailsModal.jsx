import React from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import zorroImage from "../../../assets/img/Zorro.png";
import "../css/Custom.css";

const DetailsUserModal = ({ visible, onCancel, user }) => {
  const { t } = useTranslation("global");

  return (
    <Modal 
      className="custom-modal w-[543px] bg-white rounded-3xl"
      centered
      visible={visible}
      closable={false}
      onCancel={onCancel}
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
            className="absolute w-[146px] h-[155px] top-0 left-1/2 transform -translate-x-1/2 mt-5" 
          />
          <button
            className="absolute top-2 right-5 bg-transparent text-white text-3xl font-bold cursor-pointer"
            onClick={onCancel}
          >
            ×
          </button>
        </div>
        <div className="bg-white px-5 py-6">
          <h1 className="text-center text-[#350B48] text-3xl font-extrabold mt-12 mb-5 overflow-hidden text-ellipsis whitespace-nowrap font-bungee">
            {t('userDetails.title')}
          </h1>
          {user && (
            <div className="grid grid-cols-2 gap-4">
              <p className="mb-5">
                <strong className="font-bold text-xl">{t('userDetails.id')}:</strong>
                <br />
                <span className="text-lg">{user.id}</span>
              </p>
              <p className="mb-5">
                <strong className="font-bold text-xl">{t('userDetails.name')}:</strong>
                <br />
                <span className="text-lg">{user.username}</span>
              </p>
              <p className="mb-5">
                <strong className="font-bold text-xl">{t('userDetails.firstNames')}:</strong>
                <br />
                <span className="text-lg">{user.firstNames}</span>
              </p>
              <p className="mb-5">
                <strong className="font-bold text-xl">{t('userDetails.lastNames')}:</strong>
                <br />
                <span className="text-lg">{user.lastNames}</span>
              </p>
              <p className="mb-5">
                <strong className="font-bold text-xl">{t('userDetails.documentNumber')}:</strong>
                <br />
                <span className="text-lg">{user.documentNumber}</span>
              </p>
              <p className="mb-5">
                <strong className="font-bold text-xl">{t('userDetails.email')}:</strong>
                <br />
                <span className="text-lg">{user.email}</span>
              </p>
              <p className="mb-5">
                <strong className="font-bold text-xl">{t('userDetails.role')}:</strong>
                <br />
                <span className="text-lg">{user.role}</span>
              </p>
              <p className="mb-5">
                <strong className="font-bold text-xl">{t('userDetails.status')}:</strong>
                <br />
                <span className="text-lg">{user.state ? t('userDetails.active') : t('userDetails.inactive')}</span>
              </p>
              <p className="mb-5">
                <strong className="font-bold text-xl">{t('userDetails.entity')}:</strong>
                <br />
                <span className="text-lg">{user.entityId}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DetailsUserModal;
