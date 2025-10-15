import React from "react";
import { Box, Container, Typography } from "@mui/material";
import mapImage from "../../assets/images/AboutContact/map.png";

const MapSection = () => {
  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        height: { xs: 200, md: 400 },
        backgroundImage: `url(${mapImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Optionally add overlay or markers here */}
    </Box>
  );
};

export default MapSection;
