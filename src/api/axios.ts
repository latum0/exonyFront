import axios from "axios";
import { API_BASE_URL } from "@/constants/config";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Ajoute automatiquement le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Premier 401 → tentative de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        );

        const newAccessToken = refreshResponse.data.accessToken;

        // Stocker le nouveau token
        localStorage.setItem("accessToken", newAccessToken);

        // Relancer la requête avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Erreur refresh token → redirection");
        // 🔴 Ici : refresh échoué → logout & redirect
        localStorage.removeItem("accessToken");
        window.location.href = "/"; // redirige à la page login
        return Promise.reject(refreshError);
      }
    }

    // Si c'est un 401 après un refresh déjà tenté → logout direct
    if (error.response?.status === 401 && originalRequest._retry) {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;
