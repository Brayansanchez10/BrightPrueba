import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsFillReplyFill, BsBookmarkFill, BsBookmark } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Modal, Tooltip } from "antd";
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

const MotionButton = motion(Button);

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
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <NavigationBar />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow mt-16"
      >
        <section className="w-full bg-[#783CDA] py-8 px-4 md:px-6 lg:px-8">
          <div className="max-w-screen-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bungee text-white mb-4">
              {topic.title}
            </h1>
            <p className="text-lg text-gray-200">{topic.Content}</p>
            <MotionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 bg-white text-[#783CDA] font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out"
              onClick={handleCreateFormComments}
            >
              {t("topicView.topicComment")}
            </MotionButton>
          </div>
        </section>

        <div className="px-4 md:px-6 lg:px-8 py-8">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="lg:w-2/3"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-bungee">
                  {t("topicView.comments")}
                </h2>
                <div className="space-y-6">
                  <AnimatePresence>
                    {Array.isArray(comments) && comments.length > 0 ? (
                      comments.map((comment, index) => {
                        const isLiked = likes.some((like) => like.commentsId === comment.id);
                        const isBookmarked = bookmark.some((fav) => fav.commentId === comment.id);

                        return (
                          <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                          >
                            <div className="p-6">
                              <p className="text-gray-800 dark:text-gray-200 text-lg mb-4">{comment.content}</p>
                              <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center space-x-4">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {t("Creador")}: {comment.user.username}
                                  </span>
                                  <div className="flex space-x-2">
                                    <Tooltip title="Responder">
                                      <MotionButton
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="text-[#783CDA] hover:text-[#6A35C2] dark:text-[#9B6AFF] dark:hover:text-[#B388FF]"
                                        onClick={() => handleCreateFormAnswers(comment.id)}
                                        icon={<BsFillReplyFill size={20} />}
                                      />
                                    </Tooltip>
                                    <Tooltip title={isLiked ? "Quitar Me gusta" : "Me gusta"}>
                                      <MotionButton
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`${isLiked ? 'text-red-500' : 'text-gray-400'} hover:text-red-600`}
                                        onClick={() => handleLikeToggle(comment.id)}
                                        disabled={likesLoading}
                                        icon={isLiked ? <AiFillHeart size={20} /> : <AiOutlineHeart size={20} />}
                                      />
                                    </Tooltip>
                                    <Tooltip title={isBookmarked ? "Quitar marcador" : "Marcar"}>
                                      <MotionButton
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`${isBookmarked ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600`}
                                        onClick={() => handleBookmarkToggle(comment.id)}
                                        disabled={bookmarkLoading}
                                        icon={isBookmarked ? <BsBookmarkFill size={20} /> : <BsBookmark size={20} />}
                                      />
                                    </Tooltip>
                                  </div>
                                </div>
                                {user && user.data && user.data.id === comment.userId && (
                                  <div className="flex space-x-2">
                                    <Tooltip title="Editar">
                                      <MotionButton
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                                        onClick={() => openEditCommentsModal(comment)}
                                        icon={<EditOutlined size={20} />}
                                      />
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                      <MotionButton
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                                        onClick={() => handleDeleteComment(comment.id)}
                                        icon={<DeleteOutlined size={20} />}
                                      />
                                    </Tooltip>
                                  </div>
                                )}
                              </div>
                            </div>

                            {answersByComment[comment.id] && answersByComment[comment.id].length > 0 && (
                              <div className="bg-gray-100 dark:bg-gray-700 p-4">
                                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Respuestas</h3>
                                <div className="space-y-4">
                                  {answersByComment[comment.id].map((answer) => (
                                    <motion.div
                                      key={answer.id}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: 20 }}
                                      transition={{ duration: 0.3 }}
                                      className="bg-white dark:bg-gray-600 p-4 rounded-lg shadow"
                                    >
                                      <p className="text-gray-800 dark:text-gray-200 mb-2">{answer.content}</p>
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                          {t("Creador")}: {answer.user.username}
                                        </span>
                                        {user && user.data && user.data.id === answer.userId && (
                                          <div className="flex space-x-2">
                                            <Tooltip title="Editar respuesta">
                                              <MotionButton
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                                                onClick={() => openEditAnswersModal(answer)}
                                                icon={<EditOutlined size={16} />}
                                              />
                                            </Tooltip>
                                            <Tooltip title="Eliminar respuesta">
                                              <MotionButton
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                                                onClick={() => handleDeleteAnswer(answer.id)}
                                                icon={<DeleteOutlined size={16} />}
                                              />
                                            </Tooltip>
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        );
                      })
                    ) : (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center text-gray-500 dark:text-gray-400 text-lg italic"
                      >
                        {t("noComments")}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="lg:w-1/3 space-y-8"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 font-bungee">Comentarios marcados</h2>
                    <div className="space-y-4 max-h-[360px] overflow-y-auto custom-scrollbar-x">
                      {bookmark.length > 0 ? (
                        bookmark.map((fav) => {
                          const comment = comments.find((c) => c.id === fav.commentId);
                          return comment ? (
                            <motion.div
                              key={comment.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
                            >
                              <p className="text-gray-800 dark:text-gray-200 text-sm">{comment.content}</p>
                              <small className="text-gray-500 dark:text-gray-400 block mt-2">
                                {t("Creador")}: {comment.user.username}
                              </small>
                            </motion.div>
                          ) : null;
                        })
                      ) : (
                        <div className="text-center">
                          <img className="h-24 w-24 mx-auto mb-4" src={Logo} alt="Logo" />
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                            No tienes comentarios marcados
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Marca comentarios de tu interés
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 font-bungee">Foros favoritos</h2>
                    <div className="space-y-4 max-h-[360px] overflow-y-auto custom-scrollbar-x">
                      {topics.length > 0 ? (
                        topics.map((topic) => (
                          <motion.div
                            key={topic.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300"
                            onClick={() => handleTopicClick(topic.id)}
                          >
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{topic.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">{topic.Content}</p>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center">
                          <img className="h-24 w-24 mx-auto mb-4" src={Logo} alt="Logo" />
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                            No tienes foros favoritos
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Agrega foros a tus favoritos
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

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