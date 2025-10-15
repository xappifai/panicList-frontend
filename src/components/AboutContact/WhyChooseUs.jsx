// components/WhyChooseUs.jsx
import React from "react";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import whyImage from "../../assets/images/AboutContact/why-choose-us.jpg";

const WhyChooseUs = () => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 12 },
        bgcolor: "#FAFAFA",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 4,
          }}
        >
          {/* IMAGE */}
          <Box
            component="img"
            src={whyImage}
            alt="Why choose us"
            sx={{
              width: { xs: "100%", md: "50%" },
              borderRadius: 0,
              boxShadow: 3,
            }}
          />

          {/* TEXT */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontFamily: "Manrope, sans-serif", // header in Manrope
                fontWeight: 900, // heavier weight
                fontSize: { xs: "2.5rem", md: "3.5rem" }, // increased size
                mb: 3,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Why Choose Us To
              <br /> Join Our Work?
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontFamily: "Jost, sans-serif", // body in Jost
                mb: 3,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Nulla facilisi. Nullam congue, tortor id finibus posuere, risus
              magna convallis massa, sit amet eu est tellus vitae dui. Proin
              hendrerit diam a commodo aliquam. In vitae interdum odio. Duis
              sitam nisi eget odio facilisis lacinia.
            </Typography>

            <List disablePadding sx={{ mb: 4, px: 0 }}>
              {[
                "One-time security check fee: $99.95",
                "Elite membership fee: $999.95 per month",
                "Coast-to-coast domestic flights: from $3,799.95",
              ].map((text) => (
                <ListItem key={text} disableGutters sx={{ pl: 0 }}>
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                      fontFamily: "Jost, sans-serif", // list items in Jost
                      variant: "body1",
                      component: "span",
                      sx: {
                        display: { xs: "block", md: "inline" },
                        textAlign: { xs: "center", md: "left" },
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>

            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Button
                variant="contained"
                sx={{
                  fontFamily: "Jost, sans-serif", // button text in Jost
                  backgroundColor: "primary.main",
                  color: "#fff",
                  width: 200,
                  height: 70,
                  textTransform: "none",
                  borderRadius: "50px",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    backgroundColor: "primary.main",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                → View All
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default WhyChooseUs;
