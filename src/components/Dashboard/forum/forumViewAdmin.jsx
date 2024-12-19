import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForumTopic } from "../../../context/forum/topic.context";
import { useForumComments } from "../../../context/forum/forumComments.context";
import { useUserContext } from "../../../context/user/user.context";
import { useAnswers } from "../../../context/forum/answers.context";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth.context";
import { Button } from "antd";
import Navbar from "../NavBar";
import LeftBar from "../LeftBar";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaRegUserCircle } from "react-icons/fa";
import Swal from "sweetalert2";

import DonuChart from "./statisticsGraphs/CommentsAsnwers";
import TopCommentsChart from "./statisticsGraphs/TopCommentsChart";
import TopUsersChart from "./statisticsGraphs/TopUsersChart";
import TopUsersCommentsChart from "./statisticsGraphs/TopUsersCommentsChart";

import CreateTopicForm from "../../Home/Forum/TopicComponents/createTopic";
import UpdateForumTopicForm from "../../Home/Forum/TopicComponents/updateTopic";

const ForumViewAdmin = () => {
    const { t } = useTranslation("global");
    const { id } = useParams();
    const { user } = useAuth();
      const navigate = useNavigate();
    const { getForumTopicByCategoryId, deleteForumTopic } = useForumTopic();
    const { getCommentsByTopic } = useForumComments();
    const { getAnswersByComment } = useAnswers();
    const { getUserById } = useUserContext();
    const [topic, setTopic] = useState([]);
    const [comments, setComments] = useState([]);
    const [answersByComment, setAnswersByComment] = useState({});
    const [activeTab, setActiveTab] = useState(0);
    const [topUsers, setTopUsers]=useState([]);
    const [topUsersAnswer, setTopUsersAnswer]=useState([]);

    const [isLeftBarVisible, setIsLeftBarVisible] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);

    const [updateTopicForm, setUpdateTopicForm] = useState(false);
    const [createTopicForm, setCreateTopicForm] = useState(false);

    const fetchDataTopic = async () => {
        if (user && user.data && user.data.id) {
            try {
                // Obtener los temas del foro
                const topicData = await getForumTopicByCategoryId(id) || []; 
    
                // Mapea cada tema y agrega el conteo de comentarios
                const topicsWithCommentsCount = await Promise.all(
                    topicData.map(async (topic) => {
                        const comments = await getCommentsByTopic(topic.id); // Obtener comentarios de cada tema
                        const commentCount = comments.length; // Número total de comentarios
    
                        // Contar los comentarios por usuario
                        const userCommentCount = comments.reduce((acc, comment) => {
                            acc[comment.userId] = (acc[comment.userId] || 0) + 1;
                            return acc;
                        }, {});

                        // Contar las respuestas por comentario
                        const allAnswers = {};
                        for (const  comment of comments) {
                            const answers = await getAnswersByComment(comment.id);
                            allAnswers[comment.id] = answers;
                        }

                        // Contador de respuestas por comentario
                        const commentsWithAnswersCount = comments.map(comment => {
                            const answers = allAnswers[comment.id] || [];
                            return {
                                ...comment,
                                answersCount: answers.length, // Contar las respuestas por comentario
                            };
                        });

                        // Crear el top 5 de comentarios con más respuestas
                        const top5Comments = await Promise.all(
                            commentsWithAnswersCount
                                .sort((a, b) => b.answersCount - a.answersCount)
                                .slice(0, 5) // Tomar los 5 comentarios con más respuestas
                                .map(async (comment) => {
                                    const userData = await getUserById(comment.userId); // Obtener el username del autor del comentario
                                    return {
                                        ...comment,
                                        username: userData.username, // Agregar el nombre de usuario
                                    };
                                })
                        );
                            

                        // Contar el total de respuestas por usuario
                        const userAnswerCount = commentsWithAnswersCount.reduce((acc, comment) => {
                            const answers = allAnswers[comment.id] || [];
                            answers.forEach(answer => {
                                acc[answer.userId] = (acc[answer.userId] || 0) + 1;
                            });
                            return acc;
                        }, {});

                         // Obtener el top 5 usuarios más respondedores
                        const topUsersAnswer = Object.entries(userAnswerCount)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([userId, count]) => ({
                            userId,
                            count,
                        }));
        
                         // Obtener el top 5 usuarios más comentadores
                        const topUsers = await Promise.all(
                            Object.entries(userCommentCount)
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 5) // Tomar solo los primeros 5 usuarios
                                .map(async ([userId, count]) => {
                                    const userData = await getUserById(userId); // Consultar información del usuario
                                    return {
                                        userId,
                                        username: userData.username, // Agregar el nombre de usuario
                                        count,
                                    };
                                })
                        );
                        return {
                            ...topic,
                            commentsCount: commentCount,
                            topUsers, // Agregar el top 5 de usuarios
                            top5Comments,  // Top 5 de comentarios con más respuestas
                            topUsersAnswer,
                        };
                    })
                );
    
                // Actualiza el estado con los temas, el conteo y el top de usuarios
                setTopic(topicsWithCommentsCount);
    
                console.log("Temas con conteo de comentarios y top usuarios:", topicsWithCommentsCount);
            } catch (error) {
                console.error("Error al obtener temas o comentarios:", error);
            }
        }
    };

    
    useEffect(() => {
        fetchDataTopic();
    }, [user, id]);
    
    const handleRemove = async (topic) => {
        try {
            await deleteForumTopic(topic.id);
            Swal.fire({
                icon: "success",
                title: t("Topic.topicDelete"),
                showConfirmButton: false,
                timer: 700,
            });
            await fetchDataTopic(); // Llamar nuevamente a fetchDataTopic para actualizar la información
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

    const handleCreateTopicForm = () => {
        setCreateTopicForm(true);
    };

    const openEditModal = (topic) => {
        setSelectedTopic(topic);
        setUpdateTopicForm(true);
    };
    

    const handleTabClick = (tabIndex) => {
        setActiveTab(tabIndex);
    };

    const filteredTopics = Array.isArray(topic)
    ? activeTab === 0
        ? topic.filter((t) => t.userId === user.data.id) // Mis foros
        : topic // Todos los foros
    : [];

    const handleTopicClick = async (topic) => {
        console.log("Tema ID", topic.id);
        navigate(`/topic/${topic.id}`);
        try {
          await incrementForumViews(topic.id);
        } catch (error) {
          console.error(error);
        }
      };

    return (
        <div className="bg-primaryAdmin min-h-screen overflow-hidden">
            <div className="flex h-full">
                <LeftBar onVisibilityChange={setIsLeftBarVisible} />
                <div className={`flex-1 transition-all duration-300 ${isLeftBarVisible ? "ml-56" : "ml-0"}`}>
                    <Navbar />
                    <div className="mt-16 px-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-3xl text-purple-900 dark:text-primary font-bungee">
                                {t("Foros Estadisticas")}
                            </h2>

                            <Button
                                className="bg-purple-800 text-white font-bold text-xl py-5 px-6 rounded-1xl min-w-[160px] shadow-md shadow-gray-400 font-bungee hidden lg:flex"
                                onClick={handleCreateTopicForm}
                            >
                                Crear Foro
                            </Button>
                        </div>
                        <div className="flex justify-center border-b border-gray-300 mb-4">
                            <button
                                className={`px-4 py-2 text-lg font-semibold ${
                                    activeTab === 0
                                    ? "border-b-2 border-purple-600 text-purple-600"
                                    : "text-gray-600 hover:text-purple-600"
                                }`}
                                onClick={() => handleTabClick(0)}
                                >
                                {t("Mis foros")}
                            </button>
                            <button
                                className={`px-4 py-2 text-lg font-semibold ${
                                    activeTab === 1
                                    ? "border-b-2 border-purple-600 text-purple-600"
                                    : "text-gray-600 hover:text-purple-600"
                                }`}
                                onClick={() => handleTabClick(1)}
                                >
                                {t("Todos los foros")}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {Array.isArray(filteredTopics) && filteredTopics.length > 0 ? (
                                 filteredTopics.map((topic) => (
                                    <div key={topic.id} className="flex gap-6" onClick={() => handleTopicClick(topic)}>
                                        {/* Card de foro */}
                                        <div className="flex items-start p-6 border rounded-lg shadow-lg bg-white flex-1">
                                            {topic.user.userImage ? (
                                                <img
                                                    src={topic.user.userImage}
                                                    alt="Imagen del foro"
                                                    className="w-12 h-12 object-cover rounded-full mr-3"
                                                />
                                            ) : (
                                                <FaRegUserCircle className="w-12 h-12 text-gray-500 mr-3" />
                                            )}
                                             <div className="flex-grow w-full pr-16"> 
                                                <h2 className="text-gray-900 font-bungee text-lg line-clamp-1">
                                                    {topic.title}
                                                </h2>
                                                <div className="text-gray-700 font-sans text-base line-clamp-4 mt-1">
                                                    <p className="text-sm">
                                                        {topic.description || "No hay una descripción para el foro"}
                                                    </p>
                                                </div>
                                                <p className="text-gray-600 mt-2">Vistas: {topic.views}</p>
                                                <p className="text-gray-600">Creado el: {new Date(topic.createdAt).toLocaleDateString()}</p>
                                                {user.data.id === topic.userId && (
                                                    <div className="flex mt-2">
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openEditModal(topic);
                                                            }}
                                                            className="mr-2 p-2 rounded-full bg-yellow-500"
                                                        >
                                                            <FaEdit className="w-4 h-4 text-white" />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
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
                                                            className="p-2 rounded-full bg-red-500"
                                                        >
                                                            <FaTrash className="w-4 h-4 text-white" />
                                                        </motion.button>
                                                    </div>
                                                )}
                                             </div>
                                            
                                        </div>

                                        {/* Cantidad de comentarios */}
                                        <div className="p-6 border rounded-lg shadow-lg bg-white flex-1">
                                            <p className="text-gray-600">Comentarios: {topic.commentsCount}</p>
                                            <p className="text-gray-600">Respuestas: {topic.topUsersAnswer.reduce((acc, user) => acc + user.count, 0)}</p>
                                            <DonuChart topic={topic} />
                                        </div>

                                        <div className="p-6 border rounded-lg shadow-lg bg-white flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800">Top 5 Usuarios con más comentarios</h3>
                                            <ul className="mt-3">
                                                {topic.topUsers && topic.topUsers.length > 0 ? (
                                                    topic.topUsers.map((user) => (
                                                        <li key={user.userId} className="text-gray-600 text-xs">
                                                            ID: ({user.userId}) {user.username}: {user.count} comentarios
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="text-gray-500 text-lg">No hay usuarios con más comentarios</li>
                                                )}
                                                
                                            </ul>
                                            <TopUsersCommentsChart topic={topic} />
                                        </div>

                                        {/* Top 5 comentarios con más respuestas */}
                                        <div className="p-6 border rounded-lg shadow-lg bg-white flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800">Top 5 Comentarios con más respuestas:</h3>
                                            <ul>
                                                {topic.top5Comments && topic.top5Comments.length > 0 ? (
                                                    topic.top5Comments.slice(0, 5).map((comment) => (
                                                        <li key={comment.id} className="text-gray-600 text-xs">
                                                             Comentario: {comment.content.length > 10 
                                                                ? `${comment.content.substring(0, 10)}...` 
                                                                : comment.content} - Respuestas: {comment.answersCount}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="text-gray-500 text-lg">No hay comentarios destacados</li>
                                                )}
                                            </ul>
                                            <TopCommentsChart topic={topic} />
                                        </div>

                                        {/* Top 5 usuarios con más respuestas */}
                                        <div className="p-6 border rounded-lg shadow-lg bg-white flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800">Top 5 Usuarios con más respuestas:</h3>
                                            <ul>
                                                {topic.topUsers && topic.topUsers.length > 0 ? (
                                                    topic.topUsers.map((user) => (
                                                        <li key={user.userId} className="text-gray-600 text-xs">
                                                           ID: ({user.userId}) {user.username}: {user.count} respuestas
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="text-gray-500 text-lg">No hay usuarios con más respuestas</li>
                                                )}
                                            </ul>
                                            <TopUsersChart topic={topic} />
                                        </div>

                                    </div>
                                ))
                            ) : (
                                <p className="text-lg text-gray-600">
                                    No hay Temas en esta categoría
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <CreateTopicForm
                visible={createTopicForm}
                onClose={() => setCreateTopicForm(false)}
                forumCategoryId={id}
                onCreate={() => {
                    setCreateTopicForm(false);
                    fetchDataTopic();
                }}
            />

            <UpdateForumTopicForm
                visible={updateTopicForm}
                onClose={() => setUpdateTopicForm(false)}
                forumCategoryId={id}
                TopicData={selectedTopic}
                onUpdate={() => {
                setUpdateTopicForm(false);
                fetchDataTopic();
                }}
            />
        </div>
    );
};

export default ForumViewAdmin;
