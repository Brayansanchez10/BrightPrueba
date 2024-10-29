import React from "react";
import { Modal } from "antd";
import zorroImage from "../../../assets/img/Zorro.png";
import { useTranslation } from "react-i18next";

const DetailsModal = ({
  visible,
  onClose,
  selectedRole,
  permissionsData,
  selectedRoleId,
  selectedPermissionsMap,
}) => {
  const { t } = useTranslation("global");

  const groupedPermissions = permissionsData?.info.reduce(
    (groups, permission) => {
      const category = permission.nombre.split(" ")[0]; // Toma el primer término (Crear, Editar, Eliminar, Activar)
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
      return groups;
    },
    {}
  );

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
              {/* Permisos agrupados en columnas */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {Object.keys(groupedPermissions).map((category) => (
                  <div key={category}>
                    <h2 className="text-xl font-semibold text-[#350B48] mb-2">{category}</h2>
                    <div className="space-y-2">
                      {groupedPermissions[category]
                        .filter((permission) =>
                          selectedRole.permisos.includes(permission.nombre.trim()) // Usa trim() para evitar problemas con espacios
                        )
                        .map((permission) => (
                          <p key={permission.id} className="text-gray-800 ml-4">
                            {permission.nombre}
                          </p>
                        ))}
                    </div>
                  </div>
                ))}
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
