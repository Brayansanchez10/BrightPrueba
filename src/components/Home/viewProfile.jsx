import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Slider from "react-slick";
import { useAuth } from "../../context/auth.context";
import { useUserContext } from '../../context/user/user.context';
import { useFavorite } from "../../context/courses/favorites.context";
import { useCourseProgressContext } from "../../context/courses/progress.context";
import { FaUser, FaEnvelope, FaGraduationCap, FaHeart, FaMapMarkerAlt, FaCalendar } from 'react-icons/fa';
import { ChevronLeft, ChevronRight } from "lucide-react";
import NavigationBar from "../../components/Home/NavigationBar";
import Footer from "../footer";
import Modal from "./Cards/Modal";
import { getSubCategoryCourseId } from "../../api/courses/subCategory.requst";
import profileBackground from '../../assets/img/profile_fondo.png';
import { useTranslation } from "react-i18next";

const fadeInFromLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  },
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.2 } },
};

export default function ViewProfile() {
  const { t } = useTranslation("global");
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { getUserById, getUserCourses } = useUserContext();
  const { favorites, toggleFavorite } = useFavorite();
  const { getCourseProgress } = useCourseProgressContext();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subCategories, setSubCategories] = useState({});
  const [currentSlide, setCurrentSlide] = useState(1);
  const [currentCompletedSlide, setCurrentCompletedSlide] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [courseProgress, setCourseProgress] = useState({});

  const sliderRef = useRef(null);
  const completedSliderRef = useRef(null);

  const handleResize = useCallback(() => setWindowWidth(window.innerWidth), []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const fetchUserData = useCallback(async () => {
    try {
      const userId = id || (authUser?.data?.id);
      if (!userId) throw new Error('ID de usuario faltante');

      const userData = await getUserById(parseInt(userId));
      if (!userData) throw new Error('Usuario no encontrado');

      setUser(userData);
      const userCourses = await getUserCourses(parseInt(userId));
      
      const progressData = {};
      const coursesWithProgress = await Promise.all(userCourses.map(async (course) => {
        const [subCategories, progress] = await Promise.all([
          getSubCategoryCourseId(course.id).catch(() => ({ data: [] })),
          getCourseProgress(userId, course.id).catch(() => 0)
        ]);

        progressData[course.id] = progress;

        return {
          ...course,
          subCategories: subCategories.data || [],
          progress: progress
        };
      }));

      setCourseProgress(progressData);
      
      const completed = coursesWithProgress.filter(course => course.progress === 100);
      const inProgress = coursesWithProgress.filter(course => course.progress < 100);

      setCourses(inProgress);
      setCompletedCourses(completed);

      const subCategoriesMap = {};
      coursesWithProgress.forEach(course => {
        subCategoriesMap[course.id] = course.subCategories;
      });
      setSubCategories(subCategoriesMap);
    } catch (err) {
      console.error('Error al obtener datos del usuario:', err);
      setError(err.message || 'No se pudieron cargar los datos del usuario. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [id, authUser, getUserById, getUserCourses, getCourseProgress]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleFavoriteToggle = async (courseId, e) => {
    e.stopPropagation();
    await toggleFavorite(courseId);
  };

  const handleCardClick = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <NavigationBar />
        <div className="flex justify-center items-center h-screen">
          <motion.div
            className="w-16 h-16 border-4 border-purple-900 border-t-transparent rounded-full animate-spin"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    );
  }

  if (!user) return <NavigationBar />;

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: windowWidth >= 1024 ? 4 : windowWidth >= 768 ? 3 : windowWidth >= 480 ? 2 : 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (_, newIndex) => setCurrentSlide(newIndex + 1),
    swipeToSlide: true,
    variableWidth: false,
  };

  const completedSliderSettings = {
    ...sliderSettings,
    beforeChange: (_, newIndex) => setCurrentCompletedSlide(newIndex + 1),
  };

  const handlePrev = () => sliderRef.current?.slickPrev();
  const handleNext = () => sliderRef.current?.slickNext();
  const handleCompletedPrev = () => completedSliderRef.current?.slickPrev();
  const handleCompletedNext = () => completedSliderRef.current?.slickNext();

  const maxSlide = Math.ceil(courses.length / sliderSettings.slidesToShow);
  const maxCompletedSlide = Math.ceil(completedCourses.length / sliderSettings.slidesToShow);

  const renderCourseCards = (courseList, sliderRef, currentSlide, maxSlide, handlePrev, handleNext) => (
    <div className="relative overflow-hidden">
      <Slider ref={sliderRef} {...sliderSettings} className="mx-[-8px] !flex justify-start">
        {courseList.map((course) => (
          <div key={course.id} className="px-2">
            <div
              className="cursor-pointer rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 mb-4"
              onClick={() => handleCardClick(course)}
              style={{
                width: "100%",
                height: "220px",
              }}
            >
              <div
                className="relative"
                style={{
                  overflow: "hidden",
                  borderRadius: "0.5rem",
                  height: "175px",
                }}
              >
                <img
                  src={course.image}
                  alt="Image Course Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-secondary p-3 rounded-b-lg flex justify-between items-center">
                <h3 className="text-primary font-bold text-sm truncate">{course.title}</h3>
                <FaHeart
                  className={`cursor-pointer ${favorites.some(fav => fav.courseId === course.id) ? "text-red-500" : "text-gray-500"} transition-colors duration-300`}
                  onClick={(e) => handleFavoriteToggle(course.id, e)}
                  style={{ fontSize: "16px" }}
                />
              </div>
            </div>
          </div>
        ))}
      </Slider>
      {courseList.length > sliderSettings.slidesToShow && (
        <div className="flex justify-center sm:justify-start items-center mt-4 text-[#CFCFCF]">
          <button
            onClick={handlePrev}
            className={`flex items-center mr-4 font-bold ${
              currentSlide <= 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-[#B99CEA]"
            }`}
            disabled={currentSlide <= 1}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">PREV</span>
          </button>
          <div className="bg-[#B99CEA] w-6 h-6 flex items-center justify-center rounded">
            <span className="text-white font-bold">
              {currentSlide}
            </span>
          </div>
          <span className="mx-2 text-[#B99CEA]">de</span>
          <div className="bg-[#B99CEA] w-6 h-6 flex items-center justify-center rounded">
            <span className="text-white font-bold">{maxSlide}</span>
          </div>
          <button
            onClick={handleNext}
            className={`flex items-center ml-4 font-bold ${
              currentSlide >= maxSlide
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-[#B99CEA]"
            }`}
            disabled={currentSlide >= maxSlide}
          >
            <span className="hidden sm:inline">NEXT</span>
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-primary min-h-screen">
      <NavigationBar />
      <div className="relative">
        <div 
          className="absolute inset-0 bg-[#493073]"
          style={{
            backgroundImage: `url(${profileBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay',
          }}
        ></div>
        <div className="relative pt-16">
          <motion.div 
            className="w-full py-8 md:py-12 mb-8"
            variants={fadeInFromLeft}
            initial="hidden"
            animate="visible"
          >
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center">
                <div className="flex flex-col md:flex-row items-center md:items-start justify-center w-full mb-6 space-y-6 md:space-y-0 md:space-x-8">
                  <div className="relative">
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center border-4 border-white shadow-lg">
                      {user.userImage ? (
                        <img src={user.userImage} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <FaUser className="text-purple-900 text-4xl md:text-6xl" />
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-4 h-4 md:w-6 md:h-6 border-2 border-white"></div>
                  </div>
                  <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bungee mb-2 tracking-wider" style={{ color: '#00D8A1', textShadow: '2px 2px 0 #FFFFFF, -2px -2px 0 #FFFFFF, 2px -2px 0 #FFFFFF, -2px 2px 0 #FFFFFF' }}>
                      {user.username}
                    </h1>
                    <p className="text-lg md:text-xl text-purple-200 mb-4">{user.firstNames} {user.lastNames}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-x-8 md:gap-y-4">
                      {[
                        { icon: FaEnvelope, label: t('viewProfile.email'), value: user.email },
                        { icon: FaGraduationCap, label: t('viewProfile.rol'), value: user.role },
                        { icon: FaMapMarkerAlt, label:t('viewProfile.location'), value: "Colombia" },
                        { icon: FaCalendar, label: t('viewProfile.date'), value: new Date(user.createdAt).toLocaleDateString() }
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex flex-col items-center md:items-start">
                          <div className="flex items-center gap-2">
                            <Icon className="text-[#00D8A1] text-xl" />
                            <span className="text-white font-roboto text-base">{label}</span>
                          </div>
                          <span className="text-[#BBBBBB] font-roboto mt-1 text-sm md:text-base">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="container mx-auto px-4 md:px-8 lg:px-16"
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
      >
        <motion.div 
          className="mt-8"
          variants={fadeInFromLeft}
        >
          <h2 className="text-2xl font-roboto text-[#303956] mb-6 font-bold text-center sm:text-left">{t('viewProfile.registration')}</h2>
          <div className="max-w-7xl mx-auto">
            {courses.length > 0 ? 
              renderCourseCards(courses, sliderRef, currentSlide, maxSlide, handlePrev, handleNext)
              :
              <p className="text-lg text-gray-600 text-center">{t('viewProfile.registrationM')}</p>
            }
          </div>
        </motion.div>

        <motion.div 
          className="mt-16"
          variants={fadeInFromLeft}
        >
          <h2 className="text-2xl font-roboto text-[#303956] mb-6 font-bold text-center sm:text-left">{t('viewProfile.complete')}</h2>
          <div className="max-w-7xl mx-auto">
            {completedCourses.length > 0 ?
              renderCourseCards(completedCourses, completedSliderRef, currentCompletedSlide, maxCompletedSlide, handleCompletedPrev, handleCompletedNext)
              :
              <p className="text-lg text-gray-600 text-center">{t('viewProfile.completeM')}</p>
            }
          </div>
        </motion.div>zº
      </motion.div>
      <div className="pt-12">
        <Footer />
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        course={selectedCourse}
        creator={user}
        subCategories={selectedCourse ? subCategories[selectedCourse.id] || [] : []}
        onRegister={() => {}}
        isLoading={false}
        error={null}
        isRegistered={true}
      />
    </div>
  );
}