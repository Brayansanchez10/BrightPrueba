import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, notification } from "antd";
import { updateSubCategory } from "../../../api/courses/subCategory.requst";
import Swal from "sweetalert2"; //Importamos SweetAlert
import { useTranslation } from "react-i18next";

const UpdateSubCategoryForm = ({ isVisible, onCancel, subCategoryData, onUpdate, }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const { t } = useTranslation("global");
    const [errors, setErrors] = useState({});
    const MAX_DESCRIPTION_LENGTH = 150;

    useEffect(() => {
        if (subCategoryData){
            // Actualizar el estado con los datos iniciales
            setTitle(subCategoryData.title || "");
            setDescription(subCategoryData.description || "");
        }
    }, [subCategoryData]);

    const validateFields = () => {
        const newErrors = {};

        // Validación del título (mínimo 3 caracteres y máximo 30 caracteres)
        if (!title || title.length < 3) {
          newErrors.title = t("UpdateResource.ValidateTitle");
        } else if (title.length > 30) {
          newErrors.title = t("subCategory.titleTooShort"); // Nuevo mensaje para límite de caracteres
        }

        // Validación de la descripción (mínimo 8 caracteres)
        if (!description || description.length < 8) {
            newErrors.description = t("UpdateResource.ValidateDescription");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // Usar useRef para guardar el estado inicial del recurso
    const initialsubCategoryDataRef = useRef();

    const handleUpdate = async (e) => {
      e.preventDefault();
    
      if (!validateFields()) {
        return; // Si hay errores, no envía el formulario
      }
    
      const updatedData = {
        title,
        description,
        courseId: subCategoryData.courseId, // Asegúrate de incluir el courseId
      };
    
      try {
        await updateSubCategory(subCategoryData.id, updatedData);
        Swal.fire({
          icon: "success",
          title: t("subCategory.UpdateAlert"),
          showConfirmButton: false,
          timer: 1000,
        });
        onUpdate(); // Ejecutar la función que actualiza la lista
        onCancel(); // Cierra el modal después de la actualización exitosa
      } catch (error) {
        console.error("Error al actualizar el recurso:", error);
    
        // Verificar si el error es debido a un título duplicado
        if (error.response && error.response.data && error.response.data.error === "Ya existe una subcategoría con este nombre para este curso.") {
          Swal.fire({
            icon: "error",
            title: t("subCategory.AlertDuplicate"),
            showConfirmButton: true,
            timer: 3000,
          });
        } else {
          console.error(error);
        }
      }
    };
    const handleCancel = () => {
        if (initialsubCategoryDataRef.current) {
            setTitle(initialsubCategoryDataRef.current.title);
            setDescription(initialsubCategoryDataRef.current.description);
        }

        onCancel();
    };


    return (
        <Modal
          title={
            <h2 className="text-2xl font-semibold text-gray-800">
              {t("subCategory.ModalUpdateTitle")}
            </h2>
          }
          visible={isVisible}
          onCancel={handleCancel}
          footer={null}
          width={800}
          centered
          zIndex={1000}
          className="p-6 max-h-[70vh] overflow-y-auto rounded-lg shadow-lg bg-white"
          bodyStyle={{
            padding: "20px",
            borderRadius: "10px",
            background: "linear-gradient(to bottom, #f0f4f8, #fff)",
          }}
          closeIcon={
            <span className="text-gray-600 hover:text-gray-800 cursor-pointer">
              &#x2715; {/* Icono de cierre personalizado */}
            </span>
          }
        >
          <form onSubmit={handleUpdate} className="space-y-8">
            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                {t("subCategory.UpdateTitle")}
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={30}
                required
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 placeholder-gray-400"
                placeholder={t("subCategory.EnterTitle")}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
      
            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                {t("subCategory.UpdateDescription")}
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={MAX_DESCRIPTION_LENGTH}
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 placeholder-gray-400"
                placeholder={t("subCategory.EnterDescription")}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
              <div className="text-gray-600 text-right mt-1">
                {description.length}/{MAX_DESCRIPTION_LENGTH}
              </div>
            </div>
      
            {/* Botones */}
            <div className="flex justify-end gap-4">
              <Button onClick={handleCancel} className="bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-200 rounded-lg shadow-md">
                {t("subCategory.ButtonCancel")}
              </Button>
              <Button type="primary" htmlType="submit" className="bg-blue-500 text-white hover:bg-blue-600 transition duration-200 rounded-lg shadow-md">
                {t("subCategory.ButtonUpdate")}
              </Button>
            </div>
          </form>
        </Modal>
      );
      
};

export default UpdateSubCategoryForm;