import React, { useState, createContext, useContext, useEffect } from 'react';
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
    notifySpecificUser as notifySpecificUserApi
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

    const getAllCourses = async () => {
        try {
            const res = await getAllCoursesApi();
            setCourses(res.data);
            console.log(res.data)
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const getCourse = async (id) => {
        try {
            const res = await getCourseApi(id);
            return res.data;
        } catch (error) {
            console.error(error);
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
                duracion
            };
            console.log(newCourseData);

            const res = await createCourseApi(newCourseData);
            setCourses([...courses, res.data]);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const getCoursesByCategory = async (categoryName) => {
        try {
            const res = await getCoursesByCategoryApi(categoryName);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const updateCourse = async (id, courseData) => {
        try {
          const res = await updateCourseApi(id, courseData);
          setCourses(courses.map((course) => (course._id === id ? res.data : course)));
          console.log(res.data)
          return res.data;
        } catch (error) {
          console.error(error);
          return null;
        }
    };

    const deleteCourse = async (id) => {
        try {
            await deleteCourseApi(id);
            setCourses(courses.filter(course => course.id !== id));
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const notifyAllUsersInCourse = async (courseId) => {
        try {
            const res = await notifyAllUsersInCourseApi(courseId);
            console.log(res.data.message);
            return res.data;
        } catch (error) {
            console.error('Error notificando a todos los usuarios:', error.response.data);
            return null;
        }
    };
    
    const notifySpecificUser = async (courseId, email) => {
        try {
            const res = await notifySpecificUserApi(courseId, email);
            console.log(res.data.message);
            return res.data;
        } catch (error) {
            console.error(`Error notificando al usuario ${email}:`, error.response.data);
            return null;
        }
    };

    const asignarContenido = async (id, contentFile) => {
        try {
            console.log("llego",id);
            console.log("llegooo", contentFile)

            const res = await asignarContenidoApi(id, contentFile);
            console.log("estoooo: ", res)
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const asignarLinkContenido = async (id, texto) => {
        try {
            console.log("ID del curso:", id);
            console.log("Texto recibido:", texto);
            const res = await asignarLinkContenidoApi(id, texto);
            console.log("Respuesta Api", res);
            return res.data;
        } catch (error) {
            console.error("Error al asignar contenido",error);
            return null;
        }
    };

    const actualizarContenidoArchivo = async (id, index, nuevoArchivo) => {
        try {
            console.log("ID del curso:", id);
            console.log("Índice del archivo:", index);
            console.log("Nuevo archivo recibido:", nuevoArchivo);
    
            const res = await actualizarContenidoArchivoApi(id, index, nuevoArchivo);
            console.log("Respuesta de la API para actualizar contenido de archivo:", res);
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
            console.log("Respuesta de la API para actualizar link de contenido:", res);
            return res.data;
        } catch (error) {
            console.error("Error al actualizar link de contenido:", error);
            return null;
        }
    };

    useEffect(() => {
        getAllCourses();
    }, []);

    return (
        <CoursesContext.Provider value={{ 
            courses, 
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
            notifySpecificUser 
        }}>
            {children}
        </CoursesContext.Provider>
    );
};