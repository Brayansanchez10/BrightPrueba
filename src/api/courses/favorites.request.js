import axios from "axios";

const api = `https://apibrightmind.mesadoko.com/PE/`;

const favoriteRequest = axios.create({
    baseURL: api,
    withCredentials: true,
});

export const addFavorite = (userId, courseId) =>
    favoriteRequest.post(`favorite`, { userId, courseId });

export const removeFavorite = (userId, courseId) =>
    favoriteRequest.delete(`favorite/${userId}/${courseId}`);

export const getUserFavorites = (userId) =>
    favoriteRequest.get(`favorite/user/${userId}`);

export default favoriteRequest;