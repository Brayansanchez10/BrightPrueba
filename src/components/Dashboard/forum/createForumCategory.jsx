import React, { useState, useRef, useEffect } from "react";
import { Modal } from "antd";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useForumCategories } from "../../../context/forum/forumCategories.context";
import holaImage from "../../../assets/img/hola.png";

import { useAuth } from "../../../context/auth.context";
import { useUserContext } from "../../../context/user/user.context";

const CreateForumCategoriesModal = ({ visible, onClose, onCreate }) => {
    const { createForumCategories } = useForumCategories();
    const { t } = useTranslation("global");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const [username, setUsername] = useState("");
    const { getUserById } = useUserContext();
    const [entityId, setEntityId] = useState(null);

    const MAX_DESCRIPTION_LENGTH = 150;
    const MIN_COURSE_NAME_LENGTH = 3;
    const MAX_COURSE_NAME_LENGTH = 30;
    const MIN_DESCRIPTION_LENGTH = 30;

    const [categories, setCategories] = useState({
        name: "",
        description: "",
        image: null,
    });

    const [errorMessage, setErrorMessage] = useState({
        name: "",
        description: "",
        image: "",
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (user && user.data && user.data.id) {
                try {
                    const userData = await getUserById(user.data.id);
                    setUsername(userData);
                    // Guarda el entityId del usuario
                    setEntityId(userData.entityId); // Asegúrate de tener este estado definido
                } catch (error) {
                    console.error('Error al obtener datos del usuario:', error);
                }
            }
        };
        fetchUserData();
    }, [user, getUserById]);


    const imageRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategories({ ...categories, [name]: value });
        validateField(name, value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setCategories({ ...categories, image: file, imagePreview: URL.createObjectURL(file) });
            setErrorMessage((prev) => ({ ...prev, image: "" }));
        } else {
            e.target.value = null;
            setErrorMessage((prev) => ({ ...prev, image: t("createCourseForm.invalidImageFile") }));
        }
    };

    const validateField = (name, value) => {
        switch (name) {
            case "name":
                if (value.length < MIN_COURSE_NAME_LENGTH || value.length > MAX_COURSE_NAME_LENGTH) {
                    setErrorMessage((prev) => ({ ...prev, name: t("createCourseForm.nameInvalidLength") }));
                } else {
                    setErrorMessage((prev) => ({ ...prev, name: "" }));
                }
                break;
            case "description":
                if (value.length < MIN_DESCRIPTION_LENGTH) {
                    setErrorMessage((prev) => ({ ...prev, description: t("createCourseForm.descriptionTooShort") }));
                } else {
                    setErrorMessage((prev) => ({ ...prev, description: "" }));
                }
                break;
            default:
                break;
        }
    };

    const vibrate = () => {
        if (navigator.vibrate) {
            navigator.vibrate(200); // Vibrar durante 200 ms
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Iniciar el envío

        const errors = {
            name: "",
            category: "",
            description: "",
            image: "",
        };

        if (!categories.name || categories.name.length < MIN_COURSE_NAME_LENGTH || categories.name.length > MAX_COURSE_NAME_LENGTH) {
            errors.name = t("createCourseForm.nameInvalidLength");
        }
        if (!categories.description || categories.description.length < MIN_DESCRIPTION_LENGTH) {
            errors.description = t("createCourseForm.descriptionTooShort");
        }
        if (!categories.image) {
            errors.image = t("createCourseForm.allFieldsRequired");
        }

        if (Object.values(errors).some((error) => error)) {
            setErrorMessage(errors);
            setIsSubmitting(false); // Habilitar el botón nuevamente si hay errores
            vibrate();
            return;
        }

        const categoriesData = {
            name: categories.name,
            description: categories.description,
            image: categories.image,
            entityId: username.entityId,
        };

        try {
            await createForumCategories(categoriesData);
            Swal.fire({
                icon: "success",
                title: t("createCourseForm.createSuccess"),
                timer: 1000,
                showConfirmButton: false,
            }).then(() => {
                onCreate(categoriesData);
                resetForm();
                onClose();
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: t("createCourseForm.createFailure"),
                timer: 3000,
                showConfirmButton: true,
            });
        } finally {
            setIsSubmitting(false); // Siempre habilitar el botón al final
        }
    };

    const resetForm = () => {
        setCategories({
            name: "",
            description: "",
            image: null,
            imagePreview: null,
        });
        setErrorMessage({
            name: "",
            description: "",
            image: "",
        });
        if (imageRef.current) {
            imageRef.current.value = null;
        }
    };

    return (
        <Modal
            open={visible}
            footer={null}
            closable={false}
            className="custom"
            centered
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
            <form onSubmit={handleSubmit} className="p-5 text-center">
                <h1 className="text-2xl font-extrabold text-[#18116A] mt-5 mb-4 font-bungee">
                    {t("createCourseForm.title")}
                </h1>
                <div className="text-left mb-4">
                    <label className="text-lg font-bold text-[#000000] block">
                        {t("createCourseForm.name")}
                    </label>
                    <input
                        className="w-full py-2 px-4 border border-gray-300 rounded-lg mt-2 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        type="text"
                        name="name"
                        value={categories.name}
                        onChange={handleChange}
                        maxLength={MAX_COURSE_NAME_LENGTH}
                        required
                    />
                    <div className="text-gray-500 text-sm">{`${categories.name.length}/${MAX_COURSE_NAME_LENGTH}`}</div>
                    {errorMessage.name && (
                        <p className="text-red-500 text-sm mt-1">{errorMessage.name}</p>
                    )}
                </div>
                <div className="text-left mb-4">
                    <label className="text-lg font-bold text-[#000000] block">
                        {t("createCourseForm.description")}
                    </label>
                    <textarea
                        className="w-full py-2 px-4 border border-gray-300 rounded-lg mt-2 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                        name="description"
                        value={categories.description}
                        onChange={handleChange}
                        maxLength={MAX_DESCRIPTION_LENGTH}
                        style={{ minHeight: "80px" }}
                        required
                    />
                    <div className="text-gray-500 text-sm">{`${categories.description.length}/${MAX_DESCRIPTION_LENGTH}`}</div>
                    {errorMessage.description && (
                        <p className="text-red-500 text-sm mt-1">{errorMessage.description}</p>
                    )}
                </div>
                <div className="text-left mb-4">
                    <label className="text-lg font-bold text-[#000000] block">
                        {t("createCourseForm.image")}
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={imageRef}
                        className="mt-2"
                    />
                    {categories.imagePreview && (
                        <img src={categories.imagePreview} alt="Imagen previa" className="mt-2 w-32 h-32 object-cover" />
                    )}
                    {errorMessage.image && (
                        <p className="text-red-500 text-sm mt-1">{errorMessage.image}</p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 bg-[#18116A] text-white font-bold rounded-lg shadow-md hover:bg-blue-500 transition duration-200"
                >
                    {t("createCourseForm.createButton")}
                </button>
            </form>
        </Modal>
    );
};

export default CreateForumCategoriesModal;
