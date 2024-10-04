// ResourceContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { 
    getResource as getResourceApi,
    createResource as createResourceApi,
    updateResource as updateResourceApi,
    deleteResource as deleteResourceApi,
    getAllResources as getAllResourcesApi,
    getResourceUser as getResourceUserApi,
    completeQuiz as completeQuizApi,
    getUserResourceProgress as getUserResourceProgressApi,
} from "../../api/courses/resource.request.js"; // Importamos las funciones de Resource.request

// Crear el contexto
const ResourceContext = createContext();

// Hook para usar el contexto
export const useResourceContext = () => {
    const context = useContext(ResourceContext);
    if (!context) {
        throw new Error("useResourceContext debe ser usado dentro de ResourceProvider");
    }
    return context;
};

// Proveedor del contexto
export const ResourceProvider = ({ children }) => {
    const [resources, setResources] = useState([]);

    // Función para obtener todos los recursos: 
    const getAllResources = async () => {
        try {
            const res = await getAllResourcesApi();
            setResources(res.data);
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };


    
    //Función para obtener un recurso Vista User
    const getResourceUser = async (id) => {
        try {
            const res = await getResourceUserApi(id);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    
    // Función para obtener un recurso registrado al courseId
    const getResource = async (courseId) => {
        try {
            // Llamar a la API pasando el courseId
            const res = await getResourceApi(courseId);
            // Actualizar el estado con los datos obtenidos
            setResources(res.data);
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.error("Error al obtener recursos:", error);
            return null;
        }
    };

    // Función para crear un recurso
    const createResource = async ({ courseId, title, subcategoryId, description, file, link, attempts, quizzes }) => {
        try {
            const newResource = {
                courseId, 
                title,
                subcategoryId,
                description,
                file,
                link,
                attempts,
                quizzes // Añadir quizzes al nuevo recurso
            };
            console.log(newResource);

            const res = await createResourceApi(newResource);
            setResources([...resources, res.data]);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    // Función para actualizar un recurso
    const updateResource = async (id, { title, description, file, link, attempts, quizzes }) => {
        try {
            const resourceData = {
                title,
                description,
                file,
                link,
                attempts: Number(attempts), // Convertir attempts a número
                quizzes // Incluir quizzes en la actualización
            };

            const res = await updateResourceApi(id, resourceData);
            setResources(prevResources =>
                prevResources.map(resource =>
                    resource.id === id ? res.data : resource
                )
            );
            return res.data;
        } catch (error) {
            console.error("Error al actualizar recurso:", error);
            throw error;
        }
    };

    // Función para eliminar un recurso
    const deleteResource = async (id) => {
        try {
            await deleteResourceApi(id);
            setResources(prevResources =>
                prevResources.filter(resource => resource.id !== id)
            );
        } catch (error) {
            console.error("Error al eliminar recurso:", error);
            throw error;
        }
    };

    // Función para completar un quiz y actualizar el progreso del usuario
    const completeQuiz = async (userId, resourceId, score) => {
        try {
            const result = await completeQuizApi(userId, resourceId, score);
            return result; // Retornar el resultado para usarlo en el componente
        } catch (error) {
            console.error("Error al completar el quiz:", error);
            throw error; // Lanza el error para manejarlo en el componente que llame a esta función
        }
    };

    // Nueva función para obtener el progreso del usuario en un recurso
    const getUserResourceProgress = async (userId, resourceId) => {
        try {
            const result = await getUserResourceProgressApi(userId, resourceId);
            return result.data; // Retornar los datos del progreso
        } catch (error) {
            console.error("Error al obtener el progreso del usuario:", error);
            throw error; // Lanza el error para manejarlo en el componente que llame a esta función
        }
    };

    useEffect(() => {
        // Obtener los recursos al montar el componente
        getAllResources();
    }, []);

    return (
        <ResourceContext.Provider value={{ resources, getResource, createResource, updateResource, deleteResource, getResourceUser, completeQuiz, getUserResourceProgress}}>
            {children}
        </ResourceContext.Provider>
    );
};
