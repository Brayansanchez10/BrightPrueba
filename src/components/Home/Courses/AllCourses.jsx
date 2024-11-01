import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { motion } from "framer-motion";
import HoverCard from "../Cards/HoverCard";
import Modal from "../Cards/Modal";
import NavigationBar from "../NavigationBar";
import { useCoursesContext } from "../../../context/courses/courses.context";
import { useUserContext } from "../../../context/user/user.context";
import { useRatingsContext } from "../../../context/courses/ratings.context.jsx";
import { useAuth } from "../../../context/auth.context";
import { useFavorite } from "../../../context/courses/favorites.context";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Logo from "../../../assets/img/hola.png";
import Footer from "../../footer.jsx";
import { getSubCategoryCourseId } from "../../../api/courses/subCategory.requst.js";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bungee&display=swap');

  .slick-track {
    margin-left: 0 !important;
  }

  .slider-container {
    width: 100%;
    overflow: hidden;
  }

  .slider-wrapper {
    display: flex;
    transition: transform 0.3s ease;
  }

  .hover-card {
    margin-right: 16px;
  }

  .font-bungee {
    font-family: 'Bungee', cursive;
  }

  .course-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .course-description {
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 1rem;
  }

  .course-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: #888;
  }

  .button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .button-primary {
    background-color: #783CDA;
    color: white;
  }

  .button-primary:hover {
    background-color: #6429C8;
  }

  .button-secondary {
    background-color: #E0E0E0;
    color: #333;
  }

  .button-secondary:hover {
    background-color: #D0D0D0;
  }
