import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Input, message } from "antd";
import "react-toastify/dist/ReactToastify.css";
import { useCategoryContext } from "../../../context/courses/category.context";
import { useTranslation } from "react-i18next";

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

    if (!category.name || category.name.length < 8) {
      errors.name = t("createCategoryForm.nameTooShort");
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
      onclose();
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
    <>
      <Modal
        className="shadow-orange shadow-white border-2 border-black rounded-lg"
        centered
        visible={visible}
        footer={null}
        closable={false}
        onCancel={onClose}
        styles={{ mask: { backdropFilter: "blur(15px)" } }}
      >
        <form
          className="w-full p-4 bg-gradient-to-tr from-teal-400 to-blue-500 rounded-lg shadow-lg relative"
          onSubmit={handleSubmit}
        >
          <div>
            <h1 className="text-3xl font-bold text-center mb-4 text-white">
              {t("createCategoryForm.title")}
            </h1>
            <div className="mb-4">
              <label className="block text-black text-lg font-medium mb-2">
                {t("createCategoryForm.nameLabel")} <br />
                <Input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-teal-300"
                  type="text"
                  name="name"
                  value={category.name}
                  onChange={handleChange}
                  required
                />
                {errorMessage.name && (
                  <p className="text-red-500 text-sm">{errorMessage.name}</p>
                )}
              </label>
            </div>
            <div className="">
              <label className="block text-black text-lg font-medium mb-2">
                {t("createCategoryForm.descriptionLabel")} <br />
                <Input.TextArea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-teal-300"
                  name="description"
                  value={category.description}
                  onChange={handleChange}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  style={{ minHeight: "100px" }}
                  required
                />
                <div className="text-gray-300 text-right">
                  {category.description.length}/{MAX_DESCRIPTION_LENGTH}
                </div>
                {errorMessage.description && (
                  <p className="text-red-500 text-sm ">
                    {errorMessage.description}
                  </p>
                )}
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-black text-lg font-medium mb-2">
                {t("createCategoryForm.imageLabel")} <br />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-teal-300 hover:bg-red-100"
                  ref={imageRef}
                  required
                />
                {errorMessage.image && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorMessage.image}
                  </p>
                )}
              </label>
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
          </div>
          <div className="flex justify-center mt-6 space-x-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
              htmlType="submit"
            >
              {t("createCategoryForm.createButton")}
            </button>
            <button
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
              onClick={onClose}
            >
              {t("createCategoryForm.cancelButton")}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreateCategoryForm;
