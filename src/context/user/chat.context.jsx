import React, { useState, createContext, useContext, useEffect, useCallback } from 'react';
import { 
  createChat as createChatApi,
  getUserChats as getUserChatsApi,
  sendMessage as sendMessageApi,
  getChatMessages as getChatMessagesApi,
  editMessage as editMessageApi,
  deleteMessage as deleteMessageApi,
  getLastMessageDate as getLastMessageDateApi,
  getUnreadMessageCount as getUnreadMessageCountApi,
  markMessagesAsRead as markMessagesAsReadApi
} from '../../api/user/chat.request';
import { socket, initSocket } from '../../utils/socket';

export const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if(!context) {
    throw new Error("useChat debe ser usado dentro de ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);

  const createChat = useCallback(async (userId1, userId2) => {
    try {
      const res = await createChatApi(userId1, userId2);
      setChats(prevChats => [...prevChats, res.data]);
      return res.data;
    } catch (error) {
      console.error("Error al crear chat:", error);
      return null;
    }
  }, []);

  
  const getUnreadMessageCount = useCallback(async (userId, chatId) => {
    try {
      const res = await getUnreadMessageCountApi(userId, chatId);
      setUnreadCounts(prev => ({ ...prev, [chatId]: res.data.count }));
      return res.data.count;
    } catch (error) {
      console.error("Error al obtener el conteo de mensajes no leídos:", error);
      return 0;
    }
  }, []);

  const markMessagesAsRead = useCallback(async (userId, chatId) => {
    try {
      await markMessagesAsReadApi(userId, chatId);
      setUnreadCounts(prev => ({ ...prev, [chatId]: 0 }));
    } catch (error) {
      console.error("Error al marcar los mensajes como leídos:", error);
    }
  }, []);

  const getUserChats = useCallback(async (userId) => {
    try {
      const res = await getUserChatsApi(userId);
      setChats(res.data);
      return res.data;
    } catch (error) {
      console.error("Error al obtener chats del usuario:", error);
      return [];
    }
  }, []);

  const sendMessage = useCallback(async (chatId, senderId, receiverId, content) => {
    try {
      const res = await sendMessageApi(chatId, senderId, receiverId, content);
      setMessages(prevMessages => [...prevMessages, res.data]);
      setChats(prevChats => 
        prevChats.map(chat => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [res.data, ...(chat.messages || [])]
            };
          }
          return chat;
        })
      );
      return res.data;
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      return null;
    }
  }, []);

  const getChatMessages = useCallback(async (chatId) => {
    try {
      const res = await getChatMessagesApi(chatId);
      setMessages(res.data);
      return res.data;
    } catch (error) {
      console.error("Error al obtener mensajes del chat:", error);
      return [];
    }
  }, []);

  const editMessage = useCallback(async (messageId, content) => {
    try {
      const res = await editMessageApi(messageId, content);
      return res.data;
    } catch (error) {
      console.error("Error al editar mensaje:", error);
      return null;
    }
  }, []);

  const deleteMessage = useCallback(async (messageId) => {
    try {
      await deleteMessageApi(messageId);
      return { id: messageId, content: "Este mensaje ha sido eliminado", isDeleted: true };
    } catch (error) {
      console.error("Error al eliminar mensaje:", error);
      return null;
    }
  }, []);

  const getLastMessageDate = useCallback(async (chatId) => {
    try {
      const res = await getLastMessageDateApi(chatId);
      return res.data.lastMessageDate;
    } catch (error) {
      console.error("Error al obtener la fecha del último mensaje:", error);
      return null;
    }
  }, []);

  const updateLocalMessage = useCallback((updatedMessage) => {
    setMessages(prevMessages => {
      const messageExists = prevMessages.some(msg => msg.id === updatedMessage.id);
      if (messageExists) {
        return prevMessages.map(msg => 
          msg.id === updatedMessage.id ? { ...msg, ...updatedMessage } : msg
        );
      } else {
        return [...prevMessages, updatedMessage];
      }
    });

    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id === updatedMessage.chatId) {
          const updatedMessages = chat.messages || [];
          const messageIndex = updatedMessages.findIndex(m => m.id === updatedMessage.id);
          
          if (messageIndex !== -1) {
            updatedMessages[messageIndex] = updatedMessage;
          } else {
            updatedMessages.unshift(updatedMessage);
          }
          
          return {
            ...chat,
            messages: updatedMessages
          };
        }
        return chat;
      })
    );
  }, []);

  useEffect(() => {
    window.updateReceivedMessage = (newMessage) => {
      updateLocalMessage(newMessage);
    };

    window.updateEditedMessage = (editedMessage) => {
      updateLocalMessage(editedMessage);
    };

    window.updateDeletedMessage = (deletedMessageId) => {
      updateLocalMessage({
        id: deletedMessageId,
        content: "Este mensaje ha sido eliminado",
        isDeleted: true
      });
    };

    const socketInstance = initSocket();

    return () => {
      delete window.updateReceivedMessage;
      delete window.updateEditedMessage;
      delete window.updateDeletedMessage;
      
      if (socketInstance) {
        socketInstance.off('message received');
        socketInstance.off('message edited');
        socketInstance.off('message deleted');
      }
    };
  }, [updateLocalMessage]);

  return (
    <ChatContext.Provider value={{
      chats,
      messages,
      createChat,
      getUserChats,
      sendMessage,
      getChatMessages,
      editMessage,
      deleteMessage,
      getLastMessageDate,
      updateLocalMessage,
      getUnreadMessageCount,
      markMessagesAsRead
    }}>
      {children}
    </ChatContext.Provider>
  );
};