import React, { useState, useRef, useEffect } from "react";
import { FaEdit, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { Link, useLocation } from "react-router-dom"; // Asegúrate de importar useLocation
import Logo from "../../assets/img/hola.png";
import { useAuth } from "../../context/auth.context";
import { useUserContext } from "../../context/user/user.context";
import { useTranslation } from 'react-i18next';

function NavigationBar({ onSearch }) {
  const { t } = useTranslation("global");
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const { logout, user } = useAuth();
  const { getUserById } = useUserContext();
  const [username, setUsername] = useState("");
  const [userImage, setUserImage] = useState("");
  const location = useLocation(); // Usamos useLocation para obtener la ruta actual

  const menuRef = useRef(null);
  const welcomeModalRef = useRef(null);
  const logoutTimerRef = useRef(null);

  const resetTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    logoutTimerRef.current = setTimeout(() => {
      handleLogout();
    }, 3600000); // 1 hora de inactividad
  };

  useEffect(() => {
    const handleActivity = () => {
      resetTimer();
    };

    document.addEventListener("mousemove", handleActivity);
    document.addEventListener("keypress", handleActivity);

    resetTimer();

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
      window.location.href = "/";
    } catch (error) {
      console.error("Error al hacer logout:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.data && user.data.id) {
        try {
          const userData = await getUserById(user.data.id);
          setUsername(userData.username);
          setUserImage(userData.userImage === "null" ? "" : userData.userImage);
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
        }
      }
    };

    fetchUserData();
  }, [user, getUserById]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !welcomeModalRef.current?.contains(event.target)
      ) {
        setIsMenuVisible(false);
        setShowWelcomeModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, welcomeModalRef]);

  return (
    <nav className="bg-gradient-to-r from-purple-950 to-purple-700 shadow-orange shadow-sky-300 p-2 md:p-1 flex justify-between items-center w-full">
      <div className="flex justify-center items-center">
        <Link to="/Home" className="flex justify-center items-center font-bungee tracking-wider">
          <img className="h-16" src={Logo} alt="Logo" />
          <span className="text-white text-xl md:text-3xl hidden sm:block">
            {t('navigationBar.bright')}
          </span>
          <span className="text-[#00D8A1] text-xl md:text-3xl hidden sm:block">
            {t('navigationBar.mind')}
          </span>
        </Link>
      </div>
      <div className="flex items-center font-bungee tracking-wider">
        <Link
          to="/Home"
          className={`text-white text-center h-7 md:h-9 md:text-lg flex items-center justify-center transition-all duration-300
          ${location.pathname === '/Home' ? 'scale-105 border-b-4 border-[#00D8A1]' : 'hover:scale-105 hover:border-b-4 hover:border-[#00D8A1]'}`}
        >
          {t('navigationBar.home')}
        </Link>
        <Link
          to="/AllCourses"
          className={`text-white text-center mx-7 h-7 md:h-9 md:text-lg flex items-center justify-center transition-all duration-300
          ${location.pathname === '/AllCourses' ? 'scale-105 border-b-4 border-[#00D8A1]' : 'hover:scale-105 hover:border-b-4 hover:border-[#00D8A1]'}`}
        >
          {t('navigationBar.courses')}
        </Link>
        <Link
          to="/MyCourses"
          className={`text-white text-center h-7 md:h-9 md:text-lg flex items-center justify-center transition-all duration-300
          ${location.pathname === '/MyCourses' ? 'scale-105 border-b-4 border-[#00D8A1]' : 'hover:scale-105 hover:border-b-4 hover:border-[#00D8A1]'}`}
        >
          {t('navigationBar.my_courses')}
        </Link>
      </div>
      <div className="flex items-center">
        <div
          className="relative text-white font-bungee tracking-wider md:text-xl mr-2 md:mr-4 cursor-pointer text-base hidden sm:block"
          onMouseEnter={() => setShowWelcomeModal(true)}
          onMouseLeave={() => setShowWelcomeModal(false)}
        >
          {username}
          {showWelcomeModal && (
            <div
              ref={welcomeModalRef}
              className="absolute top-8 right-0 w-72 bg-white shadow-lg rounded-lg p-6 z-50"
            >
              {userImage && (
                <img
                  src={userImage}
                  alt="User"
                  className="h-16 w-16 rounded-full mx-auto mb-4"
                />
              )}
              <p className={`text-gray-800 text-center mb-2 ${!userImage && 'mt-4'}`}>
                {t('navigationBar.welcome_message', { username })}
              </p>
              <p className="text-gray-600 text-center mb-4">
                {t('navigationBar.check_courses')}
              </p>
              <Link
                to="/MyCourses"
                className="text-blue-600 hover:underline text-center block"
              >
                {t('navigationBar.see_my_courses')}
              </Link>
            </div>
          )}
        </div>

        <div className="relative font-bungee">
          <div
            className={`h-12 md:h-12 w-12 md:w-12 cursor-pointer border rounded-full transition-all duration-300 hover:scale-110 mr-1 ${
              userImage ? '' : 'bg-purple-500 flex items-center justify-center'
            }`}
            onClick={() => setIsMenuVisible(!isMenuVisible)}
            style={{
              backgroundImage: userImage ? `url(${userImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {!userImage && (
              <FaUserCircle className="h-8 w-8 text-white" />
            )}
          </div>
          {isMenuVisible && (
            <div
              ref={menuRef}
              className="absolute md:right-4 md:top-20 w-60 right-0 top-16 bg-gradient-to-r from-purple-900 to-purple-600 shadow-lg rounded-md transition-all duration-300 ease-in-out z-50"
            >
              <div className="flex flex-col py-2">
                <Link
                  to="/Account"
                  className="flex px-4 py-3 hover:bg-gray-600 cursor-pointer text-white rounded transition-all duration-300"
                ><FaEdit size="20px" className="mr-2" />
                  {t('navigationBar.configure_profile')}
                </Link>
                <div
                  onClick={handleLogout}
                  className="flex px-4 py-3 hover:bg-red-600 cursor-pointer text-white rounded transition-all duration-300"
                ><FaSignOutAlt size="20px" className="mr-2" />
                  {t('navigationBar.logout')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
