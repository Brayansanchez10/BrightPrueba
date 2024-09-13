import React, { useEffect, useState } from "react";
import NavigationBar from "../NavigationBar";
import { useResourceContext } from "../../../context/courses/resource.contex";
import { useAuth } from "../../../context/auth.context";
import { useParams } from "react-router-dom";

const ResourceView = () => {
  const { user } = useAuth();
  const { id, courseId } = useParams(); // Obtén el ID del parámetro de la URL
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const { getResourceUser, getResource } = useResourceContext();
  const [resources, setResources] = useState([]); // Agrega estado para los recursos

  useEffect(() => {
    const fetchResource = async () => {
      setLoading(true); // Establece el estado de carga en verdadero
      try {
        if (id) {
          const resourceData = await getResourceUser(id);
          setResource(resourceData);
        } else {
          setError("ID de recurso no proporcionado");
        }
      } catch (error) {
        console.error("Error al obtener la información del recurso:", error);
        setError("Error al obtener la información del recurso.");
      }
      setLoading(false); // Establece el estado de carga en falso
    };

    fetchResource();
  }, [id, getResourceUser]);


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
            className="w-full h-full object-cover"
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
      <div className="quiz-container bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-4">{question.question}</h3>
        {question.options.map((option, index) => (
          <div key={index} className="flex items-center mb-2">
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
        <div className="flex justify-between mt-4">
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

  if (loading) return <div>Cargando recurso...</div>;
  if (error) return <div>{error}</div>;

  return (
  <div className="min-h-screen bg-gradient-to-t from-blue-200 via-blue-300 to-blue-400">
    <NavigationBar />

    <div className="flex flex-col lg:flex-row overflow-hidden">
      {/* Left */}
      <div className="w-full lg:w-1/12 h-36 lg:h-screen bg-gray-300 p-4 lg:p-6 flex lg:flex-col items-center rounded-2xl overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto custom-scrollbar space-x-4 lg:space-x-0 lg:space-y-4">
        {Array(12).fill().map((_, index) => (
          <div
            key={index}
            className="w-16 h-16 bg-white rounded-full flex-shrink-0"
          ></div>
        ))}
      </div>

      {/* Middle */}
      <div className="w-full lg:w-7/12 p-4 lg:p-6 flex flex-col space-y-4">
        <div className="flex-grow bg-gray-100 p-6 rounded-lg shadow-md overflow-hidden">
          {isQuizCompleted
            ? renderQuizSummary()
            : resource?.quizzes && resource.quizzes.length > 0
            ? renderQuiz()
            : renderContent(resource?.files)}
        </div>

        <div className="bg-gray-200 p-6 rounded-2xl mt-4 shadow-lg">
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
                Publicado el {new Intl.DateTimeFormat('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
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
