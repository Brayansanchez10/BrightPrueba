import React, { useState, useEffect } from "react";
import { Modal, Button, notification, Card, Collapse } from "antd";
import { toast } from "react-toastify";
import {
  createResource,
  getResource,
  deleteResource,
} from "../../../api/courses/resource.request";
import UpdateResourceForm from "./UpdateResourceForm";
import { EditOutlined, DeleteFilled, FilePdfOutlined, LoadingOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import "../css/Custom.css";
import image from "../../../assets/img/Zorro.png";
import image2 from "../../../assets/img/hola1.png";
import { getSubCategoryCourseId } from "../../../api/courses/subCategory.requst.js";

const { Text } = Typography;
const MAX_TITLE_LENGTH = 30;
const { Panel } = Collapse;

const ALLOWED_FILE_TYPES = [".pdf", ".jpg", ".jpeg", ".png"];
const YOUTUBE_URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:watch\?v=|embed\/|playlist\?list=)|youtu\.be\/)[a-zA-Z0-9_-]{11}(?:\S*)?$/i;
const VIMEO_URL_REGEX = /^(https?:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)$/i;
const GOOGLE_DRIVE_URL_REGEX =
  /^(https?:\/\/)?(drive\.google\.com\/file\/d\/)([a-zA-Z0-9_-]+)(\/[^?]*)(\?.*)?$/i;

