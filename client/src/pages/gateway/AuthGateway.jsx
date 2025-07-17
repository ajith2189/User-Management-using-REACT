// pages/AuthGateway.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaUser } from "react-icons/fa";

export default function AuthGateway() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-400 to-teal-500 flex items-center justify-center font-[Poppins]">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden p-10 flex flex-col md:flex-row gap-10 md:gap-20 transition-all duration-700">

        {/* Admin Card */}
        <div
          onClick={() => navigate("/admin/login")}
          className="flex-1 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg"
        >
          <FaUserShield className="text-5xl mb-4" />
          <h2 className="text-2xl font-bold mb-2">Admin Login</h2>
          <p className="text-center text-sm opacity-90">
            Access the admin dashboard and manage users.
          </p>
        </div>

        {/* User Card */}
        <div
          onClick={() => navigate("/user/login")}
          className="flex-1 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg"
        >
          <FaUser className="text-5xl mb-4" />
          <h2 className="text-2xl font-bold mb-2">User Login</h2>
          <p className="text-center text-sm opacity-90">
            Continue to your profile and explore features.
          </p>
        </div>

      </div>
    </div>
  );
}
