import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Añade useLocation
import logo from '../../assets/img/hola.png';
import { useAuth } from '../../context/auth.context.jsx';
import { useTranslation } from 'react-i18next';
import { FaBook, FaDiceD20, FaEdit, FaHome, FaSignOutAlt, FaTags, FaUsers, FaUserCircle, FaBars } from 'react-icons/fa';
import { useUserContext } from '../../context/user/user.context.jsx';

const LeftBar = ({ onVisibilityChange }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Obtén la ruta actual
  const { t } = useTranslation("global");
  const { getUserById } = useUserContext();
  const { user } = useAuth();
  const [username, setUsername] = useState("Cargando...");
  const [userImage, setUserImage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const logoutTimerRef = useRef(null); 

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.data && user.data.id) {
        try {
          const userData = await getUserById(user.data.id);
          setUsername(userData.username);
          setUserImage(userData.userImage !== "null" ? userData.userImage : null);
        } catch (error) {
          console.error(error);
          setUserImage(null); 
        }
      }
    };

    fetchUserData();
  }, [getUserById, user]);

  const resetTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    logoutTimerRef.current = setTimeout(() => {
      handleLogout(); 
    }, 15 * 60 * 1000);
  };

  useEffect(() => {
    const handleActivity = () => {
      resetTimer(); 
    };

    resetTimer(); 

    document.addEventListener("mousemove", handleActivity);
    document.addEventListener("keypress", handleActivity);

    return () => {
      document.removeEventListener("mousemove", handleActivity);
      document.removeEventListener("keypress", handleActivity);
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current); 
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      setTimeout(() => {
        navigate("/");
      }, 5000); 
    } catch (error) {
      console.error("Error al hacer logout:", error);
    }
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (event.clientX < 50) {
        setIsVisible(true);
      } else if (event.clientX > 250) {
        setIsVisible(false);
      }
    };

    const handleMouseLeave = (event) => {
      if (event.relatedTarget === null) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    if (typeof onVisibilityChange === "function") {
      onVisibilityChange(isVisible);
    }
  }, [isVisible, onVisibilityChange]);

  return (
    <div
      className={`fixed top-0 left-0 h-full overflow-auto bg-[#160a2b] text-white flex flex-col items-center transition-transform duration-300 
        ${isVisible ? "translate-x-0" : "-translate-x-full"} 
        sm:w-72 w-full h-screen z-50 
        md:rounded-tr-xl md:rounded-br-xl`} 
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div className="absolute top-4 right-4 sm:hidden">
        <button onClick={() => setIsVisible(false)}>
          <FaBars size="24px" className="text-white hover:text-gray-300 transition duration-300" />
        </button>
      </div>

      <div className="w-full flex justify-center items-center font-bungee tracking-wider">
        <img src={logo} alt="Logo" className="h-14 sm:h-40 xl:h-48 mb-0 md:mb-6" />
      </div>

      <div className="flex h-32 w-[90%] mb-10 sm:hidden">
        <div className="p-4 flex m-auto w-[85%] bg-gradient-to-r from-[#512599] to-[#190736] rounded-xl shadow-[#8f77b6] shadow-[0_10px_20px]">
          <div className="relative mr-4">
            {userImage ? (
              <img
                src={userImage}
                alt="UserImage"
                className="h-14 w-14 rounded-full"
              />
            ) : (
              <FaUserCircle
                size="56px"
                className="text-white"
              />
            )}
          </div>
          <p className="text-white font-bungee text-lg mt-1">{username}
            <p className="text-sm font-sans">Mi cuenta</p>
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center mt-[10%] w-auto sm:w-[90%] font-bungee tracking-wide">
        <Link to="/admin" className={`group flex rounded-xl my-1 py-2 px-4 md:px-6 text-left shadow-lg w-full transition duration-300 ${location.pathname === '/admin' ? 'shadow-gray-500 bg-white text-purple-700' : 'hover:shadow-gray-500 hover:bg-white hover:text-purple-700'}`}>
          <FaHome size="20px" className={`mr-2 h-5 ${location.pathname === '/admin' ? 'text-purple-700' : 'text-[#00D8A1] group-hover:text-purple-700'}`} />{t('leftBarComponent.start')}
        </Link>
        <Link to="/usuarios" className={`group flex rounded-xl my-1 py-2 px-4 md:px-6 text-left shadow-lg w-full transition duration-300 ${location.pathname === '/usuarios' ? 'shadow-gray-500 bg-white text-purple-700' : 'hover:shadow-gray-500 hover:bg-white hover:text-purple-700'}`}>
          <FaUsers size="20px" className={`mr-2 h-5 ${location.pathname === '/usuarios' ? 'text-purple-700' : 'text-[#00D8A1] group-hover:text-purple-700'}`} />{t('leftBarComponent.users')}
        </Link>
        <Link to="/Courses" className={`group flex rounded-xl my-1 py-2 px-4 md:px-6 text-left shadow-lg w-full transition duration-300 ${location.pathname === '/Courses' ? 'shadow-gray-500 bg-white text-purple-700' : 'hover:shadow-gray-500 hover:bg-white hover:text-purple-700'}`}>
          <FaBook size="20px" className={`mr-2 h-5 ${location.pathname === '/Courses' ? 'text-purple-700' : 'text-[#00D8A1] group-hover:text-purple-700'}`} />{t('leftBarComponent.courses')}
        </Link>
        <Link to="/Categories" className={`group flex rounded-xl my-1 py-2 px-4 md:px-6 text-left shadow-lg w-full transition duration-300 ${location.pathname === '/Categories' ? 'shadow-gray-500 bg-white text-purple-700' : 'hover:shadow-gray-500 hover:bg-white hover:text-purple-700'}`}>
          <FaTags size="20px" className={`mr-2 h-5 ${location.pathname === '/Categories' ? 'text-purple-700' : 'text-[#00D8A1] group-hover:text-purple-700'}`} />{t('leftBarComponent.categories')}
        </Link>
        <Link to="/Roles" className={`group flex rounded-xl my-1 py-2 px-4 md:px-6 text-left shadow-lg w-full transition duration-300 ${location.pathname === '/Roles' ? 'shadow-gray-500 bg-white text-purple-700' : 'hover:shadow-gray-500 hover:bg-white hover:text-purple-700'}`}>
          <FaDiceD20 size="20px" className={`mr-2 h-5 ${location.pathname === '/Roles' ? 'text-purple-700' : 'text-[#00D8A1] group-hover:text-purple-700'}`} />{t('leftBarComponent.roles')}
        </Link>
        <Link to="/ProfileEditor" className={`group flex rounded-xl my-1 py-2 px-4 md:px-6 text-left shadow-lg w-full transition duration-300 ${location.pathname === '/ProfileEditor' ? 'shadow-gray-500 bg-white text-purple-700' : 'hover:shadow-gray-500 hover:bg-white hover:text-purple-700'}`}>
          <FaEdit size="20px" className={`mr-2 h-5 ${location.pathname === '/ProfileEditor' ? 'text-purple-700' : 'text-[#00D8A1] group-hover:text-purple-700'}`} />{t('leftBarComponent.profileEditor')}
        </Link>
      </div>

      <div className="mt-auto w-[90%] font-bungee tracking-wide">
        <button onClick={handleLogout} className="flex rounded-xl my-4 py-2 px-4 md:px-6 shadow-lg hover:shadow-gray-500 hover:bg-white hover:text-red-600 w-full text-center transition duration-500">
          <FaSignOutAlt size="20px" className="text-red-600 mr-2 h-5 transition duration-300" />{t('leftBarComponent.sign_off')}
        </button>
      </div>
    </div>
  );
};

export default LeftBar;