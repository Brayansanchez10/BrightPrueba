import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "antd";
import NavigationBar from "../NavigationBar.jsx";
import { useAuth } from "../../../context/auth.context.jsx";
import { useTranslation } from "react-i18next";
import { AiOutlineLike } from "react-icons/ai";
import { useForumTopic } from "../../../context/forum/topic.context.jsx";
import CreateTopicForm from "./TopicComponents/createTopic.jsx";
import UpdateForumTopicForm from "./TopicComponents/updateTopic.jsx";
import { useForumFavorite } from "../../../context/forum/forumFavorite.context.jsx";
import { useUserContext } from "../../../context/user/user.context.jsx";
import { EditOutlined, DeleteFilled } from "@ant-design/icons";
import { FcLike } from "react-icons/fc";
import { FaChevronRight, FaSearch, FaUser, FaStopwatch  } from "react-icons/fa";
import Swal from "sweetalert2";
import Footer from "../../footer.jsx";
import Hola from "../../../assets/img/hola.png";

const TopicComponent = () => {
  const { t } = useTranslation("global");
  const { forumCategoryId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getForumTopicByCategoryId, deleteForumTopic } = useForumTopic([]);
  const [topics, setTopics] = useState([]);
  const [createTopicForm, setCreateTopicForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updateTopicForm, setUpdateTopicForm] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [username, setUsername] = useState("");
  const { getUserById } = useUserContext();
  const [profileImage, setProfileImage] = useState(null);
  const [previewProfileImage, setPreviewProfileImage] = useState(null);
  const {
    favorites,
    toggleForumFavorites,
    loading: favoritesLoading,
  } = useForumFavorite();
  const [activeTab, setActiveTab] = useState("forums");

  const fetchForumTopic = async () => {
    if (user && user.data && user.data.id) {
      try {
        const fetchedTopics = await getForumTopicByCategoryId(forumCategoryId);
        setTopics(fetchedTopics || []);
      } catch (error) {
        console.error("Error al obtener todas las categorías del Foro", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.data && user.data.id) {
        try {
          const userData = await getUserById(user.data.id);
          setUsername(userData.username);
          if (userData.userImage && userData.userImage !== "null") {
            setPreviewProfileImage(userData.userImage);
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
          setError("Error al obtener datos del usuario.");
        }
      }
    };

    fetchUserData();
  }, [user, getUserById]);

  useEffect(() => {
    fetchForumTopic();
  }, [user, forumCategoryId]);

  // Hook personalizado para obtener el tamaño de la ventana
  const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });

    useEffect(() => {
      // Función que se ejecuta cuando cambia el tamaño de la ventana
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      // Establecemos el tamaño inicial de la ventana
      handleResize();

      // Añadimos el listener para detectar cambios en el tamaño de la ventana
      window.addEventListener("resize", handleResize);

      // Limpiamos el listener cuando el componente se desmonta
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
  };

  // Obtenemos el tamaño actual de la ventana
  const size = useWindowSize();

  // Establecemos la altura del contenedor en función de la altura de la pantalla
  const containerHeight = size.height ? size.height * 0.66 : "auto";

  const handleCreateTopicForm = () => {
    setCreateTopicForm(true);
  };

  const openEditModal = (topic) => {
    setSelectedTopic(topic);
    setUpdateTopicForm(true);
  };

  const handleFavoriteToggle = async (topicId) => {
    await toggleForumFavorites(topicId);
    // Refresca la lista de temas después de modificar los favoritos
    const fetchedTopics = await getForumTopicByCategoryId(forumCategoryId);
    setTopics(fetchedTopics || []);
  };


  const isFavorite = (topicId) =>
    favorites.some((favorite) => favorite.topicId === topicId);

  const handleRemove = async (topic) => {
    try {
      await deleteForumTopic(topic.id);
      Swal.fire({
        icon: "success",
        title: t("Topic.topicDelete"),
        showConfirmButton: false,
        timer: 700,
      });
      fetchForumTopic();
    } catch (error) {
      console.error("Error al eliminar el recurso:", error);
      Swal.fire({
        icon: "error",
        title: t("Topic.topicDeleteError"),
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };

  const filteredTopics = () => {
    if (activeTab === "myFavorites") {
      return topics.filter(topic => isFavorite(topic.id)); // Filtra los favoritos
    } else if (activeTab === "myForums") {
      return topics.filter(topic => topic.userId === user.data.id); // Filtra los temas creados por el usuario
    }
    return topics; // Muestra todos los foros por defecto
  };

  const handleTopicClick = (topicId) => {
    console.log("Tema ID", topicId);
    navigate(`/topic/${topicId}`);
  };

  return (
    <div className="min-h-screen flex flex-col pt-16 bg-gray-100">
      <NavigationBar />

       {/* Título y barra de búsqueda */}
       <div className="flex flex-col sm:flex-row justify-between items-center mt-6 mx-4 sm:mx-6">
        <div className="w-full sm:w-auto mb-4 sm:mb-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-black text-center sm:text-left font-bungee">
                <span className="text-purple-800">Foro</span> de conocimiento
            </h1>
        </div>
        <div className="block flex-col sm:flex-row items-center w-full sm:w-auto space-y-4 sm:space-y-0 sm:space-x-4 mt-8 sm:mt-0 lg:flex">
          {activeTab === "myForums" && (
                <Button
                    className="bg-purple-800 text-white font-bold text-xl py-5 px-6 rounded-1xl min-w-[160px] shadow-md shadow-gray-400 font-bungee hidden lg:flex"
                    onClick={handleCreateTopicForm}
                >
                    {t("CREAR FORO")}
                </Button>
            )}
            <div className="flex items-center px-4 py-2 border bg-white border-gray-300 rounded-xl shadow-md">
                <FaSearch size={"18px"} className="mr-2" />
                <input
                    type="search"
                    className="outline-none w-full sm:w-[220px] md:w-[280px] lg:w-[360px] xl:w-[420px]"
                    placeholder={t("coursesComponent.search_placeholder")}
                    value="Titulo"
                />
            </div>
          {activeTab === "myForums" && (
            <div className="flex">
              <Button
                    className="m-auto my-1 bg-purple-800 text-white font-bold text-xl py-5 px-6 rounded-1xl min-w-[160px] shadow-md shadow-gray-400 font-bungee lg:hidden"
                    onClick={handleCreateTopicForm}
                >
                    {t("CREAR FORO")}
              </Button>
            </div>
            
          )}
        </div>
     </div>

      {/* Botones de pestañas */}
      <div className="mx-4 sm:mx-12 mt-8 sm:mb-2 md:mb-0">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:justify-center md:ml-0 lg:justify-start lg:ml-6">
          <button
            className={`px-6 sm:px-10 py-2 rounded-xl sm:rounded-t-xl sm:rounded-b-xl md:rounded-b-none md:rounded-t-2xl font-bungee ${activeTab === "forums" ? "bg-purple-600 text-white" : "bg-slate-300 hover:bg-purple-600 hover:text-white transition-all duration-500"}`}
            onClick={() => setActiveTab("forums")}
          >
            Foros
          </button>
          <button
            className={`px-6 sm:px-10 py-2 rounded-xl sm:rounded-t-xl sm:rounded-b-xl md:rounded-b-none md:rounded-t-2xl font-bungee ${activeTab === "myFavorites" ? "bg-purple-600 text-white" : "bg-slate-300 hover:bg-purple-600 hover:text-white transition-all duration-500"}`}
            onClick={() => setActiveTab("myFavorites")}
          >
            Mis favoritos
          </button>
          <button
            className={`px-6 sm:px-10 py-2 rounded-xl sm:rounded-t-xl sm:rounded-b-xl md:rounded-b-none md:rounded-t-2xl font-bungee ${activeTab === "myForums" ? "bg-purple-600 text-white" : "bg-slate-300 hover:bg-purple-600 hover:text-white transition-all duration-500"}`}
            onClick={() => setActiveTab("myForums")}
          >
            Mis foros
          </button>
        </div>
      </div>

      <div
        className="bg-slate-300 mx-4 mt-4 sm:mx-12 rounded-3xl md:mt-0 mb-4"
        style={{ height: `${containerHeight}px` }}
      >
        <div 
          className="my-7 flex flex-col sm:flex-row text-white mx-3 px-1 overflow-y-auto"
          style={{ height: "92%" }}
        >
          {/* Contenido de los temas */}
          <div className="m-2">
            <div className="flex flex-wrap justify-evenly gap-4 w-full">
              {loading ? (
                <div className="text-center py-16">
                  <h2 className="text-3xl font-bold text-gray-700">
                    {t("Topic.topicLoading")}
                  </h2>
                </div>
              ) : filteredTopics().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:grid-cols-3  cursor-pointer">
                  {filteredTopics().map((topic) => (
                    <div
                    key={topic.id}
                    className="bg-purple-800 text-white p-6 rounded-lg shadow-lg w-full "
                    onClick={() => handleTopicClick(topic.id)}
                  >
                    <div className="items-start block md:flex">
                      <div>
                        {/* Sección de la imagen del creador y el título */}
                        <div className="flex items-center mt-4">
                          {previewProfileImage ? (
                            <img
                              src={previewProfileImage}
                              alt={previewProfileImage}
                              className="w-16 h-16 rounded-full border-2 border-white mr-4" // Aumenta el tamaño de la imagen y agrega margen
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center border-2 border-white mr-4">
                              <svg
                                className="w-8 h-8 text-gray-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M10 3a7 7 0 100 14 7 7 0 000-14zm0 2a5 5 0 110 10 5 5 0 010-10z" />
                              </svg>
                            </div>
                          )}
                          <h3 className="text-2xl font-semibold text-white block">
                            {topic.title}
                          </h3>
                        </div>
                        
                        <p className="hidden col-span-5 m-2 md:block xl:col-span-5">{topic.Content}</p>
                        <div className="flex gap-10">
                          <div className="flex items-center mt-2 w-1/2">
                            <FaUser className="mr-2" /> {/* Icono del usuario */}
                            <p className="text-white">{topic.user.username}</p>
                          </div>
                            <div className="flex items-center mt-2">
                              <FaStopwatch className="mr-2"/>
                              <p>Abierto</p>
                            </div>
                        </div>
                      </div>
                  
                      {/* Botones de acciones (editar, eliminar, favoritos) */}
                      <div className="flex sm:block lg:flex gap-3 space-y-3 m-auto">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavoriteToggle(topic.id);
                          }}
                          icon={
                            isFavorite(topic.id) ? (
                              <FcLike className="w-full h-8 hover:h-4 duration-700 transition-all bg-white rounded-md hover:bg-transparent" />
                            ) : (
                              <FcLike className="h-4 w-full hover:h-8 duration-700 transition-all hover:bg-white rounded-md"/>
                            )
                          }
                          className="bg-transparent border-none focus:outline-none mt-auto"
                          disabled={favoritesLoading}
                        />
                        {user && user.data && user.data.id === topic.userId && (
                          <>
                            <Button
                              icon={<EditOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(topic);
                              }}
                              className="text-yellow-500 hover:text-yellow-600"
                            />
                            <Button
                              icon={<DeleteFilled />}
                              onClick={(e) => {
                                e.stopPropagation();
                                Swal.fire({
                                  title: t("Topic.alertDelete"),
                                  text: t("Topic.texAlertDelete"),
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonColor: "#28a745",
                                  cancelButtonColor: "#d33",
                                  confirmButtonText: t("Topic.yesDelete"),
                                  cancelButtonText: t("Topic.buttonCancel"),
                                  reverseButtons: true,
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    handleRemove(topic);
                                    Swal.fire({
                                      title: t("Topic.topicDelete"),
                                      icon: "success",
                                    });
                                  }
                                });
                              }}
                              className="text-red-500 hover:text-red-600"
                            />
                          </>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mt-2">{topic.content}</p>
                  </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h2 className="text-3xl font-bold text-gray-700">
                    {t("Topic.noTopic")}
                  </h2>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-10">
        <Footer />
      </div>
      
      <CreateTopicForm
        visible={createTopicForm}
        onClose={() => setCreateTopicForm(false)}
        forumCategoryId={forumCategoryId}
        onCreate={() => {
          setCreateTopicForm(false);
          fetchForumTopic();
        }}
      />

      <UpdateForumTopicForm
        visible={updateTopicForm}
        onClose={() => setUpdateTopicForm(false)}
        forumCategoryId={forumCategoryId}
        TopicData={selectedTopic}
        onUpdate={() => {
          setUpdateTopicForm(false);
          fetchForumTopic();
        }}
      />
    </div>
  );
};

export default TopicComponent;
