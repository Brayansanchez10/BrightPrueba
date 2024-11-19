import React, { useState, useEffect, useRef } from "react";
import { Button, message } from "antd";
import {
  ReloadOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  FileAddOutlined,
  BellOutlined,
  QrcodeOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import LeftBar from "../../Dashboard/LeftBar";
import { useUserContext } from "../../../context/user/user.context";
import { useCoursesContext } from "../../../context/courses/courses.context";
import CreateCourseForm from "../Courses/CreateCourseForm";
import UpdateCourseForm from "../Courses/UpdateCourseForm";
import Navbar from "../NavBar";
import CreateResourceModal from "../Resources/CreateResourceModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import CourseDetailsModal from "./CourseDetailsModal";
import NotifyCourseModal from "./NotifyCourseModal";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import CreateSubCategoryForm from "../SubCategories/CreateSubCategoryForm";
import AdminCoursesModal from "./AdminCoursesModal";

import { useAuth } from "../../../context/auth.context";
import { usePermissionContext } from "../../../context/user/permissions.context";

const DataTablete = () => {
  const { t } = useTranslation("global");
  const { getUsers, usersData, getUserById } = useUserContext();
  const {
    getAllCourses,
    courses,
    deleteCourse,
    updateCourse,
    crearRecurso,
    createCourse,
  } = useCoursesContext();
  const [searchValue, setSearchValue] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLeftBarVisible, setIsLeftBarVisible] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);
  const [isNotifyModalVisible, setIsNotifyModalVisible] = useState(false);
  const [isAdminModalVisible, setIsAdminModalVisible] = useState(false);
  const [resourceFile, setResourceFile] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [dataFlag, setDataFlag] = useState(false);
  const [subCategoryForm, setSubCategoryForm] = useState(false);
  const [entityId, setEntityId] = useState(null);

  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const { permissionsData, rolePermissions, loading, error, getPermissionsByRole } = usePermissionContext();
  const [ permisosByRol, setPermisosByRol ] = useState("");
  const [openMenus, setOpenMenus] = useState({});
  const menuRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    getUsers();
    getAllCourses();
  }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user && user.data && user.data.id) {
                try {
                    // Obtener datos del usuario
                    const userData = await getUserById(user.data.id);
                    setUsername(userData.username); // Guarda el nombre de usuario (u otra información)

                    // Guarda el entityId del usuario
                    setEntityId(userData.entityId); // Asegúrate de tener este estado definido
                    
                    // Si el usuario tiene un roleId, obtener los permisos
                    if (userData.roleId) {
                        const permisos = await getPermissionsByRole(userData.roleId); // Asegúrate de que esta función retorna los permisos
                        setPermisosByRol(permisos || []); // Si permisos es undefined, establece un array vacío
                        console.log("Permisos del rol", permisos);
                    }
                } catch (error) {
                    console.error("Error al obtener datos del usuario o permisos del rol:", error);
                    setError("Error al obtener datos del usuario o permisos del rol.");
                }
            }
        };
    
        fetchUserData();
    }, [user]);
    

  useEffect(() => {
    const filteredCourses = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        course.category.toLowerCase().includes(searchValue.toLowerCase()) ||
        course.description.toLowerCase().includes(searchValue.toLowerCase())
    );

    setTotalItems(filteredCourses.length);
    setTotalPages(Math.ceil(filteredCourses.length / itemsPerPage));
  }, [courses, searchValue, itemsPerPage]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setItemsPerPage(6);
      } else if (width < 1024) {
        setItemsPerPage(8);
      } else {
        setItemsPerPage(10);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dataFlag]);

  const handleCreateCourseClick = () => setShowCreateForm(true);
  const handleCreateFormClose = () => setShowCreateForm(false);
  const handleAdminModalClose = () => setIsAdminModalVisible(false);
  const handleUpdateButtonClick = (course) => {
    setSelectedCourse(course);
    setShowUpdateForm(true);
  };
  const handleUpdateFormClose = () => {
    setShowUpdateForm(false);
    setSelectedCourse(null);
  };

  const handleUpdateCourse = async (updatedCourse) => {
    if (dataFlag) return;
    setDataFlag(true);
    try {
      await updateCourse(updatedCourse);
      message.success(t("courses.updateSuccess"));
    } catch (error) {
      message.error(t("courses.updateError"));
    } finally {
      setDataFlag(false);
      setShowUpdateForm(false);
      setSelectedCourse(null);
    }
  };

  const handleCreateResourceClick = (course) => {
    setSelectedCourse(course);
    setSelectedCourseId(course.id);
    setIsCreateModalVisible(true);
  };

  const handleCreateResource = async () => {
    if (dataFlag) return;
    setDataFlag(true);
    if (selectedCourse && selectedCourse.id) {
      const courseId = selectedCourse.id;
      try {
        await crearRecurso(courseId);
        setIsCreateModalVisible(false);
      } catch (error) {
        console.error("Error al crear recurso:", error);
      } finally {
        setDataFlag(false);
      }
    } else {
      message.error(t("courses.noCourseSelected"));
    }
  };

  const handleCreateCourse = async (course) => {
    try {
      await createCourse(course);
      setShowCreateForm(false);
    } catch (error) {
      console.log(error);
    } finally {
      setDataFlag(false);
      getAllCourses();
    }
  };

  const handleDeleteButtonClick = (course) => {
    setCourseToDelete(course);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (dataFlag) return;
    setDataFlag(true);
    try {
      await deleteCourse(courseToDelete.id);
      message.success(t("courses.deleteSuccess"));
      window.location.reload();
    } catch (error) {
      message.error(t("courses.deleteError"));
    } finally {
      setDataFlag(false);
      setIsDeleteModalVisible(false);
      setCourseToDelete(null);
    }
  };

  const handleDetailsButtonClick = (course) => {
    setSelectedCourseDetails(course);
    setIsDetailsModalVisible(true);
  };

  const handleNotifyButtonClick = (course) => {
    setSelectedCourse(course);
    setIsNotifyModalVisible(true);
  };

  const handleSubCategoryButtonClick = (course) => {
    setSelectedCourse(course);
    setSelectedCourseId(course.id);
    setSubCategoryForm(true);
  };

  const handleAdminButtonClick = (course) => {
    setSelectedCourse(course);
    setSelectedCourseId(course.id);
    setIsAdminModalVisible(true)
  }

  const handleSendNotification = async (recipients) => {
    try {
      if (!selectedCourse || !selectedCourse.id) {
        throw new Error("Course ID is not defined");
      }
      const response = await axios.post(
        `https://apibrightmind.mesadoko.com/PE/courses/${selectedCourse.id}/notify-specific`,
        { recipients: recipients }
      );
      if (
        response.data.message === "Course notification emails sent successfully"
      ) {
        message.success(t("courses.notificationSent"));
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      message.error(t("courses.notificationError"));
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const generateIds = () => {
    // Filtrado inicial por el valor de búsqueda
    const searchFilteredCourses = courses.filter(
        (course) =>
            course.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            course.category.toLowerCase().includes(searchValue.toLowerCase()) ||
            course.description.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Filtrado adicional por entityId del usuario
    const entityFilteredCourses = searchFilteredCourses.filter(
        (course) => entityId === 1 || course.entityId === entityId // Cambia la condición según tu lógica
    );

    // Filtrado por userId si el usuario no es admin (userId !== 1)
    const userFilteredCourses = entityFilteredCourses.filter(
        (course) => user?.data?.id === 1 || course.userId === user?.data?.id
    );

    // Paginar los cursos filtrados
    const paginatedCourses = userFilteredCourses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Generar los IDs para los cursos paginados
    return paginatedCourses.map((_, index) => index + 1 + (currentPage - 1) * itemsPerPage);
  };

  // También actualiza la variable filteredCourses si es necesaria en tu componente
  const filteredCourses = courses.filter(
      (course) =>
          course.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          course.category.toLowerCase().includes(searchValue.toLowerCase()) ||
          course.description.toLowerCase().includes(searchValue.toLowerCase())
      ).filter(
        (course) => entityId === 1 || course.entityId === entityId // Filtrado por entityId
      ).filter(
        (course) => user?.data?.id === 1 || course.userId === user?.data?.id // Filtrado por userId
  );

   // Función para manejar la visibilidad del menú de cada curso
   const toggleDropdown = (courseId, event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    
    if (openMenus[courseId]) {
      setOpenMenus(prev => ({ ...prev, [courseId]: false }));
    } else {
      setMenuPosition({
        top: rect.top + window.scrollY,
        left: rect.right + window.scrollX
      });
      setOpenMenus(prev => ({ ...prev, [courseId]: true }));
    }
  };

  // Cerrar el menú cuando se hace clic fuera
   useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenus({});
      }
    };

    const handleScroll = () => {
      setOpenMenus({}); // Cerrar menús al hacer scroll
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
    }, []);

    if (loading) return <p>Cargando permisos del rol...</p>;
    if (error) return <p>{error}</p>;

    // Ejemplo de cómo ocultar botones según los permisos
    const canCreate = rolePermissions.some(perm => perm.nombre === "Crear Curso");
    const canSection = rolePermissions.some(perm => perm.nombre === "Crear seccion");
    const canContent = rolePermissions.some(perm => perm.nombre === "Asignar contenido");
    const canEdit = rolePermissions.some(perm => perm.nombre === "Editar curso");
    const canShow = rolePermissions.some(perm => perm.nombre === "Ver curso");
    const canNotify = rolePermissions.some(perm => perm.nombre === "Notificar curso");
    const canDelete = rolePermissions.some(perm => perm.nombre === "Eliminar curso");

    return (
        <div className="bg-primaryAdmin overflow-hidden min-h-screen">
            <div className="flex h-full">
                <LeftBar onVisibilityChange={setIsLeftBarVisible} />
                <div
                    className={`w-full transition-all duration-300 ${
                        isLeftBarVisible ? "ml-56 max-w-full" : ""
                    }`}
                >
                    <Navbar />
                    <div className="flex flex-col mt-14">
                        <div className="px-4 md:px-12">
                            <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-2">
                                <h2 className="text-3xl text-purple-900 dark:text-primary font-bungee mb-4 md:mb-0">
                                    {t("courses.title")}
                                </h2>
                                <div className="flex flex-col md:flex-row items-center w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4">
                                    {canCreate &&
                                        <Button
                                            type="primary"
                                            style={{ backgroundColor: "#4c1d95" }}
                                            onClick={handleCreateCourseClick}
                                            className="w-full md:w-auto rounded-lg order-2 md:order-1 mt-6 sm:mt-4 md:mt-0"
                                        >
                                            <b>{t("courses.createCourse")}</b>
                                        </Button>
                                    }
                                    
                                    <div className="flex w-full md:w-auto px-4 py-2 border bg-white border-gray-300 rounded-xl shadow-lg order-1 md:order-2">
                                        <FaSearch
                                            size={"18px"}
                                            className="mt-1 mr-2"
                                        />
                                        <input
                                          type="search"
                                          className="bg-white outline-none w-full md:w-[280px] lg:w-[360px]"
                                          placeholder={t("datatable.SearchByName")}
                                          value={searchValue}
                                          onChange={(e) => setSearchValue(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center mt-4 md:mt-2">
                            <div className="overflow-auto w-full px-4 md:px-6 mx-4 md:mx-12 py-6 bg-secondaryAdmin rounded-xl shadow-lg shadow-purple-300 dark:shadow-purple-900">
                                <table className="min-w-full overflow-x-auto">
                                  <thead>
                                    <tr>
                                      <th className="text-lg px-3 py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                        {t("courses.id")}
                                      </th>
                                      <th className="text-lg px-3 py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                        {t("courses.category")}
                                      </th>
                                      <th className="text-lg px-3 py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                        {t("courses.name")}
                                      </th>
                                      <th className="text-lg px-20 w-[400px] py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                        {t("courses.description")}
                                      </th>
                                      <th className="text-lg px-2 py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                        {t("courses.userCount")}
                                      </th>
                                      <th className="px-4 py-3 bg-secondaryAdmin text-primary border-2 border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                        {t("courses.actions")}
                                      </th>
                                    </tr>
                                  </thead>
                                    <tbody>
                                        {filteredCourses
                                            .slice(
                                                (currentPage - 1) *
                                                    itemsPerPage,
                                                currentPage * itemsPerPage
                                            )
                                            .map((course, index) => (
                                                <tr key={course.id}>
                                                    <td className="border-2 border-x-transparent px-1 py-2 bg-secondaryAdmin text-primary text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                        {generateIds()[index]}
                                                    </td>
                                                    <td className="text-center border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                        {course.category}
                                                    </td>
                                                    <td className="border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                        {course.title}
                                                    </td>
                                                    <td className="border-2 border-x-transparent px-4 py-2 bg-secondaryAdmin text-primary text-lg text-center max-w-2xl break-words whitespace-normal border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                        {course.description}
                                                    </td>
                                                    <td className="border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                        {course.enrolledCount}
                                                    </td>
                                                    <td className="border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                      <div className="flex justify-center space-x-4">

                                                        <Button
                                                          className="bg-[#FFA010] text-white font-bold py-1.5 px-4 rounded-3xl min-w-[120px] shadow-md shadow-gray-400"
                                                          onClick={() => handleAdminButtonClick(course)}
                                                        >
                                                          Administrar Curso
                                                        </Button>
                                                          
                                                          {canSection && (
                                                              <Button
                                                                  className="bg-[#783CDA] text-white font-bold py-1.5 px-4 rounded-3xl min-w-[120px] shadow-md shadow-gray-400"
                                                                  onClick={() => handleSubCategoryButtonClick(course)}
                                                                  icon={<QrcodeOutlined />}
                                                              >
                                                                  {t("subCategory.ButtonCreate")}
                                                              </Button>
                                                          )}

                                                          {canContent && (
                                                              <Button
                                                                  className="bg-[#00D8A1] text-white font-bold py-1.5 px-4 rounded-3xl min-w-[120px] shadow-md shadow-gray-400"
                                                                  onClick={() => handleCreateResourceClick(course)}
                                                                  icon={<FileAddOutlined />}
                                                              >
                                                                  {t("courses.ButtonUpContent")}
                                                              </Button>
                                                          )}

                                                          {/* Menú desplegable para los botones de update, details, notify y delete */}
                                                          <div className="relative">
                                                            <Button
                                                              className="bg-gray-300 text-gray-700 font-bold py-1.5 px-4 rounded-full ml-0 shadow-md shadow-gray-400"
                                                              icon={<MoreOutlined />}
                                                              onClick={(e) => toggleDropdown(course.id, e)}
                                                            />
                                                              <div
                                                                className={`fixed transform transition-transform duration-150 ease-out bg-white border rounded-md shadow-lg z-50 flex flex-col space-y-1 ${
                                                                  openMenus[course.id] 
                                                                    ? "translate-x-0 opacity-100" 
                                                                    : "translate-x-2 opacity-0 pointer-events-none"
                                                                }`}
                                                                style={{
                                                                  top: `${menuPosition.top}px`,
                                                                  left: `${menuPosition.left + 5}px`,
                                                                  transformOrigin: 'top left'
                                                                }}
                                                                ref={menuRef}
                                                              >
                                                                {canEdit && (
                                                                  <Button
                                                                    className="bg-blue-500 hover:bg-sky-700 text-white font-bold py-1 px-4 transition-colors duration-200 whitespace-nowrap"
                                                                    icon={<ReloadOutlined />}
                                                                    onClick={() => handleUpdateButtonClick(course)}
                                                                  >
                                                                    {/* Botón de Editar */}
                                                                  </Button>
                                                                )}
                                                                {canShow && (
                                                                  <Button
                                                                    className="bg-purple-500 hover:bg-zinc-300 text-white font-bold py-1 px-4"
                                                                    icon={<InfoCircleOutlined />}
                                                                    onClick={() => handleDetailsButtonClick(course)}
                                                                  >
                                                                    {/* Botón de Ver Detalles */}
                                                                  </Button>
                                                                )}
                                                                {canNotify && (
                                                                  <Button
                                                                    className="bg-orange-500 hover:bg-zinc-300 text-white font-bold py-1 px-4"
                                                                    icon={<BellOutlined />}
                                                                    onClick={() => handleNotifyButtonClick(course)}
                                                                  >
                                                                    {/* Botón de Notificar */}
                                                                  </Button>
                                                                )}
                                                                {canDelete && (
                                                                  <Button
                                                                    className="bg-red-500 hover:bg-zinc-300 text-white font-bold py-1 px-4"
                                                                    icon={<DeleteOutlined />}
                                                                    onClick={() => handleDeleteButtonClick(course)}
                                                                  >
                                                                    {/* Botón de Eliminar */}
                                                                  </Button>
                                                                )}
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                                {totalPages > 1 && (
                                  <div className="flex justify-end items-center mt-5 space-x-2">
                                    <span className="text-gray-500">
                                      {`${(currentPage - 1) * itemsPerPage + 1} - ${
                                        currentPage * itemsPerPage > totalItems
                                          ? totalItems
                                          : currentPage * itemsPerPage
                                      }`}{" "}
                                      {t("datatable.of")} {totalItems}
                                    </span>
                                    <div className="flex">
                                      <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-2 py-1 rounded-full ${
                                          currentPage === 1
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-gray-800 dark:text-primary"
                                        }`}
                                      >
                                        <FaChevronLeft size={18} />
                                      </button>
                                      <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-2 py-1 rounded-full ${
                                          currentPage === totalPages
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-gray-800 dark:text-primary"
                                        }`}
                                      >
                                        <FaChevronRight size={18} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                            </div>
                        </div>
                    </div>

          <AdminCoursesModal 
            visible={isAdminModalVisible}
            onClose={handleAdminModalClose}
            courseId={selectedCourseId}
          />

          <CreateCourseForm
            visible={showCreateForm}
            onClose={handleCreateFormClose}
            onCreate={handleCreateCourse}
          />

          <UpdateCourseForm
            visible={showUpdateForm}
            onClose={handleUpdateFormClose}
            onUpdate={handleUpdateCourse}
            courseId={selectedCourse ? selectedCourse.id : null}
          />

          <CreateResourceModal
            isVisible={isCreateModalVisible}
            onCancel={() => setIsCreateModalVisible(false)}
            courseId={selectedCourse?.id}
            onCreate={handleCreateResource}
            resourceFile={resourceFile}
            onFileChange={(e) => setResourceFile(e.target.files[0])}
          />

          <CreateSubCategoryForm
            isVisible={subCategoryForm}
            onCancel={() => setSubCategoryForm(false)}
            courseId={selectedCourseId}
          />

          <DeleteConfirmationModal
            visible={isDeleteModalVisible}
            onClose={() => setIsDeleteModalVisible(false)}
            onConfirm={handleDeleteConfirm}
            courseName={courseToDelete?.title}
          />

          <CourseDetailsModal
            visible={isDetailsModalVisible}
            onClose={() => setIsDetailsModalVisible(false)}
            course={selectedCourseDetails}
          />

          <NotifyCourseModal
            visible={isNotifyModalVisible}
            onClose={() => setIsNotifyModalVisible(false)}
            courseId={selectedCourse?.id}
            onSendEmail={handleSendNotification}
          />
        </div>
      </div>
    </div>
  );
};

export default DataTablete;
