import axios from "axios";

const api = `http://localhost:3068/PE/`;

const bookmarkRequest = axios.create({
    baseURL: api,
    withCredentials: true,
});

export const addBookmark = (userId, commentId) => 
    bookmarkRequest.post(`bookmark`, { userId, commentId });

export const removeBookmark = (userId, commentId) => 
    bookmarkRequest.delete(`bookmark/${userId}/${commentId}`);

export const getUserBookmark = (userId) => 
    bookmarkRequest.get(`bookmark/user/${userId}`);

export default bookmarkRequest;