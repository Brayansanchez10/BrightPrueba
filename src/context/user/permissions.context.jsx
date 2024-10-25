import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllPermissions as getAllPermissionsApi, getPermissionsByRole as getPermissionsByRoleApi } from '../../api/user/permissions.request';

export const PermissionContext = createContext();

export const usePermissionContext = () => {
    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error("El usePermissionContext debe usarse dentro de PermissionProvider");
    }
    return context;
};

export const PermissionProvider = ({ children }) => {
    const [permissionsData, setPermissionsData] = useState([]); // Para almacenar todos los permisos
    const [rolePermissions, setRolePermissions] = useState([]); // Para almacenar los permisos de un rol específico
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    
    // Función para obtener todos los permisos (para asignarlos a roles)
    const getAllPermissions = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getAllPermissionsApi(); // Llamada a la API para todos los permisos
            setPermissionsData(res.data); // Guardar todos los permisos
        } catch (error) {
            console.error('Error al obtener todos los permisos:', error);
            setError('Error al obtener todos los permisos');
        } finally {
            setLoading(false);
        }
    };

     // Función para obtener permisos por roleId (para controlar la visualización de botones)
     const getPermissionsByRole = async (roleId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await getPermissionsByRoleApi(roleId); // Llamada a la API para los permisos de un rol específico
            setRolePermissions(res.data.info); // Guardar permisos del rol
            return res.data.info; // Asegúrate de retornar los permisos
        } catch (error) {
            console.error('Error al obtener permisos por rol:', error);
            setError('Error al obtener permisos del rol');
        } finally {
            setLoading(false);
        }
    };

    // Si quieres cargar todos los permisos automáticamente cuando el contexto se inicializa
    useEffect(() => {
        getAllPermissions(); // Cargar todos los permisos al montar el componente
    }, []);

    return (
        <PermissionContext.Provider
            value={{
                permissionsData,    // Todos los permisos
                rolePermissions,   // Permisos específicos del rol
                loading,
                error,
                getAllPermissions, // Exponer para cargar todos los permisos
                getPermissionsByRole, // Exponer para cargar permisos por rol
            }}
        >
            {children}
        </PermissionContext.Provider>
    );
};
