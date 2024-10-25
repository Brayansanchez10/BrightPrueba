import React, { useState, createContext, useContext, useEffect, useCallback, useRef } from 'react';
import { 
    getAllCourses as getAllCoursesApi, 
    getCourse as getCourseApi, 
    createCourse as createCourseApi, 
    updateCourse as updateCourseApi, 
    deleteCourse as deleteCourseApi,
    getCoursesByCategory as getCoursesByCategoryApi,
    asignarLinkContenido as asignarLinkContenidoApi,
    actualizarLinkContenido as actualizarLinkContenidoApi,
    actualizarContenidoArchivo as actualizarContenidoArchivoApi,
    asignarContenido as asignarContenidoApi,
    notifyAllUsersInCourse as notifyAllUsersInCourseApi,
    notifySpecificUser as notifySpecificUserApi,
    unregisterFromCourse as unregisterFromCourseApi
} from '../../api/courses/course.request';

export const CoursesContext = createContext();

export const useCoursesContext = () => {
    const context = useContext(CoursesContext);
    if (!context) {
        throw new Error("useCoursesContext debe ser usado dentro de CoursesProvider");
    }
    return context;
};

export const CoursesProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const coursesRef = useRef([]);

    const getAllCourses = useCallback(async () => {
        try {
            const res = await getAllCoursesApi();
            const coursesData = res.data || [];
            setCourses(coursesData);
            coursesRef.current = coursesData;
            console.log('Cursos obtenidos:', coursesData);
            return coursesData;
        } catch (error) {
            console.error('Error al obtener todos los cursos:', error);
            setCourses([]);
            coursesRef.current = [];
            return null;
        }
    }, []);

    const getCourse = async (id) => {
        try {
            const res = await getCourseApi(id);
            console.log('Curso obtenido:', res.data);
            return res.data;
        } catch (error) {
            console.error('Error al obtener el curso:', error);
            return null;
        }
    };

    const createCourse = async ({ title, description, category, userId, image, nivel, duracion }) => {
        try {
            const newCourseData = {
                title,
                description,
                category,  
                userId,  
                image,
                nivel,
                duracion: Number(duracion)
            };
            console.log('Datos del nuevo curso:', newCourseData);

            const res = await createCourseApi(newCourseData);
            setCourses(prevCourses => {
                const updatedCourses = [...(prevCourses || []), res.data];
                coursesRef.current = updatedCourses;
                return updatedCourses;
            });
            console.log('Curso creado:', res.data);
            return res.data;
        } catch (error) {
            console.error('Error al crear el curso:', error);
            return null;
        }
    };

    const getCoursesByCategory = async (categoryName) => {
        try {
            const res = await getCoursesByCategoryApi(categoryName);
            console.log('Cursos obtenidos por categoría:', res.data);
            return res.data;
        } catch (error) {
            console.error('Error al obtener cursos por categoría:', error);
            return null;
        }
    };

    const unregisterFromCourse = async (userId, courseId) => {
        try {
            const res = await unregisterFromCourseApi(userId, courseId);
            setCourses(prevCourses => {
                if (!prevCourses) return [];
                return prevCourses.map(course => {
                    if (course.id === courseId) {
                        const updatedEnrolledUsers = course.enrolledUsers ? 
                            course.enrolledUsers.filter(id => id !== userId) : 
                            [];
                        return {...course, enrolledUsers: updatedEnrolledUsers};
                    }
                    return course;
                });
            });
            console.log('Usuario dado de baja del curso:', res.data);
            return res.data;
        } catch (error) {
            console.error('Error al quitar el registro del curso:', error);
            throw error;
        }
    };

    const updateCourse = async (id, courseData) => {
        try {
            const res = await updateCourseApi(id, courseData);
            setCourses(prevCourses => {
                const updatedCourses = (prevCourses || []).map((course) => (course._id === id ? res.data : course));
                coursesRef.current = updatedCourses;
                return updatedCourses;
            });
            console.log('Curso actualizado:', res.data);
            return res.data;
        } catch (error) {
            console.error('Error al actualizar el curso:', error);
            return null;
        }
    };

    const deleteCourse = async (id) => {
        try {
            await deleteCourseApi(id);
            setCourses(prevCourses => {
                if (!prevCourses) return [];
                const updatedCourses = prevCourses.filter(course => course.id !== id);
                coursesRef.current = updatedCourses;
                return updatedCourses;
            });
            console.log('Curso eliminado:', id);
        } catch (error) {
            console.error('Error al eliminar el curso:', error);
            return null;
        }
    };

    const notifyAllUsersInCourse = async (courseId) => {
        try {
            const res = await notifyAllUsersInCourseApi(courseId);
            console.log('Notificación enviada a todos los usuarios:', res.data.message);
            return res.data;
        } catch (error) {
            console.error('Error notificando a todos los usuarios:', error.response?.data);
            return null;
        }
    };
    
    const notifySpecificUser = async (courseId, email) => {
        try {
            const res = await notifySpecificUserApi(courseId, email);
            console.log('Notificación enviada al usuario:', res.data.message);
            return res.data;
        } catch (error) {
            console.error(`Error notificando al usuario ${email}:`, error.response?.data);
            return null;
        }
    };

    const asignarContenido = async (id, contentFile) => {
        try {
            console.log("ID del curso:", id);
            console.log("Archivo de contenido:", contentFile);

            const res = await asignarContenidoApi(id, contentFile);
            console.log("Contenido asignado:", res.data);
            return res.data;
        } catch (error) {
            console.error('Error al asignar contenido:', error);
            return null;
        }
    };

    const asignarLinkContenido = async (id, texto) => {
        try {
            console.log("ID del curso:", id);
            console.log("Texto recibido:", texto);
            const res = await asignarLinkContenidoApi(id, texto);
            console.log("Link de contenido asignado:", res.data);
            return res.data;
        } catch (error) {
            console.error("Error al asignar link de contenido:", error);
            return null;
        }
    };

    const actualizarContenidoArchivo = async (id, index, nuevoArchivo) => {
        try {
            console.log("ID del curso:", id);
            console.log("Índice del archivo:", index);
            console.log("Nuevo archivo recibido:", nuevoArchivo);
    
            const res = await actualizarContenidoArchivoApi(id, index, nuevoArchivo);
            console.log("Contenido de archivo actualizado:", res.data);
            return res.data;
        } catch (error) {
            console.error("Error al actualizar contenido de archivo:", error);
            return null;
        }
    };

    const actualizarLinkContenido = async (id, nuevoTexto, index) => {
        try {
            console.log("ID del curso:", id);
            console.log("Nuevo texto recibido:", nuevoTexto);
    
            const res = await actualizarLinkContenidoApi(id, nuevoTexto, index);
            console.log("Link de contenido actualizado:", res.data);
            return res.data;
        } catch (error) {
            console.error("Error al actualizar link de contenido:", error);
            return null;
        }
    };

    useEffect(() => {
        getAllCourses();
    }, [getAllCourses]);

    const contextValue = {
        courses: coursesRef.current,
        getAllCourses, 
        getCourse, 
        createCourse, 
        getCoursesByCategory, 
        updateCourse, 
        deleteCourse, 
        asignarContenido, 
        asignarLinkContenido, 
        actualizarContenidoArchivo, 
        actualizarLinkContenido, 
        notifyAllUsersInCourse, 
        notifySpecificUser,
        unregisterFromCourse  
    };

    return (
        <CoursesContext.Provider value={contextValue}>
            {children}
        </CoursesContext.Provider>
    );
};