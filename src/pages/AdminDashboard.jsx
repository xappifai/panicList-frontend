// src/pages/AdminDashboard.jsx
import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import StatsCard from "../components/AdminDashboard/StatsCard";
import RecentProviders from "../components/AdminDashboard/RecentProviders";
import CustomerInteractions from "../components/AdminDashboard/CustomerInteractions";
import ListingManagement from "../components/AdminDashboard/ListingManagement";
import ReviewFeedback from "../components/AdminDashboard/ReviewFeedback";
import {
  AttachMoney as DollarIcon,
  Monitor as MonitorIcon,
  Business as BusinessIcon,
  ShowChart as ChartIcon,
} from "@mui/icons-material";

const AdminDashboard = () => {
  const statsData = [
    {
      title: "Total Clients",
      mainValue: "1,234",
      subtitle: "Invoices Awaiting Payment",
      progressValue: 56,
      progressColor: "#00ADB4",
      progressLabel: "$5,569 (56%)",
      icon: DollarIcon,
      iconColor: "#00ADB4",
    },
    {
      title: "Total Providers",
      mainValue: "567",
      subtitle: "Projects Completed",
      progressValue: 63,
      progressColor: "#10B981",
      progressLabel: "52 Completed (63%)",
      icon: MonitorIcon,
      iconColor: "#10B981",
    },
    {
      title: "Active Subscriptions",
      mainValue: "345",
      subtitle: "Projects In Progress",
      progressValue: 78,
      progressColor: "#8B5CF6",
      progressLabel: "16 Completed (78%)",
      icon: BusinessIcon,
      iconColor: "#8B5CF6",
    },
    {
      title: "Pending Withdrawal Requests",
      mainValue: "12",
      subtitle: "Conversion Rate",
      progressValue: 46,
      progressColor: "#F59E0B",
      progressLabel: "$2,254 (46%)",
      icon: ChartIcon,
      iconColor: "#F59E0B",
    },
  ];

  return (
    <Box 
      className="admin-dashboard-container"
      sx={{ 
        p: { xs: 2, sm: 3 },
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflow: "hidden",
        boxSizing: "border-box",
        position: "relative",
        "& .admin-dashboard-container > div:first-of-type": {
          display: "grid !important",
          gridTemplateColumns: "1fr !important",
          gap: "16px !important",
          width: "100% !important"
        },
        "@media (min-width: 600px)": {
          "& .admin-dashboard-container > div:first-of-type": {
            gridTemplateColumns: "repeat(2, 1fr) !important",
            gap: "24px !important"
          }
        },
        "@media (min-width: 900px)": {
          "& .admin-dashboard-container > div:first-of-type": {
            gridTemplateColumns: "repeat(4, 1fr) !important",
            gap: "24px !important"
          }
        },
        "& .admin-dashboard-container > div:nth-of-type(2) > div:nth-child(1)": {
          width: "100% !important",
          maxWidth: "100% !important"
        },
        "& .admin-dashboard-container > div:nth-of-type(2) > div:nth-child(2)": {
          width: "100% !important",
          maxWidth: "100% !important"
        },
        "& .admin-dashboard-container > div:nth-of-type(3) > div:nth-child(1)": {
          width: "100% !important",
          maxWidth: "100% !important"
        },
        "& .admin-dashboard-container > div:nth-of-type(3) > div:nth-child(2)": {
          width: "100% !important",
          maxWidth: "100% !important"
        },
        "& .admin-dashboard-container > div:nth-of-type(2), & .admin-dashboard-container > div:nth-of-type(3)": {
          display: "grid !important",
          gridTemplateColumns: "1fr !important",
          gap: "24px !important",
          width: "100% !important"
        },
        "@media (min-width: 1200px)": {
          "& .admin-dashboard-container > div:nth-of-type(2), & .admin-dashboard-container > div:nth-of-type(3)": {
            gridTemplateColumns: "7fr 5fr !important"
          }
        }
      }}
    >
      {/* Welcome Section */}
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1F2937",
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "1.875rem" },
            mb: 1,
            lineHeight: 1.2,
          }}
        >
          Welcome back, {JSON.parse(localStorage.getItem('adminUser') || '{}').name || 'Admin'}!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#6B7280",
            fontSize: { xs: "0.875rem", sm: "1rem" },
            lineHeight: 1.4,
          }}
        >
          Here's what's happening with your platform today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box 
        sx={{ 
          mb: { xs: 3, sm: 4 },
          width: "100%",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
          gap: { xs: 2, sm: 3 },
          boxSizing: "border-box"
        }}
      >
        {statsData.map((stat, index) => (
          <Box 
            key={index} 
            sx={{ 
              minWidth: 0,
              width: "100%",
              boxSizing: "border-box"
            }}
          >
            <StatsCard {...stat} />
          </Box>
        ))}
      </Box>

      {/* Main Content Grid */}
      <Box 
        sx={{ 
          mb: { xs: 2, sm: 3 },
          width: "100%",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "7fr 5fr" },
          gap: { xs: 2, sm: 3 },
          boxSizing: "border-box"
        }}
      >
        {/* Left Column - Tables */}
        <Box sx={{ minWidth: 0, width: "100%" }}>
          <RecentProviders />
        </Box>

        {/* Right Column - Management Cards */}
        <Box sx={{ minWidth: 0, width: "100%" }}>
          <ListingManagement />
        </Box>
      </Box>

      {/* Bottom Section */}
      <Box 
        sx={{ 
          width: "100%",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "7fr 5fr" },
          gap: { xs: 2, sm: 3 },
          boxSizing: "border-box"
        }}
      >
        {/* Left Column - Customer Interactions */}
        <Box sx={{ minWidth: 0, width: "100%" }}>
          <CustomerInteractions />
        </Box>

        {/* Right Column - Review Feedback */}
        <Box sx={{ minWidth: 0, width: "100%" }}>
          <ReviewFeedback />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
