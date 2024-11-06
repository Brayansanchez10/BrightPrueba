import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LeftBar from "../../Dashboard/LeftBar";
import { Button, Form } from "antd";
import Swal from "sweetalert2";
import Navbar from "../NavBar";
import { useForumCategories } from "../../../context/forum/forumCategories.context";
import { useTranslation } from "react-i18next";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { ReloadOutlined, InfoCircleOutlined, DeleteOutlined } from "@ant-design/icons";

import CreateForumCategoriesModal from "./createForumCategory.jsx";
import UpdateCategoriesForum from "./updateForumCategory.jsx";
import DetailsCategoryForumModal from "./DetailsCategoriesForum.jsx";
import DeleteForumCategory from "./deleteForumCategories.jsx";

import { useAuth } from "../../../context/auth.context.jsx";
import { useUserContext } from "../../../context/user/user.context.jsx";
import { usePermissionContext } from "../../../context/user/permissions.context.jsx";
import * as BsIcons from 'react-icons/ai';

const DataTablete = () => {
    const { t } = useTranslation("global");
    const { categories, getAllForumCategories, deleteForumCategory, updateForumCategories } = useForumCategories();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [dataFlag, setDataFlag] = useState(false);
    const [isLeftBarVisible, setIsLeftBarVisible] = useState(false);

    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); 
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [form] = Form.useForm();

    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { user } = useAuth();
    const [username, setUsername] = useState("");
    const { getUserById } = useUserContext();
    const { permissionsData, rolePermissions, loading, error, getPermissionsByRole } = usePermissionContext();
    const [ permisosByRol, setPermisosByRol ] = useState("");

    const [entityId, setEntityId] = useState(null);

    const [forumActive, setForumActive] = useState(true);

    // Modal de creación
    useEffect(() => {
        getAllForumCategories(); // Asegúrate de cargar las categorías al inicio
    }, []);

    useEffect(() => {
        const filteredCategory = categories.filter(
            (category) =>
                (category.name && category.name.toLowerCase().includes(searchValue.toLowerCase())) ||
                (category.description && category.description.toLowerCase().includes(searchValue.toLowerCase()))
        );
    
        setTotalItems(filteredCategory.length);
        setTotalPages(Math.ceil(filteredCategory.length / itemsPerPage));
    }, [categories, searchValue, itemsPerPage]);

    useEffect(() => {
        const forumState = localStorage.getItem("forumActive");
    
        // Si forumState no está en localStorage, establecemos el foro como activado (true)
        setForumActive(forumState === "true" || forumState === null);
    }, []);
    
    const toggleForumStatus = () => {
        const newStatus = !forumActive;
        setForumActive(newStatus);
        localStorage.setItem("forumActive", newStatus); // Guardamos el estado en localStorage
    };

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
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 600) {
                setItemsPerPage(6);
            } else if (width < 1024) {
                setItemsPerPage(10);
            } else {
                setItemsPerPage(10);
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
        // Filtrado inicial por el valor de búsqueda
        const searchFiltered = categories.filter(
            (category) =>
                (category.name && category.name.toLowerCase().includes(searchValue.toLowerCase())) ||
                (category.description && category.description.toLowerCase().includes(searchValue.toLowerCase()))
        );
    
        // Filtrado adicional por entityId del usuario
        const entityFiltered = searchFiltered.filter(
            (category) => entityId === 1 || category.entityId === entityId // Cambia la condición según tu lógica
        );
    
        // Paginar los cursos filtrados
        const paginatedCourses = entityFiltered.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    
        // Generar los IDs para los cursos paginados
        return paginatedCourses.map((_, index) => index + 1 + (currentPage - 1) * itemsPerPage);
      };

      // También actualiza la variable filteredCourses si es necesaria en tu componente
    const filteredCategory = categories.filter(
        (category) =>
            (category.name && category.name.toLowerCase().includes(searchValue.toLowerCase())) ||
            (category.description && category.description.toLowerCase().includes(searchValue.toLowerCase()))
    ).filter(
        (category) => entityId === 1 || category.entityId === entityId // Filtrado por entityId
    );


    const handleCreateCategoryClick = () => {
        setSelectedCategory(null);
        setShowCategoryForm(true);
    };

    const handleCategoryFormClose = async () => {
        try {
            // Después de crear la categoría, vuelve a cargar todas las categorías.
            await getAllForumCategories();
            setShowCategoryForm(false);
        } catch (error) {
            console.error("Error creating category: ", error);
        }
    };


    const handleDeleteRole = (category) => {
        setSelectedCategory(category.id);
        setShowDeleteModal(true);
    };
   

    const handleUpdateSubmit = async (values) => {
        try {
          await updateForumCategories(selectedCategory.id, values);
          Swal.fire({
            title: t("categories.updateSuccess"),
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: t("categories.updateError"),
            icon: "error",
            timer: 1500,
            showConfirmButton: true,
          });
        } finally {
          handleUpdateModalClose();
        }
      };


    const handleUpdateButtonClick = (category) => {
        setSelectedCategory(category);
        form.setFieldsValue({
          name: category.name,
          description: category.description,
          icons: category.icons,
        });
        setShowUpdateModal(true);
      };
    
      const handleUpdateModalClose = async () => {
        try {
            // Después de crear la categoría, vuelve a cargar todas las categorías.
            await getAllForumCategories();
            setShowUpdateModal(false);
        } catch (error) {
            console.error("Error creating category: ", error);
        }
      };


      const handleDetailsButtonClick = (category) => {
        setSelectedCategory(category);
        setShowDetailsModal(true);
      };
    
      const handleDetailsModalClose = () => {
        setShowDetailsModal(false);
        setSelectedCategory(null);
      };

      if (loading) return <p>Cargando permisos del rol...</p>;
      if (error) return <p>{error}</p>;
    
        // Ejemplo de cómo ocultar botones según los permisos
        const canCreate = rolePermissions.some(perm => perm.nombre === "Crear Foro");
        const canEdit = rolePermissions.some(perm => perm.nombre === "Editar Foro");
        const canShow = rolePermissions.some(perm => perm.nombre === "Ver Foro");
        const canDelete = rolePermissions.some(perm => perm.nombre === "Eliminar Foro");
        const canActivate = rolePermissions.some(perm => perm.nombre === "Activar Foro");

    return (
        <div className="bg-primaryAdmin overflow-hidden min-h-screen">
            <div className="flex h-full">
                <LeftBar onVisibilityChange={setIsLeftBarVisible} />
                <div
                    className={`w-full transition-all duration-300 ${isLeftBarVisible ? "ml-56 max-w-full" : ""}`}
                >
                    <Navbar />
                    <div className="flex flex-col mt-14">
                        <div className="px-4 md:px-12">
                            <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-2">
                               <h2 className="text-3xl text-purple-900 dark:text-primary font-bungee mb-4 md:mb-0">
                                    {t("forumCrud.title")}
                                </h2>
                                <div className="flex flex-col md:flex-row items-center w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4">
                                    {canActivate &&
                                        <Button
                                            type="primary"
                                            className="w-full md:w-auto rounded-lg order-2 md:order-1 mt-6 sm:mt-4 md:mt-0"
                                            onClick={toggleForumStatus}
                                            style={{
                                                backgroundColor: forumActive ? "#f00" : "#0f0",
                                                color: "White",
                                            }}
                                        >
                                            {forumActive ? t("forumCategory.forumDesactivate") : t("forumCategory.forumActivate")}
                                        </Button>
                                    }
                                    

                                    {canCreate &&
                                        <Button
                                            type="primary"
                                            style={{ backgroundColor: "#4c1d95" }}
                                            className="w-full md:w-auto rounded-lg order-2 md:order-1 mt-6 sm:mt-4 md:mt-0"
                                            onClick={handleCreateCategoryClick}
                                        >
                                            <b>{t("forumCrud.button")}</b>
                                        </Button>
                                    }
                                    
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
                            </div>
                        </div>
                        <div className="flex justify-center mt-4 md:mt-2">
                            <div className="overflow-auto w-full px-4 md:px-6 mx-4 md:mx-12 py-6 bg-secondaryAdmin rounded-xl shadow-lg shadow-purple-300 dark:shadow-purple-900">
                                <table className="min-w-full overflow-x-auto">
                                    <thead>
                                        <tr>
                                            <th className="text-lg py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                {t("categories.id")}
                                            </th>
                                            <th className="text-lg py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                {t("categories.name")}
                                            </th>
                                            <th className="text-lg py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                {t("categories.description")}
                                            </th>
                                            <th className="text-lg py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                {t("forumCategory.tableIcons")}
                                            </th>
                                            <th className="py-3 bg-secondaryAdmin text-primary text-lg border-2 border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                {t("categories.actions")}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCategory
                                            .slice(
                                                (currentPage - 1) * itemsPerPage,
                                                currentPage * itemsPerPage
                                            )
                                            .map((category) => (
                                                <tr key={category.id}>
                                                    <td className="border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                        {category.id}
                                                    </td>
                                                    <td className="text-center border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                        {category.name}
                                                    </td>
                                                    <td className="border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                        {category.description}
                                                    </td>
                                                    <td className="border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257] flex items-center justify-center">
                                                        {category.icons && BsIcons[category.icons] ? (
                                                            React.createElement(BsIcons[category.icons], { style: { width: "50px", height: "50px" } })
                                                        ) : (
                                                            <span>No icon</span>
                                                        )}
                                                    </td>
                                                    <td className="border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                        <div className="flex justify-center space-x-4">
                                                            
                                                            {canEdit &&
                                                                <Button
                                                                    className="bg-blue-500 hover:bg-sky-700 text-white font-bold py-1.5 px-4 rounded-3xl shadow-md shadow-gray-400"
                                                                    icon={<ReloadOutlined />}
                                                                    style={{ minWidth: "50px" }}
                                                                    onClick={() =>
                                                                        handleUpdateButtonClick(category)
                                                                    }
                                                                />
                                                            }
                                                            
                                                            {canShow &&
                                                                <Button
                                                                    className="bg-purple-500 hover:bg-zinc-300 text-white font-bold py-1.5 px-4 rounded-3xl ml-2 shadow-md shadow-gray-400"
                                                                    icon={<InfoCircleOutlined />}
                                                                    style={{ minWidth: "50px" }}
                                                                    onClick={() => handleDetailsButtonClick(category)}
                                                                />
                                                            }
                                                            
                                                            {canDelete &&
                                                                <Button
                                                                    className="bg-red-500 hover:bg-zinc-300 text-white font-bold py-1.5 px-4 rounded-3xl ml-2 shadow-md shadow-gray-400"
                                                                    icon={<DeleteOutlined />}
                                                                    onClick={() => handleDeleteRole(category)} // Llama a handleRemove al hacer clic
                                                                    style={{ minWidth: "50px" }}
                                                                />
                                                            }
                                                            
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

                    <CreateForumCategoriesModal 
                        visible={showCategoryForm}
                        onClose={handleCategoryFormClose}
                        onCreate={() => setShowCategoryForm(false)}
                        form={form}
                        category={selectedCategory}
                    />
                    <UpdateCategoriesForum 
                        visible={showUpdateModal}
                        onClose={handleUpdateModalClose}
                        onUpdate={handleUpdateSubmit}
                        category={selectedCategory}
                        form={form}
                        categories={categories}
                    />
                    <DetailsCategoryForumModal
                        visible={showDetailsModal}
                        onClose={handleDetailsModalClose}
                        category={selectedCategory}
                    />

                    <DeleteForumCategory 
                        visible={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        category={selectedCategory}
                        deleteForumCategory = {deleteForumCategory}
                    />
                </div>
            </div>
        </div>
    );
};

export default DataTablete;
