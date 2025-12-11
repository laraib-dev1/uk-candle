import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface Props {
  children: React.ReactNode;
}

const AdminRoute: React.FC<Props> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // wait until localStorage is loaded
    return <div>Loading...</div>; // ⚡ can replace with a spinner
  }

  if (!user || user.role.toLowerCase() !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
