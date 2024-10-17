import React, { useState, useRef, useEffect } from "react";
import { Modal, Input, message } from "antd";
import { useForumCategories } from "../../../context/forum/forumCategories.context";
import { useTranslation } from "react-i18next";
import holaImage from "../../../assets/img/hola.png";

const createForumCategoriesModal = ({ visible, onClose, onCreate }) => {
    const { t } = useTranslation("global");
    const { createForumCategories, categories } = useForumCategories();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const MAX_DESCRIPTION_LENGTH = 100;


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
        setIsSubmitting(true); // Deshabilitar el botón

        const errors = {
            name: "",
            description: "",
            image: "",
        };

        if (!validateField()) {
            return; // Si hay errores, no envía el formulario
        }
    };
};

export default createForumCategoriesModal;