import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavigationBar from "./../NavigationBar";
import { useUserContext } from "../../../context/user/user.context";
import { useAuth } from "../../../context/auth.context";
import { useTranslation } from 'react-i18next';
import Logo from "../../../assets/img/hola.png";
import { FaFlagCheckered, FaSearch } from 'react-icons/fa';

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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(userCourses.length / itemsPerPage);

  const paginatedCourses = userCourses
    .filter(course => {
      // Asegúrate de que course.name está definido antes de llamar a toLowerCase
      const courseName = course.title || "";
      return courseName.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
      <div className="bg-gray-100 min-h-screen overflow-hidden">
        <NavigationBar />
        <Link to="/Home" className="inline-block bg-purple-700 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded transition-colors duration-300 cursor-pointer m-1">
          &#8678; {t('notFound.return')}
        </Link>
        {userCourses.length > 0 ? (
          <>
            <div className="flex justify-between mt-8">
              <div className="flex font-bungee ml-5 sm:ml-8 md:ml-10 lg:ml-14 xl:ml-24">
                <h1 className="text-center text-2xl mr-2
                md:text-3xl lg:text-4xl xl:text-4xl">
                {t('coursesComponent.your')}
                </h1>
                <h1 className="text-center text-2xl text-purple-700
                md:text-3xl lg:text-4xl xl:text-4xl">
                  {t('coursesComponent.courses')}
                </h1>
              </div>
              <div className="flex">
                <div className="flex px-4 py-2 mr-6 -mt-1 border bg-white border-gray-300 rounded-xl shadow-md
                  sm:mr-8 md:mr-12 lg:mr-16 xl:mr-24">
                  <FaSearch size={"18px"} className="mt-1 mr-2 -ml-1" />
                  <input
                    type="search"
                    className="outline-none -mr-4 pr-3 w-[180px]
                    sm:w-[240px] md:w-[280px] lg:w-[360px] xl:w-[420px]"
                    placeholder={t('coursesComponent.search_placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 p-4 mx-10 mt-10 gap-5
            md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2
            sm:mx-4 md:mx-6 lg:mx-10 xl:mx-20
            md:gap-x-8 md:gap-y-4 lg:gap-x-10 lg:gap-y-6 xl:gap-x-14 xl:gap-y-8">
              {paginatedCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white sm:p-5 min-h-[320px] rounded-2xl shadow-lg shadow-gray-400 border cursor-pointer transform hover:scale-105 transition-transform"
                  onClick={() => handleCourseClick(course._id)}
                >
                  {/* Contenedor para el título y la imagen en línea */}
                  <div className="sm:flex sm:flex-row-reverse justify-between">
                    {/* Imagen */}
                    <div className="sm:flex-shrink-0">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-[220px] sm:w-36 sm:h-36 rounded-t-xl sm:rounded-xl"
                      />
                    </div>

                    {/* Título y descripción */}
                    <div className="flex-grow p-5">
                      <h3 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-4 -mt-3">
                        {course.title}
                      </h3>
                      <p className="text-[12px] sm:text-base text-gray-400 font-semibold -mb-12">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  {/* Barra de progreso */}
                  <div className="text-white mt-14 sm:mt-20 px-5 pb-5">
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                        style={{ width: "75%" /* `${course.progress}%` */ }}
                      ></div>
                    </div>
                    <div className="flex mt-2">
                      <FaFlagCheckered className="text-gray-400 mt-1"/>
                      <p className="text-gray-400 font-semibold ml-2 mr-1">{"Progreso:"}</p>
                      <p className="text-green-600 font-semibold">{"75%"}</p>
                    </div>
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
