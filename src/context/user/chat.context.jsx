import React, { useState, createContext, useContext, useEffect, useCallback, useRef } from 'react';
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
import { useAuth } from '../auth.context';
import { io } from 'socket.io-client';

export const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if(!context) {
    throw new Error("useChat debe ser usado dentro de ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const socket = useRef();

  useEffect(() => {
    if (!user?.data?.id) return; 
    window.updateUnreadCount = (chatId) => {
      setUnreadCounts(prev => ({
        ...prev,
        [chatId]: (prev[chatId] || 0) + 1
      }));
    };
  
    window.updateMessagesRead = (chatId, userId) => {
      if (userId !== user?.data?.id) {
        setUnreadCounts(prev => ({
          ...prev,
          [chatId]: 0
        }));
      }
    };
  
    return () => {
      delete window.updateUnreadCount;
      delete window.updateMessagesRead;
    };
  }, [user?.data?.id]);

  useEffect(() => {
    if (!user?.data?.id) return;
  
    socket.current = io(import.meta.env.VITE_SOCKET_URL);
    socket.current.on('connect', () => {
      socket.current.emit('join', user.data.id);
    });
  
    socket.current.on('private message', async (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
      if (message.receiverId === user.data.id) {
        setUnreadCounts(prev => ({
          ...prev,
          [message.chatId]: (prev[message.chatId] || 0) + 1
        }));
        setChats(prevChats => 
          prevChats.map(chat => {
            if (chat.id === message.chatId) {
              return {
                ...chat,
                messages: [message, ...(chat.messages || [])]
              };
            }
            return chat;
          })
        );
      }
    });
  
    socket.current.on('message read', ({ chatId, userId }) => {
      if (userId === user.data.id) {
        setUnreadCounts(prev => ({
          ...prev,
          [chatId]: 0
        }));
      }
    });
  
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [user?.data?.id]);

  const createChat = useCallback(async (userId1, userId2) => {
    try {
      const res = await createChatApi(userId1, userId2);
      if (res && res.data) {
        const updatedChats = await getUserChatsApi(userId1);
        if (updatedChats && updatedChats.data) {
          setChats(updatedChats.data);
        }
        return res;
      }
      return null;
    } catch (error) {
      console.error("Error al crear chat:", error);
      throw error;
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
      socket.current?.emit('messages read', { chatId, userId });
    } catch (error) {
      console.error("Error al marcar los mensajes como leídos:", error);
    }
  }, []);

  const getUserChats = useCallback(async (userId) => {
    try {
      const res = await getUserChatsApi(userId);
      if (res && res.data) {
        setChats(res.data);
        res.data.forEach(async (chat) => {
          const count = await getUnreadMessageCount(userId, chat.id);
          setUnreadCounts(prev => ({
            ...prev,
            [chat.id]: count
          }));
        });
        return res;
      }
      return null;
    } catch (error) {
      console.error("Error al obtener chats del usuario:", error);
      throw error;
    }
  }, [getUnreadMessageCount]);

  const sendMessage = useCallback(async (messageData) => {
    try {
        const response = await sendMessageApi(
            messageData.chatId,
            messageData.senderId,
            messageData.receiverId,
            messageData.content
        );
        const newMessage = response.data;
        
        setMessages(prev => [...prev, newMessage]);
        setChats(prevChats => 
            prevChats.map(chat => {
                if (chat.id === messageData.chatId) {
                    return {
                        ...chat,
                        messages: [newMessage, ...(chat.messages || [])]
                    };
                }
                return chat;
            })
        );

        socket.current?.emit('private message', newMessage);
        return newMessage;
    } catch (error) {
        console.error("Error al enviar mensaje:", error);
        throw error;
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
          const updatedMessages = [...(chat.messages || [])];
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
  
    const selectedChatId = localStorage.getItem('selectedChatId');
    if (user?.data?.id && 
        updatedMessage.senderId !== user.data.id && 
        !updatedMessage.isRead && 
        updatedMessage.chatId !== parseInt(selectedChatId)) {
      setUnreadCounts(prev => ({
        ...prev,
        [updatedMessage.chatId]: (prev[updatedMessage.chatId] || 0) + 1
      }));
    }
  }, [user?.data?.id]);

  useEffect(() => {
    if (!user?.data?.id) return;
  
    window.updateReceivedMessage = (newMessage) => {
      const selectedChatId = parseInt(localStorage.getItem('selectedChatId'));
      
      // Actualizar el mensaje localmente
      updateLocalMessage(newMessage);
      
      // Actualizar el contador de mensajes no leídos solo si:
      // 1. El mensaje es para el usuario actual
      // 2. No es un mensaje enviado por el usuario actual
      // 3. El chat no está seleccionado actualmente
      if (newMessage.receiverId === user.data.id && 
          newMessage.senderId !== user.data.id && 
          newMessage.chatId !== selectedChatId) {
        setUnreadCounts(prev => ({
          ...prev,
          [newMessage.chatId]: (prev[newMessage.chatId] || 0) + 1
        }));
      }
    };
  
    window.updateMessagesRead = (chatId, userId) => {
      if (userId === user.data.id) {
        setUnreadCounts(prev => ({
          ...prev,
          [chatId]: 0
        }));
      }
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
      delete window.updateMessagesRead;
      delete window.updateEditedMessage;
      delete window.updateDeletedMessage;
      
      if (socketInstance) {
        socketInstance.off('message received');
        socketInstance.off('message edited');
        socketInstance.off('message deleted');
      }
    };
  }, [user?.data?.id, updateLocalMessage]);

  return (
    <ChatContext.Provider value={{
      chats,
      messages,
      unreadCounts,
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