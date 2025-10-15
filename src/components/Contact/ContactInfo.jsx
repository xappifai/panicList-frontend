import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function ContactInfo() {
  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        py: 8,
        px: 2,
        backgroundColor: "#f9fafb",
        display: "flex", // Added to center content
        flexDirection: "column", // Added to center content
        alignItems: "center", // Added to center content
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center" justifyContent="center"> {/* Added justifyContent to center grid */}
          {/* Left side - Heading and Contact Info */}
          <Grid item xs={12} lg={6}>
            <Box
              sx={{
                mb: 4,
                textAlign: "center", // Centered for all screen sizes
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // Centered for all screen sizes
              }}
            >
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  fontWeight: "bold",
                  color: "#111827",
                  lineHeight: 1.2,
                  mb: 1,
                }}
              >
                Have Some Trouble?
              </Typography>
              <Typography
                variant="h3"
                component="h3"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  fontWeight: "bold",
                  color: "#111827",
                  lineHeight: 1.2,
                  mb: 1,
                }}
              >
                We&apos;ve Got You
              </Typography>
              <Typography
                variant="h3"
                component="h3"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  fontWeight: "bold",
                  color: "#111827",
                  lineHeight: 1.2,
                }}
              >
                Covered!
              </Typography>
            </Box>
            {/* Contact Information - Mobile: Stack vertically, Desktop: 2x2 Grid */}
            <Box
              sx={{
                maxWidth: 600,
                mx: "auto", // Centered for all screen sizes
              }}
            >
              <Grid
                container
                spacing={4}
                sx={{
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "center", // Centered contact info grid
                }}
              >
                {/* Phone */}
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", lg: "row" },
                      alignItems: "center", // Centered for all screen sizes
                      gap: 2,
                      textAlign: "center", // Centered for all screen sizes
                    }}
                  >
                    <PhoneIcon
                      sx={{
                        color: "#6b7280",
                        fontSize: 24,
                        minWidth: 24,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#6b7280",
                          fontWeight: 500,
                          mb: 0.5,
                        }}
                      >
                        Contact Phone
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#111827",
                          fontWeight: 600,
                          fontSize: "1.1rem",
                        }}
                      >
                        +55 (9900) 666 22
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                {/* Email */}
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", lg: "row" },
                      alignItems: "center", // Centered for all screen sizes
                      gap: 2,
                      textAlign: "center", // Centered for all screen sizes
                    }}
                  >
                    <EmailIcon
                      sx={{
                        color: "#6b7280",
                        fontSize: 24,
                        minWidth: 24,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#6b7280",
                          fontWeight: 500,
                          mb: 0.5,
                        }}
                      >
                        Contact Mail
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#111827",
                          fontWeight: 600,
                          fontSize: "1.1rem",
                        }}
                      >
                        info.kali@gmail.com
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                {/* Location */}
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", lg: "row" },
                      alignItems: "center", // Centered for all screen sizes
                      gap: 2,
                      textAlign: "center", // Centered for all screen sizes
                    }}
                  >
                    <LocationOnIcon
                      sx={{
                        color: "#6b7280",
                        fontSize: 24,
                        minWidth: 24,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#6b7280",
                          fontWeight: 500,
                          mb: 0.5,
                        }}
                      >
                        Contact Location
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#111827",
                          fontWeight: 600,
                          fontSize: "1.1rem",
                          mb: 0.5,
                        }}
                      >
                        18/2, Topkhana Road, Australia.
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#111827",
                          fontWeight: 600,
                          fontSize: "1.1rem",
                        }}
                      >
                        27 Division St, New York, USA
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                {/* Office Time */}
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", lg: "row" },
                      alignItems: "center", // Centered for all screen sizes
                      gap: 2,
                      textAlign: "center", // Centered for all screen sizes
                    }}
                  >
                    <AccessTimeIcon
                      sx={{
                        color: "#6b7280",
                        fontSize: 24,
                        minWidth: 24,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#6b7280",
                          fontWeight: 500,
                          mb: 0.5,
                        }}
                      >
                        Office Time
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#111827",
                          fontWeight: 600,
                          fontSize: "1.1rem",
                          mb: 0.5,
                        }}
                      >
                        Mon-Fri: 7.00 - 22.00
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#111827",
                          fontWeight: 600,
                          fontSize: "1.1rem",
                        }}
                      >
                        Sat-Sun: 9.00 - 20.00
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          {/* Right side - Illustration */}
          <Grid item xs={12} lg={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center", // Centered for all screen sizes
              }}
            >
              <Box sx={{ position: "relative", width: "100%", maxWidth: 500 }}>
                <Box
                  component="img"
                  src="src\assets\images\Contact\Customer Support Ilustration.png" // Placeholder image
                  alt="Customer support illustration"
                  sx={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
