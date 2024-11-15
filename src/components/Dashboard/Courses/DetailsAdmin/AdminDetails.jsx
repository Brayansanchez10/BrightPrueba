import React, { useEffect, useState } from "react";
import { Modal, Button, Input } from "antd";
import { FaUserCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { getUsersAndQuizzesByCourseIdAndUserId } from "../../../../api/courses/AdminQuiz.request.js";
import { updateUserResourceProgress } from "../../../../api/courses/AdminQuiz.request.js";
import { MdCancel, MdEdit  } from "react-icons/md";

const AdminDetails = ({ visible, onClose, tableUser, courseId }) => {
    const { t } = useTranslation("global");
    const [infoQuizz, setInfoQuizz] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedProgress, setEditedProgress] = useState(null);

    useEffect(() => {
        const fetchQuizzData = async () => {
            if (courseId && tableUser?.id) {
                try {
                    const data = await getUsersAndQuizzesByCourseIdAndUserId(courseId, tableUser.id);
                    setInfoQuizz(data[0]?.user || {});
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
            // Refrescar los datos
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

    return (
        <Modal
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={900}
            bodyStyle={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
                background: "linear-gradient(to right, #1e293b, #3b4252)",
            }}
        >
            <div className="flex w-full space-x-6">
                <div className="w-4/6 bg-gray-900 bg-opacity-60 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4">
                    <FaUserCircle size={60} color="#50A7D7" className="mb-2" />
                    <div className="text-3xl font-bold text-center" style={{ background: "linear-gradient(90deg, #50A7D7, #783CDA)", WebkitBackgroundClip: "text", color: "transparent" }}>
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
                            <div key={index} className="flex justify-between items-center">
                                <p className="text-lg font-semibold opacity-80">{field.label}:</p>
                                <span className="text-lg font-light bg-gray-800 bg-opacity-30 px-3 py-1 rounded-md truncate max-w-[200px] overflow-hidden" title={field.value}>
                                    {field.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-4/9 bg-gray-900 bg-opacity-60 p-6 rounded-lg shadow-lg">
                    {progressData.length > 0 ? (
                        <>
                            <h3 className="text-2xl font-bold text-center text-white mb-4">{t('Quizzes realizados')}</h3>
                            <table className="table-auto w-full text-white text-sm">
                                <thead>
                                    <tr>
                                        <th>{t('Nombre del quizz')}</th>
                                        <th>{t('Intentos realizados')}</th>
                                        <th>{t('Puntaje Obtenido')}</th>
                                        <th>{t('Resultado')}</th> {/* Nueva columna para el resultado */}
                                        <th>{t('Acciones')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {progressData.map((progress, index) => (
                                        <tr key={index} className="bg-gray-800 bg-opacity-40 rounded-md">
                                            <td>{progress.resource?.title || 'No Title'}</td>
                                            <td>
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
                                            <td>
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
                                            <td>
                                                <span
                                                    className={`font-semibold ${
                                                        progress.bestScore >= 50 ? 'text-green-400' : 'text-red-400'
                                                    }`}
                                                >
                                                    {progress.bestScore >= 50 ? t('Aprobado') : t('Reprobado')}
                                                </span>
                                            </td>
                                            <td className="flex items-center space-x-2">
                                                {editingIndex === index ? (
                                                    <>
                                                        <Button onClick={handleSave}>{t('Guardar')}</Button>
                                                        <Button onClick={handleCancel} style={{ marginLeft: '2px' }}>
                                                            <MdCancel/>
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button onClick={() => handleEdit(index)}><MdEdit/></Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <p className="text-center text-gray-300">
                            {t('Este usuario no tiene quizzes registrados en este curso.')}
                        </p>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default AdminDetails;