import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminPublic({ children }) {
  const { user } = useSelector((state) => state.auth);

  return user ? <Navigate to="/admin/dashboard" replace /> : children ;
}