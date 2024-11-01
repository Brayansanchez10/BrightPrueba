import axios from "../axios";

export const addLikes = (userId, commentsId) => 
    axios.post(`/likes`, { userId, commentsId });

export const removeLikes = (userId, commentsId) => 
    axios.delete(`/likes/${userId}/${commentsId}`);

export const getUserLikes = (userId) => 
    axios.get(`/likes/user/${userId}`);
