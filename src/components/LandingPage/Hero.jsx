// components/Hero.jsx
import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CustomButton from "../CustomButton";
import handymanImage from "../../assets/images/LandingPage/handyman.png";
import heroBg from "../../assets/images/LandingPage/hero-bg.jpg";
import BookOnline from "../../assets/icons/LandingPage/book-online.png";
import WeArrive from "../../assets/icons/LandingPage/we-arrive.png";
import SolveProblem from "../../assets/icons/LandingPage/solve-problem.png";
import Arrow from "../../assets/icons/LandingPage/arrow.png";

const Hero = () => (
  <Box
    sx={{
      position: "relative",
      backgroundImage: `url(${heroBg})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundColor: "#f5f5f5",
      px: { xs: 2, md: 6 },
      overflow: "hidden",
      pt: { xs: 4, md: 8 },
    }}
  >
    {/* Hero top section (lowest z-index) */}
    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: "1200px",
        mx: "auto",
        mb: { xs: 12, md: 16 },
      }}
    >
      {/* TEXT CONTENT */}
      <Box
        sx={{
          flex: 1,
          textAlign: { xs: "center", md: "left" },
          pr: { md: 4 },
        }}
      >
        <Typography
          variant="overline"
          sx={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 700,
            color: "primary.main",
            mb: 1,
            display: "block",
          }}
        >
          :: Highly Trained Staff
        </Typography>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontFamily: "Jost, sans-serif",
            fontWeight: 800, // Figma: bolder
            lineHeight: 1.1, // Figma: tighter
            mb: 2.5, // Figma: less margin
            fontSize: { xs: "2.25rem", sm: "2.75rem", md: "3.5rem" }, // Figma: larger
            color: "primary.dark",
            letterSpacing: "-0.5px", // Figma: tighter
          }}
        >
          Discover Trusted Service Providers –{" "}
          <Box component="span" sx={{ color: "primary.main" }}>
            Find,
          </Box>{" "}
          <Box component="span" sx={{ color: "primary.main" }}>
            Hire,
          </Box>{" "}
          and{" "}
          <Box component="span" sx={{ color: "primary.main" }}>
            Review
          </Box>{" "}
          with Ease
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 400,
            color: "primary.dark",
            fontSize: "1.125rem", // Figma: slightly larger
            mb: 3, // Figma: less margin
            maxWidth: 520, // Figma: slightly wider
            mx: { xs: "auto", md: 0 },
            lineHeight: 1.7, // Figma: more readable
          }}
        >
          Your one‑stop platform for connecting with the best service providers
          in your area. Whether you need a plumber, tutor, or handyman, our
          directory makes it simple to find, hire, and rate professionals you
          can trust.
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2.5, // Figma: more space
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <CustomButton
            label="BOOK ONLINE"
            width="170px" // Figma: wider
            height="54px" // Figma: taller
            backgroundColor="primary.main"
            textColor="#fff"
            sx={{
              borderRadius: "12px", // Figma: more rounded
              fontSize: "1.1rem", // Figma: larger
              fontWeight: 700, // Figma: bolder
              boxShadow: "0 4px 16px rgba(0,173,180,0.12)", // Figma: subtle shadow
            }}
          />
          <IconButton
            size="large"
            sx={{
              bgcolor: "background.paper",
              width: 54,
              height: 54,
              ml: 1,
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)", // Figma: subtle shadow
              borderRadius: "50%",
              border: "2px solid #00ADB4", // Figma: accent border
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              '&:hover': { bgcolor: "background.paper", opacity: 0.95 },
            }}
          >
            <PlayCircleOutlineIcon fontSize="large" color="primary" sx={{ fontSize: 36 }} />
          </IconButton>
        </Box>
      </Box>

      {/* HANDYMAN IMAGE */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          textAlign: { xs: "center", md: "right" },
          mt: { xs: 4, md: 0 },
          display: "flex",
          alignItems: "flex-end",
          justifyContent: { xs: "center", md: "flex-end" },
        }}
      >
        <Box
          component="img"
          src={handymanImage}
          alt="Smiling handyman"
          sx={{
            width: { xs: "90%", sm: "70%", md: "90%" }, // Figma: larger
            maxWidth: 420, // Figma: constrain max width
            height: "auto",
            borderRadius: 3, // Figma: more rounded
            display: "inline-block",
            boxShadow: "0 8px 32px rgba(33,40,50,0.10)", // Figma: subtle shadow
          }}
        />
      </Box>
    </Box>

    {/* background rectangle (middle z-index) */}
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: { xs: 100, sm: 150, md: 200 },
        bgcolor: "background.paper",
        zIndex: 2,
      }}
    />

    {/* Three‑step process anchored to bottom (highest z-index) */}
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 3,
        display: "flex",
        alignItems: "flex-end", // Figma: align to bottom
        justifyContent: "center",
        flexWrap: { xs: "wrap", md: "nowrap" },
        columnGap: { xs: 2.5, sm: 5, md: 8 }, // Figma: more gap
        px: { xs: 2, sm: 4, md: 0 },
        py: { xs: 2, md: 4 },
      }}
    >
      {/* Step 1 */}
      <Box
        sx={{
          flexShrink: 0,
          width: { xs: 110, sm: 150, md: 210 }, // Figma: larger
          height: { xs: 110, sm: 150, md: 210 },
          borderRadius: "50%",
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 12px rgba(0,173,180,0.10)", // Figma: subtle shadow
        }}
      >
        <Box
          component="img"
          src={BookOnline}
          alt="Book Online"
          sx={{
            width: { xs: 28, sm: 44, md: 68 },
            height: "auto",
          }}
        />
        <Typography
          sx={{
            mt: 1,
            fontSize: { xs: "12px", sm: "16px", md: "18px" },
            color: "primary.main",
          }}
        >
          Book Online
        </Typography>
      </Box>

      {/* Arrow */}
      <Box
        component="img"
        src={Arrow}
        alt="Arrow"
        sx={{
          flexShrink: 0,
          width: { xs: 24, sm: 32, md: 48 },
          height: "auto",
        }}
      />

      {/* Step 2 (raised) */}
      <Box
        sx={{
          flexShrink: 0,
          width: { xs: 110, sm: 150, md: 210 },
          height: { xs: 110, sm: 150, md: 210 },
          borderRadius: "50%",
          bgcolor: "primary.main",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: { xs: "center", md: "flex-start" },
          mb: { xs: 2, md: 10 }, // Figma: more offset
          boxShadow: "0 8px 32px rgba(0,173,180,0.18)", // Figma: stronger shadow
        }}
      >
        <Box
          component="img"
          src={WeArrive}
          alt="We Arrive"
          sx={{
            width: { xs: 28, sm: 44, md: 68 },
            height: "auto",
          }}
        />
        <Typography
          sx={{
            mt: 1,
            fontSize: { xs: "12px", sm: "16px", md: "18px" },
            color: "#fff",
          }}
        >
          We Arrive
        </Typography>
      </Box>

      {/* Arrow */}
      <Box
        component="img"
        src={Arrow}
        alt="Arrow"
        sx={{
          flexShrink: 0,
          width: { xs: 24, sm: 32, md: 48 },
          height: "auto",
        }}
      />

      {/* Step 3 */}
      <Box
        sx={{
          flexShrink: 0,
          width: { xs: 110, sm: 150, md: 210 },
          height: { xs: 110, sm: 150, md: 210 },
          borderRadius: "50%",
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 12px rgba(0,173,180,0.10)", // Figma: subtle shadow
        }}
      >
        <Box
          component="img"
          src={SolveProblem}
          alt="Solve Problem"
          sx={{
            width: { xs: 28, sm: 44, md: 68 },
            height: "auto",
          }}
        />
        <Typography
          sx={{
            mt: 1,
            fontSize: { xs: "12px", sm: "16px", md: "18px" },
            color: "primary.main",
          }}
        >
          Solve Problem
        </Typography>
      </Box>
    </Box>
  </Box>
);

export default Hero;
