// Provider Authentication Guard Component
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Button } from "@mui/material";

const ProviderAuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Check multiple possible localStorage keys for user data
      const possibleKeys = ['providerUser', 'user', 'currentUser'];
      let userData = null;
      let foundKey = null;
      
      for (const key of possibleKeys) {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.uid && parsed.email && parsed.userType === 'provider') {
              userData = parsed;
              foundKey = key;
              break;
            }
          } catch (error) {
            console.error(`Error parsing ${key}:`, error);
          }
        }
      }
      
      if (userData && userData.uid && userData.email) {
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
          Loading Provider Dashboard...
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
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: '#FEF2F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: '2.5rem',
              color: '#EF4444',
            }}
          >
            🔒
          </Typography>
        </Box>
        
        <Typography variant="h4" color="text.primary" sx={{ fontWeight: 600 }}>
          Access Required
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          align="center" 
          sx={{ maxWidth: 500, lineHeight: 1.6 }}
        >
          You need to be logged in as a service provider to access this dashboard. 
          Please sign in to manage your listings and connect with clients.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{
              borderColor: '#00ADB4',
              color: '#00ADB4',
              '&:hover': { 
                borderColor: '#009DA4',
                backgroundColor: '#F0FDFF'
              },
              px: 3,
              py: 1.5,
            }}
          >
            Go Home
          </Button>
          
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{
              backgroundColor: "#00ADB4",
              "&:hover": { backgroundColor: "#009DA4" },
              px: 4,
              py: 1.5,
            }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    );
  }

  return children;
};

export default ProviderAuthGuard;
