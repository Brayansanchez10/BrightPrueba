import React, { useState, useEffect, useRef } from "react";
import { Modal, Select } from "antd";
import { useCoursesContext } from "../../../context/courses/courses.context";
import { useCategoryContext } from "../../../context/courses/category.context";
import Swal from "sweetalert2";
import "./css/UpdateCourseForm.css";

const { Option } = Select;

const UpdateCourseForm = ({ visible, onClose, onUpdate, courseId }) => {
  const { categories } = useCategoryContext();
  const { updateCourse, getCourse } = useCoursesContext();

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
      errors.name = "Título del curso es requerido y debe tener al menos 2 caracteres.";
    }
    if (!course.category) {
      errors.category = "Categoría del curso es requerida.";
    }
    if (!course.description || course.description.length < 6) {
      errors.description = "Descripción del curso es requerida y debe tener al menos 6 caracteres.";
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
        title: "Curso actualizado con éxito.",
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
        title: "Error al actualizar el curso.",
      });
    }
  };

  return (
    <Modal
      visible={visible}
      footer={null}
      closable={false}
      className="custom-modal"
      centered
      onCancel={onClose}
    >
      <div className="header">
        <img src="/src/assets/img/imagen1.png" alt="Imagen de la cabecera" />
        <button
          type="button"
          className="close-button"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
      <form onSubmit={handleSubmit} className="form-container">
        <h1 className="title">ACTUALIZAR CURSO</h1>

        <label className="label">Título del curso:</label>
        <input
          className="input"
          type="text"
          name="name"
          value={course.name}
          onChange={handleChange}
        />
        {errorMessage.name && (
          <p className="error-text">{errorMessage.name}</p>
        )}

        <label className="label">Categoría del curso:</label>
        <Select
          className="select"
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
          <p className="error-text">{errorMessage.category}</p>
        )}

        <label className="label">Descripción del curso:</label>
        <textarea
          className="textarea"
          name="description"
          value={course.description}
          onChange={handleChange}
        />
        {errorMessage.description && (
          <p className="error-text">{errorMessage.description}</p>
        )}

        <div className="image-section">
          <label className="image-label">Imagen del curso:</label>
          <input
            type="file"
            accept="image/*"
            className="image-input"
            ref={imageRef}
            onChange={handleImageChange}
          />
        </div>

        <div className="image-preview-container">
          <div className="image-preview">
            {course.image && <img src={course.image} alt="Vista previa" />}
          </div>
        </div>

        <div className="button-group">
          <button
            type="submit"
            className="btn-primary"
          >
            Actualizar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateCourseForm;
