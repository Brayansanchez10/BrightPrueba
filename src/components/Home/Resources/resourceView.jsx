import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useResourceContext } from "../../../context/courses/resource.contex";
import { useCoursesContext } from "../../../context/courses/courses.context";
import { useAuth } from "../../../context/auth.context";
import { useUserContext } from "../../../context/user/user.context";
import { useCommentContext } from "../../../context/courses/comment.context";
import { useRatingsContext } from "../../../context/courses/ratings.context";
import NavigationBar from "../NavigationBar";
import axios from "../../../api/axios";
import {
  FiMenu,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiSend,
} from "react-icons/fi";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaQuestionCircle,
  FaStar,
  FaComment,
  FaUser,
} from "react-icons/fa";
import jsPDF from "jspdf";
import zorro from "../../../assets/img/Zorro.jpeg";
import derechaabajo from "../../../assets/img/DerechaAbajo.jpeg";
import izquierdaarriba from "../../../assets/img/IzquierdaArriba.jpeg";
import { Anothershabby_trial } from "../../../Tipografy/Anothershabby_trial-normal";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

export default function ResourceView() {
  const { t } = useTranslation("global");
  const { user } = useAuth();
  const { getUserById } = useUserContext();
  const [username, setUsername] = useState("");
  const { id, courseId } = useParams();
  const { getResourceUser, getResource } = useResourceContext();
  const { getCourse } = useCoursesContext();
  const { comments, fetchCommentsByResource, addComment } = useCommentContext();
  const { ratings, fetchRatingsByResource, addRating } = useRatingsContext();
  const [resource, setResource] = useState(null);
  const [resources, setResources] = useState([]);
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
  const [isContentCompleted, setIsContentCompleted] = useState(false);
  const [rightSideContent, setRightSideContent] = useState("allComments");
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [userComment, setUserComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");

  useEffect(() => {
    const fetchResource = async () => {
      try {
        if (id && !resource) {
          const resourceData = await getResourceUser(id);
          setResource(resourceData);
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
  }, [courseId]);

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

  useEffect(() => {
    if (id) {
      fetchCommentsByResource(id);
      fetchRatingsByResource(id);
    }
  }, [id, fetchCommentsByResource, fetchRatingsByResource]);

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
        return `https://www.youtube.com/embed/${videoId}?controls=1&rel=0&modestbranding=1&enablejsapi=1`;
      }
      const urlParams = new URLSearchParams(new URL(url).search);
      const videoId = urlParams.get("v");
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?controls=1&rel=0&modestbranding=1&enablejsapi=1`
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

  const handleVideoEnd = () => {
    setIsContentCompleted(true);
  };

  const renderContent = (file) => {
    if (file) {
      if (isVideoLink(file)) {
        return (
          <div className="relative w-full" style={{ paddingBottom: "45%" }}>
            <iframe
              ref={videoRef}
              title="Video"
              src={getEmbedUrl(file)}
              frameBorder="0"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
              onEnded={handleVideoEnd}
            ></iframe>
          </div>
        );
      } else if (file.endsWith(".pdf")) {
        return (
          <div className="relative w-full" style={{ paddingBottom: "45%" }}>
            <iframe
              src={file}
              title="PDF Viewer"
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
          </div>
        );
      } else if (file.startsWith("http")) {
        return (
          <div className="relative w-full" style={{ paddingBottom: "45%" }}>
            <img
              src={file}
              alt="Contenido"
              className="absolute top-0 left-0 w-full h-full object-contain"
              onLoad={() => setIsContentCompleted(true)}
            />
          </div>
        );
      }
    }
    return (
      <p className="text-center text-gray-600">No hay contenido disponible</p>
    );
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
        icon: "warning",
        title: "Advertencia",
        text: "Por favor selecciona una respuesta antes de continuar.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
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
      setIsContentCompleted(true);
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
    setIsContentCompleted(false);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const renderQuiz = () => {
    const question = resource.quizzes[currentQuestionIndex];
    const quizProgress =
      ((currentQuestionIndex + 1) / resource.quizzes.length) * 100;

    return (
      <div className="quiz-container bg-white rounded-xl shadow-lg border border-gray-200 w-full p-4 sm:p-6 my-4 sm:my-6">
        <div className="mb-4 sm:mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm sm:text-base font-bold text-gray-500">
              Progreso del quiz
            </span>
            <span className="text-sm sm:text-base font-bold text-gray-500">
              {currentQuestionIndex + 1}/{resource.quizzes.length}
            </span>
          </div>
          <div className="w-full bg-white rounded-full h-2 sm:h-2.5">
            <div
              className="bg-[#9869E3] h-2 sm:h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${quizProgress}%` }}
            ></div>
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center">
          {question.question}
        </h3>

        <div className="space-y-3 sm:space-y-4">
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                type="radio"
                id={`question-${currentQuestionIndex}-option-${index}`}
                name={`question-${currentQuestionIndex}`}
                value={option}
                checked={answers[currentQuestionIndex] === option}
                onChange={() =>
                  handleAnswerChange(currentQuestionIndex, option)
                }
                className="hidden"
              />
              <label
                htmlFor={`question-${currentQuestionIndex}-option-${index}`}
                className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg border-2 text-sm sm:text-base cursor-pointer transition-all duration-200 
                ${
                  answers[currentQuestionIndex] === option
                    ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                {option}
              </label>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6 sm:mt-8">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 ${
              currentQuestionIndex === 0
                ? "bg-[#DDDDDD] text-white cursor-not-allowed"
                : "bg-[#9869E3] text-white hover:bg-[#8A5CD6]"
            }`}
            aria-label="Pregunta anterior"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={!isAnswerSelected}
            className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 ${
              isAnswerSelected
                ? "bg-[#9869E3] text-white hover:bg-[#8A5CD6]"
                : "bg-[#DDDDDD] text-white cursor-not-allowed"
            }`}
            aria-label={
              currentQuestionIndex === (resource?.quizzes.length || 0) - 1
                ? "Finalizar quiz"
                : "Siguiente pregunta"
            }
          >
            {currentQuestionIndex === (resource?.quizzes.length || 0) - 1 ? (
              "Finalizar"
            ) : (
              <FiChevronRight size={20} />
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderQuizSummary = () => {
    return (
      <div className="quiz-summary bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 w-full mx-auto my-4 sm:my-6">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-800">
          Quiz Finalizado
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex flex-col items-center p-3 sm:p-4 bg-gray-50 rounded-lg">
            <FaQuestionCircle className="text-3xl sm:text-4xl mb-2 text-gray-600" />
            <span className="text-base sm:text-lg font-medium text-gray-700">
              Preguntas Totales
            </span>
            <span className="text-xl sm:text-2xl font-bold text-gray-800">
              {resource?.quizzes.length}
            </span>
          </div>
          <div className="flex flex-col items-center p-3 sm:p-4 bg-green-50 rounded-lg">
            <FaCheckCircle className="text-3xl sm:text-4xl mb-2 text-green-500" />
            <span className="text-base sm:text-lg font-medium text-gray-700">
              Respuestas Correctas
            </span>
            <span className="text-xl sm:text-2xl font-bold text-green-600">
              {correctAnswers}
            </span>
          </div>
          <div className="flex flex-col items-center p-3 sm:p-4 bg-red-50 rounded-lg">
            <FaTimesCircle className="text-3xl sm:text-4xl mb-2 text-red-500" />
            <span className="text-base sm:text-lg font-medium text-gray-700">
              Respuestas Incorrectas
            </span>
            <span className="text-xl sm:text-2xl font-bold text-red-600">
              {incorrectAnswers}
            </span>
          </div>
        </div>
        <button
          onClick={handleRetakeQuiz}
          className="w-full py-2 sm:py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Volver a Intentar
        </button>
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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (userComment.trim() !== "" && user && user.data && user.data.id) {
      try {
        const response = await addComment(courseId, id, {
          content: userComment,
          userId: user.data.id,
        });
        console.log("Respuesta del servidor:", response);
        setUserComment("");
        Swal.fire({
          icon: "success",
          title: "Comentario enviado",
          text: "Tu comentario ha sido publicado exitosamente.",
        });
        await fetchCommentsByResource(id);
      } catch (error) {
        console.error("Error al enviar comentario:", error);
        let errorMessage =
          "Ocurrió un error al enviar el comentario. Por favor, intenta de nuevo más tarde.";
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
          errorMessage = `Error ${error.response.status}: ${
            error.response.data.message || errorMessage
          }`;
        } else if (error.request) {
          console.error("Request:", error.request);
          errorMessage =
            "No se recibió respuesta del servidor. Por favor, verifica tu conexión.";
        } else {
          console.error("Error message:", error.message);
        }
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor, escribe un comentario antes de enviar.",
      });
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (userRating > 0 && user && user.data && user.data.id) {
      try {
        await addRating(courseId, id, {
          userId: user.data.id,
          score: userRating,
          comment: ratingComment,
        });
        Swal.fire({
          icon: "success",
          title: "¡Gracias por tu calificación!",
          text: "Tu opinión es muy importante para nosotros.",
        });
        setUserRating(0);
        setRatingComment("");
        await fetchRatingsByResource(id);
      } catch (error) {
        console.error("Error al enviar calificación:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al enviar la calificación. Por favor, intenta de nuevo más tarde.",
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor, selecciona una calificación antes de enviar.",
      });
    }
  };

  const renderRightSideContent = () => {
    return (
      <div className="space-y-4">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          <button
            onClick={() => setRightSideContent("allComments")}
            className={`px-6 py-2 rounded-lg text-xs font-bungee whitespace-nowrap ${
              rightSideContent === "allComments"
                ? "bg-white text-[#321A5A]"
                : "bg-[#4B2F7A] text-white"
            }`}
          >
            COMENTARIOS
            <br />
            DEL RECURSO
          </button>
          <button
            onClick={() => setRightSideContent("ratings")}
            className={`px-6 py-2 rounded-lg text-xs font-bungee whitespace-nowrap ${
              rightSideContent === "ratings"
                ? "bg-white text-[#321A5A]"
                : "bg-[#4B2F7A] text-white"
            }`}
          >
            NOTAS DEL
            <br />
            RECURSO
          </button>
          <button
            onClick={() => setRightSideContent("courseNotes")}
            className={`px-6 py-2 rounded-lg text-xs font-bungee whitespace-nowrap ${
              rightSideContent === "courseNotes"
                ? "bg-white text-[#321A5A]"
                : "bg-[#4B2F7A] text-white"
            }`}
          >
            COMENTARIOS
            <br />
            GENERAL
          </button>
          <button
            onClick={() => setRightSideContent("secondBrain")}
            className={`px-6 py-2 rounded-lg text-xs font-bungee whitespace-nowrap ${
              rightSideContent === "secondBrain"
                ? "bg-white text-[#321A5A]"
                : "bg-[#4B2F7A] text-white"
            }`}
          >
            SEGUNDO
            <br />
            CEREBRO
          </button>
        </div>
        {rightSideContent === "allComments" && (
          <div className="bg-[#200E3E] p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 font-bungee text-white">
              Comentarios
            </h3>
            <div className="space-y-4 max-h-60 overflow-y-auto mb-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start space-x-3 pb-3 border-b border-gray-700"
                >
                  <div className="flex-shrink-0">
                    {comment.user.userImage ? (
                      <img
                        src={comment.user.userImage}
                        alt={comment.user.username}
                        className="w-8 sm:w-10 h-8 sm:h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <FaUser className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-white">
                      {comment.user.username}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-300">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleCommentSubmit} className="mt-4">
              <textarea
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                placeholder="Escribe tu comentario..."
                className="w-full p-2 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-700 text-white border-gray-600"
                rows="3"
              ></textarea>
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center w-full text-sm"
              >
                <FiSend className="mr-2" /> Enviar comentario
              </button>
            </form>
          </div>
        )}
        {rightSideContent === "ratings" && (
          <div className="bg-[#200E3E] p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 font-bungee text-white">
              Valoraciones del Recurso
            </h3>
            <div className="space-y-4 max-h-60 overflow-y-auto mb-4">
              {ratings.map((rating) => (
                <div
                  key={rating.id}
                  className="flex items-start space-x-3 pb-3 border-b border-gray-700"
                >
                  <div className="flex-shrink-0">
                    {rating.user.userImage ? (
                      <img
                        src={rating.user.userImage}
                        alt={rating.user.username}
                        className="w-8 sm:w-10 h-8 sm:h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <FaUser className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-white">
                      {rating.user.username}
                    </p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={`h-4 w-4 ${
                            index < rating.score
                              ? "text-yellow-400"
                              : "text-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300">
                      {rating.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {renderRatingForm()}
          </div>
        )}
        {rightSideContent === "courseNotes" && (
          <div className="bg-[#200E3E] p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 font-bungee text-white">
              Notas del Curso
            </h3>
            <p className="text-white">Contenido próximamente disponible.</p>
          </div>
        )}
        {rightSideContent === "secondBrain" && (
          <div className="bg-[#200E3E] p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 font-bungee text-white">
              Segundo Cerebro
            </h3>
            <p className="text-white">Contenido próximamente disponible.</p>
          </div>
        )}
      </div>
    );
  };

  const renderRatingForm = () => {
    return (
      <div className="bg-[#200E3E] p-4 rounded-lg shadow-md mt-4">
        <h3 className="text-lg font-semibold mb-4 font-bungee text-white">
          Califica este recurso
        </h3>
        <form onSubmit={handleRatingSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setUserRating(star)}
                className={`text-2xl ${
                  star <= userRating ? "text-yellow-400" : "text-gray-400"
                }`}
              >
                <FaStar />
              </button>
            ))}
          </div>
          <textarea
            value={ratingComment}
            onChange={(e) => setRatingComment(e.target.value)}
            placeholder="Escribe un comentario sobre tu calificación (opcional)"
            className="w-full p-2 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-700 text-white border-gray-600"
            rows="3"
          ></textarea>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center w-full text-sm"
          >
            Enviar calificación
          </button>
        </form>
      </div>
    );
  };

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!resource) return <div>Cargando...</div>;

  return (
    <div className="min-h-screen bg-[#200E3E]">
      <NavigationBar />
      <div className="flex flex-col sm:flex-row">
        <div className="hidden sm:block">
          <div
            className={`${
              isOpen ? "w-56" : "w-16"
            } fixed left-0 top-16 h-full bg-[#200E3E] transition-all duration-300 ease-in-out overflow-hidden z-40`}
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
                    isOpen ? "pr-4" : "justify-center"
                  }`}
                  onClick={() => handleResourceClick(res.id, res.courseId)}
                >
                  <div className="relative mr-4">
                    <div
                      className={`
                        flex items-center justify-center
                        w-8 h-8 rounded-full 
                        ${
                          res.id === resource.id
                            ? "bg-white text-[#6D4F9E]"
                            : "bg-[#6D4F9E] text-white"
                        }
                        text-sm font-bold
                      `}
                    >
                      {index + 1}
                    </div>
                    {index < resources.length - 1 && (
                      <div
                        className={`absolute left-4 top-8 w-0.5 h-10
                          ${
                            res.id === resource.id ? "bg-white" : "bg-[#6D4F9E]"
                          }
                        `}
                      />
                    )}
                  </div>
                  {isOpen && (
                    <span
                      className={`text-xs ${
                        res.id === resource.id
                          ? "text-white font-bold"
                          : "text-gray-400"
                      }`}
                    >
                      {res.title}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className={`flex-1 transition-all duration-300 ease-in-out pt-20 px-4 sm:px-6 ${
            isOpen ? "sm:ml-56" : "sm:ml-16"
          }`}
        >
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm sm:text-base font-medium text-white font-bungee">
                Progreso del curso
              </span>
              <span className="text-sm sm:text-base font-medium text-white font-bungee">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-2">
              <div
                className="bg-[#9869E3] h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <button
              onClick={handlePrevious}
              disabled={currentResourceIndex === 0}
              className={`p-2 rounded-full transition-colors ${
                currentResourceIndex === 0
                  ? "bg-[#DDDDDD] text-white cursor-not-allowed"
                  : "bg-[#9869E3] text-white hover:bg-[#8A5CD6]"
              }`}
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentResourceIndex === resources.length - 1}
              className={`p-2 rounded-full transition-colors ${
                currentResourceIndex === resources.length - 1
                  ? "bg-[#DDDDDD] text-white cursor-not-allowed"
                  : "bg-[#9869E3] text-white hover:bg-[#8A5CD6]"
              }`}
            >
              <FiChevronRight size={20} />
            </button>
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-2/3 bg-[#200E3E] rounded-lg shadow-lg p-4 mb-4">
              <div className="mb-4">
                {isQuizCompleted
                  ? renderQuizSummary()
                  : resource?.quizzes && resource.quizzes.length > 0
                  ? renderQuiz()
                  : renderContent(resource?.files)}
              </div>
              <div className="mt-4 flex items-center">
                <img
                  src={course?.image}
                  alt={course?.title}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <h2 className="text-lg font-roboto text-white">
                    {course?.title}
                  </h2>
                  <p className="text-sm text-gray-300">
                    {course?.creator?.username}
                  </p>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold mb-3 mt-4 font-bungee text-white">
                {resource.title}
              </h1>
              <div className="prose max-w-none text-sm sm:text-base text-white ml-4">
                <p>{resource.description}</p>
              </div>
            </div>
            <div className="w-full lg:w-1/3">{renderRightSideContent()}</div>
          </div>
          {currentResourceIndex === resources.length - 1 &&
            isContentCompleted && (
              <div className="fixed bottom-8 right-8 z-50">
                <button
                  onClick={handleFinishCourse}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-green-500 text-white rounded-full hover:bg-green-600 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  {t("navigation.finish")}
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
