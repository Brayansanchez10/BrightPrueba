import axios from "axios";

const api = `https://apibrightmind.mesadoko.com/PE/ratings/`;

const ratingsRequest = axios.create({
    baseURL: api,
    withCredentials: true,
});

export const createRating = (courseId, resourceId, ratingData) => 
    ratingsRequest.post(`/course/${courseId}/resource/${resourceId}`, ratingData);

export const getRatingsByCourse = (courseId) => 
    ratingsRequest.get(`/course/${courseId}`);

export const getRatingsByResource = (resourceId) => 
    ratingsRequest.get(`/resource/${resourceId}`);

export const updateRating = (id, ratingData) => 
    ratingsRequest.put(`/${id}`, ratingData);

export const deleteRating = (id) => 
    ratingsRequest.delete(`/${id}`);

export default ratingsRequest;