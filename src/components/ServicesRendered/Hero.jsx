
import { Box, Container, Typography, useTheme, TextField, Button, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search'; // Using MUI's Search icon

// Assuming this path is correct for your project structure
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
              variant="h2"
              sx={{
                fontFamily: "Jost, sans-serif",
                fontWeight: 700,
                mb: 0,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                lineHeight: 1.1,
              }}
            >
              Services Rendered
            </Typography>



            {/* Search Box */}
            <Box
              sx={{
                mt: 2, // Margin top for spacing
                width: { xs: "100%", sm: "auto" }, // Full width on small screens, auto on larger
                maxWidth: 400, // Max width for the search box
                mx: { xs: "auto", md: "0" }, // Center on small screens, left-align on larger
                display: 'flex',
                alignItems: 'center',
                gap: 1, // Space between input and button
              }}
            >
              <TextField
                variant="outlined"
                placeholder="Search for Services..."
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "50px",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      borderColor: "transparent",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "transparent",
                      boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "rgb(0, 0, 0)", // Black text
                    py: 1.5,
                    px: 2,
                    "&::placeholder": {
                      color: "rgb(0, 0, 0,0.6)", // Black placeholder
                      opacity: 1,
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          color: theme.palette.common.white,
                          "&:hover": {
                            bgcolor: theme.palette.primary.dark,
                          },
                          borderRadius: "50%",
                          p: 1,
                        }}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />




            </Box>
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
              → Services Rendered
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
