import React, { useState, createContext, useContext, useEffect } from 'react';
import { 
    getAllCourses as getAllCoursesApi, 
    getCourse as getCourseApi, 
    createCourse as createCourseApi, 
    updateCourse as updateCourseApi, 
    deleteCourse as deleteCourseApi,
    getCoursesByCategory as getCoursesByCategoryApi,
    asignarLinkContenido as asignarLinkContenidoApi,
    asignarContenido as asignarContenidoApi // Importa la función asignarContenido desde tu archivo api
} from '../../api/courses/course.request'; // Importa las funciones de tu archivo api

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

    const createCourse = async ({ title, description, category, image }) => {
        try {
            const newCourseData = {
                title,
                description,
                category,              
                image
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
            //Llamar a la Api con el texto en lugar del archivo
            const res = await asignarLinkContenidoApi(id, texto);
            console.log("Respuesta Api", res);
            return res.data;
        } catch (error) {
            console.error("Error al asignar contenido",error);
            return null;
        }
    };

    useEffect(() => {
        getAllCourses();
    }, []);

    return (
        <CoursesContext.Provider value={{ courses, getAllCourses, getCourse, createCourse, getCoursesByCategory, updateCourse, deleteCourse, asignarContenido, asignarLinkContenido }}>
            {children}
        </CoursesContext.Provider>
    );
};
