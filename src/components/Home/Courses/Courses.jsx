import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import HoverCard from "../Cards/HoverCard";
import NavigationBar from "../NavigationBar";
import { useCoursesContext } from "../../../context/courses/courses.context";
import { useUserContext } from "../../../context/user/user.context";
import { useAuth } from "../../../context/auth.context";
import { useTranslation } from "react-i18next";
import Logo from "../../../assets/img/hola.png";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdPlayCircleOutline } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";
import '../../../css/Style.css'; 

const Course = () => {
  const { t } = useTranslation("global");
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

  useEffect(() => {
    if (user && user.data) {
      setUserCourses(user.data.courses || []);
    }
  }, [user]);

  const filteredCourses = courses.filter((course) => course.category === title);

  const handleCardClick = (course) => {
    setSelectedCourse(course);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleRegister = async () => {
    if (
      user &&
      user.data &&
      user.data.id &&
      !userCourses.includes(selectedCourse.id)
    ) {
      try {
        await registerToCourse(user.data.id, selectedCourse.id);
        setIsConfirmModalOpen(false);
        setIsSuccessModalOpen(true);
        setUserCourses((prev) => [...prev, selectedCourse.id]);
      } catch (error) {
        console.error("Error al registrar el curso:", error);
      }
    } else {
      console.error("Usuario no autenticado o ya registrado");
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

  const handleModalClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      closeConfirmModal();
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gray-100">
      <NavigationBar />
      <h1 className="text-4xl font-bold text-black text-center mt-6 font-bungee">CURSOS</h1>
      <div className="flex justify-left mt-2 ml-60">
        <h1
          className="text-[20px] font-bold text-gray-800 font-bungee"
        >
          CURSOS POPULARES
        </h1>
      </div>
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-40 mt-10 mx-auto max-w-7xl">
          {paginatedCourses.map((course) => {
            const isRegistered = userCourses.includes(course.id);
            return (
              <HoverCard
                key={course.id}
                title={course.title}
                description={course.description}
                ruta={course.image}
                onClick={() => handleCardClick(course)}
                className="w-full h-full"
              />
            );
          })}
        </div>
      ) : (
        <div className="flex justify-center items-center mt-20 px-4">
          <div className="bg-red-600 p-6 rounded-lg shadow-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4 text-center text-white sm:text-2xl md:text-3xl lg:text-4xl">
              {title}
            </h2>
            <img
              className="h-20 mb-4 mx-auto sm:h-24 md:h-36 lg:h-48"
              src={Logo}
              alt="Logo"
            />
            <h2 className="text-xl font-bold mb-4 text-center text-white sm:text-2xl md:text-3xl lg:text-4xl">
              {t("courseComponent.no_courses_available")}
            </h2>
            <p className="text-center text-white text-sm sm:text-base md:text-lg lg:text-xl">
              {t("courseComponent.check_back_later")}
            </p>
          </div>
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center mb-4 mt-8">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 mx-1 bg-gray-200 text-gray-800 border rounded"
          >
            {t("courseComponent.previous")}
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-2 mx-1 rounded ${
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
            className="px-3 py-2 mx-1 bg-gray-200 text-gray-800 border rounded"
          >
            {t("courseComponent.next")}
          </button>
        </div>
      )}
      {isConfirmModalOpen && selectedCourse && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center px-4"
          onClick={handleModalClickOutside}
        >
          <div className="bg-white rounded-lg shadow-lg w-[300px] p-4 relative">
            <button
              onClick={closeConfirmModal}
              className="absolute top-2 right-2 text-black hover:text-gray-600"
            >
              X
            </button>
            <div className="flex items-start mb-2">
              <img
                src={selectedCourse.image}
                alt={selectedCourse.title}
                className="w-[38px] h-[39.63px] rounded-lg shadow-sm"
              />
              <div className="ml-2">
                <h2 className="font-bold text-[#272C33] text-[15px]">
                  {selectedCourse.title}
                </h2>
                <p className="text-[#939599] text-[11px]">
                  Con <strong>Daniel Gomez</strong>
                  {/* {selectedCourse.instructor || "Instructor Desconocido"} */}
                </p>
              </div>
            </div>
            <p className="text-[#676B70] text-[15px] font-regular mb-2">
              {selectedCourse.description}
            </p>
            <div className="mb-4 text-[14px] mt-3">
              {[
                "Item prueba numero 1",
                "Item prueba numero 2",
                "Item prueba numero 3",
              ].map((item, index) => (
                <div key={index} className="flex items-center mb-1">
                  <span className="text-[#939599] mr-2">✓</span>
                  <span className="text-[#939599]">{item}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-8">
              <div className="flex flex-col text-[#939599] text-[12px]">
                <div className="flex items-center mt-1">
                  <AiOutlineClockCircle className="mr-1" />
                  <span>6 horas</span>
                </div>
                <div className="flex items-center mt-1">
                  <MdPlayCircleOutline className="mr-1" />
                  <span>12 lecciones</span>
                </div>
                <div className="flex items-center mt-1">
                  <FaRegChartBar className="mr-1" />
                  <span>Principiante</span>
                </div>
              </div>
              <button
                onClick={handleRegister}
                className={`bg-[#783CDA] text-white font-bold text-[13px] rounded-[5px] shadow-md px-3 !py-1 ${
                  userCourses.includes(selectedCourse.id)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={userCourses.includes(selectedCourse.id)}
              >
                {userCourses.includes(selectedCourse.id)
                  ? "YA REGISTRADO!"
                  : "INSCRÍBETE!"}
              </button>
            </div>
          </div>
        </div>
      )}
      {isSuccessModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center px-4"
          onClick={closeSuccessModal}
        >
          <div className="bg-white rounded-lg shadow-lg w-[263px] p-4 relative">
            <h2 className="font-bold text-[#272C33] text-[14px] text-center">
              Te has inscrito exitosamente
            </h2>
            <p className="text-[#676B70] text-[12px] font-regular text-center mt-2">
              ¡Disfruta del curso!
            </p>
            <button
              onClick={closeSuccessModal}
              className="bg-[#783CDA] text-white font-bold text-[11px] rounded-[5px] shadow-md w-full py-2 mt-4"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Course;
