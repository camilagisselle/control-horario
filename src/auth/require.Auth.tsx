import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

const RequireAuth = ({
  children,
  role
}: {
  children: React.ReactElement;
  role?: string;
}) => {

  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAuth;