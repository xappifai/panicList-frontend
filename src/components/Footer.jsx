// components/Footer.jsx
import React from "react";
import { Box, Typography, IconButton, Link, useTheme } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import GoogleIcon from "@mui/icons-material/Google";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

import logo from "/logo.png";
import project1 from "../assets/images/project1.jpg";
import project2 from "../assets/images/project2.jpg";
import project3 from "../assets/images/project3.jpg";
import project4 from "../assets/images/project4.jpg";
import project5 from "../assets/images/project5.jpg";
import project6 from "../assets/images/project6.jpg";

export default function Footer() {
  const theme = useTheme();

  const services = [
    "Lorem IPSUM",
    "Lorem IPSUM",
    "Lorem IPSUM",
    "Lorem IPSUM",
    "Lorem IPSUM",
  ];

  const projects = [project1, project2, project3, project4, project5, project6];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
      }}
    >
      {/* Centered container with max width */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, md: 4 }, // Figma: more padding
          pt: { xs: 8, md: 12 }, // Figma: more padding
          pb: { xs: 6, md: 10 }, // Figma: more padding
        }}
      >
        {/* Footer sections */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            flexWrap: { xs: "wrap", md: "nowrap" },
            justifyContent: { xs: "center", md: "space-between" },
            alignItems: { xs: "center", md: "flex-start" },
            gap: { xs: 4, md: 6 }, // Figma: more gap
            mb: 8, // Figma: more margin
          }}
        >
          {/* Logo & description */}
          <Box
            sx={{
              width: { xs: "100%", md: "auto" },
              maxWidth: { md: 300 },
              textAlign: { xs: "center", md: "left" },
              "@media (min-width:890px) and (max-width:1110px)": {
                maxWidth: 200,
              },
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{ height: 48, mb: 2 }}
            />
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "0.75rem", md: "0.875rem" },
                fontWeight: 400,
                mb: 3,
                lineHeight: 1.6,
              }}
            >
              Management Plumbing includes a broad range of activities, and the
              many firms and their members often define these practices.
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
                gap: 2, // Figma: more gap
              }}
            >
              {[FacebookIcon, TwitterIcon, InstagramIcon, GoogleIcon].map(
                (Icon, i) => (
                  <IconButton
                    key={i}
                    href="#"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.12)",
                      color: theme.palette.common.white,
                      borderRadius: "50%",
                      width: 48,
                      height: 48,
                      fontSize: 28, // Figma: larger icon
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,173,180,0.10)", // Figma: subtle shadow
                      transition: "background 0.2s",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.22)" },
                      mr: i < 3 ? 2 : 0, // Figma: more margin
                    }}
                  >
                    <Icon sx={{ fontSize: 28 }} />
                  </IconButton>
                )
              )}
            </Box>
          </Box>

          {/* Contact */}
          <Box
            sx={{
              width: { xs: "100%", md: "auto" },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "0.875rem", md: "1rem" },
                fontFamily: "'Jost',sans-serif",
                fontWeight: 500,
                mb: 2,
              }}
            >
              CONTACT
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", md: "flex-start" },
                mb: 1,
              }}
            >
              <LocationOnIcon sx={{ mr: 1 }} />
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                  fontFamily: "Manrope, sans-serif",
                }}
              >
                7 Green Lake Street
                <br />
                Crawfordsville, IN 47933
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", md: "flex-start" },
                mb: 1,
              }}
            >
              <PhoneIcon sx={{ mr: 1 }} />
              <Link
                href="tel:+1800123456789"
                color="inherit"
                underline="none"
                variant="body2"
                sx={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                }}
              >
                +1 800 123 456 789
              </Link>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <EmailIcon sx={{ mr: 1 }} />
              <Link
                href="mailto:paniclist@gmail.com"
                color="inherit"
                underline="none"
                variant="body2"
                sx={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                }}
              >
                paniclist@gmail.com
              </Link>
            </Box>
          </Box>

          {/* Services */}
          <Box
            sx={{
              width: { xs: "100%", md: "auto" },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "0.875rem", md: "1rem" },
                fontFamily: "'Jost',sans-serif",
                fontWeight: 500,
                mb: 2,
              }}
            >
              SERVICES
            </Typography>
            {services.map((svc, i) => (
              <Typography
                key={i}
                variant="body2"
                sx={{
                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 400,
                  mb: i < services.length - 1 ? 1 : 0,
                }}
              >
                {svc}
              </Typography>
            ))}
          </Box>

          {/* Terms of Use */}
          <Box
            sx={{
              width: { xs: "100%", md: "auto" },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "0.875rem", md: "1rem" },
                fontFamily: "'Jost',sans-serif",
                fontWeight: 500,
                mb: 2,
              }}
            >
              TERMS OF USE
            </Typography>
            <Link
              href="/privacy-policy"
              color="inherit"
              underline="none"
              variant="body2"
              sx={{
                fontFamily: "Manrope, sans-serif",
                fontSize: { xs: "0.75rem", md: "0.875rem" },
              }}
            >
              Privacy Policy
            </Link>
          </Box>

          {/* Projects */}
          <Box
            sx={{
              width: { xs: "100%", md: "auto" },
              maxWidth: { xs: 370, md: 370 },
              textAlign: { xs: "center", md: "start" },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "0.875rem", md: "1rem" },
                fontFamily: "'Jost',sans-serif",
                fontWeight: 500,
                mb: 2,
              }}
            >
              PROJECTS
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2, // Figma: more gap
                justifyItems: "center",
              }}
            >
              {projects.map((src, idx) => (
                <Box
                  key={idx}
                  component="img"
                  src={src}
                  alt={`Project ${idx + 1}`}
                  sx={{
                    width: { xs: 72, sm: 96 }, // Figma: larger
                    height: { xs: 72, sm: 96 },
                    objectFit: "cover",
                    borderRadius: 3, // Figma: more rounded
                    boxShadow: "0 2px 8px rgba(0,173,180,0.10)", // Figma: subtle shadow
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      {/* Copyright */}
      <Typography
        variant="caption"
        sx={{
          display: "block",
          textAlign: "center",
          color: "rgba(255,255,255,0.7)", // Figma: slightly brighter
          fontFamily: "Manrope, sans-serif",
          fontSize: { xs: "0.7rem", md: "0.85rem" }, // Figma: slightly larger
          py: 3, // Figma: more padding
        }}
      >
        © {new Date().getFullYear()} PanicList. All Rights Reserved.
      </Typography>
    </Box>
  );
}
