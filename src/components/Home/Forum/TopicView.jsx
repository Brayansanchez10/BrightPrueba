import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { BsFillReplyFill } from "react-icons/bs";
import { AiFillLike, AiOutlineLike } from "react-icons/ai"; 
import { EditOutlined, DeleteFilled } from "@ant-design/icons";
import { FaBookBookmark } from "react-icons/fa6";
import { Button } from "antd";
import { useParams } from "react-router-dom";
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


import Footer from "../../footer.jsx";

const TopicViewComponente = () => {
    const { t } = useTranslation("global");
    const { user } = useAuth();
    const [topic, setTopic] = useState({});
    const { topicId } = useParams();
    const [comments, setComments] = useState([]);
    const { getTopicById } = useForumTopic();
    const { getCommentsByTopic } = useForumComments();
    const { getAnswersByComment } = useAnswers(); // Obtén la función de respuestas
    const [answersByComment, setAnswersByComment] = useState({}); // Para almacenar respuestas por comentario
    
    const { likes, toggleLikes, loading: likesLoading } = useLikes();
    const { bookmark, toggleBookmark, loading: bookmarkLoading } = useBookMark(); // Bookmark context
    
    //Formulario edición Comentario
    const [ selectComment, setSelectComment ] =useState(null);
    const [ updateCommentForm, setUpdateCommentForm ] = useState(false);
    //Formulario edición Respuesta
    const [ selectAnswer, setSelectAnswer] = useState(null);
    const [ updateAnswerForm, setUpdateAnswerForm ] = useState(false);
  
    // Modales de creación
    const [ createComment, setCreateComment ] = useState(false); // Función para abrir el modal de crear Comentario
    const [ createAnswer, setCreateAnswer ] = useState(false);

    const fetchForumTopic = async () => {
        if (user && user.data && user.data.id) {
            try {
                const fetchedTopic = await getTopicById(topicId);
                setTopic(fetchedTopic);
    
                // Obtener los comentarios del tema
                const fetchedComments = await getCommentsByTopic(topicId);
                setComments(fetchedComments);
    
                // Obtener respuestas para cada comentario
                const allAnswers = {};
                for (const comment of fetchedComments) {
                    const answers = await getAnswersByComment(comment.id);
                    allAnswers[comment.id] = answers; // Almacenar respuestas por ID de comentario
                }
                setAnswersByComment(allAnswers); // Actualizar estado de respuestas
            } catch (error) {
                console.error("Error al obtener el tema", error);
            }
        }
    };
    
    useEffect(() => {
        fetchForumTopic(); 
    }, [user, topicId]);

    // Formularios de creación
    const handleCreateFormComments = () => {
        setCreateComment(true);
    };
    const handleCreateFormAnswers = (commentId) => {
        setCreateAnswer({ visible: true, commentId });
    };

    //Formularios de Edición
    const openEditCommentsModal = (comment) => {
      setSelectComment(comment); // Pasar el comentario completo
      setUpdateCommentForm(true);
    };

    //Respuesta
    const openEditAnswersModal = (answer) => {
      setSelectAnswer(answer); 
      setUpdateAnswerForm(true);
    };

    // Botones de likes y marcador
    const handleLikeToggle = async (commentsId) => {
        await toggleLikes(commentsId);
    };
    const handleBookmarkToggle = async (commentId) => {
        await toggleBookmark(commentId);
    };

    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
          <NavigationBar />
          <div className="flex-grow mt-16 p-6 max-w-screen-lg mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                  <h1 className="text-2xl font-bold mb-4">{topic.title}</h1>
                  <p className="text-gray-700">{topic.Content}</p>
              </div>
              <Button
                  className="bg-purple-800 text-white font-bold py-1.5 px-4 rounded-3xl min-w-[120px] shadow-md shadow-gray-400"
                  onClick={() => handleCreateFormComments()}
                  icon={<FaChevronRight />}
              >
                  {t("topicView.topicComment")}
              </Button>
  
              <h2 className="text-xl font-semibold mb-4">{t("topicView.comments")}</h2>
              <div className="comments-section space-y-4">
                  {Array.isArray(comments) && comments.length > 0 ? (
                      comments.map((comment) => {
                          const isLiked = likes.some((like) => like.commentsId === comment.id);
                          const isBookmarked = bookmark.some((fav) => fav.commentId === comment.id); // Verificar si está en bookmarks
  
                          return (
                              <div key={comment.id} className="comment-card p-4 bg-white rounded-lg shadow">
                                  <p className="text-gray-800">{comment.content}</p>
                                  <small className="text-gray-500">{t("Creador")}: {comment.user.username}</small>
  
                                  <Button
                                      onClick={() => handleCreateFormAnswers(comment.id)}
                                      icon={<BsFillReplyFill />}
                                  >
                                  </Button>
  
                                  <Button
                                      onClick={() => handleLikeToggle(comment.id)}
                                      icon={isLiked ? <AiFillLike color="blue" /> : <AiOutlineLike />}
                                      disabled={likesLoading}
                                  >
                                      {isLiked}
                                  </Button>
  
                                  <Button
                                      onClick={() => handleBookmarkToggle(comment.id)} // Bookmark toggle
                                      icon={<FaBookBookmark color={isBookmarked ? "orange" : "gray"} />}
                                      disabled={bookmarkLoading} // Deshabilitar si está cargando
                                  >
                                      {isBookmarked}
                                  </Button>
  
                                  {/* Verificar si el usuario autenticado es el creador del comentario */}
                                  {user && user.data && user.data.id === comment.userId && (
                                      <Button
                                          onClick={() => openEditCommentsModal(comment)}
                                          icon={<EditOutlined color="red" />}
                                      >
                                      </Button>
                                  )}
  
                                  {/* Mostrar respuestas por comentario */}
                                  {answersByComment[comment.id] && answersByComment[comment.id].length > 0 ? (
                                      <div className="answers-section mt-2 space-y-2">
                                          {answersByComment[comment.id].map((answer) => (
                                              <div key={answer.id} className="answer-card p-2 bg-gray-100 rounded shadow mt-2">
                                                  <p>{answer.content}</p>
                                                  <small className="text-gray-500">{t("Creador")}: {answer.user.username}</small>
                                                  
                                                  {/* Verificar si el usuario autenticado es el creador de la respuesta */}
                                                  {user && user.data && user.data.id === answer.userId && (
                                                      <Button
                                                          onClick={() => openEditAnswersModal(answer)}
                                                          icon={<EditOutlined color="red" />}
                                                      >
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
                setCreateAnswer({ visible: false, commentId: null })
                fetchForumTopic();
            }}
          />
  
          <UpdateForumCommntsForm 
              visible={updateCommentForm}
              onClose={() => setUpdateCommentForm(false)}
              topicId={topicId}
              topicData={selectComment} // Asegúrate de pasar el comentario completo
              onUpdate={() => {
                setUpdateCommentForm(false)
                fetchForumTopic();
              }}
          />
  
          <UpdateAnswersForm 
              visible={updateAnswerForm}
              onClose={() => setUpdateAnswerForm(false)}
              answerData={selectAnswer}
              commentsId={comments.id}
              onUpdate={() => {
                setUpdateAnswerForm(false)
                fetchForumTopic();
            }}
          />
      </div>
  );
};

export default TopicViewComponente;
