import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = `${API_URL}/PE/`;

const commentRequest = axios.create({
    baseURL: api,
    withCredentials: true,
});

export const createComment = (courseId, resourceId, commentData) =>
    commentRequest.post(`comments/course/${courseId}/resource/${resourceId}`, commentData);

export const getCommentsByResource = (resourceId) =>
    commentRequest.get(`comments/resource/${resourceId}`);

export const updateComment = (id, commentData) =>
    commentRequest.put(`comments/comment/${id}`, commentData);

export const deleteComment = (id) =>
    commentRequest.delete(`comments/comment/${id}`);

export const getCommentsByCourse = (courseId) =>
    commentRequest.get(`comments/course/${courseId}`);

export default commentRequest;