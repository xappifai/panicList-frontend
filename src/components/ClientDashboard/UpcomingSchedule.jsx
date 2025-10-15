// src/components/ClientDashboard/UpcomingSchedule.jsx
import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Divider,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Utility to consistently generate a color from a string
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    /* eslint-disable no-bitwise */
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    /* eslint-enable no-bitwise */
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

export function UpcomingSchedule() {
  const theme = useTheme();

  const items = [
    {
      day: "20",
      month: "DEC",
      dateBg: "#E1FBED",
      dateColor: "#17C666",
      title: "Home Delivery Service",
      time: "11:30am - 12:30pm",
      avatars: [null, null, null],
    },
    {
      day: "30",
      month: "DEC",
      dateBg: "#FFEBD0",
      dateColor: "#FFA21D",
      title: "Plumbing Service",
      time: "10:00am - 12:00pm",
      avatars: [null, null, null],
    },
    {
      day: "17",
      month: "DEC",
      dateBg: "#EBEEFA",
      dateColor: "#00ADB4",
      title: "Handyman for one-hour",
      time: "8:00am - 9:00am",
      avatars: [null, null, null],
    },
    {
      day: "25",
      month: "DEC",
      dateBg: "#FDEDED",
      dateColor: "#EA4D4D",
      title: "Roofing Work",
      time: "03:30pm - 05:30pm",
      avatars: [null, null, null],
    },
  ];

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #E5E7EB",
        backgroundColor: "white",
        py: 2,
        borderRadius: "10px",
        fontFamily: "Manrope, sans-serif",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          px: 2,
          pb: 2,
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 700,
            color: "#283C50",
          }}
        >
          Upcoming Schedule
        </Typography>
        <IconButton size="small">
          <MoreVertIcon />
        </IconButton>
      </Box>

      {/* List (scrollable, scrollbar hidden) */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
          // hide scrollbar in WebKit browsers
          "&::-webkit-scrollbar": { display: "none" },
          // hide scrollbar in Firefox
          scrollbarWidth: "none",
          // hide scrollbar in IE/Edge
          msOverflowStyle: "none",
        }}
      >
        {items.map((item, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              mb: 1,
              border: "1px dashed #E5E7EB",
              borderRadius: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 60,
                  textAlign: "center",
                  bgcolor: item.dateBg,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    margin: 0,
                    fontFamily: "Manrope, sans-serif",
                    fontWeight: 700,
                    color: item.dateColor,
                  }}
                >
                  {item.day}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    textTransform: "uppercase",
                    fontFamily: "Manrope, sans-serif",
                    fontWeight: 600,
                    color: item.dateColor,
                  }}
                >
                  {item.month}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: "Manrope, sans-serif",
                    fontWeight: 700,
                    color: "#283C50",
                    mb: 0.5,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontFamily: "Manrope, sans-serif" }}
                >
                  {item.time}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {item.avatars.map((_, idx) => (
                <Avatar
                  key={idx}
                  sx={{
                    width: 24,
                    height: 24,
                    border: "1px solid #fff",
                    bgcolor: stringToColor(item.title + idx),
                    ml: idx === 0 ? 0 : -1,
                  }}
                />
              ))}
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  border: "1px solid #fff",
                  bgcolor: "#fff",
                  ml: -1,
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 600,
                  color: "#283C50",
                }}
              >
                …
              </Avatar>
            </Box>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 1 }} />
      <Typography
        variant="button"
        display="block"
        textAlign="center"
        sx={{
          fontFamily: "Manrope, sans-serif",
          fontWeight: 600,
          color: "#283C50",
        }}
      >
        Upcoming Schedule
      </Typography>
    </Box>
  );
}
