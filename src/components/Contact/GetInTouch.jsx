import React from "react";
import { Box, Container, Typography, TextField, Button } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const contactItems = [
  { icon: <PhoneIcon />, label: "Contact Phone", value: ["+55 (9900) 666 22"] },
  {
    icon: <EmailIcon />,
    label: "Contact Mail",
    value: ["info.kali@gmail.com"],
  },
  {
    icon: <LocationOnIcon />,
    label: "Contact Location",
    value: ["18/2, Topkhana Road, Australia.", "27 Division St, New York, USA"],
  },
  {
    icon: <AccessTimeIcon />,
    label: "Office Time",
    value: ["Mon-Fri: 7.00 - 22.00", "Sat-Sun: 9.00 - 20.00"],
  },
];

const GetInTouch = () => (
  <Box component="section" sx={{ py: { xs: 6, md: 12 }, bgcolor: "#fff" }}>
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* LEFT: Contact Info */}
        <Box sx={{ flex: 1, pr: { md: 4 }, mb: { xs: 6, md: 0 } }}>
          <Typography
            variant="overline"
            sx={{
              color: "primary.main",
              mb: 1,
              display: "block",
              fontFamily: "'Jost', sans-serif",
              fontWeight: 400,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            CONTACT US
          </Typography>

          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 900,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              mb: 3,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Let's Get In Touch
          </Typography>

          <Typography
            component="p"
            sx={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 400,
              fontSize: "20px",
              color: "#666666",
              mb: 3,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Whether it's a service request, inquiry, or partnership — we're just one message away. Our team is always ready to assist with expert guidance, friendly support, and fast responses.
          </Typography>


        </Box>

        {/* RIGHT: Contact Form */}
        <Box
          component="form"
          sx={{
            width: { xs: "100%", md: "350px" },
            p: { xs: 2, md: 4 },
            bgcolor: "grey.50",
            borderRadius: 2,
          }}
          noValidate
          autoComplete="off"
        >
          <Typography
            variant="h6"
            sx={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, mb: 2 }}
          >
            Get In Touch
          </Typography>
          {["Your Name", "Your Email", "Phone Number"].map((label) => (
            <TextField
              key={label}
              label={label}
              variant="standard"
              fullWidth
              sx={{
                mb: 3,
                "& .MuiInputBase-input": {
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 600,
                  color: "#757575",
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "rgba(0, 0, 0, 0.42)",
                },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottomColor: "#757575",
                },
              }}
            />
          ))}
          <TextField
            label="Your Message"
            variant="standard"
            fullWidth
            multiline
            rows={4}
            sx={{
              mb: 4,
              "& .MuiInputBase-input": {
                fontFamily: "Manrope, sans-serif",
                fontWeight: 600,
                color: "#757575",
              },
              "& .MuiInput-underline:before": {
                borderBottomColor: "rgba(0, 0, 0, 0.42)",
              },
              "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                borderBottomColor: "#757575",
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              textTransform: "none",
              borderRadius: "50px",
              py: 1.5,
              fontFamily: "'Jost', sans-serif",
              fontWeight: 500,
              color: "common.white",
              "&:hover": { bgcolor: "primary.main", color: "common.white" },
            }}
          >
            → Send Message
          </Button>
        </Box>
      </Box>
    </Container>
  </Box>
);

export default GetInTouch;
