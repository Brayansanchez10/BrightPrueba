import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCoursesContext } from '../../../context/courses/courses.context';
import { useResourceContext } from '../../../context/courses/resource.contex';
import { useAuth } from '../../../context/auth.context';
import { useUserContext } from '../../../context/user/user.context';
import { Collapse, Button, Modal, Progress } from 'antd'; // Asegúrate de importar Progress
import NavigationBar from '../NavigationBar';
import { FaArrowLeft } from 'react-icons/fa';
import jsPDF from 'jspdf';
import zorro from '../../../assets/img/Zorro.jpeg';
import derechaabajo from '../../../assets/img/DerechaAbajo.jpeg';
import izquierdaarriba from '../../../assets/img/IzquierdaArriba.jpeg';
import { Anothershabby_trial } from '../../../Tipografy/Anothershabby_trial-normal';
import { getAllResources } from '../../../api/courses/resource.request';
import Logo from "../../../assets/img/hola.png";
import { useNavigate } from "react-router-dom";

const { Panel } = Collapse;

const CourseView = () => {
    const { courseId } = useParams();
    const { getCourse } = useCoursesContext();
    const { getResource  } = useResourceContext();
    const { user } = useAuth();
    const { getUserById } = useUserContext();
    const [username, setUsername] = useState('');
    const [course, setCourse] = useState(null);
    const navigate = useNavigate();
    const [resources, setResources] = useState([]); // Agrega estado para los recursos
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentViewedIndex, setCurrentViewedIndex] = useState(-1);
    const [showFinishButton, setShowFinishButton] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const courseData = await getCourse(courseId);
                setCourse(courseData);
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

    // Maneja el clic en el botón para navegar al recurso
    const handleResourceClick = (resourceId) => {
        console.log("Resource ID: ", resourceId);
        navigate(`/resource/${resourceId}`);
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
                                alt="Course"
                            />
                        </div>
    
                        {/* Detalles del curso */}
                        <div className="lg:py-16">
                            <Link to="/MyCourses" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
                                <FaArrowLeft className="mr-2" /> Back
                            </Link>
                            
                            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{course.title}</h2>
                            <p className="mt-4 text-gray-600">{course.description}</p>
    
                            <a
                                href="#"
                                className="mt-8 inline-block rounded-lg bg-indigo-600 px-8 py-3 text-sm font-medium text-white shadow-md transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Get Started Today
                            </a>
                        </div>
                    </div>
                </div>
            </section>
    
            <section className="flex justify-center py-8">
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl text-center mb-6">
                        Temario y recursos del Curso de {course.title}
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Collapse accordion>
                    {resources.map((resource) => (
                        <Panel header={resource.title} key={resource._id} className="border border-gray-300 rounded-lg mb-4">
                            <div className="p-4 text-gray-700">{resource.description}</div>
                            {/* Botón de navegación */}
                            <div
                                key={resource._id}
                                className="relative bg-white rounded-lg shadow-md border cursor-pointer transform hover:scale-105 transition-transform border-white mt-4"
                                onClick={() => handleResourceClick(resource._id)}
                            >
                                <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                    Ver detalles
                                </button>
                            </div>
                        </Panel>
                    ))}
                </Collapse>
                        {/* Tarjeta de información */}
                        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <img className="rounded-t-lg" src={Logo} alt="Logo" />
                            <div className="p-5">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    Noteworthy technology acquisitions 2021
                                </h5>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                    Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
                                </p>
                                <a
                                    href="#"
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Read more
                                    <svg
                                        className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 10"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M1 5h12m0 0L9 1m4 4L9 9"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CourseView;
