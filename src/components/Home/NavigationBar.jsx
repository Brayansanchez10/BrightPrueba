import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaUserCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import Logo from "../../assets/img/hola.png";
import { useAuth } from "../../context/auth.context";
import { useUserContext } from "../../context/user/user.context";
import { useTranslation } from 'react-i18next';
import '../../css/Style.css';

function NavigationBar() {
  const { t } = useTranslation("global");
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const { getUserById } = useUserContext();
  const [username, setUsername] = useState("");
  const [userImage, setUserImage] = useState("");

  const menuRef = useRef(null);

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

  return (
    <nav className="bg-gradient-to-r from-[#783CDA] to-[#200E3E] h-16 p-2 flex justify-between items-center w-full shadow-md font-bungee">
      {/* Logo y título para pantallas grandes */}
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
        <Link to="/Home" className="text-white font-bold text-lg hover:text-[#00D8A1]">INICIO</Link>
        <Link to="/AllCourses" className="text-white font-bold text-lg hover:text-[#00D8A1]">CURSOS</Link>
        <Link to="/MyCourses" className="text-white font-bold text-lg hover:text-[#00D8A1]">MIS CURSOS</Link>
      </div>
      <div className="hidden md:flex items-center">
        <div className="relative text-white text-lg font-bold mr-4 cursor-pointer">
          {username}
        </div>
        <div
          className={`h-10 w-10 rounded-full cursor-pointer border transition-all duration-300 hover:scale-110 ${userImage ? "" : "bg-purple-500 flex items-center justify-center"}`}
          onClick={() => setIsMenuVisible(!isMenuVisible)}
          style={{
            backgroundImage: userImage ? `url(${userImage})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!userImage && <FaUserCircle className="text-white h-8 w-8" />}
        </div>
        {isMenuVisible && (
          <div
            ref={menuRef}
            className="absolute right-2 top-16 w-64 bg-[#200E3E] shadow-[0_4px_30px_rgba(0,0,0,0.5)] rounded-md text-white"
          >
            <div className="py-2 relative">
              <div className="absolute right-3 top-0 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-[#200E3E]" />
              <Link
                to="/Account"
                className="flex items-center px-4 py-2 text-white hover:text-black hover:bg-gray-200"
              >
                <FaUserCog className="mr-2" /> CONFIGURAR PERFIL
              </Link>
              <div
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-white hover:text-black hover:bg-red-200 cursor-pointer"
              >
                <FaSignOutAlt className="mr-2" /> CERRAR SESIÓN
              </div>
            </div>
          </div>
        )}
      </div>
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={toggleMobileMenu}></div>
          <div className="fixed top-16 left-0 right-0 bg-gradient-to-r from-[#783CDA] to-[#200E3E] flex flex-col items-center py-4 z-20">
            <div className="flex items-center mb-4 p-2 rounded-xl shadow-md bg-gradient-to-r from-[#783CDA] to-[#200E3E]">
              <div
                className={`h-10 w-10 rounded-full border transition-all duration-300 ${userImage ? "" : "bg-purple-500 flex items-center justify-center"}`}
                style={{
                  backgroundImage: userImage ? `url(${userImage})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!userImage && <FaUserCircle className="text-white h-8 w-8" />}
              </div>
              <span className="text-white font-bold ml-2">{username}</span>
            </div>
            <Link to="/Home" className="py-2 text-white hover:text-[#00D8A1]">INICIO</Link>
            <Link to="/AllCourses" className="py-2 text-white hover:text-[#00D8A1]">CURSOS</Link>
            <Link to="/MyCourses" className="py-2 text-white hover:text-[#00D8A1]">MIS CURSOS</Link>
            <div
              onClick={handleLogout}
              className="flex items-center py-2 text-white hover:text-black hover:bg-red-200 cursor-pointer"
            >
              <FaSignOutAlt className="mr-2" /> SALIR
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

export default NavigationBar;
