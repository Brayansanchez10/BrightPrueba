import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { getUsersAndQuizzesByCourseIdAndUserId, updateUserResourceProgress } from "../../../../api/courses/AdminQuiz.request.js";
import { getResourceById } from "../../../../api/courses/resource.request.js";
import { MdCancel, MdEdit, MdSave } from "react-icons/md";
import { Input } from "antd";

const AdminDetails = ({ visible, onClose, tableUser, courseId }) => {
    const { t } = useTranslation("global");
    const [infoQuizz, setInfoQuizz] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedProgress, setEditedProgress] = useState(null);
    const [resource, setResource] = useState({});

    useEffect(() => {
        const fetchQuizzData = async () => {
            if (courseId && tableUser?.id) {
                try {
                    const data = await getUsersAndQuizzesByCourseIdAndUserId(courseId, tableUser.id);
                    setInfoQuizz(data[0]?.user || {});
        
                    const progress = data[0]?.user?.progress || [];
                    if (progress.length > 0) {
                        const resourceId = progress[0].resourceId; // Accede al primer resourceId
                        if (resourceId) {
                            const resourceData = await getResourceById(courseId, resourceId);
                            setResource(resourceData.data);
                            console.log("Recurso", resourceData);
                        } else {
                            console.warn("No se encontró resourceId en el progreso del usuario.");
                        }
                    } else {
                        console.warn("El usuario no tiene progreso registrado.");
                    }
                } catch (error) {
                    console.error("Error al obtener datos del usuario con el quizz:", error);
                }
            }
        };

        if (visible) {
            fetchQuizzData();
        }
    }, [courseId, tableUser?.id, visible]);

    if (!tableUser) return null;

    const progressData = infoQuizz?.progress || [];

    const handleEdit = (index) => {
        setEditingIndex(index);
        setEditedProgress({ ...progressData[index] });
    };

    const handleSave = async () => {
        try {
            await updateUserResourceProgress(tableUser.id, editedProgress.resourceId, editedProgress);
            setEditingIndex(null);
            setEditedProgress(null);
            setInfoQuizz((prev) => ({
                ...prev,
                progress: prev.progress.map((item, idx) =>
                    idx === editingIndex ? editedProgress : item
                ),
            }));
        } catch (error) {
            console.error("Error al actualizar el progreso del recurso:", error);
        }
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setEditedProgress(null);
    };

    const handleInputChange = (e, field) => {
        const value = field === "bestScore" ? parseFloat(e.target.value) : parseInt(e.target.value, 10);
        setEditedProgress((prev) => ({ ...prev, [field]: value }));
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <button onClick={onClose} className="float-right text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
                        <div className="w-full lg:w-1/2 bg-gray-900 bg-opacity-60 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4">
                            <FaUserCircle size={60} color="#50A7D7" className="mb-2" />
                            <div className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text font-bungee">
                                {t('userDetails.title')}
                            </div>

                            <div className="text-white space-y-2 w-full">
                                {[ 
                                    { label: t('userDetails.id'), value: tableUser.id },
                                    { label: t('userDetails.name'), value: tableUser.username },
                                    { label: t('userDetails.firstNames'), value: tableUser.firstNames },
                                    { label: t('userDetails.lastNames'), value: tableUser.lastNames },
                                    { label: t('userDetails.documentNumber'), value: tableUser.documentNumber },
                                    { label: t('userDetails.email'), value: tableUser.email },
                                    { label: t('userDetails.status'), value: tableUser.state ? t('userDetails.active') : t('userDetails.inactive') },
                                ].map((field, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                        <p className="text-lg font-semibold opacity-80">{field.label}:</p>
                                        <span className="text-lg font-light bg-gray-800 bg-opacity-30 px-3 py-1 rounded-md truncate max-w-full sm:max-w-[200px] overflow-hidden" title={field.value}>
                                            {field.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 bg-gray-900 bg-opacity-60 p-6 rounded-lg shadow-lg">
                            {progressData.length > 0 ? (
                                <>
                                    <h3 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text font-bungee">{t('Quizzes realizados')}</h3>
                                    <div className="overflow-x-auto">
                                        <table className="table-auto w-full text-white text-sm mt-8">
                                            <thead>
                                                <tr className="bg-gray-800 bg-opacity-50">
                                                    <th className="px-4 py-2">{t('Nombre del quizz')}</th>
                                                    <th className="px-4 py-2">{t('Intentos realizados')}</th>
                                                    <th className="px-4 py-2">{t('Puntaje Obtenido')}</th>
                                                    <th className="px-4 py-2">{t('Puntaje De Aprobación')}</th>
                                                    <th className="px-4 py-2">{t('Resultado')}</th>
                                                    <th className="px-4 py-2">{t('Acciones')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {progressData.map((progress, index) => (
                                                    <tr key={index} className="bg-gray-800 bg-opacity-40">
                                                        <td className="px-4 py-2">{progress.resource?.title || 'No Title'}</td>
                                                        <td className="px-4 py-2">
                                                            {editingIndex === index ? (
                                                                <Input
                                                                    type="number"
                                                                    value={editedProgress.attempts}
                                                                    onChange={(e) => {
                                                                        // Asegura que el valor no sea negativo y no supere el máximo
                                                                        const value = Math.max(0, Math.min(10, parseInt(e.target.value) || 0)); // 0 es el valor mínimo y 10 el máximo
                                                                        handleInputChange(e, 'attempts', value);
                                                                    }}
                                                                    min="0"
                                                                    max="10"
                                                                />
                                                            ) : (
                                                                progress.attempts
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {editingIndex === index ? (
                                                                <Input
                                                                    type="number"
                                                                    value={editedProgress.bestScore}
                                                                    onChange={(e) => {
                                                                        // Asegura que el valor no sea negativo y no supere el máximo
                                                                        const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0)); // 0 es el valor mínimo y 100 el máximo
                                                                        handleInputChange(e, 'bestScore', value);
                                                                    }}
                                                                    min="0"
                                                                    max="100"
                                                                />
                                                            ) : (
                                                                progress.bestScore
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-2"> {resource?.percent || t("Sin título")} </td>
                                                        <td className="px-4 py-2">
                                                            <span
                                                                className={`font-semibold ${
                                                                    (progress.bestScore >= (resource?.percent || 0)) ? 'text-green-400' : 'text-red-400'
                                                                }`}
                                                            >
                                                                {(progress.bestScore >= (resource?.percent || 0)) ? t('Aprobado') : t('Reprobado')}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {editingIndex === index ? (
                                                                <div className="flex space-x-2">
                                                                    <button onClick={handleSave} className="text-green-500 hover:text-green-400">
                                                                        <MdSave size={20} />
                                                                    </button>
                                                                    <button onClick={handleCancel} className="text-red-500 hover:text-red-400">
                                                                        <MdCancel size={20} />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button onClick={() => handleEdit(index)} className="text-blue-500 hover:text-blue-400">
                                                                    <MdEdit size={20} />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <p className="text-center text-gray-300">
                                    {t('Este usuario no tiene quizzes registrados en este curso.')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDetails;