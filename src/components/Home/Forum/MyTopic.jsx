import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "antd";
import NavigationBar from "../NavigationBar.jsx";
import { useAuth } from "../../../context/auth.context.jsx";
import { useTranslation } from "react-i18next";
import { useForumTopic } from "../../../context/forum/topic.context.jsx";
import CreateTopicForm from "./TopicComponents/createTopic.jsx";
import UpdateForumTopicForm from "./TopicComponents/updateTopic.jsx";
import { useForumFavorite } from "../../../context/forum/forumFavorite.context.jsx";
import { useUserContext } from "../../../context/user/user.context.jsx";
import { FaSearch, FaUser, FaStopwatch, FaHeart, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import Footer from "../../footer.jsx";

export default function TopicComponent() {
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
        }
      }
    };

    fetchUserData();
  }, [user, getUserById]);

  useEffect(() => {
    fetchForumTopic();
  }, [user, forumCategoryId]);

  const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });

    useEffect(() => {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
  };

  const size = useWindowSize();
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
      return topics.filter(topic => isFavorite(topic.id));
    } else if (activeTab === "myForums") {
      return topics.filter(topic => topic.userId === user.data.id);
    }
    return topics;
  };

  const handleTopicClick = (topicId) => {
    console.log("Tema ID", topicId);
    navigate(`/topic/${topicId}`);
  };

  return (
    <div className="min-h-screen flex flex-col pt-16 bg-primary">
      <NavigationBar />

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 mx-4 sm:mx-6">
        <div className="w-full sm:w-auto mb-4 sm:mb-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-black text-center sm:text-left font-bungee">
            <span className="text-purple-800 dark:text-secondary">Foro</span>{" "}
            <span className="text-primary">de conocimiento</span>
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
              defaultValue="Titulo"
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

      <div className="mx-4 sm:mx-12 mt-8 sm:mb-2 md:mb-0">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:justify-center md:ml-0 lg:justify-start lg:ml-6">
          <button
            className={`px-6 sm:px-10 py-2 rounded-xl sm:rounded-t-xl sm:rounded-b-xl md:rounded-b-none md:rounded-t-2xl font-bungee ${
              activeTab === "forums"
                ? "bg-purple-600 text-white dark:bg-secondary"
                : "bg-slate-300 hover:bg-purple-600 hover:text-white transition-all duration-500"
            }`}
            onClick={() => setActiveTab("forums")}
          >
            Foros
          </button>
          <button
            className={`px-6 sm:px-10 py-2 rounded-xl sm:rounded-t-xl sm:rounded-b-xl md:rounded-b-none md:rounded-t-2xl font-bungee ${
              activeTab === "myFavorites"
                ? "bg-purple-600 text-white dark:bg-secondary"
                : "bg-slate-300 hover:bg-purple-600 hover:text-white transition-all duration-500"
            }`}
            onClick={() => setActiveTab("myFavorites")}
          >
            Mis favoritos
          </button>
          <button
            className={`px-6 sm:px-10 py-2 rounded-xl sm:rounded-t-xl sm:rounded-b-xl md:rounded-b-none md:rounded-t-2xl font-bungee ${
              activeTab === "myForums"
                ? "bg-purple-600 text-white dark:bg-secondary"
                : "bg-slate-300 hover:bg-purple-600 hover:text-white transition-all duration-500"
            }`}
            onClick={() => setActiveTab("myForums")}
          >
            Mis foros
          </button>
        </div>
      </div>

      <div
        className="bg-slate-300 dark:bg-secondary mx-4 mt-4 sm:mx-12 rounded-3xl md:mt-0 mb-4"
        style={{ height: `${containerHeight}px` }}
      >
        <div
          className="my-7 flex flex-col sm:flex-row text-white mx-3 px-1 overflow-y-auto"
          style={{ height: "92%" }}
        >
          <div className="m-2">
            <div className="flex flex-wrap justify-evenly gap-4 w-full">
              {loading ? (
                <div className="text-center py-16">
                  <h2 className="text-3xl font-bold text-gray-700">
                    {t("Topic.topicLoading")}
                  </h2>
                </div>
              ) : filteredTopics().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:grid-cols-3 cursor-pointer">
                  {filteredTopics().map((topic) => (
                    <div
                      key={topic.id}
                      className="bg-[#783CDA] rounded-[14px] p-4 flex flex-col w-[387px] h-[167px] relative"
                      onClick={() => handleTopicClick(topic.id)}
                    >
                      <div className="flex items-start mb-2">
                        <img
                          src={topic.user.userImage || "/placeholder.svg?height=100&width=100"}
                          alt="Imagen del foro"
                          className="w-12 h-12 object-cover rounded-full mr-3"
                        />
                        <div className="flex-grow pr-16">
                          <h2 className="text-white font-bungee text-base line-clamp-1">{topic.title}</h2>
                          <p className="text-white font-sans text-base line-clamp-2 mt-1">{topic.Content}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-auto">
                        <div className="flex items-center text-white">
                          <FaUser className="w-3 h-3 mr-1" />
                          <span className="font-sans text-xs">{topic.user.username}</span>
                        </div>
                        <div className="flex items-center text-white">
                          <FaStopwatch className="w-3 h-3 mr-1" />
                          <span className="font-sans text-xs">Abierto</span>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 flex flex-col items-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavoriteToggle(topic.id);
                          }}
                          className={`mb-1 p-1 rounded-full ${
                            isFavorite(topic.id) ? "bg-red-500" : "bg-white"
                          }`}
                          disabled={favoritesLoading}
                        >
                          <FaHeart
                            className={`w-3 h-3 ${
                              isFavorite(topic.id) ? "text-white" : "text-red-500"
                            }`}
                          />
                        </button>
                        {user.data.id === topic.userId && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(topic);
                              }}
                              className="mb-1 p-1 rounded-full bg-yellow-500"
                            >
                              <FaEdit className="w-3 h-3 text-white" />
                            </button>
                            <button
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
                                  }
                                });
                              }}
                              className="p-1 rounded-full bg-red-500"
                            >
                              <FaTrash className="w-3 h-3 text-white" />
                            </button>
                          </>
                        )}
                      </div>
                
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h2 className="text-3xl font-bold text-gray-700 dark:text-primary">
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
}