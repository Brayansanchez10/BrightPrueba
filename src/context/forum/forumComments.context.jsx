import { createContext, useContext, useState, useEffect } from "react";
import { getCommentsByTopic as getCommentsByTopicApi,
    createForumComments as createForumCommentsApi,
    updateForumComments as updateForumCommentsApi, 
    deleteForumComments as deleteForumCommentsApi,
} from "../../api/forum/forumComments.request.js";


const ForumCommentContext = createContext();

export const useForumComments = () => useContext(ForumCommentContext);

// Proveedor del contexto
export const ForumCommentProvider = ({ children }) => {
    const [comments, setComments] = useState([]);
    

    const getCommentsByTopic = async (topicId) => {
        try {
            const res = await getCommentsByTopicApi(topicId);
            setComments(res.data);
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.error("Error al obtener Commentarios:", error);
            return null;
        }
    };

    const createForumComments = async ({ content, userId, topicId}) => {
        try {
            const newCommentData = {
                content,
                userId: Number(userId),
                topicId: Number(topicId)
            };
            console.log(newCommentData);

            const res = await createForumCommentsApi(newCommentData);
            setComments([...comments, res.data]);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };


    const updateForumComments = async (id, commenetsData) => {
        try {
            const res = await updateForumCommentsApi(id, commenetsData);
            setComments(comments.map((comment) => (comment._id === id ? res.data : comment)));
            console.log(res.data);
            return res.data;
          } catch (error) {
            console.error(error);
            return null;
          }
    };

    const deleteForumComments = async (id) => {
        try {
            await deleteForumCommentsApi(id);
            setComments(comments.filter(comment => comment.id !== id));
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    return (
        <ForumCommentContext.Provider value={{ comments, getCommentsByTopic, createForumComments, updateForumComments, deleteForumComments }}>
            {children}
        </ForumCommentContext.Provider>
    );
};