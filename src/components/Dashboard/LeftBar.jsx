import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/img/hola.png';
import { useAuth } from '../../context/auth.context.jsx';
import { useTranslation } from 'react-i18next';

const LeftBar = ({ onVisibilityChange }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation("global");

  const [isVisible, setIsVisible] = useState(false);
  const logoutTimerRef = useRef(null); 

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
      className={`fixed top-0 left-0 h-full overflow-auto bg-gradient-to-t from-purple-800 to-teal-400 text-white flex flex-col items-center shadow-xl shadow-blue-100 transition-transform duration-500 ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      } md:w-72 w-56 sm:w-56 lg:w-72 xl:w-72`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div className="">
        <img src={logo} alt="Logo" className="h-40 md:h-60 lg:h-80" />
      </div>
      <div className="flex flex-col items-center w-full">
        <Link to="/admin" className="py-2 px-4 md:py-4 md:px-6 text-left text-lg font-semibold hover:bg-purple-500 w-full transition duration-300">
          {t('leftBarComponent.start')}
        </Link>
        <Link to="/usuarios" className="py-2 px-4 md:py-4 md:px-6 text-left text-lg font-semibold hover:bg-purple-600 w-full transition duration-300">
          {t('leftBarComponent.users')}
        </Link>
        <Link to="/Courses" className="py-2 px-4 md:py-4 md:px-6 text-left text-lg font-semibold hover:bg-blue-700 w-full transition duration-300">
          {t('leftBarComponent.courses')}
        </Link>
        <Link to="/Categories" className="py-2 px-4 md:py-4 md:px-6 text-left text-lg font-semibold hover:bg-blue-900 w-full transition duration-300">
          {t('leftBarComponent.categories')}
        </Link>
        <Link to="/Roles" className="py-2 px-4 md:py-4 md:px-6 text-left text-lg font-semibold hover:bg-blue-800 w-full transition duration-300">
          {t('leftBarComponent.roles')}
        </Link>
        <Link to="/ProfileEditor" className="py-2 px-4 md:py-4 md:px-6 text-left text-lg font-semibold hover:bg-blue-900 w-full transition duration-300">
          {t('leftBarComponent.profileEditor')}
        </Link>
      </div>
      <div className="mt-auto w-full">
        <button onClick={handleLogout} className="py-2 px-4 md:py-4 md:px-6 text-lg font-semibold hover:bg-red-500 w-full text-center transition duration-500">
          {t('leftBarComponent.sign_off')}
        </button>
      </div>
    </div>
  );
};

export default LeftBar;