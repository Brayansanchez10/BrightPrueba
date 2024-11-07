import React, { useState, useEffect } from "react";
import { Modal, Button, Card, Collapse, Select, Input } from "antd";
// Importar Contexts
import { useAuth } from "../../../context/auth.context.jsx";
import { useUserContext } from "../../../context/user/user.context.jsx";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import {
  createSubCategory,
  getSubCategoryCourseId,
  deleteSubcategory,
} from "../../../api/courses/subCategory.requst.js";
import UpdateSubCategoryForm from "./UpdateSubCategoryForm.jsx";
import { EditOutlined, DeleteFilled, FilePdfOutlined } from "@ant-design/icons";
import image from "../../../assets/img/Zorro.png";
import image2 from "../../../assets/img/hola1.png";

const { Panel } = Collapse;
const { Option } = Select;

const CreateSubCategoryForm = ({
  isVisible,
  onCancel,
  onCreate,
  visible,
  onClose,
  courseId,
}) => {
  const { getUserById } = useUserContext();
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subCategory, setSubCategory] = useState([]);
  const [errors, setErrors] = useState({});
  const { t } = useTranslation("global");
  const MAX_DESCRIPTION_LENGTH = 150;
  const [activeTab, setActiveTab] = useState("crear");
  const [selectedsubCategory, setSelectedSubCategory] = useState(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.data && user.data.id) {
        try {
          const userData = await getUserById(user.data.id);
          setUsername(userData.id);
          console.log("Información de usuario:", userData.id);
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
        }
      }
    };

    fetchUserData();
  }, [user, getUserById]);

  useEffect(() => {
    if (!visible) {
      resetState();
    }
  }, [visible]);

  useEffect(() => {
    if (isVisible && courseId) {
      fetchSubCategories(courseId);
    } else {
      setSubCategory([]);
    }
  }, [isVisible, courseId]);

  // Función para obtener los subCategories por CourseId
  const fetchSubCategories = async (courseId) => {
    try {
      const response = await getSubCategoryCourseId(courseId);
      console.log("SubCategory data:", response.data);
      setSubCategory(response.data);
    } catch (error) {
      console.error("Error al obtener los Sub Categories By CourseId", error);
    }
  };

  //Función de validación
  const validateFields = () => {
    const newErrors = {};

    // Validación del título (mínimo 3 caracteres y máximo 30 caracteres)
    if (!title || title.length < 3) {
      newErrors.title = t("UpdateResource.ValidateTitle");
    } else if (title.length > 30) {
      newErrors.title = t("subCategory.titleTooShort"); // Nuevo mensaje para límite de caracteres
    }

    // Validación de la descripción (mínimo 8 caracteres)
    if (!description || description.length < 8) {
      newErrors.description = t("UpdateResource.ValidateDescription");
    }

    setErrors(newErrors);

    // Si no hay errores, retorna true, de lo contrario false
    return Object.keys(newErrors).length === 0;
  };

  // Función para cambiar la pestaña activa
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Función para resetear Estado de campos
  const resetState = () => {
    setTitle("");
    setDescription("");
    setSelectedSubCategory(null);
    setEditModalVisible(false);
  };

  const handleCancel = () => {
    resetState();
    onCancel();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateFields()) {
      return; // Si hay errores, no envía el formulario
    }
  
    const SubCategoryData = {
      courseId,
      title,
      description,
    };
  
    try {
      await createSubCategory(SubCategoryData);
      Swal.fire({
        icon: "success",
        title: t("subCategory.AlertSuccess"),
        timer: 1000,
        showConfirmButton: false,
      }).then(() => {
        onCreate(SubCategoryData);
      });
      fetchSubCategories(courseId); // Actualizar la lista de Sub Categories tras crear uno nuevo
      resetState();
    } catch (error) {
      console.error(error);
      
      // Verificar si el error es debido a un título duplicado
      if (error.response && error.response.data && error.response.data.error === "Ya existe una subcategoría con este nombre para este curso.") {
        Swal.fire({
          icon: "error",
          title: t("subCategory.AlertDuplicate"),
          timer: 3000,
          showConfirmButton: true,
        });
      } else {
        console.error(error);
      }
    }
  };

  const handleRemoveSubCategory = async (sub) => {
    try {
      await deleteSubcategory(sub.id); // Asegúrate de que sub.id contenga el identificador correcto.
      Swal.fire({
        icon: "success",
        title: t("subCategory.AlertSuccessDelete"),
        showConfirmButton: false,
        timer: 700,
      });

      // Actualizar la lista de subcategorías después de la eliminación
      // Asegúrate de actualizar el estado localmente si `fetchSubCategories` no está actualizando
      setSubCategory((prevSubcategories) =>
        prevSubcategories.filter((subcategory) => subcategory.id !== sub.id)
      );

      // Si `fetchSubCategories` es una función que vuelve a traer las subcategorías desde el servidor
      await fetchSubCategories(courseId);

      // Si fetchSubCategories es una llamada asíncrona que obtiene las subcategorías
      if (subCategory.length === 1) {
        setSubCategory([]); // Forzar el estado a vacío si se elimina la última subcategoría
      }
    } catch (error) {
      console.error("Error al eliminar una subCategory:", error);
      Swal.fire({
        icon: "error",
        title: t("subCategory.AlertErrorDelete"),
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };

  const openEditModal = (sub) => {
    setSelectedSubCategory(sub);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setSelectedSubCategory(null);
  };

  return (
    <Modal
      title=""
      visible={isVisible}
      onCancel={onCancel}
      footer={null}
      width={1200}
      bodyStyle={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "75vh",
      }}
    >
      <div className="mb-4 sm:block md:hidden lg:hidden  absolute top-0 left-0">
        <button
          onClick={() => handleTabChange("crear")}
          className={`px-6 py-2 rounded-ss-md ${
            activeTab === "recursos"
              ? "bg-gray-100 text-black"
              : "bg-red-800 text-white"
          }`}
        >
          {t('courses.section')}
        </button>
        <button
          onClick={() => handleTabChange("recursos")}
          className={`px-6 py-2 ${
            activeTab === "crear"
              ? "bg-gray-100 text-black"
              : "bg-red-800 text-white"
          }`}
        >
          {t('courses.resource')}
        </button>
      </div>
      <div className="custom flex justify-center items-center h-full w-full">
        <div className="flex gap-8 h-full w-full">
          {/* Panel Izquierda */}
          <div
            className={`w-full rounded-lg shadow-lg overflow-y-auto overflow-auto scrollbar-hide mt-6 ${
              activeTab === "crear" ? "block" : "hidden"
            } sm:w-1/2 sm:block`}
            style={{ maxHeight: "700px" }}
          >
            <div className="relative w-full h-[125px] bg-gradient-to-r from-[#FF4943] to-[#1E1034] rounded-t-2xl flex items-center justify-center">
              <img
                src={image}
                alt="Imagen de la cabecera"
                className="w-[189.69px] h-[148px] object-contain mt-8"
              />
            </div>
            <h3 className="text-xl font-bold mt-6 text-center text-red-800">
              {t("subCategory.ModalTitle")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 p-4">
              {subCategory.length > 0 ? (
                subCategory.map((sub) => (
                    <Card
                    key={sub.id}
                    className="bg-white shadow-md rounded-lg p-4 transition-transform transform hover:scale-105"
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                      {/* Título */}
                      <h3 className="text-xl font-bold text-gray-800 mb-2 lg:mb-0">
                        {sub.title}
                      </h3>
                  
                      {/* Botones */}
                      <div className="flex flex-col sm:flex-row lg:flex-row lg:ml-auto space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-2">
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => openEditModal(sub)}
                          className="bg-yellow-500 text-white hover:bg-yellow-600"
                        ></Button>
                  
                        <Button
                          icon={<DeleteFilled />}
                          onClick={() => {
                            Swal.fire({
                              title: t("CreateResource.AlertDeleteTitle"),
                              text: t("CreateResource.AlertDeleteText"),
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#28a745",
                              cancelButtonColor: "#d35",
                              confirmButtonText: t("CreateResource.AlertDeleteConfir"),
                              reverseButtons: true,
                            }).then((result) => {
                              if (result.isConfirmed) {
                                handleRemoveSubCategory(sub);
                                Swal.fire({
                                  title: t("CreateResource.AlerteSuccesyDelete"),
                                  text: t("CreateResource.DeleteResource"),
                                  icon: "success",
                                });
                              }
                            });
                          }}
                          className="bg-red-700 text-white hover:bg-red-600"
                        ></Button>
                      </div>
                    </div>
                  
                    {/* Descripción */}
                    <p className="text-gray-600 mt-2">{sub.description}</p>
                  </Card>
                ))
              ) : (
                <p className="text-gray-600">No hay recursos</p>
              )}
            </div>
          </div>

          {/* Formulario Derecha */}
          <div
            className={`w-full rounded-lg shadow-lg overflow-y-auto bg-white mt-6 ${
              activeTab === "recursos" ? "block" : "hidden"
            } sm:w-1/2 sm:block`}
            style={{ maxHeight: "700px" }}
          >
            <div className="relative w-full h-[125px] bg-gradient-to-r from-[#1E1034] to-[#FF4943] rounded-t-2xl items-center flex justify-center">
              <h3 className="text-2xl font-bold text-white ml-2">
                {t("subCategory.FormTitle")}
              </h3>
              <img
                src={image2}
                alt="Imagen de la cabecera"
                className="w-[80x] h-[80px] object-contain mr-2"
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 px-4 py-2">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("subCategory.title")}
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`mt-1 block w-full px-4 py-2 rounded-lg border ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
                  maxLength={30}
                  required
                ></input>
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("subCategory.description")}
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  className={`mt-1 block w-full px-4 py-2 rounded-lg border ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
                  required
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
                <div className="text-gray-600 text-right mt-1">
                  {description.length}/{MAX_DESCRIPTION_LENGTH}
                </div>
              </div>

              <div className="flex justify-between gap-4 mt-6">
                <Button
                  htmlType="submit"
                  className="bg-green-500 text-white"
                >
                  {t("subCategory.ButtonCreate")}
                </Button>
                <Button
                  onClick={handleCancel}
                  className="bg-red-500 text-white"
                >
                  {t("subCategory.ButtonCancel")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {isEditModalVisible && (
        <UpdateSubCategoryForm
          isVisible={isEditModalVisible}
          onCancel={closeEditModal}
          subCategoryData={selectedsubCategory}
          onUpdate={() => fetchSubCategories(courseId)}
        />
      )}
    </Modal>
  );
};

export default CreateSubCategoryForm;
