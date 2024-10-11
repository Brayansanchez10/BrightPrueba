import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import imagen from "../assets/img/hola.png";
import { motion } from "framer-motion";

const phrases = ["User successfully activated"];

const WelcomePage = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [userActivated, setUserActivated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) =>
        prevIndex === phrases.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    const activationTimeout = setTimeout(() => {
      setUserActivated(true);
    }, 1000);

    const navigateTimeout = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(activationTimeout);
      clearTimeout(navigateTimeout);
    };
  }, [navigate]);

  return (
    <div className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 min-h-screen flex justify-center items-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r w-11/12 md:w-7/12 from-indigo-500 to-purple-500 py-8 px-10 rounded-3xl shadow-2xl"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex justify-center mb-8"
        >
          <motion.img 
            src={imagen} 
            alt="ImageLogo" 
            className="h-32 w-32 md:h-48 md:w-48 rounded-full border-4 border-white shadow-lg"
            initial={{ rotate: 360 }}
            animate={{ rotate: 10 }}
            transition={{ duration: 2, loop: Infinity, ease: "linear" }}
          />
        </motion.div>
        <motion.div
          className="text-2xl mt-2 text-center font-semibold text-white"
          key={currentPhraseIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {phrases[currentPhraseIndex]}
        </motion.div>
        {userActivated && (
          <motion.h2
            className="text-3xl mb-4 font-bold text-black flex justify-center mt-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to our educational platform!
          </motion.h2>
        )}
        <div className="flex justify-center mt-6">
          <motion.button
            onClick={() => navigate("/")}
            className="py-2 px-6 text-lg bg-green-500 text-white rounded-lg shadow-lg hover:bg-lime-500 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Log in
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
