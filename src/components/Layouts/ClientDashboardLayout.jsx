// src/components/ClientDashboard/ClientDashboardLayout.jsx
import React, { useState } from "react";
import { Box } from "@mui/material";
import ClientHeader from "../ClientDashboard/ClientHeader";
import ClientSidebar from "../ClientDashboard/ClientSidebar";
import { Outlet } from "react-router-dom";
import { UserProvider } from "../../contexts/UserContext";

const DRAWER_WIDTH = 280;

export default function ClientDashboardLayout() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const toggleDrawer = () => setDrawerOpen((o) => !o);

  return (
    <UserProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          backgroundColor: "#F3F4F6",
          overflow: "hidden", // Prevent horizontal scroll
        }}
      >
        {/* Fixed header */}
        <ClientHeader open={drawerOpen} onDrawerToggle={toggleDrawer} />

        {/* Body: sidebar + content */}
        <Box
          sx={{
            display: "flex",
            flex: 1,
            mt: "64px", // Account for header height
            overflow: "hidden", // Prevent horizontal scroll
          }}
        >
          {/* Sidebar */}
          <ClientSidebar open={drawerOpen} />

          {/* Main content area */}
          <Box
            component="main"
            sx={{
              flex: 1,
              width: drawerOpen ? `calc(100vw - ${DRAWER_WIDTH}px)` : "100vw",
              transition: (theme) =>
                theme.transitions.create(["width"], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
              overflow: "auto",
              backgroundColor: "#F3F4F6",
            }}
          >
            <Box sx={{ p: 3 }}>
              <Outlet />
            </Box>
          </Box>
        </Box>
      </Box>
    </UserProvider>
  );
}
