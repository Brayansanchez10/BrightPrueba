import React, { useEffect, useState, useRef} from "react";
import { useParams, useNavigate } from "react-router-dom";
// Contextos
import { useResourceContext } from "../../../context/courses/resource.contex";
import { useCoursesContext } from "../../../context/courses/courses.context";
import { useAuth } from "../../../context/auth.context";
import { useUserContext } from "../../../context/user/user.context";
import { useCourseProgressContext } from "../../../context/courses/progress.context";
import { useCommentContext } from "../../../context/courses/comment.context";
import { useRatingsContext } from "../../../context/courses/ratings.context";
import { useGeneralCommentContext } from "../../../context/courses/generalComment.context";
import {updateRating, deleteRating,} from "../../../api/courses/ratings.request";
// Importaciones
import NavigationBar from "../NavigationBar";
import {updateComment, deleteComment,} from "../../../api/courses/comment.request";
import {FiChevronLeft,FiChevronRight} from "react-icons/fi";
import {FaCheckCircle,FaTimesCircle} from "react-icons/fa";
import zorro from "../../../assets/img/Zorro.jpeg";
import derechaabajo from "../../../assets/img/DerechaAbajo.jpeg";
import izquierdaarriba from "../../../assets/img/IzquierdaArriba.jpeg";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { completeQuiz } from "../../../api/courses/resource.request";
import { useNotesContext } from "../../../context/courses/notes.context";
import "./resourceView.css";
import { useHorizontalScroll } from "./horizontalScroll.jsx";
import { generateNotesPDF } from "./notesDownload.jsx";
import CommentsSection from "./Funtions/CommentSection.jsx";
import RatingsComponent from "./Funtions/RatingsComponent.jsx";
import GeneralComments from "./Funtions/GeneralComments.jsx";
import CourseNotes from "./Funtions/CourseNotes.jsx";
import ContentResourceView from "./Funtions/ContentResourceView.jsx";
import { generatePremiumCertificatePDF } from "./Funtions/CertificateGenerator.js";
import RatingActions from "./Funtions/HandlesFuntions/RatingActions.jsx";
import CommentActions from "./Funtions/HandlesFuntions/ComentsActions.jsx";
import CourseNotesHandler from "./Funtions/HandlesFuntions/CourseNotesHandler.jsx";
import GeneralCommentsActions from "./Funtions/HandlesFuntions/GeneralCommentsActions.jsx";

