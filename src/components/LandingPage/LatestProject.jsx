// components/LatestProject.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import project1 from "../../assets/images/project1.jpg";
import project2 from "../../assets/images/project2.jpg";
import project3 from "../../assets/images/project3.jpg";
import project4 from "../../assets/images/project4.jpg";
import project5 from "../../assets/images/project5.jpg";
import project6 from "../../assets/images/project6.jpg";
import CustomButton from "../CustomButton";

const LatestProject = () => {
  const images = [project1, project2, project3, project4, project5, project6];

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 6 },
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 700,
            color: "primary.dark",
            mb: 1,
          }}
        >
          Our Latest Project
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 400,
            color: "text.secondary",
            maxWidth: 600,
            mx: "auto",
          }}
        >
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. has been the industry’s standard dummy text ever since the
          1500s.
        </Typography>
      </Box>

      {/* Image grid */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
        }}
      >
        {images.map((src, idx) => (
          <Box
            component="img"
            key={idx}
            src={src}
            alt={`Project ${idx + 1}`}
            sx={{
              width: "100%",
              height: { xs: idx < 3 ? 200 : 150, sm: idx < 3 ? 300 : 200 },
              objectFit: "cover",
              borderRadius: 2,
            }}
          />
        ))}
      </Box>

      {/* Call to action */}
      <Box sx={{ textAlign: "center", mt: { xs: 4, md: 6 } }}>
        <CustomButton
          label="View All Project"
          width="180px"
          height="48px"
          backgroundColor="primary.main"
          textColor="#fff"
          onClick={() => {
            /* your handler */
          }}
        />
      </Box>
    </Box>
  );
};

export default LatestProject;
