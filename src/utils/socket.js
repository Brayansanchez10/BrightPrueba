import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_BACKEND_LOCALHOST_URL ||
  "https://apibrightmind.mesadoko.com";

let socket;

export const initSocket = (chatId) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    socket.on("message received", (newMessage) => {
      const userId = localStorage.getItem("userId");
      const selectedChatId = parseInt(localStorage.getItem("selectedChatId"));

      if (typeof window.updateReceivedMessage === "function") {
        window.updateReceivedMessage(newMessage);
      }

      if (newMessage.receiverId === parseInt(userId) && 
          newMessage.chatId !== selectedChatId) {
        if (typeof window.updateUnreadCount === "function") {
          window.updateUnreadCount(newMessage.chatId);
        }
      }
    });

    socket.on("message edited", (editedMessage) => {
      if (typeof window.updateEditedMessage === "function") {
        window.updateEditedMessage(editedMessage);
      }
    });

    socket.on("message deleted", (deletedMessageId) => {
      if (typeof window.updateDeletedMessage === "function") {
        window.updateDeletedMessage(deletedMessageId);
      }
    });

    socket.on("messages read", ({ chatId, userId }) => {
      if (typeof window.updateMessagesRead === "function") {
        window.updateMessagesRead(chatId, userId);
      }
    });
    
    socket.on("update unread count", async ({ chatId, userId }) => {
      try {
        const response = await fetch(`${SOCKET_URL}/chat/getUnreadMessageCount/${userId}/${chatId}`);
        const data = await response.json();
        const count = data.count;
        
        if (typeof window.updateUnreadCount === "function") {
          window.updateUnreadCount(chatId, count);
        }
      } catch (error) {
        console.error("Error al actualizar conteo:", error);
      }
    });

    socket.on("typing", ({ chatId, userId }) => {
      if (typeof window.updateTypingStatus === "function") {
        window.updateTypingStatus(chatId, userId, true);
      }
    });

    socket.on("stop typing", ({ chatId, userId }) => {
      if (typeof window.updateTypingStatus === "function") {
        window.updateTypingStatus(chatId, userId, false);
      }
    });

    socket.on("audio message received", (audioMessage) => {
      if (typeof window.updateReceivedMessage === "function") {
        window.updateReceivedMessage({
          ...audioMessage,
          type: 'audio'
        });
      }
    });
  }

  if (chatId) {
    socket.emit("join chat", chatId);
    localStorage.setItem("selectedChatId", chatId);
  }

  return socket;
};

export const leaveChat = (chatId) => {
  if (socket) {
    socket.emit("leave chat", chatId);
    localStorage.removeItem("selectedChatId");
  }
};

export const emitMessage = (message) => {
  if (socket) {
    socket.emit("new message", message);
  }
};

export const emitAudioMessage = (audioMessage) => {
  if (socket) {
    socket.emit("audio message", {
      ...audioMessage,
      type: 'audio'
    });
  }
};

export const startTyping = ({ chatId, userId }) => {
  if (socket) {
    socket.emit("typing", { chatId, userId });
  }
};

export const stopTyping = ({ chatId, userId }) => {
  if (socket) {
    socket.emit("stop typing", { chatId, userId });
  }
};

export const emitEditMessage = (editedMessage) => {
  if (socket) {
    socket.emit("edit message", editedMessage);
  }
};

export const emitDeleteMessage = (messageId, chatId) => {
  if (socket) {
    socket.emit("delete message", { messageId, chatId });
  }
};

export const emitMessagesRead = (chatId, userId) => {
  if (socket) {
    socket.emit("messages read", { chatId, userId });
  }
};

export const updateUnreadCount = (chatId, userId) => {
  if (socket) {
    socket.emit("update unread count", { chatId, userId });
  }
};

export { socket };