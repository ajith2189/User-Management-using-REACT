import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginSuccessful } from "../../features/auth/authSlice";
import axiosInstance from "../../utils/axios";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import { toast } from "sonner";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function LoginPage() {
  useDocumentTitle("Sign In")
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/user/login", form);
      const { user, accessToken} = res.data;
      console.log("the acc token when login : ", accessToken);
      
      dispatch(loginSuccessful({ user, accessToken}));
      navigate("/user/home");
    } catch (err) {
      toast.error( err.response?.data?.message);
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <AuthLayout title="Welcome Back!" subtitle="Sign In">
      <form onSubmit={handleSubmit} className="space-y-5">
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

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 shadow"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/user/register"
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Sign up here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}














// import { useState } from "react";
// import axiosInstance from "../../utils/axios";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { loginSuccessful } from "../../features/auth/authSlice";
// import { Link } from "react-router-dom";

// export default function Login() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const HandleChange = (event) => {
//     setForm({ ...form, [event.target.name]: event.target.value }); //You need square brackets here because you're using a variable as a key
//   };

//   const HandleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const res = await axiosInstance.post("/user/login", form);
//       const { user } = res.data; // ✅ Fix: get 'user' instead of 'login'

//       dispatch(loginSuccessful({ user, accessToken: user.accessToken })); // ✅ dispatch properly
//       navigate("/user/home");
//     } catch (err) {
//       alert("Invalid login credentials");
//       console.error(err.response?.data || err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
//       <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
//         {/* Optional logo or image */}
//         <div className="text-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">Login</h2>
//           <p className="text-sm text-gray-500">Login to your account</p>
//         </div>

//         <form className="space-y-5" onSubmit={HandleSubmit}>
//           {/* Name input */}
//           {/* {isSignUp ? (
//             <div>
//               <label
//                 className="block text-sm font-medium text-gray-700 mb-1"
//                 htmlFor="name"
//               >
//                 Name
//               </label>
//               <input
//               onChange={HandleChange}
//                 type="text"
//                 id="name"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                 placeholder="your name"
//                 required
//               />
//             </div>
//           ) : null} */}

//           {/* Email input */}
//           <div>
//             <label
//               className="block text-sm font-medium text-gray-700 mb-1"
//               htmlFor="email"
//             >
//               Email
//             </label>
//             <input
//               onChange={HandleChange}
//               name="email"
//               type="email"
//               id="email"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//               placeholder="you@example.com"
//               required
//             />
//           </div>

//           {/* Password input */}
//           <div>
//             <label
//               className="block text-sm font-medium text-gray-700 mb-1"
//               htmlFor="password"
//             >
//               Password
//             </label>
//             <input
//               onChange={HandleChange}
//               name="password"
//               type="password"
//               id="password"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//               placeholder="••••••••"
//               required
//             />
//           </div>

//           {/* Submit button */}
//           <div>
//             <button
//               type="submit"
//               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 shadow"
//             >
//               Login
//             </button>
//           </div>
//         </form>

//         {/* Footer links */}
//         <div className="mt-6 text-sm text-center text-gray-600">
//           Don't have an account?
//           <Link
//             to={"/user/register"}
//             className="text-indigo-600 hover:underline font-medium"
//           >
//             {" "}
//             Register
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
