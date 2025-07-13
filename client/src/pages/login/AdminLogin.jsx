import React, { useState } from "react";
import axiosInstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccessful } from "../../features/auth/authSlice";

export default function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const HandleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const HandleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on submit
    try {
      const res = await axiosInstance.post("/admin/login", form);
      const { user, token } = res.data;

      if (!user.isAdmin) {
        return alert("You don't have admin access");
      }

      dispatch(loginSuccessful({ user, token }));
      navigate("/admin/dashboard"); // 
    } catch (error) {
      console.log("Error occurred while logging in:", error);
      alert("Admin login failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={HandleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Admin Login</h2>

       <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
            onChange={HandleChange}
              name="email" // <-- Add this

              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password input */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
            onChange={HandleChange}
              name="password" // <-- Add this
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="••••••••"
              required
            />
          </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
