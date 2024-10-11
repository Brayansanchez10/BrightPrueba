import axios from 'axios';
const api = `https://apibrightmind.mesadoko.com/PE`;

export const getAllUsers = () => axios.get(`${api}/users/getAll`, { withCredentials: true });

export const getUser = (_id) => axios.get(`${api}/users/get/${_id}`, { withCredentials: true });
export const getUserCourses = (userId) => axios.get(`${api}/users/${userId}/courses`, { withCredentials: true });

export const updateUser = async (_id, userData) => {
    return axios.put(`${api}/users/modify/${_id}`, userData, {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const registerToCourse = (userId, courseId) => axios.post(`${api}/users/registerToCourse`, { userId, courseId }, { withCredentials: true });

export const ActivateAcc = (_id) => axios.get(`${api}/activation/${_id}`, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } });

export const deleteUser = (id) => axios.delete(`${api}/users/delete/${id}`, { withCredentials: true });

export const deleteUserConfirmation = (id, confirmationCode) => axios.delete(`${api}/users/delete/${id}/confirm`, { data: { confirmationCode }, withCredentials: true });

export const createUser = (userData) => axios.post(`${api}/users/createUser`, userData, { withCredentials: true });

// Nueva función para cambiar la contraseña
export const changePassword = (email, newPassword) => axios.post(`${api}/users/changePassword`, { email, newPassword }, { withCredentials: true });
