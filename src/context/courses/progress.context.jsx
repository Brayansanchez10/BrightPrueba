import React, { createContext, useContext, useState } from "react";
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
export const CourseProgressProvider = ({ userId, children }) => {
  const [courseProgressData, setCourseProgressData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCourseProgress = async (courseId) => {
    if (!userId) {
      setError("Usuario no válido");
      return;
    }

    try {
      setLoading(true);
      setError(null); // Resetear error antes de la solicitud
      const res = await getCourseProgressApi(userId, courseId);
      setCourseProgressData((prevData) => ({
        ...prevData,
        [courseId]: res.data.progress,
      }));
    } catch (error) {
      console.log("Error al obtener el progreso del curso:", error);
      setError("Error al obtener el progreso del curso");
    } finally {
      setLoading(false);
    }
  };

  const updateCourseProgress = async (courseId, newProgress) => {
    if (!userId) {
      setError("Usuario no válido");
      return;
    }

    try {
      setLoading(true);
      setError(null); // Resetear error antes de la solicitud
      await updateCourseProgressApi(userId, courseId, newProgress);
      setCourseProgressData((prevData) => ({
        ...prevData,
        [courseId]: newProgress,
      }));
    } catch (error) {
      console.log("Error al actualizar el progreso del curso:", error);
      setError("Error al actualizar el progreso del curso");
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
