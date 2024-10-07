import React, { useState, useEffect } from "react";
import { Button, Input, message } from "antd";
import {
  ReloadOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  FileAddOutlined,
  BellOutlined,
  QrcodeOutlined
} from "@ant-design/icons";
import LeftBar from "../../Dashboard/LeftBar";
import { useUserContext } from "../../../context/user/user.context";
import { useCoursesContext } from "../../../context/courses/courses.context";
import CreateCourseForm from "../Courses/CreateCourseForm";
import UpdateCourseForm from "../Courses/UpdateCourseForm";
import Navbar from "../NavBar";
import CreateResourceModal from "../Resources/CreateResourceModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import CourseDetailsModal from "./CourseDetailsModal";
import NotifyCourseModal from "./NotifyCourseModal";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import CreateSubCategoryForm from "../SubCategories/CreateSubCategoryForm";

const DataTablete = () => {
  const { t } = useTranslation("global");
  const { getUsers, usersData } = useUserContext();
  const { getAllCourses, courses, deleteCourse, updateCourse, crearRecurso } =
    useCoursesContext();
  const [searchValue, setSearchValue] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [contentFile, setContentFile] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // Agregar estado para totalItems
  const [isLeftBarVisible, setIsLeftBarVisible] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);
  const [isNotifyModalVisible, setIsNotifyModalVisible] = useState(false);
  const [resourceFile, setResourceFile] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [dataFlag, setDataFlag] = useState(false);
  const [subCategoryForm, setSubCategoryForm] = useState(false); 

  useEffect(() => {
    getUsers();
    getAllCourses();
  }, []);

  useEffect(() => {
    const filteredCourses = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        course.category.toLowerCase().includes(searchValue.toLowerCase()) ||
        course.description.toLowerCase().includes(searchValue.toLowerCase())
    );

    setTotalItems(filteredCourses.length); // Actualizamos totalItems
    setTotalPages(Math.ceil(filteredCourses.length / itemsPerPage));
  }, [courses, searchValue, itemsPerPage]);

  const handleCreateCourseClick = () => setShowCreateForm(true);

  const handleCreateFormClose = () => setShowCreateForm(false);

  const handleUpdateButtonClick = (course) => {
    setSelectedCourse(course);
    setShowUpdateForm(true);
  };

  const handleUpdateFormClose = () => {
    setShowUpdateForm(false);
    setSelectedCourse(null);
  };

  const handleUpdateCourse = async (updatedCourse) => {
    if (dataFlag) return;

    setDataFlag(true);
    try {
      await updateCourse(updatedCourse);
      message.success(t("courses.updateSuccess"));
    } catch (error) {
      message.error(t("courses.updateError"));
    } finally {
      setDataFlag(false);
      setShowUpdateForm(false);
      setSelectedCourse(null);
    }
  };

  const handleCreateResourceClick = (course) => {
    setSelectedCourse(course);
    setSelectedCourseId(course.id);
    setIsCreateModalVisible(true);
  };

  const handleCreateResource = async () => {
    if (dataFlag) return;

    setDataFlag(true);
    if (selectedCourse && selectedCourse.id) {
      const courseId = selectedCourse.id;
      try {
        const res = await crearRecurso(courseId);
        setIsCreateModalVisible(false);
      } catch (error) {
        console.error("Error al crear recurso:", error);
      } finally {
        setDataFlag(false);
      }
    } else {
      message.error(t("courses.noCourseSelected"));
    }
  };

  const handleCreateCourse = async (curso) => {
    if (dataFlag) return;
    setDataFlag(true);
    try {
      await createCourse(curso);
      setShowCreateForm(false);
    } catch (error) {
      console.log();
    } finally {
      setDataFlag(false);
      getAllCourses();
    }
  };

  const handleDeleteButtonClick = (course) => {
    setCourseToDelete(course);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (dataFlag) return;
    setDataFlag(true);

    try {
      await deleteCourse(courseToDelete.id);
      message.success(t("courses.deleteSuccess"));
      window.location.reload();
    } catch (error) {
      message.error(t("courses.deleteError"));
    } finally {
      setDataFlag(false);
      setIsDeleteModalVisible(false);
      setCourseToDelete(null);
    }
  };

  const handleDetailsButtonClick = (course) => {
    setSelectedCourseDetails(course);
    setIsDetailsModalVisible(true);
  };

  const handleNotifyButtonClick = (course) => {
    setSelectedCourse(course); // Asegúrate de guardar todo el curso, no solo el ID
    setIsNotifyModalVisible(true);
  };

  const handleSubCategoryButtonClick = (course) => { // Abrir Modal para subCategorias
    setSelectedCourse(course);
    setSelectedCourseId(course.id);
    setSubCategoryForm(true);
  };

  const handleSendNotification = async (recipients) => {
    try {
      if (!selectedCourse || !selectedCourse.id) {
        throw new Error("Course ID is not defined");
      }
  
      const response = await axios.post(`http://localhost:3068/PE/courses/${selectedCourse.id}/notify-specific`, {
        recipients: recipients, // Pasa los destinatarios como está configurado
      });
  
      if (response.data.message === "Course notification emails sent successfully") {
        message.success(t('courses.notificationSent'));
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      message.error(t("courses.notificationError"));
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const generateIds = () => {
    const filteredCourses = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        course.category.toLowerCase().includes(searchValue.toLowerCase()) ||
        course.description.toLowerCase().includes(searchValue.toLowerCase())
    );

    return filteredCourses
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .map((_, index) => index + 1 + (currentPage - 1) * itemsPerPage);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      course.category.toLowerCase().includes(searchValue.toLowerCase()) ||
      course.description.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setItemsPerPage(6);
      } else if (width < 1024) {
        setItemsPerPage(10);
      } else {
        setItemsPerPage(12);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call to set the correct itemsPerPage

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dataFlag]);

  return (
    <div className="bg-gray-200 overflow-hidden min-h-screen">
      <div className="flex h-full">
        <LeftBar onVisibilityChange={setIsLeftBarVisible} />
        <div
          className={`w-full transition-all duration-300 ${
            isLeftBarVisible ? "ml-56 max-w-full" : ""
          }`}
        >
          <Navbar />
          <div className="flex flex-col mt-14">
            <div>
              <div className="flex flex-row items-center justify-between pl-[72px] pr-12">
                <h2 className="text-3xl text-purple-900 font-bungee">
                  {t("courses.title")}
                </h2>
                <div className="flex px-4 py-2 border bg-white border-gray-300 rounded-xl shadow-lg">
                  <FaSearch size={"18px"} className="mt-1 mr-2" />
                  <input
                    type="search"
                    className="outline-none w-full md:w-[280px] lg:w-[360px]"
                    placeholder={t("datatable.SearchByName")}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
              </div>
              <Button
                type="primary"
                style={{ backgroundColor: "#4c1d95" }}
                onClick={handleCreateCourseClick}
                className="ml-16 mt-6 rounded-t-lg rounded-b-none"
                disabled={dataFlag}
              >
                <b>{t("courses.createCourse")}</b>
              </Button>
            </div>
            <div className="flex justify-center">
              <div className="overflow-auto w-full px-6 mx-12 py-6 bg-white rounded-t-xl rounded-b-xl shadow-lg shadow-purple-300">
                <table className="min-w-full overflow-x-auto">
                  <thead>
                    <tr>
                      <th className="text-lg px-3 py-3 bg-white border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200">
                        {t("courses.id")}
                      </th>
                      <th className="text-lg px-3 py-3 bg-white border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200">
                        {t("courses.category")}
                      </th>
                      <th className="text-lg px-3 py-3 bg-white border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200">
                        {t("courses.name")}
                      </th>
                      <th className="text-lg px-20 w-[400px] py-3 bg-white border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200">
                        {t("courses.description")}
                      </th>
                      <th className="text-lg px-2 py-3 bg-white border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200">
                        {t("courses.userCount")}
                      </th>
                      <th className="px-4 py-3 bg-white text-lg border-2 border-x-transparent font-bungee border-t-transparent border-b-cyan-200">
                        {t("courses.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((course, index) => (
                        <tr key={course.id}>
                          <td className="border-2 border-x-transparent px-1 py-2 bg-white text-lg text-black text-center border-t-transparent border-b-cyan-200">
                            {generateIds()[index]}
                          </td>
                          <td className="text-center border-2 border-x-transparent px-6 py-2 bg-white text-lg text-black border-t-transparent border-b-cyan-200">
                            {course.category}
                          </td>
                          <td className="border-2 border-x-transparent px-6 py-2 bg-white text-lg text-black text-center border-t-transparent border-b-cyan-200">
                            {course.title}
                          </td>
                          <td className="border-2 border-x-transparent px-4 py-2 bg-white text-lg text-black text-center max-w-2xl break-words whitespace-normal border-t-transparent border-b-cyan-200">
                            {course.description}
                          </td>
                          <td className="border-2 border-x-transparent px-6 py-2 bg-white text-lg text-black text-center border-t-transparent border-b-cyan-200">
                            {course.enrolledCount}
                          </td>
                          <td className="border-2 border-x-transparent px-6 py-2 bg-white text-lg text-black text-center border-t-transparent border-b-cyan-200">
                            <div className="flex justify-center space-x-2">
                              <Button className="bg-purple-800 text-white font-bold py-1.5 px-4 rounded-3xl min-w-[120px] shadow-md shadow-gray-400"
                                  onClick={() =>
                                    handleSubCategoryButtonClick(course)
                                  }
                                  icon={<QrcodeOutlined />}
                                >
                                  {t("subCategory.ButtonCreate")}
                              </Button>
                              <Button
                                className="bg-green-500 text-white font-bold py-1.5 px-4 rounded-3xl min-w-[120px] shadow-md shadow-gray-400"
                                onClick={() =>
                                  handleCreateResourceClick(course)
                                }
                                icon={<FileAddOutlined />}
                              >
                                {t("courses.ButtonUpContent")}
                              </Button>
                              <Button
                                className="bg-blue-500 hover:bg-sky-700 text-white font-bold py-1.5 px-4 rounded-full ml-2 shadow-md shadow-gray-400"
                                icon={<ReloadOutlined />}
                                style={{ minWidth: "40px" }}
                                onClick={() => handleUpdateButtonClick(course)}
                              />
                              <Button
                                className="bg-purple-500 hover:bg-zinc-300 text-white font-bold py-1.5 px-4 rounded-full ml-2 shadow-md shadow-gray-400"
                                icon={<InfoCircleOutlined />}
                                style={{ minWidth: "40px" }}
                                onClick={() => handleDetailsButtonClick(course)}
                              />
                              <Button
                                className="bg-orange-500 hover:bg-zinc-300 text-white font-bold py-1.5 px-4 rounded-full ml-2 shadow-md shadow-gray-400"
                                icon={<BellOutlined />}
                                style={{ minWidth: "40px" }}
                                onClick={() => handleNotifyButtonClick(course)}
                              />
                              <Button
                                className="bg-red-500 hover:bg-zinc-300 text-white font-bold py-1.5 px-4 rounded-full ml-2 shadow-md shadow-gray-400"
                                icon={<DeleteOutlined />}
                                style={{ minWidth: "40px" }}
                                onClick={() => handleDeleteButtonClick(course)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {totalPages > 1 && (
                  <div className="flex justify-end items-center mt-5 space-x-2">
                    {/* Botón anterior */}
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-2 py-1 rounded-full ${
                        currentPage === 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-800"
                      }`}
                    >
                      <FaChevronLeft size={13} />
                    </button>

                    {/* Mostrar el rango actual */}
                    <span className="text-gray-600">
                      {`${(currentPage - 1) * itemsPerPage + 1} - ${
                        currentPage * itemsPerPage > totalItems
                          ? totalItems
                          : currentPage * itemsPerPage
                      }`}{" "}
                      {t("datatable.of")} {totalItems}
                    </span>

                    {/* Botón siguiente */}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-2 py-1 rounded-full ${
                        currentPage === totalPages
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-800"
                      }`}
                    >
                      <FaChevronRight size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <CreateCourseForm
            visible={showCreateForm}
            onClose={handleCreateFormClose}
            onCreate={handleCreateCourse}
          />

          <UpdateCourseForm
            visible={showUpdateForm}
            onClose={handleUpdateFormClose}
            onUpdate={handleUpdateCourse}
            courseId={selectedCourse ? selectedCourse.id : null}
          />

          <CreateResourceModal
            isVisible={isCreateModalVisible}
            onCancel={() => setIsCreateModalVisible(false)}
            courseId={selectedCourse?.id}
            onCreate={handleCreateResource}
            resourceFile={resourceFile}
            onFileChange={(e) => setResourceFile(e.target.files[0])}
          />

          <CreateSubCategoryForm
            isVisible={subCategoryForm}
            onCancel={() => setSubCategoryForm(false)}
            courseId={selectedCourseId}
          />

          <DeleteConfirmationModal
            visible={isDeleteModalVisible}
            onClose={() => setIsDeleteModalVisible(false)}
            onConfirm={handleDeleteConfirm}
            courseName={courseToDelete?.title}
          />

          <CourseDetailsModal
            visible={isDetailsModalVisible}
            onClose={() => setIsDetailsModalVisible(false)}
            course={selectedCourseDetails}
          />

          <NotifyCourseModal
            visible={isNotifyModalVisible}
            onClose={() => setIsNotifyModalVisible(false)}
            courseId={selectedCourse?.id} // Pasamos el ID del curso seleccionado al modal
            onSendEmail={handleSendNotification}
          />
        </div>
      </div>
    </div>
  );
};

export default DataTablete;
