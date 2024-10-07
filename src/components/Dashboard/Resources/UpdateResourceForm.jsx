import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, notification } from "antd";
import { toast } from "react-toastify";
import { updateResource, getResource } from "../../../api/courses/resource.request";
import { getSubCategoryCourseId } from "../../../api/courses/subCategory.requst.js";
import Swal from "sweetalert2"; //Importamos SweetAlert
import { useTranslation } from "react-i18next";
import "../css/Custom.css";

const ALLOWED_FILE_TYPES = [".mov", ".docx", ".pdf", ".jpg", ".png"];
const YOUTUBE_URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:watch\?v=|embed\/|playlist\?list=)|youtu\.be\/)[a-zA-Z0-9_-]{11}(?:\S*)?$/i;
const VIMEO_URL_REGEX = /^(https?:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)$/i;
const GOOGLE_DRIVE_URL_REGEX =
  /^(https?:\/\/)?(drive\.google\.com\/file\/d\/)([a-zA-Z0-9_-]+)(\/[^?]*)(\?.*)?$/i;

const UpdateResourceForm = ({
  isVisible,
  onCancel,
  resourceData,
  onUpdate,
  courseId,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attempts, setAttempts] = useState("");
  const [link, setLink] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingFileName, setExistingFileName] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [errors, setErrors] = useState({});
  const { t } = useTranslation("global");
  const [selection, setSelection] = useState("file"); // Estado para seleccionar entre archivo y enlace
  const [resources, setResources] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [subcategoryId, setSubcategoryId] = useState("");

  const validateFields = () => {
    const newErrors = {};

    // Validación del título (mínimo 3 caracteres)
    if (!title || title.length < 3) {
      newErrors.title = t("UpdateResource.ValidateTitle");
    }

    // Validación de la descripción (mínimo 8 caracteres)
    if (!description || description.length < 8) {
      newErrors.description = t("UpdateResource.ValidateDescription");
    }

    // Validación de enlaces si es que se proporcionan
    if (link && !isValidLink(link)) {
      newErrors.link = t("UpdateResource.Validatelink");
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

  // Usar useRef para guardar el estado inicial del recurso
  const initialResourceDataRef = useRef();

  useEffect(() => {
    if (resourceData) {
      // Actualizar el estado con los datos iniciales
      setTitle(resourceData.title || "");
      setSubcategoryId(resourceData.subcategoryId || "");
      setDescription(resourceData.description || "");
      setLink(resourceData.link);
      setExistingFileName(resourceData.file?.name);
      setSelectedFile(null); // Limpiar el archivo seleccionado
      setAttempts(resourceData.attempts || "");
      setQuizzes(resourceData.quizzes || []); // Inicializar quizzes si existen en el recurso
    }
  }, [resourceData]);

  useEffect(() => {
    if (isVisible && courseId) {
      fetchResources(courseId);
      fetchSubCategories(courseId);
    } else {
      setResources([]); // Limpiar los recursos al cerrar la modal
      setSubCategory([]);
    }
  }, [isVisible, courseId]); // Ahora depende de courseId también

  const fetchResources = async (courseId) => {
    try {
      const response = await getResource(courseId);
      setResources(response.data);
    } catch (err) {
      console.error("Error al obtener los recursos:", err);
      toast.error("Error al obtener los recursos");
    }
  };

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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

  const handleQuizChange = (index, event) => {
    const { name, value } = event.target;
    const updatedQuizzes = [...quizzes];
    if (name.startsWith("options")) {
      const optionIndex = parseInt(name.match(/\[(\d+)\]/)[1], 10);
      updatedQuizzes[index].options[optionIndex] = value;
    } else {
      updatedQuizzes[index][name] = value;
    }
    setQuizzes(updatedQuizzes);
  };

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

  const isValidLink = (url) => {
    return (
      YOUTUBE_URL_REGEX.test(url) ||
      VIMEO_URL_REGEX.test(url) ||
      GOOGLE_DRIVE_URL_REGEX.test(url)
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateFields() || !validateQuizzes()) return;

    const updatedData = {
      title,
      subcategoryId,
      description,
      link,
      file: selectedFile || resourceData.file,
      attempts: Number(attempts),
      quizzes, // Incluir los quizzes actualizados
    };

    try {
      await updateResource(resourceData.id, updatedData);
      Swal.fire({
        icon: "success",
        title: t("UpdateResource.UpdateAlert"),
        showConfirmButton: false,
        timer: 1000,
      });
      onUpdate();
      onCancel(); // Cierra el modal después de la actualización exitosa
    } catch (err) {
      console.error("Error al actualizar el recurso:", err);
      Swal.fire({
        icon: "error",
        title: t("UpdateResource.ErrorAlert"),
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };

  const handleCancel = () => {
    // Restablece el estado al inicial desde la referencia
    if (initialResourceDataRef.current) {
      setTitle(initialResourceDataRef.current.title);
      setSubcategoryId(initialResourceDataRef.current.subcategoryId);
      setDescription(initialResourceDataRef.current.description);
      setLink(initialResourceDataRef.current.link);
      setSelectedFile(null);
      setExistingFileName(initialResourceDataRef.current.file?.name || "");
      setAttempts(initialResourceDataRef.current.attempts);
      setQuizzes(initialResourceDataRef.current.quizzes);
    }

    // Llama a la función onCancel para cerrar el modal
    onCancel();
  };

  // Determinar si los campos de archivo y enlace deben mostrarse
  const shouldShowFileAndLinkFields = quizzes.length === 0;

  return (
    <Modal
      title={
        <h2 className="custom text-2xl font-semibold text-gray-800">
          {t("UpdateResource.ModalTitle")}
        </h2>
      }
      visible={isVisible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      centered
      zIndex={1000}
      className="p-6 max-h-[70vh] overflow-y-auto rounded-lg shadow-lg bg-white"
      bodyStyle={{
        padding: "20px",
        borderRadius: "10px",
        background: "linear-gradient(to bottom, #f0f4f8, #fff)",
      }}
      closeIcon={
        <span className="text-gray-600 hover:text-gray-800">
          &#x2715; {/* Icono de cierre personalizado */}
        </span>
      }
    >
      <form onSubmit={handleUpdate} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <div>
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
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div>
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
            required
            className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {shouldShowFileAndLinkFields && (
          <>
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setSelection("file")}
                className={`mr-4 px-4 py-2 rounded-lg focus:outline-none ${
                  selection === "file"
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
              >
                {t("UpdateResource.Files")}
              </button>
              <button
                type="button"
                onClick={() => setSelection("link")}
                className={`px-4 py-2 rounded-lg focus:outline-none ${
                  selection === "link"
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
              >
                {t("UpdateResource.LinkVideo")}
              </button>
            </div>

            {selection === "file" && (
              <div>
                <label
                  htmlFor="file"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("UpdateResource.Files")}
                </label>
                {existingFileName && (
                  <p className="text-gray-500 mb-2">
                    {t("UpdateResource.ActualiFile")} {existingFileName}
                  </p>
                )}
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
                  {t("UpdateResource.LinkVideo")}
                </label>
                {link && (
                  <p className="text-gray-500 mb-2">
                    {t("UpdateResource.ActualLink")}{" "}
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {link}
                    </a>
                  </p>
                )}
                <input
                  type="text"
                  id="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder={t("UpdateResource.AddLink")}
                  className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                {errors.link && (
                  <p className="text-red-500 text-sm mt-1">{errors.link}</p>
                )}
              </div>
            )}
          </>
        )}

        {/* Sección de quizzes */}
        {quizzes.map((quiz, index) => (
          <div
            key={index}
            className="p-4 border border-gray-300 rounded-lg shadow-sm mb-6"
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("UpdateResource.Question")}
            </label>
            <input
              type="text"
              name="question"
              value={quiz.question}
              onChange={(e) => handleQuizChange(index, e)}
              placeholder={t("UpdateResource.Question")}
              className={`mb-2 block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                errors[index]?.question ? "border-red-500" : "border-gray-300"
              } shadow-sm`}
            />
            {errors[index]?.question && (
              <p className="text-red-500 text-sm">{errors[index].question}</p>
            )}
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("UpdateResource.labelOption")}
            </label>
            {quiz.options.map((option, optIndex) => (
              <div key={optIndex} className="flex items-center mb-2">
                <input
                  type="text"
                  name={`options[${optIndex}]`}
                  value={option}
                  onChange={(e) => handleQuizChange(index, e)}
                  placeholder={t("UpdateResource.OptionIndex", {
                    optionNumber: optIndex + 1,
                  })}
                  className={`mr-2 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 w-full ${
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
                <button
                  type="button"
                  onClick={() => removeOption(index, optIndex)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                >
                  {t("UpdateResource.DeleteOption")}
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(index)}
              className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
            >
              {t("UpdateResource.AddOption")}
            </button>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <option value="">{t("UpdateResource.SelectOption")}</option>
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
                  className="mt-2 text-red-500 hover:text-red-700"
                >
                  {t("CreateResource.DeleteQuestion")}
                </button>
              )}
            </div>
            <Button type="dashed" onClick={addQuiz} className="w-full mt-4">
              {t("CreateResource.AddQuestion")}
            </Button>
          </div>
        ))}

        {quizzes.length > 0 && (
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
        )}

        <div className="flex justify-end gap-4">
          <Button onClick={handleCancel}>
            {t("UpdateResource.ButtonCancel")}
          </Button>
          <Button type="primary" htmlType="submit" onClick={handleUpdate}>
            {t("UpdateResource.ButtonUpdate")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateResourceForm;
