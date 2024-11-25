import axios from '../axios';

export const createNotification = (notificationData) => {
  return axios.post('/notifications', notificationData);
};

export const getUserNotifications = (userId) => {
  return axios.get(`/notifications/user/${userId}`);
};

export const markNotificationAsRead = (notificationId) => {
  return axios.put(`/notifications/${notificationId}/read`);
};

export const deleteNotification = (notificationId) => {
  return axios.delete(`/notifications/${notificationId}`);
};
