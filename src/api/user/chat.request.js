import axios from "../axios";

export const createChat = async (userId1, userId2) => {
    try {
        return axios.post('/chat/createChat', { userId1, userId2 }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Error al crear un chat:", error);
        throw error;
    }
};

export const getUserChats = (userId) => axios.get(`/chat/getUserChats/${userId}`);

export const sendMessage = async (chatId, senderId, receiverId, content) => {
    try {
        const messageData = {
            chatId,
            senderId,
            receiverId,
            content
        };
        return axios.post('/chat/sendMessage', messageData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Error al enviar un mensaje:", error);
        throw error;
    }
};

export const getChatMessages = (chatId) => axios.get(`/chat/getChatMessages/${chatId}`);

export const editMessage = async (messageId, content) => {
    try {
        return axios.put(`/chat/editMessage/${messageId}`, { content }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Error al editar el mensaje:", error);
        throw error;
    }
};

export const deleteMessage = (messageId) => axios.delete(`/chat/deleteMessage/${messageId}`);

export const getLastMessageDate = (chatId) => axios.get(`/chat/getLastMessageDate/${chatId}`);

export const getUnreadMessageCount = (userId, chatId) => axios.get(`/chat/getUnreadMessageCount/${userId}/${chatId}`);

export const markMessagesAsRead = (userId, chatId) => axios.put(`/chat/markMessagesAsRead/${userId}/${chatId}`);