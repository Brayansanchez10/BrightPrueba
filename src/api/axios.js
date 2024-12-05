import axios from "axios";

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_LOCALHOST_URL}/PE`,
    withCredentials: true
})

export default instance;