import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import HoverCard from "../Cards/HoverCard";
import Modal from "../Cards/Modal";
import NavigationBar from "../NavigationBar";
import { useCoursesContext } from "../../../context/courses/courses.context";
import { useUserContext } from "../../../context/user/user.context";
import { useRatingsContext } from "../../../context/courses/ratings.context";
import { useAuth } from "../../../context/auth.context";
import { useFavorite } from "../../../context/courses/favorites.context";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";
import '../../../css/Style.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Footer from "../../footer";
import { getSubCategoryCourseId } from "../../../api/courses/subCategory.requst.js";

export default function CourseCategory() {
  const { category } = useParams();
  const { t } = useTranslation("global");
  const { courses } = useCoursesContext();
  const { ratings, fetchRatingsByCourse } = useRatingsContext();
  const { user } = useAuth();
  const { registerToCourse, getUserCourses, getUserById } = useUserContext();
  const { favorites, toggleFavorite } = useFavorite();
  const [userCourses, setUserCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allRatings, setAllRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subCategories, setSubCategories] = useState({});
  const [creators, setCreators] = useState({});

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

  const calculateAverageRating = (courseId) => {
    const courseRatings = ratings.filter(rating => rating.courseId === courseId);
    if (courseRatings.length === 0) return 0;
  
    const sumRatings = courseRatings.reduce((sum, rating) => sum + (rating.score || 0), 0);
    return (sumRatings / courseRatings.length).toFixed(1);
  };

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

  const filteredCourses = courses.filter(course => 
    course.category === decodeURIComponent(category) &&
    (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderCourseCard = (course, index) => {
    const averageRating = calculateAverageRating(course.id);
    const creator = creators[course.userId];
    const resourceCount = subCategories[course.id] ? subCategories[course.id].length : 0;
  
    return (
      <motion.div
        className="flex justify-center items-center"
        key={course.id}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <HoverCard
          title={course.title}
          description={course.description}
          ruta={course.image}
          creatorName={creator ? creator.username : "Cargando..."}
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

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-primary mt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <NavigationBar />

      <motion.div
        className="flex flex-col sm:flex-row justify-between mt-6 mx-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="w-full sm:w-auto">
          <motion.h1
            className="text-4xl font-bold dark:text-secondary text-center sm:text-left font-bungee"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {decodeURIComponent(category)}
          </motion.h1>
        </div>
        <div className="w-full md:w-auto">
          <motion.div
            className="flex px-4 py-2 border bg-white border-gray-300 rounded-xl shadow-md"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <FaSearch size={"18px"} className="mt-1 mr-2" />
            <input
              type="search"
              className="bg-white outline-none w-full md:w-[280px] lg:w-[360px] xl:w-[420px]"
              placeholder={t('coursesComponent.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 mx-auto max-w-7xl px-4 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {filteredCourses.map(renderCourseCard)}
      </motion.div>

      <AnimatePresence>
        {isConfirmModalOpen && (
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
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSuccessModalOpen && (
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
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-center font-bold text-lg mb-4">{t('courseComponent.modalA')}</h2>
              <p className="text-center">
                {t('courseComponent.modalM')}
              </p>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Footer />
      </motion.div>
    </motion.div>
  );
}