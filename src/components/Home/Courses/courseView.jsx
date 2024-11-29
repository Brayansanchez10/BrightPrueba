import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCoursesContext } from "../../../context/courses/courses.context";
import { useResourceContext } from "../../../context/courses/resource.contex";
import { useCourseProgressContext } from "../../../context/courses/progress.context.jsx";
import { useAuth } from "../../../context/auth.context";
import { useUserContext } from "../../../context/user/user.context";
import { Collapse } from "antd";
import NavigationBar from "../NavigationBar";
import { FaArrowLeft, FaSadTear, FaPlay, FaUser, FaUsers, FaGraduationCap, FaDownload, FaCertificate } from "react-icons/fa";
import { MdPlayCircleOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Footer from "../../footer.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { getSubCategoryCourseId } from "../../../api/courses/subCategory.requst.js";
import { generateStudyPlanPDF } from "./components/studyPlan";

const { Panel } = Collapse;


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
  const [description, setDescription] = useState("");
  const [specialties, setSpecialties] = useState("");

  const fetchCourseData = useCallback(async () => {
    if (!courseId) return;

    try {
      const courseData = await getCourse(courseId);
      setCourse(courseData);

      if (courseData && courseData.userId) {
        const creatorData = await getUserById(courseData.userId);
        setCreator(creatorData);
        setDescription(creatorData.description || "");
        setSpecialties(creatorData.specialties || "");
      }

      const resourceData = await getResource(courseId);
      setResources(resourceData);

      await fetchSubCategories(courseId);
    } catch (error) {
      console.error("Error al obtener datos del curso:", error);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, getCourse, getUserById]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (user?.data?.id && courseId) {
        const progress = await getCourseProgress(user.data.id, courseId);
        setCurrentProgress(progress);
      }
    };

    fetchProgress();
  }, [user, courseId, getCourseProgress]);

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

  const handleDownloadStudyPlan = () => {
    generateStudyPlanPDF(course, courseId, resources, subCategory);
  };

  const navigateToCertificatePreview = () => {
    navigate(`/course/${courseId}/certificate-preview`);
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
      className="bg-primary min-h-screen flex flex-col"
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadStudyPlan}
                className="flex items-center px-4 py-2 bg-blue-600 text-white font-bold rounded-lg ml-4"
              >
                <FaDownload className="mr-2" />
                {t("course_user.downloadPlan")}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={navigateToCertificatePreview}
                className="flex items-center px-4 py-2 bg-green-600 text-white font-bold rounded-lg ml-4"
              >
                <FaCertificate className="mr-2" />
                {t("course_user.previewCertificate")}
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
                <h2 className="text-3xl font-bold text-gray-800 dark:text-primary mb-8">
                  {t("course_user.themes")}
                </h2>

                {subCategory.length > 0 ? (
                  <Collapse
                    accordion
                    className="bg-secondary border-none shadow-lg rounded-lg overflow-hidden"
                    expandIconPosition="right"
                  >
                    {subCategory.map((subcategory, index) => {
                      const filteredResources = resources
                        .filter((resource) => resource.subcategoryId === subcategory.id)
                        .sort((a, b) => (a.order || 0) - (b.order || 0));

                      return (
                        <Panel
                          header={
                            <motion.div 
                              className="flex items-center py-3"
                              whileHover={{ x: 5 }}
                            >
                              <div className="w-8 h-8 bg-purple-800 dark:bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                                {index + 1}
                              </div>
                              <span className="text-lg font-medium text-primary">
                                {subcategory.title}
                              </span>
                            </motion.div>
                          }
                          key={subcategory.id}
                        >
                          {filteredResources.length > 0 ? (
                            <Collapse
                              accordion
                              className="bg-secondary border-none shadow-lg rounded-lg overflow-hidden"
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
                                      <span className="text-lg font-medium text-primary">
                                        {resource.title}
                                      </span>
                                    </motion.div>
                                  }
                                  key={resource.id}
                                >
                                  <motion.div 
                                    className="p-4 bg-secondary"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <p className="text-gray-600 dark:text-primary mb-2">
                                      {resource.description}
                                    </p>
                                  </motion.div>
                                </Panel>
                              ))}
                            </Collapse>
                          ) : (
                            <motion.p 
                              className="p-4 text-gray-600 dark:text-primary"
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
                <h2 className="text-3xl font-bold text-gray-800 dark:text-primary mb-8">
                  {t("course_user.aboutCreator")}
                </h2>
                <motion.div 
                  className="bg-secondary shadow-lg rounded-lg overflow-hidden sticky top-24"
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
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-primary">
                          {creator ? creator.username : t("Loading")}
                        </h3>
                        <div className="flex items-center text-gray-500 dark:text-primary mt-1">
                          <FaGraduationCap className="mr-2" />
                          <span>
                            {t("Instructor")} {course.title}
                          </span>
                        </div>
                      </div>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={description}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="text-gray-600 dark:text-primary mb-4"
                      >
                        {description || t("course_user.noDescription")}
                      </motion.p>
                    </AnimatePresence>
                    <motion.div 
                      className="mt-4 pt-4 border-t border-gray-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <h5 className="text-md font-semibold text-gray-800 dark:text-primary mb-2">
                        {t("course_user.specialties")}
                      </h5>
                      {specialties ? (
                        <ul className="list-disc list-inside text-gray-600 dark:text-primary">
                          {specialties.split(',').map((specialty, index) => (
                            <motion.li key={index} whileHover={{ x: 5 }}>
                              {specialty.trim()}
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600 dark:text-primary">
                          {t("course_user.noSpecialties")}
                        </p>
                      )}
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