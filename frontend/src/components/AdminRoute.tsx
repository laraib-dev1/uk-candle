import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // adjust path

interface Props {
  children: React.ReactNode;
}

const AdminRoute: React.FC<Props> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // not logged in
    return <Navigate to="/login" replace />;
  }

  if (user.role.toLowerCase() !== "admin") {
    // logged in but not admin → redirect to login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
