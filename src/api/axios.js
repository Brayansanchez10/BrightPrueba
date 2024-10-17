import axios from "axios";

const instance = axios.create({
    baseURL: `https://apibrightmind.mesadoko.com/PE`,
    withCredentials: true
})

export default instance