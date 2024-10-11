import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    getAllRoles as getAllRolesApi,
    getRole as getRoleApi,
    updateRole as updateRoleApi,
    createRole as createRoleApi,
    deleteRole as deleteRoleApi
} from '../../api/user/role.request'; 

export const RoleContext = createContext();

export const useRoleContext = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error("El useRoleContext debe usarse dentro de RoleProvider");
    }
    return context;
};

export const RoleProvider = ({ children }) => {
    const [rolesData, setRolesData] = useState([]);
    
    const getAllRoles = async () => {
        try {
            const res = await getAllRolesApi();
            setRolesData(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllRoles();
    }, []);

    const getRole = async (_id) => {
        try {
            const res = await getRoleApi(_id);
            return res.data;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const updateRole = async (id, data) => {
        try {
            const res = await updateRoleApi(id, data);
            setRolesData(rolesData.map(role => (role._id === id ? res.data : role)));
            return res.data;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const createRole = async (data) => {
        try {
            const res = await createRoleApi(data);
            setRolesData([...rolesData, res.data]);
            return res.data;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const deleteRole = async (id) => {
        try {
            await deleteRoleApi(id);
            setRolesData(rolesData.filter(role => role._id !== id));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <RoleContext.Provider
            value={{
                createRole,
                rolesData,
                getRole,
                updateRole,
                deleteRole,
                getAllRoles
            }}
        >
            {children}
        </RoleContext.Provider>
    );
};
