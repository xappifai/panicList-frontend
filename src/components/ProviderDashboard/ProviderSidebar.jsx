// src/components/Layouts/ProviderSidebar.jsx
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

import DashboardIcon from "@mui/icons-material/Dashboard";
import RateReviewIcon from "@mui/icons-material/RateReview";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import PaymentsIcon from "@mui/icons-material/Payments";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

const drawerWidth = 280;

const providerLinks = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/provider-dashboard" },
  { text: "Clients Management", icon: <PeopleIcon />, path: "/provider-dashboard/clients" },
  { text: "Listing Management", icon: <MonetizationOnIcon />, path: "/provider-dashboard/listing-management" },
  { text: "Reviews", icon: <RateReviewIcon />, path: "/provider-dashboard/reviews" },
  { text: "Analytics", icon: <QueryStatsIcon />, path: "/provider-dashboard/analytics" },
  { text: "Payment", icon: <PaymentsIcon />, path: "/provider-dashboard/payment" },
  { text: "Profile", icon: <SettingsIcon />, path: "/provider-dashboard/settings" },
];

export default function ProviderSidebar({ open }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('firebaseToken');
    navigate('/login');
  };

  // Determine which menu item is active based on current path
  const getActiveMenu = () => {
    const rawPath = location.pathname.replace(/\/+$/, '');
    // Aliases map non-nav routes to their logical nav item
    const alias = [
      ['/provider-dashboard/withdrawal', '/provider-dashboard/payment'],
      ['/provider-dashboard/add-listing', '/provider-dashboard/listing-management'],
      ['/provider-dashboard/review-feedback', '/provider-dashboard/reviews'],
      ['/provider-dashboard/customer-interactions', '/provider-dashboard/clients'],
    ];

    let normalizedPath = rawPath;
    for (const [from, to] of alias) {
      if (rawPath.startsWith(from)) {
        normalizedPath = to;
        break;
      }
    }

    // Longest prefix match so nested pages highlight their parent
    let matchIndex = -1;
    let bestLen = -1;
    providerLinks.forEach((link, i) => {
      const base = link.path;
      if (normalizedPath === base || normalizedPath.startsWith(base + '/')) {
        if (base.length > bestLen) {
          bestLen = base.length;
          matchIndex = i;
        }
      }
    });

    return matchIndex >= 0 ? matchIndex : 0;
  };

  const activeIndex = getActiveMenu();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
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
              width: 40,
              height: 40,
              backgroundColor: "#00ADB4",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            {(() => {
              const user = JSON.parse(localStorage.getItem('user') || '{}');
              return user.fullName ? user.fullName.charAt(0).toUpperCase() : 'P';
            })()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#1F2937",
                fontWeight: 600,
                fontSize: "0.875rem",
                mb: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {(() => {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                return user.fullName || 'Provider';
              })()}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#6B7280",
                fontSize: "0.75rem",
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
              }}
            >
              {(() => {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                return user.email || 'provider@example.com';
              })()}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#00ADB4",
                fontSize: "0.7rem",
                fontWeight: 500,
                backgroundColor: "#F0FDFF",
                px: 1,
                py: 0.25,
                borderRadius: 1,
                display: 'inline-block',
                mt: 0.5,
              }}
            >
              Service Provider
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      <List sx={{ px: 2 }}>
        {providerLinks.map((item, index) => (
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
