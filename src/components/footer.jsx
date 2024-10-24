import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { MailIcon, ChevronUpIcon, BookOpenIcon, GlobeIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/img/hola.png";
import { Link } from "react-router-dom";

const Footer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation("global");

  const toggleFooter = () => setIsExpanded(!isExpanded);

  return (
    <footer className="bg-gradient-to-r from-[#783CDA] to-[#200E3E] text-white w-full fixed bottom-0 shadow-lg">
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? "auto" : "40px" }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden flex flex-col"
      >
        <div className="container mx-auto px-2 sm:px-4 flex flex-col h-full">
          <div className="flex justify-between items-center h-[40px]">
            <motion.button
              onClick={toggleFooter}
              className="text-white focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronUpIcon
                className={`w-4 h-4 sm:w-6 sm:h-6 transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </motion.button>
            {!isExpanded && (
              <>
                <span className="text-[10px] sm:text-xs mr-[25%] sm:-mr-16">
                  {t('footer.copy')}
                </span>
                <img src={Logo} alt="Logo" className="h-6 sm:h-10 mr-8 sm:mr-16 hidden sm:block" />
              </>
            )}
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col justify-between py-2 sm:py-4 h-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full mb-2">
                  <div className="flex flex-col items-start">
                    <h3 className="text-base sm:text-xl font-bold font-bungee mb-1 sm:mb-2">
                      {t('footer.title')}<span className="text-[#00D8A1]">Mind</span>
                    </h3>
                    <p className="text-xs sm:text-sm max-w-md font-sans mb-2 sm:mb-4">
                      {t('footer.text')}
                    </p>
                    <div className="flex space-x-2 sm:space-x-4">
                      {["https://www.facebook.com/disruptive.devops", "https://x.com/DisruptiveITDev", "https://www.instagram.com/disruptive.info/"].map((social) => (
                        <motion.a
                          key={social}
                          href={`${social}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full text-[#783CDA] hover:bg-[#000000] hover:text-white transition-colors duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {social === "https://www.facebook.com/disruptive.devops" && <FaFacebook size="12px" className="sm:text-base" />}
                          {social === "https://x.com/DisruptiveITDev" && (
                            <svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 512 512" className="sm:h-4">
                              <path fill="currentColor" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
                            </svg>
                          )}
                          {social === "https://www.instagram.com/disruptive.info/" && <FaInstagram size="12px" className="sm:text-base" />}
                        </motion.a>                      
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <img src={Logo} alt="Logo" className="h-20 sm:h-32 mb-2 sm:mb-4" />
                    <div className="flex justify-center space-x-2 sm:space-x-4 mb-1 sm:mb-2">
                      <button
                        className="text-xs sm:text-sm hover:text-[#00D8A1] transition-colors duration-300 font-bungee"
                      >
                       {t('footer.developed')}
                      </button>
                    </div>
                    <span className="text-[10px] sm:text-xs">
                      {t('footer.copy')}
                    </span>
                  </div>

                  <div className="flex flex-col items-start md:items-end justify-between">
                    <div className="w-full">
                      <h4 className="text-sm sm:text-lg font-bold mb-2 sm:mb-3 text-[#00D8A1]">
                        {t('footer.options')}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 sm:gap-4">
                        <motion.a
                          href="/AllCourses"
                          className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm hover:text-[#00D8A1] transition-colors duration-300"
                          whileHover={{ x: 5 }}
                        >
                          <BookOpenIcon size={12} className="sm:w-4 sm:h-4" />
                          <span>{t('footer.courses')}</span>
                        </motion.a>
                        <motion.a
                          href="#"
                          className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm hover:text-[#00D8A1] transition-colors duration-300"
                          whileHover={{ x: 5 }}
                        >
                          <GlobeIcon size={12} className="sm:w-4 sm:h-4" />
                          <span>{t('footer.blog')}</span>
                        </motion.a>
                        <motion.a
                          href="/MyCourses"
                          className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm hover:text-[#00D8A1] transition-colors duration-300"
                          whileHover={{ x: 5 }}
                        >
                          <BookOpenIcon size={12} className="sm:w-4 sm:h-4" />
                          <span>{t('footer.yourCourses')}</span>
                        </motion.a>
                        <motion.a
                          href="#"
                          className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm hover:text-[#00D8A1] transition-colors duration-300"
                          whileHover={{ x: 5 }}
                        >
                          <GlobeIcon size={12} className="sm:w-4 sm:h-4" />
                          <span>{t('footer.events')}</span>
                        </motion.a>
                      </div>
                    </div>
                    <motion.button
                      className="mt-2 sm:mt-4 flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold text-[#783CDA] bg-white rounded-full shadow-lg hover:bg-[#00D8A1] hover:text-white transition-all duration-300 ease-in-out"
                      onClick={() => (window.location.href = "mailto:contacto@empresa.com")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MailIcon className="w-3 h-3 sm:w-5 sm:h-5" />
                      <span>{t('footer.Contact')}</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;