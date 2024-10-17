import React, { useState, useRef, useEffect } from "react";
import { Modal, Input, Button } from "antd";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../context/auth.context";
import { useUserContext } from "../../../../context/user/user.context";
import { useForumComments } from "../../../../context/forum/forumComments.context"; 

const CreateCommentsComponent = ({ visible, onClose, onCreate, topicId, fetchForumTopic }) => {
    const { getUserById } = useUserContext();
    const { user } = useAuth();
    const [username, setUsername] = useState('');
    const [ content, setContent ] = useState('');
    const { t } = useTranslation("global");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { createForumComments } = useForumComments();
    const [errors, setErrors] = useState({});

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

    // Resetear el formulario despues de cerrar
    const resetForm = () => {
        setContent('');
        setErrors({});
    };

    const validateFields = () => {
        const newErrors = {};
       
        if (!content || content.length < 8) {
            newErrors.content = t("createComments.validateContent");
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit =  async(e) => {
        e.preventDefault();

        if (!validateFields()) {
            return; // Si hay errores, no envía el formulario
        }

        const CommentData = {
            content, 
            userId: user.data.id,
            topicId: Number(topicId)
        };

        setIsSubmitting(true); // Desactivar el botón de enviar mientras se procesa

        try {
            await createForumComments(CommentData);
            Swal.fire({
                icon: 'success',
                title: t("createComments.createAlert"),
                timer: 1000,
                showConfirmButton: false,
            }).then(() => {
                onCreate(CommentData); // Ejecutar función callback después de crear
                resetForm();
                onClose();
                fetchForumTopic();
            });
        } catch (error) {
            console.error("Error al crear el Comentario:", error);
            Swal.fire({
                icon: 'error',
                title: t("createComments.createErrorAlert"),
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
                <h2 className="text-2xl font-semibold mb-4">{t("createComments.TitleModalCreate")}</h2>

                <form onSubmit={handleSubmit}>
                <div className="mb-4">
                        <Input.TextArea 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            placeholder={t("createComments.commentsContent")}
                            rows={4} 
                            required 
                        />
                            {errors.content && <p className="text-red-500">{errors.content}</p>}
                        <div className="flex justify-end">
                        <Button 
                            type="primary" 
                            htmlType="submit"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            className="bg-purple-800 text-white"
                        >
                            {t("createComments.create")}
                        </Button>
                        <Button 
                             onClick={() => {
                                    resetForm();  // Llama a la función para resetear el formulario
                                    onClose();    // También cierra el modal
                                }} 
                            className="ml-2"
                        >
                            {t("createComments.cancel")}
                        </Button>
                    </div>
                    </div>
                </form>
             </div>
        </Modal>
    );
};

export default CreateCommentsComponent;