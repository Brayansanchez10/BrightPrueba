import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useResourceContext } from "../../../context/courses/resource.contex";
import { useCoursesContext } from "../../../context/courses/courses.context";
import { useAuth } from "../../../context/auth.context";
import { useUserContext } from "../../../context/user/user.context";
import { useCourseProgressContext } from "../../../context/courses/progress.context";
import { useCommentContext } from "../../../context/courses/comment.context";
import { useRatingsContext } from "../../../context/courses/ratings.context";
import { useGeneralCommentContext } from "../../../context/courses/generalComment.context";
import {
  updateRating,
  deleteRating,
} from "../../../api/courses/ratings.request";
import NavigationBar from "../NavigationBar";
import {
  updateComment,
  deleteComment,
} from "../../../api/courses/comment.request";
import axios from "../../../api/axios";
import {
  FiMenu,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiSend,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiPlus,
  FiEdit2,
  FiDownload,
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
import { completeQuiz } from "../../../api/courses/resource.request";
import { useNotesContext } from "../../../context/courses/notes.context";
import "./resourceView.css";
import { useHorizontalScroll } from "./horizontalScroll.jsx";
import { generateNotesPDF } from "./notesDownload.jsx";

export default function ResourceView() {
  const { t } = useTranslation("global");
  const { user } = useAuth();
  const { getCourseProgress, updateCourseProgress } =
    useCourseProgressContext();
  const [currentProgress, setCurrentProgress] = useState(0);
  const { getUserById } = useUserContext();
  const [username, setUsername] = useState("");
  const { id, courseId } = useParams();
  const { getResourceUser, getResource, getUserResourceProgress } =
    useResourceContext();
  const { getCourse } = useCoursesContext();
  const {
    comments,
    fetchCommentsByResource,
    addComment,
    editComment,
    removeComment,
  } = useCommentContext();
  const {
    ratings,
    fetchRatingsByResource,
    addRating,
    editRating,
    removeRating,
  } = useRatingsContext();
  const {
    generalComments,
    fetchGeneralComments,
    addGeneralComment,
    editGeneralComment,
    removeGeneralComment,
  } = useGeneralCommentContext();
  const [resource, setResource] = useState(null);
  const [resources, setResources] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentResourceIndex, setCurrentResourceIndex] = useState(0);
  const [course, setCourse] = useState(null);
  const [isContentCompleted, setIsContentCompleted] = useState(false);
  const [rightSideContent, setRightSideContent] = useState("allComments");
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [userComment, setUserComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingRatingId, setEditingRatingId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");
  const [editedRatingScore, setEditedRatingScore] = useState(0);
  const [editedRatingComment, setEditedRatingComment] = useState("");
  const [showDropdown, setShowDropdown] = useState(null);
  const [userExistingRating, setUserExistingRating] = useState(null);
  const [creator, setCreator] = useState(null);
  const {
    notes,
    resourceNotes,
    fetchCourseNotes,
    fetchResourceNotes,
    addNote,
    addNoteToResource,
    editNote,
    editResourceNote,
    removeNote,
    removeResourceNote,
  } = useNotesContext();
  const [userNote, setUserNote] = useState("");
  const [userResourceNote, setUserResourceNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedNoteContent, setEditedNoteContent] = useState("");
  const [editingResourceNoteId, setEditingResourceNoteId] = useState(null);
  const [editedResourceNoteContent, setEditedResourceNoteContent] = useState("");
  const scrollContainerRef = useHorizontalScroll();
  const [userGeneralComment, setUserGeneralComment] = useState("");
  const [editingGeneralCommentId, setEditingGeneralCommentId] = useState(null);
  const [editedGeneralCommentContent, setEditedGeneralCommentContent] = useState("");

  useEffect(() => {
    if (courseId) {
      fetchGeneralComments(courseId);
    }
  }, [courseId, fetchGeneralComments]);

  const handleGeneralCommentSubmit = async (e) => {
    e.preventDefault();
    if (userGeneralComment.trim() !== "" && user?.data?.id) {
      try {
        const existingComment = generalComments.find(comment => comment.userId === user.data.id);
        if (existingComment) {
          Swal.fire({
            icon: "warning",
            title: "Ya has comentado",
            text: "Solo puedes hacer un comentario general por curso. Puedes editar tu comentario existente.",
          });
          return;
        }

        await addGeneralComment({
          content: userGeneralComment,
          userId: user.data.id,
          courseId: parseInt(courseId),
        });
        setUserGeneralComment("");
        await fetchGeneralComments(courseId);
        Swal.fire({
          icon: "success",
          title: "Comentario enviado",
          text: "Tu comentario general ha sido publicado exitosamente.",
        });
      } catch (error) {
        console.error("Error al enviar comentario general:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al enviar el comentario general. Por favor, intenta de nuevo más tarde.",
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

  const handleEditGeneralComment = (commentId, currentContent) => {
    setEditingGeneralCommentId(commentId);
    setEditedGeneralCommentContent(currentContent);
  };

  const handleSaveEditedGeneralComment = async (commentId) => {
    if (editedGeneralCommentContent.trim() !== "") {
      try {
        await editGeneralComment(commentId, { content: editedGeneralCommentContent });
        await fetchGeneralComments(courseId);
        setEditingGeneralCommentId(null);
        setEditedGeneralCommentContent("");
        Swal.fire({
          icon: "success",
          title: "Comentario general actualizado",
          text: "Tu comentario general ha sido actualizado exitosamente.",
        });
      } catch (error) {
        console.error("Error al editar el comentario general:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al editar el comentario general. Por favor, intenta de nuevo más tarde.",
        });
      }
    }
  };

  const handleDeleteGeneralComment = async (commentId) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await removeGeneralComment(commentId);
        await fetchGeneralComments(courseId);
        Swal.fire("Eliminado", "Tu comentario general ha sido eliminado.", "success");
      }
    } catch (error) {
      console.error("Error al eliminar el comentario general:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al eliminar el comentario general. Por favor, intenta de nuevo más tarde.",
      });
    }
  };

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
        const courseData = await getCourse(courseId);
        setCourse(courseData);

        if (courseData && courseData.userId) {
          const creatorData = await getUserById(courseData.userId);
          setCreator(creatorData);
        }
      } catch (error) {
        console.error("Error al obtener la información del curso:", error);
      }
    };

    fetchCourse();
  }, [courseId, getCourse]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (user?.data?.id && courseId) {
        const progress = await getCourseProgress(user.data.id, courseId);
        setCurrentProgress(progress);
      }
    };

    fetchProgress();
  }, [user, courseId]);

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

  useEffect(() => {
    const fetchProgress = async () => {
      if (user && id) {
        try {
          const progressData = await getUserResourceProgress(user.data.id, id);
          console.log("Progreso del usuario:", progressData);
          setProgress(progressData);
          setAttempts(progressData.attempts);
          setBestScore(progressData.bestScore);
          setIsQuizCompleted(progressData.attempts >= resource?.attempts);
        } catch (error) {
          console.error("Error al obtener el progreso del usuario:", error);
        }
      }
    };

    fetchProgress();
  }, [user, id, getUserResourceProgress, resource]);

  useEffect(() => {
    const checkExistingRating = () => {
      if (user?.data?.id && ratings.length > 0) {
        const existing = ratings.find(
          (rating) => rating.userId === user.data.id
        );
        setUserExistingRating(existing || null);
        if (existing) {
          setUserRating(existing.score);
          setRatingComment(existing.comment);
        }
      }
    };

    checkExistingRating();
  }, [user, ratings]);

  useEffect(() => {
    if (course?.id) {
      fetchCourseNotes(course.id);
    }
  }, [course, fetchCourseNotes]);

  useEffect(() => {
    if (course?.id && resource?.id) {
      fetchResourceNotes(course.id, resource.id);
    }
  }, [course, resource, fetchResourceNotes]);

  useEffect(() => {
    console.log("Apuntes:", notes);
    console.log("Apuntes del recurso:", resourceNotes);
  }, [notes, resourceNotes]);

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

  const maxAttempts = resource?.attempts;

  const handleAnswerChange = (questionIndex, selectedAnswer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: selectedAnswer,
    }));
  };

  const handleNextQuestion = async () => {
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

      // Calcular el porcentaje de respuestas correctas
      const scorePercentage = Math.round(
        (correctCount / resource?.quizzes.length) * 100
      );

      // Guardar el puntaje obtenido
      setCurrentScore(scorePercentage);

      // Esperar a que el bestScore se actualice
      if (scorePercentage > bestScore) {
        setBestScore(scorePercentage);
      }

      // Si es el último intento
      if (attempts + 1 === maxAttempts) {
        setTimeout(() => {
          setIsQuizStarted(false); // Esto redirige al usuario
        }, 500); // Agregar un pequeño retraso
      }

      try {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        const result = await completeQuiz(
          user.data.id,
          resource.id,
          scorePercentage,
          newAttempts
        );
        console.log("Resultado del quiz:", result);
      } catch (error) {
        console.error("Error al completar el quiz:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo guardar tu progreso.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      }

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
    if (attempts >= resource?.attempts) {
      Swal.fire({
        icon: "error",
        title: "Límite de intentos alcanzado",
        text: "Has alcanzado el número máximo de intentos permitidos.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      return;
    }

    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setIsQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  useEffect(() => {
    if (currentScore > bestScore) {
      setBestScore(currentScore); // Actualizar el bestScore si el puntaje actual es mayor
    }
  }, [currentScore, bestScore]);

  const renderStartQuizView = () => {
    return (
      <div className="quiz-start bg-white rounded-2xl shadow-md border border-gray-300 w-full p-6 my-6 text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          {t("quizz.quizzStart")}
        </h3>
        <div className="flex justify-around mb-6">
          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl">
            <span className="text-lg sm:text-xl font-medium text-gray-700">
              {t("quizz.quizzAttemps")}
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
              {attempts}/{resource?.attempts}
            </span>
          </div>
        </div>

        {attempts > 0 && (
          <div className="flex flex-col items-center mb-6">
            <span className="text-lg sm:text-xl font-medium text-gray-700">
              {t("quizz.quizzBestScore")}
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
              {bestScore !== undefined ? bestScore : 0}
            </span>
          </div>
        )}

        {attempts < resource?.attempts ? (
          <button
            onClick={() => setIsQuizStarted(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 text-lg font-medium"
          >
            {t("quizz.InitQuizz")}
          </button>
        ) : (
          <p className="text-red-600 font-semibold">
            {t("quizz.AttempsLimit")}
          </p>
        )}
      </div>
    );
  };

  const renderQuiz = () => {
    const question = resource.quizzes[currentQuestionIndex];
    const quizProgress =
      ((currentQuestionIndex + 1) / resource.quizzes.length) * 100;

    return (
      <div className="quiz-container bg-white rounded-2xl shadow-md border border-gray-300 w-full p-6 my-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-base sm:text-lg font-semibold text-gray-600">
              {t("quizz.QuizzProgress")}
            </span>
            <span className="text-base sm:text-lg font-semibold text-gray-600">
              {currentQuestionIndex + 1}/{resource.quizzes.length}
            </span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2 sm:h-3">
            <div
              className="bg-blue-600 h-2 sm:h-3 rounded-full transition-all duration-300"
              style={{ width: `${quizProgress}%` }}
            ></div>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center mb-6">
          {question.question}
        </h3>

        <div className="space-y-4 sm:space-y-6">
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
                className={`flex-1 py-3 px-4 rounded-lg border-2 text-lg cursor-pointer transition-all duration-200 ${
                  answers[currentQuestionIndex] === option
                    ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {option}
              </label>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              currentQuestionIndex === 0
                ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            aria-label="Previous question"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={!answers[currentQuestionIndex]}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              answers[currentQuestionIndex]
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-400 cursor-not-allowed"
            }`}
            aria-label={
              currentQuestionIndex === resource.quizzes.length - 1
                ? "Finish quiz"
                : "Next question"
            }
          >
            {currentQuestionIndex === resource.quizzes.length - 1 ? (
              "Finish"
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
      <div className="quiz-summary bg-white rounded-2xl shadow-md border border-gray-300 w-full p-6 my-6 text-center">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
          {t("quizz.QuizResumen")}
        </h3>
        <div className="flex justify-around mb-6">
          <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl">
            <FaCheckCircle className="text-4xl mb-2 text-green-600" />
            <span className="text-lg sm:text-xl font-medium text-gray-700">
              {t("quizz.QuizCorrectAnswers")}
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
              {correctAnswers}
            </span>
          </div>
          <div className="flex flex-col items-center p-4 bg-red-50 rounded-xl">
            <FaTimesCircle className="text-4xl mb-2 text-red-600" />
            <span className="text-lg sm:text-xl font-medium text-gray-700">
              {t("quizz.QuizIncorrectAnswers")}
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
              {incorrectAnswers}
            </span>
          </div>
        </div>
        <p className="text-lg sm:text-base text-gray-600 mb-4">
          {t("quizz.Attemps")}
          {attempts}/{resource?.attempts}
        </p>

        {isQuizCompleted && (
          <div className="flex flex-col items-center mb-6">
            <span className="text-lg sm:text-xl font-medium text-gray-700">
              {t("quizz.currentScore")}
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
              {currentScore}
            </span>
          </div>
        )}

        {attempts < resource?.attempts ? (
          <button
            onClick={handleRetakeQuiz}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            {t("quizz.Again")}
          </button>
        ) : (
          <p className="text-red-600 font-semibold">
            {t("quizz.AttempsLimit")}
          </p>
        )}
      </div>
    );
  };

  const calculateProgress = (currentIndex, totalResources) => {
    if (currentIndex === totalResources - 1) {
      return 100;
    }
    return Math.round(((currentIndex + 1) / totalResources) * 100);
  };

  const handlePrevious = async () => {
    if (currentResourceIndex > 0) {
      const previousResource = resources[currentResourceIndex - 1];
      setCurrentResourceIndex(currentResourceIndex - 1);

      handleResourceClick(previousResource.id, previousResource.courseId);
    }
  };

  const handleNext = async () => {
    if (currentResourceIndex < resources.length - 1) {
      const nextResource = resources[currentResourceIndex + 1];

      // Calcula el porcentaje por recurso basado en la cantidad total de recursos
      const percentagePerResource = 100 / resources.length;

      // El nuevo progreso es el índice actual + 1 multiplicado por el porcentaje por recurso
      const newProgress = (currentResourceIndex + 1) * percentagePerResource;

      // Asegúrate de que el progreso solo suba
      if (newProgress > currentProgress && currentProgress < 100) {
        await updateCourseProgress(user.data.id, courseId, newProgress);
        setCurrentProgress(newProgress); // Actualiza el progreso en el estado local
      }

      // Avanza al siguiente recurso
      setCurrentResourceIndex(currentResourceIndex + 1);
      handleResourceClick(nextResource.id, nextResource.courseId);
    }
  };

  const handleFinishCourse = async () => {
    await updateCourseProgress(user.data.id, courseId, 100);
    generatePremiumCertificatePDF(
      username,
      course.title,
      zorro,
      derechaabajo,
      izquierdaarriba
    );
    navigate(`/course/${courseId}`);
  };

  const handleResourceClick = (resourceId, courseId) => {
    console.log("Course ID: ", courseId);
    console.log("Resource ID: ", resourceId);
    window.location.href = `/course/${courseId}/resource/${resourceId}`;
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
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

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (userNote.trim() !== "" && user?.data?.id) {
      try {
        const result = await addNote(course.id, {
          content: userNote,
          userId: user.data.id,
        });

        if (result) {
          setUserNote("");
          await fetchCourseNotes(course.id);
          Swal.fire({
            icon: "success",
            title: "Apunte creado",
            text: "Tu apunte ha sido creado exitosamente.",
          });
        }
      } catch (error) {
        console.error("Error al añadir nota:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al crear el apunte. Por favor, intenta de nuevo más tarde.",
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor, escribe un apunte antes de guardar.",
      });
    }
  };

  const handleAddResourceNote = async (e) => {
    e.preventDefault();

    if (userResourceNote.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor, escribe un apunte antes de guardar.",
      });
      return;
    }

    try {
      // Verificar si ya existe una nota para este recurso específico
      const existingResourceNote = resourceNotes.find(
        (note) => note.resourceId === resource.id
      );
      if (existingResourceNote) {
        Swal.fire({
          icon: "info",
          title: "Apunte existente",
          text: "Ya existe un apunte para este recurso. Puedes editarlo si deseas hacer cambios.",
        });
        return;
      }

      // Buscar la nota general del curso
      const generalNote = notes.find(
        (note) => note.courseId === parseInt(courseId) && !note.resourceId
      );
      if (!generalNote) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se encontró una nota general para este curso. Por favor, crea una primero.",
        });
        return;
      }

      const newResourceNote = await addNoteToResource(resource.id, {
        content: userResourceNote,
        noteId: generalNote.id,
      });
      console.log("Nueva nota del recurso creada:", newResourceNote);

      // Actualizamos el contexto
      await fetchResourceNotes(course.id, resource.id);
      setUserResourceNote("");

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "El apunte del recurso ha sido añadido exitosamente.",
      });
    } catch (error) {
      console.error("Error al añadir el apunte del recurso:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al añadir el apunte del recurso. Por favor, intenta de nuevo más tarde.",
      });
    }
  };

  const handleEditNote = async (noteId, content) => {
    setEditingNoteId(noteId);
    setEditedNoteContent(content);
  };

  const handleSaveEditedNote = async (noteId) => {
    try {
      await editNote(noteId, { content: editedNoteContent });
      // Actualizar el estado local de las notas
      const updatedNotes = notes.map((note) =>
        note.id === noteId ? { ...note, content: editedNoteContent } : note
      );
      // Actualizar el estado de las notas
      fetchCourseNotes(course.id);
      // Resetear el estado de edición
      setEditingNoteId(null);
      setEditedNoteContent("");
      // Mostrar mensaje de éxito
      Swal.fire({
        icon: "success",
        title: "Apunte actualizado",
        text: "Tu apunte ha sido actualizado exitosamente.",
      });
    } catch (error) {
      console.error("Error al editar nota:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al editar el apunte. Por favor, intenta de nuevo más tarde.",
      });
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await removeNote(noteId);
        await fetchCourseNotes(course.id);
        await fetchResourceNotes(course.id, resource.id);
        Swal.fire(
          "Eliminado",
          "Tu apunte ha sido eliminado.",
          "success"
        );
      }
    } catch (error) {
      console.error("Error al eliminar nota:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al eliminar el apunte. Por favor, intenta de nuevo más tarde.",
      });
    }
  };

  const handleEditResourceNote = (noteId, content) => {
    setEditingResourceNoteId(noteId);
    setEditedResourceNoteContent(content);
  };

  const handleSaveEditedResourceNote = async (noteId) => {
    try {
      await editResourceNote(noteId, { content: editedResourceNoteContent });
      await fetchResourceNotes(course.id, resource.id);
      setEditingResourceNoteId(null);
      setEditedResourceNoteContent("");
      Swal.fire({
        icon: "success",
        title: "Apunte actualizado",
        text: "Tu apunte del recurso ha sido actualizado exitosamente.",
      });
    } catch (error) {
      console.error("Error al editar el apunte del recurso:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al editar el apunte del recurso. Por favor, intenta de nuevo más tarde.",
      });
    }
  };

  const handleDeleteResourceNote = async (noteId) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await removeResourceNote(noteId);
        await fetchResourceNotes(course.id, resource.id);
        Swal.fire(
          "Eliminado",
          "Tu apunte del recurso ha sido eliminado.",
          "success"
        );
      }
    } catch (error) {
      console.error("Error al eliminar el apunte del recurso:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al eliminar el apunte del recurso. Por favor, intenta de nuevo más tarde.",
      });
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (userComment.trim() !== "" && user?.data?.id) {
      try {
        await addComment(courseId, id, {
          content: userComment,
          userId: user.data.id,
        });
        setUserComment("");
        await fetchCommentsByResource(id);
        Swal.fire({
          icon: "success",
          title: "Comentario enviado",
          text: "Tu comentario ha sido publicado exitosamente.",
        });
      } catch (error) {
        console.error("Error al enviar comentario:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al enviar el comentario. Por favor, intenta de nuevo más tarde.",
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
    if (userRating > 0 && user?.data?.id) {
      try {
        if (userExistingRating) {
          await updateRating(userExistingRating.id, {
            score: userRating,
            comment: ratingComment,
          });
          Swal.fire({
            icon: "success",
            title: "Valoración actualizada",
            text: "Tu valoración ha sido actualizada exitosamente.",
          });
        } else {
          await addRating(courseId, id, {
            userId: user.data.id,
            score: userRating,
            comment: ratingComment,
          });
          Swal.fire({
            icon: "success",
            title: "¡Gracias por tu valoración!",
            text: "Tu valoración ha sido registrada exitosamente.",
          });
        }

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

  const renderResourceList = () => {
    const totalResources = resources.length;
    const percentagePerResource = 100 / totalResources; // Porcentaje que representa cada recurso

    return resources.map((res, index) => {
      // Progreso requerido para desbloquear este recurso
      const requiredProgress = Math.floor(index * percentagePerResource);

      // Desbloquear si el progreso actual es mayor o igual al progreso requerido
      const isUnlocked = currentProgress >= requiredProgress;

      return (
        <div
          key={res.id}
          className={`flex items-start mb-6 cursor-pointer ${
            isOpen ? "pr-4" : "justify-center"
          }`}
          onClick={() =>
            isUnlocked && handleResourceClick(res.id, res.courseId)
          } // Solo permitir clic si está desbloqueado
        >
          <div className="relative mr-2.5">
            <div
              className={`
                flex items-center justify-center
                w-10 h-10 rounded-full 
                ${
                  isUnlocked
                    ? "bg-white text-[#6D4F9E]"
                    : "bg-gray-500 text-gray-300 cursor-not-allowed"
                }
                text-sm font-bold
              `}
            >
              {index + 1}
            </div>
            {index < resources.length - 1 && (
              <div
                className={`absolute left-[19px] top-8 w-0.5 h-10 ${
                  isUnlocked ? "bg-white" : "bg-gray-500"
                }`}
              />
            )}
          </div>
          {isOpen && (
            <span
              className={`mt-2 text-xs ${
                isUnlocked ? "text-white font-bold" : "text-gray-500"
              }`}
            >
              {res.title}
            </span>
          )}
        </div>
      );
    });
  };

  const handleEditComment = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditedCommentContent(currentContent);
  };

  const handleSaveEditedComment = async (commentId) => {
    if (editedCommentContent.trim() !== "") {
      try {
        await updateComment(commentId, { content: editedCommentContent });
        await fetchCommentsByResource(id);
        setEditingCommentId(null);
        setEditedCommentContent("");
        Swal.fire({
          icon: "success",
          title: "Comentario actualizado",
          text: "Tu comentario ha sido actualizado exitosamente.",
        });
      } catch (error) {
        console.error("Error al editar el comentario:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al editar el comentario. Por favor, intenta de nuevo más tarde.",
        });
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await deleteComment(commentId);
        await fetchCommentsByResource(id);
        Swal.fire("Eliminado", "Tu comentario ha sido eliminado.", "success");
      }
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al eliminar el comentario. Por favor, intenta de nuevo más tarde.",
      });
    }
  };

  const handleEditRating = (ratingId, currentScore, currentComment) => {
    setEditingRatingId(ratingId);
    setEditedRatingScore(currentScore);
    setEditedRatingComment(currentComment);
  };

  const handleSaveEditedRating = async (ratingId) => {
    if (editedRatingScore > 0) {
      try {
        await updateRating(ratingId, {
          score: editedRatingScore,
          comment: editedRatingComment,
        });
        await fetchRatingsByResource(id);
        setEditingRatingId(null);
        setEditedRatingScore(0);
        setEditedRatingComment("");
        Swal.fire({
          icon: "success",
          title: "Calificación actualizada",
          text: "Tu calificación ha sido actualizada exitosamente.",
        });
      } catch (error) {
        console.error("Error al editar la calificación:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al editar la calificación. Por favor, intenta de nuevo más tarde.",
        });
      }
    }
  };

  const handleDeleteRating = async (ratingId) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await deleteRating(ratingId);
        await fetchRatingsByResource(id);
        setUserExistingRating(null);
        setUserRating(0);
        setRatingComment("");
        Swal.fire("Eliminada", "Tu calificación ha sido eliminada.", "success");
      }
    } catch (error) {
      console.error("Error al eliminar la calificación:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al eliminar la calificación. Por favor, intenta de nuevo más tarde.",
      });
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDownloadNotes = () => {
    generateNotesPDF(notes, resourceNotes, resources);
  };

  const renderRightSideContent = () => {
    return (
      <div className="space-y-4">
        <div ref={scrollContainerRef} className="flex space-x-4 custom-scrollbar-x pb-2">
          <button
            onClick={() => setRightSideContent("allComments")}
            className={`px-6 py-2 rounded-lg text-xs font-bungee ${
              rightSideContent === "allComments"
                ? "bg-white text-[#321A5A]"
                : "bg-[#4B2F7A] text-white"
            }`}
          >
            {t("resource_view.commentsR")}
          </button>
          <button
            onClick={() => setRightSideContent("ratings")}
            className={`px-6 py-2 rounded-lg text-xs font-bungee whitespace-nowrap ${
              rightSideContent === "ratings"
                ? "bg-white text-[#321A5A]"
                : "bg-[#4B2F7A] text-white"
            }`}
          >
            {t("resource_view.notes1")}
            <br />
            {t("resource_view.notes2")}
          </button>
          <button
            onClick={() => setRightSideContent("generalComments")}
            className={`px-6 py-2 rounded-lg text-xs font-bungee ${
              rightSideContent === "generalComments"
                ? "bg-white text-[#321A5A]"
                : "bg-[#4B2F7A] text-white"
            }`}
          >
            {t("resource_view.commentsG")}
          </button>
          <button
            onClick={() => setRightSideContent("notesCourse")}
            className={`px-5 py-2 rounded-lg text-xs font-bungee whitespace-nowrap ${
              rightSideContent === "notesCourse"
                ? "bg-white text-[#321A5A]"
                : "bg-[#4B2F7A] text-white"
            }`}
          >
            {t("resource_view.notesOf")}
            <br />
            {t("resource_view.notesR")}
          </button>
        </div>
        {rightSideContent === "allComments" && (
          <div className="bg-[#200E3E] p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-roboto text-white mb-4">
              {comments.length} {t("resource_view.comments")}
            </h3>
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  type="text"
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder={t("resource_view.placeholder")}
                  className="w-full bg-transparent border-b border-[#8D8282] focus:outline-none focus:border-white text-[#8D8282] placeholder-[#8D8282] focus:text-white"
                />
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleCommentSubmit}
                  className="px-4 py-2 bg-[#4B2F7A] font-bungee text-white rounded-md hover:bg-[#6e46b4] transition-colors flex items-center text-xs"
                >
                  <FiSend className="mr-2" /> {t("resource_view.comment")}
                </button>
              </div>
            </div>
            <div className="space-y-4 max-h-[30rem] custom-scrollbar-y">
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
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white">
                          {comment.user.username}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                      {user.data.id === comment.userId && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowDropdown(
                                showDropdown === comment.id ? null : comment.id
                              )
                            }
                            className="text-gray-400 hover:text-white"
                          >
                            <FiMoreVertical />
                          </button>
                          {showDropdown === comment.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                              <button
                                onClick={() => {
                                  handleEditComment(
                                    comment.id,
                                    comment.content
                                  );
                                  setShowDropdown(null);
                                }}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <FiEdit className="inline-block mr-2" />
                                {t("resource_view.edit")}
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteComment(comment.id);
                                  setShowDropdown(null);
                                }}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <FiTrash2 className="inline-block mr-2" />
                                {t("resource_view.delete")}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {editingCommentId === comment.id ? (
                      <div className="mt-2">
                        <textarea
                          value={editedCommentContent}
                          onChange={(e) =>
                            setEditedCommentContent(e.target.value)
                          }
                          className="w-full bg-gray-700 text-white rounded p-2"
                          rows="3"
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => handleSaveEditedComment(comment.id)}
                            className="px-4 py-2 bg-[#4B2F7A] font-bungee text-white rounded-md hover:bg-[#6e46b4] transition-colors text-xs mr-2"
                          >
                            {t("resource_view.save")}
                          </button>
                          <button
                            onClick={() => setEditingCommentId(null)}
                            className="px-4 py-2 bg-gray-500 font-bungee text-white rounded-md hover:bg-gray-600 transition-colors text-xs"
                          >
                            {t("resource_view.cancel")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-300">
                        {comment.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {rightSideContent === "ratings" && (
          <div className="bg-[#200E3E] p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-roboto text-white mb-4">
              {ratings.length} {t("resource_view.ratings")}
            </h3>
            <div className="mb-4">
              <div className="flex items-center">
                <div className="flex-grow">
                  <div className="flex items-center space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className={`text-2xl ${
                          star <= userRating
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    placeholder={t("resource_view.placeholderR")}
                    className="w-full bg-transparent border-b border-[#8D8282] focus:outline-none focus:border-white text-[#8D8282] placeholder-[#8D8282] focus:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleRatingSubmit}
                  className="px-4 py-2 bg-[#4B2F7A] font-bungee text-white rounded-md hover:bg-[#6e46b4] transition-colors flex items-center text-xs"
                >
                  <FiSend className="mr-2" />
                  {userExistingRating ? (
                    <>{t("resource_view.update")}</>
                  ) : (
                    <>{t("resource_view.qualify")}</>
                  )}
                </button>
              </div>
            </div>
            {userExistingRating && (
              <p className="text-yellow-400 mb-4">
                {t("resource_view.already")}
              </p>
            )}
            <div className="space-y-4 max-h-[25.5rem] overflow-y-auto custom-scrollbar-y">
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
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white">
                          {rating.user.username}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(rating.createdAt)}
                        </p>
                      </div>
                      {user.data.id === rating.userId && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowDropdown(
                                showDropdown === `rating-${rating.id}`
                                  ? null
                                  : `rating-${rating.id}`
                              )
                            }
                            className="text-gray-400 hover:text-white"
                          >
                            <FiMoreVertical />
                          </button>
                          {showDropdown === `rating-${rating.id}` && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                              <button
                                onClick={() => {
                                  handleEditRating(
                                    rating.id,
                                    rating.score,
                                    rating.comment
                                  );
                                  setShowDropdown(null);
                                }}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <FiEdit className="inline-block mr-2" />
                                {t("resource_view.edit")}
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteRating(rating.id);
                                  setShowDropdown(null);
                                }}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <FiTrash2 className="inline-block mr-2" />
                                {t("resource_view.delete")}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {editingRatingId === rating.id ? (
                      <div className="mt-2">
                        <div className="flex items-center mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setEditedRatingScore(star)}
                              className={`text-2xl ${
                                star <= editedRatingScore
                                  ? "text-yellow-400"
                                  : "text-gray-400"
                              }`}
                            >
                              <FaStar />
                            </button>
                          ))}
                        </div>
                        <textarea
                          value={editedRatingComment}
                          onChange={(e) =>
                            setEditedRatingComment(e.target.value)
                          }
                          className="w-full bg-gray-700 text-white rounded p-2"
                          rows="3"
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => handleSaveEditedRating(rating.id)}
                            className="px-4 py-2 bg-[#4B2F7A] font-bungee text-white rounded-md hover:bg-[#6e46b4] transition-colors text-xs mr-2"
                          >
                            {t("resource_view.save")}
                          </button>
                          <button
                            onClick={() => setEditingRatingId(null)}
                            className="px-4 py-2 bg-gray-500 font-bungee text-white rounded-md hover:bg-gray-600 transition-colors text-xs"
                          >
                            {t("resource_view.cancel")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`text-xl ${
                                star <= rating.score
                                  ? "text-yellow-400"
                                  : "text-gray-400"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-300">
                          {rating.comment}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    {rightSideContent === "generalComments" && (
          <div className="bg-[#200E3E] p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-roboto text-white mb-4">
              {generalComments.length} comentarios generales
            </h3>
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  type="text"
                  value={userGeneralComment}
                  onChange={(e) => setUserGeneralComment(e.target.value)}
                  placeholder="Escribe tu opinión general del curso"
                  className="w-full bg-transparent border-b border-[#8D8282] focus:outline-none focus:border-white text-[#8D8282] placeholder-[#8D8282] focus:text-white"
                />
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleGeneralCommentSubmit}
                  className="px-4 py-2 bg-[#4B2F7A] text-white rounded-md hover:bg-blue-600 transition-colors flex items-center text-sm font-bungee"
                >
                  <FiSend className="mr-2" /> Comentar
                </button>
              </div>
            </div>
            <div className="space-y-4 max-h-[30rem] overflow-y-auto custom-scrollbar">
              {generalComments.map((comment) => (
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
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white">
                          {comment.user.username}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                      {user.data.id === comment.userId && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowDropdown(
                                showDropdown === `general-comment-${comment.id}`
                                  ? null
                                  : `general-comment-${comment.id}`
                              )
                            }
                            className="text-gray-400 hover:text-white"
                          >
                            <FiMoreVertical />
                          </button>
                          
                          {showDropdown === 
                            `general-comment-${comment.id}` && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                              <button
                                onClick={() => {
                                  handleEditGeneralComment(
                                    comment.id,
                                    comment.content
                                  );
                                  setShowDropdown(null);
                                }}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <FiEdit className="inline-block mr-2" />
                                Editar
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteGeneralComment(comment.id);
                                  setShowDropdown(null);
                                }}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <FiTrash2 className="inline-block mr-2" />
                                Eliminar
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {editingGeneralCommentId === comment.id ? (
                      <div className="mt-2">
                        <textarea
                          value={editedGeneralCommentContent}
                          onChange={(e) =>
                            setEditedGeneralCommentContent(e.target.value)
                          }
                          className="w-full bg-gray-700 text-white rounded p-2"
                          rows="3"
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() =>
                              handleSaveEditedGeneralComment(comment.id)
                            }
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm mr-2"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingGeneralCommentId(null)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-300">
                        {comment.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {rightSideContent === "notesCourse" && (
          <div className="bg-[#200E3E] p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 font-bungee text-white">
              {t("resource_view.courseNotes")}
            </h3>
            {notes.length === 0 && (
              <div className="mb-4">
                <input
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  placeholder={t("resource_view.addNotePlaceholder1")}
                  className="w-full bg-[#321A5A] text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#9869E3]"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddNote}
                    className="px-4 py-2 bg-[#4B2F7A] font-bungee text-white rounded-md hover:bg-[#6e46b4] transition-colors flex items-center text-xs"
                  >
                    <FiPlus className="mr-2" /> {t("resource_view.addNote")}
                  </button>
                </div>
              </div>
            )}
            <div className="space-y-4 max-h-[30rem] custom-scrollbar-y">
              {notes.map((note, index) => (
                <div
                  key={note.id || index}
                  className="bg-[#321A5A] p-3 rounded-lg shadow-md"
                >
                  {editingNoteId === note.id ? (
                    <div>
                      <input
                        value={editedNoteContent}
                        onChange={(e) => setEditedNoteContent(e.target.value)}
                        className="w-full bg-[#4B2F7A] text-white rounded p-2 mb-2"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleSaveEditedNote(note.id)}
                          className="px-3 py-1 bg-[#9869E3] text-white font-bungee rounded-md hover:bg-[#8A5CD6] transition-colors text-xs"
                        >
                          {t("resource_view.save")}
                        </button>
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="px-3 py-1 bg-gray-500 text-white font-bungee rounded-md hover:bg-gray-600 transition-colors text-xs"
                        >
                          {t("resource_view.cancel")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between mx-2 mb-3">
                        <p className="text-white text-lg font-semibold">
                          {note.content}
                        </p>
                        <div className="space-x-2 flex items-center">
                          <button
                            onClick={handleDownloadNotes}
                            className="text-blue-400 hover:text-blue-600"
                          >
                            <FiDownload />
                          </button>
                          <button
                            onClick={() =>
                              handleEditNote(note.id, note.content)
                            }
                            className="text-[#9869E3] hover:text-[#8A5CD6]"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                      {/* Si ya hay un apunte para este recurso, mostrar un mensaje */}
                      {resourceNotes && resourceNotes.some(note => note.resourceId === resource.id) ? (
                        <div className="text-white text-sm italic mb-2 mx-1">
                          {t("resource_view.resourceNoteExists")}
                        </div>
                      ) : (
                        <div className="flex flex-col items-end">
                          <textarea
                            value={userResourceNote}
                            onChange={(e) => {
                              const newValue = e.target.value.slice(0, 1000);
                              setUserResourceNote(newValue);
                              e.target.style.height = 'auto';
                              e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                            placeholder={t("resource_view.addNotePlaceholder2")}
                            className="w-full bg-[#4B2F7A] text-white rounded-md p-2 mb-2 overflow-hidden resize-none"
                            style={{ minHeight: '100px' }}
                            maxLength={1000}
                          />
                          <div className="flex justify-between w-full mb-2">
                            <span className="text-white text-sm">{`${userResourceNote.length}/1000`}</span>
                            <button
                              onClick={handleAddResourceNote}
                              className="flex items-center justify-center w-24 py-1 bg-[#9869E3] text-white font-bungee rounded-md hover:bg-[#8A5CD6] transition-colors text-xs"
                            >
                              {t("resource_view.addNote")}
                            </button>
                          </div>
                        </div>
                      )}
                      {/* Notas específicas del recurso */}
                      {resourceNotes && resourceNotes.length > 0 ? (
                        resourceNotes
                          .sort((a, b) => a.resourceId - b.resourceId)
                          .map((resourceNote, index) => {
                            // Encuentra el recurso correspondiente
                            const correspondingResource = resources.find(
                              (resource) =>
                                resource.id === resourceNote.resourceId
                            );

                            return (
                              <div
                                key={resourceNote.id || index}
                                className="bg-gray-200 p-3 rounded-lg shadow-md mb-4"
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <p className="font-semibold">
                                    {correspondingResource
                                      ? correspondingResource.title
                                      : `Recurso ${resourceNote.resourceId}`}
                                  </p>
                                  <div className="space-x-2">
                                    <button
                                      onClick={() =>
                                        handleEditResourceNote(
                                          resourceNote.id,
                                          resourceNote.content
                                        )
                                      }
                                      className="text-[#6d4aa5] hover:text-[#a473f3]"
                                    >
                                      <FiEdit2 />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteResourceNote(
                                          resourceNote.id
                                        )
                                      }
                                      className="text-red-600 hover:text-red-400"
                                    >
                                      <FiTrash2 />
                                    </button>
                                  </div>
                                </div>
                                {editingResourceNoteId === resourceNote.id ? (
                                  <div>
                                    <textarea
                                      value={editedResourceNoteContent}
                                      onChange={(e) =>
                                        setEditedResourceNoteContent(
                                          e.target.value
                                        )
                                      }
                                      className="w-full bg-white text-gray-800 rounded p-2 mb-2"
                                      rows="3"
                                    />
                                    <div className="flex justify-end space-x-2">
                                      <button
                                        onClick={() =>
                                          handleSaveEditedResourceNote(
                                            resourceNote.id
                                          )
                                        }
                                        className="px-3 py-1 bg-[#4B2F7A] text-white font-bungee rounded-md hover:bg-[#6e46b4] transition-colors text-xs"
                                      >
                                        {t("resource_view.save")}
                                      </button>
                                      <button
                                        onClick={() =>
                                          setEditingResourceNoteId(null)
                                        }
                                        className="px-3 py-1 bg-gray-500 text-white font-bungee rounded-md hover:bg-gray-600 transition-colors text-xs"
                                      >
                                        {t("resource_view.cancel")}
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <pre className="whitespace-pre-wrap mb-1 font-sans text-sm">
                                    {resourceNote.content}
                                  </pre>
                                )}
                              </div>
                            );
                          })
                      ) : (
                        <p className="text-white italic mb-2">
                          {t("resource_view.noResourceNotes")}
                        </p>
                      )}
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>{formatDate(note.createdAt)}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {notes.length === 0 && (
                <p className="text-white italic">{t("resource_view.noNotes")}</p>
              )}
            </div>
          </div>
        )}
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
              className="absolute top-4 left-2 p-[10px] bg-[#5D4B8A] text-white rounded-full shadow-lg hover:bg-[#3D2A5F] transition-colors"
            >
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <div className="mt-16 p-4">{renderResourceList()}</div>
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
                {t("resource_view.progress")}
              </span>
              <span className="text-sm sm:text-base font-medium text-white font-bungee">
                {currentProgress}%
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-6">
              <div
                className="bg-[#9869E3] h-6 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${currentProgress}%` }}
              ></div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-2/3 bg-[#200E3E] rounded-lg shadow-lg pb-4 mb-4">
              <h1 className="flex justify-center text-2xl font-bungee text-white mb-4">
                {course?.title}
              </h1>
              <div className="mb-4">
                {/* Si el recurso tiene quizzes, entonces evaluamos el estado del quiz */}
                {
                  resource?.quizzes && resource.quizzes.length > 0
                    ? !isQuizStarted // Si hay quizzes, manejamos el estado del quiz
                      ? renderStartQuizView() // Mostrar la vista de inicio del quiz
                      : isQuizCompleted
                      ? renderQuizSummary() // Mostrar resumen del quiz completado
                      : renderQuiz() // Mostrar el quiz en progreso
                    : renderContent(resource?.files) // Si NO hay quizzes, mostramos el contenido del recurso (imagen, archivo, etc.)
                }

                {/* Mostrar error si existe */}
                {error && <p className="text-red-500 text-center">{error}</p>}
              </div>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <img
                    src={course?.image}
                    alt={course?.title}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div className="flex flex-col -mt-2">
                    <h2 className="text-xl font-bungee text-white">
                      {resource.title}
                    </h2>
                    <p className="text-xs font-bungee text-gray-400">
                      {creator?.username}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={handlePrevious}
                    disabled={currentResourceIndex === 0}
                    className={`p-2.5 mr-2 rounded-full transition-colors ${
                      currentResourceIndex === 0
                        ? "bg-[#DDDDDD] text-white cursor-not-allowed"
                        : "bg-[#9869E3] text-white hover:bg-[#8A5CD6]"
                    }`}
                  >
                    <FiChevronLeft size={24} />
                  </button>
                  <button
                    onClick={
                      currentResourceIndex === resources.length - 1
                        ? handleFinishCourse
                        : handleNext
                    }
                    className={`p-2.5 ml-2 rounded-full transition-colors ${
                      currentResourceIndex === resources.length - 1
                        ? "bg-[#9869E3] text-white hover:bg-[#8A5CD6]"
                        : "bg-[#9869E3] text-white hover:bg-[#8A5CD6]"
                    }`}
                  >
                    {currentResourceIndex === resources.length - 1 ? (
                      <>
                        <FiCheckCircle size={24} />
                      </>
                    ) : (
                      <FiChevronRight size={24} />
                    )}
                  </button>
                </div>
              </div>
              <div className="max-w-none text-sm sm:text-base text-white ml-4 mt-4">
                <p>{resource.description}</p>
              </div>
            </div>
            <div className="w-full lg:w-1/3 pt-[52px]">
              {renderRightSideContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
