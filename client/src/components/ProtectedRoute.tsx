import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { authService } from "../services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      if (!authService.getUser()) {
        try {
          await authService.initialize();
          setIsAuthenticated(true);
        } catch (error) {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
