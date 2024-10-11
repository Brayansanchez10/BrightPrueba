import axios from '../axios';

export const createGeneralComment = (data) => {
  return axios.post('/general-comments', data);
};

export const getGeneralComments = (courseId) => {
  return axios.get(`/general-comments/course/${courseId}`);
};

export const updateGeneralComment = (id, data) => {
  return axios.put(`/general-comments/${id}`, data);
};

export const deleteGeneralComment = (id) => {
  return axios.delete(`/general-comments/${id}`);
};