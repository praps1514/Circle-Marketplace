import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Request Interceptor: Attach current user role to request headers
api.interceptors.request.use((config) => {
    try {
        const stored = localStorage.getItem("circle_user");
        if (stored) {
            const user = JSON.parse(stored);
            if (user && user.role) {
                config.headers["x-user-role"] = user.role;
            }
        }
    } catch (err) {
        console.error("Error setting role header:", err);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;