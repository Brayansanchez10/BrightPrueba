import axios from "axios";

const api = 'https://apibrightmind.mesadoko.com/PE/';

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