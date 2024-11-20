// Importación de para manejar las traducciones
import i18next from "i18next";

// Constantes para validación de recursos
export const MAX_TITLE_LENGTH = 30;
export const MAX_DESCRIPTION_LENGTH = 500;
// Tipos de archivos permitidos para subir
export const ALLOWED_FILE_TYPES = [".pdf", ".jpg", ".jpeg", ".png"];

// Expresiones regulares para validar diferentes tipos de URLs de video
export const URL_REGEX = {
  YOUTUBE: /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:watch\?v=|embed\/|playlist\?list=)|youtu\.be\/)[a-zA-Z0-9_-]{11}(?:\S*)?$/i,
  VIMEO: /^(https?:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)$/i,
  GOOGLE_DRIVE: /^(https?:\/\/)?(drive\.google\.com\/file\/d\/)([a-zA-Z0-9_-]+)(\/[^?]*)(\?.*)?$/i
};

// Función para validar los campos básicos del recurso
export const validateFields = (title, description) => {
  const errors = {};

  // Valida que el título tenga entre 3 y MAX_TITLE_LENGTH caracteres
  if (!title || title.length < 3 || title.length > MAX_TITLE_LENGTH) {
    errors.title = i18next.t("UpdateResource.ValidateTitle", { max: MAX_TITLE_LENGTH });
  }

  // Valida que la descripción tenga al menos 8 caracteres
  if (!description || description.length < 8) {
    errors.description = i18next.t("UpdateResource.ValidateDescription");
  }

  return errors;
};

// Función para validar los cuestionarios asociados al recurso
export const validateQuizzes = (quizzes) => {
  const errors = {};

  // Verifica si quizzes existe y es un array
  if (!quizzes || !Array.isArray(quizzes)) {
    return errors;
  }

  // Valida cada cuestionario individualmente
  quizzes.forEach((quiz, index) => {
    const quizErrors = {};

    // Verifica la existencia del quiz
    if (!quiz) {
      errors[index] = { general: i18next.t("UpdateResource.InvalidQuiz") };
      return;
    }

    // Valida la pregunta del quiz
    if (!quiz.question || quiz.question.length < 3) {
      quizErrors.question = i18next.t("UpdateResource.ValidateQuestion");
    }

    // Valida las opciones de respuesta
    if (!quiz.options || !Array.isArray(quiz.options)) {
      quizErrors.options = i18next.t("UpdateResource.ValidateOptions");
    } else if (quiz.options.length < 2) {
      quizErrors.options = i18next.t("UpdateResource.ValidateOptions");
    } else {
      // Valida que cada opción no esté vacía
      quiz.options.forEach((option, optIndex) => {
        if (!option || option.trim() === "") {
          if (!quizErrors.options) quizErrors.options = {};
          quizErrors.options[optIndex] = i18next.t("UpdateResource.Option");
        }
      });
    }

    // Valida que la respuesta correcta exista y esté entre las opciones
    if (!quiz.correctAnswer || !quiz.options?.includes(quiz.correctAnswer)) {
      quizErrors.correctAnswer = i18next.t("UpdateResource.ValidationAnswer");
    }

    if (Object.keys(quizErrors).length > 0) {
      errors[index] = quizErrors;
    }
  });

  return errors;
};

// Funciones de utilidad para manejo de URLs de video
// Verifica si el archivo es un enlace de video válido
export const isVideoLink = (file) => {
  return (
    URL_REGEX.YOUTUBE.test(file) ||
    URL_REGEX.VIMEO.test(file) ||
    URL_REGEX.GOOGLE_DRIVE.test(file)
  );
};

// Verifica si una URL es válida para cualquiera de las plataformas soportadas
export const isValidLink = (url) => {
  return (
    URL_REGEX.YOUTUBE.test(url) ||
    URL_REGEX.VIMEO.test(url) ||
    URL_REGEX.GOOGLE_DRIVE.test(url)
  );
};

// Convierte una URL normal en una URL de embed para videos
export const getEmbedUrl = (file) => {
  // Convierte URLs de YouTube a formato embed
  if (URL_REGEX.YOUTUBE.test(file)) {
    const videoId = file.includes("youtu.be/")
      ? file.split("youtu.be/")[1].split("?")[0]
      : new URL(file).searchParams.get("v");
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Convierte URLs de Vimeo a formato embed
  if (URL_REGEX.VIMEO.test(file)) {
    const videoId = file.match(URL_REGEX.VIMEO)[4];
    return `https://player.vimeo.com/video/${videoId}`;
  }

  // Convierte URLs de Google Drive a formato preview
  if (URL_REGEX.GOOGLE_DRIVE.test(file)) {
    const fileId = file.match(URL_REGEX.GOOGLE_DRIVE)[3];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  return "";
};

// Función que retorna el estado inicial para un recurso
export const getInitialState = () => ({
  title: "",
  description: "",
  attempts: 1,
  link: "",
  selectedFile: null,
  type: "file",
  selection: "file",
  quizzes: [],
  errors: {},
});