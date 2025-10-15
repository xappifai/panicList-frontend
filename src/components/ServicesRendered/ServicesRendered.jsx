import React from "react";
import { Box, Typography, Card, CardMedia, CardContent, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/system";

//Images
import service1 from "../../assets/images/ServicesRendered/Service Rendered 1.png";
import service2 from "../../assets/images/ServicesRendered/Service Rendered 2.png";
import service3 from "../../assets/images/ServicesRendered/Service Rendered 3.png";
import service4 from "../../assets/images/ServicesRendered/Service Rendered 4.png";
import service5 from "../../assets/images/ServicesRendered/Service Rendered 5.png";
import service6 from "../../assets/images/ServicesRendered/Service Rendered 6.png";
import ContactMan from "../../assets/images/ServicesRendered/Contact Man.png";

//Icons
import serviceIcon from "../../assets/icons/ServicesRendered/Service Icon.png";



// Define a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#00BCD4",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
  },
  typography: {
    h2: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#333333",
      textAlign: "center",
      marginBottom: "1rem",
    },
    body1: {
      fontSize: "1.125rem",
      color: "#666666",
      textAlign: "center",
      maxWidth: "700px",
      margin: "0 auto 3rem auto",
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 700,
      color: "#333333",
      marginTop: "1rem",
      marginBottom: "0.5rem",
    },
    body2: {
      fontSize: "1rem",
      color: "#666666",
      marginBottom: "1rem",
    },
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          paddingBottom: "1rem",
          position: "relative",
          overflow: "visible",
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          borderRadius: "16px 16px 0 0",
          height: 200,
          width: "100%",
          objectFit: "cover",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
        containedPrimary: {
          backgroundColor: "#00BCD4",
          color: "white",
          "&:hover": {
            backgroundColor: "#00A0B0",
          },
        },
        textPrimary: {
          color: "#00BCD4",
          fontWeight: 700,
          "&:hover": {
            backgroundColor: "transparent",
            textDecoration: "underline",
          },
        },
      },
    },
  },
});

const IconContainer = styled(Box)(() => ({
  position: "absolute",
  top: "150px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "white",
  borderRadius: "50%",
  padding: "15px",
  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
}));

const ServicesRendered = () => {
  const services = [
    {
      image: service1,
      title: "Pipe Installation",
      description: "Professional installation of durable pipelines for homes and businesses.",
    },
    {
      image: service2,
      title: "Pipe Installation",
      description: "Professional installation of durable pipelines for homes and businesses.",
    },
    {
      image: service3,
      title: "Pipe Installation",
      description: "Professional installation of durable pipelines for homes and businesses.",
    },
    {
      image: service4,
      title: "Pipe Installation",
      description: "Professional installation of durable pipelines for homes and businesses.",
    },
    {
      image: service5,
      title: "Pipe Installation",
      description: "Professional installation of durable pipelines for homes and businesses.",
    },
    {
      image: service6,
      title: "Pipe Installation",
      description: "Professional installation of durable pipelines for homes and businesses.",
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box
        component="section"
        sx={{
          py: 8,
          px: 2,
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h2" component="h1">
          Services Rendered
        </Typography>
        <Typography variant="body1" sx={{ mb: 6 }}>
          From emergency repairs to complete installations, we provide fast, professional plumbing
          services designed to keep your home and business running smoothly
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 4,
            maxWidth: "1200px",
            width: "100%",
            justifyContent: "center",
          }}
        >
          {services.map((service, index) => (
            <Card key={index} sx={{ maxWidth: 345, width: "100%", mx: "auto" }}>
              <CardMedia
                component="img"
                src={service.image}
                alt={service.title}
                sx={{ borderRadius: "16px 16px 0 0", objectFit: "cover" }}
              />
              <IconContainer>
                <img
                   src={serviceIcon}
                  alt="Plumbing Icon"
                  width={48}
                  height={48}
                />
              </IconContainer>
              <CardContent sx={{ pt: "60px" }}>
                <Typography variant="h6" component="div">
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.description}
                </Typography>
                <Button variant="text" color="primary" sx={{ mt: 2 }}>
                  View Services
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Button variant="contained" color="primary" sx={{ mt: 8, px: 4, py: 1.5 }}>
          View More
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default ServicesRendered;