export default function ResourceView() {
  const { t } = useTranslation("global");
  const { user } = useAuth();
 
  const [currentProgress, setCurrentProgress] = useState(0);
  const { getUserById } = useUserContext();
  const [username, setUsername] = useState("");
  const { id, courseId } = useParams();
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
  const { getCourse } = useCoursesContext();
  const { getResourceUser, getResource, getUserResourceProgress } = useResourceContext();
  const { getCourseProgress, updateCourseProgress } = useCourseProgressContext();
  const {comments,fetchCommentsByResource,addComment,editComment,removeComment,} = useCommentContext();
  const {ratings,fetchRatingsByResource, addRating,  editRating,  removeRating,} = useRatingsContext();
  const {generalComments,  fetchGeneralComments,  addGeneralComment,  editGeneralComment,  removeGeneralComment,} = useGeneralCommentContext();
  const {notes,resourceNotes,fetchCourseNotes,fetchResourceNotes,addNote,addNoteToResource,editNote,editResourceNote,removeNote,removeResourceNote,} = useNotesContext();
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
  const { handleEditRating, handleSaveEditedRating, handleDeleteRating, handleRatingSubmit, } = RatingActions ({ updateRating, deleteRating, fetchRatingsByResource, id, setEditingRatingId, setEditedRatingScore, setEditedRatingComment, setUserExistingRating, setUserRating, setRatingComment, userRating, ratingComment, userExistingRating, user, addRating, courseId, currentScore, editedRatingComment, editedRatingScore });
  const { handleDeleteComment, handleEditComment, handleSaveEditedComment, handleCommentSubmit } = CommentActions ({editedCommentContent, setEditedCommentContent, setEditingCommentId, updateComment, fetchCommentsByResource, id, deleteComment, addComment, userComment, user, setUserComment, courseId });
  const { handleAddNote, handleAddResourceNote, handleEditNote, handleSaveEditedNote, handleDeleteNote, handleSaveEditedResourceNote, handleDeleteResourceNote, handleEditResourceNote} = CourseNotesHandler ({notes, editingNoteId, userNote, editedNoteContent, resourceNotes, userResourceNote, resources, resource, course, user, setEditingNoteId, setUserNote, setEditedNoteContent, editedResourceNoteContent, setEditedResourceNoteContent, setEditingResourceNoteId, editingResourceNoteId, setUserResourceNote, removeResourceNote, fetchResourceNotes, removeNote, fetchCourseNotes, addNote, courseId, addNoteToResource, editNote, editResourceNote});
  const { handleGeneralCommentSubmit, handleEditGeneralComment, handleSaveEditedGeneralComment, handleDeleteGeneralComment} = GeneralCommentsActions ({generalComments, userGeneralComment, setUserGeneralComment, setEditingGeneralCommentId, editedGeneralCommentContent, setEditedGeneralCommentContent, user, courseId,addGeneralComment, editGeneralComment, fetchGeneralComments, removeGeneralComment });

  useEffect(() => {
    if (courseId) {
      fetchGeneralComments(courseId);
    }
  }, [courseId, fetchGeneralComments]);

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
    if (course?.id && user?.data?.id) {
      fetchCourseNotes(course.id, user.data.id);
    }
  }, [course, user, fetchCourseNotes]);

  useEffect(() => {
    if (course?.id && resource?.id && user?.data?.id) {
      fetchResourceNotes(course.id, resource.id, user.data.id);
    }
  }, [course, resource, user, fetchResourceNotes]);

  useEffect(() => {
    console.log("Apuntes:", notes);
    console.log("Apuntes del recurso:", resourceNotes);
  }, [notes, resourceNotes]);

  // Funciónes relacionadas al manejo de la vista de imagenes, videos y archivos
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

  // Funciones para el manejo de Quizzes: 
  const maxAttempts = resource?.attempts;

  const handleAnswerChange = (questionIndex, selectedAnswer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: selectedAnswer,
    }));
  };

  const handleNextQuestion = async () => {
    if (!answers[currentQuestionIndex]) {
      Swal.fire({icon: "warning",  title: "Advertencia",  text: "Por favor selecciona una respuesta antes de continuar.",  confirmButtonColor: "#3085d6",  confirmButtonText: "OK",});
      return;
    }

    if (currentQuestionIndex === (resource?.quizzes.length || 0) - 1) {
      const correctCount = Object.keys(answers).filter(
        (index) => resource?.quizzes[index]?.correctAnswer === answers[index]
      ).length;

      const incorrectCount = Object.keys(answers).length - correctCount;
      setCorrectAnswers(correctCount);
      setIncorrectAnswers(incorrectCount);
      const scorePercentage = Math.round(
        (correctCount / resource?.quizzes.length) * 100
      );
      setCurrentScore(scorePercentage);
      if (scorePercentage > bestScore) {
        setBestScore(scorePercentage);
      }
      if (attempts + 1 === maxAttempts) {
        setTimeout(() => {
          setIsQuizStarted(false); 
        }, 500);
      }

      try {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        const result = await completeQuiz(user.data.id,resource.id,scorePercentage,newAttempts);
        console.log("Resultado del quiz:", result);
      } catch (error) {
        console.error("Error al completar el quiz:", error);
        Swal.fire({icon: "error", title: "Error",  text: "No se pudo guardar tu progreso.",  confirmButtonColor: "#3085d6",  confirmButtonText: "OK",});}

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
      Swal.fire({icon: "error",title: "Límite de intentos alcanzado",text: "Has alcanzado el número máximo de intentos permitidos.",confirmButtonColor: "#3085d6",confirmButtonText: "OK",});
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
      setBestScore(currentScore); 
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
      const percentagePerResource = 100 / resources.length;
      const newProgress = (currentResourceIndex + 1) * percentagePerResource;
      if (newProgress > currentProgress && currentProgress < 100) {
        await updateCourseProgress(user.data.id, courseId, newProgress);
        setCurrentProgress(newProgress);
      }
      setCurrentResourceIndex(currentResourceIndex + 1);
      handleResourceClick(nextResource.id, nextResource.courseId);
    }
  };

  // Funciones para la descarga de PDF
  const handleFinishCourse = async () => {
    await updateCourseProgress(user.data.id, courseId, 100);
    generatePremiumCertificatePDF(username,course.title,zorro,derechaabajo,izquierdaarriba
    );
    navigate(`/course/${courseId}`);
  };

  const handleDownloadNotes = () => {
    generateNotesPDF(notes, resourceNotes, resources);
  };

  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleResourceClick = (resourceId, courseId) => {
    console.log("Course ID: ", courseId);
    console.log("Resource ID: ", resourceId);
    window.location.href = `/course/${courseId}/resource/${resourceId}`;
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
            <CommentsSection
              comments={comments}
              t={t}
              userComment={userComment}
              setUserComment={setUserComment}
              handleCommentSubmit={handleCommentSubmit}
              user={user}
              editingCommentId={editingCommentId}
              setEditingCommentId={setEditingCommentId}
              editedCommentContent={editedCommentContent}
              setEditedCommentContent={setEditedCommentContent}
              handleEditComment={handleEditComment}
              handleSaveEditedComment={handleSaveEditedComment}
              handleDeleteComment={handleDeleteComment}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
            />
          )}
          {rightSideContent === "ratings" && (
            <RatingsComponent
              ratings={ratings}
              t={t}
              userRating={userRating}
              setUserRating={setUserRating}
              ratingComment={ratingComment}
              setRatingComment={setRatingComment}
              handleRatingSubmit={handleRatingSubmit}
              userExistingRating={userExistingRating}
              formatDate={formatDate}
              editingRatingId={editingRatingId}
              setEditedRatingScore={setEditedRatingScore}
              editedRatingScore={editedRatingScore}
              editedRatingComment={editedRatingComment}
              setEditedRatingComment={setEditedRatingComment}
              handleSaveEditedRating={handleSaveEditedRating}
              handleEditRating={handleEditRating}
              handleDeleteRating={handleDeleteRating}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              setEditingRatingId={setEditingRatingId}
              user={user}
            />
          )}
          {rightSideContent === 'generalComments' && (
              <GeneralComments
                generalComments={generalComments}
                userGeneralComment={userGeneralComment}
                setUserGeneralComment={setUserGeneralComment}
                handleGeneralCommentSubmit={handleGeneralCommentSubmit}
                handleEditGeneralComment={handleEditGeneralComment}
                handleDeleteGeneralComment={handleDeleteGeneralComment}
                editingGeneralCommentId={editingGeneralCommentId}
                setEditingGeneralCommentId={setEditingGeneralCommentId}
                editedGeneralCommentContent={editedGeneralCommentContent}
                setEditedGeneralCommentContent={setEditedGeneralCommentContent}
                handleSaveEditedGeneralComment={handleSaveEditedGeneralComment}
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
                user={user}
                formatDate={formatDate}
              />
          )}
          {rightSideContent === "notesCourse" && (
              <CourseNotes
                notes={notes}
                editingNoteId={editingNoteId}
                userNote={userNote}
                editedNoteContent={editedNoteContent}
                resourceNotes={resourceNotes}
                userResourceNote={userResourceNote}
                resources={resources}
                resource={resource}
                handleAddNote={handleAddNote}
                handleDownloadNotes={handleDownloadNotes}
                handleEditNote={handleEditNote}
                handleDeleteNote={handleDeleteNote}
                handleSaveEditedNote={handleSaveEditedNote}
                setEditingNoteId={setEditingNoteId}
                setUserNote={setUserNote}
                setEditedNoteContent={setEditedNoteContent}
                handleAddResourceNote={handleAddResourceNote}
                handleEditResourceNote={handleEditResourceNote}
                handleDeleteResourceNote={handleDeleteResourceNote}
                editedResourceNoteContent={editedResourceNoteContent}
                setEditedResourceNoteContent={setEditedResourceNoteContent}
                handleSaveEditedResourceNote={handleSaveEditedResourceNote}
                setEditingResourceNoteId={setEditingResourceNoteId}
                editingResourceNoteId={editingResourceNoteId}
                setUserResourceNote={setUserResourceNote}
                formatDate={formatDate}
                t={t}
              />
          )}
      </div>
    );
  };
  
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!resource) return <div>Cargando...</div>;

  return (
    <div className="min-h-screen bg-[#200E3E]">
      <NavigationBar />
        <ContentResourceView 
          isOpen={isOpen}
          toggleSidebar={toggleSidebar}
          currentProgress={currentProgress}
          course={course}
          resource={resource}
          creator={creator}
          error={error}
          currentResourceIndex={currentResourceIndex}
          resources={resources}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          handleFinishCourse={handleFinishCourse}
          renderQuiz={renderQuiz}
          renderContent={renderContent}
          renderStartQuizView={renderStartQuizView}
          renderQuizSummary={renderQuizSummary}
          renderResourceList={renderResourceList}
          renderRightSideContent={renderRightSideContent}
          isQuizStarted={isQuizStarted}
          isQuizCompleted={isQuizCompleted}
          t={t}
        />
    </div>
  );
}