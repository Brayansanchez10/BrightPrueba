import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NavigationBar from "./../NavigationBar";
import { useUserContext } from "../../../context/user/user.context";
import { useAuth } from "../../../context/auth.context";
import { useTranslation } from 'react-i18next';
import { useCourseProgressContext } from "../../../context/courses/progress.context.jsx";
import Logo from "../../../assets/img/hola.png";
import { FaFlagCheckered, FaSearch } from 'react-icons/fa';
import Footer from "../../footer.jsx"; 

const CoursesComponent = () => {
  const { t } = useTranslation("global");
  const { user } = useAuth();
  const { getUserCourses } = useUserContext();
  const { getCourseProgress } = useCourseProgressContext();
  const [userCourses, setUserCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});
  const navigate = useNavigate();
  const [itemsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUserCourses = async () => {
      if (user && user.data && user.data.id) {
        try {
          const courses = await getUserCourses(user.data.id);
          setUserCourses(courses);
        } catch (error) {
          console.error("Error al obtener los cursos del usuario:", error);
        }
      }
    };

    fetchUserCourses();
  }, [user, getUserCourses]);

  useEffect(() => {
    const fetchCourseProgress = async () => {
      if (userCourses.length > 0) {
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
    };

    fetchCourseProgress();
  }, [userCourses, user, getCourseProgress]);

  const handleCourseClick = (courseId) => {
    console.log("Course ID:", courseId);
    navigate(`/course/${courseId}`);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(userCourses.length / itemsPerPage);

  const paginatedCourses = userCourses
    .filter(course => {
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
              <div className="w-full sm:w-auto">
                <motion.h1 
                  className="text-4xl font-bold text-center sm:text-left font-bungee"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <span className="text-primary mr-2">{t('coursesComponent.your')}</span>
                  <span className="text-purple-700 dark:text-secondary">{t('coursesComponent.courses')}</span>
                </motion.h1>
              </div>
              <div className="w-full md:w-auto mt-4 sm:mt-0">
                <motion.div 
                  className="flex px-4 py-2 border bg-secondary border-gray-300 dark:border-purple-900 rounded-xl shadow-md"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <FaSearch size={"18px"} className="text-primary mt-1 mr-2" />
                  <input
                    type="search"
                    className="bg-secondary dark:text-primary outline-none w-full md:w-[280px] lg:w-[360px] xl:w-[420px]"
                    placeholder={t('coursesComponent.search_placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </motion.div>
              </div>
            </motion.div>
            <motion.div 
              className="grid grid-cols-1 xl:grid-cols-2 p-4 mx-4 mt-10 gap-5 md:mx-6 lg:mx-10 xl:mx-20 md:gap-y-6 lg:gap-y-8 xl:gap-y-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <AnimatePresence>
                {paginatedCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    className="bg-secondary sm:p-5 min-h-[320px] rounded-2xl shadow-lg shadow-gray-400 dark:shadow-purple-900 cursor-pointer transform hover:scale-105 transition-transform"
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
                        <p className="text-[12px] sm:text-base text-gray-400 font-semibold -mb-12">
                          {course.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-white mt-14 sm:mt-20 px-5 pb-5">
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${courseProgress[course.id] || 0}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        ></motion.div>
                      </div>
                      <div className="flex mt-2">
                        <FaFlagCheckered className="text-gray-400 dark:text-primary mt-1"/>
                        <p className="text-gray-400 dark:text-primary font-semibold ml-2 mr-1">{"Progreso:"}</p>
                        <p className="text-green-600 dark:text-green-500 font-semibold">{`${courseProgress[course.id] || 0}%`}</p>
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
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full">
              <img className="h-20 mb-4 mx-auto sm:h-24 md:h-36 lg:h-48" src={Logo} alt="Logo" />
              <h2 className="text-xl font-bold mb-4 text-center text-gray-800 sm:text-2xl md:text-3xl lg:text-4xl">
                {t('courseComponent.no_courses_enrolled')}
              </h2>
              <p className="text-center text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl">
                {t('courseComponent.check_back_later')}
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
          >
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 mx-1 bg-gray-200 text-gray-800 border"
            >
              {t('coursesComponent.previous')}
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
              {t('coursesComponent.next')}
            </button>
          </motion.div>
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
    </motion.div>
  );
};

export default CoursesComponent;