import React, { useState, createContext, useContext, useEffect } from 'react';
import { 
    getAllForumTopic as getAllForumTopicApi, 
    getForumTopicByCategoryId as getForumTopicByCategoryIdApi, 
    createForumTopic as createForumTopicApi, 
    updateForumTopic as updateForumTopicApi, 
    deleteForumTopic as deleteForumTopicApi,
    getTopicById     as getTopicByIdApi
} from '../../api/forum/topic.request.js';

export const TopicContext = createContext();

export const useForumTopic = () => {
    const context = useContext(TopicContext);
    if(!context) {
        throw new Error("useForumCategories debe ser usado dentro de CoursesProvider");
    }
    return context;
};

export const TopicProvider = ({ children }) => {
    const [ topic, setTopic ] = useState([]);

    const getAllForumTopic = async () => {
        try {
            const res = await getAllForumTopicApi();
            setTopic(res.data);
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    // Función para obtener un tema por su ID
    const getTopicById = async (id) => {
        try {
            const res = await getTopicByIdApi(id);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    // Función para obtener un tema relacionado a una categoría de un foro 
    const getForumTopicByCategoryId = async (forumCategoryId) => {
        try {
            const res = await getForumTopicByCategoryIdApi(forumCategoryId);
            setTopic(res.data);
            return res.data;
        } catch (error) {
            console.error("Error al obtener los recursos", error);
            return null;
        }
    };

    const createForumTopic = async ({ title, Content, userId, forumCategoryId }) => {
        try {
            const newTopic = {
                title,
                Content,
                userId: Number(userId),
                forumCategoryId: Number(forumCategoryId)
            };

            console.log(newTopic);
            const res = await createForumTopicApi(newTopic);
            setTopic([...topic, res.data]);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const updateForumTopic = async (id, { title, Content, userId, forumCategoryId}) => {
        try {
            const topicData = {
                title,
                Content,
                userId: Number(userId),
                forumCategoryId: Number(forumCategoryId)
            };

            const res = await updateForumTopicApi(id, topicData);
            setTopic(prevTopic =>
                prevTopic.map(topics =>
                    topics.id === id ? res.data : topics
                )
            );
            return res.data;
        } catch (error) {
            console.error("Error al actualizar recurso:", error);
            throw error;
        }
    };

    const deleteForumTopic = async (id) => {
        try {
            await deleteForumTopicApi(id);
            setTopic(prevTopic =>
                prevTopic.filter(topics => topics.id !== id)
            );
        } catch (error) {
            console.error("Error al eliminar", error);
            throw error;
        }
    };

    useEffect(() => {
        getAllForumTopic();
    }, []);

    return (
        <TopicContext.Provider value={{ topic, getForumTopicByCategoryId, createForumTopic, updateForumTopic, deleteForumTopic, getTopicById}}>
            {children}
        </TopicContext.Provider>
    );
};