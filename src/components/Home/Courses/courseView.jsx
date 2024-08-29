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
        generatePremiumCertificatePDF(username, course.title, zorro);
        setModalVisible(false);
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };
    const isVideoLink = (url) => {
        return url.includes('youtube.com/watch') || url.includes('youtu.be/') || url.includes('vimeo.com/');
    };

    const getEmbedUrl = (url) => {
        if (url.includes('youtu.be/') || url.includes('youtube.com/watch')) {
            // Verifica si es un enlace de YouTube
            if (url.includes('youtu.be/')) {
                const videoId = url.split('youtu.be/')[1];
                return `https://www.youtube.com/embed/${videoId}?controls=1&rel=0&modestbranding=1`;
            }
            const urlParams = new URLSearchParams(new URL(url).search);
            const videoId = urlParams.get('v');
            return videoId ? `https://www.youtube.com/embed/${videoId}?controls=1&rel=0&modestbranding=1` : '';
        } else if (url.includes('vimeo.com/')) {
            // Verifica si es un enlace de Vimeo
            const videoId = url.split('vimeo.com/')[1];
            return `https://player.vimeo.com/video/${videoId}?controls=1&background=0&byline=0&title=0&portrait=0&loop=0`;
        } else if (url.includes('wistia.com/')) {
            // Verifica si es un enlace de Wistia
            const videoId = url.split('wistia.com/')[1].split('/')[0];
            return `https://fast.wistia.net/embed/iframe/${videoId}?controls=1`;
        }
        return ''; // Retorna una cadena vacía si no es un enlace válido
    };

    const generatePremiumCertificatePDF = (username, courseTitle, zorroImage) => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'cm',
            format: [21.6, 28]
        });

        // Fondo blanco
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 21.6, 28, 'F');

        // Borde dorado
        doc.setDrawColor(218, 165, 32); // Color dorado
        doc.setLineWidth(0.5);
        doc.rect(1, 1, 19.6, 25.6);

        // Borde interno
        doc.setDrawColor(192, 192, 192); // Color gris claro
        doc.setLineWidth(0.3);
        doc.rect(1.5, 1.5, 18.6, 24.6);

        // Título del certificado
        doc.setFont('times', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(28);
        doc.text('CERTIFICADO DE APRENDIZAJE', 10.8, 4.5, { align: 'center' });

        // Nombre del usuario
        doc.setFont('times', 'bold');
        doc.setTextColor(0, 0, 128); // Color azul oscuro
        doc.setFontSize(24);
        doc.text(`¡Felicitaciones ${username}!`, 10.8, 7.5, { align: 'center' });

        // Texto de reconocimiento
        doc.setFont('times', 'italic');
        doc.setTextColor(105, 105, 105); // Color gris
        doc.setFontSize(18);
        doc.text('Por completar exitosamente el curso', 10.8, 10.5, { align: 'center' });

        // Título del curso
        doc.setFont('times', 'bold');
        doc.setTextColor(0, 0, 0); // Color negro
        doc.setFontSize(22);
        doc.text(`"${courseTitle}"`, 10.8, 12.5, { align: 'center' });

        // Imagen de Zorro
        if (zorroImage) {
            doc.addImage(zorroImage, 'JPEG', 8.8, 14, 4, 4);
        }

        // Texto adicional
        doc.setFont('times', 'normal');
        doc.setFontSize(16);
        doc.setTextColor(47, 79, 79); // Color verde azulado
        doc.text('Gracias por tu dedicación y esfuerzo.', 10.8, 19, { align: 'center' });

        doc.setFontSize(16);
        doc.setTextColor(47, 79, 79); // Color verde azulado
        doc.text('¡Sigue aprendiendo y mejorando!', 10.8, 21, { align: 'center' });

        doc.setFontSize(14);
        doc.setTextColor(192, 192, 192); // Color gris claro
        doc.text('Este certificado fue generado automáticamente.', 10.8, 23, { align: 'center' });

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
                                        {isVideoLink(url) ? 'Ver Video' : url.endsWith('.mp4') ? 'Ver Video' : url.endsWith('.pdf') ? 'Ver PDF' : 'Ver Imagen'}
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
