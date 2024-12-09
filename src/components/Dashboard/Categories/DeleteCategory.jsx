import React, { useState } from "react";
import { Modal, Spin } from "antd";
import { useTranslation } from "react-i18next";
import pulpoImage from "../../../assets/img/pulpo.png";
import "../css/Custom.css";
import { useCategoryContext } from "../../../context/courses/category.context";

const DeleteCategory = ({ visible, onClose, onConfirm, onConfirmOnly }) => {
  const { t } = useTranslation("global");
  const [loading, setLoading] = useState(false);
  const { getCategories } = useCategoryContext();
  const [categories, setCategories] = useState();

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error("Error al obtener todas las categorias:", err);
      toast.error("Error al obtener todas las categorias");
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error confirming deletion:", error);
    } finally {
      setLoading(false);
      onClose();
      fetchCategories();
    }
  };

  const handleConfirmOnly = async () => {
    setLoading(true);
    try {
      await onConfirmOnly();
    } catch (error) {
      console.error("Error confirming deletion:", error);
    } finally {
      setLoading(false);
      onClose();
      fetchCategories();
    }
  };

  return (
    <Modal
      className="custom-modal rounded-2xl"
      centered
      closable={false}
      visible={visible}
      onCancel={onClose}
      footer={null}
      bodyStyle={{
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      <div className="absolute top-5 right-8 cursor-pointer" onClick={onClose}>
        <span className="text-white text-2xl font-bold">X</span>
      </div>

      <div className="h-[125px] bg-gradient-to-r from-[#872626] to-red-500 flex justify-center items-center">
        <img src={pulpoImage} alt="Pulpo" className="w-[162px] h-[148px] mt-6 object-contain" />
      </div>

      <div className="p-5 text-center">
        <h1 className="text-2xl font-extrabold text-[#D84545] mt-5 mb-4">
          {t("deleteCategory.confirmDeletion")}
        </h1>
        <p className="text-lg font-semibold mb-3">
          {t("deleteCategory.confirmMessage")}
        </p>
        <p className="text-sm font-extrabold text-red-500 mb-6">
          {t("deleteCategory.warningMessage")}
        </p>

        <div className="flex flex-col sm:flex-row justify-center space-x-0 sm:space-x-4 mt-6">
          <button
            className={`bg-[#FF4236] text-white font-bold text-lg rounded-2xl min-w-[133px] h-9 px-4 shadow-md hover:bg-[#ff2f22] transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""} mb-4 sm:mb-0`}
            onClick={handleConfirm}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? <Spin size="small" /> : t("deleteCategory.confirmButton")}
          </button>
          <button
            className={`bg-[#FF4236] text-white font-bold text-lg rounded-2xl min-w-[133px] h-9 px-4 shadow-md hover:bg-[#ff2f22] transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""} mb-4 sm:mb-0`}
            onClick={handleConfirmOnly}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? <Spin size="small" /> : t("deleteCategory.onlyButton")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteCategory;
