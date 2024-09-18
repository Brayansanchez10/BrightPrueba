import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import HoverCard from "../Cards/HoverCard";
import NavigationBar from "../NavigationBar";
import { useCoursesContext } from "../../../context/courses/courses.context";
import { useUserContext } from "../../../context/user/user.context";
import { useAuth } from "../../../context/auth.context";
import { useTranslation } from 'react-i18next';
import Logo from "../../../assets/img/hola.png";

const Course = () => {
  const { t } = useTranslation("global"); //Pequeño ajuste de correcion de global, estaba mal escrito.
  const location = useLocation();
  const { title } = location.state || { title: "" };
  const { courses } = useCoursesContext();
  const { user } = useAuth();
  const { registerToCourse } = useUserContext();
  const [itemsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [userCourses, setUserCourses] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (user && user.data) {
      if (user.data.courses) {
        setUserCourses(user.data.courses);
      }
    }
  }, [user]);

  useEffect(() => {
    if (selectedCourse) {
      const isUserRegistered = userCourses.includes(selectedCourse._id);
      setIsRegistered(isUserRegistered);
    }
  }, [selectedCourse, userCourses]);

  const filteredCourses = courses.filter((course) => course.category === title);

  const handleCardClick = (course) => {
    setSelectedCourse(course);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleRegister = async () => {
    if (user && user.data && user.data.id) {
      try {
        await registerToCourse(user.data.id, selectedCourse._id);
        setIsConfirmModalOpen(false);
        setIsSuccessModalOpen(true);
        setUserCourses((prev) => [...prev, selectedCourse._id]);
      } catch (error) {
        console.error("Error al registrar el curso:", error);
      }
    } else {
      console.error("Usuario no autenticado");
    }
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 min-h-screen overflow-hidden">
      <NavigationBar />
      <Link to="/Home" className="inline-block bg-purple-700 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded transition-colors duration-300 cursor-pointer m-1"> 
        &#8678; {t('notFound.return')}
      </Link>
      {filteredCourses.length > 0 && (
        <div className="flex justify-center mt-14 font-black italic">
          <h1 className="text-3xl bg-gradient-to-br from-red-300 to-pink-500 py-1 border-white
          sm:text-4xl 
          md:text-5xl 
          lg:text-5xl font-bold text-white text-center flex justify-center border px-4 mx-2">
            {t('courseComponent.courses_of')} {title}
          </h1>
        </div>
      )}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-1 gap-y-0 mt-10 mx-2 
        sm:grid-cols-2 sm:gap-2 sm:gap-y-1 sm:mt-16 sm:mx-4
        md:grid-cols-3 md:gap-3 md:gap-y-2 md:mt-20 md:mx-4
        lg:grid-cols-4 lg:gap-4 lg:gap-y-0 lg:mt-20  lg:mx-6 ">
          {paginatedCourses.map((course, index) => (
            <HoverCard
              key={index}
              title={course.title}
              description={course.description}
              ruta={course.image}
              onClick={() => handleCardClick(course)}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center mt-20 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800 sm:text-2xl md:text-3xl lg:text-4xl">{title}</h2>
            <img className="h-20 mb-4 mx-auto sm:h-24 md:h-36 lg:h-48" src={Logo} alt="Logo" />
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800 sm:text-2xl md:text-3xl lg:text-4xl">
              {t('courseComponent.no_courses_available')}
            </h2>
            <p className="text-center text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl">
              {t('courseComponent.check_back_later')}
            </p>
          </div>
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center mb-4 mt-8">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 mx-1 bg-gray-200 text-gray-800 border"
          >
            {t('courseComponent.previous')}
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
            {t('courseComponent.next')}
          </button>
        </div>
      )}
      {isConfirmModalOpen && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-35 flex items-center justify-center px-4">
          <div className="bg-purple-200 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {t('courseComponent.confirm_registration')}
            </h2>
            {isRegistered ? (
              <p className="mb-4 text-center">
                {t('courseComponent.already_registered')}{" "}
                <strong>{selectedCourse.title}</strong>
              </p>
            ) : (
              <p className="mb-4 text-center">
                {t('courseComponent.confirm_message')}{" "}
                <strong>{selectedCourse.title}</strong>?
              </p>
            )}
            <div className="flex justify-center gap-4 mt-2">
              {!isRegistered && (
                <button
                  className="py-2 px-4 bg-green-500 hover:bg-green-400 text-white rounded transition-colors"
                  onClick={handleRegister}
                >
                  {t('courseComponent.register')}
                </button>
              )}
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400 transition-colors"
                onClick={closeConfirmModal}
              >
                {t('courseComponent.close')}
              </button>
            </div>
          </div>
        </div>
      )}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-35 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">{t('courseComponent.successful_registration')}</h2>
            <p className="mb-4 text-center">
              {t('courseComponent.success_message')}
            </p>
            <div className="flex justify-center">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400 transition-colors"
              onClick={closeSuccessModal}
            >
              {t('courseComponent.close')}
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Course;
