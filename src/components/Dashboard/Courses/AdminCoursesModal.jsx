import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import Swal from "sweetalert2";
import { useUserContext } from "../../../context/user/user.context";
import { useCoursesContext } from "../../../context/courses/courses.context";
import { FaChevronLeft, FaChevronRight, FaCircle, FaSearch, FaRegEye, FaTrash, FaTimes, FaCheck  } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import AdminDetails from "./DetailsAdmin/AdminDetails";
import { deleteResourceProgress } from "../../../api/courses/resource.request";
import { useCourseProgressContext } from "../../../context/courses/progress.context";
import { getUsersAndQuizzesByCourseIdAndUserId } from "../../../api/courses/AdminQuiz.request";

const AdminCoursesModal = ({ visible, onClose, courseId }) => {
    const { getUsersByCourse, getPendingUsersByCourse, buttonStateActivate } = useUserContext();
    const [tableUser, setTableUser] = useState([]);
    const { unregisterFromCourse } = useCoursesContext();
    const [searchValue, setSearchValue] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const { deleteCourseProgress } = useCourseProgressContext();
    const [pendingUsers, setPendingUsers] = useState([]);
    const { t } = useTranslation("global");

    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectAdmin, setSelectAdmin] = useState(null);

    const [activeTab, setActiveTab] = useState(0); // Controla la pestaña activa

    const handleTabClick = (tabIndex) => {
        setActiveTab(tabIndex);
    };

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


                    // Obtener los usuarios pendientes 
                    const pendingData = await getPendingUsersByCourse(courseId);
                    if (Array.isArray(pendingData)) {
                        setPendingUsers(pendingData);
                    } else {
                        console.error("No retorno un array", pendingData);
                        setPendingUsers([]);
                    }
                } catch (error) {
                    console.error("Error al obtener datos del curso:", error);
                    setTableUser([]); // Establece un valor por defecto en caso de error
                }
            }
        };
    
        if (visible) {
            fetchUserData();
            getUsersByCourse(courseId);
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

    const filteredPending = pendingUsers.filter(
        (pendingData) => 
            (pendingData.username && pendingData.username.toLowerCase().includes(searchValue.toLowerCase())) ||
            (pendingData.email && pendingData.email.toLowerCase().includes(searchValue.toLowerCase()))
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
                try {
                    await deleteCourseProgress(userId, courseId);
                } catch (error) {
                    console.warn("No se encontro el progreso del curso:", error);
                }
                
                 // 2. Eliminar progreso de quizzes asociados al curso
                 if (resources && resources.length > 0) {
                    for (const resource of resources) {
                        if (resource.id) {
                            try {
                                await deleteResourceProgress(userId, resource.id);
                            } catch (error) {
                                console.warn(`No se encontro el progreso del recurso con ID ${resource.id}:`, error);
                            }
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

    const handleStateActivate = async (userId, courseId) => {
        try {
            const result = await Swal.fire({
                title: "Confirmación",
                text: "¿Deseas Aceptar a este usuario?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, aceptar",
            });

            if (result.isConfirmed) {
                // Llama a la función para activar al usuario
                await buttonStateActivate(userId, courseId);
    
                // Actualiza la lista de pendientes eliminando al usuario activado
                setPendingUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                
                    // Encuentra el usuario en la lista de pendientes
                const activatedUser = pendingUsers.find(user => user.id === userId);

                if (activatedUser) {
                    // Actualiza las listas
                    setPendingUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                    setTableUser(prevUsers => [...prevUsers, activatedUser]); // Agrega el usuario activado
                }

                Swal.fire("Activado", "El usuario ha sido aceptado en el curso.", "success");
            }

        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo Activar este usuario al curso.", "error");
        }
    };

    const handleCancelState = async (userId, courseId) => {
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
                setPendingUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                Swal.fire("Activado", "El usuario ha sido aceptado en el curso.", "success");
            }
        } catch (error) {
            console.error("Error al desuscribir usuario:", error);
            Swal.fire("Error", "No se pudo desuscribir al usuario del curso.", "error");
        }
    };

    return (
        <Modal
            title={
                <div className="flex flex-col md:flex-row items-center w-full md:w-auto space-y-4 md:space-y-0 md:space-x-[750px]"> 
                    <div className="text-3xl font-bungee mb-4 md:mb-0"
                    style={{
                        background: "linear-gradient(to right, #783CDA, #200E3E)",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                    }}
                    >
                    {t("datatable.titleModal")}
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
            width="90vw"
            bodyStyle={{
                display: "flex",
                flexDirection: "column", // Coloca los elementos en columna
                justifyContent: "flex-start", // Alinea el contenido hacia la parte superior
                alignItems: "stretch",
                height: "75vh",
                paddingTop: "20px",
            }}
            >

            <div className="w-full">
                {/* Navegación de las pestañas */}
                <div className="flex justify-center border-b border-gray-300 mb-4">
                    <button
                        className={`px-4 py-2 text-lg font-semibold ${
                            activeTab === 0
                            ? "border-b-2 border-purple-600 text-purple-600"
                            : "text-gray-600 hover:text-purple-600"
                        }`}
                        onClick={() => handleTabClick(0)}
                        >
                        {t("datatable.titleActivate")}
                    </button>
                    <button
                        className={`px-4 py-2 text-lg font-semibold ${
                            activeTab === 1
                            ? "border-b-2 border-purple-600 text-purple-600"
                            : "text-gray-600 hover:text-purple-600"
                        }`}
                        onClick={() => handleTabClick(1)}
                        >
                        {t("datatable.titleInactive")}
                    </button>
                </div>

                <div className="mt-4">
                    {activeTab === 0 && (
                        <div>
                            <div className="overflow-auto px-4 md:px-6 mx-4 md:mx-12 py-6 bg-secondaryAdmin rounded-xl shadow-lg shadow-purple-300 dark:shadow-purple-900">
                                <table className="min-w-full overflow-x-auto">
                                    <thead>
                                    <tr>
                                        <th className="text-base px-1 py-1 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                        {t("datatable.ID")}
                                        </th>
                                        <th className="text-base px-1 py-1 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                        {t("datatable.FirstNames")}
                                        </th>
                                        <th className="text-base px-1 py-1 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                        {t("datatable.LastNames")}
                                        </th>
                                        <th className="text-base px-1 py-1 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                        {t("datatable.Email")}
                                        </th>
                                        <th className="text-base px-1 py-1 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                        {t("datatable.DocumentNumber")}
                                        </th>
                                        <th className="text-base px-1 py-1 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                        {t("datatable.Status")}
                                        </th>
                                        <th className="text-base px-1 py-1 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
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
                                            <td className="border-2 border-x-transparent px-1 py-3 bg-secondaryAdmin text-primary text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                {record.id}
                                            </td>
                                            <td className="border-2 border-x-transparent px-1 py-3 bg-secondaryAdmin text-primary text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                {record.firstNames}
                                            </td>
                                            <td className="border-2 border-x-transparent px-1 py-3 bg-secondaryAdmin text-primary text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                {record.lastNames}
                                            </td>
                                            <td className="border-2 border-x-transparent px-1 py-3 bg-secondaryAdmin text-primary text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                {record.email}
                                            </td>
                                            <td className="border-2 border-x-transparent px-1 py-3 bg-secondaryAdmin text-primary text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
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
                                            {t("datatable.DataError")}
                                            </td>
                                            </tr>
                                        )
                                        )
                                    ) : (
                                        <tr>
                                        <td colSpan="6" className="text-center p-4">
                                            {t("datatable.NoRegister")}
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
                        </div>
                    )}

                    {activeTab === 1 && (
                        <div>
                             {/* Tabla de usuarios pendientes */}
                            <div className="overflow-auto  px-4 md:px-6 mx-4 md:mx-12 py-6 bg-secondaryAdmin rounded-xl shadow-lg shadow-purple-300 dark:shadow-purple-900">
                                    <table className="min-w-full overflow-x-auto">
                                        <thead>
                                            <tr>
                                                {/* Encabezados de la tabla de usuarios pendientes */}
                                                <th className="text-base px-1 py-1 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                    {t("datatable.ID")}</th>
                                                <th className="text-base px-1 py-1 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                    {t("datatable.Username")}</th>
                                                <th className="text-base px-1 py-1 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                    {t("datatable.Email")}</th>
                                                <th className="text-base px-1 py-1 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                    {t("datatable.Actions")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPending.length > 0 ? (
                                                pendingUsers.map((record, index) => (
                                                    <tr key={record.id || index}>
                                                        {/* Filas de usuarios pendientes */}
                                                        <td className="border-2 border-x-transparent px-1 py-3 bg-secondaryAdmin text-primary text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                            {record.id}</td>
                                                        <td className="border-2 border-x-transparent px-1 py-3 bg-secondaryAdmin text-primary text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                            {record.username}</td>                                            
                                                        <td className="border-2 border-x-transparent px-1 py-3 bg-secondaryAdmin text-primary text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                            {record.email}</td>
                                                        <td className="border-2 border-x-transparent px-1 py-3 bg-secondaryAdmin text-primary text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                        <div className="flex flex-nowrap justify-center space-x-2">
                                                            <button
                                                                    className="bg-green-500 text-white py-2 px-2 rounded"
                                                                    onClick={() => handleStateActivate(record.id, courseId)}
                                                                    >
                                                                    <FaCheck/>
                                                            </button>
                                                            <button
                                                                className="bg-red-500 text-white py-2 px-2 rounded"
                                                                onClick={() => {
                                                                    const selectedUser = tableUser.find(user => user.id === record.id);
                                                                    console.log('Recursos del usuario:', selectedUser?.resources);  // Verificación
                                                                    handleCancelState(record.id, courseId);
                                                                }}
                                                            >
                                                                <FaTimes/>
                                                            </button>
                                                        </div>
                                                            
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan="6" className="text-center p-4">{t("datatable.Pending")}</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                        </div>
                    )}
                </div>
            </div>
                <AdminDetails
                    visible={showDetailsModal}
                    onClose={handleDetailsModalClose}
                    tableUser={selectAdmin}
                    courseId={courseId}
                />
               
        </Modal>
    );
};

export default AdminCoursesModal;
