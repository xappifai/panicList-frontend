// components/Stats.jsx
import React from "react";
import { Box, Container, Typography } from "@mui/material";

const statsData = [
  { value: "+12K", label: "Our Active Members" },
  { value: "+1.5K", label: "Our Total Providers" },
  { value: "+14", label: "Our Winning Award" },
  { value: "+49", label: "Our Team Member" },
];

const Stats = () => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 4, md: 8 },
        bgcolor: "background.paper",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          borderTop: "1px solid rgba(37,26,55,0.1)", // #251A37 at 10% opacity
          pt: 4, // add some padding-top so content isn't flush against the border
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: { xs: "center", sm: "left" },
            gap: 4,
          }}
        >
          {statsData.map((item, idx) => (
            <Box key={idx}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 700,
                  fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
                }}
              >
                {item.value}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  fontFamily: "Jost, sans-serif",
                  color: "text.secondary",
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
              >
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Stats;
