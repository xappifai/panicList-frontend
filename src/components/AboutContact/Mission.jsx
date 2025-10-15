"use client"
import { Box, Container, Typography, LinearProgress, useTheme } from "@mui/material"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import ConstructionIcon from "@mui/icons-material/Construction"
import missionImage from "../../assets/images/AboutContact/mission.jpg"
import bricksImage from "../../assets/images/AboutContact/bricks.png"

const Mission = () => {
  const theme = useTheme()

  return (
    <Box component="section" sx={{ py: { xs: 4, sm: 6, md: 8, lg: 12 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            alignItems: { xs: "center", lg: "flex-start" },
            gap: { xs: 4, md: 6, lg: 0 },
            position: "relative",
          }}
        >
          {/* Decorative Elements - Hidden on mobile, visible on desktop */}
          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "flex-start",
              minWidth: 60,
              mr: 2,
              height: { lg: 340, xl: 380 },
              position: "relative",
            }}
          >
            {/* Dotted box with play button */}
            <Box
              sx={{
                width: { lg: 100, xl: 120 },
                height: { lg: 100, xl: 120 },
                backgroundImage: "radial-gradient(#e0e0e0 1.5px, transparent 1.5px)",
                backgroundSize: "10px 10px",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                position: "relative",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: { lg: 40, xl: 44 },
                  height: { lg: 40, xl: 44 },
                  borderRadius: "50%",
                  background: "#222",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: 2,
                  mr: { lg: 6, xl: 8 },
                  cursor: "pointer",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                <PlayArrowIcon sx={{ color: "#fff", fontSize: { lg: 20, xl: 22 } }} />
              </Box>
            </Box>

            {/* Brick bar below dotted box */}
            <Box
              component="img"
              src={bricksImage}
              alt="bricks accent"
              sx={{
                width: { lg: 32, xl: 36 },
                height: { lg: 180, xl: 200 },
                borderRadius: 3,
                boxShadow: 1,
                objectFit: "cover",
                mt: 2,
              }}
            />
          </Box>

          {/* Main Image Section */}
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: { xs: "center", lg: "flex-start" },
              width: { xs: "100%", sm: "auto" },
              maxWidth: { xs: "100%", sm: "400px", lg: "none" },
            }}
          >
            <Box
              component="img"
              src={missionImage}
              alt="Our mission"
              sx={{
                width: {
                  xs: "100%",
                  sm: "300px",
                  md: "350px",
                  lg: "320px",
                  xl: "380px",
                },
                height: {
                  xs: "250px",
                  sm: "300px",
                  md: "350px",
                  lg: "340px",
                  xl: "380px",
                },
                objectFit: "cover",
                borderRadius: { xs: 2, md: 3 },
                boxShadow: { xs: 2, md: 3 },
                zIndex: 1,
              }}
            />

            {/* Mobile Play Button Overlay */}
            <Box
              sx={{
                display: { xs: "flex", lg: "none" },
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: 50, sm: 60 },
                height: { xs: 50, sm: 60 },
                borderRadius: "50%",
                background: "rgba(0, 0, 0, 0.7)",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  background: "rgba(0, 0, 0, 0.8)",
                  transform: "translate(-50%, -50%) scale(1.1)",
                },
              }}
            >
              <PlayArrowIcon sx={{ color: "#fff", fontSize: { xs: 24, sm: 28 } }} />
            </Box>
          </Box>

          {/* Content Section */}
          <Box
            sx={{
              flex: 1,
              textAlign: { xs: "center", lg: "left" },
              ml: { lg: 3, xl: 4 },
              width: { xs: "100%", lg: "auto" },
              maxWidth: { xs: "100%", sm: "600px", lg: "none" },
              mx: { xs: "auto", lg: 0 },
            }}
          >
            {/* Main Heading */}
            <Typography
              variant="h3"
              sx={{
                fontFamily: "Jost, sans-serif",
                fontWeight: "bolder",
                mb: { xs: 2, md: 3 },
                fontSize: {
                  xs: "1.8rem",
                  sm: "2.2rem",
                  md: "2.5rem",
                  lg: "2.8rem",
                  xl: "3rem",
                },
                lineHeight: { xs: 1.2, md: 1.3 },
                color: "#333",
              }}
            >
              This Is Our
              <br />
              Mission
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: "Jost, sans-serif",
                color: "primary.main",
                mb: { xs: 2, md: 3 },
                fontStyle: "italic",
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                lineHeight: 1.4,
              }}
            >
              Nullam vel ligula lorem. Phasellus neque EtiI havam neque­retium.
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                fontFamily: "Jost, sans-serif",
                mb: { xs: 3, md: 4 },
                color: "text.secondary",
                fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" },
                lineHeight: { xs: 1.5, md: 1.6 },
                maxWidth: { xs: "100%", lg: "90%" },
              }}
            >
              There are many variations of passage of Lorem Ipsum all items available, but the majority have suffered
              alteration in some form injected humour Nullam.
            </Typography>

            {/* Progress Bar */}
            <Box
              sx={{
                mb: { xs: 3, md: 4 },
                position: "relative",
                width: { xs: "100%", lg: "85%" },
                maxWidth: "400px",
                mx: { xs: "auto", lg: 0 },
              }}
            >
              <LinearProgress
                variant="determinate"
                value={95}
                sx={{
                  height: { xs: 30, sm: 35 },
                  borderRadius: "10px",
                  bgcolor: "grey.300",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: "10px",
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "Jost, sans-serif",
                  position: "absolute",
                  top: "50%",
                  left: { xs: 12, sm: 20 },
                  transform: "translateY(-50%)",
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  whiteSpace: "nowrap",
                }}
              >
                95.00% Work Success
              </Typography>
            </Box>

            {/* Features Section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "center", md: "flex-start" },
                gap: { xs: 3, sm: 4, md: 6 },
                width: "100%",
              }}
            >
              {/* Feature 1 */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: { xs: "center", lg: "flex-start" },
                  textAlign: { xs: "center", lg: "left" },
                  maxWidth: { xs: "280px", md: "none" },
                  flex: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "Jost, sans-serif",
                    color: "text.secondary",
                    mb: { xs: 2, md: 3 },
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    lineHeight: 1.5,
                  }}
                >
                  Fusce maximus turpis in magna cursus, vehicula bibendum sem placerat.
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1.5, md: 2 },
                    justifyContent: { xs: "center", lg: "flex-start" },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#FAFAFA",
                      borderRadius: "50%",
                      p: { xs: 1.2, md: 1.5 },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: { xs: 45, md: 50 },
                      minHeight: { xs: 45, md: 50 },
                    }}
                  >
                    <ConstructionIcon color="primary" sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "Jost, sans-serif",
                        fontWeight: 600,
                        fontSize: { xs: "1rem", md: "1.1rem" },
                        mb: 0.5,
                      }}
                    >
                      Solutions
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: "Jost, sans-serif",
                        color: "text.secondary",
                        fontSize: { xs: "0.75rem", md: "0.8rem" },
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      02 PROJECT
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Feature 2 */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: { xs: "center", lg: "flex-start" },
                  textAlign: { xs: "center", lg: "left" },
                  maxWidth: { xs: "280px", md: "none" },
                  flex: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "Jost, sans-serif",
                    color: "text.secondary",
                    mb: { xs: 2, md: 3 },
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    lineHeight: 1.5,
                  }}
                >
                  Fusce maximus turpis in magna cursus, vehicula bibendum sem placerat.
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1.5, md: 2 },
                    justifyContent: { xs: "center", lg: "flex-start" },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#FAFAFA",
                      borderRadius: "50%",
                      p: { xs: 1.2, md: 1.5 },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: { xs: 45, md: 50 },
                      minHeight: { xs: 45, md: 50 },
                    }}
                  >
                    <ConstructionIcon color="primary" sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "Jost, sans-serif",
                        fontWeight: 600,
                        fontSize: { xs: "1rem", md: "1.1rem" },
                        mb: 0.5,
                      }}
                    >
                      Best Services
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: "Jost, sans-serif",
                        color: "text.secondary",
                        fontSize: { xs: "0.75rem", md: "0.8rem" },
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      04 PROJECT
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Mission
