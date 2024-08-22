import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCoursesContext } from '../../../context/courses/courses.context';
import { useAuth } from '../../../context/auth.context';
import { useUserContext } from '../../../context/user/user.context';
import { Collapse, Button, Modal } from 'antd';
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
        if (currentViewedIndex === course.content.length - 1) {
            generatePremiumCertificatePDF(username, course.title, zorro);
        }
    };

    const isYouTubeLink = (url) => {
        return url.includes('youtube.com/watch') || url.includes('youtu.be/');
    };

    const getYouTubeEmbedUrl = (url) => {
        // Verifica si es un enlace de tipo 'youtu.be'
        if (url.includes('youtu.be/')) {
            const videoId = url.split('youtu.be/')[1];
            return `https://www.youtube.com/embed/${videoId}`;
        }
    
        // Verifica si es un enlace de tipo 'youtube.com/watch'
        const urlParams = new URLSearchParams(new URL(url).search);
        const videoId = urlParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
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
                                        {isYouTubeLink(url) ? 'Ver Video de YouTube' : url.endsWith('.mp4') ? 'Ver Video' : url.endsWith('.pdf') ? 'Ver PDF' : 'Ver Imagen'}
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
                footer={null}
                destroyOnClose
                afterClose={() => setCurrentIndex(0)}
            >
                {course.content && currentIndex < course.content.length && (
                    <>
                        {isYouTubeLink(course.content[currentIndex]) ? (
                            <iframe
                                width="100%"
                                height="315"
                                src={getYouTubeEmbedUrl(course.content[currentIndex])}
                                title="Video de YouTube"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : course.content[currentIndex].endsWith('.pdf') ? (
                            <iframe
                                src={course.content[currentIndex]}
                                width="100%"
                                height="600"
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
                        {currentIndex < course.content.length - 1 && (
                            <div className="flex justify-end mt-4">
                                <Button onClick={handleNext}>Siguiente</Button>
                            </div>
                        )}
                    </>
                )}
            </Modal>
        </div>
    );
};

export default CourseView;
