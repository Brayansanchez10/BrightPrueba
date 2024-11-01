import axios from "../axios";

export const createComment = (courseId, resourceId, commentData) => 
    axios.post(`/comments/course/${courseId}/resource/${resourceId}`, commentData);

export const getCommentsByResource = (resourceId) => 
    axios.get(`/comments/resource/${resourceId}`);

export const updateComment = (id, commentData) => 
    axios.put(`/comments/comment/${id}`, commentData);

export const deleteComment = (id) => 
    axios.delete(`/comments/comment/${id}`);

export const getCommentsByCourse = (courseId) => 
    axios.get(`/comments/course/${courseId}`);
