import React, { useState, useEffect } from "react";
import { Modal, Button, notification } from "antd";
import { toast } from "react-toastify";
import { updateResource } from "../../../api/courses/resource.request";

const ALLOWED_FILE_TYPES = ['.mov', '.docx', '.pdf', '.jpg', '.png'];

const UpdateResourceForm = ({ isVisible, onCancel, resourceData, onUpdate }) => {
    const [title, setTitle] = useState(resourceData?.title || "");
    const [description, setDescription] = useState(resourceData?.description || "");
    const [link, setLink] = useState(resourceData?.link || "");
    const [selectedFile, setSelectedFile] = useState(null);
    const [existingFileName, setExistingFileName] = useState(resourceData?.file?.name || "");

    useEffect(() => {
        if (resourceData) {
            setTitle(resourceData.title || "");
            setDescription(resourceData.description || "");
            setLink(resourceData.link || "");
            if (resourceData.file) {
                // Si el recurso tiene un archivo, mostramos el nombre
                setExistingFileName(resourceData.file.name || "");
            } else {
                setExistingFileName(""); // Limpia el nombre del archivo si no hay
            }
        }
    }, [resourceData]);

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

    const handleUpdate = async (e) => {
        e.preventDefault();

        const updatedData = {
            title,
            description,
            link, // Se actualiza el enlace del video
            file: selectedFile || resourceData.file, // Si no se selecciona nuevo archivo, usar el existente
        };

        try {
            await updateResource(resourceData._id, updatedData);
            toast.success("Recurso actualizado exitosamente");
            onUpdate(); // Actualiza la lista de recursos
            onCancel(); // Cierra el modal de edición
        } catch (err) {
            console.error("Error al actualizar el recurso:", err);
            toast.error("Ocurrió un error al actualizar el recurso");
        }
    };

    return (
        <Modal
            title="Editar Recurso"
            visible={isVisible}
            onCancel={onCancel}
            footer={null}
            width={800}
        >
            <form onSubmit={handleUpdate} className="space-y-4">
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
                    <label htmlFor="file" className="block text-black">Archivo</label>
                    {existingFileName && (
                        <p className="text-gray-500 mb-2">Archivo actual: {existingFileName}</p>
                    )}
                    <input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        className="w-full p-2 rounded-lg border border-gray-300"
                    />
                </div>

                <div>
                    <label htmlFor="link" className="block text-black">Enlace de video (opcional)</label>
                    {link && (
                        <p className="text-gray-500 mb-2">Enlace actual: <a href={link} target="_blank" rel="noopener noreferrer">{link}</a></p>
                    )}
                    <input
                        type="text"
                        id="link"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300"
                    />
                </div>

                <div className="flex justify-between gap-4">
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        Actualizar Recurso
                    </Button>
                    <Button onClick={onCancel}>Cancelar</Button>
                </div>
            </form>
        </Modal>
    );
};

export default UpdateResourceForm;
