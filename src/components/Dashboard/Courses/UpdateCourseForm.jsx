import React, { useState, useEffect, useRef } from "react";
import { Modal, Select } from "antd";
import { useCoursesContext } from "../../../context/courses/courses.context";
import { useCategoryContext } from "../../../context/courses/category.context";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import "../css/Custom.css";

const { Option } = Select;

const UpdateCourseForm = ({ visible, onClose, onUpdate, courseId }) => {
  const { categories } = useCategoryContext();
  const { updateCourse, getCourse } = useCoursesContext();
  const { i18n } = useTranslation();

  const [course, setCourse] = useState({
    name: "",
    category: "",
    description: "",
    image: null,
  });
  const [errorMessage, setErrorMessage] = useState({
    name: "",
    category: "",
    description: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (courseId) {
        const courseData = await getCourse(courseId);
        setCourse({
          name: courseData.title,
          category: courseData.category,
          description: courseData.description,
          image: null,
        });
        setImagePreview(courseData.image || null); // Establecemos la vista previa de la imagen
      }
    };
    if (visible) {
      fetchCourseData();
    }
  }, [courseId, getCourse, visible]);

  const validateField = (name, value) => {
    const errors = { ...errorMessage };

    switch (name) {
      case "name":
        if (!value || value.length < 3 || value.length > 30) {
          errors.name =
            i18n.language === "es"
              ? "El nombre debe tener entre 3 y 30 caracteres."
              : "The course name must be between 3 and 30 characters long.";
        } else {
          errors.name = "";
        }
        break;
      case "category":
        if (!value) {
          errors.category =
            i18n.language === "es"
              ? "Categoría del curso es requerida."
              : "Course category is required.";
        } else {
          errors.category = "";
        }
        break;
      case "description":
        if (!value || value.length < 30 || value.length > 150) {
          errors.description =
            i18n.language === "es"
              ? "La descripción debe tener entre 30 y 150 caracteres."
              : "The description must be between 30 and 150 characters long.";
        } else {
          errors.description = "";
        }
        break;
      case "image":
        if (value && !value.type.startsWith("image/")) {
          errors.image =
            i18n.language === "es"
              ? "Solo se permiten archivos de imagen."
              : "Only image files are allowed.";
        } else {
          errors.image = "";
        }
        break;
      default:
        break;
    }

    setErrorMessage(errors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
    validateField(name, value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    validateField("image", file);
    if (file && file.type.startsWith("image/")) {
      setCourse({ ...course, image: file });
      setImagePreview(URL.createObjectURL(file)); // Cambiamos la vista previa si se selecciona una nueva imagen
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {
      name: "",
      category: "",
      description: "",
      image: "",
    };

    validateField("name", course.name);
    validateField("category", course.category);
    validateField("description", course.description);
    validateField("image", course.image);

    if (Object.values(errorMessage).some((error) => error)) {
      return;
    }

    const courseData = {
      title: course.name,
      category: course.category,
      description: course.description,
      image: course.image ? course.image : imagePreview, // Se usa la imagen seleccionada o la vista previa existente
    };

    try {
      await updateCourse(courseId, courseData);
      Swal.fire({
        icon: "success",
        title:
          i18n.language === "es"
            ? "Actualización exitosa"
            : "Update successfully",
        timer: 1000,
        showConfirmButton: false,
      }).then(() => {
        onUpdate(courseData);
        onClose();
        window.location.reload();
      });
    } catch (error) {
      console.error(error);
      // Verificar si el error es debido a un título duplicado
      if (error.response && error.response.data && error.response.data.error === "A course with this title already exists"){
        Swal.fire({
          icon: "error",
          title: t("subCategory.AlertDuplicate"),
          showConfirmButton: true,
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title:
            i18n.language === "es"
              ? "Error al actualizar el curso"
              : "Failed to update course",
        });
      }
    }
  };

  return (
    <Modal
      visible={visible}
      footer={null}
      closable={false}
      className={`custom w-[544px] h-[800px] rounded-2xl bg-white flex flex-col justify-between ${
        i18n.language === "es" ? "bg-gradient-es" : "bg-gradient-en"
      }`}
      centered
      onCancel={onClose}
    >
      <div className="relative w-full h-[125px] bg-gradient-to-r from-[#350b48] to-[#905be8] rounded-t-2xl flex items-center justify-center">
        <img
          src="/src/assets/img/imagen1.png"
          alt="Imagen de la cabecera"
          className="w-[189.69px] h-[148px] object-contain mt-8"
        />
        <button
          type="button"
          className="absolute top-4 right-5 text-white text-3xl font-extrabold bg-transparent border-none cursor-pointer"
          onClick={onClose}
        >
          {i18n.language === "es" ? "×" : "×"}
        </button>
      </div>
      <form onSubmit={handleSubmit} className="px-5 py-6">
        <h1
          className={`text-center text-[#350b48] text-3xl font-bungee font-extrabold mt-1 mb-5 ${
            i18n.language === "es" ? "text-shadow-md-es" : "text-shadow-md-en"
          }`}
        >
          {i18n.language === "es" ? "ACTUALIZAR CURSO" : "UPDATE COURSE"}
        </h1>

        <label className="block text-lg font-bold text-black mb-2">
          {i18n.language === "es" ? "Título del curso:" : "Course Title:"}
        </label>
        <input
          className="w-full h-[34px] rounded-xl bg-white shadow-md px-3 mb-4"
          type="text"
          name="name"
          value={course.name}
          onChange={handleChange}
          maxLength={30}
        />
        {errorMessage.name && (
          <p className="text-red-500 text-sm mb-4">{errorMessage.name}</p>
        )}

        <label className="block text-lg font-bold text-black mb-2">
          {i18n.language === "es" ? "Categoría del curso:" : "Course Category:"}
        </label>
        <Select
          className="w-full h-[34px] rounded-xl bg-white shadow-md mb-4"
          value={course.category}
          onChange={(value) => setCourse({ ...course, category: value })}
        >
          {categories.map((category) => (
            <Option key={category.id} value={category.name}>
              {category.name}
            </Option>
          ))}
        </Select>
        {errorMessage.category && (
          <p className="text-red-500 text-sm mb-4">{errorMessage.category}</p>
        )}

        <label className="block text-lg font-bold text-black mb-2">
          {i18n.language === "es"
            ? "Descripción del curso:"
            : "Course Description:"}
        </label>
        <textarea
          className="w-full h-[60px] rounded-xl bg-white shadow-md px-3"
          name="description"
          value={course.description}
          onChange={handleChange}
          maxLength={150}
        />
        <div className="text-gray-500 text-sm mb-4">{`${course.description.length}/150`}</div>
        {errorMessage.description && (
          <p className="text-red-500 text-sm mb-4">
            {errorMessage.description}
          </p>
        )}

        <div className="flex flex-col items-start mb-6">
          <label className="block text-lg font-bold text-black mb-2">
            {i18n.language === "es" ? "Imagen del curso:" : "Course Image:"}
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full h-[44px] rounded-xl bg-white shadow-md px-3 py-2 mb-4"
            ref={imageRef}
            onChange={handleImageChange}
          />
          {errorMessage.image && (
            <p className="text-red-500 text-sm mb-4">{errorMessage.image}</p>
          )}
        </div>

        <div className="flex justify-center mb-6">
          {imagePreview && (
            <div className="w-[100px] h-[100px] border border-[#ddd] rounded-md flex items-center justify-center bg-[#f0f0f0] overflow-hidden">
              <img
                src={
                  course.image instanceof File
                    ? URL.createObjectURL(course.image)
                    : imagePreview
                }
                alt="Vista previa de la imagen"
                className="object-contain"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-[133px] h-[41px] bg-[#350b48] text-white font-bold text-lg rounded-lg shadow-md hover:bg-[#4c104f] transition duration-200"
        >
          {i18n.language === "es" ? "Actualizar" : "Update"}
        </button>
      </form>
    </Modal>
  );
};

export default UpdateCourseForm;
