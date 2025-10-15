import React from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import heroBg from "../../assets/images/HelpAndFaq/help-hero.jpg";

const Hero = () => {
  return (
    <Box
      component="section"
      sx={{
        fontFamily: "'Manrope', sans-serif",
        position: "relative",
        height: { xs: 300, md: 500 },
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          bgcolor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          color: "common.white",
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Help and support
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Search questions or useful articles
        </Typography>

        <Box
          sx={{
            display: "flex",
            mx: "auto",
            width: { xs: "100%", sm: "80%", md: "60%" },
            boxShadow: 3,
            borderRadius: 2,
            overflow: "hidden",
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          <TextField
            placeholder="What are you looking for?"
            variant="outlined"
            fullWidth
            sx={{
              bgcolor: "common.white",
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px 0 0 8px",
              },
              "& .MuiOutlinedInput-input": {
                color: "#6C757D",
                fontFamily: "'Manrope', sans-serif",
                py: 2,
                "&::placeholder": {
                  color: "#6C757D",
                  opacity: 1,
                  fontFamily: "'Manrope', sans-serif",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#6C757D" }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            sx={{
              fontFamily: "'Manrope', sans-serif",
              py: 2,
              px: 4,
              textTransform: "none",
              whiteSpace: "nowrap",
              borderRadius: "0 8px 8px 0",
              background: "linear-gradient(90deg, #00ADB4 0%, #1E1E1E 100%)",
              boxShadow: "none",
              color: "common.white",
              "&:hover": {
                background: "linear-gradient(90deg, #00e0c8 0%, #2e2e2e 100%)",
                color: "common.white",
              },
            }}
          >
            Search
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
