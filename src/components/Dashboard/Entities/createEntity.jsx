import React, { useState, useRef, useEffect } from "react";
import { Modal } from "antd";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useEntity } from "../../../context/user/entities.context";
import holaImage from "../../../assets/img/hola.png";

const CreateEntityModal = ({visible, onClose, onCreate }) => {
    const {createEntity} = useEntity();
    const { t } = useTranslation("global");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const MAX_DESCRIPTION_LENGTH = 30;
    const MIN_COURSE_NAME_LENGTH = 3;
    const MAX_COURSE_NAME_LENGTH = 25;
    const MIN_DESCRIPTION_LENGTH = 6;

    const [entities, setEntities] = useState({
        name: "",
        type: "",
    });

    const [errorMessage, setErrorMessage] = useState({
        name: "",
        type: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEntities({ ...entities, [name]: value });
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
            case "type":
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
        e.preventDefaul();
        setIsSubmitting(true);

        const errors = {
            name: "",
            type: "",
        };

        if (!entities.name || entities.name.length < MIN_COURSE_NAME_LENGTH || entities.name.length > MAX_COURSE_NAME_LENGTH) {
            errors.name = t("createCourseForm.nameInvalidLength");
        }
        if (!entities.type || entities.type.length < MIN_DESCRIPTION_LENGTH) {
            errors.type = t("createCourseForm.descriptionTooShort");
        }

        if (Object.values(errors).some((error) => error)) {
            setErrorMessage(errors);
            setIsSubmitting(false); // Habilitar el botón nuevamente si hay errores
            vibrate();
            return;
        }

        const entitiesData = {
            name: entities.name,
            type: entities.type,
        };

        try {
            await createEntity(entitiesData);
            Swal.fire({
                icon: "success",
                title: t("Entidad creada exitosamente"),
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
                title: t("Error al crear entidad"),
                timer: 3000,
                showConfirmButton: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setEntities({
            name: "",
            type: "",
        });
        setErrorMessage({
            name: "",
            type: "",
        });
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
                    {t("Crear Entidad")}
                </h1>
                <div className="text-left mb-4">
                    <label className="text-lg font-bold text-[#000000] block">
                        {t("createCourseForm.name")}
                    </label>
                    <input
                        className="w-full py-2 px-4 border border-gray-300 rounded-lg mt-2 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        type="text"
                        name="name"
                        value={entities.name}
                        onChange={handleChange}
                        maxLength={MAX_COURSE_NAME_LENGTH}
                        required
                    />
                    <div className="text-gray-500 text-sm">{`${entities.name.length}/${MAX_COURSE_NAME_LENGTH}`}</div>
                    {errorMessage.name && (
                        <p className="text-red-500 text-sm mt-1">{errorMessage.name}</p>
                    )}
                </div>
                <div className="text-left mb-4">
                    <label className="text-lg font-bold text-[#000000] block">
                        {t("Type")}
                    </label>
                    <textarea
                        className="w-full py-2 px-4 border border-gray-300 rounded-lg mt-2 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                        name="type"
                        value={entities.type}
                        onChange={handleChange}
                        maxLength={MAX_DESCRIPTION_LENGTH}
                        style={{ minHeight: "80px" }}
                        required
                    />
                    <div className="text-gray-500 text-sm">{`${entities.type.length}/${MAX_DESCRIPTION_LENGTH}`}</div>
                    {errorMessage.type && (
                        <p className="text-red-500 text-sm mt-1">{errorMessage.type}</p>
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

export default CreateEntityModal;