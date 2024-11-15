import React, { useState, createContext, useContext, useEffect } from 'react';
import { 
    getEntity as getEntityApi,
    createEntity as createEntityApi,
    updateEntity as updateEntityApi,
    deleteEntity as deleteEntityApi
} from '../../api/user/entities.request.js';


export const EntityContext = createContext();

export const useEntity = () => {
    const context = useContext(EntityContext);
    if(!context) {
        throw new Error("useEntity debe ser usado dentro de CoursesProvider");
    }
    return context;
};


export const EntityProvider = ({ children }) => {
    const [ entity, setEntity ] = useState([]);

    const getEntity = async () => {
        try {
            const res = await getEntityApi();
            setEntity(res.data);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const createEntity = async ({ name, type, userId }) => {
        try {
            const newEntity = {
                name,
                type,
                userId,
           };

            console.log(newEntity);
            const res = await createEntityApi(newEntity);
            setEntity([...entity, res.data]);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const updateEntity = async (id, { name, type }) => {
        try {
            const entityData = {
                name,
                type,
            };

            const res = await updateEntityApi(id, entityData);
            setEntity(prevTopic =>
                prevTopic.map(entities =>
                    entities.id === id ? res.data : entities
                )
            );
            return res.data;
        } catch (error) {
            console.error("Error al actualizar Entidad:", error);
            throw error;
        }
    };

    const deleteEntity = async (id) => {
        try {
            await deleteEntityApi(id);
            setEntity(prevTopic =>
                prevTopic.filter(entities => entities.id !== id)
            );
        } catch (error) {
            console.error("Error al eliminar", error);
            throw error;
        }
    };

    useEffect(() => {
        getEntity();
    }, []);

    return (
        <EntityContext.Provider value={{ entity, getEntity, createEntity, updateEntity, deleteEntity}}>
            {children}
        </EntityContext.Provider>
    );
};