// src/components/ProviderDashboard/ProviderDashboard.jsx
import React from "react";
import { Box } from "@mui/material";
import StatsCard from "../components/ProviderDashboard/StatsCard";
import FinanceComponent from "../components/ProviderDashboard/FinanceComponent";
import Recommendations from "../components/RecommendationsListing";
import TableComponent from "../components/TableComponent";
import ReviewList from "../components/ReviewProvClient";
import ProviderAuthGuard from "../components/ProviderDashboard/ProviderAuthGuard";

// icons (no color prop here—will inherit iconColor)
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BuildIcon from "@mui/icons-material/Build";

export default function ProviderDashboard() {
  return (
    <ProviderAuthGuard>
      <Box
      sx={{
        width: "1400px",
        mx: "auto",
        height: "100vh",
        backgroundColor: "#F3F4F6",
        display: "flex",
        flexDirection: "column",
        rowGap: 4,
        px: 2,
        py: 5,
      }}
    >
      {/* Row 1: Stat cards */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <StatsCard
          icon={<MonetizationOnIcon />}
          iconBg="#E9ECEF"
          mainValue="45/76"
          subtitle="Invoices Awaiting Payment"
          footerLabel="Invoices Awaiting Payment"
          footerValue="$5,569"
          footerPct="56%"
          progress={56}
          progressColor="primary.main"
        />
        <StatsCard
          icon={<AssignmentTurnedInIcon />}
          iconBg="#E9ECEF"
          mainValue="48/86"
          subtitle="Projects Completed"
          footerLabel="Projects Completed"
          footerValue="52 Completed"
          footerPct="63%"
          progress={63}
          progressColor="warning.main"
        />
        <StatsCard
          icon={<BuildIcon />}
          iconBg="#E9ECEF"
          mainValue="16/20"
          subtitle="Projects In Progress"
          footerLabel="Projects In Progress"
          footerValue="16 Completed"
          footerPct="78%"
          progress={78}
          progressColor="success.main"
        />
        <StatsCard
          icon={<ShowChartIcon />}
          iconBg="#E9ECEF"
          mainValue="46.59%"
          subtitle="Conversion Rate"
          footerLabel="Conversion Rate"
          footerValue="$2,254"
          footerPct="46%"
          progress={46}
          progressColor="error.main"
        />
      </Box>

      {/* Row 2: Finance + Listing Management */}
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* <Box sx={{ width: "1000px" }}>
          <FinanceComponent />
        </Box> */}
        <Box sx={{ width: "1500px", height: "625px" }}>
          <Recommendations heading="Listing Management" />
        </Box>
      </Box>

      {/* Row 3: Customer Interactions + Review Feedback */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Box sx={{ width: "1000px" }}>
          <TableComponent heading="Customer Interactions" height="600px" />
        </Box>
        <Box sx={{ width: "500px", height: "550px" }}>
          <ReviewList heading="Review Feedback" />
        </Box>
      </Box>
      </Box>
    </ProviderAuthGuard>
  );
}
