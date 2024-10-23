import axios from "axios";

const api = `http://localhost:3068/PE/`;

const forumFavoriteRequest = axios.create({
    baseURL: api,
    withCredentials: true,
});

export const addForumFavorite = (userId, topicId) =>
    forumFavoriteRequest.post(`favoritesTopic`, {userId, topicId});

export const removeForumTopic = (userId, topicId) =>
    forumFavoriteRequest.delete(`favoritesTopic/${userId}/${topicId}`);

export const getUserForumFavorites = (userId) =>
    forumFavoriteRequest.get(`favoritesTopic/user/${userId}`);

export default forumFavoriteRequest;
