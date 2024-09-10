import React, { useState, useEffect, useRef } from "react";
import { Modal, Select } from "antd";
import { useCoursesContext } from "../../../context/courses/courses.context";
import { useCategoryContext } from "../../../context/courses/category.context";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const UpdateCourseForm = ({ visible, onClose, onUpdate, courseId }) => {
  const { t } = useTranslation("global");
  const { categories } = useCategoryContext();
  const { updateCourse, getCourse } = useCoursesContext();
  const MAX_DESCRIPTION_LENGTH = 150;

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
          image: null,
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
      setCourse({ ...course, image: file });
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (value.length < 2) {
          setErrorMessage((prev) => ({ ...prev, name: t("updateCourseForm.nameTooShort") }));
        } else {
          setErrorMessage((prev) => ({ ...prev, name: "" }));
        }
        break;
      case "description":
        if (value.length < 6) {
          setErrorMessage((prev) => ({ ...prev, description: t("updateCourseForm.descriptionTooShort") }));
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
    };

    if (!course.name || course.name.length < 2) {
      errors.name = t("updateCourseForm.nameTooShort");
    }
    if (!course.category) {
      errors.category = t("updateCourseForm.categoryRequired");
    }
    if (!course.description || course.description.length < 6) {
      errors.description = t("updateCourseForm.descriptionTooShort");
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
        title: t("updateCourseForm.updateSuccess"),
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
        title: t("updateCourseForm.updateFailure"),
      });
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        footer={null}
        closable={false}
        className="shadow-orange shadow-white border-2 border-black rounded-lg"
        centered
        maskStyle={{ backdropFilter: "blur(15px)" }}
        onCancel={onClose}
      >
        <form onSubmit={handleSubmit} className="bg-gradient-to-tr from-teal-400 to-blue-500 p-4 ">
          <div>
            <h1 className="text-4xl font-black text-center mb-4 text-white">
              {t("updateCourseForm.title")}
            </h1>
            <div className="mb-4">
              <label className="block text-black text-lg font-medium mb-4">
                {t("updateCourseForm.name")}:
                <input
                  className="shadow appearance-none border rounded w-full py-1 px-3 text-black leading-tight focus:outline-none focus:shadow-outline mt-2 font-normal text-base"
                  type="text"
                  name="name"
                  value={course.name}
                  onChange={handleChange}
                />
                {errorMessage.name && (
                  <p className="text-red-500 text-sm mt-1">{errorMessage.name}</p>
                )}
              </label>
            </div>
            <div>
              <label className="block text-black text-lg font-medium mb-4">
                {t("updateCourseForm.category")}:
                <Select
                  className="font-normal text-black text-base mt-2 "
                  style={{ width: "100%" }}
                  value={course.category}
                  onChange={(value) => setCourse({ ...course, category: value })}
                >
                  {categories.map(category => (
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
            <div>
              <label className="block text-black text-lg font-medium mb-2">
                {t("updateCourseForm.description")}:
                <textarea
                  className="shadow appearance-none border text-base rounded w-full py-2 px-3 text-black leading-tight font-normal focus:outline-none focus:shadow-outline mt-2 resize-none"
                  name="description"
                  value={course.description}
                  onChange={handleChange}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  style={{ minHeight: "100px" }}
                />
                <div className="text-white mt-1 text-right">
                  {course.description.length}/{MAX_DESCRIPTION_LENGTH}
                </div>
                {errorMessage.description && (
                  <p className="text-red-500 text-sm mt-1">{errorMessage.description}</p>
                )}
              </label>
            </div>
            <div>
              <label className="block text-black text-lg font-bold mb-2">
                {t("updateCourseForm.image")}:
                <input
                  className="shadow text-normal appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline-red-100 italic mt-2"
                  type="file"
                  accept="image/*"
                  ref={imageRef}
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
          <div className="flex justify-center mt-4 space-x-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
              type="submit"
            >
              {t("updateCourseForm.updateButton")}
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
              type="button"
              onClick={onClose}
            >
              {t("updateCourseForm.closeButton")}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default UpdateCourseForm;