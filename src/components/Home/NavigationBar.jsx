import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUserCircle,
  FaUserCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaBook,
  FaGraduationCap,
} from "react-icons/fa";
import Logo from "../../assets/img/hola.png";
import { useAuth } from "../../context/auth.context";
import { useUserContext } from "../../context/user/user.context";
import { useTranslation } from "react-i18next";
import "../../css/Style.css";
import fondoInicio from "../../assets/img/fondo_inicio.png";
import fondoCursos from "../../assets/img/fondo_cursos.png";
import fondoMiscursos from "../../assets/img/fondo_miscursos.png";

function NavigationBar() {
  const { t } = useTranslation("global");
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const { getUserById } = useUserContext();
  const [username, setUsername] = useState("");
  const [userImage, setUserImage] = useState("");
  const location = useLocation();

  const menuRef = useRef(null);
  const [scrollDirection, setScrollDirection] = useState("up");

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.data && user.data.id) {
        try {
          const userData = await getUserById(user.data.id);
          setUsername(userData.username.toUpperCase());
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
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuVisible(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error("Error al hacer logout:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getActiveClass = (path) => {
    return location.pathname === path
      ? "text-[#00D8A1] border-b-4 border-[#00D8A1]"
      : "text-white hover:text-[#00D8A1]";
  };

  const formatUsername = (name) => {
    const words = name.split(' ');
    return words.map((word, index) => (
      <React.Fragment key={index}>
        <span className="inline-block max-w-full break-words hyphens-auto">
          {word}
        </span>
        {index < words.length - 1 && <br />}
      </React.Fragment>
    ));
  };
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`bg-gradient-to-r from-[#783CDA] to-[#200E3E] h-16 p-2 flex justify-between items-center w-full shadow-md font-bungee fixed top-0 z-50 transition-transform duration-300 ${
        scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="hidden md:flex items-center">
        <img className="h-20 w-auto mr-3" src={Logo} alt="Logo" />
        <span className="text-white font-bold text-2xl">
          BRIGHT<span className="text-[#00D8A1]">MIND</span>
        </span>
      </div>
      <div className="flex items-center justify-between w-full md:hidden">
        <img className="h-16 w-auto" src={Logo} alt="Logo" />
        <span className="text-white font-bold text-xl text-center flex-1">
          BRIGHT<span className="text-[#00D8A1]">MIND</span>
        </span>
        <button onClick={toggleMobileMenu} className="text-white">
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      <div className="hidden md:flex items-center space-x-8">
        <Link
          to="/Home"
          className={`${getActiveClass("/Home")} font-bold text-lg`}
        >
          {t('navigationBar.home')}
        </Link>
        <Link
          to="/AllCourses"
          className={`${getActiveClass("/AllCourses")} font-bold text-lg`}
        >
          {t('navigationBar.courses')}
        </Link>
        <Link
          to="/MyCourses"
          className={`${getActiveClass("/MyCourses")} font-bold text-lg`}
        >
          {t('navigationBar.myCourses')}
        </Link>
      </div>
      <div className="hidden md:flex items-center">
        <div className="relative text-white text-lg font-bold mr-4 cursor-pointer max-w-[200px] truncate">
          {username}
        </div>
        <div
          className={`h-14 w-14 rounded-full cursor-pointer border transition-all duration-300 hover:scale-110 ${
            userImage ? "" : "bg-purple-500 flex items-center justify-center"
          }`}
          onClick={() => setIsMenuVisible(!isMenuVisible)}
          style={{
            backgroundImage: userImage ? `url(${userImage})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!userImage && <FaUserCircle className="text-white h-10 w-10" />}
        </div>
        {isMenuVisible && (
          <div
            ref={menuRef}
            className="absolute right-2 top-16 w-72 bg-[#200E3E] shadow-[0_6px_40px_rgba(0,0,0,0.75)] rounded-md text-white z-50"
          >
            <div className="py-2 relative">
              <div className="absolute right-3 top-0 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-[#200E3E]" />
              <Link
                to="/Account"
                className="flex items-center px-4 py-2 text-white hover:text-black hover:bg-gray-200"
              >
                <FaUserCog className="mr-2" /> {t('navigationBar.configProfile')}
              </Link>
              <div
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-white hover:text-black hover:bg-red-200 cursor-pointer"
              >
                <FaSignOutAlt className="mr-2" /> {t('navigationBar.logout')}
              </div>
            </div>
          </div>
        )}
      </div>
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleMobileMenu}
          ></div>
          <div className="h-screen fixed top-16 left-0 right-0 bottom-0 bg-gradient-to-r from-[#783CDA] to-[#200E3E] flex flex-col items-center py-4 z-50 overflow-y-auto">
            <Link
              to="/Account"
              className="p-4 flex m-auto w-[85%] bg-gradient-to-r from-[#512599] to-[#190736] rounded-xl shadow-[#8f77b6] shadow-[0_10px_20px]"
            >
              <div className="flex items-center w-full">
                <div
                  className={`h-16 w-16 flex-shrink-0 rounded-full border transition-all duration-300 ${
                    userImage
                      ? ""
                      : "bg-purple-500 flex items-center justify-center"
                  }`}
                  style={{
                    backgroundImage: userImage ? `url(${userImage})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {!userImage && (
                    <FaUserCircle className="text-white h-12 w-12" />
                  )}
                </div>
                <div className="flex flex-col justify-center ml-2 w-full min-w-0">
                  <span className="text-white font-bungee text-2xl leading-tight">
                    {formatUsername(username)}
                  </span>
                  <span className="text-white text-lg font-sans truncate">
                    {t('navigationBar.myAccount')}
                  </span>
                </div>
              </div>
            </Link>
            <div className="w-[80%] border-b-2 border-white opacity-50 my-2 mt-6" />
            <div className="flex flex-col items-center w-full">
              <Link
                to="/Home"
                className="flex items-center py-4 w-full justify-center text-[#783CDA] text-3xl font-bold"
              >
                <div
                  className="flex items-center justify-center w-[300px] h-[110px] rounded-lg shadow-lg mt-6"
                  style={{
                    backgroundImage: `url(${fondoInicio})`,
                    backgroundSize: "cover",
                    backgroundColor: "white",
                    backgroundPosition: "center",
                  }}
                >
                  <FaHome className="mr-2 text-[#783CDA] h-8 w-8" />
                  <span className="text-3xl">{t('navigationBar.home')}</span>
                </div>
              </Link>
              <Link
                to="/AllCourses"
                className="flex items-center py-4 w-full justify-center text-[#00D8A1] text-3xl font-bold"
              >
                <div
                  className="flex items-center justify-center w-[300px] h-[110px] rounded-lg shadow-lg"
                  style={{
                    backgroundImage: `url(${fondoCursos})`,
                    backgroundSize: "cover",
                    backgroundColor: "white",
                    backgroundPosition: "center",
                  }}
                >
                  <FaBook className="mr-2 text-[#00D8A1] h-8 w-8" />
                  <span className="text-3xl">{t('navigationBar.courses')}</span>
                </div>
              </Link>
              <Link
                to="/MyCourses"
                className="flex items-center py-4 w-full justify-center text-[#F9BE0A] hover:text-[#00D8A1] text-3xl font-bold"
              >
                <div
                  className="flex items-center justify-center w-[300px] h-[110px] rounded-lg shadow-lg"
                  style={{
                    backgroundImage: `url(${fondoMiscursos})`,
                    backgroundSize: "cover",
                    backgroundColor: "white",
                    backgroundPosition: "center",
                  }}
                >
                  <FaGraduationCap className="mr-2 text-[#F9BE0A] h-8 w-8" />
                  <span className="text-3xl">{t('navigationBar.myCourses')}</span>
                </div>
              </Link>
            </div>
            <div
              onClick={handleLogout}
              className="flex items-center justify-center w-full mt-auto p-4 cursor-pointer text-red-500 hover:opacity-80"
            >
              <FaSignOutAlt className="mr-2 text-2xl" />
              <span className="text-white text-2xl font-bold">{t('navigationBar.logout')}</span>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

export default NavigationBar;