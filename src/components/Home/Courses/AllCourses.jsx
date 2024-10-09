import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import HoverCard from "../Cards/HoverCard";
import NavigationBar from "../NavigationBar";
import { useCoursesContext } from "../../../context/courses/courses.context";
import { useUserContext } from "../../../context/user/user.context";
import { useRatingsContext } from "../../../context/courses/ratings.context.jsx";
import { useAuth } from "../../../context/auth.context";
import { useFavorite } from "../../../context/courses/favorites.context";
import { useTranslation } from "react-i18next";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdPlayCircleOutline } from "react-icons/md";
import { FaRegChartBar, FaSearch } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../../../css/Style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Logo from "../../../assets/img/hola.png";
import Footer from "../../footer.jsx";

export default function AllCourses() {
  const { t } = useTranslation("global");
  const { courses } = useCoursesContext();
  const { ratings, fetchRatingsByCourse } = useRatingsContext();
  const { user } = useAuth();
  const { registerToCourse, getUserCourses } = useUserContext();
  const { favorites, toggleFavorite, loading: favoritesLoading } = useFavorite();
  const [userCourses, setUserCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState({});
  const [allRatings, setAllRatings] = useState([]); // Estado para almacenar las calificaciones

  const sliderRefs = useRef({});

  useEffect(() => {
    // Función para cargar calificaciones de todos los cursos
    const loadRatings = async () => {
      for (const course of courses) {
        const courseRatings = await fetchRatingsByCourse(course.id);
        allRatings.push(courseRatings);
      }
      setAllRatings(allRatings); // Actualiza el estado con todas las calificaciones
    };
  
    loadRatings();
  }, [courses]);

  // Función para calcular el promedio de ratings
  const calculateAverageRating = (courseId) => {
    const courseRatings = ratings.filter(rating => rating.courseId === courseId);
    console.log(`Calificaciones para el curso ${courseId}:`, courseRatings);
    if (courseRatings.length === 0) return 0;
  
    const sumRatings = courseRatings.reduce((sum, rating) => {
      return sum + (rating.score || 0);
    }, 0);
    
    console.log(`Suma de ratings para el curso ${courseId}:`, sumRatings);
    console.log((sumRatings / courseRatings.length).toFixed(1));
    return (sumRatings / courseRatings.length).toFixed(1);
  };

  useEffect(() => {
    const fetchUserCourses = async () => {
      if (user && user.data && user.data.id) {
        try {
          const courses = await getUserCourses(user.data.id);
          setUserCourses(courses);
        } catch (error) {
          console.error("Error fetching user courses:", error);
          setError(
            "No se pudieron cargar tus cursos. Por favor, intenta de nuevo más tarde."
          );
        }
      }
    };
    fetchUserCourses();
  }, [user, getUserCourses]);

  const handleCardClick = (course) => {
    setSelectedCourse(course);
    setIsConfirmModalOpen(true);
  };

  const handleFavoriteToggle = async (courseId) => {
    await toggleFavorite(courseId);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleRegister = async () => {
    if (
      selectedCourse &&
      !userCourses.some((course) => course.id === selectedCourse.id)
    ) {
      setIsLoading(true);
      setError(null);
      try {
        await registerToCourse(user.data.id, selectedCourse.id);
        const updatedCourses = await getUserCourses(user.data.id);
        setUserCourses(updatedCourses);
        setIsConfirmModalOpen(false);
        setIsSuccessModalOpen(true);
      } catch (error) {
        console.error("Error al inscribir al usuario en el curso:", error);
        setError(
          "Hubo un error al inscribirte en el curso. Por favor, intenta de nuevo."
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Ya estás inscrito en este curso.");
    }
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCourseCard = (course) => {
    const averageRating = calculateAverageRating(course.id); // Llama a la función directamente cada vez que se renderiza
  
    return (
      <div className="px-2" key={course.id}>
        <HoverCard
          title={course.title}
          description={course.description}
          ruta={course.image}
          creatorName={course.instructor || "Daniel Gomez"}
          rating={averageRating || 0} // Asegúrate de mostrar 0 si el promedio es undefined
          duration="6 horas"
          lessons="12 lecciones"
          onClick={() => handleCardClick(course)}
          onFavoriteToggle={() => handleFavoriteToggle(course.id)}
          isFavorite={favorites.some(fav => fav.courseId === course.id)}
        />
      </div>
    );
  };

  const favoriteCourses = filteredCourses.filter((course) =>
    favorites.some(fav => fav.courseId === course.id)
  );
  const categorizedCourses = filteredCourses.reduce((acc, course) => {
    if (!acc[course.category]) {
      acc[course.category] = [];
    }
    acc[course.category].push(course);
    return acc;
  }, {});

  const sliderSettings = (category, coursesCount) => ({
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    arrows: false,
    beforeChange: (oldIndex, newIndex) => {
      setCurrentSlide((prev) => ({ ...prev, [category]: newIndex + 1 }));
    },
  });

  const handlePrev = (category) => {
    if (sliderRefs.current[category]) {
      sliderRefs.current[category].slickPrev();
    }
  };

  const handleNext = (category) => {
    if (sliderRefs.current[category]) {
      sliderRefs.current[category].slickNext();
    }
  };

  const renderSlider = (category, courses) => {
    const settings = sliderSettings(category, courses.length);
    const totalSlides = courses.length;
    const maxSlide = Math.max(1, totalSlides - 3);

    return (
      <div className="mt-6 mx-auto max-w-7xl px-4">
        <div className="h-[340px] mb-4 relative">
          <Slider
            ref={(el) => (sliderRefs.current[category] = el)}
            {...settings}
          >
            {courses.map(renderCourseCard)}
            {courses.length < 4 &&
              Array(4 - courses.length)
                .fill(null)
                .map((_, index) => (
                  <div key={`empty-${index}`} className="px-2">
                    <div className="w-full h-full"></div>
                  </div>
                ))}
          </Slider>
        </div>
        {courses.length > 4 && (
          <div className="flex justify-center sm:justify-start items-center mt-4 text-[#CFCFCF]">
            <button
              onClick={(e) => {
                e.preventDefault();
                handlePrev(category);
              }}
              className={`flex items-center mr-4 font-bold ${
                currentSlide[category] <= 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-[#B99CEA]"
              }`}
              disabled={currentSlide[category] <= 1}
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span>PREV</span>
            </button>
            <div className="bg-[#B99CEA] w-6 h-6 flex items-center justify-center rounded">
              <span className="text-white font-bold">
                {currentSlide[category] || 1}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleNext(category);
              }}
              className={`flex items-center ml-4 font-bold ${
                currentSlide[category] >= maxSlide
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-[#B99CEA]"
              }`}
              disabled={currentSlide[category] >= maxSlide}
            >
              <span>NEXT</span>
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col pt-16 bg-gray-100">
      <NavigationBar />

      <div className="flex flex-col sm:flex-row justify-between mt-6 mx-6">
        <div className="w-full sm:w-auto">
          <h1 className="text-4xl font-bold text-black text-center sm:text-left font-bungee">
            {t("courseComponent.title")}
          </h1>
        </div>
        <div className="w-full md:w-auto">
          <div className="flex px-4 py-2 border bg-white border-gray-300 rounded-xl shadow-md">
            <FaSearch size={"18px"} className="mt-1 mr-2" />
            <input
              type="search"
              className="outline-none w-full md:w-[280px] lg:w-[360px] xl:w-[420px]"
              placeholder={t("coursesComponent.search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {favoriteCourses.length > 0 && (
        <div className="mt-8">
          <h2 className="text-[20px] font-bold text-gray-800 font-bungee text-center lg:text-left ml-4 lg:ml-60">
            {t("courseComponent.favorites")}
          </h2>
          {renderSlider("favorites", favoriteCourses)}
        </div>
      )}

      {Object.entries(categorizedCourses).length > 0 ? (
        Object.entries(categorizedCourses).map(
          ([category, coursesInCategory]) => (
            <div key={category}>
              <div className="text-[20px] font-bold text-gray-800 font-bungee text-center lg:text-left ml-4 lg:ml-60 mt-14">
                <Link
                  to={`/CourseCategory/${encodeURIComponent(category)}`}
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  <h2 className="text-[20px] font-bold text-gray-800 font-bungee">
                    {category}
                  </h2>
                </Link>
              </div>
              {renderSlider(category, coursesInCategory)}
            </div>
          )
        )
      ) : (
        <div className="flex justify-center items-center mt-10 mb-16 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full">
            <img
              className="h-20 mb-4 mx-auto sm:h-24 md:h-36 lg:h-48"
              src={Logo}
              alt="Logo"
            />
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800 sm:text-2xl md:text-3xl lg:text-4xl">
              {t("courseComponent.no_courses_available")}
            </h2>
            <p className="text-center text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl">
              {t("courseComponent.check_back_later")}
            </p>
          </div>
        </div>
      )}

      {isConfirmModalOpen && selectedCourse && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center px-4"
          onClick={closeConfirmModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-[300px] p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
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
                <div  className="flex items-center mt-1">
                  <FaRegChartBar className="mr-1" />
                  <span>Principiante</span>
                </div>
              </div>
              <button
                onClick={handleRegister}
                className={`bg-[#783CDA] text-white font-bold text-[13px] rounded-[5px] shadow-md px-3 !py-1 ${
                  userCourses.some(
                    (course) => course.id === selectedCourse.id
                  ) || isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={
                  userCourses.some(
                    (course) => course.id === selectedCourse.id
                  ) || isLoading
                }
              >
                {isLoading
                  ? "Inscribiendo..."
                  : userCourses.some(
                      (course) => course.id === selectedCourse.id
                    )
                  ? "YA REGISTRADO!"
                  : "INSCRÍBETE!"}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>
      )}

      {isSuccessModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center px-4"
          onClick={closeSuccessModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-[300px] p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeSuccessModal}
              className="absolute top-2 right-2 text-black hover:text-gray-600"
            >
              X
            </button>
            <h2 className="text-center font-bold text-lg mb-4">¡Éxito!</h2>
            <p className="text-center">
              Te has registrado en el curso exitosamente.
            </p>
          </div>
        </div>
      )}
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}