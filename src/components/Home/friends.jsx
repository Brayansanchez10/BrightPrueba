import React, { useState, useEffect } from 'react';
import { FaUser, FaCheck, FaTimes, FaTrash, FaEnvelope, FaUserPlus, FaSearch, FaInbox, FaUserFriends } from 'react-icons/fa';
import { useFriends } from '../../context/user/friends.context';
import { useAuth } from '../../context/auth.context';
import { useChat } from '../../context/user/chat.context';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const Friends = ({ onClose, onChatCreated, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'requests');
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation("global");

  const showNotification = (message, type) => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'info':
        toast.info(message);
        break;
      default:
        toast(message);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'requests':
        return <FriendRequests searchTerm={searchTerm} />;
      case 'friends':
        return <FriendsList onChatCreated={onChatCreated} searchTerm={searchTerm} />;
      case 'search':
        return <SearchPeople searchTerm={searchTerm} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-[20px] shadow-md flex-grow flex flex-col overflow-hidden h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-2xl font-bungee text-center mb-4 text-[#00D8A1]">
          {activeTab === 'requests' && "Solicitudes"}
          {activeTab === 'search' && "Buscar amigos"}
          {activeTab === 'friends' && "Amigos"}
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder={t("chat.searchPeople")}
            className="w-full py-3 pl-12 pr-4 rounded-full bg-gray-100 text-lg shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 text-xl" />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        {renderContent()}
      </div>
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
  const { pendingRequests, getPendingFriendRequests, acceptFriendRequest, rejectFriendRequest } = useFriends();
  const { user } = useAuth();
  const [filteredRequests, setFilteredRequests] = useState([]);

  useEffect(() => {
    if (user && user.data && user.data.id) {
      getPendingFriendRequests(user.data.id);
    }
  }, [user]);

  useEffect(() => {
    setFilteredRequests(
      pendingRequests.filter(request =>
        request.sender.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [pendingRequests, searchTerm]);

  const handleAccept = async (requestId) => {
    try {
      await acceptFriendRequest(requestId);
      getPendingFriendRequests(user.data.id);
      Swal.fire({
        icon: 'success',
        title: 'Solicitud aceptada',
        text: 'La solicitud de amistad ha sido aceptada exitosamente.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error("Error al aceptar la solicitud:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo aceptar la solicitud de amistad.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleReject = async (requestId) => {
    try {
      await rejectFriendRequest(requestId);
      getPendingFriendRequests(user.data.id);
      Swal.fire({
        icon: 'info',
        title: 'Solicitud rechazada',
        text: 'La solicitud de amistad ha sido rechazada.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error("Error al rechazar la solicitud:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo rechazar la solicitud de amistad.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
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
          <FaInbox className="text-6xl mb-4" style={{ fill: 'url(#gradient)' }} />
          <h3 className="font-bungee text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#783CDA] to-[#00D8A1]">
            No hay solicitudes pendientes
          </h3>
        </motion.div>
      ) : (
        <div className="w-full">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="p-4 cursor-pointer transition-all duration-300 hover:bg-gray-100 flex items-start"
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
                  <h3 className="font-semibold truncate mr-2">
                    {request.sender.username}
                  </h3>
                  <span className="text-xs whitespace-nowrap flex-shrink-0">
                    {new Date(request.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm truncate">Solicitud de amistad pendiente</p>
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

  useEffect(() => {
    if (user && user.data && user.data.id) {
      getFriendsList(user.data.id);
    }
  }, [user]);

  useEffect(() => {
    setFilteredFriends(
      friends.filter(friend =>
        friend.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [friends, searchTerm]);

  const handleDeleteFriend = async (friendId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres eliminar a este amigo?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteFriend(user.data.id, friendId);
        getFriendsList(user.data.id);
        Swal.fire(
          'Eliminado',
          'El amigo ha sido eliminado.',
          'success'
        );
      } catch (error) {
        console.error("Error al eliminar amigo:", error);
        Swal.fire(
          'Error',
          'No se pudo eliminar al amigo.',
          'error'
        );
      }
    }
  };

  const handleSendMessage = async (friendId) => {
    try {
      const response = await createChat(user.data.id, friendId);
      if (response && response.data && response.data.id) {
        const updatedChats = await getUserChats(user.data.id);
        onChatCreated(updatedChats, response.data.id);
      } else {
        console.error("Error: El chat creado no tiene un ID válido");
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo iniciar el chat.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error("Error al crear chat:", error);
      if (error.response && error.response.status === 400 && error.response.data.error === "Ya existe un chat entre estos usuarios") {
        const updatedChats = await getUserChats(user.data.id);
        const existingChat = updatedChats.find(chat => 
          chat.participants.some(p => p.userId === friendId)
        );
        if (existingChat) {
          onChatCreated(updatedChats, existingChat.id);
        } else {
          onChatCreated(updatedChats);
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo iniciar el chat.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
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
          <FaUserFriends className="text-6xl mb-4" style={{ fill: 'url(#gradient)' }} />
          <h3 className="font-bungee text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#783CDA] to-[#00D8A1]">
            No se encontraron amigos
          </h3>
        </motion.div>
      ) : (
        <div className="w-full">
          {filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="p-4 cursor-pointer transition-all duration-300 hover:bg-gray-100 flex items-start"
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
                  <h3 className="font-semibold truncate mr-2">
                    {friend.username}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
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
          icon: 'success',
          title: 'Solicitud enviada',
          text: 'La solicitud de amistad ha sido enviada exitosamente.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
        getFriendsList(user.data.id);
      } catch (error) {
        console.error("Error al enviar la solicitud de amistad:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo enviar la solicitud de amistad.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
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
          <FaSearch className="text-6xl mb-4" style={{ fill: 'url(#gradient)' }} />
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
          <FaSearch className="text-6xl mb-4" style={{ fill: 'url(#gradient)' }} />
          <h3 className="font-bungee text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#783CDA] to-[#00D8A1]">
            No se encontraron resultados
          </h3>
        </motion.div>
      ) : (
        <div className="w-full">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="p-4 cursor-pointer transition-all duration-300 hover:bg-gray-100 flex items-start"
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
                  <h3 className="font-semibold truncate mr-2">
                    {result.username}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
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