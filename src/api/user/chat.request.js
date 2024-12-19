import axios from "../axios";

export const createChat = async (userId1, userId2) => {
  try {
    const response = await axios.post(
      "/chat/createChat",
      { 
        userId: userId1,
        participantId: userId2 
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error al crear un chat:", error);
    throw error;
  }
};

export const getUserChats = async (userId) => {
  try {
    const response = await axios.get(`/chat/getUserChats/${userId}`);
    return response;
  } catch (error) {
    console.error("Error en getUserChats request:", error.response?.data || error);
    throw error;
  }
};

export const sendMessage = async (messageData) => {
  try {
    const formData = new FormData();
    formData.append('chatId', messageData.chatId);
    formData.append('senderId', messageData.senderId);
    formData.append('receiverId', messageData.receiverId);
    formData.append('type', messageData.type);
    if (messageData.type === 'AUDIO' && messageData.audioFile) {
      const audioFile = new File([messageData.audioFile], 'audio.mp3', {
        type: 'audio/mp3'
      });
      formData.append('audioFile', audioFile);
    } 
    else if (messageData.content) {
      formData.append('content', messageData.content);
    }

    const response = await axios.post("/chat/sendMessage", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response;
  } catch (error) {
    console.error("Error al enviar mensaje:", error.response?.data || error);
    throw error;
  }
};

export const getChatMessages = (chatId) =>
  axios.get(`/chat/getChatMessages/${chatId}`);

export const editMessage = async (messageId, content) => {
  try {
    return axios.put(
      `/chat/editMessage/${messageId}`,
      { content },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error al editar el mensaje:", error);
    throw error;
  }
};

export const deleteMessage = (messageId) =>
  axios.delete(`/chat/deleteMessage/${messageId}`);

export const getLastMessageDate = (chatId) =>
  axios.get(`/chat/getLastMessageDate/${chatId}`);

export const getUnreadMessageCount = (userId, chatId) =>
  axios.get(`/chat/getUnreadMessageCount/${userId}/${chatId}`);

export const markMessagesAsRead = (userId, chatId) =>
  axios.put(`/chat/markMessagesAsRead/${userId}/${chatId}`);

export const createGroupChat = async (groupData) => {
  try {
    return axios.post("/chat/createGroupChat", groupData);
  } catch (error) {
    console.error("Error al crear grupo:", error);
    throw error;
  }
};

export const addParticipants = async (chatId, participants) => {
  try {
    return axios.post(`/chat/group/addParticipants/${chatId}`, { participants });
  } catch (error) {
    console.error("Error al añadir participantes:", error);
    throw error;
  }
};

export const removeParticipant = async (chatId, userId) => {
  try {
    return axios.delete(`/chat/group/removeParticipant/${chatId}/${userId}`);
  } catch (error) {
    console.error("Error al eliminar participante:", error);
    throw error;
  }
};

export const makeAdmin = async (chatId, userId) => {
  try {
    return axios.put(`/chat/group/makeAdmin/${chatId}/${userId}`);
  } catch (error) {
    console.error("Error al hacer admin:", error);
    throw error;
  }
};

export const leaveGroup = async (chatId, userId) => {
  try {
    return axios.delete(`/chat/group/leave/${chatId}/${userId}`);
  } catch (error) {
    console.error("Error al salir del grupo:", error);
    throw error;
  }
};

export const updateGroupInfo = async (chatId, groupData) => {
  try {
    return axios.put(`/chat/group/update/${chatId}`, groupData);
  } catch (error) {
    console.error("Error al actualizar información del grupo:", error);
    throw error;
  }
};

export const startTyping = async (chatId, userId) => {
  try {
    await axios.post('/chat/typing', { chatId, userId });
  } catch (error) {
    console.error('Error al enviar evento typing:', error);
    throw error;
  }
};

export const stopTyping = async (chatId, userId) => {
  try {
    await axios.post('/chat/stop-typing', { chatId, userId });
  } catch (error) {
    console.error('Error al enviar evento stop typing:', error);
    throw error;
  }
};

export const sendAudioMessage = async (formData) => {
  try {
    const response = await axios.post("/chat/send-audio", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error("Error al enviar mensaje de audio:", error);
    throw error;
  }
};