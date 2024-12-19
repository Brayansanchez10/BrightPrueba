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
  FaCrown, 
  FaSignOutAlt, 
  FaCog 
} from "react-icons/fa";
import { 
  RiReplyLine, 
  RiPencilLine, 
  RiDeleteBinLine, 
  RiMoreLine, 
  RiCloseLine 
} from "react-icons/ri";
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
import { MessageSquare } from "lucide-react";
import Swal from "sweetalert2";

export default function Group() {
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
    createGroupChat,
    addParticipants,
    removeParticipant,
    makeAdmin,
    leaveGroup,
    updateGroupInfo,
  } = useChat();

  // Estados básicos
  const [selectedGroup, setSelectedGroup] = useState(null);
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

  // Estados específicos para grupos
  const [showGroupMenu, setShowGroupMenu] = useState(false);
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [showGroupSettingsModal, setShowGroupSettingsModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  useEffect(() => {
    if (user?.data?.id) {
      getUserChats(user.data.id);
      initSocket();
    }

    return () => {
      if (selectedGroup) {
        leaveChat(selectedGroup.id);
      }
    };
  }, [user, getUserChats, selectedGroup]);

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  // Funciones específicas de grupos
  const handleCreateGroup = async () => {
    try {
      if (!groupName.trim()) {
        Swal.fire({
          title: "Error",
          text: "El nombre del grupo es requerido",
          icon: "error",
          confirmButtonColor: "#FF8C00",
        });
        return;
      }

      const newGroup = await createGroupChat({
        name: groupName,
        description: groupDescription,
        participants: selectedParticipants,
        creatorId: user.data.id,
      });

      setSelectedGroup(newGroup);
      setGroupName("");
      setGroupDescription("");
      setSelectedParticipants([]);
      setShowAddParticipantModal(false);

      Swal.fire({
        title: "¡Éxito!",
        text: "Grupo creado correctamente",
        icon: "success",
        confirmButtonColor: "#FF8C00",
      });
    } catch (error) {
      console.error("Error al crear grupo:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo crear el grupo",
        icon: "error",
        confirmButtonColor: "#FF8C00",
      });
    }
  };

  const handleAddParticipant = async (userId) => {
    try {
      await addParticipants(selectedGroup.id, [userId]);
      setShowAddParticipantModal(false);
      
      Swal.fire({
        title: "¡Éxito!",
        text: "Participante añadido correctamente",
        icon: "success",
        confirmButtonColor: "#FF8C00",
      });
    } catch (error) {
      console.error("Error al añadir participante:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo añadir al participante",
        icon: "error",
        confirmButtonColor: "#FF8C00",
      });
    }
  };

  const handleRemoveParticipant = async (userId) => {
    try {
      await removeParticipant(selectedGroup.id, userId);
      
      Swal.fire({
        title: "¡Éxito!",
        text: "Participante eliminado correctamente",
        icon: "success",
        confirmButtonColor: "#FF8C00",
      });
    } catch (error) {
      console.error("Error al eliminar participante:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar al participante",
        icon: "error",
        confirmButtonColor: "#FF8C00",
      });
    }
  };

  const handleMakeAdmin = async (userId) => {
    try {
      await makeAdmin(selectedGroup.id, userId);
      
      Swal.fire({
        title: "¡Éxito!",
        text: "Administrador asignado correctamente",
        icon: "success",
        confirmButtonColor: "#FF8C00",
      });
    } catch (error) {
      console.error("Error al hacer admin:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo asignar como administrador",
        icon: "error",
        confirmButtonColor: "#FF8C00",
      });
    }
  };

  const handleLeaveGroupChat = async () => {
    try {
      await leaveGroup(selectedGroup.id, user.data.id);
      setSelectedGroup(null);
      
      Swal.fire({
        title: "¡Éxito!",
        text: "Has salido del grupo correctamente",
        icon: "success",
        confirmButtonColor: "#FF8C00",
      });
    } catch (error) {
      console.error("Error al salir del grupo:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo salir del grupo",
        icon: "error",
        confirmButtonColor: "#FF8C00",
      });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFFFF] to-[#F8F8F8]">
      <NavigationBar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-8 px-4"
      >
        <div className="bg-white rounded-[30px] shadow-lg overflow-hidden flex h-[calc(100vh-200px)]">
          {/* Sidebar - Lista de Grupos */}
          {showSidebar && (
            <div className="w-full sm:w-[380px] bg-white border-r border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bungee text-black">Grupos</h1>
                  <button
                    onClick={() => setShowAddParticipantModal(true)}
                    className="bg-[#008BD8] text-white p-2 rounded-full hover:bg-[#0073B1] transition-colors"
                  >
                    <FaUsers className="w-5 h-5" />
                  </button>
                </div>

                {/* Barra de búsqueda */}
                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Buscar grupo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-3 pl-10 pr-4 bg-gray-100 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#008BD8]"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                {/* Lista de Grupos */}
                <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-350px)]">
                  {chats
                    .filter(chat => chat.isGroup)
                    .filter(chat =>
                      chat.groupName?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((group) => (
                      <div
                        key={group.id}
                        onClick={() => setSelectedGroup(group)}
                        className={`flex items-center p-4 rounded-[15px] cursor-pointer transition-colors ${
                          selectedGroup?.id === group.id
                            ? "bg-[#008BD8] text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                          {group.groupImage ? (
                            <img
                              src={group.groupImage}
                              alt={group.groupName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaUsers className="w-6 h-6 text-gray-600" />
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium">{group.groupName}</h3>
                          <p className="text-sm opacity-75">
                            {group.participants.length} participantes
                          </p>
                        </div>
                        {unreadCounts[group.id] > 0 && (
                          <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                            {unreadCounts[group.id]}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Área principal de mensajes */}
          <div className="flex-1 flex flex-col">
            {selectedGroup ? (
              <>
                {/* Cabecera del grupo */}
                <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                      {selectedGroup.groupImage ? (
                        <img
                          src={selectedGroup.groupImage}
                          alt={selectedGroup.groupName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUsers className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <div className="ml-4">
                      <h2 className="font-bungee text-xl">{selectedGroup.groupName}</h2>
                      <p className="text-sm text-gray-500">
                        {selectedGroup.participants.length} participantes
                      </p>
                    </div>
                  </div>

                  {/* Menú del grupo */}
                  <div className="relative">
                    <button
                      onClick={() => setShowGroupMenu(!showGroupMenu)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <RiMoreLine className="w-6 h-6" />
                    </button>
                    
                    {showGroupMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                        <button
                          onClick={() => setShowAddParticipantModal(true)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          <FaUserPlus className="inline mr-2" /> Añadir participante
                        </button>
                        <button
                          onClick={() => setShowGroupSettingsModal(true)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          <FaCog className="inline mr-2" /> Configuración
                        </button>
                        <button
                          onClick={handleLeaveGroupChat}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                        >
                          <FaSignOutAlt className="inline mr-2" /> Salir del grupo
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lista de mensajes */}
                {/* ... (igual que en chat.jsx pero adaptado para grupos) ... */}
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center">
                <FaUsers className="w-16 h-16 text-gray-500 mb-4" />
                <p className="text-gray-500 text-3xl font-bungee">
                  Selecciona un grupo
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modales */}
      {showAddParticipantModal && (
        <AddParticipantModal
          onClose={() => setShowAddParticipantModal(false)}
          onAdd={handleAddParticipant}
          currentParticipants={selectedGroup?.participants || []}
        />
      )}

      {showGroupSettingsModal && (
        <GroupSettingsModal
          group={selectedGroup}
          onClose={() => setShowGroupSettingsModal(false)}
          onUpdate={updateGroupInfo}
          onMakeAdmin={handleMakeAdmin}
          onRemoveParticipant={handleRemoveParticipant}
          currentUserId={user.data.id}
        />
      )}
    </div>
  );
}