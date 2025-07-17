import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import EditProfile from "./components/Editprofile/EditProfile";
import AdminLogin from "./pages/login/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NewUserModal from "./pages/admin/NewUserModal";
import EditUser from "./pages/admin/EditUser";
import { Toaster } from "sonner";
import RegisterPage from "./pages/register/RegisterPage";
import { useSelector } from "react-redux";
import AuthGateway from "./pages/gateway/AuthGateway";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import AdminPublic from "./routes/AdminPublic";


// ... your imports

export default function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Toaster richColors position="top-center" />
      <BrowserRouter>
        <Routes>
          {/* Root redirect */}

          <Route path="/" element={<AuthGateway />} />
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/user/home" replace />
              ) : (
                <Navigate to="/user/login" replace />
              )
            }
          />

          <Route
            path="/user/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/user/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/user/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/user/edit-profile"
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />

          {/*Admin Routes*/}
          <Route
            path="/admin/login"
            element={
              <AdminPublic>
                <AdminLogin />
              </AdminPublic>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/add-new-user"
            element={
              <AdminRoute>
                <NewUserModal />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/edit-user/:id"
            element={
              <AdminRoute>
                <EditUser />
              </AdminRoute>
            }
          />

          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
