import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCoursesContext } from '../../../context/courses/courses.context';
import { useResourceContext } from '../../../context/courses/resource.contex';
import { useAuth } from '../../../context/auth.context';
import { useUserContext } from '../../../context/user/user.context';
import { Collapse } from 'antd';
import NavigationBar from '../NavigationBar';
import { FaArrowLeft, FaSadTear, FaPlay, FaUser, FaUsers, FaGraduationCap } from 'react-icons/fa';
import { MdPlayCircleOutline } from "react-icons/md";
import { useTranslation } from 'react-i18next';

const { Panel } = Collapse;

const CreatorDescriptions = [
    "es un visionario en su campo, con una habilidad única para transformar ideas en conocimiento práctico.",
    "es una autoridad respetada, reconocido por su capacidad de simplificar temas complejos.",
    "es un apasionado del aprendizaje continuo, siempre buscando perfeccionar sus habilidades y compartirlas con los demás.",
    "es un profesional admirado, con una carrera marcada por logros significativos y un compromiso inquebrantable con la educación.",
    "es un líder intelectual, dedicado a influir positivamente en su comunidad a través de la enseñanza."
];

const CourseView = () => {
    const { courseId } = useParams();
    const { t } = useTranslation("global");
    const { getCourse } = useCoursesContext();
    const { getResource } = useResourceContext();
    const { user } = useAuth();
    const { getUserById } = useUserContext();
    const [course, setCourse] = useState(null);
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [creator, setCreator] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [creatorDescription, setCreatorDescription] = useState('');

    const fetchCourseData = useCallback(async () => {
        if (!courseId) return;
        
        try {
            const courseData = await getCourse(courseId);
            setCourse(courseData);

            if (courseData && courseData.userId) {
                const creatorData = await getUserById(courseData.userId);
                setCreator(creatorData);
            }

            const resourceData = await getResource(courseId);
            setResources(resourceData);
        } catch (error) {
            console.error('Error al obtener datos del curso:', error);
        } finally {
            setIsLoading(false);
        }
    }, [courseId, getCourse, getResource, getUserById]);

    useEffect(() => {
        fetchCourseData();
    }, [fetchCourseData]);

    useEffect(() => {
        const changeDescription = () => {
            const newDescription = CreatorDescriptions[Math.floor(Math.random() * CreatorDescriptions.length)];
            setCreatorDescription(newDescription);
        };

        changeDescription();
        const intervalId = setInterval(changeDescription, 5 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, []);

    const handleResourceClick = (resourceId) => {
        navigate(`/course/${courseId}/resource/${resourceId}`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-2xl text-gray-600">No se pudo cargar el curso.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <NavigationBar />
            <section className="relative py-20">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div 
                        className="w-full h-full bg-no-repeat bg-center bg-cover"
                        style={{
                            backgroundImage: `url(${course.image})`,
                            filter: 'blur(5px)',
                            transform: 'scale(1.1)'
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <Link to="/MyCourses" className="inline-flex items-center text-white hover:text-blue-300 transition-colors duration-200 mb-6">
                        <FaArrowLeft className="mr-2" /> {t('course_user.back')}
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{course.title}</h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl">{course.description}</p>
                    <div className="flex flex-wrap items-center gap-6 text-gray-300">
                        <div className="flex items-center">
                            <FaUser className="mr-2" />
                            <span>{creator ? creator.username : t('Loading')}</span>
                        </div>
                        <div className="flex items-center">
                            <FaUsers className="mr-2" />
                            <span>{course.enrolledCount} {t('course_user.studensReg')}</span>
                        </div>
                        <div className="flex items-center">
                            <MdPlayCircleOutline className="mr-2" />
                            <span>{resources.length} Recursos totales</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <h2 className="text-3xl font-bold text-gray-800 mb-8">Temario y recursos</h2>
                            {resources.length > 0 ? (
                                <Collapse 
                                    accordion 
                                    className="bg-white shadow-lg rounded-lg overflow-hidden"
                                    expandIconPosition="right"
                                >
                                    {resources.map((resource, index) => (
                                        <Panel
                                            header={
                                                <div className="flex items-center py-3">
                                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                                                        {index + 1}
                                                    </div>
                                                    <span className="text-lg font-medium">{resource.title}</span>
                                                </div>
                                            }
                                            key={resource._id}
                                        >
                                            <div className="p-4">
                                                <p className="text-gray-600 mb-4">{resource.description}</p>
                                                <button
                                                    onClick={() => handleResourceClick(resource._id)}
                                                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                                                >
                                                    <FaPlay className="mr-2" />
                                                    {t('course_user.viewDetails')}
                                                </button>
                                            </div>
                                        </Panel>
                                    ))}
                                </Collapse>
                            ) : (
                                <div className="bg-white shadow-lg rounded-lg p-8 text-center">
                                    <FaSadTear className="text-6xl text-gray-400 mb-4 mx-auto" />
                                    <p className="text-xl text-gray-600">No hay recursos disponibles para este curso.</p>
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-8">Acerca del Creador</h2>
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden sticky top-24">
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <img
                                            className="w-20 h-20 rounded-full object-cover mr-4"
                                            src={creator && creator.userImage && creator.userImage !== 'null' ? creator.userImage : 'https://i.pinimg.com/originals/39/2c/86/392c86f7ba1c2600562cd0f36313fc20.png'}
                                            alt={t('course_user.creatorImage')}
                                        />
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">{creator ? creator.username : t('Loading')}</h3>
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <FaGraduationCap className="mr-2" />
                                                <span>Experto en {course.title}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        {creator ? creator.username : t('Loading')} {creatorDescription}
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h5 className="text-md font-semibold text-gray-800 mb-2">Especialidades:</h5>
                                        <ul className="list-disc list-inside text-gray-600">
                                            <li>Desarrollo web</li>
                                            <li>Diseño UX/UI</li>
                                            <li>Programación avanzada</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CourseView;