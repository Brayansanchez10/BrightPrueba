import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { BsFillReplyFill } from "react-icons/bs";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { EditOutlined, DeleteFilled } from "@ant-design/icons";
import { FaBookBookmark } from "react-icons/fa6";
import { Button, Modal } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth.context.jsx";
import NavigationBar from "../NavigationBar.jsx";
import { useTranslation } from "react-i18next";
import { useForumTopic } from "../../../context/forum/topic.context.jsx";
import { useForumComments } from "../../../context/forum/forumComments.context.jsx";
import { useAnswers } from "../../../context/forum/answers.context.jsx";
import CreateCommentsComponent from "./CommentComponents/CreateComponents.jsx";
import CreateAnswersComponents from "./answersComponent.jsx/CreateAnswerForm.jsx";
import UpdateForumCommntsForm from "./CommentComponents/EditComponents.jsx";
import UpdateAnswersForm from "./answersComponent.jsx/updateAnswerForm.jsx";
import { useLikes } from "../../../context/forum/likes.context.jsx";
import { useBookMark } from "../../../context/forum/bookmark.context.jsx";
import { useForumFavorite } from "../../../context/forum/forumFavorite.context.jsx";
import Footer from "../../footer.jsx";
import Logo from "../../../assets/img/hola.png";
import "../Resources/resourceView.css";
import { deleteAnswer } from "../../../api/forum/answers.request.js";
import { deleteForumComments } from "../../../api/forum/forumComments.request.js";

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
  const { favorites, loading, toggleForumFavorites } = useForumFavorite();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    if (favorites.length > 0) {
      const fetchForumDetails = async () => {
        try {
          const fetchedTopics = await Promise.all(
            favorites.map(async (fav) => {
              const topicDetails = await getTopicById(fav.topicId);
              return topicDetails;
            })
          );
          setTopics(fetchedTopics);
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
    const updatedBookmarks = bookmark.map((fav) => fav.commentId);
    setBookmarkedComments(updatedBookmarks);
  };

  const handleFavoriteToggle = async (topicId) => {
    await toggleForumFavorites(topicId);
    const fetchedTopics = favorites.map((fav) => fav.topicId);
    setTopics(fetchedTopics);
  };

  const handleTopicClick = (topicId) => {
    console.log("Tema ID", topicId);
    navigate(`/topic/${topicId}`);
  };

  const handleDeleteAnswer = async (answerId) => {
    Modal.confirm({
      title: '¿Estás seguro de que quieres eliminar esta respuesta?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'No, cancelar',
      onOk: async () => {
        try {
          await deleteAnswer(answerId);
          fetchForumTopic();
        } catch (error) {
          console.error("Error al eliminar la respuesta:", error);
          Modal.error({
            title: 'Error',
            content: 'No se pudo eliminar la respuesta. Por favor, inténtalo de nuevo.',
          });
        }
      },
    });
  };

  const handleDeleteComment = async (commentId) => {
    Modal.confirm({
      title: '¿Estás seguro de que quieres eliminar este comentario?',
      content: 'Esta acción eliminará el comentario y todas sus respuestas asociadas. No se puede deshacer.',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'No, cancelar',
      onOk: async () => {
        try {
          await deleteForumComments(commentId);
          fetchForumTopic();
        } catch (error) {
          console.error("Error al eliminar el comentario:", error);
          Modal.error({
            title: 'Error',
            content: 'No se pudo eliminar el comentario. Por favor, inténtalo de nuevo.',
          });
        }
      },
    });
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
    <div className="flex flex-col min-h-screen bg-primary">
      <NavigationBar />

      <div className="py-16 inline-flex">
        <div className="flex-grow m-5 bg-secondary rounded-lg shadow-md w-2/3 overflow-y-auto custom-scrollbar-x" style={{ height: `${containerHeight}px` }}>
          <div className="flex-grow m-5">
            <div className="border-b pb-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-primary">
                {topic.title}
              </h1>
              <p className="text-gray-600 dark:text-primary">{topic.Content}</p>
            </div>
            <Button
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition"
              onClick={() => handleCreateFormComments()}
            >
              {t("topicView.topicComment")}
            </Button>

            <h2 className="text-xl font-semibold mt-6 mb-4 dark:text-primary">
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
                      className="p-4 bg-white dark:bg-primary border border-gray-300 dark:border-[#1E1034] rounded-lg shadow hover:shadow-lg transition mb-4"
                    >
                      <p className="text-gray-800 dark:text-primary">{comment.content}</p>
                      <small className="text-gray-400 block mt-1">
                        {t("Creador")}: {comment.user.username}
                      </small>

                      <div className="flex space-x-2 mt-2">
                        <Button
                          className="bg-secondary text-blue-500 dark:text-primary dark:border-[#1E1034] hover:underline"
                          onClick={() => handleCreateFormAnswers(comment.id)}
                          icon={<BsFillReplyFill />}
                        >
                          Responder
                        </Button>
                        <Button
                          onClick={() => handleLikeToggle(comment.id)}
                          className="flex bg-secondary items-center dark:text-primary dark:border-[#1E1034]"
                          icon={
                            isLiked ? (
                              <AiFillLike className="text-blue-500" />
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
                          className="flex bg-secondary items-center dark:text-primary dark:border-[#1E1034]"
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
                            <>
                              <Button
                                onClick={() => openEditCommentsModal(comment)}
                                className="bg-secondary text-blue-600 dark:text-primary dark:border-[#1E1034]"
                                icon={<EditOutlined />}
                              >
                                Editar
                              </Button>
                              <Button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="bg-secondary text-red-600 dark:text-primary dark:border-[#1E1034]"
                                icon={<DeleteFilled />}
                              >
                                Eliminar
                              </Button>
                            </>
                          )}
                      </div>

                      {answersByComment[comment.id] &&
                      answersByComment[comment.id].length > 0 ? (
                        <div className="answers-section mt-4 ml-4 space-y-2">
                          {answersByComment[comment.id].map((answer) => (
                            <div
                              key={answer.id}
                              className="p-2 bg-gray-100 dark:bg-secondary border-l-4 border-purple-700 rounded-lg shadow mt-2"
                            >
                              <p className="text-primary">{answer.content}</p>
                              <small className="text-gray-400">
                                {t("Creador")}: {answer.user.username}
                              </small>

                              {user &&
                                user.data &&
                                user.data.id === answer.userId && (
                                  <div className="mt-2 space-x-2">
                                    <Button
                                      onClick={() => openEditAnswersModal(answer)}
                                      className="dark:bg-primary text-blue-600 dark:text-primary dark:border-none"
                                      icon={<EditOutlined />}
                                    >
                                      Editar
                                    </Button>
                                    <Button
                                      onClick={() => handleDeleteAnswer(answer.id)}
                                      className="dark:bg-primary text-red-600 dark:text-primary dark:border-none"
                                      icon={<DeleteFilled />}
                                    >
                                      Eliminar
                                    </Button>
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-primary">{t("No respuestas")}</p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 dark:text-primary">{t("noComments")}</p>
              )}
            </div>
          </div>
        </div>

        <div className="w-1/4 m-5 bg-secondary rounded-lg shadow-md hidden xl:block" style={{ height: `${containerHeight}px` }}>
          <div className="dark:bg-primary m-4 rounded-md shadow-md h-2/5 overflow-y-auto custom-scrollbar-x">
            <h2 className="text-xl text-primary font-semibold mx-3">Comentarios marcados</h2>
            {bookmark.length > 0 ? (
              <div className="space-y-2 mx-3 pb-2">
                {bookmark.map((fav) => {
                  const comment = comments.find((c) => c.id === fav.commentId);
                  return comment ? (
                    <div
                      key={comment.id}
                      className="p-2 bg-gray-100 dark:bg-secondary border-l-4 border-purple-700 rounded-lg shadow mt-2"
                    >
                      <p className="text-primary">{comment.content}</p>
                      <small className="text-gray-400">
                        {t("Creador")}: {comment.user.username}
                      </small>
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <div className="pb-3">
                <div className="dark:bg-primary p-3 rounded-lg mx-12">
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

          <div className="dark:bg-primary m-4 rounded-md shadow-md h-1/2 overflow-y-auto custom-scrollbar-x">
            <h2 className="text-xl text-primary font-semibold mx-3">Foros favoritos</h2>

            {topics.length > 0 ? (
              <div className="space-y-2 mx-3 pb-2">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-2 bg-gray-100 dark:bg-secondary border-l-4 border-purple-700 rounded-lg shadow mt-2 cursor-pointer"
                    onClick={() => handleTopicClick(topic.id)}
                  >
                    <p className="text-primary">{topic.title}</p>
                    <small className="text-gray-400 dark:text-gray-300">
                      {topic.Content}
                    </small>{" "}
                  </div>
                ))}
              </div>
            ) : (
              <div className="dark:bg-primary p-6 rounded-lg mx-12">
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