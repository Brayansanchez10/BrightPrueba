import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "../../context/auth.context";
import { useUserContext } from '../../context/user/user.context';
import { useFavorite } from "../../context/courses/favorites.context";
import { FaUser, FaEnvelope, FaGraduationCap, FaHeart, FaMapMarkerAlt } from 'react-icons/fa';
import NavigationBar from "../../components/Home/NavigationBar";
import Footer from "../footer";
import Modal from "./Cards/Modal.jsx";
import { getSubCategoryCourseId } from "../../api/courses/subCategory.requst.js";

const fadeInFromLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.8, 
      ease: "easeOut" 
    } 
  },
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.2 } },
};

const pageTransition = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    y: -50,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

export default function ViewProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { getUserById, getUserCourses } = useUserContext();
  const { favorites, toggleFavorite } = useFavorite();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subCategories, setSubCategories] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = id || (authUser && authUser.data && authUser.data.id);
        if (!userId) {
          throw new Error('ID de usuario faltante');
        }
        const userData = await getUserById(parseInt(userId));
        if (!userData) {
          throw new Error('Usuario no encontrado');
        }
        setUser(userData);
        const userCourses = await getUserCourses(parseInt(userId));
        setCourses(userCourses);
        const subCategoriesPromises = userCourses.map(async course => {
          try {
            const response = await getSubCategoryCourseId(course.id);
            return { id: course.id, subCategories: response.data };
          } catch (error) {
            console.warn(`No se pudieron obtener subcategorías para el curso ${course.id}:`, error);
            return { id: course.id, subCategories: [] };
          }
        });
        const subCategoriesResults = await Promise.all(subCategoriesPromises);
        const subCategoriesMap = {};
        subCategoriesResults.forEach(result => {
          subCategoriesMap[result.id] = result.subCategories;
        });
        setSubCategories(subCategoriesMap);
      } catch (err) {
        console.error('Error al obtener datos del usuario:', err);
        setError(err.message || 'No se pudieron cargar los datos del usuario. Por favor, intente de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, authUser, getUserById, getUserCourses]);

  useEffect(() => {
    if (error) {
      navigate('/notFound');
    }
  }, [error, navigate]);

  const handleFavoriteToggle = async (courseId) => {
    await toggleFavorite(courseId);
  };

  const handleCardClick = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const coursesPerPage = 4;
  const pageCount = Math.ceil(courses.length / coursesPerPage);

  const displayedCourses = courses.slice(
    currentPage * coursesPerPage,
    (currentPage + 1) * coursesPerPage
  );

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

  if (!user) {
    return <NavigationBar />;
  }

  return (
    <div className="min-h-screen mt-16">
      <NavigationBar />
      <motion.div 
        className="bg-gradient-to-br from-purple-900 to-indigo-800 w-full py-12 mb-8"
        variants={fadeInFromLeft}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <div className="w-48 h-48 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center border-4 border-white shadow-lg">
                {user.userImage ? (
                  <img src={user.userImage} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <FaUser className="text-purple-900 text-6xl" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-6 h-6 border-2 border-white"></div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bungee text-white mb-2 tracking-wider">
                {user.username}
              </h1>
              <p className="text-xl text-purple-200 mb-6">{user.firstNames} {user.lastNames}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-white bg-opacity-10 rounded-lg p-3 transition-all duration-300 hover:bg-opacity-20">
                  <FaEnvelope className="text-purple-300 text-xl" />
                  <span className="text-white">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 bg-white bg-opacity-10 rounded-lg p-3 transition-all duration-300 hover:bg-opacity-20">
                  <FaGraduationCap className="text-purple-300 text-xl" />
                  <span className="text-white">{user.role}</span>
                </div>
                <div className="flex items-center gap-3 bg-white bg-opacity-10 rounded-lg p-3 transition-all duration-300 hover:bg-opacity-20">
                  <FaMapMarkerAlt className="text-purple-300 text-xl" />
                  <span className="text-white">Colombia</span>
                </div>
                <div className="flex items-center gap-3 bg-white bg-opacity-10 rounded-lg p-3 transition-all duration-300 hover:bg-opacity-20">
                  <span className="text-purple-300 font-bold">Registrado:</span>
                  <span className="text-white">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="container mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
      >
        <motion.div 
          className="mt-8"
          variants={fadeInFromLeft}
        >
          <h2 className="text-3xl md:text-4xl font-bungee text-purple-900 mb-6">Cursos registrados</h2>
          {courses.length > 0 ? (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  variants={pageTransition}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {displayedCourses.map((course) => (
                    <motion.div 
                      key={course.id} 
                      className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-[280px] mx-auto"
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div 
                        className="h-48 bg-cover bg-center cursor-pointer" 
                        style={{ backgroundImage: `url(${course.image})` }}
                        onClick={() => handleCardClick(course)}
                      />
                      <div className="p-4 flex justify-between items-center">
                        <h3 className="text-lg font-semibold truncate">{course.title}</h3>
                        <FaHeart
                          className={`cursor-pointer ${favorites.some(fav => fav.courseId === course.id) ? "text-red-500" : "text-gray-400"}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavoriteToggle(course.id);
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
              {pageCount > 1 && (
                <div className="flex justify-center mt-8 space-x-6">
                  {[...Array(pageCount)].map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`rounded-full transition-all duration-200 ${
                        currentPage === index 
                          ? 'bg-[#200E3E] w-5 h-5' 
                          : 'bg-[#D9D9D9] w-4 h-4 hover:bg-[#200E3E] hover:opacity-70'
                      }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-lg text-gray-600">No esta registrado en ningún curso aún.</p>
          )}
        </motion.div>
      </motion.div>
      <Footer />

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