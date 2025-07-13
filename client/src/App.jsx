import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import EditProfile from "./components/Editprofile/EditProfile";
import PrivateRoute from "./utils/PrivateRoute";
import Register from "./pages/register/Register";
import AdminLogin from "./pages/login/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./components/Protected/AdminRoute";
import NewUserModal from "./pages/admin/NewUserModal";
import UploadImage from "./components/Editprofile/UploadImage";
import EditUser from "./pages/admin/EditUser";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user/register" element={<Register />} />
        <Route path="/user/login" element={<Login />} />

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


        <Route path="/admin/login" element={<AdminLogin />} />

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
  );
}
