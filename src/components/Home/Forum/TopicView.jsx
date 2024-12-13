import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BsFillReplyFill } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { FaBookmark, FaUser, FaRegUserCircle } from "react-icons/fa";
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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';

export default function TopicViewComponente() {
  const { t } = useTranslation("global");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ topic, setTopic ] = useState({});
  const { topicId } = useParams();
  const [ comments, setComments ] = useState([]);
  const { getTopicById } = useForumTopic();
  const { getCommentsByTopic } = useForumComments();
  const { getAnswersByComment } = useAnswers();
  const [ answersByComment, setAnswersByComment ] = useState({});

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

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
    <motion.div 
      className="flex flex-col min-h-screen bg-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <NavigationBar />

      <motion.div 
        className="py-16 px-4 md:px-6 lg:px-8 flex flex-col md:flex-row"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex-grow mb-8 md:mb-0 md:mr-[300px] w800:mr-[330px] w900:mr-[380px] w1000:mr-[410px] w1200:mr-[420px] w-full">
          <motion.div 
            className="w-full bg-[#783CDA] rounded-[10px] p-6 mb-8 mt-6 overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex justify-between items-start mb-4">
              <h1 className="font-bungee text-white text-left text-3xl pr-16 break-words">
                {topic.title}
              </h1>
            </div>
            <ReactQuill
              value={topic.Content}
              readOnly={true}
              theme="bubble"
              className="quill-content"
            />
          </motion.div>

          <motion.div 
            className="w-full bg-[#783CDA] rounded-[10px] p-6 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 20rem)", scrollbarWidth: 'thin', scrollbarColor: '#5A28AA #783CDA' }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              className="bg-[#783CDA] text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-[#5A28AA] transition w-full md:w-auto mb-6 font-bungee"
              onClick={() => handleCreateFormComments()}
            >
              {t("topicView.topicComment")}
            </Button>

            <h2 className="font-bungee text-white text-left text-2xl mb-6">
              {t("topicView.comments")}
            </h2>
            <div className="comments-section space-y-6">
              {Array.isArray(comments) && comments.length > 0 ? (
                comments.map((comment, index) => {
                  const isLiked = likes.some(
                    (like) => like.commentsId === comment.id
                  );
                  const isBookmarked = bookmark.some(
                    (fav) => fav.commentId === comment.id
                  );

                  return (
                    <motion.div
                      key={comment.id}
                      className="p-4 bg-[#5A28AA] rounded-lg shadow mb-4 hover:bg-[#4A3270] transition-colors duration-300 relative group"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index, duration: 0.5 }}
                    >
                      <div className="flex items-start mb-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center mr-3">
                          {comment.user.userImage ? (
                            <img src={comment.user.userImage} alt={comment.user.username} className="w-full h-full object-cover" />
                          ) : (
                            <FaUser className="text-purple-900 text-xl" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <span className="text-white font-semibold block">{comment.user.username}</span>
                          <span className="text-gray-300 text-sm">{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                        {user &&
                          user.data &&
                          user.data.id === comment.userId && (
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="flex items-center space-x-2">
                                <Button
                                  onClick={() => openEditCommentsModal(comment)}
                                  className="bg-transparent border-none p-1 hover:text-blue-400 transition-colors duration-300"
                                  icon={<EditOutlined className="text-white text-lg hover:text-blue-400" />}
                                />
                                <Button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="bg-transparent border-none p-1 hover:text-red-400 transition-colors duration-300"
                                  icon={<DeleteOutlined className="text-white text-lg hover:text-red-400" />}
                                />
                              </div>
                            </div>
                          )}
                      </div>
                      <p className="text-white mb-4">{comment.content}</p>
                      <div className="flex justify-end space-x-2">
                        <Button
                          onClick={() => handleLikeToggle(comment.id)}
                          className="bg-transparent border-none p-1 hover:text-red-400 transition-colors duration-300"
                          icon={
                            isLiked ? (
                              <AiFillHeart className="text-red-500 text-xl" />
                            ) : (
                              <AiOutlineHeart className="text-white text-xl hover:text-red-400" />
                            )
                          }
                          disabled={likesLoading}
                        />
                        <Button
                          onClick={() => handleBookmarkToggle(comment.id)}
                          className="bg-transparent border-none p-1 hover:text-yellow-400 transition-colors duration-300"
                          icon={
                            <FaBookmark
                              className={`text-xl ${isBookmarked ? "text-yellow-500" : "text-white hover:text-yellow-400"}`}
                            />
                          }
                          disabled={bookmarkLoading}
                        />
                        <Button
                          className="bg-transparent border-none p-1 hover:text-blue-400 transition-colors duration-300"
                          onClick={() => handleCreateFormAnswers(comment.id)}
                          icon={<BsFillReplyFill className="text-white text-xl hover:text-blue-400" />}
                        />
                      </div>

                      {answersByComment[comment.id] &&
                      answersByComment[comment.id].length > 0 && (
                        <div className="answers-section mt-4 space-y-4 pl-4 border-l-2 border-white">
                          {answersByComment[comment.id].map((answer, answerIndex) => (
                            <motion.div
                              key={answer.id}
                              className="p-4 bg-[#4A2394] rounded-lg shadow mt-2 hover:bg-[#3D1D7A] transition-colors duration-300 relative group"
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.1 * (answerIndex + 1), duration: 0.5 }}
                            >
                              <div className="flex items-start mb-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center mr-2">
                                  {answer.user.userImage ? (
                                    <img src={answer.user.userImage} alt={answer.user.username} className="w-full h-full object-cover" />
                                  ) : (
                                    <FaUser className="text-purple-900 text-sm" />
                                  )}
                                </div>
                                <div className="flex-grow">
                                  <span className="text-white font-semibold block">{answer.user.username}</span>
                                  <span className="text-gray-300 text-sm">{new Date(answer.createdAt).toLocaleString()}</span>
                                </div>
                                {user &&
                                  user.data &&
                                  user.data.id === answer.userId && (
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <div className="flex items-center space-x-2">
                                        <Button
                                          onClick={() => openEditAnswersModal(answer)
                                          }
                                          className="bg-transparent border-none p-1 hover:text-blue-400 transition-colors duration-300"
                                          icon={<EditOutlined className="text-white text-lg hover:text-blue-400" />}
                                        />
                                        <Button
                                          onClick={() =>
                                            handleDeleteAnswer(answer.id)
                                          }
                                          className="bg-transparent border-none p-1 hover:text-red-400 transition-colors duration-300"
                                          icon={<DeleteOutlined className="text-white text-lg hover:text-red-400" />}
                                        />
                                      </div>
                                    </div>
                                  )}
                              </div>
                              <p className="text-white">{answer.content}</p>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-white">{t("Mytopic.noComments")}</p>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="w-full md:w-1/3 space-y-8 mt-6 md:block md:fixed md:right-8 md:top-16"
          style={{ 
            maxWidth: windowWidth >= 768 ? "400px" : "none",
            maxHeight: "calc(100vh - 120px)",
            overflowY: "auto"
          }}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div 
            className="bg-[#653079] rounded-[10px] p-4 overflow-y-auto flex flex-col" 
            style={{ 
              height: "calc(45vh - 60px)",
              minHeight: "200px",
              scrollbarWidth: 'thin', 
              scrollbarColor: '#AF7BC7 #653079'
            }}
          >
            <h2 className="font-bungee text-white text-left text-xl mb-4 w-full">{t("Mytopic.commentM")}</h2>
            {bookmark && bookmark.length > 0 ? (
              <div className="space-y-2 w-full">
                {bookmark.map((fav) => {
                  const comment = comments.find((c) => c.id === fav.commentId)
                  return comment ? (
                    <motion.div
                      key={comment.id}
                      className="p-2 bg-[#AF7BC7] rounded-[10px] shadow mt-2"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center mr-2">
                          {comment.user.userImage ? (
                            <img src={comment.user.userImage} alt={comment.user.username} className="w-full h-full object-cover" />
                          ) : (
                            <FaUser className="text-purple-900 text-sm" />
                          )}
                        </div>
                        <span className="text-sm font-semibold text-white">{comment.user.username}</span>
                      </div>
                      <p className="text-ls text-white font-medium">{comment.content}</p>
                    </motion.div>
                  ) : null
                })}
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center">
                <motion.img 
                  className="h-32 mb-4" 
                  src={Logo} 
                  alt="Logo"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.p 
                  className="text-white text-lg font-semibold text-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {t("Mytopic.messageC")}
                </motion.p>
                <motion.p 
                  className="text-white text-sm mt-2 text-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {t("Mytopic.messageC2")}
                </motion.p>
              </div>
            )}
          </div>

          <motion.div 
            className="bg-[#653079] rounded-[10px] p-4 overflow-y-auto" 
            style={{ 
              height: "calc(45vh - 60px)",
              minHeight: "200px",
              scrollbarWidth: 'thin', 
              scrollbarColor: '#AF7BC7 #653079'
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <h2 className="font-bungee text-white text-left text-xl mb-4">{t("Mytopic.favoriteF")}</h2>
            {topics.length > 0 ? (
              <div className="space-y-2">
                {topics.map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    className="p-2 bg-[#AF7BC7] rounded-[10px] shadow mt-2 cursor-pointer flex items-center"
                    onClick={() => handleTopicClick(topic.id)}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                  >
                    <div className="flex-grow">
                      <h3 className="font-bungee text-white text-left text-md">{topic.title}</h3>
                      <p className="text-white text-sm font-roboto">{topic.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <motion.img 
                  className="h-32 mb-4 mx-auto" 
                  src={Logo} 
                  alt="Logo"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.p 
                  className="text-white text-lg font-semibold"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {t("Mytopic.messageF")}
                </motion.p>
                <motion.p 
                  className="text-white text-sm mt-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {t("Mytopic.messageF2")}
                </motion.p>
              </div>
            )}
          </motion.div>
        </motion.div>
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
    </motion.div>
  );
}