const CreateResourceModal = ({
  isVisible,
  onCancel,
  courseId,
  onCreate,
  visible,
}) => {
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
  const { t } = useTranslation("global");
  const [activeTab, setActiveTab] = useState("crear");
  const [subCategory, setSubCategory] = useState([]);
  const [subcategoryId, setSubcategoryId] = useState("");
  const MAX_DESCRIPTION_LENGTH = 500;
  const [isLoading, setIsLoading] = useState(false);

  const validateFields = () => {
    const newErrors = {};

    // Validación del título (mínimo 3 caracteres)
    if (!title || title.length < 3 || title.length > MAX_TITLE_LENGTH) {
      newErrors.title = t("UpdateResource.ValidateTitle", {
        max: MAX_TITLE_LENGTH,
      });
    }

    // Validación de la descripción (mínimo 8 caracteres)
    if (!description || description.length < 8) {
      newErrors.description = t("UpdateResource.ValidateDescription");
    }

    setErrors(newErrors);

    // Si no hay errores, retorna true, de lo contrario false
    return Object.keys(newErrors).length === 0;
  };

  const validateQuizzes = () => {
    // Función para validar QUIZ
    const newErrors = {};

    quizzes.forEach((quiz, index) => {
      const quizErrors = {};

      // Validación de la pregunta
      if (!quiz.question || quiz.question.length < 3) {
        quizErrors.question = t("UpdateResource.ValidateQuestion");
      }

      // Validación de las opciones
      if (quiz.options.length < 2) {
        quizErrors.options = t("UpdateResource.ValidateOptions");
      } else {
        quiz.options.forEach((option, optIndex) => {
          if (!option || option.trim() === "") {
            if (!quizErrors.options) {
              quizErrors.options = {};
            }
            quizErrors.options[optIndex] = t("UpdateResource.Option");
          }
        });
      }

      // Validación de la respuesta correcta
      if (!quiz.correctAnswer || !quiz.options.includes(quiz.correctAnswer)) {
        quizErrors.correctAnswer = t("UpdateResource.ValidationAnswer");
      }

      if (Object.keys(quizErrors).length > 0) {
        newErrors[index] = quizErrors;
      }
    });

    setErrors(newErrors);

    // Si no hay errores, retorna true, de lo contrario false
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (isVisible && courseId) {
      fetchResources(courseId);
      fetchSubCategories(courseId);
    } else {
      setResources([]); // Limpiar los recursos al cerrar la modal
      setSubCategory([]);
    }
  }, [isVisible, courseId]);

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

  const resetState = () => {
    setTitle("");
    setDescription("");
    setAttempts(1);
    setLink("");
    setSelectedFile(null);
    setType("file");
    setSelection("file");
    setEditModalVisible(false);
    setSelectedResource(null);
    setQuizzes([]); // Resetear quizzes al cerrar el modal
  };

  const isVideoLink = (file) => {
    return (
      YOUTUBE_URL_REGEX.test(file) ||
      VIMEO_URL_REGEX.test(file) ||
      GOOGLE_DRIVE_URL_REGEX.test(file)
    );
  };

  const isValidLink = (url) => {
    return (
      YOUTUBE_URL_REGEX.test(url) ||
      VIMEO_URL_REGEX.test(url) ||
      GOOGLE_DRIVE_URL_REGEX.test(url)
    );
  };

  const getEmbedUrl = (file) => {
    if (YOUTUBE_URL_REGEX.test(file)) {
      const videoId = file.includes("youtu.be/")
        ? file.split("youtu.be/")[1].split("?")[0]
        : new URL(file).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (VIMEO_URL_REGEX.test(file)) {
      const videoId = file.match(VIMEO_URL_REGEX)[4];
      return `https://player.vimeo.com/video/${videoId}`;
    }

    if (GOOGLE_DRIVE_URL_REGEX.test(file)) {
      const fileId = file.match(GOOGLE_DRIVE_URL_REGEX)[3];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }

    return "";
  };

  // Manejar cambios en los quizzes
  const handleQuizChange = (index, e) => {
    const { name, value } = e.target;
    const updatedQuizzes = [...quizzes];
    if (name.startsWith("options")) {
      const optionIndex = parseInt(name.split("[")[1].split("]")[0], 10);
      updatedQuizzes[index].options[optionIndex] = value;
    } else {
      updatedQuizzes[index][name] = value;
    }
    setQuizzes(updatedQuizzes);
  };

  // Añadir una nueva opción
  const addOption = (quizIndex) => {
    const updatedQuizzes = [...quizzes];

    // Verificar si el número de opciones es menor a 6
    if (updatedQuizzes[quizIndex].options.length < 6) {
      updatedQuizzes[quizIndex].options.push(""); // Añadir una opción vacía
      setQuizzes(updatedQuizzes);
    } else {
      Swal.fire({
        icon: "warning",
        title: t("CreateResource.MaxOptionsAlert"),
        text: t("CreateResource.MaxOptionsText", { maxOptions: 6 }),
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  // Eliminar una opción
  const removeOption = (quizIndex, optionIndex) => {
    const updatedQuizzes = [...quizzes];
    if (updatedQuizzes[quizIndex].options.length > 2) {
      // Asegurar que queden al menos 2 opciones
      updatedQuizzes[quizIndex].options.splice(optionIndex, 1);
      setQuizzes(updatedQuizzes);
    }
  };

  // Añadir un nuevo quiz
  const addQuiz = () => {
    setQuizzes((prevState) => [
      ...prevState,
      { question: "", options: ["", ""], correctAnswer: "" },
    ]);
  };

  const removeQuiz = (index) => {
    setQuizzes((prevState) =>
      prevState.filter((_, quizIndex) => quizIndex !== index)
    );
  };

  const fetchResources = async (courseId) => {
    try {
      const response = await getResource(courseId);
      setResources(response.data);
    } catch (err) {
      console.error("Error al obtener los recursos:", err);
      toast.error("Error al obtener los recursos");
    }
  };

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

    setIsLoading(true); // Activar loading

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
       
      if (error.response && error.response.data && error.response.data.error === "Ya existe un recurso con este nombre para esta subCategory.")  {
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
    } finally {
      setIsLoading(false); // Desactivar loading
    }
  };

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
   // Obtener la extensión del archivo en minúsculas
   const fileExtension = file.name.split(".").pop().toLowerCase();
    
   // Validar si la extensión está permitida
   if (ALLOWED_FILE_TYPES.includes(`.${fileExtension}`)) {
     setSelectedFile(file); // Si es válido, establecer el archivo seleccionado
   } else {
     Swal.fire({
       icon: "warning",
       title: t("UpdateResource.ValidationAlertFile"),
       text: t("UpdateResource.ValidationAlertFileDescription"),
       showConfirmButton: false,
       timer: 3000,
     });
     e.target.value = ""; // Limpiar el input de archivo
     setSelectedFile(null); // Eliminar archivo seleccionado
   }
  };

  const handleLinkChange = (e) => setLink(e.target.value);

  const openEditModal = (resource) => {
    setSelectedResource(resource);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setSelectedResource(null);
  };

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

  const handleCancel = () => {
    resetState();
    onCancel();
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
      <div className="mb-4 sm:block md:hidden lg:hidden  absolute top-0 left-0">
        <button
          onClick={() => handleTabChange("crear")}
          className={`px-6 py-2 rounded-ss-md ${
            activeTab === "recursos"
              ? "bg-gray-100 text-black"
              : "bg-purple-800 text-white"
          }`}
        >
          Recursos
        </button>
        <button
          onClick={() => handleTabChange("recursos")}
          className={`px-6 py-2 ${
            activeTab === "crear"
              ? "bg-gray-100 text-black"
              : "bg-purple-800 text-white"
          }`}
        >
          Crear
        </button>
      </div>
      <div className="custom flex justify-center items-center h-full w-full">
        <div className="flex gap-8 h-full w-full">
          {/* Panel de recursos a la izquierda */}
          <div
            className={`w-full rounded-lg shadow-lg overflow-y-auto overflow-auto scrollbar-hide mt-6 ${
              activeTab === "crear" ? "block" : "hidden"
            } sm:w-1/2 sm:block`}
            style={{ maxHeight: "700px" }}
          >
            <div className="relative w-full h-[125px] bg-gradient-to-r from-[#350b48] to-[#905be8] rounded-t-2xl flex items-center justify-center">
              <img
                src={image}
                alt="Imagen de la cabecera"
                className="w-[189.69px] h-[148px] object-contain mt-8"
              />
            </div>
            <h3 className="text-xl font-bold mt-6 text-center text-purple-900">
              {t("CreateResource.TitleResources")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 p-4">
              {subCategory.length > 0 ? (
                subCategory.map((subcategory) => {
                  // Filtrar los recursos por subcategoryId
                  const filteredResources = resources.filter(
                    (resource) => resource.subcategoryId === subcategory.id
                  );

                  return (
                    <div key={subcategory.id} className="mb-6">
                      <h2 className="text-xl font-bold mb-4">
                        {subcategory.title}
                      </h2>

                      {filteredResources.length > 0 ? (
                        <Collapse accordion>
                          {filteredResources.map((resource) => (
                        <Panel
                        header={
                          <div className="flex flex-col lg:flex-row justify-between items-center">
                            <div className="w-full lg:w-3/4 break-words">
                              {resource.title}
                            </div>
                            <div className="flex lg:w-1/4 justify-end mt-2 lg:mt-0">
                              <Button
                                icon={<EditOutlined />}
                                onClick={() => openEditModal(resource)}
                                className="bg-yellow-500 text-white hover:bg-yellow-600 mr-2"
                                    ></Button>
                                    <Button
                                      icon={<DeleteFilled />}
                                      onClick={() => {
                                        Swal.fire({
                                          title: t(
                                            "CreateResource.AlertDeleteTitle"
                                          ),
                                          text: t(
                                            "CreateResource.AlertDeleteText"
                                          ),
                                          icon: "warning",
                                          showCancelButton: true,
                                          confirmButtonColor: "#28a745",
                                          cancelButtonColor: "#d35",
                                          confirmButtonText: t(
                                            "CreateResource.AlertDeleteConfir"
                                          ),
                                          reverseButtons: true,
                                        }).then((result) => {
                                          if (result.isConfirmed) {
                                            handleRemoveResource(resource);
                                            Swal.fire({
                                              title: t(
                                                "CreateResource.AlerteSuccesyDelete"
                                              ),
                                              text: t(
                                                "CreateResource.DeleteResource"
                                              ),
                                              icon: "success",
                                            });
                                          }
                                        });
                                      }}
                                      className="bg-red-700 text-white hover:bg-red-600"
                                    ></Button>
                                  </div>
                                </div>
                              }
                              key={resource.id}
                            >
                              <Card>
                                <div className="flex justify-between items-center">
                                  {resource.files &&
                                  (isVideoLink(resource.files) ||
                                    resource.files.endsWith(".pdf") ||
                                    /\.(jpg|jpeg|png)$/i.test(
                                      resource.files
                                    )) ? (
                                    <>
                                      <div className="w-1/2">
                                        {isVideoLink(resource.files) ? (
                                          <iframe
                                            src={getEmbedUrl(resource.files)}
                                            frameBorder="0"
                                            style={{
                                              width: "250px",
                                              height: "250px",
                                            }}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                          />
                                        ) : resource.files.endsWith(".pdf") ? (
                                          <div className="text-center">
                                            <div className="flex items-center justify-center mb-4">
                                              <FilePdfOutlined className="text-red-600 text-6xl" />
                                            </div>
                                            <a
                                              href={resource.files}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-blue-500 hover:underline text-lg"
                                              download
                                            >
                                              {t("CreateResource.DowloadPDF")}
                                            </a>
                                          </div>
                                        ) : (
                                          <div className="flex justify-center">
                                            <img
                                              src={resource.files}
                                              alt={`Content ${resource.title}`}
                                              className="max-w-full h-auto"
                                            />
                                          </div>
                                        )}
                                      </div>
                                      <div className="w-1/2 pl-10">
                                        <p>{resource.description}</p>
                                        {resource.file && (
                                          <p>
                                            {t("UpdateResource.Files")}:{" "}
                                            {resource.file.name}
                                          </p>
                                        )}
                                      </div>
                                    </>
                                  ) : resource.quizzes &&
                                    resource.quizzes.length > 0 ? (
                                    <div className="w-full">
                                      <h4 className="text-md font-bold mb-4">
                                        {t("CreateResource.QuizzTitleModal")}
                                      </h4>
                                      {resource.quizzes.map((quiz, index) => (
                                        <div
                                          key={index}
                                          className="mb-6 p-4 border border-gray-300 rounded-md shadow-sm"
                                        >
                                          <div className="mb-2">
                                            <label className="block text-sm font-semibold text-gray-700">
                                              {t("UpdateResource.Question")}:
                                            </label>
                                            <p className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100">
                                              {quiz.question}
                                            </p>
                                          </div>
                                          <div className="mb-2">
                                            <label className="block text-sm font-semibold text-gray-700">
                                              {t("UpdateResource.labelOption")}:
                                            </label>
                                            {quiz.options.map(
                                              (option, optIndex) => (
                                                <div
                                                  key={optIndex}
                                                  className="flex items-center mb-1"
                                                >
                                                  <span className="mr-2 text-gray-600">
                                                    {String.fromCharCode(
                                                      65 + optIndex
                                                    )}
                                                    )
                                                  </span>
                                                  <p className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100">
                                                    {option}
                                                  </p>
                                                </div>
                                              )
                                            )}
                                          </div>
                                          <div>
                                            <label className="block text-sm font-semibold text-gray-700">
                                              {t(
                                                "UpdateResource.CorrectAnswer"
                                              )}
                                              :
                                            </label>
                                            <p className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100">
                                              {quiz.correctAnswer}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p>
                                      {t("UpdateResource.labelOption")}:{" "}
                                      {resource.description}
                                    </p>
                                  )}
                                </div>
                              </Card>
                            </Panel>
                          ))}
                        </Collapse>
                      ) : (
                        <p>{t("CreateResource.NoResources")}</p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>{t("CreateResource.NoResources")}</p>
              )}
            </div>
          </div>

          {/* Formulario de creación a la derecha */}
          <div
            className={`w-full rounded-lg shadow-lg overflow-y-auto bg-white mt-6 ${
              activeTab === "recursos" ? "block" : "hidden"
            } sm:w-1/2 sm:block`}
            style={{ maxHeight: "700px" }}
          >
            <div className="relative w-full h-[125px] bg-gradient-to-r from-[#350b48] to-[#905be8] rounded-t-2xl items-center flex justify-center">
              <h3 className="text-2xl font-bold text-white ml-2">
                {t("CreateResource.FormCreate")}
              </h3>
              <img
                src={image2}
                alt="Imagen de la cabecera"
                className="w-[80x] h-[80px] object-contain mr-2"
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 px-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("UpdateResource.Title")}
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value.slice(0, MAX_TITLE_LENGTH))
                    }
                    className={`mt-1 block w-full px-4 py-2 rounded-lg border ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
                    required
                    maxLength={MAX_TITLE_LENGTH}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    {title.length}/{MAX_TITLE_LENGTH}
                  </p>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label
                    htmlFor="subcategoryId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("subCategory.SelectSection")}
                  </label>
                  <select
                    id="subcategoryId"
                    value={subcategoryId}
                    onChange={(e) => setSubcategoryId(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    required
                  >
                    <option value="">{t("subCategory.SelectSection")}</option>
                    {subCategory.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("UpdateResource.Description")}
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
                  <p className="text-red-500 text-sm mt-0">
                    {errors.description}
                  </p>
                )}
                <div className="text-gray-600 text-right mt-1">
                  {description.length}/{MAX_DESCRIPTION_LENGTH}
                </div>
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("CreateResource.TipeResource")}
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <option value="file">{t("UpdateResource.Files")}</option>
                  <option value="quiz">
                    {t("CreateResource.QuizzTitleModal")}
                  </option>
                </select>
              </div>

              {type === "file" && (
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setSelection("file")}
                      className={`flex-1 px-4 py-2 rounded-lg focus:outline-none ${
                        selection === "file"
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                      }`}
                    >
                      {t("CreateResource.UpFile")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelection("link")}
                      className={`flex-1 px-4 py-2 rounded-lg focus:outline-none ${
                        selection === "link"
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                      }`}
                    >
                      {t("UpdateResource.LinkVideo")}
                    </button>
                  </div>

                  <div className="min-h-[100px]">
                    {selection === "file" && (
                      <div>
                        <label
                          htmlFor="file"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t("UpdateResource.Files")}
                        </label>
                        <input
                          type="file"
                          id="file"
                          onChange={handleFileChange}
                          className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm file:bg-blue-100 file:border-none file:py-2 file:px-4 file:text-blue-700"
                        />
                      </div>
                    )}

                    {selection === "link" && (
                      <div>
                        <label
                          htmlFor="link"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t("CreateResource.VideoLink")}
                        </label>
                        <input
                          type="text"
                          id="link"
                          value={link}
                          onChange={handleLinkChange}
                          placeholder={t("UpdateResource.AddLink")}
                          className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {type === "quiz" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("CreateResource.QuizzTitleModal")}
                  </label>
                  {quizzes.map((quiz, index) => (
                    <div
                      key={index}
                      className="mb-6 p-4 border border-gray-300 rounded-lg shadow-sm"
                    >
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          {t("UpdateResource.Question")}
                        </label>
                        <input
                          type="text"
                          name="question"
                          value={quiz.question}
                          onChange={(e) => handleQuizChange(index, e)}
                          placeholder={t("UpdateResource.Question")}
                          className={`mt-1 block w-full px-4 py-2 rounded-lg border ${
                            errors[index]?.question
                              ? "border-red-500"
                              : "border-gray-300"
                          } shadow-sm`}
                        />
                        {errors[index]?.question && (
                          <p className="text-red-500 text-sm">
                            {errors[index].question}
                          </p>
                        )}
                      </div>
                      {quiz.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center mb-2">
                          <span className="mr-2 text-gray-600">
                            {String.fromCharCode(65 + optIndex)})
                          </span>
                          <input
                            type="text"
                            name={`options[${optIndex}]`}
                            value={option}
                            onChange={(e) => handleQuizChange(index, e)}
                            placeholder={t("UpdateResource.OptionIndex", {
                              optIndex: optIndex + 1,
                            })}
                            className={`mt-1 block w-full px-4 py-2 rounded-lg border ${
                              errors[index]?.options?.[optIndex]
                                ? "border-red-500"
                                : "border-gray-300"
                            } shadow-sm`}
                          />
                          {errors[index]?.options?.[optIndex] && (
                            <p className="text-red-500 text-sm">
                              {errors[index].options[optIndex]}
                            </p>
                          )}
                          {quiz.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(index, optIndex)}
                              className="ml-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                            >
                              {t("UpdateResource.DeleteOption")}
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(index)}
                        className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                      >
                        {t("UpdateResource.AddOption")}
                      </button>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("UpdateResource.CorrectAnswer")}
                      </label>
                      <select
                        name="correctAnswer"
                        value={quiz.correctAnswer || ""}
                        onChange={(e) => handleQuizChange(index, e)}
                        className={`mt-1 block w-full px-4 py-2 rounded-lg border ${
                          errors[index]?.correctAnswer
                            ? "border-red-500"
                            : "border-gray-300"
                        } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
                      >
                        <option value="">
                          {t("UpdateResource.SelectOption")}
                        </option>
                        {quiz.options.map((option, optIndex) => (
                          <option key={optIndex} value={option}>
                            {`${String.fromCharCode(65 + optIndex)}) ${option}`}
                          </option>
                        ))}
                      </select>
                      {errors[index]?.correctAnswer && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[index].correctAnswer}
                        </p>
                      )}
                      {/* Mostrar botón "Eliminar pregunta" solo si hay más de una pregunta */}
                      {quizzes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuiz(index)}
                          className="mt-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                        >
                          {t("CreateResource.DeleteQuestion")}
                        </button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={addQuiz}
                    className="w-full mt-4 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                  >
                    {t("CreateResource.AddQuestion")}
                  </Button>

                  <div>
                    <label
                      htmlFor="attempts"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t("quizz.NumerQuizz")}
                    </label>
                    <input
                      type="number"
                      id="attempts"
                      value={attempts}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);

                        // Validar que el valor esté dentro del rango permitido
                        if (value >= 1 && value <= 10) {
                          setAttempts(value);
                        } else if (value < 1) {
                          setAttempts(1); // Si es menor que 1, establecer en 1
                        } else if (value > 10) {
                          setAttempts(10); // Si es mayor que 10, establecer en 10
                        }
                      }}
                      min="1"
                      max="10"
                      inputMode="numeric" // Asegura el teclado numérico en móviles
                      className={`mt-1 block w-full px-4 py-2 rounded-lg border`}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-4 mt-6">
                <Button
                  htmlType="submit"
                  className="bg-green-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingOutlined className="text-xl" spin />
                  ) : (
                    t("CreateResource.ButtonCreate")
                  )}
                </Button>
                <Button
                  onClick={handleCancel}
                  className="bg-red-600 text-white"
                  disabled={isLoading}
                >
                  {t("UpdateResource.ButtonCancel")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

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