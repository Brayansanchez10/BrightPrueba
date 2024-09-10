import React, { useState, useRef } from "react";
import { Modal, Select } from "antd";
import Swal from "sweetalert2";
import { useCoursesContext } from "../../../context/courses/courses.context";
import { useCategoryContext } from "../../../context/courses/category.context";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const CreateCourseForm = ({ visible, onClose, onCreate }) => {
  const { categories } = useCategoryContext();
  const { createCourse } = useCoursesContext();
  const { t } = useTranslation("global");
  const MAX_DESCRIPTION_LENGTH = 150;

  const [course, setCourse] = useState({
    name: "",
    category: "",
    description: "",
    image: null,
    imagePreview: null,
  });
  const [errorMessage, setErrorMessage] = useState({
    name: "",
    category: "",
    description: "",
    image: "",
  });

  const imageRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
    validateField(name, value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setCourse({ ...course, image: file, imagePreview: URL.createObjectURL(file) });
      setErrorMessage((prev) => ({ ...prev, image: "" }));
    } else {
      e.target.value = null;
      setErrorMessage((prev) => ({ ...prev, image: t("createCourseForm.invalidImageFile") }));
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (value.length < 2) {
          setErrorMessage((prev) => ({ ...prev, name: t("createCourseForm.nameTooShort") }));
        } else {
          setErrorMessage((prev) => ({ ...prev, name: "" }));
        }
        break;
      case "description":
        if (value.length < 6) {
          setErrorMessage((prev) => ({ ...prev, description: t("createCourseForm.descriptionTooShort") }));
        } else {
          setErrorMessage((prev) => ({ ...prev, description: "" }));
        }
        break;
      default:
        break;
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

    if (!course.name || course.name.length < 2) {
      errors.name = t("createCourseForm.nameTooShort");
    }
    if (!course.category) {
      errors.category = t("createCourseForm.categoryRequired");
    }
    if (!course.description || course.description.length < 6) {
      errors.description = t("createCourseForm.descriptionTooShort");
    }
    if (!course.image) {
      errors.image = t("createCourseForm.imageRequired");
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
      await createCourse(courseData);
      Swal.fire({
        icon: 'success',
        title: t("createCourseForm.createSuccess"),
        timer: 1000,
        showConfirmButton: false,
      }).then(() => {
        onCreate(courseData);
        resetForm();
        onClose();
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: t("createCourseForm.createFailure"),
        timer: 3000,
        showConfirmButton: true,
      });
    }
  };

  const resetForm = () => {
    setCourse({
      name: "",
      category: "",
      description: "",
      image: null,
      imagePreview: null,
    });
    setErrorMessage({
      name: "",
      category: "",
      description: "",
      image: "",
    });
    if (imageRef.current) {
      imageRef.current.value = null;
    }
  };

  return (
    <>
      <Modal
        open={visible}
        footer={null}
        closable={false}
        className="shadow-orange shadow-white border-2 border-black rounded-lg"
        centered
        maskStyle={{ backdropFilter: "blur(15px)" }}
        onCancel={onClose}
      >
        <form onSubmit={handleSubmit} className="bg-gradient-to-tr from-teal-400 to-blue-500 shadow-lg rounded-lg p-2">
          <div>
            <h1 className="text-3xl font-bold text-white text-center mb-2">{t("createCourseForm.title")}</h1>
            <div className="mb-4">
              <label className="block text-black text-base font-bold mb-2">
                {t("createCourseForm.name")}:
                <input
                  className="shadow font-normal appearance-none border rounded w-full py-1 px-3 text-gray-900 leading-tight focus:outline-none focus:ring focus:border-green-300 mt-1"
                  type="text"
                  name="name"
                  value={course.name}
                  onChange={handleChange}
                  required
                />
                {errorMessage.name && (
                  <p className="text-red-500 text-sm mt-1">{errorMessage.name}</p>
                )}
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-black text-base font-bold mb-2">
                {t("createCourseForm.category")}:
                <Select
                  className="w-full mt-1"
                  style={{ borderRadius: "0.375rem" }}
                  value={course.category}
                  onChange={(value) => setCourse({ ...course, category: value })}
                  required
                >
                  {categories.map((category) => (
                    <Option key={category._id} value={category.name}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
                {errorMessage.category && (
                  <p className="text-red-500 text-sm mt-1">{errorMessage.category}</p>
                )}
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-black text-base font-bold mb-2">
                {t("createCourseForm.description")}:
                <textarea
                  className="shadow appearance-none font-normal border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:ring focus:border-green-300 mt-1 resize-none"
                  name="description"
                  value={course.description}
                  onChange={handleChange}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  style={{ minHeight: "100px" }}
                  required
                />
                <div className="text-gray-300 text-right mt-1">{course.description.length}/{MAX_DESCRIPTION_LENGTH}</div>
                {errorMessage.description && (
                  <p className="text-red-500 text-sm mt-1">{errorMessage.description}</p>
                )}
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-black text-lg font-bold mb-2">
                {t("createCourseForm.image")}:
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring focus:border-green-300 mt-1"
                  type="file"
                  accept="image/*"
                  ref={imageRef}
                  onChange={handleImageChange}
                  required
                />
                {errorMessage.image && (
                  <p className="text-red-500 text-sm mt-1">{errorMessage.image}</p>
                )}
              </label>
              {course.imagePreview && (
                <div className="mt-2 flex justify-center">
                  <img src={course.imagePreview} alt="Image Preview" className="w-56 h-56 rounded-lg shadow-md" />
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center mt-4 space-x-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
              type="submit"
            >
              {t("createCourseForm.createButton")}
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
              type="button"
              onClick={onClose}
            >
              {t("createCourseForm.closeButton")}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreateCourseForm;

