import { Box, Container, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIcon from "@mui/icons-material/Phone";

export default function Topbar() {
  return (
    <Box
      sx={{
        backgroundColor: "primary.dark",
        color: "white",
        py: 2,
        fontFamily: "Manrope, sans-serif",
        fontWeight: 400,
      }}
    >
      <Box
        sx={{
          maxWidth: "1440px",
          width: "100%",
          mx: "auto",
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.85rem",
        }}
      >
        {/* Left: Working Hours */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccessTimeIcon sx={{ fontSize: 18, color: "#00bcd4" }} />
          <Typography variant="body2">Sun – Fri || 8:00 – 7:00</Typography>
        </Box>

        {/* Right: Phone & Language */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PhoneIcon sx={{ fontSize: 18, color: "#00bcd4" }} />
          <Typography variant="body2">+00 56 98 48</Typography>
          <Typography sx={{ color: "#ccc" }}>|</Typography>
          <Typography variant="body2">English</Typography>
        </Box>
      </Box>
    </Box>
  );
}
