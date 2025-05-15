import { Navigate, Outlet } from "react-router-dom";
import { useCurrentApp } from "@/components/context/app.context";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useCurrentApp();

  if (loading) return null;

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
