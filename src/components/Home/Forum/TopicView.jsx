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
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
          <NavigationBar />
          <div className="flex-grow mt-10 p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md flex">
            <div className="flex-grow">
              <div className="border-b pb-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-800">{topic.title}</h1>
                <p className="text-gray-600">{topic.Content}</p>
              </div>
              <Button
                  className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition"
                  onClick={() => handleCreateFormComments()}
              >
                  {t("topicView.topicComment")}
              </Button>

              <h2 className="text-xl font-semibold mt-6 mb-4">{t("topicView.comments")}</h2>
              <div className="comments-section space-y-4">
                {Array.isArray(comments) && comments.length > 0 ? (
                    comments.map((comment) => {
                        const isLiked = likes.some((like) => like.commentsId === comment.id);
                        const isBookmarked = bookmark.some((fav) => fav.commentId === comment.id);

                        return (
                            <div key={comment.id} className="p-4 bg-white border border-gray-300 rounded-lg shadow hover:shadow-lg transition mb-4">
                                <p className="text-gray-800">{comment.content}</p>
                                <small className="text-gray-500 block mt-1">{t("Creador")}: {comment.user.username}</small>

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
                                        icon={isLiked ? <AiFillLike color="blue" /> : <AiOutlineLike />}
                                        disabled={likesLoading}
                                    >
                                        {isLiked ? 'Me gusta' : 'Me gusta'}
                                    </Button>
                                    <Button
                                        onClick={() => handleBookmarkToggle(comment.id)}
                                        className="flex items-center"
                                        icon={<FaBookBookmark color={isBookmarked ? "orange" : "gray"} />}
                                        disabled={bookmarkLoading}
                                    >
                                        {isBookmarked ? 'Guardado' : 'Guardar'}
                                    </Button>

                                    {user && user.data && user.data.id === comment.userId && (
                                        <Button
                                            onClick={() => openEditCommentsModal(comment)}
                                            className="text-red-600"
                                        >
                                            Editar
                                        </Button>
                                    )}
                                </div>

                                {answersByComment[comment.id] && answersByComment[comment.id].length > 0 ? (
                                    <div className="answers-section mt-4 ml-4 space-y-2">
                                        {answersByComment[comment.id].map((answer) => (
                                            <div key={answer.id} className="p-2 bg-gray-100 border-l-4 border-blue-500 rounded-lg shadow mt-2">
                                                <p>{answer.content}</p>
                                                <small className="text-gray-500">{t("Creador")}: {answer.user.username}</small>

                                                {user && user.data && user.data.id === answer.userId && (
                                                    <Button
                                                        onClick={() => openEditAnswersModal(answer)}
                                                        className="text-red-600"
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

            {/* Nuevo contenedor para el usuario más activo y botón de compartir */}
            <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-lg ml-4">
                <h2 className="text-xl font-semibold mb-2">Usuario Más Activo</h2>
                <p className="text-gray-700">Usuario: <strong>{/* Nombre del usuario */}</strong></p>
                <p className="text-gray-500">Comentarios: <strong>{/* Número de comentarios */}</strong></p>
                <Button
                    className="bg-green-500 text-white mt-2 py-1 px-3 rounded hover:bg-green-600"
                    onClick={() => {/* Lógica para compartir */}}
                >
                    Compartir
                </Button>
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
