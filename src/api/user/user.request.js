import axios from '../axios';

export const getAllUsers = () => axios.get(`/users/getAll`);

export const getUser = (_id) => axios.get(`/users/get/${_id}`);

export const getUserCourses = (userId) => axios.get(`/users/${userId}/courses`);

export const updateUser = async (_id, userData) => {
    return axios.put(`/users/modify/${_id}`, userData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const registerToCourse = (userId, courseId) => axios.post(`/users/registerToCourse`, { userId, courseId });

export const ActivateAcc = (_id) => axios.get(`/activation/${_id}`, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export const deleteUser = (id) => axios.delete(`/users/delete/${id}`);

export const deleteUserConfirmation = (id, confirmationCode) => axios.delete(`/users/delete/${id}/confirm`, { 
    data: { confirmationCode }
});

export const createUser = (userData) => axios.post(`/users/createUser`, userData);

export const changePassword = (email, newPassword) => axios.post(`/users/changePassword`, { email, newPassword });

// Nueva función para obtener los usuarios registrados en un Curso con el estado en True
export const getUsersByCourse = (courseId) => axios.get(`/users/courses/${courseId}/users`);

// Nueva función para obtener los usuarios registrados en un Curso con el estado en False
export const getPendingUsersByCourse = (courseId) => axios.get(`/users/coursesPending/${courseId}/users`);

// Nueva función para el botón de activar y desactivar cuenta
export const toggleState = (userId) => axios.post(`/users/toggleState/${userId}`);

// Nueva Función para actualizar el estado de un curso en un usuario. 
export const updateUserCourseState = (userId, courseId) => axios.put(`/users/updateState/${userId}/${courseId}`);

//Nueva uncion para consultar el estado del curso del usuario:
export const getRegisterUserCourse = (userId, courseId) => axios.get(`/users/registerUser/${userId}/${courseId}`);
