// src/components/Layouts/ProviderHeader.jsx
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Box,
  Badge,
  Avatar,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PublicIcon from "@mui/icons-material/Public";

export default function ProviderHeader({ open, onDrawerToggle }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#FFFFFF",
        color: "#1F2937",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left side - Logo and Menu */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img src="/logo.png" alt="PanicList" style={{ maxHeight: 40 }} />
          </Box>
          
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <IconButton
            color="inherit"
            aria-label="add"
            sx={{ backgroundColor: "#F3F4F6", "&:hover": { backgroundColor: "#E5E7EB" } }}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* Center - Navigation */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            component={RouterLink}
            to="/provider-dashboard"
            sx={{
              backgroundColor: "#00ADB4",
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              "&:hover": {
                backgroundColor: "#009DA4",
              },
            }}
          >
            DASHBOARD
          </Button>
        </Box>

        {/* Right side - Icons, Badges, Profile */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton color="inherit" size="small">
            <PublicIcon />
          </IconButton>

          <IconButton color="inherit" size="small">
            <FullscreenIcon />
          </IconButton>

          <Badge
            badgeContent={2}
            overlap="circular"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#17C666",
                color: "#fff",
              },
            }}
          >
            <IconButton sx={{ color: "#6B7280" }}>
              <AccessTimeIcon />
            </IconButton>
          </Badge>

          <Badge
            badgeContent={3}
            overlap="circular"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#EA4D4D",
                color: "#fff",
              },
            }}
          >
            <IconButton sx={{ color: "#6B7280" }}>
              <NotificationsIcon />
            </IconButton>
          </Badge>

          <IconButton component={RouterLink} to="/profile" sx={{ p: 0 }}>
            <Avatar
              src="/images/provider-avatar.jpg"
              sx={{ width: 40, height: 40, border: "2px solid #fff" }}
            />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
