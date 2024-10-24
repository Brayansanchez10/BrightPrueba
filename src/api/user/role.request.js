import axios from '../axios';

export const getAllRoles = () => axios.get(`/roles/getRoles`);

export const getRole = (_id) => axios.get(`/roles/getRole/${_id}`);

export const updateRole = async (id, data) => axios.put(`/roles/updateRole/${id}`, data);

export const createRole = (data) => axios.post(`/roles/createRole`, data);

export const deleteRole = (id) => axios.delete(`/roles/deleteRole/${id}`);
