import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { useEntity } from "../../../context/user/entities.context";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import "../css/Custom.css";
import holaImage from "../../../assets/img/hola.png";

const CreateEntityModal = ({ visible, onClose, isVisible }) => {
  const { createEntity, entity, getEntity } = useEntity();
  const { t } = useTranslation("global");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newEntity, setNewEntity] = useState({ name: "", type: "" });
  const [error, setError] = useState({
    name: "",
    type: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEntity({ ...newEntity, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (value.length < 3) {  
          setError((prev) => ({ ...prev, name: t("createEntityForm.minName") }));
        } else if (value.length > 30) {  
          setError((prev) => ({ ...prev, name: t("createEntityForm.maxName") }));
        } else {
          setError((prev) => ({ ...prev, name: "" }));
        }
        break;
      case "type":
        if (!value) {
          setError((prev) => ({ ...prev, type: t("createEntityForm.typeRequired") }));
        } else {
          setError((prev) => ({ ...prev, type: "" }));
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchEntities();
    } else {
      setNewEntity({ name: "", type: "" });
    }
  }, [isVisible]);

  const fetchEntities = async () => {
    try {
      await getEntity();
    } catch (err) {
      console.error("Error al obtener todas las entidades:", err);
      Swal.fire({
        icon: "error",
        title: t("Error al obtener todas las entidades"),
        timer: 3000,
        showConfirmButton: false,
      });
    } 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const errors = {
      name: "",
      type: "",
    };

    if (!newEntity.name || newEntity.name.length < 3 || newEntity.name.length > 30) {
      errors.name = t("createEntityForm.nameInvalid");
    }
    if (!newEntity.type) {
      errors.type = t("createEntityForm.typeRequired");
    }

    if (entity.some((existingEntity) => existingEntity.name === newEntity.name)) {
      errors.name = t("createEntityForm.entityExists");
    }

    if (Object.values(errors).some((error) => error)) {
      setError(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      await createEntity(newEntity);

      Swal.fire({
        icon: "success",
        title: t('createEntityForm.createSuccess'),
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        handleModalClose();
        setIsSubmitting(false);
      })
      fetchEntities();
    } catch (error) {
      console.error("Error creating entity:", error);
      setIsSubmitting(false);
      Swal.fire({
        icon: "error",
        title: t("Error al crear la entidad"),
        text: error.message,
        timer: 3000,
        showConfirmButton: true,
      });
    }
  };

  const handleModalClose = () => {
    setNewEntity({ name: "", type: "" });
    setError({ name: "", type: "" });
    onClose();
  };

  return (
    <Modal
      className="custom-modal"
      centered
      open={visible}
      footer={null}
      closable={false}
      onCancel={handleModalClose}
      styles={{
        body: {
          borderRadius: "20px",
          overflow: "hidden",
        },
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
      <form onSubmit={handleSubmit} className="p-5 text-center">
        <h1 className="text-2xl font-extrabold text-[#18116A] mt-5 mb-4 font-bungee">
          {t('createEntityForm.title')}
        </h1>
        <div className="mt-4 text-left"> 
          <label className="text-lg font-bold text-[#000000] block">{t('createEntityForm.nameLabel')}</label>
          <input
            name="name"
            value={newEntity.name}
            onChange={handleChange}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg mt-2 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder={t('createEntityForm.namePlaceholder')}
            maxLength={30}
            required
          />
          {error.name && (
            <p className="text-red-500 text-sm mt-1">{error.name}</p>
          )}
        </div>

        <div className="mt-4 text-left">
          <label className="text-lg font-bold text-[#000000] block">{t('createEntityForm.typeLabel')}</label>
          <select
            name="type"
            value={newEntity.type}
            onChange={handleChange}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg mt-2 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            required
          >
            <option value="">{t('createEntityForm.selectType')}</option>
            <option value="Empresa">{t('createEntityForm.company')}</option>
            <option value="Persona">{t('createEntityForm.person')}</option>
          </select>
          {error.type && (
            <p className="text-red-500 text-sm mt-1">{error.type}</p>
          )}
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#18116A] text-white font-bold text-lg rounded-2xl min-w-[133px] h-9 px-4 shadow-md hover:bg-[#140e5b] transition-all duration-300"
          >
            {t('createEntityForm.createButton')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateEntityModal;