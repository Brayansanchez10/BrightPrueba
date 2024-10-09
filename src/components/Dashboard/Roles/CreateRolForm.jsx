import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { useRoleContext } from "../../../context/user/role.context";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import "../css/Custom.css";
import holaImage from "../../../assets/img/hola.png";

const CreateRolForm = ({ visible, onClose, isVisible }) => {
  const { createRole, rolesData, getAllRoles } = useRoleContext();
  const { t } = useTranslation("global");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        if (value.length < 4) {  
          setError((prev) => ({ ...prev, nombre: t("createRoleForm.mixRole") }));
        } else if (value.length > 10) {  
          setError((prev) => ({ ...prev, nombre: t("createRoleForm.maxRole") }));
        } else {
          setError((prev) => ({ ...prev, nombre: "" }));
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchRoles();
    } else {
      setRole([]); // Limpiar los recursos al cerrar la modal
    }
  }, [isVisible]);

  const fetchRoles = async () => {
    try {
      const response = await getAllRoles();
      setRole(response.data);
    } catch (err) {
      console.error("Error al obtener todas los roles:", err);
      toast.error("Error al obtener todas los roles");
    } 
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Deshabilitar el botón

    const errors = {
      nombre: "",
    };

    if (!role.nombre || role.nombre.length < 4 || role.nombre.length > 10) {
      errors.nombre = t("createRoleForm.minMaxRole"); 
    }

    if (rolesData.some((existingRole) => existingRole.nombre === role.nombre)) {
      errors.nombre = t("createRoleForm.roleExists");
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
      await createRole(role);

      Swal.fire({
        icon: "success",
        title: t('createRoleForm.roleCreated'),
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        handleModalClose();
        setIsSubmitting(false); // Habilitar nuevamente al cerrar modal
      })
      fetchRoles();
    } catch (error) {
      console.error("Error creating role:", error);
      setIsSubmitting(false); // Habilitar nuevamente si hay un error
    }
  };

  const handleModalClose = () => {
    setRole({ nombre: "" });
    setError({ nombre: "" });
    onClose();
  };

  return (
    <Modal
      className="custom"
      centered
      visible={visible}
      footer={null}
      closable={false}
      onCancel={handleModalClose}
      bodyStyle={{
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      <div className="absolute top-5 right-8 cursor-pointer" onClick={handleModalClose}>
        <span className="text-white text-2xl font-bold">X</span>
      </div>
      <div className="h-[115px] bg-gradient-to-r from-[#18116A] to-blue-500 flex justify-center items-center">
        <img src={holaImage}
        alt="Logo" 
        className="w-[200px] h-[200px] mt-12 object-contain" />
      </div>
      <div className="p-5 text-center">
        <h1 className="text-2xl font-extrabold text-[#18116A] mt-5 mb-4 font-bungee">
          {t('createRoleForm.title')}
        </h1>
        <div className="mt-4 text-left"> 
        <label className="text-lg font-bold text-[#000000] block">{t('createRoleForm.nameLabel')}</label>
        <input
          name="nombre"
          value={role.nombre}
          onChange={handleChange}
          className="w-full py-2 px-4 border border-gray-300 rounded-lg mt-2 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          placeholder={t('createRoleForm.namePlaceholder')}
          required
        />
        {error.nombre && (
          <p className="text-red-500 text-sm mt-1">{error.nombre}</p>
        )}
      </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            type="submit"
            disabled={isSubmitting} // Desactivar el botón si está en proceso
            className="bg-[#18116A] text-white font-bold text-lg rounded-2xl min-w-[133px] h-9 px-4 shadow-md hover:bg-[#140e5b] transition-all duration-300"
            onClick={handleSubmit}
          >
            {t('createRoleForm.createButton')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateRolForm;
