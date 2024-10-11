import React from 'react';

function CategorySection({ categories }) {
    return (
        <div className="mt-8 sm:mt-12 lg:mt-16 grid "> {/* Ajuste del margen superior para dispositivos de diferentes tamaños */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-3xl font-semibold text-center mb-8">CATEGORIES</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.map((category, index) => (
                        <a
                            key={index}
                            href={category.link}
                            className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between hover:bg-gray-100 transition duration-300"
                        >
                            <div>
                                <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CategorySection;
