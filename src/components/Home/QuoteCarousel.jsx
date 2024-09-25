import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import fondo from "../../assets/img/QuoteFondo.jpg";

function QuoteCarousel({ phrases }) {
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
    };

    return (
        <div 
            className="flex justify-center my-8 mx-4 sm:my-12 sm:mx-6 md:my-16 md:mx-10 lg:my-20 lg:mx-16 border rounded-3xl bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${fondo})` }}
        >
            <Slider {...settings} className="w-full my-40">
                {phrases.map((phrase, index) => (
                    <div key={index} className="flex flex-row items-center justify-center text-center p-4 md:p-6">
                        <div>
                            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl italic font-bold text-white mb-2 md:mb-4 transition-transform transform hover:scale-105">
                                "{phrase.text}"
                            </h2>
                            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mt-2 md:mt-4 font-semibold">
                                — {phrase.author}
                            </p>
                        </div>
                        <div className="flex justify-center mt-4 md:mt-6">
                            <img 
                                className="w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg transition-transform transform hover:scale-110" 
                                src={phrase.imageUrl} 
                                alt={`Image ${index + 1}`} 
                            />
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default QuoteCarousel;
