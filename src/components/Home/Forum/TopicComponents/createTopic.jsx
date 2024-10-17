import React, { useState, useEffect } from "react";
import { Modal, Input, Button } from "antd";
import Swal from "sweetalert2";
import { useUserContext } from "../../../../context/user/user.context";
import { useForumTopic } from "../../../../context/forum/topic.context";
import { useAuth } from "../../../../context/auth.context";
import { useTranslation } from "react-i18next";

const CreateTopicForm = ({ visible, onClose, onCreate, forumCategoryId, fetchForumTopic }) => {
    const { getUserById } = useUserContext();
    const { user } = useAuth();
    const { createForumTopic } = useForumTopic(); // Función para crear tema en el contexto
    const { t } = useTranslation("global");
    const [username, setUsername] = useState('');
    const [title, setTitle] = useState('');
    const [Content, setContent] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    // Resetear el formulario después de crear el tema
    const resetForm = () => {
        setTitle('');
        setContent('');
        setErrors({});
    };

    const validateFields = () => {
        const newErrors = {};
       
        if (!title || title.length < 3) {
            newErrors.title = t("createTopic.validateTitle");
        } 

        if (!Content || Content.length < 8) {
            newErrors.Content = t("createTopic.validateContent");
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateFields()) {
            return; // Si hay errores, no envía el formulario
        }

        setIsSubmitting(true); // Desactivar el botón de enviar mientras se procesa
        const topicData = {
            title,
            Content,
            userId: user.data.id,
            forumCategoryId: Number(forumCategoryId)
        };

        try {
            await createForumTopic(topicData); // Llama al contexto para crear el tema
            Swal.fire({
                icon: 'success',
                title: t("createTopic.topicCreateAlert"),
                timer: 1000,
                showConfirmButton: false,
            }).then(() => {
                onCreate(topicData); // Ejecutar función callback después de crear
                resetForm();
                onClose();
                fetchForumTopic();
            });
        } catch (error) {
            console.error("Error al crear el tema:", error);
            Swal.fire({
                icon: 'error',
                title: t("createTopic.topicCreateErrorAlert"),
                timer: 3000,
                showConfirmButton: true,
            });
        } finally {
            setIsSubmitting(false); // Reactivar el botón de enviar
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
                <h2 className="text-2xl font-semibold mb-4">{t("createTopic.ModalTitle")}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Input 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder={t("createTopic.topicTitle")}
                            maxLength={MAX_TITLE_LENGTH}
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
                            placeholder={t("createTopic.topicContent")}
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
                            {t("createTopic.create")}
                        </Button>
                        <Button 
                            onClick={() => {
                                resetForm();  // Llama a la función para resetear el formulario
                                onClose();    // También cierra el modal
                            }} 
                            className="ml-2"
                        >
                            {t("createTopic.cancel")}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default CreateTopicForm;
