import axios from "axios";

// Safely determine API baseURL for production vs local dev
const getBaseURL = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    // In production build or non-localhost domain, never call localhost
    if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
        if (!envUrl || envUrl.includes("localhost") || envUrl.includes("127.0.0.1")) {
            return "/api";
        }
        return envUrl;
    }
    if (import.meta.env.PROD) {
        if (!envUrl || envUrl.includes("localhost") || envUrl.includes("127.0.0.1")) {
            return "/api";
        }
    }
    return envUrl || "/api";
};

const api = axios.create({
    baseURL: getBaseURL(),
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