import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NavigationBar from "./../NavigationBar";
import { useUserContext } from "../../../context/user/user.context";
import { useAuth } from "../../../context/auth.context";
import { useTranslation } from "react-i18next";
import { useCourseProgressContext } from "../../../context/courses/progress.context";
import { useCoursesContext } from "../../../context/courses/courses.context";
import Logo from "../../../assets/img/hola.png";
import pulpoImage from "../../../assets/img/pulpo.png";
import { FaFlagCheckered, FaSearch, FaTimes } from "react-icons/fa";
import Footer from "../../footer";

export default function UserCourses() {
  const { t } = useTranslation("global");
  const { user } = useAuth();
  const { getUserCourses } = useUserContext();
  const { getCourseProgress } = useCourseProgressContext();
  const { unregisterFromCourse } = useCoursesContext();
  const [userCourses, setUserCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});
  const navigate = useNavigate();
  const [itemsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const fetchUserCourses = useCallback(async () => {
    if (user && user.data && user.data.id) {
      try {
        const courses = await getUserCourses(user.data.id);
        setUserCourses(courses);
      } catch (error) {
        console.error("Error al obtener los cursos del usuario:", error);
      }
    }
  }, [user, getUserCourses]);

  useEffect(() => {
    fetchUserCourses();
  }, [fetchUserCourses]);

  const fetchCourseProgress = useCallback(async () => {
    if (userCourses.length > 0 && user && user.data && user.data.id) {
      const progressData = {};
      for (let course of userCourses) {
        try {
          const progressResponse = await getCourseProgress(user.data.id, course.id);
          const courseProgress = progressResponse ?? 0;
          progressData[course.id] = courseProgress;
        } catch (error) {
          console.error(`Error al obtener el progreso para el curso ${course.id}:`, error);
          progressData[course.id] = 0;
        }
      }
      setCourseProgress(progressData);
    }
  }, [userCourses, user]);

  useEffect(() => {
    fetchCourseProgress();
  }, [fetchCourseProgress]);

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleUnregister = (e, course) => {
    e.stopPropagation();
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  const confirmUnregister = async () => {
    if (courseToDelete && user && user.data && user.data.id) {
      try {
        await unregisterFromCourse(user.data.id, courseToDelete.id);
        setUserCourses((prevCourses) =>
          prevCourses.filter((course) => course.id !== courseToDelete.id)
        );
        setIsDeleteModalOpen(false);
        setCourseToDelete(null);
      } catch (error) {
        console.error("Error al quitar el registro del curso:", error);
        alert(t("coursesComponent.unregister_error"));
      }
    }
  };

  const totalPages = Math.ceil(userCourses.length / itemsPerPage);

  const paginatedCourses = userCourses
    .filter((course) => {
      const courseName = course.title || "";
      return courseName.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <NavigationBar />
      <div className="flex-grow mt-16">
        {userCourses.length > 0 ? (
          <>
            <motion.div
              className="flex flex-col sm:flex-row justify-between mt-6 mx-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
           <div className="w-full sm:w-auto mb-4 sm:mb-0">
                <motion.h1
                  className="text-3xl sm:text-4xl font-bold text-center sm:text-left font-bungee px-2 sm:px-0"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <span className="text-primary mr-2 block sm:inline">
                    {t("coursesComponent.your")}
                  </span>
                  <span className="text-purple-700 dark:text-secondary block sm:inline">
                    {t("coursesComponent.courses")}
                  </span>
                </motion.h1>
              </div>
              <div className="w-full md:w-auto mt-4 sm:mt-0">
                <motion.div
                  className="flex px-4 py-2 border bg-white border-gray-300 rounded-xl shadow-md"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <FaSearch size={"18px"} className="mt-1 mr-2" />
                  <input
                    type="search"
                    className="bg-white outline-none w-full md:w-[280px] lg:w-[360px] xl:w-[420px]"
                    placeholder={t("coursesComponent.search_placeholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 xl:grid-cols-2 p-4 mx-4 mt-10 gap-8 md:mx-6 lg:mx-10 xl:mx-20 md:gap-10 lg:gap-12 xl:gap-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <AnimatePresence>
                {paginatedCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    className="bg-secondary sm:p-5 min-h-[280px] rounded-2xl shadow-lg shadow-gray-400 dark:shadow-purple-900 cursor-pointer transform hover:scale-105 transition-transform relative"
                    onClick={() => handleCourseClick(course.id)}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="sm:flex sm:flex-row-reverse justify-between">
                      <div className="sm:flex-shrink-0">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-[220px] sm:w-36 sm:h-36 rounded-t-xl sm:rounded-xl object-cover"
                        />
                      </div>
                      <div className="flex-grow p-5">
                        <h3 className="text-xl sm:text-3xl font-bold text-primary mb-2 sm:mb-4 -mt-3 break-words">
                          {course.title}
                        </h3>
                        <p className="text-[12px] sm:text-base text-gray-400 font-semibold">
                          {course.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-white mt-4 sm:mt-6 px-5 pb-5">
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${courseProgress[course.id] || 0}%`,
                          }}
                          transition={{ duration: 1, delay: 0.5 }}
                        ></motion.div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center">
                          <FaFlagCheckered className="text-gray-400 dark:text-primary" />
                          <p className="text-gray-400 dark:text-primary font-semibold ml-2 mr-1">
                            {"Progreso:"}
                          </p>
                          <p className="text-green-600 dark:text-green-500 font-semibold">{`${
                            courseProgress[course.id] || 0
                          }%`}</p>
                        </div>
                        <button
                          onClick={(e) => handleUnregister(e, course)}
                          className="bg-[#B209EB] text-white rounded-full p-2 hover:bg-[#9908c9] transition-colors z-10"
                          aria-label={t("coursesComponent.unregister")}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        ) : (
          <motion.div
            className="flex justify-center items-center mt-20 px-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-secondary p-6 rounded-lg shadow-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full">
              <img
                className="h-20 mb-4 mx-auto sm:h-24 md:h-36 lg:h-48"
                src={Logo}
                alt="Logo"
              />
              <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-primary sm:text-2xl md:text-3xl lg:text-4xl">
                {t("courseComponent.no_courses_enrolled")}
              </h2>
              <p className="text-center text-gray-600 dark:text-primary text-sm sm:text-base md:text-lg lg:text-xl">
                {t("courseComponent.check_back_later")}
              </p>
            </div>
          </motion.div>
        )}

        {totalPages > 1 && (
          <motion.div
            className="flex justify-center mb-8 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          ></motion.div>
        )}
      </div>
      <motion.div
        className="mt-16 border-t-4 border-gray-300 bg-white shadow-inner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Footer />
      </motion.div>

      <AnimatePresence>
        {isDeleteModalOpen && courseToDelete && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="absolute top-5 right-8 cursor-pointer"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                <span className="text-white text-2xl font-bold">X</span>
              </div>

              <div className="h-[125px] bg-gradient-to-r from-[#872626] to-red-500 flex justify-center items-center">
                <img
                  src={pulpoImage}
                  alt="Pulpo"
                  className="w-[162px] h-[148px] mt-6 object-contain"
                />
              </div>

              <div className="p-5 text-center">
                <h1 className="text-2xl font-extrabold text-[#D84545] mt-5 mb-4">
                  {t("deleteCourse.title")}
                </h1>
                <p className="text-lg font-semibold mb-3">
                  {t("deleteCourse.confirmationMessage", {
                    courseName: courseToDelete.title,
                  })}
                </p>
                <p className="text-sm font-extrabold text-red-500 mb-4">
                  {t("deleteCourse.irreversibleMessage")}
                </p>
                <div className="mb-6">
                  <p className="text-md font-semibold mb-2">
                    {t("deleteCourse.loseProgressMessage")}
                  </p>
                  <p className="text-sm mb-2">
                    {t("deleteCourse.currentProgress")}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full  h-2.5 mb-1">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{
                        width: `${courseProgress[courseToDelete.id] || 0}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm font-semibold text-green-600">
                    {`${courseProgress[courseToDelete.id] || 0}%`}
                  </p>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    className="bg-[#FF4236] text-white font-bold text-lg rounded-2xl min-w-[133px] h-9 px-4 shadow-md hover:bg-[#ff2f22] transition-all duration-300"
                    onClick={confirmUnregister}
                  >
                    {t("deleteCourse.confirmButton")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}