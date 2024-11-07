import React from "react";
import { Button } from "antd";
import { QuizView } from "./quizView.jsx";
import { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from "./resourceUtils.js";

const RenderRightContent = ({
  activeTab,
  handleSubmit,
  title,
  setTitle,
  description,
  setDescription,
  subcategoryId,
  setSubcategoryId,
  type,
  setType,
  selection,
  setSelection,
  link,
  setLink,
  quizzes = [],
  setQuizzes,
  attempts,
  setAttempts,
  errors,
  t,
  image2,
  subCategory,
  handleFileChange,
  onCancel,
}) => {
  // Función para reiniciar todos los campos del formulario
  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setSubcategoryId("");
    setType("file");
    setSelection("file");
    setLink("");
    setQuizzes([]);
    setAttempts(1);
    onCancel();
  };

  // Manejador del envío del formulario
  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <div
      className={`w-full rounded-lg shadow-lg overflow-y-auto bg-white mt-6 ${
        activeTab === "recursos" ? "hidden" : "block"
      } sm:w-1/2 sm:block`}
    >
      <div className="relative w-full h-[125px] bg-gradient-to-r from-[#350b48] to-[#905be8] rounded-t-2xl items-center flex justify-center">
        <h3 className="text-2xl font-bold text-white ml-2">
          {t("CreateResource.FormCreate")}
        </h3>
        <img
          src={image2}
          alt="Imagen de la cabecera"
          className="w-[80x] h-[80px] object-contain mr-2"
        />
      </div>

      <form onSubmit={onSubmit} className="space-y-6 px-4 py-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              {t("UpdateResource.Title")}
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE_LENGTH))}
              className={`mt-1 block w-full px-4 py-2 rounded-lg border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
              required
              maxLength={MAX_TITLE_LENGTH}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              {title.length}/{MAX_TITLE_LENGTH}
            </p>
          </div>

          {/* Selector de subcategoría */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="subcategoryId" className="block text-sm font-medium text-gray-700">
              {t("subCategory.SelectSection")}
            </label>
            <select
              id="subcategoryId"
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
            >
              <option value="">{t("subCategory.SelectSection")}</option>
              {subCategory.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Campo de descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            {t("UpdateResource.Description")}
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={MAX_DESCRIPTION_LENGTH}
            className={`mt-1 block w-full px-4 py-2 rounded-lg border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
            required
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-0">{errors.description}</p>
          )}
          <div className="text-gray-600 text-right mt-1">
            {description.length}/{MAX_DESCRIPTION_LENGTH}
          </div>
        </div>

        {/* Selector de tipo de recurso (archivo o cuestionario) */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            {t("CreateResource.TipeResource")}
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          >
            <option value="file">{t("UpdateResource.Files")}</option>
            <option value="quiz">{t("CreateResource.QuizzTitleModal")}</option>
          </select>
        </div>

        {/* Sección condicional para archivos */}
        {type === "file" && (
          <div className="space-y-4">
            {/* Botones para seleccionar entre archivo y enlace */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setSelection("file")}
                className={`flex-1 px-4 py-2 rounded-lg focus:outline-none ${
                  selection === "file"
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
              >
                {t("CreateResource.UpFile")}
              </button>
              <button
                type="button"
                onClick={() => setSelection("link")}
                className={`flex-1 px-4 py-2 rounded-lg focus:outline-none ${
                  selection === "link"
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
              >
                {t("UpdateResource.LinkVideo")}
              </button>
            </div>

            {/* Área para subir archivo o ingresar enlace */}
            <div className="min-h-[100px]">
              {selection === "file" && (
                <div>
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                    {t("UpdateResource.Files")}
                  </label>
                  <input
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                    className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm file:bg-blue-100 file:border-none file:py-2 file:px-4 file:text-blue-700"
                  />
                </div>
              )}

              {selection === "link" && (
                <div>
                  <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                    {t("CreateResource.VideoLink")}
                  </label>
                  <input
                    type="text"
                    id="link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder={t("UpdateResource.AddLink")}
                    className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sección condicional para cuestionarios */}
        {type === "quiz" && (
          <QuizView
            quizzes={quizzes}
            setQuizzes={setQuizzes}
            errors={errors}
            attempts={attempts}
            setAttempts={setAttempts}
            t={t}
          />
        )}

        {/* Botones de acción */}
        <div className="flex justify-between gap-4 mt-6">
          <Button htmlType="submit" className="bg-green-600 text-white">
            {t("CreateResource.ButtonCreate")}
          </Button>
          <Button onClick={handleCancel} className="bg-red-600 text-white">
            {t("UpdateResource.ButtonCancel")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RenderRightContent;
