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
  const { t } = useTranslation("global");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attempts, setAttempts] = useState("");
  const [link, setLink] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [resources, setResources] = useState([]);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [type, setType] = useState("file");
  const [selection, setSelection] = useState("file");
  const [quizzes, setQuizzes] = useState([]);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("recursos");
  const [subCategory, setSubCategory] = useState([]);
  const [subcategoryId, setSubcategoryId] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (isVisible && courseId) {
      fetchResources(courseId);
      fetchSubCategories(courseId);
    } else {
      setResources([]);
      setSubCategory([]);
    }
  }, [isVisible, courseId]);

  useEffect(() => {
    if (!visible) {
      resetState();
    }
  }, [visible]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchSubCategories = async (courseId) => {
    try {
      const response = await getSubCategoryCourseId(courseId);
      setSubCategory(response.data);
    } catch (error) {
      console.error("Error al obtener los Sub Categories By CourseId", error);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    if (!validateQuizzes()) {
      return;
    }

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

    if (selection === "file" && !selectedFile && quizzes.length === 0) {
      Swal.fire({
        icon: "error",
        title: t("Error"),
        text: t("CreateResource.PleaseSelectFileOrQuiz"),
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

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
      fetchResources(courseId);
      resetState();
    } catch (error) {
      console.error(error);

      if (error.response && error.response.data && error.response.data.error === "Ya existe un recurso con este nombre para esta subCategory.") {
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
      fetchResources(courseId);
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
      <div className="flex flex-col w-full h-full">
        <div className="custom flex justify-center items-center flex-grow w-full overflow-auto">
          <div className={`flex ${windowWidth >= 768 ? 'gap-8' : 'flex-col'} h-full w-full`}>
            {windowWidth >= 768 ? (
              <>
                <RenderLeftContent
                  activeTab={activeTab}
                  subCategory={subCategory}
                  resources={resources}
                  t={t}
                  openEditModal={openEditModal}
                  handleRemoveResource={handleRemoveResource}
                  image={image}
                />
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
              </>
            ) : (
              <>
                <div className="mb-4">
                  <RenderLeftContent
                    activeTab={activeTab}
                    subCategory={subCategory}
                    resources={resources}
                    t={t}
                    openEditModal={openEditModal}
                    handleRemoveResource={handleRemoveResource}
                    image={image}
                  />
                </div>
                <div>
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
              </>
            )}
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