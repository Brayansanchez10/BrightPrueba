import React from "react";
import { Modal } from "antd";
import zorroImage from "../../../assets/img/Zorro.png";
import { useTranslation } from "react-i18next";

const DetailsModal = ({ visible, onClose, selectedRole }) => {
  const { t } = useTranslation("global");

  return (
    <Modal
      className="custom w-[543px] h-[400px] bg-white rounded-3xl"
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
            alt="Zorro"
            className="absolute w-[146px] h-[155px] top-0 left-1/2 transform -translate-x-1/2"
          />
          <button
            className="absolute top-2 right-5 bg-transparent text-white text-3xl font-bold cursor-pointer"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="px-5 py-6">
          <h1 className="text-center text-[#350B48] text-3xl font-extrabold mt-14 mb-5 overflow-hidden text-ellipsis whitespace-nowrap">
            {t("roles.permissions")}
          </h1>
          {selectedRole && (
            <div className="grid grid-cols-2 gap-4">
              <p className="mb-5">
                <strong className="font-bold text-xl text-black">
                  {t("roles.role")} ID:
                </strong>
                <br />
                <span className="text-lg text-black-500 font-medium">
                  {selectedRole.id}
                </span>
              </p>
              <p className="mb-5">
                <strong className="font-bold text-xl text-black">
                  {t("roles.name")}:
                </strong>
                <br />
                <span className="text-lg text-black-500 font-medium">
                  {selectedRole.nombre}
                </span>
              </p>
              <div className="col-span-2">
                <strong className="font-bold text-xl text-black">
                  {t("roles.permissions")}:
                </strong>
                <br />
                <span className="text-base text-black-600 font-medium">
                  {selectedRole &&
                    selectedRole.permisos &&
                    selectedRole.permisos.map((permiso) => (
                      <li className="text-sm ml-10" key={permiso}>
                        <span className="text-black text-lg">-</span> {permiso}
                      </li>
                    ))}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="px-5 py-4">
          <div className="flex justify-center"></div>
        </div>
      </div>
    </Modal>
  );
};

export default DetailsModal;