import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginSuccessful } from "../../features/auth/authSlice";
import axiosInstance from "../../utils/axios";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import { toast } from "sonner";
import useDocumentTitle from "../../hooks/useDocumentTitle";


export default function RegisterPage() {

  useDocumentTitle("Sign Up")
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const res = await axiosInstance.post("/user/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      const { user, accessToken } = res.data;
      dispatch(loginSuccessful({ user, accessToken }));
      navigate("/user/home");
    } catch (err) {
      toast.error("Registration failed");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <AuthLayout title="Join With Us" subtitle="Sign Up">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm mb-1 font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 shadow"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/user/login"  //always put / when defining the route
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Sign in here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
