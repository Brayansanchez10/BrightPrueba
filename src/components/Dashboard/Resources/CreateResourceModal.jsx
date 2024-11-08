import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "antd";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "../css/Custom.css";
import { getSubCategoryCourseId } from "../../../api/courses/subCategory.requst.js";
import { createResource, getResource, deleteResource } from "../../../api/courses/resource.request";
import UpdateResourceForm from "./UpdateResourceForm";
import image from "../../../assets/img/Zorro.png";
import image2 from "../../../assets/img/hola1.png";
import { validateFields, validateQuizzes, isValidLink, getInitialState, ALLOWED_FILE_TYPES } from "./components/resourceUtils.js";
import RenderLeftContent from "./components/RenderLeftContent.jsx";
import RenderRightContent from "./components/RenderRightContent.jsx";

const CreateResourceModal = ({ isVisible, onCancel, courseId, onCreate, visible }) => {
  // Hook para traducciones
  const { t } = useTranslation("global");

  // Estados para gestionar el formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attempts, setAttempts] = useState("");
  const [link, setLink] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [resources, setResources] = useState([]);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [type, setType] = useState("file");
  const [selection, setSelection] = useState("file"); // Estado para seleccionar entre archivo y enlace
  const [quizzes, setQuizzes] = useState([]); // Estado para quizzes
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("crear");
  const [subCategory, setSubCategory] = useState([]);
  const [subcategoryId, setSubcategoryId] = useState("");

  // Efecto para cargar recursos y subcategorías cuando el modal está visible
  useEffect(() => {
    if (isVisible && courseId) {
      fetchResources(courseId);
      fetchSubCategories(courseId);
    } else {
      setResources([]); // Limpiar los recursos al cerrar la modal
      setSubCategory([]);
    }
  }, [isVisible, courseId]);

  // Efecto para resetear los campos del formulario al cerrar la modal
  useEffect(() => {
    if (!visible) {
      resetState();
    }
  }, [visible]);

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
  
  // Función para obtener los recursos por CourseId
  const fetchResources = async (courseId) => {
    try {
      const response = await getResource(courseId);
      setResources(response.data);
    } catch (err) {
      console.error("Error al obtener los recursos:", err);
      toast.error("Error al obtener los recursos");
    }
  };

  // Función para resetear los campos del formulario
  const resetState = () => {
    const initialState = getInitialState();
    Object.keys(initialState).forEach((key) => {
      if (typeof initialState[key] === "function") {
        initialState[key]("");
      } else {
        eval(`set${key.charAt(0).toUpperCase() + key.slice(1)}`)(
          initialState[key]
        );
      }
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Llamar a la validación de los campos
    if (!validateFields()) {
      return; // Si hay errores en los campos, no envía el formulario
    }

    // Validar los quizzes antes de enviar el formulario
    if (!validateQuizzes()) {
      return; // Si hay errores en los quizzes, no envía el formulario
    }

    // Verificar si el usuario eligió un archivo o un quiz
    if (selection === "link" && link && !isValidLink(link)) {
      Swal.fire({
        icon: "warning",
        title: t("CreateResource.InvalidLink"),
        text: t("UpdateResource.Validatelink"),
        showConfirmButton: false,
        timer: 2500,
      });
      return;
    }

    // Validar que el usuario haya elegido subir un archivo o un quiz
    if (selection === "file" && !selectedFile && quizzes.length === 0) {
      Swal.fire({
        icon: "error",
        title: t("Error"),
        text: t("CreateResource.PleaseSelectFileOrQuiz"),
        showConfirmButton: false,
        timer: 3000,
      });
      return; // No envía el formulario si ambos están vacíos
    }

    // Construir el objeto de datos del recurso
    const resourceData = {
      courseId,
      title,
      subcategoryId,
      description,
      link: selection === "link" ? link : null,
      file: selection === "file" ? selectedFile : null,
      attempts,
      quizzes: quizzes.map((quiz) => ({
        question: quiz.question,
        options: quiz.options,
        correctAnswer: quiz.correctAnswer,
      })),
    };

    try {
      await createResource(resourceData);
      Swal.fire({
        icon: "success",
        title: t("CreateResource.Create"),
        showConfirmButton: false,
        timer: 1000,
      });
      onCreate();
      fetchResources(courseId); // Actualizar la lista de recursos tras crear uno nuevo

      // Resetear campos del formulario
      resetState();
    } catch (error) {
      console.error(error);

      // Manejar errores específicos
      if ( error.response && error.response.data && error.response.data.error === "Ya existe un recurso con este nombre para esta subCategory." ) {
        Swal.fire({
          icon: "error",
          title: t("UpdateResource.AlertDuplicate"),
          timer: 3000,
          showConfirmButton: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: t("UpdateResource.ErrorAlert"),
          showConfirmButton: false,
          timer: 700,
        });
      }
    }
  };

  // Función para manejar el cambio de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tamaño del archivo (10MB = 10 * 1024 * 1024 bytes)
    if (file.size > 10 * 1024 * 1024) {
        Swal.fire({
            icon: "error",
            title: t("UpdateResource.ValidationAlertFile"),
            text: "El archivo excede el límite de 10MB",
            showConfirmButton: false,
            timer: 2500,
        });
        e.target.value = "";
        setSelectedFile(null);
        return;
    }

    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (ALLOWED_FILE_TYPES.includes(`.${fileExtension}`)) {
        setSelectedFile(file);
    } else {
        Swal.fire({
            icon: "warning",
            title: t("UpdateResource.ValidationAlertFile"),
            text: t("UpdateResource.ValidationAlertFileDescription"),
            showConfirmButton: false,
            timer: 2500,
        });
        e.target.value = "";
        setSelectedFile(null);
    }
  };

  // Función para abrir el modal de edición
  const openEditModal = (resource) => {
    setSelectedResource(resource);
    setEditModalVisible(true);
  };

  // Función para cerrar el modal de edición
  const closeEditModal = () => {
    setEditModalVisible(false);
    setSelectedResource(null);
  };

  // Función para eliminar un recurso
  const handleRemoveResource = async (resource) => {
    try {
      await deleteResource(resource.id);
      Swal.fire({
        icon: "success",
        title: t("CreateResource.DeleteResource"),
        showConfirmButton: false,
        timer: 700,
      });
      fetchResources(courseId); // Actualiza la lista de recursos
    } catch (error) {
      console.error("Error al eliminar el recurso:", error);
      Swal.fire({
        icon: "error",
        title: t("CreateResource.ErrorDelete"),
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };

  // Función para cambiar la pestaña activa
  const handleTabChange = (tab) => {
    setActiveTab(tab);
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
      {/* Botones para cambiar entre pestañas */}
      <div className="mb-4 sm:block md:hidden lg:hidden absolute top-0 left-0">
        <button
          // Cambia a la pestaña de creación de recursos
          onClick={() => handleTabChange("crear")}
          className={`px-6 py-2 rounded-ss-md ${
            activeTab === "recursos"
              ? "bg-gray-100 text-black"
              : "bg-purple-800 text-white"
          }`}
        >
          {t('courses.resource')}
        </button>
        <button
          // Cambia a la pestaña de recursos existentes
          onClick={() => handleTabChange("recursos")}
          className={`px-6 py-2 ${
            activeTab === "crear"
              ? "bg-gray-100 text-black"
              : "bg-purple-800 text-white"
          }`}
        >
           {t('courses.crear')}
        </button>
      </div>
      {/* Contenido principal del modal */}
      <div className="custom flex justify-center items-center h-full w-full">
        <div className="flex gap-8 h-full w-full">
          {/* Renderiza el contenido de la izquierda (recursos existentes) */}
          <RenderLeftContent
            activeTab={activeTab}
            subCategory={subCategory}
            resources={resources}
            t={t}
            openEditModal={openEditModal}
            handleRemoveResource={handleRemoveResource}
            image={image}
          />

          {/* Renderiza el contenido de la derecha (formulario de creación) */}
          <RenderRightContent
            activeTab={activeTab}
            handleSubmit={handleSubmit}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            subcategoryId={subcategoryId}
            setSubcategoryId={setSubcategoryId}
            type={type}
            setType={setType}
            selection={selection}
            setSelection={setSelection}
            link={link}
            setLink={setLink}
            quizzes={quizzes}
            setQuizzes={setQuizzes}
            attempts={attempts}
            setAttempts={setAttempts}
            errors={errors}
            t={t}
            image2={image2}
            subCategory={subCategory}
            handleFileChange={handleFileChange}
            onCancel={onCancel}
          />
        </div>
      </div>

      {/* Renderiza el modal de edición si está visible */}
      {isEditModalVisible && (
        <UpdateResourceForm
          isVisible={isEditModalVisible}
          onCancel={closeEditModal}
          resourceData={selectedResource}
          onUpdate={() => fetchResources(courseId)}
          courseId={courseId}
        />
      )}
    </Modal>
  );
};

export default CreateResourceModal;