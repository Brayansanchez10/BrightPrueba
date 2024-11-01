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
        pauseOnHover: false,
    };

    return (
        <div 
            className="flex justify-center my-8 mx-4 sm:my-12 sm:mx-6 md:my-16 md:mx-10 lg:my-20 lg:mx-16 rounded-3xl bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${fondo})` }}
        >
            <Slider {...settings} className="w-full my-5 sm:my-10 md:my-20 lg:my-40">
                {phrases.map((phrase, index) => (
                    <div key={index} className="flex flex-row items-center justify-center text-center p-4 md:p-6">
                        <div className="sm:w-[55%] sm:h-[260px] md:h-[300px] lg:h-[335px] sm:pt-[80px] md:pt-[90px] lg:pt-[120px] font-bungee">
                            <h2 className="text-lg tracking-widest sm:text-xl md:text-2xl lg:text-3xl italic text-white mb-2 md:mb-4 transition-transform transform hover:scale-105">
                                "{phrase.text}"
                            </h2>
                            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mt-2 md:mt-4 font-satisfy font-semibold">
                                — {phrase.author}
                            </p>
                        </div>
                        <div className="flex justify-center sm:relative mt-4 md:mt-6">
                            <img 
                                className="sm:absolute sm:bottom-6 md:bottom-8 lg:-bottom-3 sm:right-4 md:right-5 lg:right-10 w-56 h-56 sm:w-[30%] sm:h-56 md:w-[40%] md:h-64 lg:h-96 object-cover shadow-lg transition-transform transform hover:scale-105 rounded-2xl" 
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
