import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  createChat as createChatApi,
  getUserChats as getUserChatsApi,
  sendMessage as sendMessageApi,
  getChatMessages as getChatMessagesApi,
  editMessage as editMessageApi,
  deleteMessage as deleteMessageApi,
  getLastMessageDate as getLastMessageDateApi,
  getUnreadMessageCount as getUnreadMessageCountApi,
  markMessagesAsRead as markMessagesAsReadApi,
  createGroupChat as createGroupChatApi,
  addParticipants as addParticipantsApi,
  removeParticipant as removeParticipantApi,
  makeAdmin as makeAdminApi,
  leaveGroup as leaveGroupApi,
  updateGroupInfo as updateGroupInfoApi,
  startTyping as startTypingApi,
  stopTyping as stopTypingApi,
} from "../../api/user/chat.request";
import { socket as socketInstance, initSocket } from "../../utils/socket";
import { useAuth } from "../auth.context";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import axios from 'axios';

export const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat debe ser usado dentro de ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const socketRef = useRef();

  useEffect(() => {
    if (!user?.data?.id) return;
    window.updateUnreadCount = (chatId) => {
      setUnreadCounts((prev) => ({
        ...prev,
        [chatId]: (prev[chatId] || 0) + 1,
      }));
    };

    window.updateMessagesRead = (chatId, userId) => {
      if (userId !== user?.data?.id) {
        setUnreadCounts((prev) => ({
          ...prev,
          [chatId]: 0,
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

    socketRef.current = io(import.meta.env.VITE_SOCKET_URL);
    socketRef.current.on("connect", () => {
      socketRef.current.emit("join", user.data.id);
    });

    socketRef.current.on("private message", async (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      if (message.receiverId === user.data.id) {
        setUnreadCounts((prev) => ({
          ...prev,
          [message.chatId]: (prev[message.chatId] || 0) + 1,
        }));
        setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat.id === message.chatId) {
              return {
                ...chat,
                messages: [message, ...(chat.messages || [])],
              };
            }
            return chat;
          })
        );
      }
    });

    socketRef.current.on("message read", ({ chatId, userId }) => {
      if (userId === user.data.id) {
        setUnreadCounts((prev) => ({
          ...prev,
          [chatId]: 0,
        }));
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user?.data?.id]);

  const createChat = useCallback(async (userId1, userId2) => {
    try {
      const response = await createChatApi(userId1, userId2);
      if (response?.data) {
        const updatedChatsResponse = await getUserChatsApi(userId1);
        if (updatedChatsResponse?.data) {
          setChats(updatedChatsResponse.data);
        }
        return response;
      }
      return null;
    } catch (error) {
      console.error("Error al crear chat:", error);
      if (error.response?.status === 400) {
        throw error; 
      }
      throw error;
    }
  }, []);

  const getUnreadMessageCount = useCallback(async (userId, chatId) => {
    try {
      const res = await getUnreadMessageCountApi(userId, chatId);
      setUnreadCounts((prev) => ({ ...prev, [chatId]: res.data.count }));
      return res.data.count;
    } catch (error) {
      console.error("Error al obtener el conteo de mensajes no leídos:", error);
      return 0;
    }
  }, []);

  const markMessagesAsRead = useCallback(async (userId, chatId) => {
    try {
      await markMessagesAsReadApi(userId, chatId);
      setUnreadCounts((prev) => ({ ...prev, [chatId]: 0 }));
      socketRef.current?.emit("messages read", { chatId, userId });
    } catch (error) {
      console.error("Error al marcar los mensajes como leídos:", error);
    }
  }, []);

  const getUserChats = useCallback(
    async (userId) => {
      try {
        if (!userId) {
          console.error("userId es requerido");
          return null;
        }
  
        const res = await getUserChatsApi(userId);
        
        if (res?.data) {
          const validChats = Array.isArray(res.data) ? res.data : [];
          setChats(validChats);
  
          if (validChats.length > 0) {
            const unreadPromises = validChats.map(chat => 
              getUnreadMessageCount(userId, chat.id)
                .catch(err => {
                  console.error(`Error al obtener conteo no leído para chat ${chat.id}:`, err);
                  return 0;
                })
            );
  
            const unreadCounts = await Promise.all(unreadPromises);
            const newUnreadCounts = validChats.reduce((acc, chat, index) => {
              acc[chat.id] = unreadCounts[index];
              return acc;
            }, {});
  
            setUnreadCounts(newUnreadCounts);
          }
          return res;
        }
        
        setChats([]);
        setUnreadCounts({});
        return null;
      } catch (error) {
        console.error("Error al obtener chats del usuario:", error);
        setChats([]); 
        setUnreadCounts({});
        
        if (error.response?.status === 500) {
          console.error("Error del servidor:", error.response.data);
        } else if (error.request) {
          console.error("Error de red:", error.message);
        }
        
        return null;
      }
    },
    [getUnreadMessageCount]
  );

  const sendMessage = useCallback(async (messageData) => {
    try {
        if (!messageData || !messageData.chatId || !messageData.senderId || !messageData.receiverId) {
            throw new Error('Faltan datos requeridos para el mensaje');
        }

        if (messageData.type === 'AUDIO' && !messageData.audioFile) {
            throw new Error('Falta archivo de audio');
        }

        if (messageData.type === 'TEXT' && !messageData.content) {
            throw new Error('Falta contenido del mensaje');
        }

        const response = await sendMessageApi(messageData);

        if (!response?.data) {
            throw new Error('Respuesta del servidor inválida');
        }

        const newMessage = response.data;

  
        setMessages(prev => [...prev, newMessage]);
        setChats(prevChats => 
            prevChats.map(chat => {
                if (chat.id === parseInt(messageData.chatId)) {
                    return {
                        ...chat,
                        lastMessage: newMessage,
                        messages: [...(chat.messages || []), newMessage]
                    };
                }
                return chat;
            })
        );

        return response;
    } catch (error) {
        console.error("Error al enviar mensaje:", error);
        throw error;
    }
}, []);

  const handleAudioRecording = async (action) => {
    try {
      if (action === 'start') {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true,
          video: false 
        });

        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
          setAudioBlob(audioBlob);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);

      } else if (action === 'stop' && mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    } catch (error) {
      console.error('Error en la grabación:', error);
      
      if (error.name === 'NotFoundError') {
        Swal.fire({
          icon: 'error',
          title: "Error - Micrófono",
          text: "No se ha detectado ningun micrófono, conecta un micrófono y vuelve a intentarlo.",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#EF5959",
          background: "#fff",
          customClass: {
          popup: "rounded-[20px]",
          title: "font-bungee text-[#EF5959]",
          content: "font-roboto",
        },
        });
      } else if (error.name === 'NotAllowedError') {
        Swal.fire({
          icon: 'error',
          title: "Error - Permisos",
          text: "Necesitamos permiso para acceder al micrófono. Por favor, permite el acceso en la configuración de tu navegador.",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#EF5959",
          background: "#fff",
          customClass: {
          popup: "rounded-[20px]",
          title: "font-bungee text-[#EF5959]",
          content: "font-roboto",
        },
      });
      } else {
        Swal.fire({
          icon: 'error',
          title: "Error",
          text: "Ocurrió un error al intentar grabar audio. Por favor, intenta de nuevo.",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#EF5959",
          background: "#fff",
          customClass: {
          popup: "rounded-[20px]",
          title: "font-bungee text-[#EF5959]",
          content: "font-roboto",
        },
      });
      }   
      
      setIsRecording(false);
    }
  };

  const removeParticipant = useCallback(async (chatId, userId) => {
    try {
      const response = await removeParticipantApi(chatId, userId);
      if (response.data) {
        setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                participants: chat.participants.filter(
                  (participant) => participant.id !== userId
                ),
              };
            }
            return chat;
          })
        );
      }
      return response.data;
    } catch (error) {
      console.error("Error al eliminar participante:", error);
      throw error;
    }
  }, []);

  const makeAdmin = useCallback(async (chatId, userId) => {
    try {
      const response = await makeAdminApi(chatId, userId);
      if (response.data) {
        setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                admins: [...chat.admins, userId],
              };
            }
            return chat;
          })
        );
      }
      return response.data;
    } catch (error) {
      console.error("Error al hacer admin:", error);
      throw error;
    }
  }, []);

  const leaveGroup = useCallback(async (chatId, userId) => {
    try {
      const response = await leaveGroupApi(chatId, userId);
      if (response.data) {
        setChats((prevChats) => 
          prevChats.filter(chat => chat.id !== chatId)
        );
      }
      return response.data;
    } catch (error) {
      console.error("Error al salir del grupo:", error);
      throw error;
    }
  }, []);

  const updateGroupInfo = useCallback(async (chatId, groupData) => {
    try {
      const response = await updateGroupInfoApi(chatId, groupData);
      if (response.data) {
        setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                ...groupData,
              };
            }
            return chat;
          })
        );
      }
      return response.data;
    } catch (error) {
      console.error("Error al actualizar información del grupo:", error);
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
      return {
        id: messageId,
        content: "Este mensaje ha sido eliminado",
        isDeleted: true,
      };
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

  const updateLocalMessage = useCallback(
    (updatedMessage) => {
      const selectedChatId = parseInt(localStorage.getItem("selectedChatId"));
      
      if (updatedMessage.chatId === selectedChatId) {
        setMessages((prevMessages) => {
          const messageExists = prevMessages.some(
            (msg) => msg.id === updatedMessage.id
          );
          if (messageExists) {
            return prevMessages.map((msg) =>
              msg.id === updatedMessage.id ? { ...msg, ...updatedMessage } : msg
            );
          } else {
            return [...prevMessages, updatedMessage];
          }
        });
      }

      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === updatedMessage.chatId) {
            const updatedMessages = [...(chat.messages || [])];
            const messageIndex = updatedMessages.findIndex(
              (m) => m.id === updatedMessage.id
            );

            if (messageIndex !== -1) {
              updatedMessages[messageIndex] = updatedMessage;
            } else {
              updatedMessages.unshift(updatedMessage);
            }

            return {
              ...chat,
              messages: updatedMessages.slice(0, 1),
            };
          }
          return chat;
        })
      );

      if (
        user?.data?.id &&
        updatedMessage.senderId !== user.data.id &&
        !updatedMessage.isRead &&
        updatedMessage.chatId !== selectedChatId
      ) {
        setUnreadCounts((prev) => ({
          ...prev,
          [updatedMessage.chatId]: (prev[updatedMessage.chatId] || 0) + 1,
        }));
      }
    },
    [user?.data?.id]
  );

  const createGroupChat = useCallback(async (groupData) => {
    try {
      const res = await createGroupChatApi(groupData);
      if (res && res.data) {
        const updatedChats = await getUserChatsApi(user.data.id);
        setChats(updatedChats.data);
        return res.data;
      }
      return null;
    } catch (error) {
      console.error("Error al crear grupo:", error);
      throw error;
    }
  }, [user?.data?.id]);

  const addParticipants = useCallback(async (chatId, participants) => {
    try {
      const res = await addParticipantsApi(chatId, participants);
      return res.data;
    } catch (error) {
      console.error("Error al añadir participantes:", error);
      throw error;
    }
  }, []);

  const startTyping = useCallback(({ chatId, userId }) => {
    try {
      socketRef.current?.emit('typing', { chatId, userId });
    } catch (error) {
      console.error('Error en startTyping:', error);
    }
  }, []);
  
  const stopTyping = useCallback(({ chatId, userId }) => {
    try {
      socketRef.current?.emit('stop typing', { chatId, userId });
    } catch (error) {
      console.error('Error en stopTyping:', error);
    }
  }, []); 

  useEffect(() => {
    if (!user?.data?.id) return;

    window.updateReceivedMessage = (newMessage) => {
      const selectedChatId = parseInt(localStorage.getItem("selectedChatId")) || null;
      
      if (selectedChatId && newMessage.chatId === selectedChatId) { // Si el mensaje es del chat actual
        setMessages(prevMessages => [...prevMessages, newMessage]); // Agregar el mensaje
        markMessagesAsRead(user.data.id, newMessage.chatId); // Marcar los mensajes como leídos
      } else {
        if (newMessage.receiverId === user.data.id && 
            newMessage.senderId !== user.data.id) { // Si el usuario está en otro chat o ningún chat
          setUnreadCounts(prev => ({
            ...prev,
            [newMessage.chatId]: (prev[newMessage.chatId] || 0) + 1, // Incrementar el contador de mensajes no leídos
          }));
        }
      }
      
      // Actualizar la lista de chats con el mensaje mas reciente
      setChats(prevChats =>
        prevChats.map(chat => {
          if (chat.id === newMessage.chatId) {
            return {
              ...chat,
              messages: [newMessage, ...(chat.messages || [])].slice(0, 1) // Mensaje mas reciente
            };
          }
          return chat;
        })
      );
    };

    window.updateMessagesRead = (chatId, userId) => {
      if (userId === user.data.id) {
        setUnreadCounts((prev) => ({
          ...prev,
          [chatId]: 0,
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
        isDeleted: true,
      });
    };

    const socketInstance = initSocket();

    return () => {
      delete window.updateReceivedMessage;
      delete window.updateMessagesRead;
      delete window.updateEditedMessage;
      delete window.updateDeletedMessage;

      if (socketInstance) {
        socketInstance.off("message received");
        socketInstance.off("message edited");
        socketInstance.off("message deleted");
      }
    };
  }, [user?.data?.id, updateLocalMessage, markMessagesAsRead]);

  return (
    <ChatContext.Provider
      value={{
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
        markMessagesAsRead,
        createGroupChat,
        addParticipants,
        removeParticipant,
        makeAdmin,
        leaveGroup,
        updateGroupInfo,
        handleAudioRecording,
        isRecording,
        setIsRecording,
        audioBlob,
        setAudioBlob,
        startTyping,
        stopTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
