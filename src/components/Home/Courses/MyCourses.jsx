import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./../NavigationBar";
import { useUserContext } from "../../../context/user/user.context";
import { useAuth } from "../../../context/auth.context";
import { useTranslation } from 'react-i18next';
import Logo from "../../../assets/img/hola.png";

const CoursesComponent = () => {
  const { t } = useTranslation("global");
  const { user } = useAuth();
  const { getUserCourses } = useUserContext();
  const [userCourses, setUserCourses] = useState([]);
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

  const handleCourseClick = (courseId) => {
    console.log("Course ID:", courseId);
    navigate(`/course/${courseId}`);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reinicia la página al hacer una búsqueda nueva
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(userCourses.length / itemsPerPage);

  const paginatedCourses = userCourses
    .filter(course => {
      const courseName = course.title || "";
      return courseName.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const goBack = () => {
      try {
        window.history.back();
      } catch (error) {
        console.error("Error al regresar a la página anterior");
      }
    };

    return (
      <div className="bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 min-h-screen overflow-hidden">
        <NavigationBar onSearch={handleSearch} /> {/*Se agrega el onSearch para poder realizar el filtrado de cursos por titulo*/}
        <a className="inline-block bg-purple-700 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded transition-colors duration-300 cursor-pointer m-1" onClick={goBack}>
          &#8678; {t('notFound.return')}
        </a>
    
        {userCourses.length > 0 ? (
          <>
            {/* Título se muestra sólo si hay cursos */}
            <div className="mt-10 flex justify-center">
              <h1 className="text-center text-3xl text-white font-black flex justify-center shadow-orange italic shadow-red-400 p-3 border border-white bg-gradient-to-t from-red-400 to-pink-300">
                {t('coursesComponent.your_courses')}
              </h1>
            </div>
    
            {/* Cursos disponibles */}
            <div
              className="grid  
              grid-cols-1 gap-4 p-4 mx-1 mt-10
              sm:grid-cols-2 sm:gap-3 sm:p-4 sm:mx-2 sm:mt-16     
              md:grid-cols-3 md:gap-3 md:p-4 md:mt-20
              lg:grid-cols-4 lg:gap-2 lg:p-4 lg:mt-14
              xl:grid-cols-5 xl:gap-4 xl:p-4 xl:mt-16"
            >
              {paginatedCourses.map(course => (
                <div key={course.id} onClick={() => handleCourseClick(course.id)} className="cursor-pointer bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <h2 className="text-xl font-bold">{course.title}</h2>
                  <p>{course.description}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center mt-20 px-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full">
              <img className="h-20 mb-4 mx-auto sm:h-24 md:h-36 lg:h-48" src={Logo} alt="Logo" />
              <h2 className="text-xl font-bold mb-4 text-center text-gray-800 sm:text-2xl md:text-3xl lg:text-4xl">
                {t('courseComponent.no_courses_enrolled')}
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
          </div>
        )}
      </div>
    );
};

export default CoursesComponent;
