import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_LOCALHOST_URL || 'https://apibrightmind.mesadoko.com';

let socket;

export const initSocket = (chatId) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('message received', (newMessage) => {
      const userId = localStorage.getItem('userId');
      if (newMessage.senderId !== parseInt(userId)) {
        if (typeof window.updateReceivedMessage === 'function') {
          window.updateReceivedMessage(newMessage);
        } 
      }
    });

    socket.on('message edited', (editedMessage) => {
      if (typeof window.updateEditedMessage === 'function') {
        window.updateEditedMessage(editedMessage);
      }
    });

    socket.on('message deleted', (deletedMessageId) => {
      if (typeof window.updateDeletedMessage === 'function') {
        window.updateDeletedMessage(deletedMessageId);
      }
    });
  }

  if (chatId) {
    socket.emit('join chat', chatId);
  }

  return socket;
};

export const leaveChat = (chatId) => {
  if (socket) {
    socket.emit('leave chat', chatId);
  }
};

export const sendMessage = (message) => {
  if (socket) {
    socket.emit('new message', message);
  }
};

export const startTyping = ({ chatId, userId }) => {
  if (socket) {
    socket.emit('typing', { chatId, userId });
  }
};

export const stopTyping = ({ chatId, userId }) => {
  if (socket) {
    socket.emit('stop typing', { chatId, userId });
  }
};

export const emitEditMessage = (editedMessage) => {
  if (socket) {
    socket.emit('edit message', editedMessage);
  }
};

export const emitDeleteMessage = (messageId, chatId) => {
  if (socket) {
    socket.emit('delete message', { messageId, chatId });
  }
};

export { socket };