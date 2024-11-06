import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { BsFillReplyFill } from "react-icons/bs";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { EditOutlined, DeleteFilled } from "@ant-design/icons";
import { FaBookBookmark } from "react-icons/fa6";
import { Button } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth.context.jsx";
import NavigationBar from "../NavigationBar.jsx";
import { useTranslation } from "react-i18next";
import { useForumTopic } from "../../../context/forum/topic.context.jsx";
import { useForumComments } from "../../../context/forum/forumComments.context.jsx";
import { useAnswers } from "../../../context/forum/answers.context.jsx";
// Importamos modales de creación
import CreateCommentsComponent from "./CommentComponents/CreateComponents.jsx";
import CreateAnswersComponents from "./answersComponent.jsx/CreateAnswerForm.jsx";
// Modales de edición
import UpdateForumCommntsForm from "./CommentComponents/EditComponents.jsx";
import UpdateAnswersForm from "./answersComponent.jsx/updateAnswerForm.jsx";

// Likes y marcador
import { useLikes } from "../../../context/forum/likes.context.jsx";
import { useBookMark } from "../../../context/forum/bookmark.context.jsx";
import { useForumFavorite } from "../../../context/forum/forumFavorite.context.jsx";

import Footer from "../../footer.jsx";
import Logo from "../../../assets/img/hola.png";
import "../Resources/resourceView.css"

