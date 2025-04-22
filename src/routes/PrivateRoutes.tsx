import { Navigate, Outlet } from "react-router-dom";

interface PrivateRoutesProps {
  isAuthenticated: boolean;
}

const PrivateRoutes = ({ isAuthenticated }: PrivateRoutesProps) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoutes;
