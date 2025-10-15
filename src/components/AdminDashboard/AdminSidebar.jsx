// src/components/AdminDashboard/AdminSidebar.jsx
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
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Group as GroupIcon,
  ShoppingCart as OrderIcon,
  Analytics as AnalyticsIcon,
  List as ListIcon,
  CreditCard as CreditCardIcon,
  Support as SupportIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

const drawerWidth = 280;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin-dashboard" },
  { text: "Provider Management", icon: <PeopleIcon />, path: "/admin-dashboard/providers" },
  { text: "Client Management", icon: <GroupIcon />, path: "/admin-dashboard/clients" },
  { text: "Order Management", icon: <OrderIcon />, path: "/admin-dashboard/orders" },
  { text: "Basic Analytics", icon: <AnalyticsIcon />, path: "/admin-dashboard/analytics" },
  { text: "Listing Management", icon: <ListIcon />, path: "/admin-dashboard/listings" },
  { text: "Subscription & Payments", icon: <CreditCardIcon />, path: "/admin-dashboard/subscriptions" },
  { text: "Support", icon: <SupportIcon />, path: "/admin-dashboard/support" },
];

export default function AdminSidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  // Determine which menu item is active based on current path
  const getActiveMenu = () => {
    const path = location.pathname;
    if (path === "/admin-dashboard") return 0;
    if (path === "/admin-dashboard/providers") return 1;
    if (path === "/admin-dashboard/clients") return 2;
    if (path === "/admin-dashboard/orders") return 3;
    if (path === "/admin-dashboard/analytics") return 4;
    if (path === "/admin-dashboard/listings") return 5;
    if (path === "/admin-dashboard/subscriptions") return 6;
    if (path === "/admin-dashboard/support") return 7;
    return 0;
  };

  const activeIndex = getActiveMenu();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E5E7EB",
          top: 64, // Account for header height
          height: "calc(100vh - 64px)",
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
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: "#00ADB4",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            {JSON.parse(localStorage.getItem('adminUser') || '{}').name ? 
              JSON.parse(localStorage.getItem('adminUser') || '{}').name.charAt(0).toUpperCase() : 'A'}
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
              {JSON.parse(localStorage.getItem('adminUser') || '{}').name || 'Admin'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#6B7280",
                fontSize: "0.75rem",
              }}
            >
              {JSON.parse(localStorage.getItem('adminUser') || '{}').email || 'admin@paniclist.com'}
            </Typography>
          </Box>
        </Box>
      </Box>

              <List sx={{ px: 2 }}>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: index === activeIndex ? "#00ADB4" : "transparent",
                  color: index === activeIndex ? "white" : "#374151",
                  "&:hover": {
                    backgroundColor: index === activeIndex ? "#009DA4" : "#F3F4F6",
                  },
                  py: 1.5,
                  px: 2,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: index === activeIndex ? "white" : "#6B7280",
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
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => navigate("/admin-dashboard/settings")}
              sx={{
                borderRadius: 2,
                backgroundColor: location.pathname === "/admin-dashboard/settings" ? "#00ADB4" : "transparent",
                color: location.pathname === "/admin-dashboard/settings" ? "white" : "#6B7280",
                "&:hover": {
                  backgroundColor: location.pathname === "/admin-dashboard/settings" ? "#009DA4" : "#F3F4F6",
                },
                py: 1.5,
                px: 2,
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === "/admin-dashboard/settings" ? "white" : "#6B7280", 
                minWidth: 40 
              }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Settings"
                sx={{
                  "& .MuiTypography-root": {
                    fontWeight: location.pathname === "/admin-dashboard/settings" ? 600 : 500,
                    fontSize: "0.875rem",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>

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
                <LogoutIcon />
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
