import React from "react";

const HoverCard = ({ title, description, ruta, onClick }) => {
  return (
    <div
      className="group cursor-pointer bg-white w-full rounded-2xl shadow-lg transform transition-transform duration-500 hover:scale-105 mb-10"
      onClick={onClick}
    >
      <div className="relative ">
        <img
          src={ruta}
          alt="Image Course Preview"
          className="w-full h-32 sm:h-48 md:h-56 object-cover rounded-t-lg"
        />
      </div>
      <div
        className="p-3 bg-gray-700 
      sm:bg-gradient-to-tr from-purple-500 to-pink-500 border-t border-white rounded-b-lg"
      >
        <h3 className="text-lg font-semibold text-white text-center">
          {title}
        </h3>
        <p
          className="mt-2 text-sm text-white text-wrap mb-4
        sm:hidden 
         md:hidden"
        >
          {description}
        </p>
        <div
          className="absolute inset-0  items-center justify-center bg-gradient-to-br from-pink-200 to-violet-300 border border-black 
        opacity-0 sm:hover:opacity-95 transition-opacity duration-300 p-4 sm:flex"
        >
          <div className="text-center">
            <p
              className="mt-2 text-lg text-black font-bold whitespace-wrap text-center px-2 sm:hover:opacity-100
            sm:text-base 
            md:text-lg"
            >
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoverCard;
