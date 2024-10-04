import axios from "axios";

const api = 'http://localhost:3068/PE/';

const commentRequest = axios.create({
    baseURL: api,
    withCredentials: true,
});

export const createComment = (courseId, resourceId, commentData) => 
    commentRequest.post(`comments/course/${courseId}/resource/${resourceId}`, commentData);

export const getCommentsByResource = (resourceId) => 
    commentRequest.get(`comments/resource/${resourceId}`);

export const updateComment = (id, commentData) => 
    commentRequest.put(`comments/${id}`, commentData);

export const deleteComment = (id) => 
    commentRequest.delete(`comments/${id}`);

export const getCommentsByCourse = (courseId) => 
    commentRequest.get(`comments/course/${courseId}`);

export default commentRequest;