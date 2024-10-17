import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Input } from "antd";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../context/auth.context";
import { useUserContext } from "../../../../context/user/user.context";
import { useForumTopic } from "../../../../context/forum/topic.context";

const UpdateForumTopicForm = ({ isVisible, onClose, visible, onUpdate, forumCategoryId, TopicData, fetchForumTopic }) => {
    const { getUserById } = useUserContext();
    const { user } = useAuth();
    const { t } = useTranslation("global");
    const [username, setUsername] = useState('');
    const { updateForumTopic, getForumTopicByCategoryId } = useForumTopic();
    const [title, setTitle] = useState('');
    const [Content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const MAX_TITLE_LENGTH = 30;


    useEffect(() => {
        const fetchUserData = async () => {
            if (user && user.data && user.data.id) {
                try {
                    const userData = await getUserById(user.data.id);
                    setUsername(userData.username); // Cambiado a 'username'
                } catch (error) {
                    console.error('Error al obtener datos del usuario:', error);
                }
            }
        };
        fetchUserData();
    }, [user, getUserById]);

    useEffect(() => {
        if (TopicData){
            // Actualizar el estado con los datos iniciales
            setTitle(TopicData.title || "");
            setContent(TopicData.Content || "");
        }
    }, [TopicData]);

    // Resetear el formulario después de crear el tema
    const resetForm = () => {
        setTitle(TopicData.title);
        setContent(TopicData.Content);
        setErrors({});
    };

    const validateFields = () => {
        const newErrors = {};
       
        if (!title || title.length < 3) {
            newErrors.title = t("updateTopic.validateTitle");
        } 

        if (!Content || Content.length < 8) {
            newErrors.Content = t("updateTopic.validateContent");
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!validateFields()) {
            return; // Si hay errores, no envía el formulario
        }

        setIsSubmitting(true); // Desactivar el botón de enviar mientras se procesa
        const updatedData = {
            title,
            Content,
            userId: user.data.id,
            forumCategoryId: Number(forumCategoryId)
        };
    
        try {
            await updateForumTopic(TopicData.id, updatedData); // Cambia a TopicData.id o el ID correcto del tema
            Swal.fire({
                icon: "success",
                title: t("updateTopic.updateAlert"),
                showConfirmButton: false,
                timer: 1000,
            }).then(() => {
                onUpdate(updatedData);
                resetForm();
                onClose(); // Cierra el modal después de la actualización exitosa
                fetchForumTopic();
            });
        } catch (error) {
            console.error("Error al actualizar un tema:", error);
        }finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            open={visible}
            footer={null}
            closable={false}
            centered
            onCancel={onClose}
            bodyStyle={{
                borderRadius: "20px",
                overflow: "hidden",
            }}
        >
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">{t("updateTopic.TitleModalCreate")}</h2>

                <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                        <Input 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder={t("updateTopic.topicTitle")}
                            required 
                        />
                        {errors.title && <p className="text-red-500">{errors.title}</p>}
                         <div className="text-gray-600 text-right mt-1">
                            {title.length}/{MAX_TITLE_LENGTH}
                        </div>
                    </div>
                    <div className="mb-4">
                        <Input.TextArea 
                            value={Content} 
                            onChange={(e) => setContent(e.target.value)} 
                            placeholder={t("updateTopic.topicContent")}
                            rows={4} 
                            required 
                        />
                        {errors.Content && <p className="text-red-500">{errors.Content}</p>}
                    </div>

                    <div className="flex justify-end">
                        <Button 
                            type="primary" 
                            htmlType="submit"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            className="bg-purple-800 text-white"
                        >
                            {t("updateTopic.update")}
                        </Button>
                        <Button 
                             onClick={() => {
                                resetForm();  // Llama a la función para resetear el formulario
                                onClose();    // También cierra el modal
                            }} 
                            className="ml-2"
                        >
                            {t("updateTopic.cancel")}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default UpdateForumTopicForm;