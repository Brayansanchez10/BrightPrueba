import axios from "../axios";

export const addBookmark = (userId, commentId) => 
    axios.post(`/bookmark`, { userId, commentId });

export const removeBookmark = (userId, commentId) => 
    axios.delete(`/bookmark/${userId}/${commentId}`);

export const getUserBookmark = (userId) => 
    axios.get(`/bookmark/user/${userId}`);

export default axios;