import React from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import zorroImage from "../../../assets/img/Zorro.png";
import "../css/Custom.css";

const DetailsUserModal = ({ visible, onCancel, user }) => {
  const { t } = useTranslation("global");

  return (
    <Modal
      className="custom w-[543px] bg-white rounded-3xl"
      centered
      visible={visible}
      onCancel={onCancel}
      footer={null}
      closable={false}
      bodyStyle={{
        overflow: "hidden",
      }}
    >
      <div className="p-0">
        <div className="relative w-full h-[125px] bg-gradient-to-r from-[#350B48] to-[#905BE8] flex items-center justify-center">
          <img
            src={zorroImage} // Puedes cambiar a otra imagen si es necesario
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

        {user ? (
          <div className="px-5 py-6">
            <h1 className="text-center text-[#350B48] text-3xl font-extrabold mt-14 mb-5 overflow-hidden text-ellipsis whitespace-nowrap">
              {t('userDetails.title')}
            </h1>
            <div>
              <div className="mb-5">
                <strong className="text-black font-bold text-xl">{t('userDetails.id')}</strong>
                <p className="text-black text-lg">{user._id}</p>
              </div>
              <div className="mb-5">
                <strong className="text-black font-bold text-xl">{t('userDetails.name')}</strong>
                <p className="text-black text-lg">{user.username}</p>
              </div>
              <div className="mb-5">
                <strong className="text-black font-bold text-xl">{t('userDetails.email')}</strong>
                <p className="text-black text-lg">{user.email}</p>
              </div>
              <div className="mb-5">
                <strong className="text-black font-bold text-xl">{t('userDetails.role')}</strong>
                <p className="text-black text-lg">{user.role}</p>
              </div>
              <div className="mb-5">
                <strong className="text-black font-bold text-xl">{t('userDetails.status')}</strong>
                <p className="text-black text-lg">
                  {user.state ? t('userDetails.active') : t('userDetails.inactive')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p>{t('userDetails.noUserSelected')}</p>
        )}
      </div>
    </Modal>
  );
};

export default DetailsUserModal;
