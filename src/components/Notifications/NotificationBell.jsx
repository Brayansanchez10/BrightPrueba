import React, { useEffect } from 'react';
import { Badge, Dropdown, Empty } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useNotifications } from '../../context/user/notification.context';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/auth.context';
import { useNavigate } from 'react-router-dom';
import { getNotificationBorderColor } from './notificationUtils';

const NotificationBell = () => {
  const { t } = useTranslation("global");
  const { notifications, unreadCount, markAsRead, removeNotification, fetchNotifications } = useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.data?.id) {
      fetchNotifications();
    }
  }, [user?.data?.id]);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
  };

  const handleViewAllNotifications = () => {
    console.log('User data:', user?.data);
    
    const userRole = user?.data?.role;
    const entityType = user?.data?.entities?.type;

    console.log('Role:', userRole);
    console.log('Entity Type:', entityType);

    if (userRole === 'usuario') {
      navigate('/notifications');
    } else {
      navigate('/adminNotifications');
    }
  };

  // Obtener solo las 5 notificaciones más recientes
  const recentNotifications = notifications.slice(0, 5);

  const items = notifications.length > 0 ? [
    ...recentNotifications.map(notification => ({
      key: notification.id,
      label: (
        <div 
          onClick={() => handleNotificationClick(notification)}
          className={`bg-gray-50 w-[420px] p-4 border-l-4 rounded-md cursor-pointer ${
            !notification.isRead ? 'bg-purple-100' : ''
          } ${getNotificationBorderColor(notification.type)}`}
        >
          <div className="font-bold text-purple-800">{notification.title}</div>
          <div className="text-sm text-gray-600">{notification.message}</div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {new Date(notification.createdAt).toLocaleString()}
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(notification.id);
              }}
              className="text-red-500 text-sm hover:text-red-700"
            >
              {t('notifications.delete')}
            </button>
          </div>
        </div>
      )
    })),
    // Mostrar el botón "Ver todas" siempre que haya al menos una notificación
    {
      key: 'view-all',
      label: (
        <div 
          onClick={handleViewAllNotifications}
          className="text-center py-2 text-purple-600 hover:text-purple-800 cursor-pointer font-semibold border-t"
        >
          {t('notifications.view_all')} ({notifications.length})
        </div>
      )
    }
  ] : [{
    key: 'empty',
    label: (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={t('notifications.empty')}
      />
    )
  }];

  return (
    <Dropdown
      menu={{ items }}
      placement="bottomRight"
      arrow
      trigger={['click']}
      className="bg-white p-1 mr-4 rounded-full"
    >
      <Badge count={unreadCount} className="cursor-pointer">
        <BellOutlined className="text-2xl text-purple-700" />
      </Badge>
    </Dropdown>
  );
};

export default NotificationBell;
