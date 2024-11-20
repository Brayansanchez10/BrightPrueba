import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import Swal from "sweetalert2";
import { useUserContext } from "../../../context/user/user.context";
import { useCoursesContext } from "../../../context/courses/courses.context";
import { FaChevronLeft, FaChevronRight, FaCircle, FaSearch, FaUserCheck, FaUserTimes, FaRegEye, FaTrash  } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import AdminDetails from "./DetailsAdmin/AdminDetails";
import { deleteResourceProgress } from "../../../api/courses/resource.request";
import { useCourseProgressContext } from "../../../context/courses/progress.context";
import { getUsersAndQuizzesByCourseIdAndUserId } from "../../../api/courses/AdminQuiz.request";

const AdminCoursesModal = ({ visible, onClose, courseId }) => {
    const { getUsersByCourse } = useUserContext();
    const [tableUser, setTableUser] = useState([]);
    const { unregisterFromCourse } = useCoursesContext();
    const [searchValue, setSearchValue] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const { deleteCourseProgress } = useCourseProgressContext();
    const { t } = useTranslation("global");

    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectAdmin, setSelectAdmin] = useState(null);

    const handleDetailsButtonClick = (tableUser) => {
        setSelectAdmin(tableUser);
        setShowDetailsModal(true);
    };
    
    const handleDetailsModalClose = () => {
        setShowDetailsModal(false);
        setSelectAdmin(null);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (courseId) {
                try {
                    const userData = await getUsersByCourse(courseId);
    
                    if (Array.isArray(userData)) {
                        const enrichedData = await Promise.all(
                            userData.map(async (user) => {
                                try {
                                    const userWithQuizzes = await getUsersAndQuizzesByCourseIdAndUserId(courseId, user.id);
                                    const resources = userWithQuizzes[0]?.user?.progress.map(progress => ({
                                        id: progress.resource.id,
                                        title: progress.resource.title,
                                    })) || [];
                                    console.log('Recursos para el usuario con ID', user.id, ':', resources);  // Verificación
                                    return {
                                        ...user,
                                        resources,
                                    };
                                } catch (error) {
                                    console.error(`Error al obtener quizzes para el usuario con ID ${user.id}:`, error);
                                    return { ...user, resources: [] };
                                }
                            })
                        );
    
                        setTableUser(enrichedData);
                    } else {
                        console.error("getUsersByCourse no retornó un array:", userData);
                        setTableUser([]);
                    }
                } catch (error) {
                    console.error("Error al obtener datos del curso:", error);
                    setTableUser([]); // Establece un valor por defecto en caso de error
                }
            }
        };
    
        if (visible) {
            fetchUserData();
        }
    }, [courseId, getUsersByCourse, visible]);

    useEffect(() => {
        const filteredUsers = tableUser.filter(
            (UserData) => 
                (UserData.firstNames && UserData.firstNames.toLowerCase().includes(searchValue.toLowerCase())) ||
                (UserData.lastNames && UserData.lastNames.toLowerCase().includes(searchValue.toLowerCase())) ||
                (UserData.email && UserData.email.toLowerCase().includes(searchValue.toLowerCase())) ||
                (UserData.documentNumber && UserData.documentNumber.toLowerCase().includes(searchValue.toLowerCase()))
        );

        setTotalItems(filteredUsers.length);
        setTotalPages(Math.ceil(filteredUsers.length / itemsPerPage));
    }, [tableUser, searchValue, itemsPerPage]);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 600) {
                setItemsPerPage(6);
            } else if (width < 1024) {
                setItemsPerPage(10);
            } else {
                setItemsPerPage(12);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const generateIds = () => {
        const filteredUsers = tableUser.filter(
            (UserData) => 
                (UserData.firstNames && UserData.firstNames.toLowerCase().includes(searchValue.toLowerCase())) ||
                (UserData.lastNames && UserData.lastNames.toLowerCase().includes(searchValue.toLowerCase())) ||
                (UserData.email && UserData.email.toLowerCase().includes(searchValue.toLowerCase())) ||
                (UserData.documentNumber && UserData.documentNumber.toLowerCase().includes(searchValue.toLowerCase()))
        );

        return filteredUsers
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((_, index) => index + 1 + (currentPage - 1) * itemsPerPage);
    };

    const filteredUsers = tableUser.filter(
        (UserData) => 
            (UserData.firstNames && UserData.firstNames.toLowerCase().includes(searchValue.toLowerCase())) ||
            (UserData.lastNames && UserData.lastNames.toLowerCase().includes(searchValue.toLowerCase())) ||
            (UserData.email && UserData.email.toLowerCase().includes(searchValue.toLowerCase())) ||
            (UserData.documentNumber && UserData.documentNumber.toLowerCase().includes(searchValue.toLowerCase()))
    );

    const handleUnregister = async (userId, courseId, resources) => {
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
                // 1. Eliminar progreso del curso
                await deleteCourseProgress(userId, courseId);
    
                 // 2. Eliminar progreso de quizzes asociados al curso
                if (resources && resources.length > 0) {
                    for (const resource of resources) {
                        if (resource.id) {
                            await deleteResourceProgress(userId, resource.id);
                        }
                    }
                }
    
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
                <div className="flex flex-col md:flex-row items-center w-full md:w-auto space-y-4 md:space-y-0 md:space-x-28"> 
                    <div className="text-3xl font-bungee mb-4 md:mb-0"
                    style={{
                        background: "linear-gradient(to right, #783CDA, #200E3E)",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                    }}
                    >
                    Usuarios Registrados
                    </div>
                    <div className="flex w-full md:w-auto px-4 py-2 border bg-white border-gray-300 rounded-xl shadow-lg order-1 md:order-2">
                        <FaSearch size={"18px"} className="mt-1 mr-2" />
                            <input
                                type="search"
                                className="bg-white outline-none w-full md:w-[280px] lg:w-[360px]"
                                placeholder={t("datatable.SearchByName")}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                    </div>
                </div>
            }
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={1200}
            bodyStyle={{
                display: "flex",
                flexDirection: "column", // Coloca los elementos en columna
                justifyContent: "flex-start", // Alinea el contenido hacia la parte superior
                alignItems: "stretch",
                height: "75vh",
                background: "#50A7D7",
                paddingTop: "20px",
            }}
            >
            <div className="flex justify-center mt-4 md:mt-2 w-full">
                <div className="overflow-auto w-full px-4 md:px-6 mx-4 md:mx-12 py-6 bg-secondaryAdmin rounded-xl shadow-lg shadow-purple-300 dark:shadow-purple-900">
                <table className="min-w-full overflow-x-auto">
                    <thead>
                    <tr>
                        <th className="text-lg px-3 py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                        {t("datatable.ID")}
                        </th>
                        <th className="text-lg px-3 py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                        {t("datatable.FirstNames")}
                        </th>
                        <th className="text-lg px-3 py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                        {t("datatable.LastNames")}
                        </th>
                        <th className="text-lg px-3 py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                        {t("datatable.Email")}
                        </th>
                        <th className="text-lg px-3 py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                        {t("datatable.DocumentNumber")}
                        </th>
                        <th className="text-lg px-3 py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                        {t("datatable.Status")}
                        </th>
                        <th className="text-lg px-3 py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                        {t("datatable.Actions")}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.length > 0 ? (
                        tableUser
                        .slice (
                            (currentPage - 1) * itemsPerPage,
                            currentPage * itemsPerPage
                        )
                        .map((record, index) =>
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
                                <div className="flex flex-nowrap justify-center space-x-2">
                                    <button
                                            className="bg-blue-500 text-white py-3 px-3 rounded"
                                            onClick={() => handleDetailsButtonClick(record)}
                                            >
                                            <FaRegEye/>
                                    </button>
                                    <button
                                        className="bg-red-500 text-white py-3 px-3 rounded"
                                        onClick={() => {
                                            const selectedUser = tableUser.find(user => user.id === record.id);
                                            console.log('Recursos del usuario:', selectedUser?.resources);  // Verificación
                                            handleUnregister(record.id, courseId, selectedUser?.resources || []);
                                        }}
                                    >
                                        <FaTrash/>
                                    </button>
                                </div>
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
                {totalPages > 1 && (
                    <div className="flex justify-end items-center mt-5 space-x-2">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`py-1 px-2 rounded-full text-white ${currentPage === 1 ? "bg-gray-500" : "bg-purple-600 hover:bg-purple-800"}`}
                        >
                            <FaChevronLeft />
                        </button>
                        <div className="text-lg font-semibold">{currentPage}</div>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`py-1 px-2 rounded-full text-white ${currentPage === totalPages ? "bg-gray-500" : "bg-purple-600 hover:bg-purple-800"}`}
                            >
                            <FaChevronRight />
                        </button>
                    </div> 
                )}
                </div>
                <AdminDetails
                    visible={showDetailsModal}
                    onClose={handleDetailsModalClose}
                    tableUser={selectAdmin}
                    courseId={courseId}
                />
            </div>
        </Modal>
    );
};

export default AdminCoursesModal;
