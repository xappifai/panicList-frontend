import React from "react";
import { Box, Typography } from "@mui/material";

// Icons (PNG imports)
import Arrow from "../../assets/icons/ServicesRendered/Arrow.png";
import BookOnlineIcon from "../../assets/icons/ServicesRendered/BookOnlineIcon.png";
import SolveProblemIcon from "../../assets/icons/ServicesRendered/Solve Problem Icon.png";
import WeArriveIcon from "../../assets/icons/ServicesRendered/We Arrive Icon.png";
import ContactMan from "../../assets/images/ServicesRendered/Contact Man.png";

export default function WorkProcess() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: { xs: 6, md: 8 },
        px: { xs: 2, md: 4 },
        bgcolor: "white",
      }}
    >
      <Typography
        variant="h3"
        component="h2"
        sx={{
          fontWeight: 800,
          fontFamily: "Manrope, sans-serif",
          mb: 1,
          textAlign: "center",
        }}
      >
        Our Proven{" "}
        <Box
          component="span"
          sx={{
            color: "#00BCD4",
            fontFamily: "Manrope, sans-serif",
            fontWeight: 800,
          }}
        >
          Work Process
        </Box>
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 500,
          fontFamily: "Manrope, sans-serif",
          fontSize: { xs: "1.125rem", md: "1.25rem" },
          color: "#6B7280",
          mb: { xs: 6, md: 8 },
          textAlign: "center",
        }}
      >
        Making Your Service Journey Simple and Transparent
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 4, md: 8 },
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        {/* Step 1: Book Online */}
        <ProcessStep
          icon={
            <img
              src={BookOnlineIcon}
              alt="Book Online"
              style={{
                width: "60px",
                height: "auto",
                marginBottom: 8,
                maxHeight: "60px",
                objectFit: "contain",
              }}
            />
          }
          text="Book Online"
        />

        {/* Arrow 1 */}
        <ArrowIcon />

        {/* Step 2: We Arrive */}
        <ProcessStep
          icon={
            <img
              src={WeArriveIcon}
              alt="We Arrive"
              style={{
                width: "60px",
                height: "auto",
                marginBottom: 8,
                maxHeight: "60px",
                objectFit: "contain",
              }}
            />
          }
          text="We Arrive"
        />

        {/* Arrow 2 */}
        <ArrowIcon />

        {/* Step 3: Solve Problem */}
        <ProcessStep
          icon={
            <img
              src={SolveProblemIcon}
              alt="Solve Problem"
              style={{
                width: "60px",
                height: "auto",
                marginBottom: 8,
                maxHeight: "60px",
                objectFit: "contain",
              }}
            />
          }
          text="Solve Problem"
        />
      </Box>
    </Box>
  );
}

// Reusable component for each process step circle
function ProcessStep({ icon, text }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: { xs: 150, md: 180 },
        height: { xs: 150, md: 180 },
        borderRadius: "50%",
        bgcolor: "#00BCD4",
        color: "white",
        textAlign: "center",
        flexShrink: 0,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {icon}
      <Typography
        variant="h6"
        sx={{ fontWeight: "medium", fontSize: { xs: "1rem", md: "1.25rem" } }}
      >
        {text}
      </Typography>
    </Box>
  );
}

// Custom Arrow Component replaced with your Arrow.png image
function ArrowIcon() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mx: { xs: 0, md: 4 },
        my: { xs: 4, md: 0 },
        flexShrink: 0,
        width: 80,
        height: 40,
        transform: { xs: "rotate(90deg)", md: "rotate(0deg)" },
        "& img": {
          width: "100%",
          height: "100%",
          objectFit: "contain",
        },
      }}
    >
      <img src={Arrow} alt="Arrow" />
    </Box>
  );
}
