import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/auth.context';
import { useCoursesContext } from '../../../context/courses/courses.context';
import { useCourseProgressContext } from '../../../context/courses/progress.context';
import NavigationBar from '../NavigationBar';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { generatePremiumCertificatePDF, generateCertificatePreview } from './components/certificate';
import zorro from '../../../assets/img/Zorro.png';
import derechaabajo from '../../../assets/img/DerechaAbajo.jpeg';
import izquierdaarriba from '../../../assets/img/IzquierdaArriba.jpeg';

export default function CertificatePreview() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("global");
  const { user } = useAuth();
  const { getCourse } = useCoursesContext();
  const { getCourseProgress } = useCourseProgressContext();
  const [course, setCourse] = useState(null);
  const [certificatePreview, setCertificatePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentProgress, setCurrentProgress] = useState(0);

  // Cargar los datos del curso
  useEffect(() => {
    const fetchCourse = async () => {
      if (courseId) {
        try {
          const courseData = await getCourse(courseId);
          setCourse(courseData);
        } catch (err) {
          console.error('Error fetching course:', err);
          setError('Error al cargar el curso');
        }
      }
    };
    fetchCourse();
  }, [courseId, getCourse]);

  // Generar la vista previa del certificado
  useEffect(() => {
    const handleGeneratePreview = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (user?.data?.username && course?.title) {
          const pdfOutput = await generateCertificatePreview(
            user.data.username,
            course.title,
            zorro,
            derechaabajo,
            izquierdaarriba,
            currentProgress === 100
          );
          
          const blob = new Blob([pdfOutput], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setCertificatePreview(url);
        }
      } catch (err) {
        console.error('Error al generar la vista previa:', err);
        setError('Error al generar la vista previa del certificado');
      } finally {
        setIsLoading(false);
      }
    };

    if (course && user) {
      handleGeneratePreview();
    }

    return () => {
      if (certificatePreview) {
        URL.revokeObjectURL(certificatePreview);
      }
    };
  }, [course, user]);

  // Obtener el progreso del curso
  useEffect(() => {
    const fetchProgress = async () => {
      if (user?.data?.id && courseId) {
        try {
          const progress = await getCourseProgress(user.data.id, courseId);
          setCurrentProgress(progress);
        } catch (err) {
          console.error('Error al obtener el progreso:', err);
        }
      }
    };

    fetchProgress();
  }, [user, courseId]);

  // Descargar el certificado
  const handleDownload = () => {
    console.log('Usuario:', user?.data?.username);
    console.log('Curso:', course?.title);
    
    if (!user?.data?.username || !course?.title) {
      console.error('Faltan datos necesarios para el certificado');
      return;
    }
    
    generatePremiumCertificatePDF(
      user.data.username, 
      course.title, 
      zorro, 
      derechaabajo, 
      izquierdaarriba
    );
  };

  return (
    <motion.div
      className="bg-primary min-h-screen pt-14"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <NavigationBar />
      <div className="mx-auto px-4 py-8">
        <motion.button
          onClick={() => navigate(`/course/${courseId}`)}
          className="flex items-center text-primary mb-5 hover:text-gray-400 transition-colors"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <FaArrowLeft className="mr-2" />
          {t("course_user.back")}
        </motion.button>

        <motion.div
          className="bg-white p-4 rounded-lg shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-center mb-4">
            {t("certificate.preview")}
          </h1>
          
          <div className="min-h-[500px] h-[70vh] bg-gray-100 rounded-lg flex">
            <div className="w-[70%] bg-white m-2 flex items-center justify-center relative certificate-preview-container">
              {isLoading ? (
                <div className="animate-pulse flex items-center justify-center">
                  <p className="text-gray-500">Generando vista previa...</p>
                </div>
              ) : error ? (
                <div className="text-red-500">
                  {error}
                </div>
              ) : certificatePreview ? (
                <div className="w-full h-full flex items-center justify-center bg-white relative">
                  <iframe
                    src={`${certificatePreview}#toolbar=0&navpanes=0&scrollbar=0&view=FitV`}
                    className="w-full h-full"
                    style={{
                      border: 'none',
                      overflow: 'hidden',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      resize: 'none',
                    }}
                    frameBorder="0"
                    title="Vista previa del certificado"
                  />
                </div>
              ) : (
                <div className="text-gray-500">
                  No se pudo generar la vista previa
                </div>
              )}
            </div>
            
            <div className="w-[30%] bg-purple-800 m-2 p-3 rounded-lg">
              <h3 className="text-white font-bold mb-3">MENU DE OPCIONES</h3>
              <div className="space-y-2">
                {currentProgress === 100 && (
                  <>
                    <motion.button 
                      className="w-full bg-white py-2.5 px-4 rounded flex items-center font-semibold text-lg"
                      whileHover={{ scale: 1.02, backgroundColor: '#f8f8f8' }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      onClick={handleDownload}
                    >
                      DESCARGAR
                    </motion.button>

                    <motion.button 
                      className="w-full bg-white py-2.5 px-4 rounded flex items-center font-semibold text-lg"
                      whileHover={{ scale: 1.02, backgroundColor: '#f8f8f8' }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                    >
                      IMPRIMIR
                    </motion.button>
                  </>
                )}

                <motion.button 
                  className="w-full bg-white py-2.5 px-4 rounded flex items-center font-semibold text-lg"
                  whileHover={{ scale: 1.02, backgroundColor: '#f8f8f8' }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  onClick={() => navigate(`/course/${courseId}`)}
                >
                  IR AL CURSO
                </motion.button>

                {currentProgress === 100 && (
                  <motion.button 
                    className="w-full bg-white py-2.5 px-4 rounded flex items-center font-semibold text-lg"
                    whileHover={{ scale: 1.02, backgroundColor: '#f8f8f8' }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    COMPARTIR EN REDES
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 