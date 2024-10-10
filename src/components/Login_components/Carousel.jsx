import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import imagen from "../../assets/img/hola.png";

function Carousel() {
  const { t } = useTranslation("global");

  const phrases = [
    { text: t("carousel.phrases.mandela.text"), author: "Nelson Mandela", image: "image_url1" },
    { text: t("carousel.phrases.dewey.text"), author: "John Dewey", image: "image_url2" },
    { text: t("carousel.phrases.malcolm.text"), author: "Malcolm X", image: "image_url3" },
    { text: t("carousel.phrases.bloom.text"), author: "Allan Bloom", image: "image_url4" },
    { text: t("carousel.phrases.ebbinghaus.text"), author: "Hermann Ebbinghaus", image: "image_url5" },
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentPhraseIndex((prevIndex) =>
          prevIndex === phrases.length - 1 ? 0 : prevIndex + 1
        );
        setFade(true);  // Restaura la opacidad
      }, 600);  // Tiempo de la animación de desvanecimiento
    }, 4500);  // Cambia de frase cada x segundos

    return () => clearInterval(interval);
  }, [phrases.length]);


  return (
    <div className="relative">
      {/* Pestañas de redes sociales */}
      <div className="absolute top-2 left-0 xl:left-[-20px]">
        <a href="https://www.facebook.com/MesaDavisEnterprises/" target="_blank" rel="noopener noreferrer">
          <div className="flex bg-blue-600 p-2 rounded-br-lg group">
            <FaFacebookF size={20} className="flex text-white text-xl" />
            <p className="text-white font-semibold -mt-1 ml-2 hidden group-hover:block">Facebook</p>
          </div>
        </a>
      </div>
      <div className="absolute top-[54px] left-0 xl:left-[-20px]">
        <a href="https://x.com/MesaDavisEnt" target="_blank" rel="noopener noreferrer">
          <div className="flex bg-black p-2 rounded-br-lg group">
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 512 512">
              <path fill="white" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
            </svg>
            <p className="text-white font-semibold -mt-1 ml-2 hidden group-hover:block">X</p>
          </div>
        </a>
      </div>
      <div className="absolute top-[100px] left-0 xl:left-[-20px]">
        <a href="https://www.instagram.com/mesadoko" target="_blank" rel="noopener noreferrer">
          <div className="flex bg-pink-500 p-2 rounded-br-lg group">
            <FaInstagram size={20} className="text-white text-xl" />
            <p className="text-white font-semibold -mt-1 ml-2 hidden group-hover:block">Instagram</p>
          </div>
        </a>
      </div>

      {/* Contenedor del carrusel */}
      <div className="bg-gradient-to-r from-purple-600 to-emerald-500 w-full sm:w-auto rounded-tl-3xl rounded-bl-3xl p-8">
        <div className="text-center text-white">
          <img
            className="h-60 w-60 sm:h-64 sm:w-64 lg:h-80 lg:w-80 mx-auto mb-0 mt-0"
            src={imagen}
            alt="Logo"
          />
          <div className="h-48 lg:h-56 block items-center justify-center">
            <p className={`text-xl sm:text-xl lg:text-2xl italic text-center font-bungee transition-opacity duration-500 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'}`}>
              "{phrases[currentPhraseIndex].text}"
            </p>
            <br />
            <p className={`text-lg sm:text-xl lg:text-2xl text-gray-300 font-satisfy font-semibold transition-opacity duration-500 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'}`}>
              - {phrases[currentPhraseIndex].author}
            </p>
          </div>

          <div className="text-lg mt-16 sm:text-sm text-gray-300 text-opacity-90 sm:mt-28 lg:mt-32 font-bold mb-16 sm:mb-32 lg:mb-8">
            {t("footer.description")}
            <p className="text-sm">{t("footer.copy_right")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carousel;
