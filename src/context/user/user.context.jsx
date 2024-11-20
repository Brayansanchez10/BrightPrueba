import React, { useState, createContext, useContext, useEffect } from 'react';
import { getAllUsers, ActivateAcc, getUser, updateUser as updateUserApi, deleteUser as deleteUserApi, deleteUserConfirmation as deleteUserConfirmationApi, createUser as createUserApi, registerToCourse as registerToCourseApi, getUserCourses as getUserCoursesApi, changePassword as changePasswordApi, getUsersByCourse as getUsersByCourseApi } from '../../api/user/user.request';
import { useAuth } from '../auth.context'; // Importa el contexto de autenticación
import NewPassword from '../../components/Home/ChangePasswordUser';

export const UserContext = createContext();

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("El useUser debe usarse dentro de UserProvider");
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [usersData, setUsersData] = useState([]);
    const { isAuthenticated } = useAuth(); // Obtén la función isAuthenticated del contexto de autenticación

    const getUsers = async () => {
        try {
            const res = await getAllUsers();
            setUsersData(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const checkIfUserExists = (username, email) => {
        return usersData.some(user => user.username === username || user.email === email);
    };

    const activateAccount = async (_id) => {
        try {
            await ActivateAcc(_id);
            getUsers(); // Vuelve a obtener la lista de usuarios después de activar una cuenta
        } catch (error) {
            console.log(error);
        }
    };

    const getUserById = async (_id) => {
        try {
            const res = await getUser(_id);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const updateUser = async (_id, userData) => {
        try {
            console.log("ID del usuario a actualizar:", _id);
            console.log("Datos del usuario a enviar:", userData);
            const res = await updateUserApi(_id, userData);
            console.log("Respuesta del servidor:", res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const createUser = async (userData) => {
        try {
            const res = await createUserApi(userData);
            console.log(userData)
            console.log("Usuario creado:", res.data);
            getUsers(); // Actualiza la lista de usuarios después de crear uno nuevo
        } catch (error) {
            console.error(error);
        }
    };

    const updateUserPartial = async (_id, { username, firstNames, lastNames, documentNumber, email, userImage, entityId, descripcion, especialidades }) => {
        try {
            const { data: currentUserData } = await getUser(_id);
    
            const updatedUserData = {
                username: username || currentUserData.username,
                firstNames: firstNames || currentUserData.firstNames,
                lastNames: lastNames || currentUserData.lastNames,
                documentNumber: documentNumber || currentUserData.documentNumber,
                email: email || currentUserData.email,
                state: currentUserData.state,
                role: currentUserData.role,
                userImage: userImage !== undefined ? userImage : currentUserData.userImage,
                entityId: entityId || currentUserData.entityId,
                descripcion: descripcion || currentUserData.descripcion, 
                especialidades: especialidades || currentUserData.especialidades,
            };
    
            const formData = new FormData();
            Object.keys(updatedUserData).forEach(key => {
                formData.append(key, updatedUserData[key]);
            });
    
            await updateUserApi(_id, formData);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteUser = async (id) => {
        try {
            const res = await deleteUserApi(id);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    };

    const deleteUserConfirmation = async (id, confirmationCode) => {
        try {
            const res = await deleteUserConfirmationApi(id, confirmationCode);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    };

    const registerToCourse = async (userId, courseId) => {
        try {
            const res = await registerToCourseApi(userId, courseId);
            console.log("Usuario registrado al curso:", res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getUserCourses = async (userId) => {
        try {
            const res = await getUserCoursesApi(userId);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    };

    // Nueva función para cambiar la contraseña
    const changePassword = async (email, newPassword) => {
        try {
            console.log(email)
            const res = await changePasswordApi(email, newPassword);
            console.log("Contraseña cambiada:", res.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Nueva función para obtener los usuarios registrados en un Curso
    const getUsersByCourse = async (courseId) => {
        try {
            const res = await getUsersByCourseApi(courseId);
            console.log('Curso Obtenido', res.data);
            return res.data;
        } catch (error) {
            console.error('Error al obteneer el curso', error);
            return null;
        }
    };

    useEffect(() => {
        if (isAuthenticated()) {
            getUsers();
        }
    }, [isAuthenticated]);

    return (
        <UserContext.Provider
            value={{
                usersData,
                getUsers,
                checkIfUserExists,
                activateAccount,
                getUserById,
                updateUser,
                createUser,
                updateUserPartial, 
                deleteUser,
                deleteUserConfirmation,
                registerToCourse,
                getUserCourses,
                changePassword,
                getUsersByCourse,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;