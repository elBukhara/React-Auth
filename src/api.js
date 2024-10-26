import axios from "axios"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants"

const api = axios.create({
    // baseURL: import.meta.env.VITE_API_URL 
    baseURL: "http://localhost:8000",
})

api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config
    },
    (error) => {
        Promise.reject(error)
    }
)

export default api