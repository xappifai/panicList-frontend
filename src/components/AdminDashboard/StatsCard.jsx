// src/components/AdminDashboard/StatsCard.jsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  IconButton,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  AttachMoney as DollarIcon,
  Monitor as MonitorIcon,
  Business as BusinessIcon,
  ShowChart as ChartIcon,
} from "@mui/icons-material";

const StatsCard = ({ title, mainValue, subtitle, progressValue, progressColor, progressLabel, icon: Icon, iconColor }) => {
  return (
    <Card
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 3,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        border: "1px solid #F3F4F6",
        height: "100%",
        minHeight: { xs: "auto", sm: "220px" },
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 }, height: "100%", display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                backgroundColor: "#F3F4F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: progressColor,
                flexShrink: 0,
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              }}
            >
              <Icon sx={{ fontSize: 28, color: iconColor || progressColor }} />
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "#1F2937",
                fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
              }}
            >
              {mainValue}
            </Typography>
          </Box>
          <IconButton 
            size="small" 
            sx={{ 
              color: "#6B7280",
              "&:hover": {
                backgroundColor: "#F3F4F6",
              }
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#374151",
            fontSize: "1.125rem",
            mb: 2.5,
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>

        <Box sx={{ mb: 0, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <Typography
            variant="body2"
            sx={{
              color: "#6B7280",
              fontSize: "0.875rem",
              mb: 1.5,
              lineHeight: 1.4,
              fontWeight: 500,
            }}
          >
            {subtitle}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#1F2937",
                fontSize: "0.875rem",
                lineHeight: 1.2,
              }}
            >
              {progressLabel}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "#E5E7EB",
              "& .MuiLinearProgress-bar": {
                backgroundColor: progressColor,
                borderRadius: 4,
                transition: "width 0.3s ease",
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