`;

export default function AllCourses() {
  const { t } = useTranslation("global");
  const { courses } = useCoursesContext();
  const { ratings, fetchRatingsByCourse } = useRatingsContext();
  const { user } = useAuth();
  const { registerToCourse, getUserCourses, getUserById } = useUserContext();
  const { favorites, toggleFavorite, loading: favoritesLoading } = useFavorite();
  const [userCourses, setUserCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState({});
  const [allRatings, setAllRatings] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const [creators, setCreators] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [entityId, setEntityId] = useState(null);

  const sliderRefs = useRef({});

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchCreatorName = useCallback(async (userId) => {
    if (!creators[userId]) {
      try {
        const creatorData = await getUserById(userId);
        setCreators(prev => ({ ...prev, [userId]: creatorData }));
      } catch (error) {
        console.error("Error fetching creator name:", error);
      }
    }
  }, [getUserById, creators]);

  const fetchSubCategories = useCallback(async (courseId) => {
    if (!subCategories[courseId]) {
      try {
        const response = await getSubCategoryCourseId(courseId);
        setSubCategories(prev => ({ ...prev, [courseId]: response.data }));
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setSubCategories(prev => ({ ...prev, [courseId]: [] }));
      }
    }
  }, [subCategories]);

  useEffect(() => {
    const loadRatings = async () => {
      const newAllRatings = [];
      for (const course of courses) {
        const courseRatings = await fetchRatingsByCourse(course.id);
        newAllRatings.push(courseRatings);
        fetchCreatorName(course.userId);
        fetchSubCategories(course.id);
      }
      setAllRatings(newAllRatings);
    };
  
    loadRatings();
  }, [courses, fetchRatingsByCourse, fetchCreatorName, fetchSubCategories]);

  const calculateAverageRating = (courseId) => {
    const courseRatings = ratings.filter(rating => rating.courseId === courseId);
    if (courseRatings.length === 0) return 0;
  
    const sumRatings = courseRatings.reduce((sum, rating) => sum + (rating.score || 0), 0);
    return (sumRatings / courseRatings.length).toFixed(1);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.data && user.data.id) {
        try {
          const userData = await getUserById(user.data.id);
          setEntityId(userData.entityId);
          const courses = await getUserCourses(user.data.id);
          setUserCourses(courses);
        } catch (error) {
          console.error("Error fetching user data or courses:", error);
          setError(
            "No se pudieron cargar tus datos o cursos. Por favor, intenta de nuevo más tarde."
          );
        }
      }
    };
    fetchUserData();
  }, [user, getUserById, getUserCourses]);

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
      (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       course.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (entityId === 1 || course.entityId === entityId) &&
      course.categoryId !== 1
  );

  const renderCourseCard = (course) => {
    const averageRating = calculateAverageRating(course.id);
    const creator = creators[course.userId];
    const resourceCount = subCategories[course.id] ? subCategories[course.id].length : 0;

    return (
      <motion.div
        className="px-2 hover-card"
        key={course.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HoverCard
          title={course.title}
          description={course.description}
          ruta={course.image}
          creatorName={
            creator ? (
              <Link to={`/profile/${creator.id}`} className="text-primary">
                {creator.username}
              </Link>
            ) : (
              "Cargando..."
            )
          }
          courseId={course.id}
          rating={averageRating || 0}
          duration={`${course.duracion} horas`}
          lessons={`${resourceCount} recursos`}
          onClick={() => handleCardClick(course)}
          onFavoriteToggle={() => handleFavoriteToggle(course.id)}
          isFavorite={favorites.some(fav => fav.courseId === course.id)}
        />
      </motion.div>
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

  const sliderSettings = (category, coursesCount) => {
    const slidesToShow = windowWidth >= 1024 ? 4 : windowWidth >= 768 ? 3 : windowWidth >= 480 ? 2 : 1;
    
    return {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: slidesToShow,
      slidesToScroll: 1,
      arrows: false,
      variableWidth: false,
      centerMode: false,
      beforeChange: (oldIndex, newIndex) => {
        setCurrentSlide((prev) => ({ ...prev, [category]: newIndex + 1 }));
      },
      swipeToSlide: true,
      className: "slider-container",
    };
  };

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
    const slidesToShow = settings.slidesToShow;
    const maxSlide = Math.ceil(totalSlides / slidesToShow);

    return (
      <motion.div
        className="mt-6 mx-auto max-w-7xl px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-[340px] mb-4 relative">
          <div className="slider-wrapper">
            <Slider
              ref={(el) => (sliderRefs.current[category] = el)}
              {...settings}
            >
              {courses.map(renderCourseCard)}
            </Slider>
          </div>
        </div>
        {courses.length > slidesToShow && (
          <motion.div
            className="flex justify-center sm:justify-start items-center mt-4 text-[#CFCFCF]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
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
            <span className="mx-2 text-[#B99CEA]">de</span>
            <div className="bg-[#B99CEA] w-6 h-6 flex items-center justify-center rounded">
              <span className="text-white font-bold">{maxSlide}</span>
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
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col pt-16 bg-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      
      transition={{ duration:  0.5 }}
    >
      <style>{styles}</style>
      <NavigationBar />

      <motion.div
        className="flex flex-col sm:flex-row justify-between mt-6 mx-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="w-full sm:w-auto">
          <h1 className="text-4xl font-bold dark:text-secondary text-center sm:text-left font-bungee">
            {t("courseComponent.title")}
          </h1>
        </div>
        <div className="w-full md:w-auto">
          <motion.div
            className="flex px-4 py-2 border bg-white border-gray-300 rounded-xl shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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

      {favoriteCourses.length > 0 && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-[20px] font-bold text-primary font-bungee text-center lg:text-left ml-4 lg:ml-60">
            {t("courseComponent.favorites")}
          </h2>
          {renderSlider("favorites", favoriteCourses)}
        </motion.div>
      )}

      {Object.entries(categorizedCourses).length > 0 ? (
        Object.entries(categorizedCourses).map(
          ([category, coursesInCategory], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * (index + 1) }}
            >
              <div className="text-[20px] font-bold text-center lg:text-left ml-4 lg:ml-60 mt-14">
                <Link
                  to={`/CourseCategory/${encodeURIComponent(category)}`}
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  <h2 className="text-[20px] font-bold text-primary font-bungee">
                    {category}
                  </h2>
                </Link>
              </div>
              {renderSlider(category, coursesInCategory)}
            </motion.div>
          )
        )
      ) : (
        <motion.div
          className="flex justify-center items-center mt-10 mb-16 px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-secondary p-6 rounded-lg shadow-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full">
            <img
              className="h-20 mb-4 mx-auto sm:h-24 md:h-36 lg:h-48"
              src={Logo}
              alt="Logo"
            />
            <h2 className="text-xl font-bold mb-4 text-center text-primary sm:text-2xl md:text-3xl lg:text-4xl">
              {t("courseComponent.no_courses_available")}
            </h2>
            <p className="text-center text-gray-600 dark:text-primary text-sm sm:text-base md:text-lg lg:text-xl">
              {t("courseComponent.check_back_later")}
            </p>
          </div>
        </motion.div>
      )}

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        course={selectedCourse}
        creator={selectedCourse ? creators[selectedCourse.userId] : null}
        subCategories={selectedCourse ? subCategories[selectedCourse.id] : []}
        onRegister={handleRegister}
        isLoading={isLoading}
        error={error}
        isRegistered={selectedCourse ? userCourses.some((course) => course.id === selectedCourse.id) : false}
      />

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        course={null}
        creator={null}
        subCategories={[]}
        onRegister={() => {}}
        isLoading={false}
        error={null}
        isRegistered={false}
      >
        <h2 className="text-center text-primary font-bold text-lg mb-4">{t('courseComponent.modalA')}</h2>
        <p className="text-center text-primary">
          {t('courseComponent.modalM')}
        </p>
      </Modal>

      <motion.div
        className="mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Footer />
      </motion.div>
    </motion.div>
  );
}