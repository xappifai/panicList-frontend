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

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    
    // Validation
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // Clear previous messages
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Prepare user data
      const userData = {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        userType: userType
      };

      // Call backend API for registration
      let response;
      if (userType === "provider") {
        response = await authAPI.signUpProvider(userData);
      } else {
        response = await authAPI.signUp(userData);
      }
      
      if (response.success) {
        setSuccess("Account created successfully! Logging you in...");
        
        // Clear form
        setForm({ fullName: "", email: "", password: "", confirmPassword: "" });
        
        // Store user data temporarily
        apiUtils.setUser(response.user);
        apiUtils.setAuthToken(response.user.uid);
        
        // Redirect based on user type
        setSuccess("Account created successfully!");
        setTimeout(() => {
          switch (response.user.userType) {
            case 'admin':
              navigate("/admin-dashboard");
              break;
            case 'provider':
              // New providers go to pricing plans to select a plan
              navigate("/pricing-plans");
              break;
            case 'client':
            default:
              navigate("/client-dashboard");
              break;
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle specific error cases
      if (error.response?.data?.message) {
        const message = error.response.data.message;
        
        // Check for email already in use
        if (message.includes("email-already-in-use") || message.includes("Email already in use")) {
          setError("This email address is already registered. Please use a different email or try logging in.");
        } else if (message.includes("Validation error")) {
          // Handle validation errors
          const errors = error.response.data.errors || [];
          const errorMessages = errors.map(err => err.message).join(", ");
          setError(`Please fix the following issues: ${errorMessages}`);
        } else {
          setError(message);
        }
      } else {
        setError("An error occurred during signup. Please try again.");
      }
    } finally {
      setLoading(false);
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
            Sign Up Your Account
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

          {/* Signup Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              fullWidth
              placeholder="Enter your full name"
              sx={{ 
                mb: 3,
                '& .MuiInputBase-input': {
                  color: '#212832',
                },
                '& .MuiInputLabel-root': {
                  color: '#666',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#00ADB5',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#00ADB5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00ADB5',
                  },
                },
              }}
              required
            />
            
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              placeholder="Enter your email"
              sx={{ 
                mb: 3,
                '& .MuiInputBase-input': {
                  color: '#212832',
                },
                '& .MuiInputLabel-root': {
                  color: '#666',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#00ADB5',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#00ADB5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00ADB5',
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
              placeholder="Enter your password"
              sx={{ 
                mb: 3,
                '& .MuiInputBase-input': {
                  color: '#212832',
                },
                '& .MuiInputLabel-root': {
                  color: '#666',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#00ADB5',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#00ADB5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00ADB5',
                  },
                },
              }}
              required
            />
            
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              fullWidth
              placeholder="Confirm your password"
              sx={{ 
                mb: 3,
                '& .MuiInputBase-input': {
                  color: '#212832',
                },
                '& .MuiInputLabel-root': {
                  color: '#666',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#00ADB5',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#00ADB5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00ADB5',
                  },
                },
              }}
              required
            />

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
              {loading ? <CircularProgress size={24} color="inherit" /> : "Next"}
            </Button>
          </form>



          {/* Login Link */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "#666" }}>
              Do you have an account?{" "}
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
                onClick={() => navigate("/login")}
              >
                Sign In
              </Typography>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

