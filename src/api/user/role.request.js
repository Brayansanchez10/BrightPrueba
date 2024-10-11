import axios from 'axios'
const api = `https://apibrightmind.mesadoko.com/PE`

export const getAllRoles = () => axios.get(`${api}/roles/getRoles`, { withCredentials: true })
export const getRole = (_id) => axios.get(`${api}/roles/getRole/${_id}`, { withCredentials: true })
export const updateRole = async (id, data) => axios.put(`${api}/roles/updateRole/${id}`, data, { withCredentials: true });
export const createRole = (data) => axios.post(`${api}/roles/createRole`, data, { withCredentials: true });
export const deleteRole = (id) => axios.delete(`${api}/roles/deleteRole/${id}`, { withCredentials: true });





