import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavigationBar from "./../NavigationBar";
import { useUserContext } from "../../../context/user/user.context";
import { useAuth } from "../../../context/auth.context";
import { useTranslation } from 'react-i18next';
import Logo from "../../../assets/img/hola.png";
import { FaFlagCheckered, FaSearch } from 'react-icons/fa';
import Footer from "../../footer.jsx"; 

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
      const courseName = course.title || "";
      return courseName.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-gray-100 min-h-screen mt-16 overflow-hidden">
      <NavigationBar />
      {userCourses.length > 0 ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between mt-6 mx-6">
            <div className="w-full sm:w-auto">
              <h1 className="text-4xl font-bold text-center sm:text-left font-bungee">
                <span className="mr-2">{t('coursesComponent.your')}</span>
                <span className="text-purple-700">{t('coursesComponent.courses')}</span>
              </h1>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex px-4 py-2 border bg-white border-gray-300 rounded-xl shadow-md">
                <FaSearch size={"18px"} className="mt-1 mr-2" />
                <input
                  type="search"
                  className="outline-none w-full md:w-[280px] lg:w-[360px] xl:w-[420px]"
                  placeholder={t('coursesComponent.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 p-4 mx-4 mt-10 gap-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 md:mx-6 lg:mx-10 xl:mx-20 md:gap-x-8 md:gap-y-4 lg:gap-x-10 lg:gap-y-6 xl:gap-x-14 xl:gap-y-8">
            {paginatedCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white sm:p-5 min-h-[320px] rounded-2xl shadow-lg shadow-gray-400 border cursor-pointer transform hover:scale-105 transition-transform"
                onClick={() => handleCourseClick(course.id)}
              >
                <div className="sm:flex sm:flex-row-reverse justify-between">
                  <div className="sm:flex-shrink-0">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-[220px] sm:w-36 sm:h-36 rounded-t-xl sm:rounded-xl"
                    />
                  </div>
                  <div className="flex-grow p-5">
                    <h3 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-4 -mt-3">
                      {course.title}
                    </h3>
                    <p className="text-[12px] sm:text-base text-gray-400 font-semibold -mb-12">
                      {course.description}
                    </p>
                  </div>
                </div>
                <div className="text-white mt-14 sm:mt-20 px-5 pb-5">
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                      style={{ width: "75%" }}
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
      <Footer />
    </div>
  );
};

export default CoursesComponent;