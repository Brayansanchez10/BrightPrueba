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
      // Asegúrate de que course.name está definido antes de llamar a toLowerCase
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
        <NavigationBar onSearch={handleSearch} /> {/* Se agrega el onSearch para poder realizar el filtrado de cursos por título */}
        <a
          className="inline-block bg-purple-700 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded transition-colors duration-300 cursor-pointer m-1"
          onClick={goBack}
        >
          &#8678; {t('notFound.return')}
        </a>
        {userCourses.length > 0 ? (
          <>
            <div className="mt-10 flex justify-center">
              <h1 className="text-center text-3xl text-white font-black flex justify-center shadow-orange italic shadow-red-400 p-3 border border-white bg-gradient-to-t from-red-400 to-pink-300">
                {t('coursesComponent.your_courses')}
              </h1>
            </div>
            <div
              className="grid  
              grid-cols-1 gap-4 p-4 mx-1 mt-10
              sm:grid-cols-2 sm:gap-3 sm:p-4 sm:mx-2 sm:mt-16     
              md:grid-cols-3 md:gap-3 md:p-4 md:mt-20
              lg:grid-cols-4 lg:gap-2 lg:p-4 lg:mt-14
              xl:grid-cols-5 xl:gap-4 xl:p-4"
            >
              {paginatedCourses.map((course) => (
                <div
                  key={course._id} // Clave única para cada curso
                  className="relative bg-white rounded-lg shadow-md border cursor-pointer transform hover:scale-105 transition-transform border-white"
                  onClick={() => handleCourseClick(course._id)}
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64 object-cover rounded-t-lg"
                  />
                  <div className="p-auto bg-gray-700 md:bg-gradient-to-tr md:p-2 from-purple-600 to-red-400 rounded-b-lg border border-white">
                    <h3 className="text-lg sm:text-xl font-bold text-center text-white">
                      {course.title}
                    </h3>
                    <p className="text-base mt-1 text-slate-200 text-center md:hidden py-2">
                      {course.description}
                    </p>
                  </div>
                  <div
                    className="absolute inset-0 
                    bg-opacity-90 flex items-center justify-center opacity-0
                    sm:hover:opacity-90 sm:border sm:border-white
                    bg-gradient-to-b from-red-400 to-pink-500 lg:hover:opacity-95 lg:border lg:border-white transition-opacity"
                  >
                    <p className="text-center text-gray-900 overflow-hidden whitespace-wrap
                    sm:text-lg sm:text-white sm:font-semibold
                    md:text-lg md:text-white md:font-semibold 
                    lg:text-white lg:font-semibold lg:border-white lg:text-ellipsis lg:text-xl"
                    >
                      {course.description}
                    </p>
                  </div>
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
          <div className="flex justify-center mb-8 mt-10">
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
