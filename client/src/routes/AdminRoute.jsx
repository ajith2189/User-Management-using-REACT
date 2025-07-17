import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminRoute({ children }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/" />;
  }

  if (!user.isAdmin) {
    return <Navigate to="/user/login" />;
  }
  return children;
}
