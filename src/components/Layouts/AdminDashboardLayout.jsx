// src/components/Layouts/AdminDashboardLayout.jsx
import React, { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import AdminHeader from "../AdminDashboard/AdminHeader";
import AdminSidebar from "../AdminDashboard/AdminSidebar";
import AuthGuard from "../AdminDashboard/AuthGuard";
import { Outlet } from "react-router-dom";

export default function AdminDashboardLayout() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const toggleDrawer = () => setDrawerOpen((o) => !o);

  return (
    <AuthGuard>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          backgroundColor: "#F8F9FA",
        }}
      >
        {/* Fixed header */}
        <AdminHeader open={drawerOpen} onDrawerToggle={toggleDrawer} />

        {/* Body: sidebar + content */}
        <Box
          sx={{
            display: "flex",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Sidebar */}
          <AdminSidebar open={drawerOpen} onClose={toggleDrawer} />

          {/* Main content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              overflow: "auto",
              backgroundColor: "#F8F9FA",
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
              boxSizing: "border-box",
            }}
          >
            <Toolbar />
            <Outlet />
          </Box>
        </Box>
      </Box>
    </AuthGuard>
  );
}
