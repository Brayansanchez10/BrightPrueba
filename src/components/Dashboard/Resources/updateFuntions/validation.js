export const ALLOWED_FILE_TYPES = [".mov", ".docx", ".pdf", ".jpg", ".png"];
export const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:watch\?v=|embed\/|playlist\?list=)|youtu\.be\/)[a-zA-Z0-9_-]{11}(?:\S*)?$/i;
export const VIMEO_URL_REGEX = /^(https?:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)$/i;
export const GOOGLE_DRIVE_URL_REGEX = /^(https?:\/\/)?(drive\.google\.com\/file\/d\/)([a-zA-Z0-9_-]+)(\/[^?]*)(\?.*)?$/i;


// Funcion para validar Link de videos
export const isValidLink = (url) => {
  return (
    YOUTUBE_URL_REGEX.test(url) ||
    VIMEO_URL_REGEX.test(url) ||
    GOOGLE_DRIVE_URL_REGEX.test(url)
  );
};

// Funci+ón para validar los campos del formulario
export const validateFields = (title, description, link, t) => {
  const newErrors = {};

  // Validación del título (mínimo 3 caracteres)
  if (!title || title.length < 3) {
    newErrors.title = t("UpdateResource.ValidateTitle");
  }

  // Validación de la descripción (mínimo 8 caracteres)
  if (!description || description.length < 8) {
    newErrors.description = t("UpdateResource.ValidateDescription");
  }

  // Validación de enlaces si es que se proporcionan
  if (link && !isValidLink(link)) {
    newErrors.link = t("UpdateResource.Validatelink");
  }

  return newErrors;
};

// Función para validar Campos del quizz
export const validateQuizzes = (quizzes, t) => {
  const newErrors = {};

  quizzes.forEach((quiz, index) => {
    const quizErrors = {};

    // Validación de la pregunta
    if (!quiz.question || quiz.question.length < 3) {
      quizErrors.question = t("UpdateResource.ValidateQuestion");
    }

    // Validación de las opciones
    if (quiz.options.length < 2) {
      quizErrors.options = t("UpdateResource.ValidateOptions");
    } else {
      quiz.options.forEach((option, optIndex) => {
        if (!option || option.trim() === "") {
          if (!quizErrors.options) {
            quizErrors.options = {};
          }
          quizErrors.options[optIndex] = t("UpdateResource.Option");
        }
      });
    }

    // Validación de la respuesta correcta
    if (!quiz.correctAnswer || !quiz.options.includes(quiz.correctAnswer)) {
      quizErrors.correctAnswer = t("UpdateResource.ValidationAnswer");
    }

    if (Object.keys(quizErrors).length > 0) {
      newErrors[index] = quizErrors;
    }
  });

  return newErrors;
};

