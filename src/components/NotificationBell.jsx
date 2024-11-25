import React, { useEffect } from 'react';
import { Badge, Dropdown, Empty } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useNotifications } from '../context/user/notification.context';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/auth.context';

const NotificationBell = () => {
  const { t } = useTranslation("global");
  const { notifications, unreadCount, markAsRead, removeNotification, fetchNotifications } = useNotifications();
  const { user } = useAuth();

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

  const items = notifications.length > 0 ? notifications.map(notification => ({
    key: notification.id,
    label: (
      <div 
        onClick={() => handleNotificationClick(notification)}
        className={`w-[420px] p-4 border-b rounded-md cursor-pointer ${!notification.isRead ? 'bg-purple-100' : ''}`}
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
  })) : [{
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
