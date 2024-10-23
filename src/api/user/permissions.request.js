import axios from 'axios'
const api = `http://localhost:3068/PE`

export const getAllPermissions = () => axios.get(`${api}/permissions/getPermissions`)