const TopicViewComponente = () => {
  const { t } = useTranslation("global");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [topic, setTopic] = useState({});
  const { topicId } = useParams();
  const [comments, setComments] = useState([]);
  const { getTopicById } = useForumTopic();
  const { getCommentsByTopic } = useForumComments();
  const { getAnswersByComment } = useAnswers();
  const [answersByComment, setAnswersByComment] = useState({});

  const { likes, toggleLikes, loading: likesLoading } = useLikes();
  const { bookmark, toggleBookmark, loading: bookmarkLoading } = useBookMark();

  const [selectComment, setSelectComment] = useState(null);
  const [updateCommentForm, setUpdateCommentForm] = useState(false);
  const [selectAnswer, setSelectAnswer] = useState(null);
  const [updateAnswerForm, setUpdateAnswerForm] = useState(false);

  const [createComment, setCreateComment] = useState(false);
  const [createAnswer, setCreateAnswer] = useState(false);

  const [bookmarkedComments, setBookmarkedComments] = useState([]);
  const { favorites, loading, toggleForumFavorites } = useForumFavorite(); // Accede al contexto
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    if (favorites.length > 0) {
      // Obtener los detalles completos de cada foro favorito
      const fetchForumDetails = async () => {
        try {
          const fetchedTopics = await Promise.all(
            favorites.map(async (fav) => {
              // Aquí deberías obtener los detalles completos del foro
              const topicDetails = await getTopicById(fav.topicId);
              return topicDetails;
            })
          );
          setTopics(fetchedTopics); // Guarda los foros completos
        } catch (error) {
          console.error("Error fetching forums:", error);
        }
      };
      fetchForumDetails();
    }
  }, [favorites]);

  const fetchForumTopic = async () => {
    if (user && user.data && user.data.id) {
      try {
        const fetchedTopic = await getTopicById(topicId);
        setTopic(fetchedTopic);

        const fetchedComments = await getCommentsByTopic(topicId);
        setComments(fetchedComments);

        const allAnswers = {};
        for (const comment of fetchedComments) {
          const answers = await getAnswersByComment(comment.id);
          allAnswers[comment.id] = answers;
        }
        setAnswersByComment(allAnswers);
      } catch (error) {
        console.error("Error al obtener el tema", error);
      }
    }
  };

  useEffect(() => {
    fetchForumTopic();
  }, [user, topicId]);

  const handleCreateFormComments = () => {
    setCreateComment(true);
  };
  const handleCreateFormAnswers = (commentId) => {
    setCreateAnswer({ visible: true, commentId });
  };

  const openEditCommentsModal = (comment) => {
    setSelectComment(comment);
    setUpdateCommentForm(true);
  };

  const openEditAnswersModal = (answer) => {
    setSelectAnswer(answer);
    setUpdateAnswerForm(true);
  };

  const handleLikeToggle = async (commentsId) => {
    await toggleLikes(commentsId);
  };
  const handleBookmarkToggle = async (commentId) => {
    await toggleBookmark(commentId);
    // Actualiza el estado de comentarios marcados
    const updatedBookmarks = bookmark.map((fav) => fav.commentId); // Asegúrate de obtener todos los comentarios marcados
    setBookmarkedComments(updatedBookmarks);
  };

  const handleFavoriteToggle = async (topicId) => {
    await toggleForumFavorites(topicId);
    const fetchedTopics = favorites.map((fav) => fav.topicId);
    setTopics(fetchedTopics); // Asegúrate de que los topics se actualicen
  };

  const handleTopicClick = (topicId) => {
    console.log("Tema ID", topicId); // Esto es solo para verificar el ID
    navigate(`/topic/${topicId}`); // Redirige a la página del foro con el ID
  };

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
  const containerHeight = size.height ? size.height * 0.82 : "auto";

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavigationBar />

      <div className="py-16 inline-flex">
        <div className="flex-grow m-5 bg-white rounded-lg shadow-md w-2/3 overflow-y-auto custom-scrollbar-x" style={{ height: `${containerHeight}px` }}>
          <div className="flex-grow m-5">
            <div className="border-b pb-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-800">
                {topic.title}
              </h1>
              <p className="text-gray-600">{topic.Content}</p>
            </div>
            <Button
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition"
              onClick={() => handleCreateFormComments()}
            >
              {t("topicView.topicComment")}
            </Button>

            <h2 className="text-xl font-semibold mt-6 mb-4">
              {t("topicView.comments")}
            </h2>
            <div className="comments-section space-y-4">
              {Array.isArray(comments) && comments.length > 0 ? (
                comments.map((comment) => {
                  const isLiked = likes.some(
                    (like) => like.commentsId === comment.id
                  );
                  const isBookmarked = bookmark.some(
                    (fav) => fav.commentId === comment.id
                  );

                  return (
                    <div
                      key={comment.id}
                      className="p-4 bg-white border border-gray-300 rounded-lg shadow hover:shadow-lg transition mb-4"
                    >
                      <p className="text-gray-800">{comment.content}</p>
                      <small className="text-gray-500 block mt-1">
                        {t("Creador")}: {comment.user.username}
                      </small>

                      <div className="flex space-x-2 mt-2">
                        <Button
                          className="text-blue-500 hover:underline"
                          onClick={() => handleCreateFormAnswers(comment.id)}
                          icon={<BsFillReplyFill />}
                        >
                          Responder
                        </Button>
                        <Button
                          onClick={() => handleLikeToggle(comment.id)}
                          className="flex items-center"
                          icon={
                            isLiked ? (
                              <AiFillLike color="blue" />
                            ) : (
                              <AiOutlineLike />
                            )
                          }
                          disabled={likesLoading}
                        >
                          {isLiked ? "Me gusta" : "Me gusta"}
                        </Button>
                        <Button
                          onClick={() => handleBookmarkToggle(comment.id)}
                          className="flex items-center"
                          icon={
                            <FaBookBookmark
                              color={isBookmarked ? "orange" : "gray"}
                            />
                          }
                          disabled={bookmarkLoading}
                        >
                          {isBookmarked ? "Guardado" : "Guardar"}
                        </Button>

                        {user &&
                          user.data &&
                          user.data.id === comment.userId && (
                            <Button
                              onClick={() => openEditCommentsModal(comment)}
                              className="text-red-600"
                            >
                              Editar
                            </Button>
                          )}
                      </div>

                      {answersByComment[comment.id] &&
                      answersByComment[comment.id].length > 0 ? (
                        <div className="answers-section mt-4 ml-4 space-y-2">
                          {answersByComment[comment.id].map((answer) => (
                            <div
                              key={answer.id}
                              className="p-2 bg-gray-100 border-l-4 border-purple-700 rounded-lg shadow mt-2"
                            >
                              <p>{answer.content}</p>
                              <small className="text-gray-500">
                                {t("Creador")}: {answer.user.username}
                              </small>

                              {user &&
                                user.data &&
                                user.data.id === answer.userId && (
                                  <Button
                                    onClick={() => openEditAnswersModal(answer)}
                                    className="text-red-600 block"
                                  >
                                    Editar
                                  </Button>
                                )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">{t("No respuestas")}</p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">{t("noComments")}</p>
              )}
            </div>
          </div>

        </div>

        <div className="w-1/4 m-5 bg-white rounded-lg shadow-md hidden xl:block" style={{ height: `${containerHeight}px` }}>

          <div className="m-4 rounded-md shadow-md h-2/5 overflow-y-auto custom-scrollbar-x">
            <h2 className="text-xl mx-3">Comentarios marcados</h2>
            {bookmark.length > 0 ? (
              <div className="space-y-2 mx-3 pb-2">
                {bookmark.map((fav) => {
                  const comment = comments.find((c) => c.id === fav.commentId);
                  return comment ? (
                    <div
                      key={comment.id}
                      className="p-2 bg-gray-100 border-l-4 border-purple-700 rounded-lg shadow mt-2"
                    >
                      <p>{comment.content}</p>
                      <small className="text-gray-500">
                        {t("Creador")}: {comment.user.username}
                      </small>
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <div className="pb-3">
                <div className="bg-secondary p-3 rounded-lg shadow-lg mx-12">
                  <img className="h-28 mb-4 mx-auto" src={Logo} alt="Logo" />
                  <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-primary">
                    No tienes ningun comentario marcado
                  </h2>
                  <p className="text-center text-gray-600 dark:text-primary text-sm sm:text-base md:text-lg lg:text-xl">
                    Marca comentarios de tu interes
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="m-4 rounded-md shadow-md h-1/2 overflow-y-auto custom-scrollbar-x">
            <h2 className="text-xl mx-3">Foros favoritos</h2>

            {topics.length > 0 ? (
              <div className="space-y-2 mx-3 pb-2">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-2 bg-gray-100 border-l-4 border-purple-700 rounded-lg shadow mt-2 cursor-pointer"
                    onClick={() => handleTopicClick(topic.id)}
                  >
                    <p>{topic.title}</p>
                    <small className="text-gray-500">
                      {topic.Content}
                    </small>{" "}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-secondary p-6 rounded-lg shadow-lg mx-12">
                <img className="h-28 mb-4 mx-auto" src={Logo} alt="Logo" />
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-primary">
                  No tienes foros favoritos establecidos
                </h2>
                <p className="text-center text-gray-600 dark:text-primary text-sm sm:text-base md:text-lg lg:text-xl">
                  Mira tus foros favoritos
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      <CreateCommentsComponent
        visible={createComment}
        onClose={() => setCreateComment(false)}
        topicId={topicId}
        onCreate={() => {
          setCreateComment(false);
          fetchForumTopic();
        }}
      />

      <CreateAnswersComponents
        visible={createAnswer.visible}
        commentId={createAnswer.commentId}
        onClose={() => setCreateAnswer({ visible: false, commentId: null })}
        onCreate={() => {
          setCreateAnswer({ visible: false, commentId: null });
          fetchForumTopic();
        }}
      />

      <UpdateForumCommntsForm
        visible={updateCommentForm}
        onClose={() => setUpdateCommentForm(false)}
        topicId={topicId}
        topicData={selectComment}
        onUpdate={() => {
          setUpdateCommentForm(false);
          fetchForumTopic();
        }}
      />

      <UpdateAnswersForm
        visible={updateAnswerForm}
        onClose={() => setUpdateAnswerForm(false)}
        answerData={selectAnswer}
        commentsId={comments.id}
        onUpdate={() => {
          setUpdateAnswerForm(false);
          fetchForumTopic();
        }}
      />
    </div>
  );
};

export default TopicViewComponente;
