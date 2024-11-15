import React, {useEffect, useState} from "react";
import { useRoleContext } from "../../../context/user/role.context";
import { Modal, Input  } from "antd";
import Swal from "sweetalert2";
import zorroImage from "../../../assets/img/Zorro.png";
import { useTranslation } from "react-i18next";
import { getRole } from "../../../api/user/role.request";

const DeleteRolModal = ({ isVisible, visible, onClose, roleId, deleteRole }) => {
  const { t } = useTranslation("global");
  const [role, setRole] = useState({ nombre: "" });
  const [roles, setRoles] = useState({});
  const { createRole, rolesData, getAllRoles } = useRoleContext();
  const [confirmationInput, setConfirmationInput] = useState("");
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);

  useEffect(() => {
    if (visible) {
      fetchRoles();
      fetchRole();
    } else {
      setRole({ nombre: "" });
      setRoles([]);
      setConfirmationInput("");
    }
  }, [visible]);

  useEffect(() => {
    setIsConfirmDisabled(confirmationInput !== role.nombre);
  }, [confirmationInput, role]);

  const fetchRole = async () => {
    try {
      const response = await getRole(roleId);
      setRole(response.data);
      const roleData = await getAllRoles();
    } catch (err) {
      console.error("Error al obtener todas los roles:", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await getAllRoles();
      const roleData = response.data.find(r => r.id === roleId);
      setRole(roleData || { nombre: "" });
    } catch (err) {
      console.error("Error al obtener todas los roles:", err);
    }
  };


  const confirmDeleteRole = async () => {
    try {
      await deleteRole(roleId);
      Swal.fire({
        icon: "success",
        title: "Rol eliminado exitosamente",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        onClose();
      });
      fetchRoles();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar el rol",
        text: error.message || "An error occurred while deleting the role.",
        timer: 3000,
        showConfirmButton: true,
      });
    }
  };

  return (
    <Modal
      className="custom-modal w-[543px] h-[350px] bg-white rounded-3xl"
      centered
      visible={visible}
      onCancel={onClose}
      footer={null}
      closable={false}
      bodyStyle={{
        overflow: "hidden",
      }}
    >
      <div className="relative w-full h-[125px] bg-gradient-to-r from-[#872626] to-red-500 flex justify-center items-center">
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
      <div className="p-5 text-center">
        <h1 className="text-2xl font-extrabold text-[#D84545] mt-5 mb- font-bungee">
          {t("roles.confirmDeleteRole")}
        </h1>
        <p className="text-lg font-semibold mb-3">
          {t("roles.deleteConfirmation")} {role.nombre}?
        </p>
        <p className="text-sm font-extrabold text-red-500 mb-6">
          <b>{t("roles.deleteCannot")}</b>
        </p>
        <div className="mb-4">
        <p className="text-xl font-black text-red-500 mb-2">"{role.nombre}"</p>
          <p className="text-sm font-semibold mb-2">
            {t("roles.confirmR")}
          </p>
          <Input
            placeholder={t('deleteCourse.camp')}
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            className="w-full max-w-md mx-auto"
          />
        </div>
        <div className="flex justify-center space-x-4">
          <button
            className={`bg-[#FF4236] text-white font-bold text-lg rounded-2xl min-w-[133px] h-9 px-4 shadow-md transition-all duration-300 ${
              isConfirmDisabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-[#ff2f22]'
            }`}
            onClick={confirmDeleteRole}
            disabled={isConfirmDisabled}
          >
            {t("roles.confirm")}
          </button>
        </div>
      </div>
    </Modal>
  );
};


export default DeleteRolModal;
