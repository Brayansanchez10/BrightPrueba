import axios from "axios";

const instance = axios.create({
    baseURL: `https://brightmind.mesadoko.com`,
    withCredentials: true
})

export default instance;