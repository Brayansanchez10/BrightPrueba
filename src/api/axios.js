import axios from "axios";

const instance = axios.create({
    baseURL: `http://localhost:3068/PE`,
    withCredentials: true
})

export default instance;