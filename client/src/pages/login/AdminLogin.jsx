import React, { useState } from "react";
import axiosInstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccessful } from "../../features/auth/authSlice";
import { toast } from "sonner";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function AdminLogin() {
  useDocumentTitle("Admin Login")
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
    e.preventDefault(); // Prevent page reload on submit, preventing the default behavior of the form
    try {
      const res = await axiosInstance.post("/admin/login", form);
      const { user, accessToken } = res.data;

      console.log("admin access token recieved : ", accessToken );

      if (!user.isAdmin) {
        return toast.error("You don't have admin access");
      }

      dispatch(loginSuccessful({ user, accessToken }));
      navigate("/admin/dashboard"); // 
    } catch (error) {
      console.log("Error occurred while logging in:", error);
      toast.error("Admin login failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-400 px-4">
      <form
        onSubmit={HandleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6 border border-slate-200"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800">Admin Login</h2>
          <p className="text-sm text-slate-600 mt-1">Enter your admin credentials</p>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-slate-700 mb-1"
            htmlFor="email"
          >
            Email
          </label>
          <input
            onChange={HandleChange}
            name="email" // <-- Add this
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition"
            placeholder="you@example.com"
            required
          />
        </div>

        {/* Password input */}
        <div>
          <label
            className="block text-sm font-medium text-slate-700 mb-1"
            htmlFor="password"
          >
            Password
          </label>
          <input
            onChange={HandleChange}
            name="password" // <-- Add this
            type="password"
            id="password"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-800 text-white font-semibold py-2 rounded-lg hover:bg-slate-900 transition duration-300 shadow"
        >
          Login
        </button>

        <div className="text-center mt-2">
          <span className="inline-block text-xs px-3 py-1 bg-slate-100 text-slate-600 rounded-full shadow">
            Admin Access Only
          </span>
        </div>
      </form>
    </div>
  );
}
