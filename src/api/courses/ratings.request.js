import axios from "../axios";

export const createRating = (courseId, resourceId, ratingData) => 
    axios.post(`/ratings/course/${courseId}/resource/${resourceId}`, ratingData);

export const getRatingsByCourse = (courseId) => 
    axios.get(`/ratings/course/${courseId}`);

export const getRatingsByResource = (resourceId) => 
    axios.get(`/ratings/resource/${resourceId}`);

export const updateRating = (id, ratingData) => 
    axios.put(`/ratings/${id}`, ratingData);

export const deleteRating = (id) => 
    axios.delete(`/ratings/${id}`);