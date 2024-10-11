import React, { useEffect, useState } from "react";
import { Modal, Checkbox } from "antd";
import holaImage from "../../../assets/img/hola1.png";
import { useTranslation } from "react-i18next";

const AssignPermissionsModal = ({
  visible,
  onCancel,
  selectedRoleId,
  selectedRole,
  permissionsData,
  selectedPermissionsMap,
  handleCheckboxChange,
  handleAssignPermissionsSubmit,
}) => {
  const { t } = useTranslation("global");

  return (
    <Modal
      className="custom"
      centered
      visible={visible}
      onCancel={onCancel}
      closable={false}
      footer={null}
      bodyStyle={{
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      <div className="absolute top-5 right-8 cursor-pointer" onClick={onCancel}>
        <span className="text-white text-2xl font-bold">X</span>
      </div>
      <div className="h-[115px] bg-gradient-to-r from-[#18116A] to-blue-500 flex justify-center items-center">
        <img
          src={holaImage}
          alt="Zorro"
          className="w-[182px] h-[168px] mt-12 object-contain"
        />
      </div>
      <div className="p-5 text-center">
        <h1 className="text-2xl font-extrabold text-[#18116A] mt-5 mb-4">
          {t("roles.assignPermissions").toUpperCase()}
        </h1>
        <p className="text-lg font-medium text-gray-700 mb-6">
          ¿{t("roles.description")}?
        </p>
        {permissionsData &&
          permissionsData.info &&
          permissionsData.info.map((permission) => (
            <div key={permission.id} className="mb-3">
              <Checkbox
                className="text-lg"
                checked={selectedPermissionsMap[selectedRoleId]?.includes(
                  permission.id
                )}
                onChange={() =>
                  handleCheckboxChange(selectedRoleId, permission.id)
                }
                style={{
                  color: selectedPermissionsMap[selectedRoleId]?.includes(
                    permission.id
                  )
                    ? "green"
                    : "red",
                }}
              >
                {permission.nombre}
              </Checkbox>
            </div>
          ))}
        <div className="flex justify-center space-x-2 mt-6">
          <button
            className="bg-[#18116A] text-white font-bold text-lg rounded-2xl min-w-[133px] h-9 px-4 shadow-md hover:bg-[#140e5b] transition-all duration-300"
            onClick={handleAssignPermissionsSubmit}
          >
            {t("roles.assignPermissions")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AssignPermissionsModal;
