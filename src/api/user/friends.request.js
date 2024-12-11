import axios from "../axios";

export const sendFriendRequest = (senderId, receiverId) => 
  axios.post('/friends/sendRequest', { senderId, receiverId });

export const acceptFriendRequest = (requestId) => 
  axios.put(`/friends/acceptRequest/${requestId}`);

export const rejectFriendRequest = (requestId) => 
  axios.put(`/friends/rejectRequest/${requestId}`);

export const getPendingFriendRequests = (userId) => 
  axios.get(`/friends/pendingRequests/${userId}`);

export const getFriendsList = (userId) => 
  axios.get(`/friends/friendsList/${userId}`);

export const searchUsers = (userId, query) => 
  axios.get(`/friends/searchUsers/${userId}`, { params: { query } });

export const deleteFriend = (userId, friendId) => 
  axios.delete(`/friends/deleteFriend/${userId}/${friendId}`);