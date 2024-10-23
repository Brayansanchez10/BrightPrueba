import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCoursesContext } from "../../../context/courses/courses.context";
import { useResourceContext } from "../../../context/courses/resource.contex";
import { useCourseProgressContext } from "../../../context/courses/progress.context.jsx";
import { useAuth } from "../../../context/auth.context";
import { useUserContext } from "../../../context/user/user.context";
import { Collapse, Card, Col } from "antd";
import NavigationBar from "../NavigationBar";
import {
  FaArrowLeft,
  FaSadTear,
  FaPlay,
  FaUser,
  FaUsers,
  FaGraduationCap,
} from "react-icons/fa";
import { MdPlayCircleOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Footer from "../../footer.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { getSubCategoryCourseId } from "../../../api/courses/subCategory.requst.js";

const { Panel } = Collapse;

const CreatorDescriptions = [
  "es un visionario en su campo, con una habilidad única para transformar ideas en conocimiento práctico.",
  "es una autoridad respetada, reconocido por su capacidad de simplificar temas complejos.",
  "es un apasionado del aprendizaje continuo, siempre buscando perfeccionar sus habilidades y compartirlas con los demás.",
  "es un profesional admirado, con una carrera marcada por logros significativos y un compromiso inquebrantable con la educación.",
  "es un líder intelectual, dedicado a influir positivamente en su comunidad a través de la enseñanza.",
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function CourseView() {
  const { courseId } = useParams();
  const { t } = useTranslation("global");
  const { getCourse } = useCoursesContext();
  const { getResource } = useResourceContext();
  const { getCourseProgress } = useCourseProgressContext();
  const { user } = useAuth();
  const { getUserById } = useUserContext();
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [creator, setCreator] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [creatorDescription, setCreatorDescription] = useState("");
  const [subCategory, setSubCategory] = useState([]);
  const [currentProgress, setCurrentProgress] = useState(0);

  const fetchCourseData = useCallback(async () => {
    if (!courseId) return;

    try {
      const courseData = await getCourse(courseId);
      setCourse(courseData);

      if (courseData && courseData.userId) {
        const creatorData = await getUserById(courseData.userId);
        setCreator(creatorData);
      }

      const resourceData = await getResource(courseId);
      setResources(resourceData);

      await fetchSubCategories(courseId);
    } catch (error) {
      console.error("Error al obtener datos del curso:", error);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (user?.data?.id && courseId) {
        const progress = await getCourseProgress(user.data.id, courseId);
        setCurrentProgress(progress);
      }
    };

    fetchProgress();
  }, [user, courseId]);

  const fetchSubCategories = async (courseId) => {
    try {
      const response = await getSubCategoryCourseId(courseId);
      setSubCategory(response.data);
    } catch (error) {
      console.error("Error al obtener los Sub Categories By CourseId", error);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  useEffect(() => {
    const changeDescription = () => {
      const newDescription =
        CreatorDescriptions[
          Math.floor(Math.random() * CreatorDescriptions.length)
        ];
      setCreatorDescription(newDescription);
    };

    changeDescription();
    const intervalId = setInterval(changeDescription, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleResourceClick = (resourceId) => {
    navigate(`/course/${courseId}/resource/${resourceId}`);
  };

  const navigateToResource = () => {
    const totalResources = resources.length;
    const percentagePerResource = 100 / totalResources;
  
    if (currentProgress === 0) {
      handleResourceClick(resources[0].id);
      return;
    }

    const unlockedIndex = Math.floor((currentProgress / percentagePerResource) + 1);
    const targetIndex = Math.min(unlockedIndex, totalResources - 1);
    const targetResource = resources[targetIndex];
  
    if (targetResource) {
      handleResourceClick(targetResource.id);
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        className="flex justify-center items-center h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    );
  }

  if (!course) {
    return (
      <motion.div 
        className="flex justify-center items-center h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <p className="text-2xl text-gray-600">No se pudo cargar el curso.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-gray-100 min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <NavigationBar />
      <main className="flex-grow">
        <motion.section 
          className="relative py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.div
              className="w-full h-full bg-no-repeat bg-center bg-cover"
              style={{
                backgroundImage: `url(${course.image})`,
                filter: "blur(5px)",
              }}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-black opacity-60"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                to="/MyCourses"
                className="inline-flex items-center text-white hover:text-blue-300 transition-colors duration-200 mb-6"
              >
                <FaArrowLeft className="mr-2" /> {t("course_user.back")}
              </Link>
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-4"
              variants={fadeInUp}
            >
              {course.title}
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-8 max-w-2xl"
              variants={fadeInUp}
            >
              {course.description}
            </motion.p>
            <motion.div 
              className="flex flex-wrap items-center gap-6 text-gray-300"
              variants={staggerChildren}
            >
              <motion.div className="flex items-center" variants={fadeInUp}>
                <FaUser className="mr-2" />
                <span>{creator ? creator.username : t("Loading")}</span>
              </motion.div>
              <motion.div className="flex items-center" variants={fadeInUp}>
                <FaUsers className="mr-2" />
                <span>
                  {course.enrolledCount} {t("course_user.studensReg")}
                </span>
              </motion.div>
              <motion.div className="flex items-center" variants={fadeInUp}>
                <MdPlayCircleOutline className="mr-2" />
                <span>
                  {resources.length} {t("course_user.resources")}
                </span>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={navigateToResource}
                className="flex items-center px-4 py-2 bg-purple-600 text-white font-bold rounded-lg"
              >
                <FaPlay className="mr-2" />
                {currentProgress === 0 ? t("course_user.start") : t("course_user.continue")}
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        <motion.section 
          className="py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                className="md:col-span-2"
                variants={fadeInUp}
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-8">
                  {t("course_user.themes")}
                </h2>

                {subCategory.length > 0 ? (
                  <Collapse
                    accordion
                    className="bg-white shadow-lg rounded-lg overflow-hidden"
                    expandIconPosition="right"
                  >
                    {subCategory.map((subcategory, index) => {
                      const filteredResources = resources.filter(
                        (resource) => resource.subcategoryId === subcategory.id
                      );

                      return (
                        <Panel
                          header={
                            <motion.div 
                              className="flex items-center py-3"
                              whileHover={{ x: 5 }}
                            >
                              <div className="w-8 h-8 bg-purple-800 rounded-full flex items-center justify-center text-white font-bold mr-4">
                                {index + 1}
                              </div>
                              <span className="text-lg font-medium">
                                {subcategory.title}
                              </span>
                            </motion.div>
                          }
                          key={subcategory.id}
                        >
                          {filteredResources.length > 0 ? (
                            <Collapse
                              accordion
                              className="bg-white shadow-lg rounded-lg overflow-hidden"
                              expandIconPosition="right"
                            >
                              {filteredResources.map((resource, index) => (
                                <Panel
                                  header={
                                    <motion.div 
                                      className="flex items-center py-3"
                                      whileHover={{ x: 5 }}
                                    >
                                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                                        {index + 1}
                                      </div>
                                      <span className="text-lg font-medium">
                                        {resource.title}
                                      </span>
                                    </motion.div>
                                  }
                                  key={resource.id}
                                >
                                  <motion.div 
                                    className="p-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <p className="text-gray-600 mb-4">
                                      {resource.description}
                                    </p>
                                  </motion.div>
                                </Panel>
                              ))}
                            </Collapse>
                          ) : (
                            <motion.p 
                              className="p-4 text-gray-600"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              {t("CreateResource.NoResources")}
                            </motion.p>
                          )}
                        </Panel>
                      );
                    })}
                  </Collapse>
                ) : (
                  <motion.div 
                    className="bg-white shadow-lg rounded-lg p-8 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaSadTear className="text-6xl text-gray-400 mb-4 mx-auto" />
                    <p className="text-xl text-gray-600">
                      {t("course_user.NoResources")}
                    </p>
                  </motion.div>
                )}
              </motion.div>

              <motion.div variants={fadeInUp}>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">
                  {t("course_user.aboutCreator")}
                </h2>
                <motion.div 
                  className="bg-white shadow-lg rounded-lg overflow-hidden sticky top-24"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <motion.img
                        className="w-20 h-20 rounded-full object-cover mr-4"
                        src={
                          creator &&
                          creator.userImage &&
                          creator.userImage !== "null"
                            ? creator.userImage
                            : "https://i.pinimg.com/originals/39/2c/86/392c86f7ba1c2600562cd0f36313fc20.png"
                        }
                        alt={t("course_user.creatorImage")}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {creator ? creator.username : t("Loading")}
                        </h3>
                        <div className="flex items-center text-gray-500 mt-1">
                          <FaGraduationCap className="mr-2" />
                          <span>
                            {t("course_user.expert")} {course.title}
                          </span>
                        </div>
                      </div>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={creatorDescription}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="text-gray-600 mb-4"
                      >
                        <strong>
                          {creator ? creator.username : t("Loading")}
                        </strong>{" "}
                        {creatorDescription}
                      </motion.p>
                    </AnimatePresence>
                    <motion.div 
                      className="mt-4 pt-4 border-t border-gray-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <h5 className="text-md font-semibold text-gray-800 mb-2">
                        {t("course_user.specialties")}
                      </h5>
                      <ul className="list-disc list-inside text-gray-600">
                        <motion.li whileHover={{ x: 5 }}>{t("course_user.web")}</motion.li>
                        <motion.li whileHover={{ x: 5 }}>{t("course_user.desing")}</motion.li>
                        <motion.li whileHover={{ x: 5 }}>{t("course_user.programming")}</motion.li>
                      </ul>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>
      <motion.div 
        className="mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Footer />
      </motion.div>
    </motion.div>
  );
}