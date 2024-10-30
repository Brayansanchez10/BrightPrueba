import React from "react";
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
  const groupedPermissions = permissionsData?.info?.reduce((acc, permission) => {
    const category = permission.category || 'Lista';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permission);
    return acc;
  }, {});

  return (
    <Modal
      className="custom rounded-2xl overflow-hidden"
      visible={visible}
      onCancel={onCancel}
      closable={false}
      footer={null}
      width={600}
      bodyStyle={{
        padding: 0,
        borderRadius: "16px",
      }}
    >
      <div className="relative h-[115px] bg-gradient-to-r from-[#18116A] to-blue-500 flex justify-center items-center">
        <img
          src={holaImage}
          alt="Zorro"
          className="w-[182px] h-[168px] mt-12 object-contain"
        />
        <button
          className="absolute top-4 right-4 text-white text-2xl font-bold bg-transparent border-none cursor-pointer"
          onClick={onCancel}
        >
          &times;
        </button>
      </div>
      <div className="p-6 text-center">
        <h1 className="text-2xl font-extrabold text-[#18116A] mt-5 mb-4">
          {t("roles.assignPermissions").toUpperCase()}
        </h1>
        <p className="text-lg font-medium text-gray-700 mb-6">
          ¿{t("roles.description")}?
        </p>
        <div className="max-h-[400px] overflow-y-auto pr-4">
          {groupedPermissions && Object.entries(groupedPermissions).map(([category, permissions]) => (
            <div key={category} className="mb-6 text-left">
              <h2 className="text-xl font-bold text-[#18116A] mb-3">{category}</h2>
              <div className="grid grid-cols-2 gap-4">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center">
                    <Checkbox
                      checked={selectedPermissionsMap[selectedRoleId]?.includes(permission.id)}
                      onChange={() => handleCheckboxChange(selectedRoleId, permission.id)}
                      className="mr-2"
                    >
                      <span className={`text-base ${selectedPermissionsMap[selectedRoleId]?.includes(permission.id) ? 'text-green-600 font-medium' : 'text-gray-700'}`}>
                        {permission.nombre}
                      </span>
                    </Checkbox>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <button
            className="bg-[#18116A] text-white font-bold text-lg rounded-2xl min-w-[200px] h-12 px-6 shadow-md hover:bg-[#140e5b] transition-all duration-300"
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