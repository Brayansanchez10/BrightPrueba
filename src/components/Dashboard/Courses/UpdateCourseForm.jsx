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
  });

  const imageRef = useRef(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (courseId) {
        const courseData = await getCourse(courseId);
        setCourse({
          name: courseData.title,
          category: courseData.category,
          description: courseData.description,
          image: courseData.image || null,
        });
      }
    };
    if (visible) {
      fetchCourseData();
    }
  }, [courseId, getCourse, visible]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
    validateField(name, value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setCourse({ ...course, image: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {
      name: "",
      category: "",
      description: "",
    };

    if (!course.name || course.name.length < 2) {
      errors.name = i18n.language === 'es' ? "El nombre debe tener al menos 2 caracteres." : "The course name must be at least 2 characters long.";
    }
    if (!course.category) {
      errors.category = i18n.language === 'es' ? "Categoría del curso es requerida." : "Course category is required.";
    }
    if (!course.description || course.description.length < 6) {
      errors.description = i18n.language === 'es' ? "Descripción del curso es requerida y debe tener al menos 6 caracteres." : "The description must be at least 6 characters long.";
    }

    if (Object.values(errors).some((error) => error)) {
      setErrorMessage(errors);
      return;
    }

    const courseData = {
      title: course.name,
      category: course.category,
      description: course.description,
      image: course.image,
    };

    try {
      await updateCourse(courseId, courseData);
      Swal.fire({
        icon: 'success',
        title: i18n.language === 'es' ? "Actualización exitosa" : "Update successfully",
        timer: 1000,
        showConfirmButton: false,
      }).then(() => {
        onUpdate(courseData);
        onClose();
        window.location.reload();
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: i18n.language === 'es' ? "Error al actualizar el curso" : "Failed to update course",
      });
    }
  };

  return (
    <Modal
      visible={visible}
      footer={null}
      closable={false}
      className={`custom w-[544px] h-[800px] rounded-2xl bg-white flex flex-col justify-between ${i18n.language === 'es' ? 'bg-gradient-es' : 'bg-gradient-en'}`}
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
          {i18n.language === 'es' ? '×' : '×'}
        </button>
      </div>
      <form onSubmit={handleSubmit} className="px-5 py-6">
        <h1 className={`text-center text-[#350b48] text-3xl font-extrabold mt-1 mb-5 ${i18n.language === 'es' ? 'text-shadow-md-es' : 'text-shadow-md-en'}`}>
          {i18n.language === 'es' ? 'ACTUALIZAR CURSO' : 'UPDATE COURSE'}
        </h1>

        <label className="block text-lg font-bold text-black mb-2">
          {i18n.language === 'es' ? 'Título del curso:' : 'Course Title:'}
        </label>
        <input
          className="w-full h-[34px] rounded-xl bg-white shadow-md px-3 mb-4"
          type="text"
          name="name"
          value={course.name}
          onChange={handleChange}
        />
        {errorMessage.name && (
          <p className="text-red-500 text-sm mb-4">{errorMessage.name}</p>
        )}

        <label className="block text-lg font-bold text-black mb-2">
          {i18n.language === 'es' ? 'Categoría del curso:' : 'Course Category:'}
        </label>
        <Select
          className="w-full h-[34px] rounded-xl bg-white shadow-md mb-4"
          value={course.category}
          onChange={(value) => setCourse({ ...course, category: value })}
        >
          {categories.map((category) => (
            <Option key={category._id} value={category.name}>
              {category.name}
            </Option>
          ))}
        </Select>
        {errorMessage.category && (
          <p className="text-red-500 text-sm mb-4">{errorMessage.category}</p>
        )}

        <label className="block text-lg font-bold text-black mb-2">
          {i18n.language === 'es' ? 'Descripción del curso:' : 'Course Description:'}
        </label>
        <textarea
          className="w-full h-[60px] rounded-xl bg-white shadow-md px-3 mb-4"
          name="description"
          value={course.description}
          onChange={handleChange}
        />
        {errorMessage.description && (
          <p className="text-red-500 text-sm mb-4">{errorMessage.description}</p>
        )}

        <div className="flex flex-col items-start mb-6">
          <label className="block text-lg font-bold text-black mb-2">
            {i18n.language === 'es' ? 'Imagen del curso:' : 'Course Image:'}
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full h-[44px] rounded-xl bg-white shadow-md px-3 py-2 mb-4"
            ref={imageRef}
            onChange={handleImageChange}
          />
        </div>

        <div className="flex justify-center mb-6">
          {course.image && (
            <div className="w-[100px] h-[100px] border border-[#ddd] rounded-md flex items-center justify-center bg-[#f0f0f0] overflow-hidden">
              <img src={course.image} alt="Vista previa" className="max-w-full max-h-full" />
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-[#350b48] text-white rounded-xl h-[41px] w-[133px] text-lg font-bold cursor-pointer"
          >
            {i18n.language === 'es' ? 'Actualizar' : 'Update'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateCourseForm;
