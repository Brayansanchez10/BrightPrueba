import { useState, useEffect, useRef } from 'react';
import { FaBars, FaEdit, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'; 
import { useUserContext } from '../../context/user/user.context.jsx';
import { useAuth } from '../../context/auth.context.jsx';
import { Link } from 'react-router-dom';
import LeftBar from './LeftBar';
import { useTranslation } from 'react-i18next';
import Logo from "../../assets/img/hola.png";

const Navbar = () => {
  const { t } = useTranslation("global");
  const { logout } = useAuth();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const menuRef = useRef(null);
  const sidebarRef = useRef(null);
  const { getUserById } = useUserContext();
  const { user } = useAuth();
  const [username, setUsername] = useState("Cargando...");
  const [userImage, setUserImage] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (error) {
      console.error('Error al hacer logout:', error);
    }
  };

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

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuVisible(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [getUserById, user]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <>
      <nav className="shadow-lg shadow-teal-200 bg-[#160a2b] py-2 transition-all duration-500 justify-center flex w-full max-h-16">
        <div ref={sidebarRef}>
          <LeftBar onVisibilityChange={(isVisible) => setIsSidebarVisible(isVisible)} />
        </div>
        <div className="flex items-center w-screen text-justify">
          <div className="absolute left-0 top-6 flex items-center">
            <FaBars
              className="text-white text-lg cursor-pointer ml-4"
              onClick={toggleSidebar}
              onClickCapture={() => setIsSidebarVisible(true)}
              onTouchStartCapture={() => setIsSidebarVisible(true)}
            />
          </div>
          <div className="flex-1 justify-center font-bungee text-center flex items-center md:ml-48 ml-12 sm:ml-48">
            <Link to="/admin" className="flex items-center text-white text-[28px] tracking-wider">
              <span>BRING</span>
              <span className="text-[#00D8A1]">MIND</span>
              <img className="h-[70px]" src={Logo} alt="Logo" />
            </Link>
          </div>

          {/* Imagen y nombre de usuario solo en pantallas más grandes */}
          <div className="hidden sm:flex items-center font-bungee ml-auto mr-4 relative tracking-wide">
            <span className="text-white text-lg mr-4">{username}</span>
            <div className="relative">
              {userImage ? (
                <img
                  src={userImage}
                  alt="UserImage"
                  className="h-12 w-12 cursor-pointer rounded-full"
                  onClick={toggleMenu}
                />
              ) : (
                <FaUserCircle
                  size="48px"
                  className="cursor-pointer text-white"
                  onClick={toggleMenu}
                />
              )}
              {isMenuVisible && (
                <div
                  ref={menuRef}
                  className="absolute right-0 mt-2 w-64 bg-gradient-to-r from-[#200E3E] to-[#341369] shadow-lg rounded-md transition-all duration-300"
                >
                  <ul className="py-2">
                    <li className="flex px-4 py-3 hover:bg-gray-600 cursor-pointer text-white rounded">
                      <FaEdit size="20px" className="mr-2" /><Link to="/ProfileEditor">{t('navigationBar.configure_profile')}</Link>
                    </li>
                    <li
                      className="flex px-4 py-3 hover:bg-red-600 cursor-pointer text-white rounded"
                      onClick={handleLogout}
                    > <FaSignOutAlt size="20px" className="mr-2" />
                      {t('navigationBar.logout')}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;