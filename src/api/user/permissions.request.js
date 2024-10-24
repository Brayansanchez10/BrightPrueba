import axios from '../axios';

export const getAllPermissions = () => axios.get(`/permissions/getPermissions`)