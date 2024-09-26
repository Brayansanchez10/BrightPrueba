import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function ProfileCarousel({ profiles }) {
    const settings = {
        infinite: true,
        speed: 1000,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
        pauseOnHover: false,
        responsive: [
            {
                breakpoint: 1124,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const SecondSettings = {
        infinite: true,
        speed: 1000,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
        rtl: true,
        pauseOnHover: false,
        responsive: [
            {
                breakpoint: 1124,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };


    return (
        <div>
            <div className="flex justify-center py-8 px-4 md:px-8 lg:px-16">
                <Slider {...settings} className="w-full">
                    {profiles.map((profile, index) => (
                        <div key={index} className="p-4">
                            <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-6 max-w-[340px] mx-auto md:max-w-[400px] lg:max-w-none">
                                <img
                                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover"
                                    src={profile.imageUrl}
                                    alt={`Profile ${index + 1}`}
                                />
                                <div>
                                    <h2 className="text-lg font-bold text-purple-700 mb-2">
                                        {profile.name}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {profile.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
            <div className="flex justify-center py-8 px-4 md:px-8 lg:px-16">
                <Slider {...SecondSettings} className="w-full">
                    {profiles.map((profile, index) => (
                        <div key={index} className="p-4">
                            <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-6 max-w-[340px] mx-auto md:max-w-[400px] lg:max-w-none">
                                <img
                                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover"
                                    src={profile.imageUrl}
                                    alt={`Profile ${index + 1}`}
                                />
                                <div>
                                    <h2 className="text-lg font-bold text-purple-700 mb-2">
                                        {profile.name}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {profile.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default ProfileCarousel;
