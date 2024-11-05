import React, { useState, useRef, useEffect } from "react";
import { Modal } from "antd";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useForumCategories } from "../../../context/forum/forumCategories.context";
import holaImage from "../../../assets/img/hola.png";

import { useAuth } from "../../../context/auth.context";
import { useUserContext } from "../../../context/user/user.context";
import IconSelector from "./IconSelector";

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
        icons: "",
    });

    const [errorMessage, setErrorMessage] = useState({
        name: "",
        description: "",
        icons: "",
    });

    const [selectedIcon, setSelectedIcon] = useState(null);


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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategories({ ...categories, [name]: value });
        validateField(name, value);
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

    const handleIconSelect = (icon) => {
        setSelectedIcon(icon); // Actualiza solo el icono seleccionado
        setErrorMessage((prev) => ({ ...prev, icons: "" })); // Limpia el mensaje de error
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Iniciar el envío

        const errors = {
            name: "",
            description: "",
            icons: "",
        };

        if (!categories.name || categories.name.length < MIN_COURSE_NAME_LENGTH || categories.name.length > MAX_COURSE_NAME_LENGTH) {
            errors.name = t("createCourseForm.nameInvalidLength");
        }
        if (!categories.description || categories.description.length < MIN_DESCRIPTION_LENGTH) {
            errors.description = t("createCourseForm.descriptionTooShort");
        }
        if (!selectedIcon) { // Valida si hay un icono seleccionado
            errors.icons = t("seleccione un icono");
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
            icons: selectedIcon,
            entityId: username.entityId,
        };

        try {
            await createForumCategories(categoriesData);
            Swal.fire({
                icon: "success",
                title: t("forumCategory.AlertCreate"),
                timer: 1000,
                showConfirmButton: false,
            }).then(() => {
                onCreate(categoriesData);
                resetForm();
                setSelectedIcon(null);
                onClose();
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: t("forumCategory.AertErrorCreate"),
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
            icons: "",
        });
        setErrorMessage({
            name: "",
            description: "",
            icons: "",
        });
    };

    return (
        <Modal
            open={visible}
            footer={null}
            closable={false}
            className="custom-modal"
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
                    {t("forumCategory.modalCreate")}
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
                        {t("Icons")}
                    </label>
                    <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg mb-2">
                        <IconSelector onSelectIcon={handleIconSelect} selectedIcon={selectedIcon} />
                    </div>
                    {errorMessage.icons && (
                        <p className="text-red-500 text-sm mt-1">{errorMessage.icons}</p>
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
