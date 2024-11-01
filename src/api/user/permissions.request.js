import axios from '../axios';

export const getAllPermissions = () => axios.get(`/permissions/getPermissions`);

export const getPermissionsByRole = (roleId) => axios.get(`/permissions/permissionByRol/${roleId}`);