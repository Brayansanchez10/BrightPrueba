import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../auth.context';
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  deleteNotification 
} from '../../api/user/notification.request';

const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user?.data?.id) return;
    
    try {
      const response = await getUserNotifications(user.data.id);
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
    }
  };

  useEffect(() => {
    if (user?.data?.id) {
      fetchNotifications();
      // Actualizar notificaciones cada 30 segundos
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.data?.id]);

  const markAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? {...n, isRead: true} : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };

  const removeNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      const updatedNotifications = notifications.filter(n => n.id !== notificationId);
      setUnreadCount(updatedNotifications.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
    }
  };

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      fetchNotifications,
      markAsRead,
      removeNotification
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};
