import axios from "../axios";

export const addForumFavorite = (userId, topicId) =>
    axios.post(`/favoritesTopic`, {userId, topicId});

export const removeForumTopic = (userId, topicId) =>
    axios.delete(`/favoritesTopic/${userId}/${topicId}`);

export const getUserForumFavorites = (userId) =>
    axios.get(`/favoritesTopic/user/${userId}`);

