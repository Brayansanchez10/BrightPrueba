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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) =>
        prevIndex === phrases.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Cambia la frase cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Pestañas de redes sociales */}
      <div className="absolute top-2 left-0 xl:left-[-20px]">
        <a href="https://www.facebook.com/disruptive.devops?checkpoint_src=any" target="_blank" rel="noopener noreferrer">
          <div className="flex bg-blue-600 p-2 rounded-br-lg group">
            <FaFacebookF className="flex text-white text-xl" />
            <p className="text-white font-semibold hidden group-hover:block">Facebook</p>
          </div>
        </a>
      </div>
      <div className="absolute top-[50px] left-0 xl:left-[-20px]">
        <a href="https://x.com/DisruptiveITDev" target="_blank" rel="noopener noreferrer">
          <div className="flex bg-blue-400 p-2 rounded-br-lg group">
            <FaTwitter className="text-white text-xl" />
            <p className="text-white font-semibold hidden group-hover:block">Twitter</p>
          </div>
        </a>
      </div>
      <div className="absolute top-[92px] left-0 xl:left-[-20px]">
        <a href="https://www.instagram.com/disruptive.info/" target="_blank" rel="noopener noreferrer">
          <div className="flex bg-pink-500 p-2 rounded-br-lg group">
            <FaInstagram className="text-white text-xl" />
            <p className="text-white font-semibold hidden group-hover:block">Instagram</p>
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
            <p className="text-xl sm:text-2xl lg:text-3xl italic text-center">
              "{phrases[currentPhraseIndex].text}"
            </p>
            <br />
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-black">
              - {phrases[currentPhraseIndex].author}
            </p>
          </div>

          <div className="text-lg mt-8 sm:text-sm text-gray-300 text-opacity-90 sm:mt-16 lg:mt-8 font-bold mb-16">
            {t("footer.description")}
            <p className="text-sm">{t("footer.copy_right")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carousel;
