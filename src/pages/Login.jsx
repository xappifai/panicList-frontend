import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Phone,
  Email,
  LocationOn,
  Twitter,
  Instagram,
  Facebook,
  LinkedIn,
} from "@mui/icons-material";
import { authAPI, apiUtils } from "../services/apiService";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [userType, setUserType] = useState("client");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (event, newUserType) => {
    if (newUserType !== null) {
      setUserType(newUserType);
    }
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
      // Call backend API for authentication
      const response = await authAPI.signIn(form.email, form.password, userType);
      
      if (response.success) {
        // Validate that the user type matches the selected type
        if (response.user.userType !== userType) {
          setError(`This account is registered as a ${response.user.userType}. Please select the correct user type.`);
          return;
        }
        
        // Store user data and proper Firebase ID token
        apiUtils.setUser(response.user);
        apiUtils.setAuthToken(response.token);
        
        setSuccess(`Welcome back, ${response.user.fullName}! Redirecting...`);
        
        // Clear form
        setForm({ email: "", password: "" });
        
        // Redirect based on user type
        setTimeout(() => {
          switch (response.user.userType) {
            case 'admin':
              navigate("/admin-dashboard");
              break;
            case 'provider':
              // Redirect existing providers to their dashboard
              navigate("/provider-dashboard");
              break;
            case 'client':
            default:
              navigate("/client-dashboard");
              break;
          }
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      let errorMessage = "Login failed. Please check your credentials and try again.";
      
      // Check for error message in different possible locations
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await authAPI.signInWithGoogle();
      
      if (response.success) {
        // Store user data and token
        apiUtils.setUser(response.user);
        apiUtils.setAuthToken(response.user.uid);
        
        setSuccess(`Welcome, ${response.user.fullName}! Redirecting...`);
        
        // Redirect based on user type
        setTimeout(() => {
          switch (response.user.userType) {
            case 'admin':
              navigate("/admin-dashboard");
              break;
            case 'provider':
              navigate("/provider-dashboard");
              break;
            case 'client':
            default:
              navigate("/client-dashboard");
              break;
          }
        }, 1500);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError(error.message || "Google sign-in failed. Please try again.");
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
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: 2,
      }}
    >
      <Container maxWidth="lg" sx={{ display: "flex", gap: 0 }}>
        {/* Left Panel - Teal Background */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            backgroundColor: "#00ADB5",
            borderRadius: "20px 0 0 20px",
            padding: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "white",
            minHeight: "600px",
          }}
        >
          {/* Logo and Description */}
          <Box>
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "2px solid white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  PL
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Panic List
              </Typography>
            </Box>
            
            {/* Stars */}
            <Box sx={{ display: "flex", mb: 3 }}>
              {[...Array(5)].map((_, index) => (
                <Typography key={index} sx={{ color: "#FFD700", fontSize: "20px" }}>
                  ★
                </Typography>
              ))}
            </Box>

            {/* Description */}
            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.6 }}>
              Access trusted reviews, connect with reliable providers, and manage your services all in one secure platform. Join Panic List to protect your business and make smarter decisions.
            </Typography>
          </Box>

          {/* Contact Information */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Contact Us
            </Typography>
            
            <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
              <Phone sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">+1012 3456 789</Typography>
            </Box>
            
            <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
              <Email sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">demo@gmail.com</Typography>
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
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: "#212832" }}>
            Login Your Account
          </Typography>
          <Typography variant="body2" sx={{ mb: 4, color: "#666" }}>
            Choose your role below as a Client or a Provider.
          </Typography>

          {/* Role Selection */}
          <Box sx={{ mb: 4 }}>
            <ToggleButtonGroup
              value={userType}
              exclusive
              onChange={handleUserTypeChange}
              sx={{
                width: "100%",
                "& .MuiToggleButton-root": {
                  flex: 1,
                  py: 1.5,
                  border: "1px solid #e0e0e0",
                  "&.Mui-selected": {
                    backgroundColor: "#00ADB5",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#00ADB5",
                    },
                  },
                  "&:not(.Mui-selected)": {
                    backgroundColor: "#f5f5f5",
                    color: "#666",
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                    },
                  },
                },
              }}
            >
              <ToggleButton value="client">Client</ToggleButton>
              <ToggleButton value="provider">Provider</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
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
                  color: '#00ADB4',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#D1D5DB',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00ADB4',
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
                  color: '#00ADB4',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#D1D5DB',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00ADB4',
                  },
                },
              }}
              required
            />
            
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
              <Typography
                variant="body2"
                sx={{ color: "#00ADB5", cursor: "pointer", textDecoration: "underline" }}
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </Typography>
            </Box>

            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography color="success.main" sx={{ mb: 2, fontWeight: 600 }}>
                {success}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                backgroundColor: "#00ADB5",
                color: "white",
                fontWeight: 600,
                fontSize: "1.1rem",
                borderRadius: "10px",
                mb: 3,
                "&:hover": {
                  backgroundColor: "#009DA5",
                },
                "&:disabled": {
                  backgroundColor: "#ccc",
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </form>

          {/* Sign Up Link */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="body2" sx={{ color: "#666" }}>
              Don't have an account?{" "}
              <Typography
                component="span"
                variant="body2"
                sx={{ 
                  color: "#00ADB5", 
                  cursor: "pointer", 
                  textDecoration: "underline",
                  "&:hover": {
                    color: "#009DA5",
                  }
                }}
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Typography>
            </Typography>
          </Box>

          {/* Divider */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body2" sx={{ px: 2, color: "#666" }}>
              or
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          {/* Google Sign In */}
          <Button
            variant="outlined"
            fullWidth
            disabled={loading}
            onClick={handleGoogleSignIn}
            sx={{
              py: 1.5,
              borderColor: "#e0e0e0",
              color: "#666",
              fontWeight: 600,
              borderRadius: "10px",
              "&:hover": {
                borderColor: "#00ADB5",
                color: "#00ADB5",
              },
              "&:disabled": {
                borderColor: "#ccc",
                color: "#ccc",
              },
            }}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Box
                  component="img"
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE3LjY0IDkuMjA0NTVDMTcuNjQgOC41NjY0IDE3LjU4MjcgOC4wMTM2NCAxNy40NzY0IDcuNDc3MjdIMTlWMTQuMjU0NUgxNy42NFY5LjIwNDU1WiIgZmlsbD0iI0ZGNzQyNCIvPgo8cGF0aCBkPSJNMTMuNDM2NCAxNy4wNDM2QzE1LjA3MjcgMTYuNDc3MyAxNi40NzI3IDE1LjQwOTEgMTcuMzYzNiAxMy45NzI3TDE1LjQyNzMgMTIuOTcyN0MxNC43MjczIDEzLjI3MjcgMTMuNDM2NCAxMy43MjczIDEyLjA5MDkgMTMuNzI3M0M5LjQ3MjczIDEzLjcyNzMgNy4zNjM2NCAxMS45NTQ1IDcuMzYzNjQgOS43MjcyN0M3LjM2MzY0IDcuNSA5LjQ3MjczIDUuNzI3MjcgMTIuMDkwOSA1LjcyNzI3QzEzLjYzNjQgNS43MjcyNyAxNC43MjczIDYuMzYzNjQgMTUuMjcyNyA2Ljg2MzY0TDE2LjkwOTEgNS4yNzI3M0MxNS43MjczIDQuMTgxODIgMTQuMDkwOSAzLjUgMTIuMDkwOSAzLjVDOC4zNjM2NCAzLjUgNS4zNjM2NCA2LjUgNS4zNjM2NCA5LjcyNzI3QzUuMzYzNjQgMTIuOTU0NSA4LjM2MzY0IDE2IDEyLjA5MDkgMTZDMTQuMDkwOSAxNiAxNS43MjczIDE1LjMxODIgMTYuOTA5MSAxNC4yMjczTDE3LjY0IDEzLjk3MjNDMTYuNDcyNyAxNS40MDkxIDE1LjA3MjcgMTYuNDc3MyAxMy40MzY0IDE3LjA0MzZaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0xOS4wMDAxIDkuMjA0NTVDMTkuMDAwMSA4LjU2NjQgMTguOTQyOCA4LjAxMzY0IDE4LjgzNjQgNy40NzcyN0gxNy42NFYxMC43MjczSDE5LjAwMDFWOS4yMDQ1NVoiIGZpbGw9IiNGRjc0MjQiLz4KPHBhdGggZD0iTTE3LjY0IDEwLjcyNzNIMTkuMDAwMVYxNC4yNTQ1SDE3LjY0WDEwLjcyNzNaIiBmaWxsPSIjNDJBNEY1Ii8+Cjwvc3ZnPgo="
                  sx={{ width: 20, height: 20 }}
                />
              )
            }
          >
            Sign in with Google
          </Button>
        </Paper>
      </Container>
    </Box>
  );
} 