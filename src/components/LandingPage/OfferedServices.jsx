// components/OfferedServices.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import OfferedServicesCard from "./OfferedServicesCard";
import plumbingImage from "../../assets/images/LandingPage/plumbing.jpg";
import electricalImage from "../../assets/images/LandingPage/electrical-services.jpg";
import roofingImage from "../../assets/images/LandingPage/roofing.jpg";
import tutoringImage from "../../assets/images/LandingPage/tutoring.jpg";
import accountingImage from "../../assets/images/LandingPage/accounting-services.jpg";
import movingImage from "../../assets/images/LandingPage/moving-services.jpg";
import leftBlob from "../../assets/images/LandingPage/left-blob.png";
import rightBlob from "../../assets/images/LandingPage/right-blob.png";

const OfferedServices = () => {
  const handleReadMore = (service) => {
    console.log(`Read more about ${service}`);
  };

  const services = [
    {
      title: "Plumbing Services",
      image: plumbingImage,
      description:
        "Pipe repairs, leak detection, installation of fixtures, and water heater services.",
    },
    {
      title: "Electrical Services",
      image: electricalImage,
      description:
        "Wiring, lighting installations, electrical panel upgrades, circuit repairs.",
    },
    {
      title: "Roofing",
      image: roofingImage,
      description:
        "Roof repairs, replacements, inspections, and installations.",
    },
    {
      title: "Tutoring",
      image: tutoringImage,
      description:
        "Private lessons for subjects like math, science, languages, and music.",
    },
    {
      title: "Accounting & Tax Services",
      image: accountingImage,
      description:
        "Bookkeeping, tax preparation, financial consulting, and auditing.",
    },
    {
      title: "Moving Services",
      image: movingImage,
      description:
        "Residential and commercial moving, packing, and storage solutions.",
    },
  ];

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        py: { xs: 6, md: 12 },
        px: { xs: 2, md: 6 },
        overflow: "hidden",
      }}
    >
      {/* decorative blobs */}
      <Box
        component="img"
        src={leftBlob}
        alt=""
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0.3,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <Box
        component="img"
        src={rightBlob}
        alt=""
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          opacity: 0.3,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Section header */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          mb: { xs: 4, md: 6 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 900, // Figma: bolder
            color: "primary.dark",
            mb: 1.5, // Figma: more space
            fontSize: { xs: "2rem", md: "2.5rem" }, // Figma: larger
            letterSpacing: "-0.5px", // Figma: tighter
          }}
        >
          Best Service We Offer
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 400,
            color: "text.secondary",
            maxWidth: 600,
            mx: "auto",
            fontSize: "1.1rem", // Figma: slightly larger
            lineHeight: 1.7, // Figma: more readable
            mb: 2, // Figma: more space below
          }}
        >
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s.
        </Typography>
      </Box>

      {/* Grid of cards, constrained width and centered */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          mx: "auto",
          display: "grid",
          gap: { xs: 3, md: 5 }, // Figma: more gap
          justifyItems: "center",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(3, 1fr)",
          },
          pb: { xs: 2, md: 4 }, // Figma: more padding bottom
        }}
      >
        {services.map(({ title, image, description }) => (
          <OfferedServicesCard
            key={title}
            image={image}
            title={title}
            description={description}
            onReadMore={() => handleReadMore(title)}
            sx={{
              borderRadius: "18px", // Figma: more rounded
              boxShadow: "0 4px 24px rgba(33,40,50,0.08)", // Figma: subtle shadow
              minHeight: 320, // Figma: consistent card height
              maxWidth: 340, // Figma: constrain width
              p: 3, // Figma: more padding
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default OfferedServices;
