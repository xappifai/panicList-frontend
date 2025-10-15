// src/components/ProviderDashboard/StatsCard.jsx
import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  LinearProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function StatsCard({
  icon,
  iconBg = "#E9ECEF",
  iconColor = "#6B7885",
  mainValue,
  subtitle,
  footerLabel,
  footerValue,
  footerPct,
  progress = 0,
  progressColor = "primary.main",
}) {
  return (
    <Card
      sx={{
        flex: 1,
        borderRadius: 2,
        boxShadow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardContent>
        {/* Top row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                bgcolor: iconBg,
                color: iconColor,
                border: "1px solid #DCDEE4",
                borderRadius: "50%",
                p: 1.25,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "Manrope",
                  fontWeight: 700,
                  color: "#283C50",
                }}
              >
                {mainValue}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "Manrope",
                  fontWeight: 600,
                  color: "#283C50",
                }}
              >
                {subtitle}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small">
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Bottom section */}
        <Box sx={{ mt: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: "Manrope",
                color: "#283C50",
                fontWeight: 600,
              }}
            >
              {footerLabel}
            </Typography>
            <Box>
              <Typography
                component="span"
                variant="caption"
                sx={{
                  fontFamily: "Manrope",
                  color: "#283C50",
                  fontWeight: 600,
                }}
              >
                {footerValue}
              </Typography>
              {footerPct && (
                <Typography
                  component="span"
                  variant="caption"
                  sx={{
                    fontFamily: "Manrope",
                    color: "#64748B",
                    fontWeight: 600,
                  }}
                >
                  &nbsp;({footerPct})
                </Typography>
              )}
            </Box>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              "& .MuiLinearProgress-bar": {
                bgcolor: progressColor,
              },
              bgcolor: "#F3F4F6",
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
