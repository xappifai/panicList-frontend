// src/components/AdminDashboard/AuthGuard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { apiUtils } from "../../services/apiService";

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Check if user is authenticated and is an admin
      const user = apiUtils.getUser();
      const token = apiUtils.getAuthToken();
      
      if (user && token && user.userType === 'admin') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: 2,
        }}
      >
        <CircularProgress size={60} sx={{ color: "#00ADB4" }} />
        <Typography variant="h6" color="text.secondary">
          Loading Admin Dashboard...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: 3,
          p: 3,
        }}
      >
        <Typography variant="h4" color="error" sx={{ fontWeight: 600 }}>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 400 }}>
          You need to be logged in as an administrator to access this dashboard.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/admin-login')}
          sx={{
            backgroundColor: "#00ADB4",
            "&:hover": { backgroundColor: "#009DA4" },
            px: 4,
            py: 1.5,
          }}
        >
          Go to Admin Login
        </Button>
      </Box>
    );
  }

  return children;
};

export default AuthGuard;
