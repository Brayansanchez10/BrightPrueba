import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
    <div className="hidden rounded-r-3xl sm:flex sm:items-center sm:w-1/2 sm:min-h-screen bg-gradient-to-r from-purple-600 to-emerald-500 shadow-pink-500 shadow-2xl justify-center">
      <div className="text-center text-white">
        <img className="h-80 w-80 mx-auto mb-4 mt-10" src={imagen} alt="Logo" />
        <p className="text-3xl italic mb-2 mt-10">"{phrases[currentPhraseIndex].text}"</p>
        <p className="text-2xl font-bold mt-20 text-black">- {phrases[currentPhraseIndex].author}</p>
      </div>
    </div>
  );
}

export default Carousel;
