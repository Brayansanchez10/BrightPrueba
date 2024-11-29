import React, { useState, useMemo } from 'react';
import { useNotifications } from '../../context/user/notification.context';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getNotificationBorderColor } from './notificationUtils';
import NavigationBar from '../Home/NavigationBar';
import NavBar from '../Dashboard/NavBar';
import { useAuth } from '../../context/auth.context';
import Footer from '../footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import { IoChevronDown } from "react-icons/io5";
import { 
  FaGraduationCap, // para cursos
  FaComments,      // para foros
  FaBook,          // para recursos
  FaInbox,         // para todas
  FaReply         // para respuestas
} from "react-icons/fa";

const AllNotifications = () => {
  const { t } = useTranslation("global");
  const { notifications, markAsRead, removeNotification } = useNotifications();
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState('all');
  const { user } = useAuth();

  // Definir categorías de notificaciones
  const notificationCategories = {
    all: [],
    courses: ['COURSE_CREATED', 'COURSE_DELETED', 'COURSE_COMPLETED', 'APPLICATION', 'ACCEPTED'],
    forums: ['FORUM_ACTIVATED', 'FORUM_DESACTIVATED', 'ANSWER_CREATED'],
    resources: ['RESOURCE_CREATED'],
  };

  // Objeto para mapear categorías con sus iconos
  const categoryIcons = {
    all: <FaInbox className="mr-2" />,
    courses: <FaGraduationCap className="mr-2" />,
    forums: <FaComments className="mr-2" />,
    resources: <FaBook className="mr-2" />,
    answers: <FaReply className="mr-2" />
  };

  // Filtrar notificaciones por categoría
  const filteredNotifications = useMemo(() => {
    if (filterCategory === 'all') return notifications;
    return notifications.filter(notification => 
      notificationCategories[filterCategory].includes(notification.type)
    );
  }, [notifications, filterCategory]);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
  };

  // Variantes de animación para el contenedor
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Variantes de animación para cada notificación
  const notificationVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  // Determina qué barra de navegación mostrar
  const isUser = user?.data?.role === 'usuario';

  return (
    <div className={`min-h-screen ${isUser ? 'bg-primary pt-16' : 'bg-primaryAdmin'}`}>
      {isUser ? <NavigationBar /> : <NavBar />}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <motion.div 
          className="flex items-center my-4"
          whileHover={{ x: -5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-purple-600 hover:text-purple-800"
          >
            <ArrowLeftOutlined className="mr-2" />
            {t('notifications.back')}
          </button>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl text-primary font-bold mb-6"
        >
          {t('notifications.all_notifications')}
        </motion.h1>
        
        <div className="mb-4 w-72">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className={`inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white ${isUser ? 'dark:bg-secondary' : 'dark:bg-secondaryAdmin'} text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300`}>
                <span className="flex items-center">
                  {categoryIcons[filterCategory]}
                  {t(`notifications.filter_${filterCategory}`)}
                </span>
                <IoChevronDown className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
              </Menu.Button>
            </div>
            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className={`absolute right-0 mt-2 w-full origin-top-right rounded-md bg-white ${isUser ? 'dark:bg-secondary' : 'dark:bg-secondaryAdmin'} shadow-lg ring-1 ring-black/5 focus:outline-none z-10`}>
                <div className="py-1 px-2.5">
                  {Object.keys(notificationCategories).map((category) => (
                    <Menu.Item key={category}>
                      {({ active }) => (
                        <motion.button
                          onClick={() => setFilterCategory(category)}
                          className={`${
                            active ? 'bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100 rounded-lg' : 'text-gray-900 dark:text-gray-100'
                          } group flex items-center w-[96%] px-2 py-2 text-sm`}
                          whileHover={{ scale: 1.05, x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {categoryIcons[category]}
                          {t(`notifications.filter_${category}`)}
                        </motion.button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          <AnimatePresence mode="wait">
            {filteredNotifications.map(notification => (
              <motion.div
                key={notification.id}
                variants={notificationVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                layout
                onClick={() => handleNotificationClick(notification)}
                className={`bg-gray-50 ${isUser ? 'dark:bg-secondary' : 'dark:bg-secondaryAdmin'} p-4 border-l-4 rounded-md shadow-sm cursor-pointer ${
                  !notification.isRead ? `bg-purple-100 ${isUser ? 'dark:bg-[#522797]' : 'dark:bg-[#383e5c]'}` : ''
                } ${getNotificationBorderColor(notification.type)}`}
                whileHover={{ 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 400 }
                }}
              >
                <motion.div 
                  className="font-bold text-purple-800 dark:text-primary"
                  layout
                >
                  {notification.title}
                </motion.div>
                <motion.div 
                  className="text-sm text-gray-600 dark:text-gray-300"
                  layout
                >
                  {notification.message}
                </motion.div>
                <motion.div 
                  className="flex justify-between items-center mt-2"
                  layout
                >
                  <span className="text-xs text-gray-500 dark:text-gray-300">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    {t('notifications.delete')}
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <div className="pt-20">
        <Footer />
      </div>
    </div>
  );
};

export default AllNotifications;
