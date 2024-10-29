import React from 'react';
import Swal from 'sweetalert2';

export const QuizView = ({
  quizzes,
  setQuizzes,
  errors,
  attempts,
  setAttempts,
  t
}) => {
  // Maneja los cambios en los campos del cuestionario
  const handleQuizChange = (index, e) => {
    const { name, value } = e.target;
    const updatedQuizzes = [...quizzes];
    
    // Si el campo es una opción, actualiza el array de opciones
    if (name.startsWith("options")) {
      const optionIndex = parseInt(name.split("[")[1].split("]")[0], 10);
      updatedQuizzes[index].options[optionIndex] = value;
    } else {
      // Si no, actualiza otros campos como pregunta o respuesta correcta
      updatedQuizzes[index][name] = value;
    }
    setQuizzes(updatedQuizzes);
  };

  // Agrega una nueva opción a una pregunta específica
  // Límite máximo de 6 opciones por pregunta
  const addOption = (quizIndex) => {
    const updatedQuizzes = [...quizzes];
    if (updatedQuizzes[quizIndex].options.length < 6) {
      updatedQuizzes[quizIndex].options.push("");
      setQuizzes(updatedQuizzes);
    } else {
      // Muestra alerta si se alcanza el límite de opciones
      Swal.fire({
        icon: "warning",
        title: t("CreateResource.MaxOptionsAlert"),
        text: t("CreateResource.MaxOptionsText", { maxOptions: 6 }),
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  // Elimina una opción específica de una pregunta
  // Mantiene mínimo 2 opciones por pregunta
  const removeOption = (quizIndex, optionIndex) => {
    const updatedQuizzes = [...quizzes];
    if (updatedQuizzes[quizIndex].options.length > 2) {
      updatedQuizzes[quizIndex].options.splice(optionIndex, 1);
      setQuizzes(updatedQuizzes);
    }
  };

  // Agrega una nueva pregunta al cuestionario
  // Inicializa con pregunta vacía y dos opciones vacías
  const addQuiz = () => {
    setQuizzes([
      ...quizzes,
      { question: "", options: ["", ""], correctAnswer: "" },
    ]);
  };

  // Elimina una pregunta específica del cuestionario
  const removeQuiz = (index) => {
    setQuizzes(quizzes.filter((_, quizIndex) => quizIndex !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t("CreateResource.QuizzTitleModal")}
      </label>

      {/* Mapeo de cada pregunta del cuestionario */}
      {quizzes.map((quiz, index) => (
        <div key={index} className="mb-6 p-4 border border-gray-300 rounded-lg shadow-sm">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {t("UpdateResource.Question")}
            </label>
            <input
              type="text"
              name="question"
              value={quiz.question}
              onChange={(e) => handleQuizChange(index, e)}
              placeholder={t("UpdateResource.Question")}
              className={`mt-1 block w-full px-4 py-2 rounded-lg border ${
                errors[index]?.question ? "border-red-500" : "border-gray-300"
              } shadow-sm`}
            />
            {errors[index]?.question && (
              <p className="text-red-500 text-sm">{errors[index].question}</p>
            )}
          </div>

          {/* Mapeo de las opciones de respuesta */}
          {quiz.options.map((option, optIndex) => (
            <div key={optIndex} className="flex items-center mb-2">
              <span className="mr-2 text-gray-600">
                {String.fromCharCode(65 + optIndex)})
              </span>
              <input
                type="text"
                name={`options[${optIndex}]`}
                value={option}
                onChange={(e) => handleQuizChange(index, e)}
                placeholder={t("UpdateResource.OptionIndex", { optIndex: optIndex + 1 })}
                className={`mt-1 block w-full px-4 py-2 rounded-lg border ${
                  errors[index]?.options?.[optIndex] ? "border-red-500" : "border-gray-300"
                } shadow-sm`}
              />
              {errors[index]?.options?.[optIndex] && (
                <p className="text-red-500 text-sm">{errors[index].options[optIndex]}</p>
              )}
              {quiz.options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index, optIndex)}
                  className="ml-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                >
                  {t("UpdateResource.DeleteOption")}
                </button>
              )}
            </div>
          ))}

          {/* Botón para agregar nueva opción */}
          <button
            type="button"
            onClick={() => addOption(index)}
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
          >
            {t("UpdateResource.AddOption")}
          </button>

          {/* Selector de respuesta correcta */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("UpdateResource.CorrectAnswer")}
          </label>
          <select
            name="correctAnswer"
            value={quiz.correctAnswer || ""}
            onChange={(e) => handleQuizChange(index, e)}
            className={`mt-1 block w-full px-4 py-2 rounded-lg border ${
              errors[index]?.correctAnswer ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
          >
            <option value="">{t("UpdateResource.SelectOption")}</option>
            {quiz.options.map((option, optIndex) => (
              <option key={optIndex} value={option}>
                {`${String.fromCharCode(65 + optIndex)}) ${option}`}
              </option>
            ))}
          </select>
          {errors[index]?.correctAnswer && (
            <p className="text-red-500 text-sm mt-1">{errors[index].correctAnswer}</p>
          )}

          {/* Botón para eliminar pregunta (visible si hay más de 1 pregunta) */}
          {quizzes.length > 1 && (
            <button
              type="button"
              onClick={() => removeQuiz(index)}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
            >
              {t("CreateResource.DeleteQuestion")}
            </button>
          )}
        </div>
      ))}

      {/* Botón para agregar nueva pregunta */}
      <button
        type="button"
        onClick={addQuiz}
        className="w-full mt-4 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
      >
        {t("CreateResource.AddQuestion")}
      </button>

      <div>
        <label htmlFor="attempts" className="block text-sm font-medium text-gray-700">
          {t("quizz.NumerQuizz")}
        </label>
        <input
          type="number"
          id="attempts"
          value={attempts}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (value >= 1 && value <= 10) {
              setAttempts(value);
            } else if (value < 1) {
              setAttempts(1);
            } else if (value > 10) {
              setAttempts(10);
            }
          }}
          min="1"
          max="10"
          inputMode="numeric"
          className="mt-1 block w-full px-4 py-2 rounded-lg border"
          required
        />
      </div>
    </div>
  );
};
