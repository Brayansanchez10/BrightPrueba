import axios from "axios";

const api = `http://localhost:3068/PE/`;

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