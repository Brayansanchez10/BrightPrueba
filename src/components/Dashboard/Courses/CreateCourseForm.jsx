  import React, { useState, useRef } from "react";
  import { Modal, Select } from "antd";
  import Swal from "sweetalert2";
  import { useCoursesContext } from "../../../context/courses/courses.context";
  import { useCategoryContext } from "../../../context/courses/category.context";
  import { useTranslation } from "react-i18next";
  import holaImage from "../../../assets/img/hola.png";
  import "../css/Custom.css";

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
      <Modal
        open={visible}
        footer={null}
        closable={false}
        className="custom"
        centered
        onCancel={onClose}
        bodyStyle={{
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <div className="absolute top-5 right-8 cursor-pointer" onClick={onClose}>
          <span className="text-white text-2xl font-bold">X</span>
        </div>
        <div className="h-[115px] bg-gradient-to-r from-[#18116A] to-blue-500 flex justify-center items-center">
          <img src={holaImage} alt="Logo" className="w-[200px] h-[200px] mt-12 object-contain" />
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-5 text-center"
        >
          <h1 className="text-2xl font-extrabold text-[#18116A] mt-5 mb-4">
            {t("createCourseForm.title")}
          </h1>
          <div className="text-left mb-4">
            <label className="text-lg font-bold text-[#000000] block">
              {t("createCourseForm.name")}
            </label>
            <input
              className="w-full py-2 px-4 border border-gray-300 rounded-lg mt-2 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              type="text"
              name="name"
              value={course.name}
              onChange={handleChange}
              required
            />
            {errorMessage.name && (
              <p className="text-red-500 text-sm mt-1">{errorMessage.name}</p>
            )}
          </div>
          <div className="text-left mb-4">
            <label className="text-lg font-bold text-[#000000] block">
              {t("createCourseForm.category")}
            </label>
            <Select
              className="w-full mt-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
          </div>
          <div className="text-left mb-4">
            <label className="text-lg font-bold text-[#000000] block">
              {t("createCourseForm.description")}
            </label>
            <textarea
              className="w-full py-2 px-4 border border-gray-300 rounded-lg mt-2 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
              name="description"
              value={course.description}
              onChange={handleChange}
              maxLength={MAX_DESCRIPTION_LENGTH}
              style={{ minHeight: "100px" }}
              required
            />
            <div className="text-gray-300 text-right mt-1">
              {course.description.length}/{MAX_DESCRIPTION_LENGTH}
            </div>
            {errorMessage.description && (
              <p className="text-red-500 text-sm mt-1">{errorMessage.description}</p>
            )}
          </div>
          <div className="text-left mb-4">
            <label className="text-lg font-bold text-[#000000] block">
              {t("createCourseForm.image")}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg mt-2 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              ref={imageRef}
              required
            />
            {errorMessage.image && (
              <p className="text-red-500 text-sm mt-1">{errorMessage.image}</p>
            )}
            {course.imagePreview && (
              <div className="mt-2 flex justify-center">
                <img
                  src={course.imagePreview}
                  alt="Image Preview"
                  className="rounded-lg"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              </div>
            )}
          </div>
          <div className="flex justify-center space-x-4 mt-6">
            <button
              type="submit"
              className="bg-[#18116A] text-white font-bold text-lg rounded-2xl min-w-[133px] h-9 px-4 shadow-md shadow-[#000000] transition-transform transform active:scale-95"
            >
              {t("createCourseForm.createButton")}
            </button>
          </div>
        </form>
      </Modal>
    );
  };

  export default CreateCourseForm;
