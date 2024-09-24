import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategoryContext } from '../context/courses/category.context';
import { useCoursesContext } from '../context/courses/courses.context';
import NavigationBar from '../components/Home/NavigationBar';
import QuoteCarousel from '../components/Home/QuoteCarousel';
import HoverCard from '../components/Home/Cards/HoverCard';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';

const HomePage = () => {
    const { getCoursesByCategory, getAllCourses, courses } = useCoursesContext();
    const { categories, getCategories } = useCategoryContext();
    const navigate = useNavigate();
    const [categoriesLoaded, setCategoriesLoaded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const { t } = useTranslation('global');
    const [searchTerm, setSearchTerm] = useState("");

    const categoriesPerPage = 15;

    useEffect(() => {
        if (!categoriesLoaded) {
            getCategories();
            setCategoriesLoaded(true);
        }
    }, [categoriesLoaded, getCategories]);

    useEffect(() => {
        getAllCourses(); 
    }, []);

    const phrases = [
        { text: t('home.quotes.da_vinci'), author: 'Leonardo da Vinci', imageUrl: 'https://th.bing.com/th/id/OIP.DtC3ATqwhnlc_X8KeBv7aAHaJg?rs=1&pid=ImgDetMain' },
        { text: t('home.quotes.mandela'), author: 'Nelson Mandela', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Nelson_Mandela_1994_%282%29.jpg/1200px-Nelson_Mandela_1994_%282%29.jpg' },
        { text: t('home.quotes.sassoon'), author: 'Vidal Sassoon', imageUrl: 'https://cdijum.mx/wp-content/uploads/2018/01/sassoon-nyt.jpg' },
        { text: t('home.quotes.einstein_idea'), author: 'Albert Einstein', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Albert_Einstein_Head.jpg' },
        { text: t('home.quotes.davis'), author: 'Colin R. Davis', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Colin_Davis_%281967%29.jpg' },
        { text: t('home.quotes.einstein_knowledge'), author: 'Albert Einstein', imageUrl: 'https://c.files.bbci.co.uk/assets/aabea4fb-7ebf-43e9-b431-b1480f3ca926' }
    ];

    const handleCardClick = (category) => {
        getCoursesByCategory(category.name);
        navigate(`/CoursesHome`, { state: { title: category.name } });
    };

    const handleCourseClick = (course) => {
        navigate(`/CourseDetail/${course.id}`);
    };

    const handleAllCoursesClick = () => {
        navigate('/AllCourses'); 
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handleNextPage = () => {
        if ((currentPage * categoriesPerPage) < categories.length) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const totalPages = Math.ceil(categories.length / categoriesPerPage);
    
    const paginatedCategories = categories
        .filter(category => category.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice((currentPage - 1) * categoriesPerPage, currentPage * categoriesPerPage);

    return (
        <div className="bg-gradient-to-t from-blue-200 via-blue-400 to-blue-600 min-h-screen">
            <div className='flex flex-col'>
                <NavigationBar onSearch={handleSearch} />
                <QuoteCarousel phrases={phrases} />
                <div className="text-center justify-center items-center">
                    <h1 className="flex justify-center p-2 text-4xl mt-8 font-black text-white sm:text-3xl md:text-5xl">{t('home.explore_categories')}</h1>
                    <p className="mt-4 text-base sm:text-lg text-gray-200 font-semibold flex justify-center">{t('home.find_course')}</p>
                </div>
                
            {/*     <div className="flex justify-center">
                    <div className="grid grid-cols-1 w-full mx-2 gap-1 mt-10 sm:grid-cols-2 sm:mx-3 sm:gap-3 sm:mt-16 md:grid-cols-3 md:mx-4 lg:grid-cols-4 lg:mx-5 xl:grid-cols-5 xl:mx-6">
                        {paginatedCategories.map((category, index) => (
                            <HoverCard
                                key={index}
                                title={category.name}
                                description={category.description}
                                ruta={category.image}
                                onClick={() => handleCardClick(category)}
                            />
                        ))}
                        <HoverCard
                            title="Todos los cursos"
                            description="Ver todos los cursos disponibles."
                            onClick={handleAllCoursesClick}
                        />
                    </div>
                </div> */}

                {totalPages > 1 && (
                    <div className="flex justify-center mb-8 mt-10">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="px-3 py-1 mx-1 bg-gray-200 text-gray-800 border"
                        >
                            {t('home.previous')}
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`px-3 py-1 mx-1 ${currentPage === index + 1 ? "bg-black border text-white" : "bg-gray-200 text-gray-800 border"}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 mx-1 bg-gray-200 text-gray-800 border"
                        >
                            {t('home.next')}
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default HomePage;
