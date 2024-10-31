import React from "react";
import { Button, Card, Collapse } from "antd";
import { EditOutlined, DeleteFilled, FilePdfOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { isVideoLink, getEmbedUrl } from "../components/resourceUtils.js";
import { useTranslation } from "react-i18next";

const { Panel } = Collapse;

const RenderLeftContent = ({
  activeTab,
  subCategory,
  resources,
  openEditModal,
  handleRemoveResource,
  image,
}) => {
  // Hook para traducciones
  const { t } = useTranslation("global");

  return (
    <div
      className={`w-full rounded-lg shadow-lg overflow-y-auto overflow-auto scrollbar-hide mt-6 ${
        activeTab === "crear" ? "block" : "hidden"
      } sm:w-1/2 sm:block`}
      style={{ maxHeight: "700px" }}
    >
      <div className="relative w-full h-[125px] bg-gradient-to-r from-[#350b48] to-[#905be8] rounded-t-2xl flex items-center justify-center">
        <img
          src={image}
          alt="Imagen de la cabecera"
          className="w-[189.69px] h-[148px] object-contain mt-8"
        />
      </div>
      <h3 className="text-xl font-bold mt-6 text-center text-purple-900">
        {t("CreateResource.TitleResources")}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 p-4">
        {subCategory.length > 0 ? (
          // Mapeo de subcategorías
          subCategory.map((subcategory) => {
            // Filtrar recursos por subcategoría
            const filteredResources = resources.filter(
              (resource) => resource.subcategoryId === subcategory.id
            );

            return (
              <div key={subcategory.id} className="mb-6">
                <h2 className="text-xl font-bold mb-4">{subcategory.title}</h2>

                {filteredResources.length > 0 ? (
                  // Collapse para mostrar los recursos
                  <Collapse accordion>
                    {filteredResources.map((resource) => (
                      <Panel
                        header={
                          <div className="flex flex-col lg:flex-row justify-between items-center">
                            <div className="w-full lg:w-3/4 break-words">
                              {resource.title}
                            </div>
                            <div className="flex lg:w-1/4 justify-end mt-2 lg:mt-0">
                              {/* Botón de edición */}
                              <Button
                                icon={<EditOutlined />}
                                onClick={() => openEditModal(resource)}
                                className="bg-yellow-500 text-white hover:bg-yellow-600 mr-2"
                              ></Button>
                              {/* Botón de eliminación con confirmación */}
                              <Button
                                icon={<DeleteFilled />}
                                onClick={() => {
                                  Swal.fire({
                                    title: t("CreateResource.AlertDeleteTitle"),
                                    text: t("CreateResource.AlertDeleteText"),
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#28a745",
                                    cancelButtonColor: "#d35",
                                    confirmButtonText: t("CreateResource.AlertDeleteConfir"),
                                    reverseButtons: true,
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      handleRemoveResource(resource);
                                      Swal.fire({
                                        title: t("CreateResource.AlerteSuccesyDelete"),
                                        text: t("CreateResource.DeleteResource"),
                                        icon: "success",
                                      });
                                    }
                                  });
                                }}
                                className="bg-red-700 text-white hover:bg-red-600"
                              ></Button>
                            </div>
                          </div>
                        }
                        key={resource.id}
                      >
                        {/* Contenido del panel con detalles del recurso */}
                        <Card>
                          <div className="flex justify-between items-center">
                            {/* Renderizado condicional según el tipo de recurso */}
                            {resource.files &&
                            (isVideoLink(resource.files) ||
                              resource.files.endsWith(".pdf") ||
                              /\.(jpg|jpeg|png)$/i.test(resource.files)) ? (
                              <>
                                <div className="w-1/2">
                                  {/* Iframe para videos */}
                                  {isVideoLink(resource.files) ? (
                                    <iframe
                                      src={getEmbedUrl(resource.files)}
                                      frameBorder="0"
                                      style={{
                                        width: "250px",
                                        height: "250px",
                                      }}
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    />
                                  ) : resource.files.endsWith(".pdf") ? (
                                    // Vista para archivos PDF
                                    <div className="text-center">
                                      <div className="flex items-center justify-center mb-4">
                                        <FilePdfOutlined className="text-red-600 text-6xl" />
                                      </div>
                                      <a
                                        href={resource.files}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline text-lg"
                                        download
                                      >
                                        {t("CreateResource.DowloadPDF")}
                                      </a>
                                    </div>
                                  ) : (
                                    // Vista para imágenes
                                    <div className="flex justify-center">
                                      <img
                                        src={resource.files}
                                        alt={`Content ${resource.title}`}
                                        className="max-w-full h-auto"
                                      />
                                    </div>
                                  )}
                                </div>
                                <div className="w-1/2 pl-10">
                                  <p>{resource.description}</p>
                                  {resource.file && (
                                    <p>
                                      {t("UpdateResource.Files")}: {resource.file.name}
                                    </p>
                                  )}
                                </div>
                              </>
                            ) : resource.quizzes && resource.quizzes.length > 0 ? (
                              // Vista para cuestionarios
                              <div className="w-full">
                                <h4 className="text-md font-bold mb-4">
                                  {t("CreateResource.QuizzTitleModal")}
                                </h4>
                                {/* Mapeo de preguntas del cuestionario */}
                                {resource.quizzes.map((quiz, index) => (
                                  <div
                                    key={index}
                                    className="mb-6 p-4 border border-gray-300 rounded-md shadow-sm"
                                  >
                                    <div className="mb-2">
                                      <label className="block text-sm font-semibold text-gray-700">
                                        {t("UpdateResource.Question")}:
                                      </label>
                                      <p className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100">
                                        {quiz.question}
                                      </p>
                                    </div>
                                    <div className="mb-2">
                                      <label className="block text-sm font-semibold text-gray-700">
                                        {t("UpdateResource.labelOption")}:
                                      </label>
                                      {quiz.options.map((option, optIndex) => (
                                        <div
                                          key={optIndex}
                                          className="flex items-center mb-1"
                                        >
                                          <span className="mr-2 text-gray-600">
                                            {String.fromCharCode(65 + optIndex)})
                                          </span>
                                          <p className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100">
                                            {option}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                    {/* Respuesta correcta */}
                                    <div>
                                      <label className="block text-sm font-semibold text-gray-700">
                                        {t("UpdateResource.CorrectAnswer")}:
                                      </label>
                                      <p className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100">
                                        {quiz.correctAnswer}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              // Vista para recursos sin archivos o cuestionarios
                              <p>
                                {t("UpdateResource.labelOption")}:{" "} {resource.description}
                              </p>
                            )}
                          </div>
                        </Card>
                      </Panel>
                    ))}
                  </Collapse>
                ) : (
                  // Mensaje cuando no hay recursos
                  <p>{t("CreateResource.NoResources")}</p>
                )}
              </div>
            );
          })
        ) : (
          // Mensaje cuando no hay subcategorías
          <p>{t("CreateResource.NoResources")}</p>
        )}
      </div>
    </div>
  );
};

export default RenderLeftContent;
