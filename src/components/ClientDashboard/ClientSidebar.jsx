// src/components/ClientDashboard/ClientSidebar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useUser } from "../../contexts/UserContext";
import { apiUtils } from "../../services/apiService";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import PaymentIcon from "@mui/icons-material/Payment";
import RateReviewIcon from "@mui/icons-material/RateReview";
import SettingsIcon from "@mui/icons-material/Settings";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

const clientDrawerWidth = 280;

const clientLinks = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/client-dashboard" },
  { text: "Orders", icon: <ShoppingCartIcon />, path: "/client-dashboard/orders" },
  { text: "Recommendations", icon: <PeopleIcon />, path: "/client-dashboard/recommendations" },
  { text: "Bill & Payment", icon: <PaymentIcon />, path: "/client-dashboard/billing-payment" },
  { text: "Reviews", icon: <RateReviewIcon />, path: "/client-dashboard/reviews" },
  { text: "Settings", icon: <SettingsIcon />, path: "/client-dashboard/settings" },
];

export default function ClientSidebar({ open }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useUser();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      apiUtils.removeAuthToken();
      navigate('/login');
    }
  };

  // Determine which menu item is active based on current path
  const getActiveMenu = () => {
    const path = location.pathname;
    
    // Check for exact matches first
    if (path === "/client-dashboard") return 0;
    if (path === "/client-dashboard/orders") return 1;
    if (path === "/client-dashboard/recommendations") return 2;
    if (path === "/client-dashboard/billing-payment") return 3;
    if (path === "/client-dashboard/reviews") return 4;
    if (path === "/client-dashboard/settings") return 5;
    
    // Check for nested routes
    if (path.startsWith("/client-dashboard/recommendations/")) return 2; // Provider detail pages
    if (path.startsWith("/client-dashboard/orders/")) return 1; // Order detail pages
    if (path === "/client-dashboard/booking") return 2; // Booking page (related to recommendations)
    if (path === "/client-dashboard/booking-confirmed") return 2; // Booking confirmed page (related to recommendations)
    if (path === "/client-dashboard/task-details") return 1; // Task details page (related to orders)
    
    return 0;
  };

  const activeIndex = getActiveMenu();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: clientDrawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: clientDrawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E5E7EB",
          top: 64, // Account for header height
          height: "calc(100vh - 64px)",
          mr: 0, // Remove any right margin
          pr: 0, // Remove any right padding
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#6B7280",
            fontSize: "0.875rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            mb: 2,
          }}
        >
          Navigation
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          {loading ? (
            <CircularProgress size={32} />
          ) : (
            <>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: "#00ADB4",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
                src={user?.profileImage}
              >
                {user?.fullName ? 
                  user.fullName.charAt(0).toUpperCase() : 
                  user?.email ? user.email.charAt(0).toUpperCase() : 'C'}
              </Avatar>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#1F2937",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    mb: 0.5,
                  }}
                >
                  {user?.fullName || 'Client'}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#6B7280",
                    fontSize: "0.75rem",
                  }}
                >
                  {user?.email || 'client@example.com'}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Box>

      <Divider />

      <List sx={{ px: 2 }}>
        {clientLinks.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                backgroundColor: index === activeIndex ? "#F3F4F6" : "transparent",
                color: index === activeIndex ? "#374151" : "#6B7280",
                "&:hover": {
                  backgroundColor: index === activeIndex ? "#E5E7EB" : "#F3F4F6",
                },
                py: 1.5,
                px: 2,
              }}
            >
              <ListItemIcon
                sx={{
                  color: index === activeIndex ? "#374151" : "#6B7280",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  "& .MuiTypography-root": {
                    fontWeight: index === activeIndex ? 600 : 500,
                    fontSize: "0.875rem",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: "auto", p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <List sx={{ px: 0 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                color: "#EF4444",
                "&:hover": {
                  backgroundColor: "#FEF2F2",
                },
                py: 1.5,
                px: 2,
              }}
            >
              <ListItemIcon sx={{ color: "#EF4444", minWidth: 40 }}>
                <PowerSettingsNewIcon />
              </ListItemIcon>
              <ListItemText
                primary="Log Out"
                sx={{
                  "& .MuiTypography-root": {
                    fontWeight: 500,
                    fontSize: "0.875rem",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
