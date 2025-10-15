// src/components/ClientDashboard/ClientDashboard.jsx
import React from "react";
import { Box } from "@mui/material";
import JobHistoryTable from "../components/JobHistoryTable";
import SubscriptionCard from "../components/ClientDashboard/SubscriptionCard";
import ReviewsList from "../components/ReviewProvClient";

export default function ClientDashboard() {
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          width: "100%",
          justifyContent: "space-between",
          gap: 2,
          alignItems: "stretch",
          height: "100%",
        }}
      >
        {/* === First column === */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 2, // Take up more space
            height: "100%",
            gap: 2,
          }}
        >
          {/* A) Job History (fills available space) */}
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <JobHistoryTable />
          </Box>
        </Box>

        {/* === Second column === */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1, // Take up less space
            height: "100%",
            gap: 2,
          }}
        >
          {/* Subscription card */}
          <Box sx={{ height: "300px" }}>
            <SubscriptionCard />
          </Box>
          {/* Reviews list (fills remaining space) */}
          <Box sx={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
            <ReviewsList />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
