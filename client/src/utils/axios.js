// utils/axios.js
import axios from "axios";
import { store } from "../store";
import { logout, updateAccessToken } from "../features/auth/authSlice";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// 🔐 Attach access token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().auth.accessToken;
    console.log("🚀 Sending accessToken:", accessToken);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔄 Handle expired token and retry with refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axiosInstance.post(
          "http://localhost:3000/user/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        store.dispatch(updateAccessToken(newAccessToken));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log("Refresh token failed:", refreshError.response?.data);
        store.dispatch(logout()); 
        window.location.href = "/user/login"; // or use navigate

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
