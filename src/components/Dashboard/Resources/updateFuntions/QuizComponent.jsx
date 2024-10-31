import React from "react";
import { Button } from "antd";


const QuizComponent = ({
  quiz,
  addQuiz,
  index,
  handleQuizChange,
  addOption,
  removeOption,
  removeQuiz,
  errors,
  t,
}) => {
  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-sm mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t("UpdateResource.Question")}
      </label>
      <input
        type="text"
        name="question"
        value={quiz.question}
        onChange={(e) => handleQuizChange(index, e)}
        placeholder={t("UpdateResource.Question")}
        className={`mb-2 block w-full px-4 py-2 rounded-lg border shadow-sm ${
          errors[index]?.question ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors[index]?.question && (
        <p className="text-red-500 text-sm">{errors[index].question}</p>
      )}

      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t("UpdateResource.labelOption")}
      </label>
      {quiz.options.map((option, optIndex) => (
        <div key={optIndex} className="flex items-center mb-2">
          <input
            type="text"
            name={`options[${optIndex}]`}
            value={option}
            onChange={(e) => handleQuizChange(index, e)}
            placeholder={t("UpdateResource.OptionIndex", {
              optionNumber: optIndex + 1,
            })}
            className={`mr-2 px-4 py-2 rounded-lg border shadow-sm w-full ${
              errors[index]?.options?.[optIndex]
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors[index]?.options?.[optIndex] && (
            <p className="text-red-500 text-sm">
              {errors[index].options[optIndex]}
            </p>
          )}
          <button
            type="button"
            onClick={() => removeOption(index, optIndex)}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
          >
            {t("UpdateResource.DeleteOption")}
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => addOption(index)}
        className="bg-green-700 text-white px-3 py-1 rounded-md hover:bg-blue-600"
      >
        {t("UpdateResource.AddOption")}
      </button>

      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("UpdateResource.CorrectAnswer")}
        </label>
        <select
          name="correctAnswer"
          value={quiz.correctAnswer || ""}
          onChange={(e) => handleQuizChange(index, e)}
          className={`mt-1 block w-full px-4 py-2 rounded-lg border ${
            errors[index]?.correctAnswer ? "border-red-500" : "border-gray-300"
          } shadow-sm`}
        >
          <option value="">{t("UpdateResource.SelectOption")}</option>
          {quiz.options.map((option, optIndex) => (
            <option key={optIndex} value={option}>
              {`${String.fromCharCode(65 + optIndex)}) ${option}`}
            </option>
          ))}
        </select>
        {errors[index]?.correctAnswer && (
          <p className="text-red-500 text-sm mt-1">
            {errors[index].correctAnswer}
          </p>
        )}

        <button type="button" onClick={() => removeQuiz(index)} className="mt-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600" >
            {t("CreateResource.DeleteQuestion")}
        </button>
      
      </div>
    </div>
  );
};

export default QuizComponent;
