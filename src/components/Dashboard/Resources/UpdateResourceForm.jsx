import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "antd";
// Importaciones de request: 
import { updateResource, getResource } from "../../../api/courses/resource.request";
import { getSubCategoryCourseId } from "../../../api/courses/subCategory.requst.js";

// ALERTAS y Traducciones
import Swal from "sweetalert2"; //Importamos SweetAlert
import { useTranslation } from "react-i18next";
import "../css/Custom.css";

// Importaciones de Funcionalidades
import QuizComponent from "./updateFuntions/QuizComponent.jsx";
import {validateFields, validateQuizzes, ALLOWED_FILE_TYPES} from "./updateFuntions/validation.js";

const UpdateResourceForm = ({ isVisible, onCancel, resourceData, onUpdate, courseId,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attempts, setAttempts] = useState("");
  const [link, setLink] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingFileName, setExistingFileName] = useState("");
  const [errors, setErrors] = useState({});
  const { t } = useTranslation("global");
  const [selection, setSelection] = useState("file"); // Estado para seleccionar entre archivo y enlace
  const [resources, setResources] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [subcategoryId, setSubcategoryId] = useState("");
  const [quizzes, setQuizzes] = useState([  { question: "", options: ["", ""], correctAnswer: "" }, ]);

  useEffect(() => {
    if (isVisible && courseId) {
      fetchResourcesAndSubCategories(courseId);
    } else {
      setResources([]); // Limpiar los recursos al cerrar la modal
      setSubCategory([]);
    }
  }, [isVisible, courseId]);
  
  // Función encargada de obtener ambos recursos al mismo tiempo
  const fetchResourcesAndSubCategories = async (courseId) => {
    try {
      const [resourcesResponse, subCategoriesResponse] = await Promise.all([
        getResource(courseId),
        getSubCategoryCourseId(courseId)
      ]);
  
      setResources(resourcesResponse.data);
      setSubCategory(subCategoriesResponse.data);
      
    } catch (err) {
      console.error("Error al obtener los recursos o subcategorías:", err);
    }
  };
  // Este useEffect llama todos los campos del formulario a editar
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

  // Función que valida el campo de Archivo
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

  // Funciones encargadas de manejar todo lo relacionado al quizz
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
  // Remover una opción del quizz
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
  // Remueve un pregunta del quizz
  const removeQuiz = (index) => {
    setQuizzes((prevState) =>
      prevState.filter((_, quizIndex) => quizIndex !== index)
    );
  };

  // Función para actualizar un recurso
  const handleUpdate = async (e) => {
    e.preventDefault();

    const fieldErrors = validateFields(title, description, link, t);
    const quizErrors = validateQuizzes(quizzes, t);

    const allErrors = { ...fieldErrors, ...quizErrors };
    setErrors(allErrors);

    // Si hay errores, no continúes
    if (Object.keys(allErrors).length > 0) return;

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
    } catch (error) {
      console.error(error);

      if (error.response && error.response.data && error.response.data.error === "Ya existe un recurso con este nombre para esta subCategory."){
        Swal.fire({
          icon: "error",
          title: t("UpdateResource.AlertDuplicate"),
          showConfirmButton: true,
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: t("UpdateResource.ErrorAlert"),
          showConfirmButton: false,
          timer: 1000,
        });
      }
    }
  };

  // Usar useRef para guardar el estado inicial del recurso
  const initialResourceDataRef = useRef();

  // Función para restablecer todos los campos al original 
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
      title={ <h2 className="custom text-2xl font-semibold text-gray-800"> {t("UpdateResource.ModalTitle")} </h2> }
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
      closeIcon={ <span className="text-gray-600 hover:text-gray-800"> &#x2715; {/* Icono de cierre personalizado */} </span> }
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
        <div>
          {quizzes.map((quiz, index) => (
            <QuizComponent
              key={index}
              quiz={quiz}
              index={index}
              handleQuizChange={handleQuizChange}
              addOption={addOption}
              removeOption={removeOption}
              removeQuiz={removeQuiz}
              addQuiz={addQuiz}
              errors={errors}
              t={t}
            />
          ))}
        </div>

        {quizzes.length > 0 && (
          <div>
            <Button type="dashed" onClick={addQuiz} className="w-full mt-4 bg-blue-500 text-white">
                {t("CreateResource.AddQuestion")}
            </Button>

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