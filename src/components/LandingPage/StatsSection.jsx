// components/StatsSection.jsx
import React from "react";
import { Box, Typography, Rating, useTheme } from "@mui/material";
import runningProject from "../../assets/icons/LandingPage/running-project.png";
import teamMember from "../../assets/icons/LandingPage/team-member.png";
import happyClients from "../../assets/icons/LandingPage/happy-clients.png";
import awardWinning from "../../assets/icons/LandingPage/award-winning.png";

const stats = [
  { src: runningProject, value: "200", label: "Running Projects" },
  { src: teamMember, value: "85+", label: "Team Members" },
  { src: happyClients, value: "39K", label: "Happy Clients" },
  { src: awardWinning, value: "45", label: "Award-winning" },
];

const StatsSection = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        backgroundColor: "primary.main",
        color: "common.white",
        px: { xs: 4, md: 8 },
        py: { xs: 10, lg: 0 }, // Figma: more padding
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          height: { xs: "auto", lg: 700, xl: 750 }, // Increased for larger circle
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          alignItems: "center",
          justifyContent: { xs: "center", lg: "space-between" },
          gap: 6, // Figma: more gap
        }}
      >
        {/* LEFT SIDE */}
        <Box
          sx={{
            flex: 1,
            textAlign: { xs: "center", lg: "left" },
            mb: { xs: 6, lg: 0 },
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 900, // Figma: bolder
              mb: 2.5, // Figma: less margin
              fontSize: { xs: "2rem", md: "2.5rem" }, // Figma: larger
              letterSpacing: "-0.5px", // Figma: tighter
            }}
          >
            Building a trusted marketplace for service providers and customers
            alike.
          </Typography>

          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: "20px",
              p: 2,
              width: { xs: "100%", sm: 320 },
              mx: { xs: "auto", lg: 0 },
            }}
          >
            <Typography
              component="span"
              sx={{
                fontFamily: "Manrope, sans-serif",
                fontWeight: 900, // Figma: bolder
                fontSize: {
                  xs: "2.5rem",
                  sm: "3rem",
                  md: "3.5rem",
                  lg: "3.75rem",
                },
                color: "#F4B81C",
                mr: 3,
                lineHeight: 1,
                letterSpacing: "-1px", // Figma: tighter
              }}
            >
              89K
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Rating
                value={5}
                readOnly
                size="small"
                sx={{ color: "#F4B81C" }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 400,
                  fontSize: "1.1rem", // Figma: slightly larger
                  mt: 0.5,
                  color: "#fff",
                }}
              >
                Customer Reviews
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* RIGHT SIDE: Responsive Stats Grid */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Wrapper to contain the circle and add padding/margin */}
          <Box
            sx={{
              p: { xs: 2, md: 4 }, // Add padding around the circle
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: { xs: 3, md: 5 },
                width: "100%",
                maxWidth: { xs: "95%", sm: 480, md: 600, lg: 640 }, // Increased for better wrapping
                aspectRatio: "1", // Always a perfect circle
                borderRadius: "50%",
                backgroundColor: {
                  xs: "transparent",
                  md: "rgba(255,255,255,0.05)",
                },
                p: { xs: 0, md: 6, lg: 8 },
                boxSizing: "border-box",
                boxShadow: { md: "0 8px 32px rgba(0,173,180,0.10)" },
                overflow: "hidden",
                margin: "0 auto", // Center horizontally
              }}
            >
              {stats.map(({ src, value, label }) => (
                <Box
                  key={label}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2.5, // Figma: more gap
                    textAlign: "left",
                    px: 1,
                    py: { xs: 2, md: 0 },
                    flexWrap: "nowrap", // prevent wrapping of icon + text
                  }}
                >
                  <Box
                    component="img"
                    src={src}
                    alt={label}
                    sx={{
                      width: { xs: 32, sm: 48, md: 56, lg: 64 },
                      height: "auto",
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography
                      component="span"
                      sx={{
                        fontFamily: "Manrope, sans-serif",
                        fontWeight: 900, // Figma: bolder
                        fontSize: {
                          xs: "1.5rem",
                          sm: "2.25rem",
                          md: "2.75rem",
                          lg: "2.75rem",
                        },
                        lineHeight: 1.1, // Figma: tighter
                        display: "block",
                        letterSpacing: "-0.5px", // Figma: tighter
                      }}
                    >
                      {value}
                    </Typography>
                    <Typography
                      variant="body2"
                      noWrap // keep the label on one line
                      sx={{
                        fontFamily: "Manrope, sans-serif",
                        fontWeight: 400,
                        fontSize: {
                          xs: "0.95rem",
                          sm: "1.1rem",
                          md: "1.1rem",
                          lg: "1.1rem",
                        },
                        whiteSpace: "nowrap", // extra safeguard
                        color: "#fff",
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StatsSection;
