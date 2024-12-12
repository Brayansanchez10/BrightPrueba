import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import NavigationBar from "./NavigationBar";
import { useChat } from "../../context/user/chat.context";
import { useAuth } from "../../context/auth.context";
import { useTranslation } from "react-i18next";
import {
  FaUser,
  FaSearch,
  FaPaperPlane,
  FaUserPlus,
  FaUsers,
  FaLock,
  FaEnvelope,
  FaComments,
} from "react-icons/fa";
import {
  RiReplyLine,
  RiPencilLine,
  RiDeleteBinLine,
  RiMoreLine,
  RiCloseLine,
} from "react-icons/ri";
import { Link } from "react-router-dom";
import backgroundImage from "../../assets/img/chat.png";
import {
  socket,
  initSocket,
  leaveChat,
  sendMessage as emitMessage,
  startTyping,
  stopTyping,
  emitEditMessage,
  emitDeleteMessage,
} from "../../utils/socket";
import Friends from "./Friends";
import { MessageSquare } from "lucide-react";
import Swal from "sweetalert2";

export default function Chat() {
  const { t } = useTranslation("global");
  const { user } = useAuth();
  const {
    chats,
    messages,
    unreadCounts,
    getUserChats,
    getChatMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    updateLocalMessage,
    markMessagesAsRead,
    getUnreadMessageCount,
  } = useChat();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const messagesEndRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [localMessages, setLocalMessages] = useState([]);
  const [activeMessageMenu, setActiveMessageMenu] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [activeSection, setActiveSection] = useState("chats");
  const [friendsTab, setFriendsTab] = useState("search");

  useEffect(() => {
    const handleOpenChat = (event) => {
      const chatId = event.detail.chatId;
      const chatToSelect = chats?.find((chat) => chat.id === chatId);
      if (chatToSelect) {
        handleChatSelect(chatToSelect);
      }
    };

    window.addEventListener("openChat", handleOpenChat);
    return () => window.removeEventListener("openChat", handleOpenChat);
  }, [chats]);

  useEffect(() => {
    Swal.fire({
      title: "¡Atención!",
      text: "Todos los chats se eliminarán automáticamente todos los domingos a la medianoche.",
      icon: "warning",
      confirmButtonText: "Entendido",
      confirmButtonColor: "#FF8C00",
      background: "#fff",
      customClass: {
        popup: "rounded-[20px]",
        title: "font-bungee text-[#FF6B00]",
        content: "font-roboto",
      },
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (user?.data?.id) {
      getUserChats(user.data.id);
      initSocket();
    }

    return () => {
      if (selectedChat) {
        leaveChat(selectedChat.id);
      }
    };
  }, [user, getUserChats, selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (selectedChat) {
      const handleMessageReceived = (newMessage) => {
        if (newMessage.senderId !== user.data.id) {
          setLocalMessages((prevMessages) => [...prevMessages, newMessage]);
          updateLocalMessage(newMessage);
        }
      };

      const handleTyping = (typingUserId) => {
        if (typingUserId !== user.data.id) {
          setIsTyping(true);
        }
      };

      const handleStopTyping = (typingUserId) => {
        if (typingUserId !== user.data.id) {
          setIsTyping(false);
        }
      };

      const handleMessageEdited = (editedMessage) => {
        setLocalMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === editedMessage.id
              ? { ...msg, ...editedMessage, isEdited: true }
              : msg
          )
        );
        updateLocalMessage(editedMessage);
      };

      const handleMessageDeleted = (deletedMessageId) => {
        setLocalMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === deletedMessageId
              ? {
                  ...msg,
                  content: "Este mensaje ha sido eliminado",
                  isDeleted: true,
                }
              : msg
          )
        );
        updateLocalMessage({
          id: deletedMessageId,
          content: "Este mensaje ha sido eliminado",
          isDeleted: true,
        });
      };

      socket.on("message received", handleMessageReceived);
      socket.on("typing", handleTyping);
      socket.on("stop typing", handleStopTyping);
      socket.on("message edited", handleMessageEdited);
      socket.on("message deleted", handleMessageDeleted);

      return () => {
        socket.off("message received", handleMessageReceived);
        socket.off("typing", handleTyping);
        socket.off("stop typing", handleStopTyping);
        socket.off("message edited", handleMessageEdited);
        socket.off("message deleted", handleMessageDeleted);
      };
    }
  }, [selectedChat, user.data.id, updateLocalMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChatSelect = useCallback(
    async (chat) => {
      if (selectedChat) {
        leaveChat(selectedChat.id);
      }
      setSelectedChat(chat);
      const fetchedMessages = await getChatMessages(chat.id);
      setLocalMessages(fetchedMessages);
      initSocket(chat.id);
      if (user?.data?.id) {
        await markMessagesAsRead(user.data.id, chat.id);
        localStorage.setItem("selectedChatId", chat.id.toString());
      }

      if (isMobileView) {
        setShowSidebar(false);
      }
    },
    [
      selectedChat,
      getChatMessages,
      isMobileView,
      user?.data?.id,
      markMessagesAsRead,
    ]
  );

  useEffect(() => {
    return () => {
      localStorage.removeItem("selectedChatId");
    };
  }, []);

  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      if (messageInput.trim() && selectedChat) {
        try {
          let content = messageInput;
          if (replyingTo) {
            content = JSON.stringify({
              replyTo: replyingTo.id,
              content: messageInput,
            });
          }

          console.log("Preparando envío de mensaje:", {
            chatId: selectedChat.id,
            senderId: user.data.id,
            receiverId: selectedChat.participants.find(
              (p) => p.userId !== user.data.id
            ).userId,
            content,
          });

          if (editingMessage) {
            const updatedMessage = await editMessage(
              editingMessage.id,
              content
            );
            if (updatedMessage) {
              emitEditMessage(updatedMessage);
              setLocalMessages((prevMessages) =>
                prevMessages.map((msg) =>
                  msg.id === updatedMessage.id ? updatedMessage : msg
                )
              );
              updateLocalMessage(updatedMessage);
            }
            setEditingMessage(null);
          } else {
            const newMessage = await sendMessage({
              chatId: selectedChat.id,
              senderId: user.data.id,
              receiverId: selectedChat.participants.find(
                (p) => p.userId !== user.data.id
              ).userId,
              content,
            });

            if (newMessage) {
              emitMessage(newMessage);
              setLocalMessages((prevMessages) => [...prevMessages, newMessage]);
              updateLocalMessage(newMessage);
            }
          }

          setMessageInput("");
          setReplyingTo(null);
          stopTyping({ chatId: selectedChat.id, userId: user.data.id });
        } catch (error) {
          console.error("Error en handleSendMessage:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo enviar el mensaje. Por favor, intenta de nuevo.",
          });
        }
      }
    },
    [
      messageInput,
      selectedChat,
      replyingTo,
      editingMessage,
      editMessage,
      sendMessage,
      user.data.id,
      updateLocalMessage,
    ]
  );

  const handleInputChange = useCallback(
    (e) => {
      setMessageInput(e.target.value);
      if (selectedChat) {
        startTyping({ chatId: selectedChat.id, userId: user.data.id });

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          stopTyping({ chatId: selectedChat.id, userId: user.data.id });
        }, 1000);
      }
    },
    [selectedChat]
  );

  const handleEditMessage = useCallback((message) => {
    setEditingMessage(message);
    setMessageInput(message.content);
    setReplyingTo(null);
  }, []);

  const handleDeleteMessage = useCallback((message) => {
    setMessageToDelete(message);
    setShowDeleteModal(true);
  }, []);

  const confirmDeleteMessage = useCallback(async () => {
    if (messageToDelete) {
      const deletedMessage = await deleteMessage(messageToDelete.id);
      if (deletedMessage) {
        emitDeleteMessage(messageToDelete.id, selectedChat.id);
        setLocalMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageToDelete.id
              ? {
                  ...msg,
                  content: "Este mensaje ha sido eliminado",
                  isDeleted: true,
                }
              : msg
          )
        );
        updateLocalMessage({
          ...messageToDelete,
          content: "Este mensaje ha sido eliminado",
          isDeleted: true,
        });
      }
      setShowDeleteModal(false);
      setMessageToDelete(null);
    }
  }, [messageToDelete, deleteMessage, selectedChat, updateLocalMessage]);

  const handleReplyMessage = useCallback((message) => {
    setReplyingTo(message);
    setMessageInput("");
    setEditingMessage(null);
  }, []);

  const toggleMessageMenu = useCallback(
    (messageId) => {
      setActiveMessageMenu(activeMessageMenu === messageId ? null : messageId);
    },
    [activeMessageMenu]
  );

  const formatDate = useCallback((date) => {
    const today = new Date();
    const messageDate = new Date(date);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Hoy";
    } else if (
      messageDate.toDateString() ===
      new Date(today.setDate(today.getDate() - 1)).toDateString()
    ) {
      return "Ayer";
    } else {
      return messageDate.toLocaleDateString();
    }
  }, []);

  const formatSidebarTime = useCallback((date) => {
    if (!date) return "";
    const messageDate = new Date(date);
    const now = new Date();

    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate
        .toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .toLowerCase();
    } else if (
      messageDate.toDateString() ===
      new Date(now.setDate(now.getDate() - 1)).toDateString()
    ) {
      return "Ayer";
    } else {
      return messageDate.toLocaleDateString("es-ES");
    }
  }, []);

  useEffect(() => {
    if (selectedChat && user?.data?.id) {
      markMessagesAsRead(user.data.id, selectedChat.id);
    }
  }, [selectedChat, user?.data?.id, markMessagesAsRead]);

  const formatMessageTime = useCallback((date) => {
    return new Date(date)
      .toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
  }, []);

  const groupMessagesByDate = useCallback(
    (messages) => {
      const groups = {};
      messages.forEach((message) => {
        const date = formatDate(message.createdAt);
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(message);
      });
      return groups;
    },
    [formatDate]
  );

  const sortChatsByLatestMessage = useCallback((chats) => {
    return [...chats].sort((a, b) => {
      const latestMessageA = a.messages[0]?.createdAt || a.createdAt;
      const latestMessageB = b.messages[0]?.createdAt || b.createdAt;
      return new Date(latestMessageB) - new Date(latestMessageA);
    });
  }, []);

  const filteredChats = sortChatsByLatestMessage(
    chats?.filter((chat) => {
      const otherParticipant = chat.participants?.find(
        (p) => p.userId !== user.data.id
      )?.user;
      return (
        otherParticipant?.username
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ?? false
      );
    }) ?? []
  );

  const groupedMessages = groupMessagesByDate(localMessages);

  const renderSidebarMessage = useCallback((message) => {
    if (!message) return "No hay mensajes aún";

    let content = message.content;

    try {
      const parsedContent = JSON.parse(content);
      if (parsedContent.replyTo) {
        content = parsedContent.content;
      }
    } catch (e) {}

    return content.length > 50 ? content.slice(0, 50) + "..." : content;
  }, []);

  const renderMessage = useCallback(
    (message) => {
      let messageContent = message.content;
      let replyContent = null;
      let replyUserName = "";

      if (!message.isDeleted) {
        try {
          const parsedContent = JSON.parse(message.content);
          if (parsedContent.replyTo) {
            const repliedMessage = localMessages.find(
              (msg) => msg.id === parsedContent.replyTo
            );
            replyContent = repliedMessage
              ? repliedMessage.content
              : "Mensaje no disponible";
            replyUserName =
              repliedMessage.senderId === user.data.id
                ? "Tú"
                : selectedChat.participants.find(
                    (p) => p.userId === repliedMessage.senderId
                  )?.user.username;
            messageContent = parsedContent.content;
          }
        } catch (e) {}
      }

      const isCurrentUser = message.senderId === user.data.id;

      return (
        <div
          key={message.id}
          className={`mb-4 flex ${
            isCurrentUser ? "justify-end" : "justify-start"
          } mx-8`}
        >
          <div
            className={`flex items-start ${
              isCurrentUser ? "flex-row-reverse" : "flex-row"
            } max-w-[70%]`}
          >
            <div
              className={`w-10 h-10 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center flex-shrink-0 ${
                isCurrentUser ? "ml-2" : "mr-2"
              }`}
            >
              {(isCurrentUser
                ? user.data
                : selectedChat.participants.find(
                    (p) => p.userId === message.senderId
                  )?.user
              )?.userImage ? (
                <img
                  src={
                    (isCurrentUser
                      ? user.data
                      : selectedChat.participants.find(
                          (p) => p.userId === message.senderId
                        )?.user
                    ).userImage
                  }
                  alt={
                    (isCurrentUser
                      ? user.data
                      : selectedChat.participants.find(
                          (p) => p.userId === message.senderId
                        )?.user
                    ).username
                  }
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="text-purple-900 text-base" />
              )}
            </div>
            <div className="flex flex-col relative">
              <div className="group">
                {!message.isDeleted && (
                  <button
                    onClick={() => toggleMessageMenu(message.id)}
                    className={`absolute top-1/2 -translate-y-1/2 ${
                      isCurrentUser ? "left-0 -ml-8" : "right-0 -mr-8"
                    } p-1 rounded-full bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                  >
                    <RiMoreLine className="text-gray-600 text-lg" />
                  </button>
                )}
                {replyContent && !message.isDeleted && (
                  <div className="bg-gray-100 p-2 rounded-t-[15px] text-sm text-gray-600 border-l-4 border-[#783CDA]">
                    <p className="font-bold">{replyUserName}</p>
                    <p className="truncate">{replyContent}</p>
                  </div>
                )}
                <div
                  className={`p-4 rounded-[15px] ${
                    replyContent && !message.isDeleted ? "rounded-t-none" : ""
                  } bg-white shadow-md`}
                >
                  {message.isDeleted ? (
                    <p className="flex items-center text-black">
                      <FaLock className="mr-2" />
                      {messageContent}
                    </p>
                  ) : (
                    <>
                      {messageContent.split("\n").map((paragraph, index) => (
                        <p
                          key={index}
                          className="break-words whitespace-pre-wrap text-black font-roboto text-[13px]"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </>
                  )}
                </div>
                <div
                  className={`text-[11px] text-[#726F7B] font-roboto mt-1 ${
                    isCurrentUser ? "text-right" : "text-left"
                  }`}
                >
                  {formatMessageTime(message.createdAt)}
                  {message.isEdited && <span className="ml-1">| Editado</span>}
                </div>
              </div>
              {activeMessageMenu === message.id && !message.isDeleted && (
                <div
                  className={`absolute ${
                    isCurrentUser ? "right-full mr-2" : "left-full ml-2"
                  } top-0 bg-white rounded-lg shadow-lg z-10 message-menu`}
                >
                  <button
                    onClick={() => handleReplyMessage(message)}
                    className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-100"
                  >
                    <RiReplyLine className="mr-4 text-lg" />
                    <span className="text-sm">Responder</span>
                  </button>
                  {isCurrentUser && (
                    <>
                      <button
                        onClick={() => handleEditMessage(message)}
                        className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-100"
                      >
                        <RiPencilLine className="mr-4 text-lg" />
                        <span className="text-sm">Editar</span>
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(message)}
                        className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-100"
                      >
                        <RiDeleteBinLine className="mr-4 text-lg" />
                        <span className="text-sm">Eliminar</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    },
    [
      localMessages,
      user.data.id,
      selectedChat,
      activeMessageMenu,
      formatMessageTime,
      toggleMessageMenu,
      handleReplyMessage,
      handleEditMessage,
      handleDeleteMessage,
    ]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMessageMenu && !event.target.closest(".message-menu")) {
        setActiveMessageMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMessageMenu]);

  const handleFriendsClick = useCallback(
    (tab) => {
      setActiveSection("friends");
      setFriendsTab(tab);
      if (isMobileView) {
        setShowSidebar(false);
      }
    },
    [isMobileView]
  );

  const handleChatCreated = useCallback(
    async (updatedChats, newChatId) => {
      try {
        await getUserChats(user.data.id);

        if (newChatId) {
          setTimeout(() => {
            const chatToSelect = chats?.find((chat) => chat.id === newChatId);
            if (chatToSelect) {
              handleChatSelect(chatToSelect);
              setActiveSection("chats");
              if (isMobileView) {
                setShowSidebar(false);
              }
            }
          }, 500);
        }
      } catch (error) {
        console.error("Error al manejar la creación del chat:", error);
      }
    },
    [getUserChats, user.data.id, chats, handleChatSelect, isMobileView]
  );

  useEffect(() => {
    if (user?.data?.id) {
      getUserChats(user.data.id);
    }
  }, [user?.data?.id, getUserChats]);

  const handleSectionChange = useCallback(
    (section) => {
      setActiveSection(section);
      if (section !== "chats") {
        setSelectedChat(null);
      }
      if (isMobileView) {
        setShowSidebar(false);
      }
    },
    [isMobileView]
  );

  const handleFriendsTabChange = useCallback(
    (tab) => {
      setFriendsTab(tab);
      setActiveSection("friends");
      if (isMobileView) {
        setShowSidebar(false);
      }
    },
    [isMobileView]
  );

  const renderFriends = useCallback(
    () => (
      <Friends
        onClose={() => setActiveSection("chats")}
        initialTab={friendsTab}
        onTabChange={handleFriendsTabChange}
        onChatCreated={handleChatCreated}
      />
    ),
    [friendsTab, handleFriendsTabChange, handleChatCreated]
  );

  const renderSidebarContent = useCallback(() => {
    switch (activeSection) {
      case "chats":
        return (
          <div className="bg-white rounded-[20px] shadow-md flex-grow flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-2xl font-bungee text-center mb-4 text-[#00D8A1]">
                Chats
              </h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("chat.search")}
                  className="w-full py-3 pl-12 pr-4 rounded-full bg-gray-100 text-lg shadow-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 text-xl" />
              </div>
            </div>
            <div className="flex-grow overflow-y-auto">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-4 cursor-pointer transition-all duration-300 ${
                    selectedChat && selectedChat.id === chat.id
                      ? "bg-[#A98CD9] text-white rounded-tr-[20px] rounded-br-[20px] shadow-lg relative z-10"
                      : "hover:bg-gray-100"
                  } flex items-start relative`}
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center mr-3">
                    {chat.participants.find((p) => p.userId !== user.data.id)
                      ?.user.userImage ? (
                      <img
                        src={
                          chat.participants.find(
                            (p) => p.userId !== user.data.id
                          ).user.userImage
                        }
                        alt={
                          chat.participants.find(
                            (p) => p.userId !== user.data.id
                          ).user.username
                        }
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-purple-900 text-2xl" />
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-center">
                      <h3
                        className={`font-semibold truncate mr-2 ${
                          selectedChat && selectedChat.id === chat.id
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {
                          chat.participants.find(
                            (p) => p.userId !== user.data.id
                          )?.user.username
                        }
                      </h3>
                      <span
                        className={`text-xs whitespace-nowrap ${
                          selectedChat && selectedChat.id === chat.id
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {formatSidebarTime(
                          chat.messages[0]?.createdAt || chat.createdAt
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p
                        className={`text-sm truncate mr-2 ${
                          selectedChat && selectedChat.id === chat.id
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {renderSidebarMessage(chat.messages[0])}
                      </p>
                      {unreadCounts[chat.id] > 0 &&
                        chat.id !==
                          parseInt(localStorage.getItem("selectedChatId")) && (
                          <div className="bg-[#24FF87] rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                            <span className="font-bungee text-white text-sm">
                              {unreadCounts[chat.id]}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "friends":
        return renderFriends();
      default:
        return null;
    }
  }, [
    activeSection,
    t,
    searchTerm,
    filteredChats,
    selectedChat,
    handleChatSelect,
    user.data.id,
    formatSidebarTime,
    renderSidebarMessage,
    renderFriends,
  ]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <NavigationBar />
      <motion.div
        className="h-[calc(100vh-4rem)] mt-16 flex relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="absolute inset-0 bg-white"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.3,
            zIndex: -1,
          }}
        />
        <div
          className={`${
            isMobileView ? (showSidebar ? "w-full" : "hidden") : "w-1/4"
          } flex flex-col h-full px-4 pb-4 relative z-10`}
        >
          <div className="p-4">
            <div className="flex h-16">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center mr-6 mt-3">
                {user?.data?.userImage ? (
                  <img
                    src={user.data.userImage}
                    alt={user.data.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-purple-900 text-2xl" />
                )}
              </div>
              <div className="flex flex-col justify-between h-full mt-2">
                <h2 className="text-[22px] font-roboto font-bold text-black">
                  {user.data.username}
                </h2>
                <div className="flex items-center space-x-10">
                  <button
                    className={`text-[#726F7B] hover:text-gray-700 transition-colors ${
                      activeSection === "friends" && friendsTab === "search"
                        ? "text-[#00D8A1]"
                        : ""
                    }`}
                    onClick={() => handleFriendsClick("search")}
                  >
                    <FaSearch className="text-2xl" />
                  </button>
                  <button
                    className={`text-[#726F7B] hover:text-gray-700 transition-colors ${
                      activeSection === "friends" && friendsTab === "friends"
                        ? "text-[#00D8A1]"
                        : ""
                    }`}
                    onClick={() => handleFriendsClick("friends")}
                  >
                    <FaUsers className="text-2xl" />
                  </button>
                  <button
                    className={`text-[#726F7B] hover:text-gray-700 transition-colors ${
                      activeSection === "friends" && friendsTab === "requests"
                        ? "text-[#00D8A1]"
                        : ""
                    }`}
                    onClick={() => handleFriendsClick("requests")}
                  >
                    <FaUserPlus className="text-2xl" />
                  </button>
                  <button
                    className={`text-[#726F7B] hover:text-gray-700 transition-colors ${
                      activeSection === "chats" ? "text-[#00D8A1]" : ""
                    }`}
                    onClick={() => handleSectionChange("chats")}
                  >
                    <FaEnvelope className="text-2xl" />
                  </button>
                  <div
                    className="text-[#726F7B] hover:text-gray-700 transition-colors cursor-pointer"
                    title="Próximamente: Grupos de chat"
                  >
                    <FaComments className="text-2xl opacity-50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {renderSidebarContent()}
        </div>
        <div
          className={`${
            isMobileView ? (showSidebar ? "hidden" : "w-full") : "w-3/4"
          } flex flex-col h-full relative z-10`}
        >
          <div
            className="absolute inset-0 bg-cover bg-no-repeat opacity-30"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          ></div>
          <div className="relative z-10 flex flex-col h-full bg-transparent">
            {selectedChat ? (
              <>
                <div className="bg-white rounded-[15px] shadow-md m-4">
                  <div className="max-w-[98%] h-[79px] mx-auto flex items-center justify-center px-4">
                    {isMobileView && (
                      <button
                        onClick={() => setShowSidebar(true)}
                        className="absolute left-4 text-gray-600 hover:text-gray-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                    )}
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center mr-4">
                        {selectedChat.participants.find(
                          (p) => p.userId !== user.data.id
                        )?.user.userImage ? (
                          <img
                            src={
                              selectedChat.participants.find(
                                (p) => p.userId !== user.data.id
                              ).user.userImage
                            }
                            alt={
                              selectedChat.participants.find(
                                (p) => p.userId !== user.data.id
                              ).user.username
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaUser className="text-purple-900 text-3xl" />
                        )}
                      </div>
                      <div className="text-center">
                        <Link
                          to={`/profile/${
                            selectedChat.participants.find(
                              (p) => p.userId !== user.data.id
                            ).userId
                          }`}
                          className="font-bungee text-[22px] text-black hover:underline block"
                        >
                          {
                            selectedChat.participants.find(
                              (p) => p.userId !== user.data.id
                            )?.user.username
                          }
                        </Link>
                        <p className="text-[13px] text-[#BBBBBB] font-roboto">
                          {
                            selectedChat.participants.find(
                              (p) => p.userId !== user.data.id
                            )?.user.email
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-grow overflow-y-auto px-6 py-4 custom-scrollbar">
                  <div className="max-w-[98%] mx-auto">
                    {Object.entries(groupedMessages).map(
                      ([date, dateMessages]) => (
                        <div key={date}>
                          <div className="text-center text-sm text-gray-500 my-2">
                            {date}
                          </div>
                          {dateMessages.map(renderMessage)}
                        </div>
                      )
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </div>
                {isTyping && (
                  <div className="px-6 py-2 text-sm text-gray-500">
                    Tu amigo está escribiendo...
                  </div>
                )}
                <form
                  onSubmit={handleSendMessage}
                  className="px-8 pb-8 pr-16 -mb-4"
                >
                  {(editingMessage || replyingTo) && (
                    <div className="mb-2 bg-purple-50 p-2 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-[#783CDA]">
                          {editingMessage
                            ? "Editar mensaje"
                            : `Respondiendo a ${
                                replyingTo.senderId === user.data.id
                                  ? "ti mismo"
                                  : selectedChat.participants.find(
                                      (p) => p.userId === replyingTo.senderId
                                    )?.user.username
                              }`}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingMessage(null);
                            setReplyingTo(null);
                          }}
                          className="text-[#783CDA] hover:text-purple-700 transition-colors"
                        >
                          {editingMessage ? (
                            <RiPencilLine size={18} />
                          ) : (
                            <RiCloseLine size={18} />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {editingMessage
                          ? editingMessage.content
                          : replyingTo.content}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center relative">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      placeholder={t("chat.typeMessage")}
                      className="w-full h-[65px] py-3 px-4 bg-white text-gray-700 rounded-[25px] focus:outline-none focus:ring-2 focus:ring-[#008BD8] pr-16 shadow-2xl mr-12"
                    />
                    <button
                      type="submit"
                      className="absolute right-7 top-1/2 transform -translate-y-1/2 bg-[#008BD8] text-white rounded-full w-[45px] h-[45px] flex items-center justify-center transition-colors focus:outline-none hover:bg-[#0073B1] mr-12"
                    >
                      <FaPaperPlane className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center">
                <MessageSquare className="w-16 h-16 text-gray-500 mb-4" />
                <p className="text-gray-500 text-3xl font-bungee">
                  {t("chat.selectChat")}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <p className="mb-4">
              ¿Estás seguro de que quieres eliminar este mensaje?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteMessage}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
