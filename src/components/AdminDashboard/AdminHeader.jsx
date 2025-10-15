// src/components/AdminDashboard/AdminHeader.jsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Button,
  InputBase,
  Badge,
  Avatar,
  styled,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Language as LanguageIcon,
  Fullscreen as FullscreenIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#F3F4F6",
  "&:hover": {
    backgroundColor: "#E5E7EB",
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#6B7280",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function AdminHeader({ open, onDrawerToggle }) {
  // Get admin user info from localStorage
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
  
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
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "#00ADB4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: "1.25rem",
                mr: 1,
              }}
            >
              P
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#00ADB4",
                fontSize: "1.5rem",
              }}
            >
              Panic List
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {[...Array(5)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 8,
                    height: 8,
                    backgroundColor: "#F59E0B",
                    borderRadius: "50%",
                  }}
                />
              ))}
            </Box>
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

        {/* Right side - Search, Icons, Profile */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search..."
              inputProps={{ "aria-label": "search" }}
            />
          </Search>

          <IconButton color="inherit" size="small">
            <LanguageIcon />
          </IconButton>

          <IconButton color="inherit" size="small">
            <FullscreenIcon />
          </IconButton>

          <IconButton color="inherit" size="small">
            <Badge badgeContent={2} color="error">
              <ScheduleIcon />
            </Badge>
          </IconButton>

          <IconButton color="inherit" size="small">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1F2937', fontSize: '0.875rem' }}>
                {adminUser.name || 'Admin'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.75rem' }}>
                {adminUser.email || 'admin@paniclist.com'}
              </Typography>
            </Box>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                backgroundColor: "#00ADB4",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              {adminUser.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
            </Avatar>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
