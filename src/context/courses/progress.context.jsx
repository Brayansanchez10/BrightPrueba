import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCourseProgress as getCourseProgressApi, updateCourseProgress as updateCourseProgressApi } from '../../api/courses/progress.request';

// Crear el Context
export const CourseProgressContext = createContext();

// Hook personalizado para usar el Context
export const useCourseProgressContext = () => {
    const context = useContext(CourseProgressContext);
    if (!context) {
        throw new Error("useCourseProgressContext debe usarse dentro de CourseProgressProvider");
    }
    return context;
};

// Proveedor del Context
export const CourseProgressProvider = ({ userId, children }) => {
    const [courseProgressData, setCourseProgressData] = useState({});

    const getCourseProgress = async (courseId) => {
        try {
            const res = await getCourseProgressApi(userId, courseId); 
            setCourseProgressData((prevData) => ({
                ...prevData,
                [courseId]: res.data.progress,
            }));
        } catch (error) {
            console.log('Error al obtener el progreso del curso:', error);
        }
    };

    const updateCourseProgress = async (courseId, newProgress) => {
        try {
            await updateCourseProgressApi(userId, courseId, newProgress);
            setCourseProgressData((prevData) => ({
                ...prevData,
                [courseId]: newProgress,
            }));
        } catch (error) {
            console.log('Error al actualizar el progreso del curso:', error);
        }
    };

    return (
        <CourseProgressContext.Provider
            value={{
                courseProgressData,
                getCourseProgress,
                updateCourseProgress,
            }}
        >
            {children}
        </CourseProgressContext.Provider>
    );
};

