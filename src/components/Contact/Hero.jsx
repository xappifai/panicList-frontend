// components/Hero.jsx
import React from "react";
import { Box, Container, Typography, useTheme } from "@mui/material";
import heroImg from "../../assets/images/AboutContact/about-hero.jpg";

const Hero = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        height: { xs: 300, md: 450 },
        backgroundImage: `url(${heroImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          bgcolor: "rgba(0,0,0,0.5)",
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          color: "#fff",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
          }}
        >
          {/* Left content */}
          <Box
            sx={{
              textAlign: { xs: "center", md: "left" },
              mb: { xs: 2, md: 0 },
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: "Jost, sans-serif",
                textTransform: "uppercase",
                letterSpacing: 2,
                mb: 1,
                opacity: 0.85,
              }}
            >
              We Are Here To Help
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "Jost, sans-serif",
                fontWeight: 700,
                mb: 0,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                lineHeight: 1.1,
              }}
            >
              Contact Us
            </Typography>
          </Box>

          {/* Right shape */}
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              borderRadius: "50px",
              px: 4,
              py: 1.5,
              display: "inline-flex",
              alignItems: "center",
              textAlign: { xs: "center", md: "right" },
            }}
          >
            <Typography
              variant="button"
              sx={{
                fontFamily: "Jost, sans-serif",
                color: "common.white",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Home
            </Typography>
            <Typography
              variant="button"
              sx={{
                fontFamily: "Jost, sans-serif",
                color: "common.white",
                fontWeight: 700,
                ml: 1,
                textTransform: "none",
              }}
            >
              → Contact Us
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
