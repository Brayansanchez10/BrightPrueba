import axios from 'axios'
const api = `https://apibrightmind.mesadoko.com/PE`

export const getAllPermissions = () => axios.get(`${api}/permissions/getPermissions`)