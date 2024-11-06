import React, { useState, useEffect } from "react";
import { BsFillReplyFill } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { FaBookmark } from "react-icons/fa";
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

export default function TopicViewComponente() {
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
      title: t('modalForum.title2'),
      content: t('modalForum.message2'),
      okText: t('modalForum.confirm'),
      okType: 'danger',
      cancelText: t('modalForum.cancel'),
      centered: true,
      maskClosable: true,
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
      title: t('modalForum.title'),
      content: t('modalForum.message'),
      okText: t('modalForum.confirm'),
      okType: 'danger',
      cancelText: t('modalForum.cancel'),
      centered: true,
      maskClosable: true,
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

  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <NavigationBar />

      <div className="py-16 px-4 md:px-6 lg:px-8 flex flex-col md:flex-row">
        <div className="flex-grow mb-8 md:mb-0 md:mr-8 bg-secondary rounded-lg shadow-md w-full md:w-2/3 overflow-y-auto custom-scrollbar-x" style={{ maxHeight: "calc(100vh - 4rem)" }}>
          <div className="p-6">
            <div className="border-b pb-4 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-primary">
                {topic.title}
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-primary">{topic.Content}</p>
            </div>
            <Button
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition w-full md:w-auto"
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
                      <p className="text-sm md:text-base text-gray-800 dark:text-primary">{comment.content}</p>
                      <small className="text-xs md:text-sm text-gray-400 block mt-1">
                        {t("Creador")}: {comment.user.username}
                      </small>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <Button
                          className="bg-secondary text-blue-500 dark:text-primary dark:border-[#1E1034] hover:bg-blue-100 transition-colors duration-200 p-1 md:p-2"
                          onClick={() => handleCreateFormAnswers(comment.id)}
                          icon={<BsFillReplyFill />}
                        />
                        <Button
                          onClick={() => handleLikeToggle(comment.id)}
                          className="bg-secondary text-red-500 dark:text-primary dark:border-[#1E1034] hover:bg-red-100 transition-colors duration-200 p-1 md:p-2"
                          icon={
                            isLiked ? (
                              <AiFillHeart className="text-red-500" />
                            ) : (
                              <AiOutlineHeart />
                            )
                          }
                          disabled={likesLoading}
                        />
                        <Button
                          onClick={() => handleBookmarkToggle(comment.id)}
                          className="bg-secondary text-yellow-500 dark:text-primary dark:border-[#1E1034] hover:bg-yellow-100 transition-colors duration-200 p-1 md:p-2"
                          icon={
                            <FaBookmark
                              color={isBookmarked ? "orange" : "gray"}
                            />
                          }
                          disabled={bookmarkLoading}
                        />

                        {user &&
                          user.data &&
                          user.data.id === comment.userId && (
                            <>
                              <Button
                                onClick={() => openEditCommentsModal(comment)}
                                className="bg-secondary text-blue-600 dark:text-primary dark:border-[#1E1034] hover:bg-blue-100 transition-colors duration-200 p-1 md:p-2"
                                icon={<EditOutlined />}
                              />
                              <Button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="bg-secondary text-red-600 dark:text-primary dark:border-[#1E1034] hover:bg-red-100 transition-colors duration-200 p-1 md:p-2"
                                icon={<DeleteOutlined />}
                              />
                            </>
                          )}
                      </div>

                      {answersByComment[comment.id] &&
                      answersByComment[comment.id].length > 0 ? (
                        <div className="answers-section mt-4 ml-2 md:ml-4 space-y-2">
                          {answersByComment[comment.id].map((answer) => (
                            <div
                              key={answer.id}
                              className="p-2 bg-gray-100 dark:bg-secondary border-l-4 border-purple-700 rounded-lg shadow mt-2"
                            >
                              <p className="text-sm md:text-base text-primary">{answer.content}</p>
                              <small className="text-xs md:text-sm text-gray-400">
                                {t("Creador")}: {answer.user.username}
                              </small>

                              {user &&
                                user.data &&
                                user.data.id === answer.userId && (
                                  <div className="mt-2 space-x-2">
                                    <Button
                                      onClick={() => openEditAnswersModal(answer)}
                                      className="dark:bg-primary text-blue-600 dark:text-primary dark:border-none p-1 md:p-2"
                                      icon={<EditOutlined />}
                                    />
                                    <Button
                                      onClick={() => handleDeleteAnswer(answer.id)}
                                      className="dark:bg-primary text-red-600 dark:text-primary dark:border-none p-1 md:p-2"
                                      icon={<DeleteOutlined />}
                                    />
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm md:text-base text-gray-500 dark:text-primary mt-2">{t("No respuestas")}</p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm md:text-base text-gray-500 dark:text-primary">{t("noComments")}</p>
              )}
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3 bg-secondary rounded-lg shadow-md overflow-hidden">
          <div className="dark:bg-primary p-4 rounded-md shadow-md h-1/2 overflow-y-auto custom-scrollbar-x">
            <h2 className="text-lg md:text-xl text-primary font-semibold mb-4">Comentarios marcados</h2>
            {bookmark.length > 0 ? (
              <div className="space-y-2">
                {bookmark.map((fav) => {
                  const comment = comments.find((c) => c.id === fav.commentId);
                  return comment ? (
                    <div
                      key={comment.id}
                      className="p-2 bg-gray-100 dark:bg-secondary border-l-4 border-purple-700 rounded-lg shadow mt-2"
                    >
                      <p className="text-sm md:text-base text-primary">{comment.content}</p>
                      <small className="text-xs md:text-sm text-gray-400">
                        {t("Creador")}: {comment.user.username}
                      </small>
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <div className="pb-3">
                <div className="dark:bg-primary p-3 rounded-lg">
                  <img className="h-20 md:h-28 mb-4 mx-auto" src={Logo} alt="Logo" />
                  <h2 className="text-xl md:text-2xl font-bold mb-4 text-center text-gray-800 dark:text-primary">
                    No tienes ningun comentario marcado
                  </h2>
                  <p className="text-center text-gray-600 dark:text-primary text-xs sm:text-sm md:text-base lg:text-lg">
                    Marca comentarios de tu interes
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="dark:bg-primary p-4 rounded-md shadow-md h-1/2 overflow-y-auto custom-scrollbar-x">
            <h2 className="text-lg md:text-xl text-primary font-semibold mb-4">Foros favoritos</h2>

            {topics.length > 0 ? (
              <div className="space-y-2">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-2 bg-gray-100 dark:bg-secondary border-l-4 border-purple-700 rounded-lg shadow mt-2 cursor-pointer"
                    onClick={() => handleTopicClick(topic.id)}
                  >
                    <p className="text-sm md:text-base text-primary">{topic.title}</p>
                    <small className="text-xs md:text-sm text-gray-400 dark:text-gray-300">
                      {topic.Content}
                    </small>{" "}
                  </div>
                ))}
              </div>
            ) : (
              <div className="dark:bg-primary p-4 rounded-lg">
                <img className="h-20 md:h-28 mb-4 mx-auto" src={Logo} alt="Logo" />
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-center text-gray-800 dark:text-primary">
                  No tienes foros favoritos establecidos
                </h2>
                <p className="text-center text-gray-600 dark:text-primary text-xs sm:text-sm md:text-base lg:text-lg">
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
}