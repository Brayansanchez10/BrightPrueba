import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllPermissions as getAllPermissionsApi} from '../../api/user/permissions.request';

export const PermissionContext = createContext();

export const usePermissionContext = () => {
    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error("El usePermissionContext debe usarse dentro de PermissionProvider");
    }
    return context;
};

export const PermissionProvider = ({ children }) => {
    const [permissionsData, setPermissionData] = useState([]);
    const getAllPermissions = async () => {
        try {
            const res = await getAllPermissionsApi(); 
            setPermissionData(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllPermissions();
    }, []);

   

    return (
        <PermissionContext.Provider
            value={{
                permissionsData,
            }}
        >
            {children}
        </PermissionContext.Provider>
    );
};
