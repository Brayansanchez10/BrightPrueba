import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCoursesContext } from '../../../context/courses/courses.context';
import { useResourceContext } from '../../../context/courses/resource.contex';
import { useAuth } from '../../../context/auth.context';
import { useUserContext } from '../../../context/user/user.context';
import { Collapse, Button, Modal, Progress } from 'antd'; // Asegúrate de importar Progress
import NavigationBar from '../NavigationBar';
import { FaArrowLeft, FaSadTear } from 'react-icons/fa';
import jsPDF from 'jspdf';
import zorro from '../../../assets/img/Zorro.jpeg';
import derechaabajo from '../../../assets/img/DerechaAbajo.jpeg';
import izquierdaarriba from '../../../assets/img/IzquierdaArriba.jpeg';
import { Anothershabby_trial } from '../../../Tipografy/Anothershabby_trial-normal';
import { getAllResources } from '../../../api/courses/resource.request';
import Logo from "../../../assets/img/hola.png";
import { useTranslation } from 'react-i18next';
import { AiOutlineUsergroupAdd , AiFillGitlab, AiOutlineUser   } from "react-icons/ai";

const { Panel } = Collapse;

const CourseView = () => {
    const { courseId } = useParams();
    const { t } = useTranslation("global");
    const { getCourse } = useCoursesContext();
    const { getResource } = useResourceContext();
    const { user } = useAuth();
    const { getUserById } = useUserContext();
    const [username, setUsername] = useState('');
    const [course, setCourse] = useState(null);
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [userId, setUserId] = useState("");
    const [creator, setCreator] = useState(null);
    
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const courseData = await getCourse(courseId);
                setCourse(courseData);
                if (courseData && courseData.userId){
                    setUserId(courseData.userId);
                }
            } catch (error) {
                console.error('Error al obtener la información del curso:', error);
            }
        };

        fetchCourse();
    }, [courseId, getCourse]);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const ResourceData = await getResource(courseId);
                setResources(ResourceData);
            } catch (error) {
                console.error('Error al obtener los recursos del curso:', error);
            }
        };

        fetchResources();
    }, [courseId]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user && user.data && user.data.id) {
                try {
                    const userData = await getUserById(user.data.id);
                    setUsername(userData.username);
                } catch (error) {
                    console.error('Error al obtener datos del usuario:', error);
                }
            }
        };

        fetchUserData();
    }, [user, getUserById]);

    useEffect(() => {
        const fetchCreatorData = async () => {
            try {
                if (userId) {
                    const creatorData = await getUserById(userId);
                    setCreator(creatorData);
                    console.log("Información User Creator: ", creatorData);
                }
            } catch (error) {
                console.error("Error al obtener los datos del creador del curso:", error);
            }
        };
    
        fetchCreatorData();
    }, [userId, getUserById]);

   // Maneja el clic en el botón para navegar al recurso
    const handleResourceClick = (resourceId) => {
        console.log("Course ID: ", courseId);
        console.log("Resource ID: ", resourceId);
        navigate(`/course/${courseId}/resource/${resourceId}`);
    };

    if (!course) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-t from-blue-200 via-blue-300 to-blue-400">
            <NavigationBar />
            <section className="flex justify-center py-8">
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Imagen del curso */}
                        <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
                            <img
                                src={course.image}
                                className="absolute inset-0 h-full w-full object-cover rounded-lg"
                                alt={t('course_user.courseImageAlt')}
                            />
                        </div>

                        {/* Detalles del curso */}
                        <div className="relative lg:py-16 min-h-[260px]">
                            <Link to="/MyCourses" className="absolute -top-5 -left-5 flex items-center text-blue-600 hover:text-blue-800">
                                <FaArrowLeft className="mr-2" /> {t('course_user.back')}
                            </Link>
                            
                            <div className="-mt-8">
                                <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">{course.title}</h2>
                                <p className="text-lg mt-4 text-gray-600">{course.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="flex justify-center py-8">
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full border">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl text-center mb-6">
                        {t('course_user.syllabusAndResources', { title: course.title })}
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <Collapse accordion className='bg-gray-50'>
                                    {/* Verificamos si hay recursos disponibles */}
                            {resources.length > 0 ? (
                                resources.map((resource, index) => (
                                            <Panel
                                       
                                    header={resource.title}
                                       
                                    key={resource._id}
                                       
                                    className={`border bg-gray-300 ${index === resources.length - 1 ? 'rounded-b-lg' : 'rounded-lg'} mb-4 m-3`}
                                
                                    >
                                                <div className="p-4 text-gray-700">
                                            {resource.description}
                                        </div>
                                                            <div
                                                    key={resource._id}
                                                    className="relative bg-white rounded-lg shadow-md border cursor-pointer transform hover:scale-105 transition-transform border-black mt-4"
                                                    onClick={() => handleResourceClick(resource._id, resource.courseId)}
                                                >
                                                    <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                                        {t('course_user.viewDetails')}
                                                    </button>
                                                </div>
                                            </Panel>
                                        ))
                            ) : (
                                // Mensaje cuando no hay recursos
                                <div className="flex items-center justify-center lg:mt-[50%]">
                                    <div className="flex flex-col items-center justify-center col-span-2 text-gray-500">
                                        <FaSadTear className="text-6xl mb-4" />
                                        <p className="text-lg">No hay recursos disponibles para este curso.</p>
                                    </div>
                                </div>
                            )}
                                </Collapse>
                        

                        {/* Tarjeta de información */}
                        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                            <img
                                className="w-full h-48 object-cover"
                                src={creator && (creator.userImage !== null && creator.userImage !== 'null') ? creator.userImage : zorro}
                                alt={t('course_user.logoAlt')}
                            />
                            <div className="p-6 space-y-4">
                                <h5 className="text-2xl font-semibold text-gray-800 flex items-center">
                                    <AiFillGitlab  ok className="mr-2 text-gray-600" /> {/* Icono para el título */}
                                    {t('Disruptive')}
                                </h5>
                                <p className="text-gray-600 flex items-center">
                                    <AiOutlineUser className="mr-2 text-gray-500" /> {/* Icono para el creador */}
                                    <span className="font-medium">{t('creator')}:</span> {creator ? creator.username : t('loading')}
                                </p>
                                <p className="text-gray-600 flex items-center">
                                    <AiOutlineUsergroupAdd   className="mr-2 text-gray-500" /> {/* Icono para el número de registros */}
                                    <span className="font-medium">{t('Usuarios registrados')}:</span> {course.enrolledCount}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CourseView;
