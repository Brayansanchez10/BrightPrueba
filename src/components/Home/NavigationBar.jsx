import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaUserCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaBook,
  FaGraduationCap,
  FaComments,
} from "react-icons/fa";
import Logo from "../../assets/img/hola.png";
import { useAuth } from "../../context/auth.context";
import { useUserContext } from "../../context/user/user.context";
import { useTranslation } from "react-i18next";
import "../../css/Style.css";
import fondoInicio from "../../assets/img/fondo_inicio.png";
import fondoCursos from "../../assets/img/fondo_cursos.png";
import fondoMiscursos from "../../assets/img/fondo_miscursos.png";
import fondoForo from "../../assets/img/fondo_cursos.png";
import ThemeToggle from '../themes/ThemeToggle';

export default function NavigationBar() {
  const { t } = useTranslation("global");
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const { getUserById } = useUserContext();
  const [username, setUsername] = useState("");
  const [userImage, setUserImage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const menuRef = useRef(null);
  const [scrollDirection, setScrollDirection] = useState("up");

  const [forumActive, setForumActive] = useState(true); // Activado por defecto

  useEffect(() => {
      const forumState = localStorage.getItem("forumActive");

      // Si hay un estado guardado en localStorage, lo usamos; de lo contrario, permanece activo
      if (forumState !== null) {
          setForumActive(forumState === "true");
      }
  }, []);

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 900) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
      : "text-white hover:text-[#00D8A1] transition-all duration-700";
  };

  const formatUsername = (name) => {
    const words = name.split(" ");
    if (words.length > 2) {
      return (
        <>
          <span className="inline-block max-w-full break-words hyphens-auto">
            {words[0]}
          </span>
          <br />
          <span className="inline-block max-w-full break-words hyphens-auto">
            {words.slice(1).join(" ")}
          </span>
        </>
      );
    }
    return words.map((word, index) => (
      <React.Fragment key={index}>
        <span className="inline-block max-w-full break-words hyphens-auto">
          {word}
        </span>
        {index < words.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const handleAccountClick = () => {
    navigate("/Account");
    setIsMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate(`/profile/${user.data.id}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`bg-gradient-to-r from-[#783CDA] to-[#200E3E] h-16 p-2 flex justify-between items-center w-full shadow-md font-bungee fixed top-0 z-50 transition-transform duration-300 ${
          scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="hidden lg:flex items-center">
          <img className="h-20 w-auto mr-3" src={Logo} alt="Logo" />
          <span className="text-white font-bold text-2xl">
            BRIGHT<span className="text-[#00D8A1]">MIND</span>
          </span>
        </div>
        <div className="flex items-center justify-between w-full lg:hidden">
          <img className="h-16 w-auto" src={Logo} alt="Logo" />
          <span className="text-white font-bold text-xl text-center flex-1">
            BRIGHT<span className="text-[#00D8A1]">MIND</span>
          </span>
        </div>
        <div className="hidden lg:flex items-center space-x-8">
          <Link
            to="/Home"
            className={`${getActiveClass("/Home")} font-bold text-lg`}
          >
            {t("navigationBar.home")}
          </Link>
          <Link
            to="/AllCourses"
            className={`${getActiveClass("/AllCourses")} font-bold text-lg`}
          >
            {t("navigationBar.courses")}
          </Link>
          <Link
            to="/MyCourses"
            className={`${getActiveClass("/MyCourses")} font-bold text-lg`}
          >
            {t("navigationBar.myCourses")}
          </Link>
          {forumActive && (
            <Link
              to="/Forum"
              className={`${getActiveClass("/Forum")} font-bold text-lg`}
            >
              {t("navigationBar.forum")}
            </Link>
          )}
        </div>
        <div className="hidden lg:flex items-center">
          <div className="flex flex-col items-end mr-4">
            <div className="relative text-white text-lg font-bold cursor-pointer max-w-[200px] truncate">
              {username}
            </div>
            <ThemeToggle />
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
                  to={`/profile/${user.data.id}`}
                  className="flex items-center px-4 py-2 text-white hover:text-black hover:bg-gray-200"
                >
                  <FaUserCircle className="mr-2" /> 
                  <a href="/profile">{t('navigationBar.view_profile')}</a>
                </Link>
                <Link
                  to="/Account"
                  className="flex items-center px-4 py-2 text-white hover:text-black hover:bg-gray-200"
                >
                  <FaUserCog className="mr-2" /> 
                  {t("navigationBar.configProfile")}
                </Link>
                <div
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-white hover:text-black hover:bg-red-200 cursor-pointer"
                >
                  <FaSignOutAlt className="mr-2" /> {t("navigationBar.logout")}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      <button
        onClick={toggleMobileMenu}
        className="fixed top-5 right-4 text-white z-[70] lg:hidden"
      >
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed inset-0 top-16 bg-gradient-to-r from-[#783CDA] to-[#200E3E] flex flex-col items-center py-4 z-50 overflow-y-auto">
            <div className="flex flex-col items-center justify-between h-full w-full">
              <div className="flex flex-col items-center w-full flex-grow">
                <div
                  onClick={handleAccountClick}
                  className="p-4 py-6 flex m-auto w-[85%] bg-gradient-to-r from-[#512599] to-[#190736] rounded-xl shadow-[#8f77b6] shadow-[0_10px_20px] cursor-pointer"
                >
                  <div className="flex items-center w-full">
                    <div
                      className={`h-16 w-16 flex-shrink-0 rounded-full border transition-all duration-300 ${
                        userImage
                          ? ""
                          : "bg-purple-500 flex items-center justify-center"
                      }`}
                      style={{
                        backgroundImage: userImage
                          ? `url(${userImage})`
                          : "none",
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProfileClick();
                        }}
                        className="text-white text-lg font-sans truncate bg-gradient-to-r from-[#512599] to-[#190736] hover:from-[#6B35C3] hover:to-[#2D1259] py-1 px-3 rounded-md mt-1 transition-colors duration-300 shadow-[#8f77b6] shadow-[0_5px_10px]"
                      >
                        {t("navigationBar.myAccount")}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="my-auto">
                  <div className="flex flex-col items-center w-full space-y-4 mt-4">
                    <Link
                      to="/Home"
                      className="flex items-center py-2 w-full justify-center text-[#783CDA] text-2xl font-bold"
                      onClick={toggleMobileMenu}
                    >
                      <div
                        className="flex items-center justify-center w-[250px] h-[90px] rounded-lg shadow-lg"
                        style={{
                          backgroundImage: `url(${fondoInicio})`,
                          backgroundSize: "cover",
                          backgroundColor: "white",
                          backgroundPosition: "center",
                        }}
                      >
                        <FaHome className="mr-2 text-[#783CDA] h-6 w-6" />
                        <span className="text-2xl font-bungee">
                          {t("navigationBar.home")}
                        </span>
                      </div>
                    </Link>

                    <Link
                      to="/AllCourses"
                      className="flex items-center py-2 w-full justify-center text-[#00D8A1] text-2xl font-bold"
                      onClick={toggleMobileMenu}
                    >
                      <div
                        className="flex items-center justify-center w-[250px] h-[90px] rounded-lg shadow-lg"
                        style={{
                          backgroundImage: `url(${fondoCursos})`,
                          backgroundSize: "cover",
                          backgroundColor: "white",
                          backgroundPosition: "center",
                        }}
                      >
                        <FaBook className="mr-2 text-[#00D8A1] h-6 w-6" />
                        <span className="text-2xl font-bungee">
                          {t("navigationBar.courses")}
                        
                        </span>
                      </div>
                    </Link>

                    <Link
                      to="/MyCourses"
                      className="flex items-center py-2 w-full justify-center text-[#F9BE0A] hover:text-[#00D8A1] text-2xl font-bold"
                      onClick={toggleMobileMenu}
                    >
                      <div
                        className="flex items-center justify-center w-[250px] h-[90px] rounded-lg shadow-lg"
                        style={{
                          backgroundImage: `url(${fondoMiscursos})`,
                          backgroundSize: "cover",
                          backgroundColor: "white",
                          backgroundPosition: "center",
                        }}
                      >
                        <FaGraduationCap className="mr-2  text-[#F9BE0A] h-6 w-6" />
                        <span className="text-2xl font-bungee">
                          {t("navigationBar.myCourses")}
                        </span>
                      </div>
                    </Link>

                    {forumActive && (
                      <Link
                        to="/Forum"
                        className="flex items-center py-2 w-full justify-center text-red-500 text-2xl font-bold"
                        onClick={toggleMobileMenu}
                      >
                        <div
                          className="flex items-center justify-center w-[250px] h-[90px] rounded-lg shadow-lg"
                          style={{
                            backgroundImage: `url(${fondoForo})`,
                            backgroundSize: "cover",
                            backgroundColor: "white",
                            backgroundPosition: "center",
                          }}
                        >
                          <FaComments className="mr-2 text-red-500 h-6 w-6" />
                          <span className="text-2xl font-bungee text-red-500">
                          {t("navigationBar.forum")}
                          </span>
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center w-full p-4 mt-8 space-y-4">
                <div className="flex items-center">
                  <ThemeToggle />
                  <span className="text-white text-xl sm:text-2xl font-bold font-bungee ml-2">{t("navigationBar.theme")}</span>
                </div>
                <div
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="flex items-center cursor-pointer text-red-500 hover:opacity-80"
                >
                  <FaSignOutAlt className="mr-2 text-xl sm:text-2xl" />
                  <span className="text-white text-xl sm:text-2xl font-bold font-bungee">
                    {t("navigationBar.logout")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}