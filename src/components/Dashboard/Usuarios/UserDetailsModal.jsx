import React from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import zorroImage from "../../../assets/img/Zorro.png";
import "../css/Custom.css";

const DetailsUserModal = ({ visible, onCancel, user }) => {
  const { t } = useTranslation("global");


  return (
    <Modal 
      className="custom w-[543px] h-[700px] bg-white rounded-3xl"
      centered
      visible={visible}
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
            className="absolute w-[146px] h-[155px] top-0 left-1/2 transform -translate-x-1/2" 
          />
          <button
            className="absolute top-2 right-5 bg-transparent text-white text-3xl font-bold cursor-pointer"
            onClick={onCancel}
          >
            ×
          </button>
        </div>
        <div className="px-5 py-6">
          <h1 className="text-center text-[#350B48] text-3xl font-extrabold mt-14 mb-5 overflow-hidden text-ellipsis whitespace-nowrap">
            {t('userDetails.title')}
          </h1>
          {user && (
            <div>
              <p className="mb-5">
                <strong className="font-bold text-xl text-black">{t('userDetails.id')}:</strong>
                <br />
                <span className="text-lg">{user.id}</span>
              </p>
              <p className="mb-5">
                <strong className="font-bold text-xl text-black">{t('userDetails.name')}:</strong>
                <br />
                <span className="text-lg">{user.username}</span>
              </p>
              <p className="mb-5">
                <strong className="font-bold text-xl text-black">{t('userDetails.email')}:</strong>
                <br />
                <span className="text-lg">{user.email}</span>
              </p>
              <p className="mb-5">
                <strong className="font-bold text-xl text-black">{t('userDetails.role')}:</strong>
                <br />
                <span className="text-lg">{user.role}</span>
              </p>
              <p className="mb-5">
                <strong className="font-bold text-xl text-black">{t('userDetails.status')}:</strong>
                <br />
                <span className="text-lg">{user.state ? t('userDetails.active') : t('userDetails.inactive')}</span>
              </p>
            </div>
          )}
        </div>
        <div className="px-5 py-4">
          <div className="flex justify-center">
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DetailsUserModal;

