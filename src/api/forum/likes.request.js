import axios from "axios";

const api = 'https://apibrightmind.mesadoko.com/PE/';

const likesRequest = axios.create({
    baseURL: api,
    withCredentials: true,
});

export const addLikes = (userId, commentsId) => 
    likesRequest.post(`likes`, { userId, commentsId });

export const removeLikes = (userId, commentsId) => 
    likesRequest.delete(`likes/${userId}/${commentsId}`);

export const getUserLikes = (userId) => 
    likesRequest.get(`likes/user/${userId}`);

export default likesRequest;