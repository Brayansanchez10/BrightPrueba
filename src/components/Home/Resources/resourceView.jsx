import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useResourceContext } from "../../../context/courses/resource.contex";
import { useCoursesContext } from '../../../context/courses/courses.context';
import { useAuth } from "../../../context/auth.context";
import { Collapse } from "antd";
import { useUserContext } from "../../../context/user/user.context";
import NavigationBar from "../NavigationBar";
import { FiMenu, FiX } from "react-icons/fi"; // Importamos íconos de react-icons
import jsPDF from 'jspdf';
import zorro from '../../../assets/img/Zorro.jpeg';
import derechaabajo from '../../../assets/img/DerechaAbajo.jpeg';
import izquierdaarriba from '../../../assets/img/IzquierdaArriba.jpeg';
import { Anothershabby_trial } from '../../../Tipografy/Anothershabby_trial-normal';

const { Panel } = Collapse;

const ResourceView = () => {
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
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false); // Controlamos si el menú está abierto o no
  const [currentResourceIndex, setCurrentResourceIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();

  // Fetch resource data on component mount or when `id` or `getResourceUser` changes
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
  }, [id, getResourceUser, resource]); // Dependencias ajustadas

  // Fetch resources when `courseId` changes
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
  }, [courseId]); // Dependencias ajustadas

  useEffect(() => {
    const fetchCourse = async () => {
        try {
          if (courseId) {
            const courseData = await getCourse(courseId);
            setCourse(courseData);
          }
        } catch (error) {
            console.error('Error al obtener la información del curso:', error);
        }
    };

    fetchCourse();
}, [courseId, getCourse]);

  // Fetch user data on component mount or when `user` or `getUserById` changes
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
  }, [user, getUserById]); // Dependencias ajustadas

  // Encuentra el índice del recurso actual en la lista de recursos
  useEffect(() => {
    if (resources.length > 0 && resource) {
      const index = resources.findIndex((r) => r._id === resource._id);
      setCurrentResourceIndex(index);
      updateProgress(index, resources.length);
    }
  }, [resources, resource]);

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
      const videoId = url.match(/[-\w]{25,}/); // Extrae el ID del archivo
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
          <iframe
            title="Video"
            width="100%"
            height="100%"
            src={getEmbedUrl(file)}
            frameBorder="0"
            allowFullScreen
            className="object-cover"
          ></iframe>
        );
      } else if (file.endsWith(".pdf")) {
        return (
          <iframe
            src={file}
            width="100%"
            height="100%"
            title="PDF Viewer"
            className="object-cover"
          ></iframe>
        );
      } else if (file.startsWith("http")) {
        return (
          <img
            src={file}
            alt="Contenido"
            className="w-1/2 h-auto object-cover"
          />
        );
      }
    }
    return <p>No hay contenido disponible</p>;
  };

  const handleAnswerChange = (questionIndex, selectedAnswer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: selectedAnswer,
    }));
  };

  const handleNextQuestion = () => {
    // Si es la última pregunta, finaliza el quiz
    if (currentQuestionIndex === (resource?.quizzes.length || 0) - 1) {
      // Calcular respuestas correctas e incorrectas
      const correctCount = Object.keys(answers).filter(
        (index) => resource?.quizzes[index]?.correctAnswer === answers[index]
      ).length;
      const incorrectCount = Object.keys(answers).length - correctCount;

      setCorrectAnswers(correctCount);
      setIncorrectAnswers(incorrectCount);
      setIsQuizCompleted(true); // Actualiza el estado para mostrar el resumen
    } else {
      // Pasa a la siguiente pregunta
      setCurrentQuestionIndex((prevIndex) =>
        Math.min(prevIndex + 1, (resource?.quizzes.length || 0) - 1)
      );
    }
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const renderQuiz = () => {
    const question = resource?.quizzes[currentQuestionIndex];
    if (!question) return <p>No hay preguntas disponibles.</p>;

    return (
      <div className="quiz-container bg-white rounded-3xl shadow-lg w-[600px] h-[400px] m-0 p-0">
        <h2 className="p-4 bg-purple-500 rounded-t-3xl text-white text-lg">Qestion 1/3</h2>
        <h3 className="font-bold mb-5 text-center pt-2 text-xl">{question.question}</h3>
        {question.options.map((option, index) => (
          <div key={index} className="flex items-center mb-5 mx-10">
            <input
              type="radio"
              id={`question-${currentQuestionIndex}-option-${index}`}
              name={`question-${currentQuestionIndex}`}
              value={option}
              checked={answers[currentQuestionIndex] === option}
              onChange={() => handleAnswerChange(currentQuestionIndex, option)}
              className="mr-2"
            />
            <label
              htmlFor={`question-${currentQuestionIndex}-option-${index}`}
              className={`${
                isQuizCompleted && question.correctAnswer === option
                  ? "text-green-500"
                  : isQuizCompleted &&
                    answers[currentQuestionIndex] === option &&
                    answers[currentQuestionIndex] !== question.correctAnswer
                  ? "text-red-500"
                  : ""
              }`}
            >
              {option}
            </label>
          </div>
        ))}
        <div className="flex justify-between mt-10 mx-10">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Anterior
          </button>
          <button
            onClick={handleNextQuestion}
            className="bg-blue-500 text-white px-4 py-2 rounded"
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
      <div className="quiz-summary bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-2">Quiz Finalizado</h3>
        <p>Preguntas totales: {resource?.quizzes.length}</p>
        <p>Respuestas correctas: {correctAnswers}</p>
        <p>Respuestas incorrectas: {incorrectAnswers}</p>
      </div>
    );
  };

  // Actualiza la barra de progreso
  const updateProgress = (index, total) => {
    if (total > 0) {
      setProgress(((index + 1) / total) * 100);
    }
  };

  // Navega al recurso anterior
  const handlePrevious = () => {
    if (currentResourceIndex > 0) {
      const previousResource = resources[currentResourceIndex - 1];
      handleResourceClick(previousResource._id, previousResource.courseId);
    }
  };

  // Navega al siguiente recurso
  const handleNext = () => {
    if (currentResourceIndex < resources.length - 1) {
      const nextResource = resources[currentResourceIndex + 1];
      handleResourceClick(nextResource._id, nextResource.courseId);
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


  //GenerarPDF 
  const handleFinishCourse = () => {
    generatePremiumCertificatePDF(username, course.title, zorro, derechaabajo, izquierdaarriba);
    navigate(`/course/${courseId}`);
  };

  const generatePremiumCertificatePDF = (username, courseTitle, zorroImage, derechaabajo, izquierdaarriba) => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'cm',
        format: [28, 21.6] // Tamaño A4 en centímetros
    });

    // Fondo blanco
    doc.setFillColor(240, 248, 255);
    doc.rect(0, 0, 28, 21.6, 'F');

    // Añadir imágenes de bordes
    if (izquierdaarriba) {
        doc.addImage(izquierdaarriba, 'JPEG', -1, -1, 10, 10);
    }
    if (derechaabajo) {
        doc.addImage(derechaabajo, 'JPEG', 19, 13, 10, 10);
    }

    // Agregar fuente personalizada
    doc.addFileToVFS('Anothershabby.ttf', Anothershabby_trial);
    doc.addFont('Anothershabby.ttf', 'AnotherShabby', 'normal');
    doc.setFont('AnotherShabby'); // Aplicar fuente personalizada

    // Título del certificado
    doc.setFont('AnotherShabby', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(70);
    doc.text('CONSTANCIA', 14, 4.5, { align: 'center' });

    // Subtítulo
    doc.setFontSize(25);
    doc.setFont('AnotherShabby', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text('De aprendizaje', 18, 5.5, { align: 'center' });

    // Imagen de Zorro
    if (zorroImage) {
        doc.addImage(zorroImage, 'JPEG', 12, 7, 4, 4);
    }

    // Texto de reconocimiento
    doc.setFont('times', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text('ESTE CERTIFICADO SE OTORGA A', 14, 13.0, { align: 'center' });

    // Nombre del usuario
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(65);
    doc.setFont('AnotherShabby', 'normal');
    doc.text(`${username}`, 14, 15.5, { align: 'center' });

    
    // Línea debajo del nombre de usuario
    doc.setLineWidth(0.1); // Grosor de la línea
    doc.setDrawColor(0, 0, 0); // Color negro
    doc.line(6, 16, 22, 16); // Coordenadas de inicio y fin de la línea


    // Título del curso y Texto adicional
    doc.setFont('times', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Por completar exitosamente el curso "${courseTitle}". `, 11, 17.5, { align: 'center' });

    // Texto adicional
    doc.setFont('times', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Gracias por tu dedicación y', 19, 17.5, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('esfuerzo. ¡Sigue aprendiendo y mejorando!', 14, 18.0, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(192, 192, 192);
    doc.text('Este certificado fue generado automáticamente.', 14, 19.5, { align: 'center' });

    // Guardar el PDF
    doc.save(`Certificado_${courseTitle}.pdf`);
  };

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!resource) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-t from-blue-200 via-blue-300 to-blue-400">
      <NavigationBar />
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left */}
        <div className="relative">
          {/* Navegador lateral */}
          <div
            className={`${
              isOpen ? "w-full lg:w-64" : "w-16" // Cambia el ancho cuando está cerrado
            } h-screen bg-gray-300 p-4 lg:p-6 flex lg:flex-col items-center rounded-2xl overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out`}
          >
            {isOpen ? (
              <div className="flex flex-col space-y-6 w-full mt-12">
                {resources.map((resource, index) => (
                  <div
                    key={resource._id}
                    className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() =>
                      handleResourceClick(resource._id, resource.courseId)
                    }
                  >
                    {/* Círculo con número */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white font-bold">
                      {index + 1}
                    </div>

                    {/* Título del recurso */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {resource.title}
                      </h3>
                      {/* Opcional: Agregar más detalles o descripción */}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center w-full mt-12">
                {resources.map((resource, index) => (
                  <div
                    key={resource._id}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white font-bold mb-4 cursor-pointer"
                    onClick={() =>
                      handleResourceClick(resource._id, resource.courseId)
                    }
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botón para mostrar/ocultar el menú */}
          <button
            onClick={toggleSidebar}
            className="absolute top-4 left-4 lg:left-3 z-50 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Middle */}
        <div className="w-full lg:w-7/12 p-4 lg:p-6 flex flex-col space-y-4">
          {/* Controles de navegación y barra de progreso */}
          {/* Barra de progreso y botones */}
          <div className="bg-gray-200 p-4 rounded-t-xl shadow-md mb-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePrevious}
                disabled={currentResourceIndex === 0}
                className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300"
              >
                Atrás
              </button>

              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5 relative">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={currentResourceIndex === resources.length - 1}
                className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300"
              >
                Siguiente
              </button>

              {currentResourceIndex === resources.length - 1 && (
                <button
                  onClick={handleFinishCourse}
                  className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Finalizado
                </button>
              )}
            </div>
          </div>

          <div className="w-full lg:w-12/12 h-[480px] bg-gray-100 p-6 rounded-lg shadow-md overflow-hidden flex items-center justify-center">
            {/* Contenido que puede cambiar */}
            {isQuizCompleted
              ? renderQuizSummary()
              : resource?.quizzes && resource.quizzes.length > 0
              ? renderQuiz()
              : renderContent(resource?.files)}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col space-y-6">
            {/* Contenedor principal para la imagen o ícono y la información */}
            <div className="flex items-start space-x-4">
              <div className="bg-gray-300 w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0">
                {/* Aquí podrías agregar un ícono o imagen si es necesario */}
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
                  {resource.title || "Título del Recurso"}
                </h2>
                <p className="text-gray-600 text-base">
                  Publicado el{" "}
                  {new Intl.DateTimeFormat("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(resource.createdAt))}
                </p>
              </div>
            </div>

            {/* Descripción */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-gray-700 text-base">
                {resource.description || "Descripción del Recurso"}
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="w-full lg:w-4/12 p-4 lg:p-6 flex flex-col space-y-4">
          {/* Primer contenedor */}
          <article className="rounded-2xl bg-white p-6 ring-1 ring-gray-200 shadow-lg flex flex-col items-center">
            <div className="flex items-center justify-center w-20 h-20 bg-indigo-600 text-white rounded-full border-4 border-indigo-700 mb-4">
              <span className="text-3xl">📅</span>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                <a
                  href="#"
                  className="hover:text-indigo-700 transition-colors duration-300"
                >
                  Aportes Próximamente
                </a>
              </h3>
              <p className="text-base text-gray-700">
                Mantente atento a nuestras próximas actualizaciones y eventos.
              </p>
            </div>
          </article>

          {/* Segundo contenedor */}
          <div className="bg-white p-6 rounded-2xl shadow-lg ring-1 ring-gray-200 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center w-20 h-20 bg-indigo-600 text-white rounded-full border-4 border-indigo-700 mb-4">
              <span className="text-3xl">📅</span>
            </div>
            <div className="text-xl font-semibold text-gray-800 mb-2">
              Notas Próximamente
            </div>
            <p className="text-base text-gray-700 text-center">
              Mantente atento a nuestras próximas actualizaciones y eventos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceView;
