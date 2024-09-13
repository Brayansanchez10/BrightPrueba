import React, { useState } from "react";
import { Modal } from "antd";
import { useRoleContext } from "../../../context/user/role.context";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';

const CreateRolForm = ({ visible, onClose }) => {
  const { createRole, rolesData } = useRoleContext();
  const { t } = useTranslation("global");
  const [role, setRole] = useState({ nombre: "" });
  const [error, setError] = useState({
    nombre: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRole({ ...role, [name]: value.trim() });
    validateField(name, value.trim());
  };

  const validateField = (name, value) => {
    switch (name) {
      case "nombre":
        if (value.length < 3) {
          setError((prev) => ({ ...prev, nombre: t("createRoleForm.mixRole") }));
        } else if (value.length > 15) {
          setError((prev) => ({ ...prev, nombre: t("createRoleForm.maxRole") }));
        } else {
          setError((prev) => ({ ...prev, nombre: "" }));
        }
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {
      nombre: "",
    };

    if (!role.nombre || role.nombre.length < 3 || role.nombre.length > 10) {
      errors.nombre = t("createRoleForm.mixRole");
    }

    if (rolesData.some((existingRole) => existingRole.nombre === role.nombre)) {
      errors.nombre = t("createRoleForm.maxRole");
    }

    if (Object.values(errors).some((error) => error)) {
      setError(errors);
      return;
    }

    try {
      
      if (rolesData.some((existingRole) => existingRole.nombre === role.nombre)) {
        Swal.fire({
          icon: "error",
          title: t("createRoleForm.roleExists"),
          confirmButtonText: "OK",
        });
        return;
      }
      // Crear el nuevo rol
      await createRole(role);

      Swal.fire({
        icon: "success",
        title: t('createRoleForm.roleCreated'),
        showConfirmButton: false,
        timer: 1500, // Duración del mensaje
        onClose: handleModalClose(),
      });
      setRole({ nombre: "" });
    } catch (error) {
      console.error("Error creating role:", error);
    }
  };

  const handleModalClose = () => {
    setRole({ nombre: "" });
    setError({ nombre: "" });
    onClose();
  };

  return (
    <Modal
      className="shadow-orange shadow-white border-2 border-black rounded-lg"
      centered
      visible={visible}
      footer={null}
      closable={false}
      maskStyle={{ backdropFilter: "blur(10px)" }}
    >
      <div className="bg-gradient-to-tr from-teal-400 to-blue-500 shadow-lg rounded-lg p-6 ">
        <div className="">
          <h1 className="text-2xl text-center font-bold text-bold text-white">
            {t('createRoleForm.title')}
          </h1>
        </div>
        <div className="mt-4">
          <label className="text-base font-semibold ml-2 ">{t('createRoleForm.nameLabel')}:</label>
          <input
            name="nombre"
            value={role.nombre}
            onChange={handleChange}
            className="w-full py-2 border border-black focus-visible:ring rounded-md mt-2"
            required
          />
          {error.nombre && (
            <p className="text-red-500 text-sm mt-1">{error.nombre}</p>
          )}
        </div>
        <div className="flex justify-center mt-4 space-x-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
            onClick={handleSubmit}
          >
            {t('createRoleForm.createButton')}
          </button>
          <button
            type="button"
            onClick={handleModalClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            {t('createRoleForm.closeButton')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateRolForm;
