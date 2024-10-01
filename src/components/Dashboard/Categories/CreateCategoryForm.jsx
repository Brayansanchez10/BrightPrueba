import React, { useState, useRef, useEffect } from "react";
import { Modal, Input, message } from "antd";
import { useCategoryContext } from "../../../context/courses/category.context";
import { useTranslation } from "react-i18next";
import holaImage from "../../../assets/img/hola.png";

const CreateCategoryForm = ({ visible, onClose, onCreate }) => {
  const { t } = useTranslation("global");
  const { createCategory } = useCategoryContext();

  const [category, setCategory] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState({
    name: "",
    description: "",
    image: "",
  });
  const MAX_DESCRIPTION_LENGTH = 100;

  const imageRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value) {
          setErrorMessage((prev) => ({ ...prev, name: t("createCategoryForm.nameRequired") }));
        } else if (value.length < 3) { 
          setErrorMessage((prev) => ({ ...prev, name: t("createCategoryForm.nameTooShort") }));
        } else if (value.length > 20) { 
          setErrorMessage((prev) => ({ ...prev, name: t("createCategoryForm.nameTooLong") }));
        } else {
          setErrorMessage((prev) => ({ ...prev, name: "" }));
        }
        break;
      case "description":
        if (!value) {
          setErrorMessage((prev) => ({ ...prev, description: t("createCategoryForm.descriptionRequired") }));
        } else if (value.length < 30) {
          setErrorMessage((prev) => ({ ...prev, description: t("createCategoryForm.descriptionTooShort") }));
        } else {
          setErrorMessage((prev) => ({ ...prev, description: "" }));
        }
        break;
      default:
        break;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setCategory({ ...category, image: file });
      setImagePreview(URL.createObjectURL(file));
      setErrorMessage((prev) => ({ ...prev, image: "" }));
    } else {
      e.target.value = null;
      setImagePreview(null);
      setErrorMessage((prev) => ({
        ...prev,
        image: t("createCategoryForm.invalidImageFile"),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {
      name: "",
      description: "",
      image: "",
    };

    if (!category.name || category.name.length < 3 || category.name.length > 20) {
      errors.name = category.name.length < 3
        ? t("createCategoryForm.nameTooShort")
        : t("createCategoryForm.nameTooLong");
    }
    if (!category.description || category.description.length < 30) {
      errors.description = t("createCategoryForm.descriptionTooShort");
    }
    if (!category.image) {
      errors.image = t("createCategoryForm.imageRequired");
    }

    if (Object.values(errors).some((error) => error)) {
      setErrorMessage(errors);
      return;
    }

    try {
      await createCategory(category);
      onCreate(category);
      onClose();
    } catch (error) {
      console.error(error);
      message.error(t("createCategoryForm.createFailure"));
      onClose();
    }
  };

  const resetForm = () => {
    setCategory({ name: "", description: "", image: null });
    setImagePreview(null);
    setErrorMessage({ name: "", description: "", image: "" });
    if (imageRef.current) {
      imageRef.current.value = null;
    }
  };

  useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible]);

  return (
    <Modal
      className="custom"
      centered
      visible={visible}
      footer={null}
      closable={false}
      onCancel={onClose}
      bodyStyle={{
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      <div className="absolute top-5 right-8 cursor-pointer" onClick={onClose}>
        <span className="text-white text-2xl font-bold">X</span>
      </div>
      <div className="h-[115px] bg-gradient-to-r from-[#18116A] to-blue-500 flex justify-center items-center">
        <img src={holaImage} alt="Logo" className="w-[200px] h-[200px] mt-12 object-contain" />
      </div>
      <form
        className="p-5 text-center"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-extrabold text-[#18116A] mt-5 mb-4 font-bungee">
          {t("createCategoryForm.title")}
        </h1>
        <div className="text-left">
          <label className="text-lg font-bold text-[#000000] block">
            {t("createCategoryForm.nameLabel")}
          </label>
          <Input
            className="w-full py-2 px-4 border border-gray-300 rounded-lg mt-2 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            type="text"
            name="name"
            value={category.name}
            onChange={handleChange}
            required
          />
          {errorMessage.name && (
            <p className="text-red-500 text-sm mt-1">{errorMessage.name}</p>
          )}
        </div>
        <div className="mt-4 text-left">
          <label className="text-lg font-bold text-[#000000] block">
            {t("createCategoryForm.descriptionLabel")}
          </label>
          <Input.TextArea
            className="w-full py-2 px-4 border border-gray-300 rounded-lg mt-2 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            name="description"
            value={category.description}
            onChange={handleChange}
            maxLength={MAX_DESCRIPTION_LENGTH}
            style={{ minHeight: "60px" }} 
            required
          />
          <div className="text-gray-300 text-right">
            {category.description.length}/{MAX_DESCRIPTION_LENGTH}
          </div>
          {errorMessage.description && (
            <p className="text-red-500 text-sm mt-1">{errorMessage.description}</p>
          )}
        </div>
        <div className="mt-4 text-left">
          <label className="text-lg font-bold text-[#000000] block">
            {t("createCategoryForm.imageLabel")}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg mt-2 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            ref={imageRef}
            required
          />
          {errorMessage.image && (
            <p className="text-red-500 text-sm mt-1">{errorMessage.image}</p>
          )}
          {imagePreview && (
            <div className="mt-2 flex justify-center">
              <img
                src={imagePreview}
                alt="preview"
                className="rounded-lg"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </div>
          )}
        </div>
        <div className="flex justify-center space-x-4 mt-6">
          <button
            type="submit"
            className="bg-[#18116A] text-white font-bold text-lg rounded-2xl min-w-[133px] h-9 px-4 shadow-md hover:bg-[#140e5b] transition-all duration-300"
          >
            {t("createCategoryForm.createButton")}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateCategoryForm;
