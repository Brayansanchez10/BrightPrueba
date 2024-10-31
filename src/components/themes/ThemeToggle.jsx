import React from 'react';
import { useTheme } from './theme.context.jsx';
import { motion } from 'framer-motion';
import { RiMoonFill } from "react-icons/ri";
import { IoSunny } from "react-icons/io5";

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`flex items-center justify-start p-1 rounded-full w-[50px] h-[25px]`}
      animate={{ 
        backgroundColor: isDarkMode ? '#d1d5db' : '#4c1d95'
      }}
      transition={{ duration: 0.05 }}
    >
      <motion.div
        className={`flex items-center justify-center w-[18px] h-[18px] rounded-full shadow-md ${
          isDarkMode ? 'bg-purple-900' : 'bg-white'
        }`}
        animate={{ x: isDarkMode ? 24.5 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {isDarkMode ? (
          <RiMoonFill className="text-white text-sm" />
        ) : (
          <IoSunny className="text-purple-900 text-sm" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
