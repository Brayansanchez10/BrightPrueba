import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCoursesContext } from '../../../context/courses/courses.context';
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

const { Panel } = Collapse;

const CourseView = () => {
    const { courseId } = useParams();
    const { getCourse } = useCoursesContext();
    const { user } = useAuth();
    const { getUserById } = useUserContext();
    const [username, setUsername] = useState('');
    const [course, setCourse] = useState(null);
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

    const handleContentClick = (index) => {
        if (index <= currentViewedIndex + 1) {
            setCurrentIndex(index);
            setCurrentViewedIndex(index);
            setModalVisible(true);
        }
    };

    const handleNext = () => {
        if (currentViewedIndex === currentIndex) {
            setCurrentIndex(currentIndex + 1);
            setCurrentViewedIndex(currentIndex + 1);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setShowFinishButton(false);
        setCurrentIndex(0);
    };

    const handleFinishCourse = () => {
        generatePremiumCertificatePDF(username, course.title, zorro, derechaabajo, izquierdaarriba);
        setModalVisible(false);
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };
    const isVideoLink = (url) => {
        return url.includes('youtube.com/watch') || url.includes('youtu.be/') || url.includes('vimeo.com/') || url.includes('drive.google.com/');
    };

    const getEmbedUrl = (url) => {
        if (url.includes('youtu.be/') || url.includes('youtube.com/watch')) {
            if (url.includes('youtu.be/')) {
                const videoId = url.split('youtu.be/')[1];
                return `https://www.youtube.com/embed/${videoId}?controls=1&rel=0&modestbranding=1`;
            }
            const urlParams = new URLSearchParams(new URL(url).search);
            const videoId = urlParams.get('v');
            return videoId ? `https://www.youtube.com/embed/${videoId}?controls=1&rel=0&modestbranding=1` : '';
        } else if (url.includes('vimeo.com/')) {
            const videoId = url.split('vimeo.com/')[1];
            return `https://player.vimeo.com/video/${videoId}?controls=1&background=0&byline=0&title=0&portrait=0&loop=0`;
        } else if (url.includes('drive.google.com/')) {
            const videoId = url.match(/[-\w]{25,}/); // Extrae el ID del archivo
            return videoId ? `https://drive.google.com/file/d/${videoId}/preview` : '';
        }
        return '';
    };

    const generatePremiumCertificatePDF = (username, courseTitle, zorroImage, derechaabajo, izquierdaarriba) => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'cm',
            format: [28, 21.6] // Tamaño A4 en centímetros
        });
    
        // Fondo blanco
        doc.setFillColor(240, 248, 255);
        doc.rect(0, 0, 28, 21.6, 'F');
    
        // Añadir imágenes de bordes
        if (izquierdaarriba) {
            doc.addImage(izquierdaarriba, 'JPEG', -1, -1, 10, 10);
        }
        if (derechaabajo) {
            doc.addImage(derechaabajo, 'JPEG', 19, 13, 10, 10);
        }
    
        // Agregar fuente personalizada
        doc.addFileToVFS('Anothershabby.ttf', Anothershabby_trial);
        doc.addFont('Anothershabby.ttf', 'AnotherShabby', 'normal');
        doc.setFont('AnotherShabby'); // Aplicar fuente personalizada
    
        // Título del certificado
        doc.setFont('AnotherShabby', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(70);
        doc.text('CERTIFICADO', 14, 4.5, { align: 'center' });
    
        // Subtítulo
        doc.setFontSize(25);
        doc.setFont('AnotherShabby', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text('De aprendizaje', 18, 5.5, { align: 'center' });

        // Imagen de Zorro
        if (zorroImage) {
            doc.addImage(zorroImage, 'JPEG', 12, 7, 4, 4);
        }

        // Texto de reconocimiento
        doc.setFont('times', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(18);
        doc.text('ESTE CERTIFICADO SE OTORGA A', 14, 13.0, { align: 'center' });
    
        // Nombre del usuario
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(65);
        doc.setFont('AnotherShabby', 'normal');
        doc.text(`${username}`, 14, 15.5, { align: 'center' });

        
        // Línea debajo del nombre de usuario
        doc.setLineWidth(0.1); // Grosor de la línea
        doc.setDrawColor(0, 0, 0); // Color negro
        doc.line(6, 16, 22, 16); // Coordenadas de inicio y fin de la línea
    
    
        // Título del curso y Texto adicional
        doc.setFont('times', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text(`Por completar exitosamente el curso "${courseTitle}". `, 11, 17.5, { align: 'center' });
    
        // Texto adicional
        doc.setFont('times', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Gracias por tu dedicación y', 19, 17.5, { align: 'center' });
    
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('esfuerzo. ¡Sigue aprendiendo y mejorando!', 14, 18.0, { align: 'center' });
    
        doc.setFontSize(14);
        doc.setTextColor(192, 192, 192);
        doc.text('Este certificado fue generado automáticamente.', 14, 19.5, { align: 'center' });
    
        // Guardar el PDF
        doc.save(`Certificado_${courseTitle}.pdf`);
    };

    useEffect(() => {
        if (course && currentIndex === course.content.length - 1) {
            setShowFinishButton(true);
        } else {
            setShowFinishButton(false);
        }
    }, [currentIndex, course]);

    if (!course) return <div>Loading...</div>;

    return (
        <div className="min-h-screen overflow-auto overflow-x-hidden bg-gradient-to-t from-blue-200 via-blue-300 to-blue-400">
            <NavigationBar />
            <div className="max-w-screen-lg mx-auto bg-white p-3 rounded-lg shadow-md mt-20 mb-10">
                <div className="flex items-center mb-4">
                    <Link to="/MyCourses" className="flex items-center text-blue-600 hover:text-blue-800">
                        <FaArrowLeft className="mr-2" /> Back
                    </Link>
                </div>
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-3/5 pr-8 text-center">
                        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                        <img src={course.image} alt={course.title} className="w-full h-64 object-cover rounded-lg mb-4" />
                        <p className="text-lg mb-4">{course.description}</p>
                    </div>
                    <div className="md:w-2/5 mt-10">
                        <Collapse accordion>
                            {course.content && course.content.map((url, index) => (
                                <Panel
                                    header={`Recurso ${index + 1}`}
                                    key={index}
                                    disabled={index > currentViewedIndex + 1}
                                >
                                    <Button type="link" onClick={() => handleContentClick(index)}>
                                        {isVideoLink(url) ? 'Ver Video de YouTube' : url.endsWith('.mp4') ? 'Ver Video' : url.endsWith('.pdf') ? 'Ver PDF' : 'Ver Imagen'}
                                    </Button>
                                </Panel>
                            ))}
                        </Collapse>
                    </div>
                </div>
            </div>
            <Modal
                visible={modalVisible}
                onCancel={handleCloseModal}
                title={`Recurso ${currentIndex + 1}`}
                footer={null}
                destroyOnClose
                afterClose={() => setCurrentIndex(0)}
                width={window.innerWidth < 768 ? "90%" : "50%"}  // Responsividad del ancho del modal
            >
                {course.content && currentIndex < course.content.length && (
                    <>
                        <Progress
                            percent={(currentIndex + 1) / course.content.length * 100}
                            status="active"
                            strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                            className="mb-4"
                        />
                        {isVideoLink(course.content[currentIndex]) ? (
                            <iframe
                                title={`Video ${currentIndex + 1}`}
                                width="100%"
                                height="400"
                                src={getEmbedUrl(course.content[currentIndex])}
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        ) : course.content[currentIndex].endsWith('.pdf') ? (
                            <iframe
                                src={course.content[currentIndex]}
                                width="100%"
                                height={window.innerWidth < 768 ? "500" : "700"}  // Altura responsiva
                                title="PDF Viewer"
                            ></iframe>
                        ) : (
                            <div className="flex justify-center">
                                <img
                                    src={course.content[currentIndex]}
                                    alt={`Content ${currentIndex}`}
                                    className="max-w-full h-auto"
                                />
                            </div>
                        )}
                        <div className="flex justify-end mt-4">
                            {showFinishButton ? (
                                <Button onClick={handleFinishCourse} type="primary" className="bg-gradient-to-r from-purple-500 to-emerald-400 text-white">
                                    Finalizar Curso
                                </Button>
                            ) : (
                                <Button onClick={handleNext} type="primary" className="bg-gradient-to-r from-purple-500 to-emerald-400 text-white">
                                    Siguiente
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default CourseView;
