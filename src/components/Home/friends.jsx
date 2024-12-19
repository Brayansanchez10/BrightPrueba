import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaCheck,
  FaTimes,
  FaTrash,
  FaEnvelope,
  FaUserPlus,
  FaSearch,
  FaInbox,
  FaUserFriends,
} from "react-icons/fa";
import { useFriends } from "../../context/user/friends.context";
import { useAuth } from "../../context/auth.context";
import { useChat } from "../../context/user/chat.context";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Friends = ({ onClose, onChatCreated, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab || "requests");
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation("global");

  const showNotification = (message, type) => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "info":
        toast.info(message);
        break;
      default:
        toast(message);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "requests":
        return <FriendRequests searchTerm={searchTerm} />;
      case "friends":
        return (
          <FriendsList onChatCreated={onChatCreated} searchTerm={searchTerm} />
        );
      case "search":
        return <SearchPeople searchTerm={searchTerm} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-secondary rounded-[20px] shadow-md flex-grow flex flex-col overflow-hidden h-full">
      <div className="p-4 border-b border-gray-200 dark:border-[#6037a1]">
        <h2 className="text-2xl font-bungee text-center mb-4 text-[#00D8A1]">
          {activeTab === "requests" && "Solicitudes"}
          {activeTab === "search" && "Buscar amigos"}
          {activeTab === "friends" && "Amigos"}
        </h2>
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-2 py-2 text-sm sm:px-4 sm:py-2 sm:text-base rounded-full transition-colors ${
              activeTab === 'requests' 
                ? 'bg-[#00D8A1] text-white' 
                : 'bg-gray-100 dark:bg-primary text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-[#4ecfaf]'
            }`}
          >
            Solicitudes
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-2 py-2 text-sm sm:px-4 sm:py-2 sm:text-base rounded-full transition-colors ${
              activeTab === 'friends' 
                ? 'bg-[#00D8A1] text-white' 
                : 'bg-gray-100 dark:bg-primary text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-[#4ecfaf]'
            }`}
          >
            Amigos
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-2 py-2 text-sm sm:px-4 sm:py-2 sm:text-base rounded-full transition-colors ${
              activeTab === 'search' 
                ? 'bg-[#00D8A1] text-white' 
                : 'bg-gray-100 dark:bg-primary text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-[#4ecfaf]'
            }`}
          >
            Buscar
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder={t("chat.searchPeople")}
            className="w-full py-3 pl-12 pr-4 rounded-full bg-gray-100 dark:bg-primary dark:text-primary text-lg shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-primary text-xl" />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto custom-scrollbar-y">{renderContent()}</div>
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <svg width="0" height="0">
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#783CDA" />
          <stop offset="100%" stopColor="#00D8A1" />
        </linearGradient>
      </svg>
    </div>
  );
};

const FriendRequests = ({ searchTerm }) => {
  const {
    pendingRequests,
    getPendingFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
  } = useFriends();
  const { user } = useAuth();
  const [filteredRequests, setFilteredRequests] = useState([]);

  useEffect(() => {
    if (user && user.data && user.data.id) {
      getPendingFriendRequests(user.data.id);
    }
  }, [user]);

  useEffect(() => {
    setFilteredRequests(
      pendingRequests.filter((request) =>
        request.sender.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [pendingRequests, searchTerm]);

  const handleAccept = async (requestId) => {
    try {
      await acceptFriendRequest(requestId);
      getPendingFriendRequests(user.data.id);
      Swal.fire({
        icon: "success",
        title: "¡Solicitud aceptada!",
        text: "La solicitud de amistad ha sido aceptada exitosamente.",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#00D8A1",
        background: "#fff",
        customClass: {
          popup: "rounded-[20px]",
          title: "font-bungee text-[#00D8A1]",
          content: "font-roboto",
        },
      });
    } catch (error) {
      console.error("Error al aceptar la solicitud:", error);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "No se pudo aceptar la solicitud de amistad.",
        confirmButtonText: "Intentar de nuevo",
        confirmButtonColor: "#DC3545",
        background: "#fff",
        customClass: {
          popup: "rounded-[20px]",
          title: "font-bungee text-[#DC3545]",
          content: "font-roboto",
        },
      });
    }
  };

  const handleReject = async (requestId) => {
    try {
      await rejectFriendRequest(requestId);
      getPendingFriendRequests(user.data.id);
      Swal.fire({
        icon: "info",
        title: "Solicitud rechazada",
        text: "La solicitud de amistad ha sido rechazada.",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#0DCAF0",
        background: "#fff",
        customClass: {
          popup: "rounded-[20px]",
          title: "font-bungee text-[#0DCAF0]",
          content: "font-roboto",
        },
      });
    } catch (error) {
      console.error("Error al rechazar la solicitud:", error);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "No se pudo rechazar la solicitud de amistad.",
        confirmButtonText: "Intentar de nuevo",
        confirmButtonColor: "#DC3545",
        background: "#fff",
        customClass: {
          popup: "rounded-[20px]",
          title: "font-bungee text-[#DC3545]",
          content: "font-roboto",
        },
      });
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center">
      {filteredRequests.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center text-center pt-32"
        >
          <FaInbox
            className="text-6xl mb-4"
            style={{ fill: "url(#gradient)" }}
          />
          <h3 className="font-bungee text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#783CDA] to-[#00D8A1]">
            No hay solicitudes pendientes
          </h3>
        </motion.div>
      ) : (
        <div className="w-full">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="p-4 cursor-pointer transition-all duration-300 hover:bg-gray-100 dark:hover:bg-primary flex items-start"
            >
              <div className="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center mr-3">
                {request.sender.userImage ? (
                  <img
                    src={request.sender.userImage}
                    alt={request.sender.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-purple-900 text-2xl" />
                )}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold truncate mr-2 dark:text-primary">
                    {request.sender.username}
                  </h3>
                  <span className="text-xs whitespace-nowrap flex-shrink-0 dark:text-gray-200">
                    {new Date(request.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center dark:text-gray-200">
                  <p className="text-sm truncate">
                    Solicitud de amistad pendiente
                  </p>
                  <div>
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="bg-[#24FF87] text-white p-2 rounded-full mr-2 hover:bg-[#1FD672] transition-colors"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="bg-[#F44336] text-white p-2 rounded-full hover:bg-[#D32F2F] transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FriendsList = ({ onChatCreated, searchTerm }) => {
  const { friends, getFriendsList, deleteFriend } = useFriends();
  const { user } = useAuth();
  const { createChat, getUserChats } = useChat();
  const [filteredFriends, setFilteredFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.data && user.data.id) {
      getFriendsList(user.data.id);
    }
  }, [user]);

  useEffect(() => {
    setFilteredFriends(
      friends.filter((friend) =>
        friend.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [friends, searchTerm]);

  const handleDeleteFriend = async (friendId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres eliminar a este amigo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF8C00",
      cancelButtonColor: "#6C757D",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#fff",
      customClass: {
        popup: "rounded-[20px]",
        title: "font-bungee text-[#FF8C00]",
        content: "font-roboto",
      },
    });

    if (result.isConfirmed) {
      try {
        await deleteFriend(user.data.id, friendId);
        getFriendsList(user.data.id);
        Swal.fire({
          title: "¡Eliminado!",
          text: "El amigo ha sido eliminado de tu lista.",
          icon: "success",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#00D8A1",
          background: "#fff",
          customClass: {
            popup: "rounded-[20px]",
            title: "font-bungee text-[#00D8A1]",
            content: "font-roboto",
          },
        });
      } catch (error) {
        console.error("Error al eliminar amigo:", error);
        Swal.fire({
          title: "¡Error!",
          text: "No se pudo eliminar al amigo.",
          icon: "error",
          confirmButtonText: "Intentar de nuevo",
          confirmButtonColor: "#DC3545",
          background: "#fff",
          customClass: {
            popup: "rounded-[20px]",
            title: "font-bungee text-[#DC3545]",
            content: "font-roboto",
          },
        });
      }
    }
  };

  const handleSendMessage = async (friendId) => {
    try {
      const response = await createChat(user.data.id, friendId);

      if (response && response.data) {
        const updatedChats = await getUserChats(user.data.id);
        const chatToOpen = response.data.id
          ? response.data
          : updatedChats.find((chat) =>
              chat.participants.some((p) => p.userId === friendId)
            );

        if (chatToOpen) {
          await onChatCreated(updatedChats, chatToOpen.id);
          Swal.fire({
            icon: "success",
            title: "Chat creado",
            text: "El chat ha sido creado exitosamente",
            confirmButtonText: "Ir al chat",
            confirmButtonColor: "#00D8A1",
            showCancelButton: true,
            cancelButtonText: "Aceptar",
            cancelButtonColor: "#6C757D",
            background: "#fff",
            customClass: {
              popup: "rounded-[20px]",
              title: "font-bungee text-[#00D8A1]",
              content: "font-roboto",
            },
          }).then((result) => {
            navigate("/chat");
            if (result.isConfirmed) {
              setTimeout(() => {
                const chatEvent = new CustomEvent("openChat", {
                  detail: { chatId: chatToOpen.id },
                });
                window.dispatchEvent(chatEvent);
              }, 300);
            }
          });
        }
      }
    } catch (error) {
      console.error("Error al crear chat:", error);
      if (
        error.response?.status === 400 &&
        error.response?.data?.error === "Ya existe un chat entre estos usuarios"
      ) {
        const updatedChats = await getUserChats(user.data.id);
        const existingChat = updatedChats.find((chat) =>
          chat.participants.some((p) => p.userId === friendId)
        );

        if (existingChat) {
          await onChatCreated(updatedChats, existingChat.id);

          Swal.fire({
            icon: "info",
            title: "Chat existente",
            text: "Ya tienes un chat con este usuario",
            confirmButtonText: "Ir al chat",
            confirmButtonColor: "#00D8A1",
            showCancelButton: true,
            cancelButtonText: "Ver lista de chats",
            cancelButtonColor: "#6C757D",
            background: "#fff",
            customClass: {
              popup: "rounded-[20px]",
              title: "font-bungee text-[#00D8A1]",
              content: "font-roboto",
            },
          }).then((result) => {
            navigate("/chat");
            if (result.isConfirmed) {
              setTimeout(() => {
                const chatEvent = new CustomEvent("openChat", {
                  detail: { chatId: existingChat.id },
                });
                window.dispatchEvent(chatEvent);
              }, 300);
            }
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo crear el chat",
          confirmButtonColor: "#DC3545",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center">
      {filteredFriends.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center text-center pt-32"
        >
          <FaUserFriends
            className="text-6xl mb-4"
            style={{ fill: "url(#gradient)" }}
          />
          <h3 className="font-bungee text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#783CDA] to-[#00D8A1]">
            No se encontraron amigos
          </h3>
        </motion.div>
      ) : (
        <div className="w-full">
          {filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="p-4 cursor-pointer transition-all duration-300 hover:bg-gray-100 dark:hover:bg-primary flex items-start"
            >
              <div className="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center mr-3">
                {friend.userImage ? (
                  <img
                    src={friend.userImage}
                    alt={friend.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-purple-900 text-2xl" />
                )}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold truncate mr-2 dark:text-white">
                    {friend.username}
                  </h3>
                </div>
                <div className="flex justify-between items-center dark:text-gray-200">
                  <p className="text-sm truncate">Amigo</p>
                  <div>
                    <button
                      onClick={() => handleSendMessage(friend.id)}
                      className="bg-[#24FF87] text-white p-2 rounded-full mr-2 hover:bg-[#1FD672] transition-colors"
                      title="Enviar mensaje"
                    >
                      <FaEnvelope />
                    </button>
                    <button
                      onClick={() => handleDeleteFriend(friend.id)}
                      className="bg-[#F44336] text-white p-2 rounded-full hover:bg-[#D32F2F] transition-colors"
                      title="Eliminar amigo"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SearchPeople = ({ searchTerm }) => {
  const [searchResults, setSearchResults] = useState([]);
  const { searchUsers, sendFriendRequest, getFriendsList } = useFriends();
  const { user } = useAuth();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm && user && user.data && user.data.id) {
        searchUsers(user.data.id, searchTerm).then(setSearchResults);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, user, searchUsers]);

  const handleSendRequest = async (receiverId) => {
    if (user && user.data && user.data.id) {
      try {
        await sendFriendRequest(user.data.id, receiverId);
        Swal.fire({
          icon: "success",
          title: "¡Solicitud enviada!",
          text: "La solicitud de amistad ha sido enviada exitosamente.",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#00D8A1",
          background: "#fff",
          customClass: {
            popup: "rounded-[20px]",
            title: "font-bungee text-[#00D8A1]",
            content: "font-roboto",
          },
        });
        getFriendsList(user.data.id);
      } catch (error) {
        console.error("Error al enviar la solicitud de amistad:", error);
        Swal.fire({
          icon: "error",
          title: "¡Error!",
          text: "No se pudo enviar la solicitud de amistad.",
          confirmButtonText: "Intentar de nuevo",
          confirmButtonColor: "#DC3545",
          background: "#fff",
          customClass: {
            popup: "rounded-[20px]",
            title: "font-bungee text-[#DC3545]",
            content: "font-roboto",
          },
        });
      }
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center">
      {!searchTerm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center text-center pt-32"
        >
          <FaSearch
            className="text-6xl mb-4"
            style={{ fill: "url(#gradient)" }}
          />
          <h3 className="font-bungee text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#783CDA] to-[#00D8A1]">
            Busca aquí tus amigos o profesores
          </h3>
        </motion.div>
      ) : searchResults.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center text-center pt-32"
        >
          <FaSearch
            className="text-6xl mb-4"
            style={{ fill: "url(#gradient)" }}
          />
          <h3 className="font-bungee text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#783CDA] to-[#00D8A1]">
            No se encontraron resultados
          </h3>
        </motion.div>
      ) : (
        <div className="w-full">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="p-4 cursor-pointer transition-all duration-300 hover:bg-gray-100 dark:hover:bg-primary flex items-start"
            >
              <div className="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center mr-3">
                {result.userImage ? (
                  <img
                    src={result.userImage}
                    alt={result.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-purple-900 text-2xl" />
                )}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold truncate mr-2 dark:text-primary">
                    {result.username}
                  </h3>
                </div>
                <div className="flex justify-between items-center dark:text-gray-200">
                  <p className="text-sm truncate">Usuario encontrado</p>
                  <button
                    onClick={() => handleSendRequest(result.id)}
                    className="bg-[#008BD8] text-white p-2 rounded-full hover:bg-[#0073B1] transition-colors"
                  >
                    <FaUserPlus />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Friends;
