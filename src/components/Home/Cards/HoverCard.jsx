import React, { useState, useEffect } from "react";
import { FaHeart, FaClock, FaPlay } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdPlayCircleOutline } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";

const HoverCard = ({ title, description, ruta, creatorName, rating, duration, lessons, onClick, onFavoriteToggle, isFavorite }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = ruta;
    img.onload = () => setImageLoaded(true);
  }, [ruta]);

  const handleHeartClick = async (e) => {
    e.stopPropagation();
    await onFavoriteToggle();
  };

  return (
    <div
      className="group cursor-pointer rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 mb-4"
      onClick={onClick}
      style={{
        width: "250px", 
        height: "290px", 
        marginRight: "20px",
        marginTop: "10px",
      }}
    >
      <div
        className={`relative ${!imageLoaded ? "bg-gradient-to-br from-[#F1EBB1] to-[#6ED0EF]" : ""}`}
        style={{
          overflow: "hidden",
          borderTopLeftRadius: "0.5rem",
          borderTopRightRadius: "0.5rem",
          height: "175px", 
        }}
      >
        <img
          src={ruta}
          alt="Image Course Preview"
          className={`w-full h-full ${imageLoaded ? "" : "hidden"}`}
          style={{ objectFit: "cover", width: "100%", height: "100%" }} 
        />

        <div
          className={`absolute inset-0 bg-gradient-to-br from-[#F1EBB1] to-[#6ED0EF] opacity-0 group-hover:opacity-95 transition-opacity duration-300 p-4 flex items-center justify-center ${imageLoaded ? "hidden" : ""}`}
        >
          <p className="text-sm text-black font-bold text-center px-2">
            {description}
          </p>
        </div>
      </div>

      <div className="bg-white p-3 border-t border-gray-300 rounded-b-lg flex flex-col h-auto">
        <div className="flex justify-between items-center">
          <h3 className="text-black font-bold text-sm truncate">{title}</h3>
          <FaHeart
            className={`cursor-pointer ${isFavorite ? "text-red-500" : "text-gray-600"} transition-colors duration-300`}
            onClick={handleHeartClick}
            style={{ fontSize: "16px" }}
          />
        </div>
        <p className="text-gray-700 text-xs mt-1 truncate">{creatorName}</p>
        <div className="flex items-center mt-1 mb-1">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className={`mt-3 w-4 h-4 ${index < Math.floor(rating) ? "text-yellow-500" : "text-gray-300"}`}
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2.2l2.4 4.8 5.2.8-3.8 3.7.9 5.3-4.7-2.5-4.7 2.5.9-5.3-3.8-3.7 5.2-.8L12 2.2z" />
            </svg>
          ))}
          <span className="text-gray-600 ml-1 text-xs mt-2">{rating}/5</span>
        </div>
        <div className="border-t border-gray-300 pt-1 flex justify-between items-center text-gray-600 text-xs mt-0">
          <div className="flex items-center">
            <AiOutlineClockCircle className="mr-1" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center">
            <MdPlayCircleOutline className="mr-1" />
            <span>{lessons}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoverCard;