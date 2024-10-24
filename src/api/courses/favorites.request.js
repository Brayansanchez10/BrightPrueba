import axios from "../axios";

export const addFavorite = (userId, courseId) => 
    axios.post(`/favorite`, { userId, courseId });

export const removeFavorite = (userId, courseId) => 
    axios.delete(`/favorite/${userId}/${courseId}`);

export const getUserFavorites = (userId) => 
    axios.get(`/favorite/user/${userId}`);
