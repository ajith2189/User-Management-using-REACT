// utils/axios.js
import axios from "axios";
import store from "../app/store"; 


const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", 
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    console.log("🚀 Token being sent:", token); // 👈 Add this log

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;





/// for mock testing the frontend


// // axiosInstance.js
// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:5000/api", // or your default
// });

// // Mock only for frontend testing
// axiosInstance.interceptors.request.use((config) => {
//   if (config.url === "/admin/allusers") {
//     config.adapter = () =>
//       Promise.resolve({
//         data: [
//           { _id: "1", name: "Mock User", email: "mock@example.com" },
//           { _id: "2", name: "Demo User", email: "demo@example.com" },
//         ],
//         status: 200,
//         statusText: "OK",
//         headers: {},
//         config,
//       });
//   }
//   return config;
// });

// export default axiosInstance;
