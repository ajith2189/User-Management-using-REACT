import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "../../utils/axios";
import { X, ArrowLeft } from "lucide-react"; // Optional: Install lucide-react for clean icons
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function NewUserModal() {
  useDocumentTitle("Add new user")
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple validation
    console.log("admin is trying to add new user");

    try {
      if (!formData.name || !formData.email || !formData.password) {
        toast.error("Please fill out all fields");
        return;
      }
      const res = await axiosInstance.post("/admin/add", formData);

      console.log("new user added successfully ", res.data);
    } catch (error) {
      console.error("new user added error", error);
    }

    console.log("Form submitted:");
    toast.success("Form submitted successfully!");

    // Reset form
    setFormData({ name: "", email: "", password: "" });
  };

  const handleClose = () => navigate(-1); // Close or go back to previous page
  const handleBack = () => navigate(-1); // You can make these two go to different pages if needed

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 relative">
        {/* Top navigation buttons */}
        <button
          onClick={handleBack}
          className="absolute left-4 top-4 text-slate-500 hover:text-slate-700 transition"
        >
          <ArrowLeft size={20} />
        </button>

        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-slate-500 hover:text-red-600 transition"
        >
          <X size={20} />
        </button>

        <div className="mb-6 text-center mt-4">
          <h2 className="text-2xl font-bold text-slate-800">Add New User</h2>
          <p className="text-sm text-slate-600">Fill out the details to register a user</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 rounded-md transition duration-300 shadow"
          >
            Add User
          </button>
        </form>
      </div>
    </div>
  );
}
