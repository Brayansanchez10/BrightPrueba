import React, { useState, createContext, useContext, useEffect } from 'react';
import {
  sendFriendRequest as sendFriendRequestApi,
  acceptFriendRequest as acceptFriendRequestApi,
  rejectFriendRequest as rejectFriendRequestApi,
  getPendingFriendRequests as getPendingFriendRequestsApi,
  getFriendsList as getFriendsListApi,
  searchUsers as searchUsersApi,
  deleteFriend as deleteFriendApi
} from '../../api/user/friends.request';

export const FriendsContext = createContext();

export const useFriends = () => {
  const context = useContext(FriendsContext);
  if (!context) {
    throw new Error("useFriends debe ser usado dentro de FriendsProvider");
  }
  return context;
};

export const FriendsProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const sendFriendRequest = async (senderId, receiverId) => {
    try {
      const res = await sendFriendRequestApi(senderId, receiverId);
      return res.data;
    } catch (error) {
      console.error("Error al enviar solicitud de amistad:", error);
      throw error;
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      const res = await acceptFriendRequestApi(requestId);
      setPendingRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
      return res.data;
    } catch (error) {
      console.error("Error al aceptar solicitud de amistad:", error);
      throw error;
    }
  };

  const rejectFriendRequest = async (requestId) => {
    try {
      const res = await rejectFriendRequestApi(requestId);
      setPendingRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
      return res.data;
    } catch (error) {
      console.error("Error al rechazar solicitud de amistad:", error);
      throw error;
    }
  };

  const getPendingFriendRequests = async (userId) => {
    try {
      const res = await getPendingFriendRequestsApi(userId);
      setPendingRequests(res.data);
      return res.data;
    } catch (error) {
      console.error("Error al obtener solicitudes de amistad pendientes:", error);
      throw error;
    }
  };

  const getFriendsList = async (userId) => {
    try {
      const res = await getFriendsListApi(userId);
      setFriends(res.data);
      return res.data;
    } catch (error) {
      console.error("Error al obtener lista de amigos:", error);
      throw error;
    }
  };

  const searchUsers = async (userId, query) => {
    try {
      const res = await searchUsersApi(userId, query);
      return res.data;
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      throw error;
    }
  };

  const deleteFriend = async (userId, friendId) => {
    try {
      const res = await deleteFriendApi(userId, friendId);
      setFriends(prevFriends => prevFriends.filter(friend => friend.id !== friendId));
      return res.data;
    } catch (error) {
      console.error("Error al eliminar amigo:", error);
      throw error;
    }
  };

  return (
    <FriendsContext.Provider value={{
      friends,
      pendingRequests,
      sendFriendRequest,
      acceptFriendRequest,
      rejectFriendRequest,
      getPendingFriendRequests,
      getFriendsList,
      searchUsers,
      deleteFriend
    }}>
      {children}
    </FriendsContext.Provider>
  );
};