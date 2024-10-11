import React, { useState, createContext, useContext } from "react";
import {
  getCourseProgress as getCourseProgressApi,
  updateCourseProgress as updateCourseProgressApi,
} from "../../api/courses/progress.request";

// Crear el Context
export const CourseProgressContext = createContext();

// Hook personalizado para usar el Context
export const useCourseProgressContext = () => {
  const context = useContext(CourseProgressContext);
  if (!context) {
    throw new Error(
      "useCourseProgressContext debe usarse dentro de CourseProgressProvider"
    );
  }
  return context;
};

// Proveedor del Context
export const CourseProgressProvider = ({ children }) => {
  const [courseProgressData, setCourseProgressData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCourseProgress = async (userId, courseId) => {
    setLoading(true);
    setError(null);
    try {
        const res = await getCourseProgressApi(userId, courseId);
        setCourseProgressData(res.progress);
        console.log("Id curso", courseId,"Progreso", res.progress);
        return res.progress;
    } catch (err) {
        console.error("Error al obtener progreso:", err);
        setError(err);
        return null;
    } finally {
        setLoading(false);
    }
  };

  const updateCourseProgress = async (userId, courseId, progress) => {
    setLoading(true);
    setError(null);
    try {
        const res = await updateCourseProgressApi(userId, courseId, progress);
        setCourseProgressData(res.progress);
        return res.progress;
    } catch (err) {
        console.error("Error updating course progress:", err);
        setError(err);
        return null;
    } finally {
        setLoading(false);
    }
  };

  return (
    <CourseProgressContext.Provider
      value={{
        courseProgressData,
        getCourseProgress,
        updateCourseProgress,
        loading,
        error,
      }}
    >
      {children}
    </CourseProgressContext.Provider>
  );
};
