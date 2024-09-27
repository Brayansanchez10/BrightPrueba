import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useResourceContext } from "../../../context/courses/resource.contex";
import { useCoursesContext } from "../../../context/courses/courses.context";
import { useAuth } from "../../../context/auth.context";
import { useUserContext } from "../../../context/user/user.context";
import NavigationBar from "../NavigationBar";
import { FiMenu, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import jsPDF from "jspdf";
import zorro from "../../../assets/img/Zorro.jpeg";
import derechaabajo from "../../../assets/img/DerechaAbajo.jpeg";
import izquierdaarriba from "../../../assets/img/IzquierdaArriba.jpeg";
import { Anothershabby_trial } from "../../../Tipografy/Anothershabby_trial-normal";
import Swal from 'sweetalert2';
import { FaCheckCircle, FaTimesCircle, FaQuestionCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function ResourceView() {
  const { t } = useTranslation("global");
  const { user } = useAuth();
  const { getUserById } = useUserContext();
  const [username, setUsername] = useState("");
  const { id } = useParams();
  const { getResourceUser, getResource } = useResourceContext();
  const { getCourse } = useCoursesContext();
  const [resource, setResource] = useState(null);
  const [resources, setResources] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentResourceIndex, setCurrentResourceIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResource = async () => {
      try {
        if (id && !resource) {
          const resourceData = await getResourceUser(id);
          setResource(resourceData);
          if (resourceData && resourceData.courseId) {
            setCourseId(resourceData.courseId);
          }
        } else if (!id) {
          setError("ID de recurso no proporcionado");
        }
      } catch (error) {
        console.error("Error al obtener la información del recurso:", error);
        setError("Error al obtener la información del recurso.");
      }
    };

    fetchResource();
  }, [id, getResourceUser, resource]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        if (courseId) {
          const resourceData = await getResource(courseId);
          setResources(resourceData);
        }
      } catch (error) {
        console.error("Error al obtener los recursos del curso:", error);
      }
    };

    fetchResources();
  }, [courseId, getResource]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (courseId) {
          const courseData = await getCourse(courseId);
          setCourse(courseData);
        }
      } catch (error) {
        console.error("Error al obtener la información del curso:", error);
      }
    };

    fetchCourse();
  }, [courseId, getCourse]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.data && user.data.id) {
        try {
          const userData = await getUserById(user.data.id);
          setUsername(userData.username);
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
          setError("Error al obtener datos del usuario.");
        }
      }
    };

    fetchUserData();
  }, [user, getUserById]);

  useEffect(() => {
    if (resources.length > 0 && resource) {
      const index = resources.findIndex((r) => r.id === resource.id);
      setCurrentResourceIndex(index);
      updateProgress(index, resources.length);
    }
  }, [resources, resource]);

  useEffect(() => {
    setIsAnswerSelected(answers[currentQuestionIndex] !== undefined);
  }, [answers, currentQuestionIndex]);

  const isVideoLink = (url) => {
    return (
      url.includes("youtube.com/watch") ||
      url.includes("youtu.be/") ||
      url.includes("vimeo.com/") ||
      url.includes("drive.google.com/")
    );
  };

  const getEmbedUrl = (url) => {
    if (url.includes("youtu.be/") || url.includes("youtube.com/watch")) {
      if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1];
        return `https://www.youtube.com/embed/${videoId}?controls=1&rel=0&modestbranding=1`;
      }
      const urlParams = new URLSearchParams(new URL(url).search);
      const videoId = urlParams.get("v");
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?controls=1&rel=0&modestbranding=1`
        : "";
    } else if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1];
      return `https://player.vimeo.com/video/${videoId}?controls=1&background=0&byline=0&title=0&portrait=0&loop=0`;
    } else if (url.includes("drive.google.com/")) {
      const videoId = url.match(/[-\w]{25,}/);
      return videoId
        ? `https://drive.google.com/file/d/${videoId}/preview`
        : "";
    }
    return "";
  };

  const renderContent = (file) => {
    if (file) {
      if (isVideoLink(file)) {
        return (
          <div className="relative w-full lg:w-4/5 xl:w-3/4" style={{ paddingBottom: '28.125%' }}>
            <iframe
              title="Video"
              src={getEmbedUrl(file)}
              frameBorder="0"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
            <div className="absolute top-0 left-0 w-24 h-24 bg-transparent"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-transparent"></div>
            <div className="absolute bottom-0 left-0 w-48 h-24 bg-transparent"></div>
          </div>
        );
      } else if (file.endsWith(".pdf")) {
        return (
          <div className="relative w-full lg:w-4/5 xl:w-3/4 h-[400px]">
            <iframe
              src={file}
              title="PDF Viewer"
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
            <div className="absolute top-0 left-0 w-24 h-24 bg-transparent"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-transparent"></div>
            <div className="absolute bottom-0 left-0 w-48 h-24 bg-transparent"></div>
          </div>
        );
      } else if (file.startsWith("http")) {
        return (
          <div className="relative w-full lg:w-4/5 xl:w-3/4">
            <img
              src={file}
              alt="Contenido"
              className="w-full h-auto object-contain max-h-[400px]"
            />
            <div className="absolute top-0 left-0 w-24 h-24 bg-transparent"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-transparent"></div>
            <div className="absolute bottom-0 left-0 w-48 h-24 bg-transparent"></div>
          </div>
        );
      }
    }
    return <p className="text-center text-gray-600">No hay contenido disponible</p>;
  };

  const handleAnswerChange = (questionIndex, selectedAnswer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: selectedAnswer,
    }));
  };

  const handleNextQuestion = () => {
    if (!answers[currentQuestionIndex]) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Por favor selecciona una respuesta antes de continuar.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    if (currentQuestionIndex === (resource?.quizzes.length || 0) - 1) {
      const correctCount = Object.keys(answers).filter(
        (index) => resource?.quizzes[index]?.correctAnswer === answers[index]
      ).length;
      const incorrectCount = Object.keys(answers).length - correctCount;
  
      setCorrectAnswers(correctCount);
      setIncorrectAnswers(incorrectCount);
      setIsQuizCompleted(true);
    } else {
      setCurrentQuestionIndex((prevIndex) =>
        Math.min(prevIndex + 1, (resource?.quizzes.length || 0) - 1)
      );
      setError(null);
    }
  };

  const handleRetakeQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setIsQuizCompleted(false);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const renderQuiz = () => {
    const question = resource.quizzes[currentQuestionIndex];
  
    return (
      <div className="quiz-container bg-white rounded-xl shadow-lg border border-gray-300 w-full lg:w-4/5 xl:w-3/4 p-4 my-6">
        <h2 className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-t-xl text-white text-xl font-semibold text-center">
          Pregunta {currentQuestionIndex + 1}/{resource?.quizzes.length || 0}
        </h2>
        <h3 className="font-semibold mb-4 text-center text-lg text-gray-800 mt-2">
          {question.question}
        </h3>

        {question.options.map((option, index) => (
          <div key={index} className="flex items-center mb-3 mx-auto w-11/12">
            <input
              type="radio"
              id={`question-${currentQuestionIndex}-option-${index}`}
              name={`question-${currentQuestionIndex}`}
              value={option}
              checked={answers[currentQuestionIndex] === option}
              onChange={() => handleAnswerChange(currentQuestionIndex, option)}
              className="hidden"
            />
            <label
              htmlFor={`question-${currentQuestionIndex}-option-${index}`}
              className={`flex-1 py-2 px-3 rounded-lg border text-base cursor-pointer transition-colors 
              ${
                answers[currentQuestionIndex] === option
                  ? "bg-indigo-100 border-indigo-400 text-indigo-700"
                  : "bg-gray-50 border-gray-300 hover:bg-gray-200"
              } 
              ${
                isQuizCompleted && question.correctAnswer === option
                  ? "border-green-500 bg-green-100 text-green-700"
                  : isQuizCompleted &&
                    answers[currentQuestionIndex] === option &&
                    answers[currentQuestionIndex] !== question.correctAnswer
                  ? "border-red-500 bg-red-100 text-red-700"
                  : ""
              }`}
            >
              {option}
            </label>
          </div>
        ))}

        <div className="flex justify-between mt-6 mx-4">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-lg font-semibold transition-all 
            ${
              currentQuestionIndex === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            Anterior
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={!isAnswerSelected}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              isAnswerSelected
                ? "bg-indigo-600 text-white hover:bg-indigo-500"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {currentQuestionIndex === (resource?.quizzes.length || 0) - 1
              ? "Finalizar"
              : "Siguiente"}
          </button>
        </div>
      </div>
    );
  };

  const renderQuizSummary = () => {
    return (
      <div className="quiz-summary bg-white p-4 rounded-xl shadow-lg border border-gray-300 w-full lg:w-4/5 xl:w-3/4 mx-auto text-center my-6">
        <h3 className="text-xl font-bold mb-4 text-gray-900">
          Quiz Finalizado
        </h3>
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <FaQuestionCircle className="text-gray-500 text-2xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium text-gray-700">Preguntas Totales</span>
              <span className="text-base text-gray-600">{resource?.quizzes.length}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-green-500 text-2xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium text-gray-700">Respuestas Correctas</span>
              <span className="text-base text-gray-600">{correctAnswers}</span>
            </div>
          </div>
  
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FaTimesCircle className="text-red-500 text-2xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium text-gray-700">Respuestas Incorrectas</span>
              <span className="text-base text-gray-600">{incorrectAnswers}</span>
            </div>
          </div>
          <button
            onClick={handleRetakeQuiz}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all"
          >
            Volver a Intentar
          </button>
        </div>
      </div>
    );
  };  

  const updateProgress = (index, total) => {
    if (total > 0) {
      setProgress(((index + 1) / total) * 100);
    }
  };

  const handlePrevious = () => {
    if (currentResourceIndex > 0) {
      const previousResource = resources[currentResourceIndex - 1];
      handleResourceClick(previousResource.id, previousResource.courseId);
    }
  };

  const handleNext = () => {
    if (currentResourceIndex < resources.length - 1) {
      const nextResource = resources[currentResourceIndex + 1];
      handleResourceClick(nextResource.id, nextResource.courseId);
    }
  };

  const handleResourceClick = (resourceId, courseId) => {
    console.log("Course ID: ", courseId);
    console.log("Resource ID: ", resourceId);
    window.location.href = `/course/${courseId}/resource/${resourceId}`;
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleFinishCourse = () => {
    generatePremiumCertificatePDF(
      username,
      course.title,
      zorro,
      derechaabajo,
      izquierdaarriba
    );
    navigate(`/course/${courseId}`);
  };

  const generatePremiumCertificatePDF = (
    username,
    courseTitle,
    zorroImage,
    derechaabajo,
    izquierdaarriba
  ) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "cm",
      format: [28, 21.6],
    });

    doc.setFillColor(240, 248, 255);
    doc.rect(0, 0, 28, 21.6, "F");

    if (izquierdaarriba) {
      doc.addImage(izquierdaarriba, "JPEG", -1, -1, 10, 10);
    }
    if (derechaabajo) {
      doc.addImage(derechaabajo, "JPEG", 19, 13, 10, 10);
    }

    doc.addFileToVFS("Anothershabby.ttf", Anothershabby_trial);
    doc.addFont("Anothershabby.ttf", "AnotherShabby", "normal");
    doc.setFont("AnotherShabby");

    doc.setFont("AnotherShabby", "normal");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(70);
    doc.text("CONSTANCIA", 14, 4.5, { align: "center" });

    doc.setFontSize(25);
    doc.setFont("AnotherShabby", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("De aprendizaje", 18, 5.5, { align: "center" });

    if (zorroImage) {
      doc.addImage(zorroImage, "JPEG", 12, 7, 4, 4);
    }

    doc.setFont("times", "bold");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text("ESTE CERTIFICADO SE OTORGA A", 14, 13.0, { align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(65);
    doc.setFont("AnotherShabby", "normal");
    doc.text(`${username}`, 14, 15.5, { align: "center" });

    doc.setLineWidth(0.1);
    doc.setDrawColor(0, 0, 0);
    doc.line(6, 16, 22, 16);

    doc.setFont("times", "normal");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(
      `Por completar exitosamente el curso "${courseTitle}". `,
      11,
      17.5,
      { align: "center" }
    );

    doc.setFont("times", "normal");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Gracias por tu dedicación y", 19, 17.5, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("esfuerzo. ¡Sigue aprendiendo y mejorando!", 14, 18.0, {
      align: "center",
    });

    doc.setFontSize(14);
    doc.setTextColor(192, 192, 192);
    doc.text("Este certificado fue generado automáticamente.", 14, 19.5, {
      align: "center",
    });

    doc.save(`Certificado_${courseTitle}.pdf`);
  };

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!resource) return <div>Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar />
      <div className="flex">
        <div
          className={`${
            isOpen ? "w-64" : "w-16"
          } fixed left-0 top-16 h-full bg-[#1E1034] transition-all duration-300 ease-in-out overflow-hidden z-10`}
        >
          <button
            onClick={toggleSidebar}
            className="absolute top-4 left-2 p-2 bg-[#5D4B8A] text-white rounded-full shadow-lg hover:bg-[#3D2A5F] transition-colors"
          >
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <div className="mt-16 p-4">
            {resources.map((res, index) => (
              <div
                key={res.id}
                className={`flex items-start mb-6 cursor-pointer ${
                  isOpen ? 'pr-4' : 'justify-center'
                }`}
                onClick={() => handleResourceClick(res.id, res.courseId)}
              >
                <div className="relative mr-4">
                  <div
                    className={`
                      flex items-center justify-center
                      w-8 h-8 rounded-full 
                      ${res.id === resource.id ? 'bg-white text-[#1E1034]' : 'bg-[#5D4B8A] text-white'}
                      text-sm font-bold
                    `}
                  >
                    {index + 1}
                  </div>
                  {index < resources.length - 1 && (
                    <div 
                      className={`absolute left-4 top-8 w-0.5 h-10
                        ${res.id === resource.id ? 'bg-white' : 'bg-[#5D4B8A]'}
                      `}
                    />
                  )}
                </div>
                {isOpen && (
                  <span className={`text-xs ${res.id === resource.id ? 'text-white font-bold' : 'text-gray-400'}`}>
                    {res.title}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={`flex-1 ${isOpen ? 'ml-64' : 'ml-16'} transition-all duration-300 ease-in-out pt-20 px-4`}>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-ls font-medium text-gray-700 font-bungee">Progreso del curso</span>
              <span className="text-ls font-medium text-gray-700 font-bungee">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <button
              onClick={handlePrevious}
              disabled={currentResourceIndex === 0}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentResourceIndex === resources.length - 1}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <div className="mb-4">
              {isQuizCompleted
                ? renderQuizSummary()
                : resource?.quizzes && resource.quizzes.length > 0
                ? renderQuiz()
                : renderContent(resource?.files)}
            </div>
            <h1 className="text-2xl font-bold mb-3 mt-4 font-bungee">{resource.title}</h1>
            <div className="prose max-w-none text-sm">
              <p>{resource.description}</p>
            </div>
          </div>
          {currentResourceIndex === resources.length - 1 && (
            <div className="text-center mb-4">
              <button
                onClick={handleFinishCourse}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-base font-semibold"
              >
                {t('navigation.finish')}
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <article className="rounded-lg bg-white p-4 ring-1 ring-gray-200 shadow-md flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-full border-4 border-indigo-700 mb-3">
                <span className="text-2xl">📅</span>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 font-bungee">
                  <a
                    href="#"
                    className="hover:text-indigo-700 transition-colors duration-300"
                  >
                    {t('announcement.comingSoon')}
                  </a>
                </h3>
                <p className="text-sm text-gray-700">
                  {t('announcement.stayTuned')}
                </p>
              </div>
            </article>
            <div className="bg-white p-4 rounded-lg shadow-md ring-1 ring-gray-200 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-full border-4 border-indigo-700 mb-3">
                <span className="text-2xl">📅</span>
              </div>
              <div className="text-lg font-semibold text-gray-800 mb-1 font-bungee">
                {t('announcement.comingSoonNotes')}
              </div>
              <p className="text-sm text-gray-700 text-center">
                {t('announcement.stayTuned')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}