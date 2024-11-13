import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import Swal from "sweetalert2";
import { useUserContext } from "../../../context/user/user.context";
import { useCoursesContext } from "../../../context/courses/courses.context";
import { FaChevronLeft, FaChevronRight, FaCircle, FaSearch, FaUserCheck, FaUserTimes, } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const AdminCoursesModal = ({ visible, onClose, courseId }) => {
    const { getUsersByCourse } = useUserContext();
    const [tableUser, setTableUser] = useState([]);
    const { unregisterFromCourse } = useCoursesContext();
    const { t } = useTranslation("global");

    useEffect(() => {
        const fetchUserData = async () => {
            if (courseId) {
                try {
                    const userData = await getUsersByCourse(courseId);
                    setTableUser(userData);
                } catch (error) {
                    console.error("Error al obtener datos del curso:", error);
                }
            }
        };
        if (visible) {
            fetchUserData();
        }
    }, [courseId, getUsersByCourse, visible]);

    const handleUnregister = async (userId) => {
        try {
            const result = await Swal.fire({
                title: "Confirmación",
                text: "¿Deseas desuscribir este usuario del curso?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, desuscribir",
            });

            if (result.isConfirmed) {
                await unregisterFromCourse(userId, courseId);
                setTableUser(prevUsers => prevUsers.filter(user => user.id !== userId));
                Swal.fire("Desuscrito!", "El usuario ha sido desuscrito del curso.", "success");
            }
        } catch (error) {
            console.error("Error al desuscribir usuario:", error);
            Swal.fire("Error", "No se pudo desuscribir al usuario del curso.", "error");
        }
    };

    return (
        <Modal
            title={
                <div
                className="text-3xl font-bungee mb-4 md:mb-0"
                style={{
                    background: "linear-gradient(to right, #783CDA, #200E3E)",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                }}
                >
                Usuarios Registrados
                </div>
            }
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={1200}
            bodyStyle={{
                display: "flex",
                justifyContent: "flex-start", // Alinea el contenido en la parte superior
                alignItems: "center",
                height: "75vh",
                background: "#50A7D7",
                paddingTop: "20px", // Agrega algo de espacio en la parte superior
            }}
            >
            <div className="flex justify-center mt-4 md:mt-2 w-full">
                <div className="overflow-auto w-full px-4 md:px-6 mx-4 md:mx-12 py-6 bg-secondaryAdmin rounded-xl shadow-lg shadow-purple-300 dark:shadow-purple-900">
                <table className="min-w-full overflow-x-auto">
                    <thead>
                    <tr>
                        <th className="text-lg px-3 py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                        User ID
                        </th>
                        <th className="text-lg px-3 py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                        Nombre
                        </th>
                        <th className="text-lg px-3 py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                        Apellido
                        </th>
                        <th className="text-lg px-3 py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                        Correo
                        </th>
                        <th className="text-lg px-3 py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                        Documento
                        </th>
                        <th className="text-lg px-3 py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                        Estado
                        </th>
                        <th className="text-lg px-3 py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                        Acciones
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {tableUser.length > 0 ? (
                        tableUser.map((record, index) =>
                        record ? (
                            <tr key={record.id || index}>
                            <td className="border-2 border-x-transparent px-1 py-2 bg-secondaryAdmin text-primary text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                {record.id}
                            </td>
                            <td className="border-2 border-x-transparent px-1 py-2 bg-secondaryAdmin text-primary text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                {record.firstNames}
                            </td>
                            <td className="border-2 border-x-transparent px-1 py-2 bg-secondaryAdmin text-primary text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                {record.lastNames}
                            </td>
                            <td className="border-2 border-x-transparent px-1 py-2 bg-secondaryAdmin text-primary text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                {record.email}
                            </td>
                            <td className="border-2 border-x-transparent px-1 py-2 bg-secondaryAdmin text-primary text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                {record.documentNumber}
                            </td>
                            <td className="text-center border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                <div className="flex items-center justify-center">
                                    {record.state ? (
                                    <FaCircle
                                        size="14px"
                                        className="text-green-500 mr-2 flex-shrink-0"
                                    />
                                    ) : (
                                    <FaCircle
                                        size="14px"
                                        className="text-red-500 mr-2 flex-shrink-0"
                                    />
                                    )}
                                    <span className="whitespace-nowrap">
                                    {record.state
                                        ? t("datatable.Active")
                                        : t("datatable.Inactive")}
                                    </span>
                                </div>
                            </td>
                            <td className="border-2 border-x-transparent px-1 py-2 bg-secondaryAdmin text-primary text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                <button
                                className="bg-red-500 text-white py-1 px-3 rounded"
                                onClick={() => handleUnregister(record.id)}
                                >
                                Eliminar
                                </button>
                            </td>
                            </tr>
                        ) : (
                            <tr key={index}>
                            <td colSpan="6" className="text-center p-4">
                                Error: datos de usuario no disponibles.
                            </td>
                            </tr>
                        )
                        )
                    ) : (
                        <tr>
                        <td colSpan="6" className="text-center p-4">
                            No hay usuarios registrados en este curso.
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </div>
            </Modal>
    );
};

export default AdminCoursesModal;
