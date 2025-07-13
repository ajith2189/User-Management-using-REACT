import React from "react";
import rosh from "../../assets/rosh.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice"; 

export default function Navbar({ name = "Ajith", imageUrl }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); // 
    navigate("/user/login"); // 
  };

  return (
    <nav className="navbar-animate bg-white shadow-lg py-4 px-6 md:px-12 flex items-center justify-between transition-all duration-500">
      <h1 className="text-indigo-600 hover:text-indigo-400 hover:scale-105 transition-transform duration-300 cursor-pointer text-2xl font-semibold ">
        User Management System
      </h1>

      <ul className="hidden md:flex gap-8 text-gray-600 text-sm font-medium transition-all duration-300">
        <Link to={"/user/home"}>
          <li className="hover:text-indigo-600 hover:scale-105 transition-transform duration-300 cursor-pointer">
            Home
          </li>
        </Link>
        <li className="hover:text-indigo-600 hover:scale-105 transition-transform duration-300 cursor-pointer">
          Services
        </li>
        <li className="hover:text-indigo-600 hover:scale-105 transition-transform duration-300 cursor-pointer">
          About
        </li>
        <li className="hover:text-indigo-600 hover:scale-105 transition-transform duration-300 cursor-pointer">
          Contact
        </li>
      </ul>

      <h3 className="hover:text-red-600 hover:scale-105 transition-transform duration-300 cursor-pointer">
        {name}
      </h3>

      <div className="relative group inline-block">
        <Link to={"/user/edit-profile"}>
          <img
            src={imageUrl || rosh}
            alt="Profile"
            className="w-10 h-10 object-cover rounded-full transition-transform duration-300 transform group-hover:scale-110 group-hover:shadow-md"
          />
        </Link>

        <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-nowrap">
          Edit Profile
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-md shadow-md transition-all duration-300 hover:scale-105"
      >
        Logout
      </button>
    </nav>
  );
}
