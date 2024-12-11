import React, { useState, useEffect } from "react";
import { Modal, Input, Button } from "antd";
import Swal from "sweetalert2";
import { useUserContext } from "../../../../context/user/user.context";
import { useForumTopic } from "../../../../context/forum/topic.context";
import { useAuth } from "../../../../context/auth.context";
import { useTranslation } from "react-i18next";
import { FaVideo, FaImage } from "react-icons/fa";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../Custom.css'

const CreateTopicForm = ({ visible, onClose, onCreate, forumCategoryId, fetchForumTopic }) => {
    const { getUserById } = useUserContext();
    const { user } = useAuth();
    const { createForumTopic } = useForumTopic(); // Función para crear tema en el contexto
    const { t } = useTranslation("global");
    const [username, setUsername] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [Content, setContent] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [characterCount, setCharacterCount] = useState(0);
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

    // Crear una referencia al editor
    const [quillRef, setQuillRef] = useState(null);

    // Agregar esta función para obtener la referencia del editor
    const handleQuillRef = (ref) => {
        if (ref) {
            setQuillRef(ref);
        }
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

    // Resetear el formulario después de crear el tema
    const resetForm = () => {
        setTitle('');
        setDescription('');
        setContent('');
        setErrors({});
    };

    const validateFields = () => {
        const newErrors = {};
        
        if (!title || title.length < 3) {
            newErrors.title = t("createTopic.validateTitle");
        } 
        if (!description || description.length < 30) {
            newErrors.description = t("createTopic.validateDescription");
        } 

        const textContent = Content.replace(/<(.|\n)*?>/g, '').trim();
        if (!textContent || textContent.length < 8) {
            newErrors.Content = t("createTopic.validateContent");
        }

        if (textContent.length > 1000) {
            Swal.fire({
                icon: 'warning',
                title: t("createTopic.contentTooLong"),
                text: t("createTopic.pleaseReduceContent"),
                confirmButtonColor: '#9333EA'
            });
            return false;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const countCharacters = (htmlContent) => {
        // Contar imágenes (10 caracteres cada una)
        const imageCount = (htmlContent.match(/<img[^>]*>/g) || []).length * 10;
        
        // Contar videos (20 caracteres cada uno)
        const videoCount = (htmlContent.match(/<iframe[^>]*>/g) || []).length * 25;
        
        // Obtener texto sin HTML
        const textContent = htmlContent.replace(/<(.|\n)*?>/g, '').trim();
        
        return textContent.length + imageCount + videoCount;
    };

    // Función para convertir URLs
    const getEmbedUrl = (url) => {
        // Para YouTube
        const youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const youtubeMatch = url.match(youtubeRegExp);

        if (youtubeMatch && youtubeMatch[2].length === 11) {
            return `https://www.youtube.com/embed/${youtubeMatch[2]}`;
        }

        // Para Google Drive
        const driveRegExp = /^https:\/\/drive\.google\.com\/file\/d\/(.*?)\/view/;
        const driveMatch = url.match(driveRegExp);

        if (driveMatch) {
            return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
        }

        // Si no es YouTube ni Drive, devolver la URL original
        return url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateFields()) {
            return; // Si hay errores, no envía el formulario
        }

        setIsSubmitting(true); // Desactivar el botón de enviar mientras se procesa
        const topicData = {
            title,
            description,
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
            width={1000} // Modal más ancho para mejor experiencia de edición
            bodyStyle={{
                borderRadius: "20px",
                overflow: "hidden",
            }}
        >
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">{t("createTopic.ModalTitle")}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="text-lg font-bold block">
                            {t("createTopic.title")}
                        </label>
                        <Input 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder={t("createTopic.topicTitle")}
                            maxLength={MAX_TITLE_LENGTH}
                            className="w-full"
                            required 
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                        <div className="text-gray-600 text-right mt-1 text-sm">
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
                            placeholder={t("createTopic.topicDescription")}
                            maxLength={MAX_DESCRIPTION_LENGTH}
                            className="w-full"
                            required 
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        <div className="text-gray-600 text-right mt-1 text-sm">
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
                                        title: t("createTopic.insertImage"),
                                        input: 'url',
                                        inputPlaceholder: 'https://ejemplo.com/imagen.jpg',
                                        showCancelButton: true,
                                        confirmButtonColor: '#9333EA',
                                        cancelButtonColor: '#6B7280',
                                        confirmButtonText: t("createTopic.insert"),
                                        cancelButtonText: t("createTopic.cancel"),
                                        inputValidator: (value) => {
                                            if (!value) {
                                                return t("createTopic.urlRequired");
                                            }
                                        }
                                    }).then((result) => {
                                        if (result.isConfirmed && quillRef) {
                                            const editor = quillRef.getEditor();
                                            const range = editor.getSelection() || { index: editor.getLength() };
                                            
                                            // Insertar la imagen en la posición del cursor
                                            editor.insertEmbed(range.index, 'image', result.value);
                                            editor.insertText(range.index + 1, '\n');
                                            
                                            // Mover el cursor después de la imagen
                                            editor.setSelection(range.index + 2, 0);
                                        }
                                    });
                                }}
                            >
                                <FaImage className="mr-1 text-purple-800" /> {t("createTopic.addImage")}
                            </Button>

                            <Button 
                                type="default"
                                onClick={() => {
                                    Swal.fire({
                                        title: t("createTopic.insertVideo"),
                                        input: 'url',
                                        inputPlaceholder: 'https://www.youtube.com/watch?v=... o https://drive.google.com/file/d/.../view',
                                        showCancelButton: true,
                                        confirmButtonColor: '#9333EA',
                                        cancelButtonColor: '#6B7280',
                                        confirmButtonText: t("createTopic.insert"),
                                        cancelButtonText: t("createTopic.cancel"),
                                        inputValidator: (value) => {
                                            if (!value) {
                                                return t("createTopic.urlRequired");
                                            }
                                            // Validar que sea una URL de YouTube o Drive
                                            if (!value.includes('youtube.com') && 
                                                !value.includes('youtu.be') && 
                                                !value.includes('drive.google.com')) {
                                                return t("createTopic.invalidVideoUrl");
                                            }
                                        }
                                    }).then((result) => {
                                        if (result.isConfirmed && quillRef) {
                                            const editor = quillRef.getEditor();
                                            const range = editor.getSelection() || { index: editor.getLength() };
                                            
                                            // Convertir la URL al formato embed correspondiente
                                            const embedUrl = getEmbedUrl(result.value);
                                            
                                            // Insertar el video y asegurar que haya un salto de línea después
                                            editor.insertEmbed(range.index, 'video', embedUrl);
                                            editor.insertText(range.index + 1, '\n');
                                            
                                            // Mover el cursor después del video
                                            editor.setSelection(range.index + 2, 0);
                                        }
                                    });
                                }}
                            >
                                <FaVideo className="mr-1 text-purple-800" /> {t("createTopic.addVideo")}
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
                                placeholder={t("createTopic.topicContent")}
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

                    <div className="flex justify-end gap-2">
                        <Button 
                            onClick={() => {
                                resetForm();
                                onClose();
                            }} 
                            className="hover:bg-gray-100"
                        >
                            {t("createTopic.cancel")}
                        </Button>
                        <Button 
                            type="primary" 
                            htmlType="submit"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            className="bg-purple-800 text-white hover:bg-purple-700"
                        >
                            {t("createTopic.create")}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default CreateTopicForm;
