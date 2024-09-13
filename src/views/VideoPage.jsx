import React, { useEffect, useState } from 'react';
import Animation1_320 from "../assets/Video/Animation1_320.mp4";
import Animation2_320 from "../assets/Video/Animation2_320.mp4";
import Animation1_425 from "../assets/Video/Animation1_425.mp4";
import Animation2_425 from "../assets/Video/Animation2_425.mp4";
import Animation1_768 from "../assets/Video/Animation1_768.mp4";
import Animation2_768 from "../assets/Video/Animation2_768.mp4";
import Animation1 from "../assets/Video/Animation1.mp4";
import Animation2 from "../assets/Video/Animation2.mp4";
import Animation3 from "../assets/Video/Animation3.mp4";
import Animation4 from "../assets/Video/Animation4.mp4";


const VideoPage = () => {
  const [randomIndex, setRandomIndex] = useState(0);
  const [videos, setVideos] = useState([]);

  // Función para obtener un índice aleatorio diferente cada vez
  const getRandomIndex = () => {
    const newIndex = Math.floor(Math.random() * videos.length);
    setRandomIndex(newIndex);
  };

  const getVideosBySize = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 320) {
      setVideos([Animation1_320, Animation2_320]);
    } else if (screenWidth <= 425) {
      setVideos([Animation1_425, Animation2_425]);
    } else if (screenWidth <= 820) {
      setVideos([Animation1_768, Animation2_768]);
    } else {
      setVideos([Animation1, Animation2, Animation3, Animation4]);
    }
  };

  useEffect(() => {
    getVideosBySize(); // Llamada inicial para seleccionar los videos según el tamaño de pantalla
  }, []);

  // Se ejecuta getRandomIndex cuando se guardan los videos
  useEffect(() => {
    if (videos.length > 0) {
      getRandomIndex();
    }
  }, [videos]);

  return (
    <div className="flex items-center justify-center w-full h-screen bg-black">
      {videos.length > 0 && (
        <video className="w-full h-full object-cover" autoPlay muted onEnded={getRandomIndex}>
          <source src={videos[randomIndex]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoPage;