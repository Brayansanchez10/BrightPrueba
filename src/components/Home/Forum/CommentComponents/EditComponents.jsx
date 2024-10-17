import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Input } from "antd";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../context/auth.context";
import { useUserContext } from "../../../../context/user/user.context";
import { useForumComments } from "../../../../context/forum/forumComments.context";

const UpdateForumCommntsForm = ({ onClose, visible, topicId, topicData, fetchForumTopic, onUpdate }) => {
    const { getUserById } = useUserContext();
    const { user } = useAuth();
    const { t } = useTranslation("global");
    const [username, setUsername] = useState('');
    const { updateForumComments } = useForumComments();
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            if (user && user.data && user.data.id) {
                try {
                    const userData = await getUserById(user.data.id);
                    setUsername(userData.username); 
                } catch (error) {
                    console.error('Error al obtener datos del usuario:', error);
                }
            }
        };
        fetchUserData();
    }, [user, getUserById]);

    useEffect(() => {
        if (topicData){
            setContent(topicData.content || "");
        }
    }, [topicData]);

    // Resetear el formulario después de crear el tema
    const resetForm = () => {
        setContent(topicData.content);
        setErrors({});
    };

    const validateFields = () => {
        const newErrors = {};
       
        if (!content || content.length < 8) {
            newErrors.content = t("updateComments.validateContent");
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!validateFields()) {
            return; // Si hay errores, no envía el formulario
        }
    
        const updateData = {
            content,
            userId: Number(user.data.id), // Asegúrate de que sea un número si la base de datos espera un número
            topicId: Number(topicId),
        };

        setIsSubmitting(true);
    
        try {
            await updateForumComments(topicData.id, updateData);
            Swal.fire({
                icon: "success",
                title: t("updateComments.updateAlert"),
                showConfirmButton: false,
                timer: 1000,
            }).then(() => {
                onUpdate(updateData);
                resetForm();
                onClose();
                fetchForumTopic();
            });
        } catch (error) {
            console.error("Error al actualizar un comentario:", error);
        } finally {
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
                <h2 className="text-2xl font-semibold mb-4">{t("updateComments.TitleModalCreate")}</h2>

                <form onSubmit={handleUpdate}>
                <div className="mb-4">
                        <Input.TextArea 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            placeholder={t("updateComments.commentsContent")}
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
                            {t("updateComments.create")}
                        </Button>
                        <Button 
                            onClick={() => {
                                resetForm();  // Llama a la función para resetear el formulario
                                onClose();    // También cierra el modal
                            }} 
                            className="ml-2"
                        >
                            {t("updateComments.cancel")}
                        </Button>
                    </div>
                    </div>
                </form>
             </div>
        </Modal>
    );
};

export default UpdateForumCommntsForm;