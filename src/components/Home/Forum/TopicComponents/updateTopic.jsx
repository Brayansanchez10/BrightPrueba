import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Input } from "antd";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../context/auth.context";
import { useUserContext } from "../../../../context/user/user.context";
import { useForumTopic } from "../../../../context/forum/topic.context";
import { FaVideo, FaImage } from "react-icons/fa";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../Custom.css'

const UpdateForumTopicForm = ({ isVisible, onClose, visible, onUpdate, forumCategoryId, TopicData, fetchForumTopic }) => {
    const { getUserById } = useUserContext();
    const { user } = useAuth();
    const { t } = useTranslation("global");
    const [username, setUsername] = useState('');
    const { updateForumTopic, getForumTopicByCategoryId } = useForumTopic();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [Content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [characterCount, setCharacterCount] = useState(0);
    const [quillRef, setQuillRef] = useState(null);
    const MAX_TITLE_LENGTH = 30;
    const MAX_DESCRIPTION_LENGTH = 300;
    const MAX_CONTENT_LENGTH = 1000;

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['code-block'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link']
        ],
        keyboard: {
            bindings: {
                tab: false
            }
        },
        clipboard: {
            matchVisual: false
        }
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'code-block',
        'list', 'bullet',
        'link', 'video', 'image'
    ];

    const handleQuillRef = (ref) => {
        if (ref) {
            setQuillRef(ref);
        }
    };

    const countCharacters = (htmlContent) => {
        const imageCount = (htmlContent.match(/<img[^>]*>/g) || []).length * 10;
        const videoCount = (htmlContent.match(/<iframe[^>]*>/g) || []).length * 25;
        const textContent = htmlContent.replace(/<(.|\n)*?>/g, '').trim();
        return textContent.length + imageCount + videoCount;
    };

    const getEmbedUrl = (url) => {
        const youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const youtubeMatch = url.match(youtubeRegExp);

        if (youtubeMatch && youtubeMatch[2].length === 11) {
            return `https://www.youtube.com/embed/${youtubeMatch[2]}`;
        }

        const driveRegExp = /^https:\/\/drive\.google\.com\/file\/d\/(.*?)\/view/;
        const driveMatch = url.match(driveRegExp);

        if (driveMatch) {
            return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
        }

        return url;
    };

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
            setDescription(TopicData.description || "");
            setContent(TopicData.Content || "");
        }
    }, [TopicData]);

    // Resetear el formulario después de crear el tema
    const resetForm = () => {
        setTitle(TopicData.title);
        setDescription(TopicData.description);
        setContent(TopicData.Content);
        setErrors({});
    };

    const validateFields = () => {
        const newErrors = {};
        
        if (!title || title.length < 3) {
            newErrors.title = t("updateTopic.validateTitle");
        } 
        if (!description || description.length < 30) {
            newErrors.description = t("updateTopic.validateDescription");
        } 

        const textContent = Content.replace(/<(.|\n)*?>/g, '').trim();
        if (!textContent || textContent.length < 8) {
            newErrors.Content = t("updateTopic.validateContent");
        }

        if (textContent.length > 1000) {
            Swal.fire({
                icon: 'warning',
                title: t("updateTopic.contentTooLong"),
                text: t("updateTopic.pleaseReduceContent"),
                confirmButtonColor: '#9333EA'
            });
            return false;
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
            description,
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
            width={1000}
            bodyStyle={{
                borderRadius: "20px",
                overflow: "hidden",
            }}
        >
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">{t("updateTopic.TitleModalCreate")}</h2>

                <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                        <label className="text-lg font-bold block">
                            {t("createTopic.title")}
                        </label>
                        <Input 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder={t("updateTopic.topicTitle")}
                            maxLength={MAX_TITLE_LENGTH}
                            required 
                        />
                        {errors.title && <p className="text-red-500">{errors.title}</p>}
                         <div className="text-gray-600 text-right mt-1">
                            {title.length}/{MAX_TITLE_LENGTH}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="text-lg font-bold block">
                            {t("createTopic.description")}
                        </label>
                        <Input 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            placeholder={t("updateTopic.topicDescription")}
                            maxLength={MAX_DESCRIPTION_LENGTH}
                            required 
                        />
                        {errors.description && <p className="text-red-500">{errors.description}</p>}
                         <div className="text-gray-600 text-right mt-1">
                            {description.length}/{MAX_DESCRIPTION_LENGTH}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="text-lg font-bold block">
                            {t("createTopic.content")}
                        </label>
                        <div className="flex gap-2 flex-col sm:flex-row mb-2">
                            <Button 
                                type="default"
                                onClick={() => {
                                    Swal.fire({
                                        title: t("updateTopic.insertImage"),
                                        input: 'url',
                                        inputPlaceholder: 'https://ejemplo.com/imagen.jpg',
                                        showCancelButton: true,
                                        confirmButtonColor: '#9333EA',
                                        cancelButtonColor: '#6B7280',
                                        confirmButtonText: t("updateTopic.insert"),
                                        cancelButtonText: t("updateTopic.cancel"),
                                        inputValidator: (value) => {
                                            if (!value) {
                                                return t("updateTopic.urlRequired");
                                            }
                                        }
                                    }).then((result) => {
                                        if (result.isConfirmed && quillRef) {
                                            const editor = quillRef.getEditor();
                                            const range = editor.getSelection() || { index: editor.getLength() };

                                            editor.insertEmbed(range.index, 'image', result.value);
                                            editor.insertText(range.index + 1, '\n');
                                            editor.setSelection(range.index + 2, 0);
                                        }
                                    });
                                }}
                            >
                                <FaImage className="mr-1 text-purple-800" /> {t("updateTopic.addImage")}
                            </Button>

                            <Button 
                                type="default"
                                onClick={() => {
                                    Swal.fire({
                                        title: t("updateTopic.insertVideo"),
                                        input: 'url',
                                        inputPlaceholder: 'https://www.youtube.com/watch?v=... o https://drive.google.com/file/d/.../view',
                                        showCancelButton: true,
                                        confirmButtonColor: '#9333EA',
                                        cancelButtonColor: '#6B7280',
                                        confirmButtonText: t("updateTopic.insert"),
                                        cancelButtonText: t("updateTopic.cancel"),
                                        inputValidator: (value) => {
                                            if (!value) {
                                                return t("updateTopic.urlRequired");
                                            }
                                            if (!value.includes('youtube.com') && 
                                                !value.includes('youtu.be') && 
                                                !value.includes('drive.google.com')) {
                                                return t("updateTopic.invalidVideoUrl");
                                            }
                                        }
                                    }).then((result) => {
                                        if (result.isConfirmed && quillRef) {
                                            const editor = quillRef.getEditor();
                                            const range = editor.getSelection() || { index: editor.getLength() };

                                            const embedUrl = getEmbedUrl(result.value);
                                            editor.insertEmbed(range.index, 'video', embedUrl);
                                            editor.insertText(range.index + 1, '\n');
                                            editor.setSelection(range.index + 2, 0);
                                        }
                                    });
                                }}
                            >
                                <FaVideo className="mr-1 text-purple-800" /> {t("updateTopic.addVideo")}
                            </Button>
                        </div>

                        <div className="quill-wrapper">
                            <ReactQuill 
                                ref={handleQuillRef}
                                theme="snow"
                                value={Content}
                                onChange={(content) => {
                                    setContent(content);
                                    setCharacterCount(countCharacters(content));
                                }}
                                modules={modules}
                                formats={formats}
                                placeholder={t("updateTopic.topicContent")}
                                style={{
                                    height: '300px',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            />
                        </div>
                        <div className={`text-right mt-1 text-sm ${characterCount >= MAX_CONTENT_LENGTH ? 'text-red-500' : 'text-gray-600'}`}>
                            {characterCount}/{MAX_CONTENT_LENGTH}
                        </div>
                        {errors.Content && (
                            <p className="text-red-500 text-sm -mt-4">{errors.Content}</p>
                        )}
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