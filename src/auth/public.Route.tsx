import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

const PublicRoute = ({ children }: { children: React.ReactElement }) => {

  const { user } = useAuth();

  if (user) {
    if (user.role === "ROLE_ADMIN") {
      return <Navigate to="/admin/usuarios" replace />;
    }
    return <Navigate to="/registro" replace />;
  }

  return children;
};

export default PublicRoute;