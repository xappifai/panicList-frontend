import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Phone,
  Email,
  LocationOn,
  Twitter,
  Instagram,
  Facebook,
  LinkedIn,
  AdminPanelSettings,
  Security,
} from "@mui/icons-material";
import { authAPI, apiUtils } from "../services/apiService";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill all fields.");
      return;
    }

    // Clear previous messages
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Call backend API for authentication with admin user type
      const response = await authAPI.signIn(form.email, form.password, "admin");
      
      if (response.success) {
        // Validate that the user type is admin
        if (response.user.userType !== "admin") {
          setError("Access denied. This account is not authorized for admin access.");
          return;
        }
        
        // Store user data and proper Firebase ID token
        apiUtils.setUser(response.user);
        apiUtils.setAuthToken(response.token);
        
        setSuccess(`Welcome back, ${response.user.fullName}! Redirecting to admin dashboard...`);
        
        // Clear form
        setForm({ email: "", password: "" });
        
        // Redirect to admin dashboard
        setTimeout(() => {
          navigate("/admin-dashboard");
        }, 1500);
      }
    } catch (error) {
      console.error('Admin login error:', error);
      
      // Handle different types of errors
      let errorMessage = "Admin login failed. Please check your credentials and try again.";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error) {
        errorMessage = error.error;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email) {
      setError("Please enter your email address first.");
      return;
    }

    try {
      await authAPI.resetPassword(form.email);
      setSuccess("Password reset email sent! Check your inbox.");
    } catch (error) {
      setError(error.message || "Failed to send reset email. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #00ADB5 100%)",
        padding: 2,
      }}
    >
      <Container maxWidth="lg" sx={{ display: "flex", gap: 0 }}>
        {/* Left Panel - Admin Theme Background */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            backgroundColor: "#1e3a8a",
            borderRadius: "20px 0 0 20px",
            padding: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "white",
            minHeight: "600px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              zIndex: 0,
            }}
          />
          
          {/* Content */}
          <Box sx={{ position: "relative", zIndex: 1 }}>
            {/* Logo and Admin Badge */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  border: "2px solid white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
              >
                <AdminPanelSettings sx={{ fontSize: 28, color: "white" }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Panic List
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontSize: "0.9rem" }}>
                  Admin Portal
                </Typography>
              </Box>
            </Box>
            
            {/* Security Badge */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Security sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Secure Admin Access
              </Typography>
            </Box>

            {/* Description */}
            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.6, opacity: 0.9 }}>
              Access the administrative dashboard to manage users, monitor platform activity, 
              and oversee the entire Panic List ecosystem. Your secure gateway to platform control.
            </Typography>
          </Box>

          {/* Contact Information */}
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Admin Support
            </Typography>
            
            <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
              <Phone sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">+1012 3456 789</Typography>
            </Box>
            
            <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
              <Email sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">admin@paniclist.com</Typography>
            </Box>
            
            <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
              <LocationOn sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">
                132 Dartmouth Street Boston, Massachusetts 02156 United States
              </Typography>
            </Box>

            {/* Social Media Icons */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton sx={{ color: "white", backgroundColor: "rgba(255,255,255,0.1)" }}>
                <Twitter />
              </IconButton>
              <IconButton sx={{ color: "white", backgroundColor: "rgba(255,255,255,0.1)" }}>
                <Instagram />
              </IconButton>
              <IconButton sx={{ color: "white", backgroundColor: "rgba(255,255,255,0.1)" }}>
                <Facebook />
              </IconButton>
              <IconButton sx={{ color: "white", backgroundColor: "rgba(255,255,255,0.1)" }}>
                <LinkedIn />
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {/* Right Panel - White Background */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: "0 20px 20px 0",
            padding: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: "600px",
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <AdminPanelSettings sx={{ fontSize: 48, color: "#1e3a8a", mb: 2 }} />
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: "#1e3a8a" }}>
              Admin Login
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              Secure access to the administrative dashboard
            </Typography>
          </Box>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Admin Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              sx={{ 
                mb: 3,
                '& .MuiInputBase-input': {
                  color: '#1F2937',
                },
                '& .MuiInputLabel-root': {
                  color: '#6B7280',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#1e3a8a',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#D1D5DB',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1e3a8a',
                  },
                },
              }}
              required
            />
            
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              sx={{ 
                mb: 1,
                '& .MuiInputBase-input': {
                  color: '#1F2937',
                },
                '& .MuiInputLabel-root': {
                  color: '#6B7280',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#1e3a8a',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#D1D5DB',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1e3a8a',
                  },
                },
              }}
              required
            />
            
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
              <Typography
                variant="body2"
                sx={{ color: "#1e3a8a", cursor: "pointer", textDecoration: "underline" }}
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                backgroundColor: "#1e3a8a",
                color: "white",
                fontWeight: 600,
                fontSize: "1.1rem",
                borderRadius: "10px",
                mb: 3,
                "&:hover": {
                  backgroundColor: "#1e40af",
                },
                "&:disabled": {
                  backgroundColor: "#ccc",
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Access Admin Dashboard"}
            </Button>
          </form>

          {/* Back to Regular Login */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="body2" sx={{ color: "#666" }}>
              Not an admin?{" "}
              <Typography
                component="span"
                variant="body2"
                sx={{ 
                  color: "#1e3a8a", 
                  cursor: "pointer", 
                  textDecoration: "underline",
                  "&:hover": {
                    color: "#1e40af",
                  }
                }}
                onClick={() => navigate("/login")}
              >
                Go to Regular Login
              </Typography>
            </Typography>
          </Box>

          {/* Security Notice */}
          <Box sx={{ 
            backgroundColor: "#f8fafc", 
            padding: 2, 
            borderRadius: 2, 
            border: "1px solid #e2e8f0",
            textAlign: "center"
          }}>
            <Security sx={{ fontSize: 20, color: "#1e3a8a", mb: 1 }} />
            <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
              This is a secure admin area. All activities are logged and monitored.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
