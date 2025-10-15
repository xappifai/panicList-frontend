import React from "react";
import { Box, Typography, Avatar, useTheme } from "@mui/material";
import kenWilliamson from "../../assets/images/LandingPage/ken-williamson.jpg";
import davidMiller from "../../assets/images/LandingPage/david-miller.jpg";

const TESTIMONIALS = [
  {
    text: "There are many variations of passages the majority have suffered alteration some form injected humour randomised words which don’t look even slightly believable are going use a passage of need to be sure.",
    name: "Ken Williamson",
    role: "CEO & Founder",
    image: kenWilliamson,
  },
  {
    text: "There are many variations of passages the majority have suffered alteration some form injected humour randomised words which don’t look even slightly believable are going use a passage of need to be sure.",
    name: "David Miller",
    role: "CEO & Founder",
    image: davidMiller,
  },
  {
    text: "There are many variations of passages the majority have suffered alteration some form injected humour randomised words which don’t look even slightly believable are going use a passage of need to be sure.",
    name: "Ken Williamson",
    role: "CEO & Founder",
    image: kenWilliamson,
  },
];

const Testimonial = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        backgroundColor: "#DEF4F5",
        py: { xs: 6, md: 10 },
      }}
    >
      {/* Container */}
      <Box sx={{ maxWidth: "1200px", mx: "auto", px: { xs: 2, md: 6 } }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 900, // Figma: bolder
              color: theme.palette.primary.dark,
              mb: 1.5, // Figma: more space
              fontSize: { xs: "2rem", md: "2.5rem" }, // Figma: larger
              letterSpacing: "-0.5px", // Figma: tighter
            }}
          >
            What People’s Say
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 400,
              color: theme.palette.text.secondary,
              maxWidth: 600,
              mx: "auto",
              fontSize: "1.1rem", // Figma: slightly larger
              lineHeight: 1.7, // Figma: more readable
              mb: 2, // Figma: more space below
            }}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. has been the industry’s standard dummy text ever since the
            1500s.
          </Typography>
        </Box>

        {/* Flex container for cards */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 5, // Figma: more gap
          }}
        >
          {TESTIMONIALS.map(({ text, name, role, image }, index) => (
            <Box
              key={index}
              sx={{
                width: { xs: "100%", sm: "45%", md: "30%" },
                textAlign: "center",
                minWidth: 280, // Figma: consistent card width
                maxWidth: 360, // Figma: constrain width
              }}
            >
              <Box
                sx={{
                  backgroundColor: theme.palette.primary.lightWight,
                  p: 4, // Figma: more padding
                  borderRadius: 4, // Figma: more rounded
                  minHeight: 200, // Figma: taller card
                  boxShadow: "0 4px 24px rgba(33,40,50,0.08)", // Figma: subtle shadow
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "Manrope, sans-serif",
                    fontWeight: 400,
                    color: theme.palette.primary.dark,
                    lineHeight: 1.7, // Figma: more readable
                    fontSize: "1.1rem", // Figma: slightly larger
                  }}
                >
                  {text}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row", // Figma: always row
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 3,
                  gap: 2.5, // Figma: more gap
                }}
              >
                <Avatar src={image} alt={name} sx={{ width: 64, height: 64, boxShadow: "0 2px 8px rgba(0,173,180,0.10)" }} />
                <Box textAlign={{ xs: "center", md: "left" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontFamily: "Manrope, sans-serif",
                      fontWeight: 900, // Figma: bolder
                      color: theme.palette.primary.dark,
                      fontSize: "1.1rem", // Figma: slightly larger
                    }}
                  >
                    {name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "Manrope, sans-serif",
                      fontWeight: 400,
                      color: theme.palette.text.secondary,
                      fontSize: "1rem", // Figma: slightly larger
                    }}
                  >
                    {role}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Testimonial;
