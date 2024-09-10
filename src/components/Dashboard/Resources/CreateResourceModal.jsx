import React, { useState, useEffect } from "react";
import { Modal, Button, notification, Card, Collapse } from "antd";
import { toast } from "react-toastify";
import { createResource, getResource, deleteResource } from "../../../api/courses/resource.request";
import UpdateResourceForm from "./UpdateResourceForm"; // Corregir importación (nombre en mayúsculas)
import { EditOutlined, DeleteFilled, FilePdfOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

const { Text } = Typography;

const { Panel } = Collapse;

const ALLOWED_FILE_TYPES = ['.mov', '.docx', '.pdf', '.jpg', '.png'];
const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:watch\?v=|embed\/|playlist\?list=)|youtu\.be\/)[a-zA-Z0-9_-]{11}(?:\S*)?$/i;
const VIMEO_URL_REGEX = /^(https?:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)$/i;
const GOOGLE_DRIVE_URL_REGEX = /^(https?:\/\/)?(drive\.google\.com\/file\/d\/)([a-zA-Z0-9_-]+)(\/[^?]*)(\?.*)?$/i;

const CreateResourceModal = ({ isVisible, onCancel, courseId, onCreate, visible }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [resources, setResources] = useState([]);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [selection, setSelection] = useState('file'); // Estado para seleccionar entre archivo y enlace

    useEffect(() => {
        if (isVisible && courseId) {
            fetchResources(courseId);
        } else {
            setResources([]); // Limpiar los recursos al cerrar la modal
        }
    }, [isVisible, courseId]);

    useEffect(() => {
        if (!visible) {
            resetState();
        }
    }, [visible]);

    const resetState = () => {
        setTitle('');
        setDescription('');
        setLink('');
        setSelectedFile(null);
        setSelection('file');
        setEditModalVisible(false);
        setSelectedResource(null);
    }; 

    const isVideoLink = (file) => {
        return YOUTUBE_URL_REGEX.test(file) || VIMEO_URL_REGEX.test(file) || GOOGLE_DRIVE_URL_REGEX.test(file);
    };

    const isValidLink = (url) => {
        return YOUTUBE_URL_REGEX.test(url) || VIMEO_URL_REGEX.test(url) || GOOGLE_DRIVE_URL_REGEX.test(url);
    };

    const getEmbedUrl = (file) => {
        if (YOUTUBE_URL_REGEX.test(file)) {
            const videoId = file.includes('youtu.be/') 
                ? file.split('youtu.be/')[1].split('?')[0]
                : new URL(file).searchParams.get('v');
            return `https://www.youtube.com/embed/${videoId}`;
        }

        if (VIMEO_URL_REGEX.test(file)) {
            const videoId = file.match(VIMEO_URL_REGEX)[4];
            return `https://player.vimeo.com/video/${videoId}`;
        }

        if (GOOGLE_DRIVE_URL_REGEX.test(file)) {
            const fileId = file.match(GOOGLE_DRIVE_URL_REGEX)[3];
            return `https://drive.google.com/file/d/${fileId}/preview`;
        }

        return '';
    };

    const fetchResources = async (courseId) => {
        try {
            const response = await getResource(courseId);
            setResources(response.data);
        } catch (err) {
            console.error("Error al obtener los recursos:", err);
            toast.error("Error al obtener los recursos");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (selection === 'link' && link && !isValidLink(link)) {
            notification.warning({
                message: 'Enlace inválido',
                description: 'Por favor, ingrese un enlace válido de YouTube, Vimeo o Google Drive.',
                duration: 3,
            });
            return;
        }
    
        const resourceData = {
            courseId,
            title,
            description,
            link: selection === 'link' ? link : null,
            file: selection === 'file' ? selectedFile : null
        };
    
        try {
            await createResource(resourceData);
            toast.success("Recurso creado exitosamente");
            onCreate();
            fetchResources(courseId); // Actualizar la lista de recursos tras crear uno nuevo
    
            // Resetear campos del formulario
            setTitle('');
            setDescription('');
            setSelection('file');
            setLink('');
            setSelectedFile(null);
        } catch (err) {
            console.error("Error al crear el recurso:", err);
            toast.error("Ocurrió un error al crear el recurso");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (ALLOWED_FILE_TYPES.includes(`.${fileExtension}`)) {
            setSelectedFile(file);
        } else {
            notification.warning({
                message: 'Tipo de archivo no permitido',
                description: 'Por favor, seleccione un archivo con uno de los tipos permitidos.',
                duration: 3,
            });
            e.target.value = '';
            setSelectedFile(null);
        }
    };

    const handleLinkChange = (e) => setLink(e.target.value);

    const openEditModal = (resource) => {
        setSelectedResource(resource);
        setEditModalVisible(true);
    };

    const closeEditModal = () => {
        setEditModalVisible(false);
        setSelectedResource(null);
    };

    const handleRemoveResource = async (resource) => {
        try {
            await deleteResource(resource._id);
            toast.success("Recurso eliminado exitosamente");
            fetchResources(courseId); // Actualiza la lista de recursos
        } catch (error) {
            console.error('Error al eliminar el recurso:', error);
            notification.error({
                message: 'Error al eliminar el recurso',
                description: error.message || 'Ocurrió un error al eliminar el recurso',
                duration: 3,
            });
        }
    };

    return (
        <Modal
            title="Recursos"
            visible={isVisible}
            onCancel={onCancel}
            footer={null}
            width={1200}
            bodyStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }} // Para centrar el modal y darle altura
        >
            {/* Contenedor principal centrado */}
            <div className="flex justify-center items-center h-full">
                {/* Contenedor de los paneles con separación y scroll */}
                <div className="flex gap-8 h-full">
                    {/* Panel de recursos a la izquierda con scroll */}
                    <div className="w-96 p-4 border border-gray-300 rounded-lg shadow-lg overflow-y-auto" style={{ maxHeight: '700px', width: "600px" }}>
                        <h3 className="text-lg font-bold mb-4">Recursos Creados</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                            {resources.length > 0 ? (
                                <Collapse accordion>
                                {resources.map((resource) => (
                                  <Panel header={
                                    <div className="flex justify-between items-center">{resource.title}
                                        <div className="flex ml-auto space-x-2">
                                        <Button
                                            icon={<EditOutlined />}
                                            onClick={() => openEditModal(resource)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            icon={<DeleteFilled />}
                                            onClick={() => handleRemoveResource(resource)}
                                        >
                                            Eliminar
                                        </Button>
                                        </div>
                                    </div>
                                  } key={resource._id}>
                                    <Card>
                                        {/* Flex container for video and description */}
                                        <div className="flex justify-between items-center">
                                            {/* Video or PDF on the left */}
                                            <div className="w-1/2">
                                            {isVideoLink(resource.files) ? (
                                                    <iframe
                                                    src={getEmbedUrl(resource.files)}
                                                    frameBorder="0"
                                                    style={{ width: '250px', height: '250px' }} // Ajusta el ancho y la altura aquí
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                                ) : resource.files.endsWith('.pdf') ? (
                                                    <div className="text-center">
                                                        <div className="flex items-center justify-center mb-4">
                                                            <FilePdfOutlined className="text-red-600 text-6xl" />
                                                        </div>
                                                    <a
                                                        href={resource.files}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:underline text-lg"
                                                        download
                                                    >
                                                        Descargar PDF
                                                    </a>
                                                </div>
                                                   
                                                ) : (
                                                    <div className="flex justify-center">
                                                        <img
                                                            src={resource.files}
                                                            alt={`Content ${resource.title}`}
                                                            className="max-w-full h-auto"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Description on the right */}
                                            <div className="w-1/2 pl-8">
                                                <p>{resource.description}</p>
                                                {resource.file && <p>Archivo: {resource.file.name}</p>}
                                            </div>
                                        </div>
                                    </Card>
                                  </Panel>
                                ))}
                              </Collapse>
                            ) : (
                                <p>No hay recursos creados.</p>
                            )}
                        </div>
                    </div>
    
                    {/* Formulario de creación a la derecha con scroll */}
                    <div className="w-96 p-4 border border-gray-300 rounded-lg shadow-lg overflow-y-auto" style={{ maxHeight: '700px', width: "500px" }}>
                        <h3 className="text-lg font-bold mb-4">Crear Nuevo Recurso</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-black">Título</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full p-2 rounded-lg border border-gray-300"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-black">Descripción</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    className="w-full p-2 rounded-lg border border-gray-300"
                                />
                            </div>
                            <div>
                                <label htmlFor="selection" className="block text-black">Seleccionar Tipo de Recurso</label>
                                <select
                                    id="selection"
                                    value={selection}
                                    onChange={(e) => setSelection(e.target.value)}
                                    className="w-full p-2 rounded-lg border border-gray-300"
                                >
                                    <option value="file">Archivo</option>
                                    <option value="link">Enlace</option>
                                </select>
                            </div>
                            {selection === 'file' && (
                                <div>
                                    <label htmlFor="file" className="block text-black">Archivo</label>
                                    <input
                                        type="file"
                                        id="file"
                                        onChange={handleFileChange}
                                        className="w-full p-2 rounded-lg border border-gray-300"
                                    />
                                </div>
                            )}
                            {selection === 'link' && (
                                <div>
                                    <label htmlFor="link" className="block text-black">Enlace (opcional)</label>
                                    <input
                                        type="text"
                                        id="link"
                                        value={link}
                                        onChange={handleLinkChange}
                                        placeholder="Ingrese el enlace"
                                        className="w-full p-2 rounded-lg border border-gray-300"
                                    />
                                </div>
                            )}
                            <div className="flex justify-between gap-4 mt-4">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                    Crear Recurso
                                </Button>
                                <Button
                                    onClick={onCancel}
                                    className="bg-gray-300 hover:bg-gray-400"
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    
            {isEditModalVisible && (
                <UpdateResourceForm
                    isVisible={isEditModalVisible}
                    onCancel={closeEditModal}
                    resourceData={selectedResource}
                    onUpdate={() => fetchResources(courseId)} // Actualiza la lista de recursos después de la edición
                />
            )}
        </Modal>
    );
    
};

export default CreateResourceModal;
