import React, { useState, useEffect } from "react";
import { Button, Form } from "antd";
import {
  ReloadOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import LeftBar from "../../Dashboard/LeftBar";
import { useCategoryContext } from "../../../context/courses/category.context";
import CreateCategoryForm from "./CreateCategoryForm";
import Navbar from "../NavBar";
import DeleteCategory from "./DeleteCategory";
import DetailsCategoryModal from "./DetailsCategoryModal";
import UpdateCategoryModal from "./UpdateCategoryModal";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";

import { useUserContext } from "../../../context/user/user.context";
import { useAuth } from "../../../context/auth.context";
import { usePermissionContext } from "../../../context/user/permissions.context";

const DataTablete = () => {
  const { t } = useTranslation("global");
  const {
    getCategories,
    categories,
    deleteCategory,
    deleteOnlyCategory,
    createCategory,
    updateCategory,
  } = useCategoryContext();
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [isLeftBarVisible, setIsLeftBarVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(null);
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [dataFlag, setDataFlag] = useState(false);

  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const { getUserById } = useUserContext();
  const { permissionsData, rolePermissions, loading, error, getPermissionsByRole } = usePermissionContext();
  const [ permisosByRol, setPermisosByRol ] = useState("");

  useEffect(() => {
  }, [dataFlag]);

  useEffect(() => {
    const filteredCategory = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        category.description.toLowerCase().includes(searchValue.toLowerCase())
    );

    setTotalItems(filteredCategory.length);
    setTotalPages(Math.ceil(filteredCategory.length / itemsPerPage));
  }, [categories, searchValue, itemsPerPage]);

  useEffect(() => {
    const fetchUserData = async () => {
        if (user && user.data && user.data.id) {
            try {
                // Obtener datos del usuario
                const userData = await getUserById(user.data.id);
                setUsername(userData.username); // Guarda el nombre de usuario (u otra información)
                
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

  const handleCreateCategory = async (category) => {
    try {
      await createCategory(category);
      Swal.fire({
        title: t("categories.createSuccess"),
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setDataFlag((prevFlag) => !prevFlag);
    } catch (error) {
      Swal.fire({
        title: t("categories.createError"),
        icon: "error",
        timer: 1500,
        showConfirmButton: true,
      });
    } finally {
      setShowCategoryForm(false);
    }
  };

  const handleUpdateSubmit = async (values) => {
    try {
      const updatedCategory = await updateCategory(selectedCategory.id, values);
      Swal.fire({
        title: t("categories.updateSuccess"),
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      // Actualizar el estado local de las categorías
      const updatedCategories = categories.map(cat => 
        cat.id === selectedCategory.id ? updatedCategory : cat
      );
      getCategories(updatedCategories);
      setDataFlag((prevFlag) => !prevFlag);
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

  const handleDeleteConfirm = async () => {
    try {
      await deleteCategory(categoryToDelete.id);
      Swal.fire({
        title: t("categories.deleteSuccess"),
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setDataFlag((prevFlag) => !prevFlag);
    } catch (error) {
      Swal.fire({
        title: t("categories.deleteError"),
        icon: "error",
        timer: 1500,
        showConfirmButton: true,
      });
    } finally {
      setIsDeleteModalVisible(false);
      setCategoryToDelete(null);
    }
  };

  const handleDeleteOnlyConfirm = async () => {
    try {
      await deleteOnlyCategory(categoryToDelete.id);
      Swal.fire({
        title: t("categories.deleteSuccess"),
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setDataFlag((prevFlag) => !prevFlag);
    } catch (error) {
      const errorMessage = error.response?.status === 404 
        ? t("categories.auxiliaryNotFound") 
        : t("categories.deleteError");
      
      Swal.fire({
        title: errorMessage,
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setIsDeleteModalVisible(false);
      setCategoryToDelete(null);
    }
  };

  const handleCreateCategoryClick = () => {
    setSelectedCategory(null);
    setShowCategoryForm(true);
  };

  const handleCategoryFormClose = () => {
    setShowCategoryForm(false);
    setSelectedCategory(null);
  };

  const handleDetailsButtonClick = (category) => {
    setSelectedCategory(category);
    setShowDetailsModal(true);
  };

  const handleDetailsModalClose = () => {
    setShowDetailsModal(false);
    setSelectedCategory(null);
  };

  const handleUpdateButtonClick = (category) => {
    setSelectedCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
    });
    setImagePreview(category.image);
    setShowUpdateModal(true);
  };

  const handleUpdateModalClose = () => {
    setShowUpdateModal(false);
    setSelectedCategory(null);
    form.resetFields();
    setImagePreview(null);
  };

  const handleDeleteButtonClick = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalVisible(false);
    setCategoryToDelete(null);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const generateIds = () => {
    const filteredCategory = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        category.description.toLowerCase().includes(searchValue.toLowerCase())
    );

    return filteredCategory
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .map((_, index) => index + 1 + (currentPage - 1) * itemsPerPage);
  };

  const filteredCategory = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      category.description.toLowerCase().includes(searchValue.toLowerCase())
  );

  if (loading) return <p>Cargando permisos del rol...</p>;
  if (error) return <p>{error}</p>;

  // Ejemplo de cómo ocultar botones según los permisos
  const canCreate = rolePermissions.some(perm => perm.nombre === "Crear categoria");
  const canEdit = rolePermissions.some(perm => perm.nombre === "Editar categoria");
  const canShow = rolePermissions.some(perm => perm.nombre === "Ver categoria");
  const canDelete = rolePermissions.some(perm => perm.nombre === "Eliminar categoria");

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
                  {t("categories.title")}
                </h2>
                <div className="flex flex-col md:flex-row items-center w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4">
                  
                  {canCreate &&
                    <Button
                      type="primary"
                      style={{ backgroundColor: "#4c1d95" }}
                      onClick={handleCreateCategoryClick}
                      className="w-full md:w-auto rounded-lg order-2 md:order-1 mt-6 sm:mt-4 md:mt-0"
                    >
                      <b>{t("categories.createCategory")}</b>
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
                      <th className="text-lg px-3 py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                        {t("categories.id")}
                      </th>
                      <th className="text-lg px-3 py-3  bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                        {t("categories.name")}
                      </th>
                      <th className="text-lg px-20 w-[560px] py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                        {t("categories.description")}
                      </th>
                      <th className="px-5 py-3 bg-secondaryAdmin text-primary text-lg border-2 border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
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
                      .map((category, index) => (
                        <tr key={category.id}>
                          <td className="border-2 border-x-transparent px-1 py-2 bg-secondaryAdmin text-primary text-lg text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                            {category.id}
                          </td>
                          <td className="text-center border-2 border-x-transparent px-3 py-2 bg-secondaryAdmin text-primary text-lg border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                            {category.name}
                          </td>
                          <td className="border-2 border-x-transparent px-2 py-2 bg-secondaryAdmin text-primary text-lg text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                            {category.description}
                          </td>
                          <td className="border-2 border-x-transparent px-3 py-2 bg-secondaryAdmin text-primary text-lg text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
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
                                  onClick={() =>
                                    handleDetailsButtonClick(category)
                                  }
                                />
                              }
                              
                              {canDelete &&
                                <Button
                                  className="bg-red-500 hover:bg-zinc-300 text-white font-bold py-1.5 px-4 rounded-3xl ml-2 shadow-md shadow-gray-400"
                                  icon={<DeleteOutlined />}
                                  style={{ minWidth: "50px" }}
                                  onClick={() =>
                                    handleDeleteButtonClick(category)
                                  }
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

          <CreateCategoryForm
            visible={showCategoryForm}
            onClose={handleCategoryFormClose}
            onCreate={handleCreateCategory}
            category={selectedCategory}
          />

          <DeleteCategory
            visible={isDeleteModalVisible}
            onClose={handleDeleteModalClose}
            onConfirm={handleDeleteConfirm}
            onConfirmOnly={handleDeleteOnlyConfirm}
          />

          <DetailsCategoryModal
            visible={showDetailsModal}
            onClose={handleDetailsModalClose}
            category={selectedCategory}
          />

          <UpdateCategoryModal
            visible={showUpdateModal}
            onClose={handleUpdateModalClose}
            onUpdate={handleUpdateSubmit}
            category={selectedCategory}
            form={form}
            imagePreview={imagePreview}  // Aquí estaba mal escrito
          />
        </div>
      </div>
    </div>
  );
};

export default DataTablete;
