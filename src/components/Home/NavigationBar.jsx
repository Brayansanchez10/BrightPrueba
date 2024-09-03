import React, { useState, useRef, useEffect } from "react";
import { BiSearch } from "react-icons/bi";
import { FaUserCircle } from 'react-icons/fa';
import { Link } from "react-router-dom";
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
  const [searchTerm, setSearchTerm] = useState("");

  const menuRef = useRef(null);
  const welcomeModalRef = useRef(null);

  const [logoutTimer, setLogoutTimer] = useState(null);
  const logoutTimerRef = useRef(logoutTimer);

  useEffect(() => {
    logoutTimerRef.current = logoutTimer;
  }, [logoutTimer]);

  const resetTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    setLogoutTimer(
      setTimeout(() => {
        handleLogout();
      }, 3600000) // 1 hora de inactividad
    );
  };

  useEffect(() => {
    const handleActivity = () => {
      resetTimer();
    };

    // Resetear el temporizador cuando haya actividad
    const mouseMoveListener = document.addEventListener(
      "mousemove",
      handleActivity
    );
    const keyPressListener = document.addEventListener(
      "keypress",
      handleActivity
    );

    return () => {
      document.removeEventListener("mousemove", handleActivity);
      document.removeEventListener("keypress", handleActivity);
      clearTimeout(logoutTimerRef.current);
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

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.data && user.data.id) {
        try {
          const userData = await getUserById(user.data.id);
          setUsername(userData.username);

          // Si userImage es "null", establecerlo como una cadena vacía
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
    <nav className="bg-gradient-to-r from-purple-700 to-pink-600 shadow-orange shadow-sky-300 p-2 md:p-3 flex justify-between items-center w-full">
      {/* Sección izquierda */}
      <div className="flex items-center">
        <BiSearch className="text-white" size="24px" />
        <input
          type="search"
          placeholder={t('navigationBar.search_placeholder')}
          value={searchTerm}
          onChange={handleSearchChange}
          className="mr-1 rounded-lg p-2 md:w-28 md:h-9 w-11 h-7 bg-purple-400 text-white placeholder-white focus:outline-none border-2 border-transparent hover:border-white"
        />
        <Link
          to="/MyCourses"
          className="text-white font-semibold text-center w-28 h-7 md:w-28 md:h-9 md:text-base flex items-center justify-center bg-gradient-to-r from-violet-500 via-sky-500 to-pink-500 rounded-lg py-1 px-2 hover:bg-gradient-xy hover:animate-gradient-xy transition-all duration-300 shadow-md transform hover:scale-105"
        >
          {t('navigationBar.my_courses')}
        </Link>
      </div>

      {/* Sección central */}
      <div className="flex justify-center items-center md:mr-20">
        <Link to="/Home" className="flex justify-center items-center">
          <span className="text-white font-black text-xl md:text-2xl hidden sm:block">
            {t('navigationBar.bright')}
          </span>
          <img className="h-12" src={Logo} alt="Logo" />
          <span className="text-white font-black text-xl md:text-2xl hidden sm:block">
            {t('navigationBar.mind')}
          </span>
        </Link>
      </div>

      {/* Sección derecha */}
      <div className="flex items-center">
        <div
          className="relative text-white md:text-lg font-bold mr-2 md:mr-4 cursor-pointer text-base hidden sm:block"
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
              <p className={`text-gray-800 font-semibold text-center mb-2 ${!userImage && 'mt-4'}`}>
                {t('navigationBar.welcome_message', { username })}
              </p>
              <p className="text-gray-600 text-center mb-4">
                {t('navigationBar.check_courses')}
              </p>
              <Link
                to="/MyCourses"
                className="text-blue-600 font-semibold hover:underline text-center block"
              >
                {t('navigationBar.see_my_courses')}
              </Link>
            </div>
          )}
        </div>

        <div className="relative">
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

          {/* Menú desplegable */}
          {isMenuVisible && (
            <div
              ref={menuRef}
              className="absolute md:right-4 md:top-20 w-56 right-0 top-16 bg-gradient-to-r from-purple-700 to-pink-600 shadow-lg rounded-md transition-all duration-300 ease-in-out z-50"
            >
              <div className="flex flex-col py-2">
                <Link
                  to="/Account"
                  className="px-4 py-3 hover:bg-gray-600 cursor-pointer text-white rounded transition-all duration-300"
                >
                  {t('navigationBar.configure_profile')}
                </Link>
                <div
                  onClick={handleLogout}
                  className="px-4 py-3 hover:bg-red-600 cursor-pointer text-white rounded transition-all duration-300"
                >
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
