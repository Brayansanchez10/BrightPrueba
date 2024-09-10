import React, { useState, useEffect } from "react";
import { Button, Input, message } from "antd";
import {
  ReloadOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  BellOutlined,
} from "@ant-design/icons";
import LeftBar from "../../Dashboard/LeftBar";
import { useUserContext } from "../../../context/user/user.context";
import { useCoursesContext } from "../../../context/courses/courses.context";
import CreateCourseForm from "../Courses/CreateCourseForm";
import UpdateCourseForm from "../Courses/UpdateCourseForm";
import Navbar from "../NavBar";
import AssignContentModal from "./AssignContentModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import CourseDetailsModal from "./CourseDetailsModal";
import NotifyCourseModal from "./NotifyCourseModal";
import { useTranslation } from "react-i18next";
import axios from "axios";

const DataTablete = () => {
  const { t } = useTranslation("global");
  const { getUsers, usersData } = useUserContext();
  const {
    getAllCourses,
    courses,
    asignarContenido,
    deleteCourse,
    updateCourse,
  } = useCoursesContext();
  const [searchValue, setSearchValue] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [contentFile, setContentFile] = useState(null);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isLeftBarVisible, setIsLeftBarVisible] = useState(false);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);
  const [isNotifyModalVisible, setIsNotifyModalVisible] = useState(false);

  useEffect(() => {
    getUsers();
    getAllCourses();
  }, []);

  useEffect(() => {
    const filteredCourses = courses.filter(course =>
      course.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      course.category.toLowerCase().includes(searchValue.toLowerCase()) ||
      course.description.toLowerCase().includes(searchValue.toLowerCase())
    );

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
    message.success(t('courses.updateSuccess'));
    window.location.reload();
    setShowUpdateForm(false);
    setSelectedCourse(null);
  };

  const handleCreateCourse = (curso) => {
    console.log(t('courses.newCourse'), curso);
    setShowCreateForm(false);
  };

  const handleAssignButtonClick = (course) => {
    setSelectedCourse(course);
    setIsAssignModalVisible(true);
  };

  const handleAssignContent = async () => {
    if (selectedCourse && contentFile) {
      const courseId = selectedCourse._id;
      const res = await asignarContenido(courseId, contentFile);

      console.log(t('courses.assignedContent'), res);
      setIsAssignModalVisible(false);
      window.location.reload();
    }
  };

  const handleDeleteButtonClick = (course) => {
    setCourseToDelete(course);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCourse(courseToDelete._id);
      message.success(t('courses.deleteSuccess'));
      getAllCourses();
    } catch (error) {
      message.error(t('courses.deleteError'));
    } finally {
      setIsDeleteModalVisible(false);
      setCourseToDelete(null);
    }
  };

  const handleRemoveResource = async (index) => {
    if (selectedCourse) {
      const updatedContent = [...selectedCourse.content];
      updatedContent.splice(index, 1);

      try {
        await updateCourse(selectedCourse._id, {
          ...selectedCourse,
          content: updatedContent,
        });
        setSelectedCourse((prevCourse) => ({
          ...prevCourse,
          content: updatedContent,
        }));
        message.success(t('courses.removeResourceSuccess'));
      } catch (error) {
        message.error(t('courses.removeResourceError'));
      }
    }
  };

  const handleDetailsButtonClick = (course) => {
    setSelectedCourseDetails(course);
    setIsDetailsModalVisible(true);
  };

  const handleNotifyButtonClick = (course) => {
    setSelectedCourse(course);
    setIsNotifyModalVisible(true);
  };

  const handleSendNotification = async (recipients) => {
    try {
      const response = await axios.post('/api/users/notify-course', {
        courseId: selectedCourse._id,
        recipients: recipients
      });
      if (response.data.message === "Course notification emails sent successfully") {
        message.success(t('courses.notificationSent'));
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      message.error(t('courses.notificationError'));
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const generateIds = () => {
    const filteredCourses = courses.filter(course =>
      course.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      course.category.toLowerCase().includes(searchValue.toLowerCase()) ||
      course.description.toLowerCase().includes(searchValue.toLowerCase())
    );

    return filteredCourses
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .map((_, index) => index + 1 + (currentPage - 1) * itemsPerPage);
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    course.category.toLowerCase().includes(searchValue.toLowerCase()) ||
    course.description.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-t from-blue-200 via-blue-400 to-blue-600 overflow-hidden min-h-screen">
      <div className="flex h-full">
        <LeftBar onVisibilityChange={setIsLeftBarVisible} />
        <div
          className={`w-full transition-all duration-300 ${
            isLeftBarVisible ? "ml-56 max-w-full" : ""
          }`}
        >
          <Navbar />
          <div className="flex flex-col mt-6 px-4">
            <div>
              <h2 className="text-2xl font-black text-white text-center">
                {t('courses.title')}
              </h2>
              <div className="flex flex-col items-center justify-center mt-4">
                <Button
                  type="primary"
                  style={{ backgroundColor: "green" }}
                  onClick={handleCreateCourseClick}
                  className="text-center font-medium text-base"
                >
                  <b>{t('courses.createCourse')}</b>
                </Button>
                <Input
                  placeholder={t('courses.searchPlaceholder')}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-44 text-center font-medium text-base mt-2"
                />
              </div>
              <div className="mt-10 flex justify-center">
                <div className="overflow-auto w-full">
                  <table className="min-w-full overflow-x-auto mb-4">
                    <thead>
                      <tr>
                        <th className="text-xl px-3 py-3 bg-blue-500 text-white border-2 cursor-pointer border-blue-800">
                          {t('courses.id')}
                        </th>
                        <th className="text-xl px-8 py-3 bg-yellow-500 text-white border-2 cursor-pointer border-blue-800">
                          {t('courses.category')}
                        </th>
                        <th className="text-xl px-6 py-3 bg-green-500 text-white border-2 cursor-pointer border-blue-800">
                          {t('courses.name')}
                        </th>
                        <th className="text-xl px-48 py-3 bg-purple-500 text-white border-2 cursor-pointer border-blue-800">
                          {t('courses.description')}
                        </th>
                        <th className="text-xl px-20 py-3 bg-red-500 text-white border-2 border-blue-800">
                          {t('courses.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        )
                        .map((course, index) => (
                          <tr key={course._id}>
                            <td className="border-2 border-blue-800 bg-gray-300 text-lg text-black mt-1 text-center font-black">
                              {generateIds()[index]}
                            </td>
                            <td className="border-2 border-blue-800 bg-gray-300 text-lg text-black mt-1 text-center">
                              {course.category}
                            </td>
                            <td className="border-2 border-blue-800 bg-gray-300 text-lg text-black mt-1 text-center">
                              {course.title}
                            </td>
                            <td className="border-2 border-blue-800 bg-gray-300 text-lg text-black mt-1 text-balance px-1">
                              {course.description}
                            </td>
                            <td className="border-2 border-blue-800 px-1 py-2 bg-gray-300">
                              <div className="flex justify-center space-x-2">
                                <Button
                                  className=" bg-green-500 h-10 text-lg text-white"
                                  onClick={() =>
                                    handleAssignButtonClick(course)
                                  }
                                  icon={<CheckCircleOutlined />}
                                />
                                <Button
                                  className=" bg-blue-500 h-10 text-lg text-white"
                                  icon={<ReloadOutlined />}
                                  onClick={() =>
                                    handleUpdateButtonClick(course)
                                  }
                                />
                                <Button
                                  className="bg-purple-600 text-white text-lg h-10"
                                  icon={<InfoCircleOutlined />}
                                  onClick={() =>
                                    handleDetailsButtonClick(course)
                                  }
                                />
                                <Button
                                  className="bg-orange-500 h-10 text-lg text-white"
                                  icon={<BellOutlined />}
                                  onClick={() =>
                                    handleNotifyButtonClick(course)
                                  }
                                />
                                <Button
                                  className="bg-red-500 h-10 text-lg text-white"
                                  icon={<DeleteOutlined />}
                                  onClick={() =>
                                    handleDeleteButtonClick(course)
                                  }
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
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
            courseId={selectedCourse ? selectedCourse._id : null}
          />

          <AssignContentModal
            visible={isAssignModalVisible}
            onClose={() => setIsAssignModalVisible(false)}
            onAssignContent={handleAssignContent}
            selectedCourse={selectedCourse}
            setContentFile={setContentFile}
            handleRemoveResource={handleRemoveResource}
          />

          <DeleteConfirmationModal
            visible={isDeleteModalVisible}
            onClose={() => setIsDeleteModalVisible(false)}
            onConfirm={handleDeleteConfirm}
          />

          <CourseDetailsModal
            visible={isDetailsModalVisible}
            onClose={() => setIsDetailsModalVisible(false)}
            course={selectedCourseDetails}
          />

          <NotifyCourseModal
                visible={isNotifyModalVisible}
                onClose={() => setIsNotifyModalVisible(false)}
                onSendEmail={handleSendNotification}
                usersData={usersData}
              />
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mb-8 mt-10">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 mx-1 bg-gray-200 text-gray-800 border"
          >
            {t('courses.previous')}
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-1 mx-1 ${
                currentPage === index + 1
                  ? "bg-black border text-white"
                  : "bg-gray-200 text-gray-800 border"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 mx-1 bg-gray-200 text-gray-800 border"
          >
            {t('courses.next')}
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTablete;