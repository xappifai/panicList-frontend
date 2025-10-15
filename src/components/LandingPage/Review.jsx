"use client"
import { Box, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"

import plumbingImage from "../../assets/images/LandingPage/plumbing.jpg"
import electricalImage from "../../assets/images/LandingPage/electrical-services.jpg"
import roofingImage from "../../assets/images/LandingPage/roofing.jpg"
import tutoringImage from "../../assets/images/LandingPage/tutoring.jpg"
import accountingImage from "../../assets/images/LandingPage/accounting-services.jpg"
import movingImage from "../../assets/images/LandingPage/moving-services.jpg"
import leftBlob from "../../assets/images/LandingPage/left-blob.png"
import rightBlob from "../../assets/images/LandingPage/right-blob.png"
import ReviewCategoryCard from "../ReviewCard"

const ReviewCategories = () => {
  const navigate = useNavigate()

  const handleViewReviews = (category) => {
    // Navigate to reviews page with category filter - requires subscription
    navigate(`/reviews?category=${category.toLowerCase().replace(" ", "-")}`)
  }

  const reviewCategories = [
    {
      title: "Plumbing Reviews",
      image: plumbingImage,
      description: "Read reviews about pipe repairs, leak detection, fixture installations, and water heater services.",
      reviewCount: "150+ Reviews",
    },
    {
      title: "Electrical Reviews",
      image: electricalImage,
      description: "Browse reviews for wiring, lighting installations, electrical panel upgrades, and circuit repairs.",
      reviewCount: "120+ Reviews",
    },
    {
      title: "Roofing Reviews",
      image: roofingImage,
      description: "Check reviews for roof repairs, replacements, inspections, and installations.",
      reviewCount: "95+ Reviews",
    },
    {
      title: "Tutoring Reviews",
      image: tutoringImage,
      description: "View reviews for private lessons in math, science, languages, and music.",
      reviewCount: "200+ Reviews",
    },
    {
      title: "Accounting Reviews",
      image: accountingImage,
      description: "Read reviews about bookkeeping, tax preparation, financial consulting, and auditing.",
      reviewCount: "80+ Reviews",
    },
    {
      title: "Moving Reviews",
      image: movingImage,
      description: "Browse reviews for residential and commercial moving, packing, and storage solutions.",
      reviewCount: "110+ Reviews",
    },
  ]

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
            fontWeight: 900,
            color: "primary.dark",
            mb: 1.5,
            fontSize: { xs: "2rem", md: "2.5rem" },
            letterSpacing: "-0.5px",
          }}
        >
          Browse Reviews by Service
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 400,
            color: "text.secondary",
            maxWidth: 600,
            mx: "auto",
            fontSize: "1.1rem",
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Find authentic reviews for different services from verified customers. Access detailed reviews with a paid
          subscription to make informed decisions.
        </Typography>
      </Box>

      {/* Grid of review category cards */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          mx: "auto",
          display: "grid",
          gap: { xs: 3, md: 5 },
          justifyItems: "center",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(3, 1fr)",
          },
          pb: { xs: 2, md: 4 },
        }}
      >
        {reviewCategories.map(({ title, image, description, reviewCount }) => (
          <ReviewCategoryCard
            key={title}
            image={image}
            title={title}
            description={description}
            reviewCount={reviewCount}
            onViewReviews={() => handleViewReviews(title)}
            sx={{
              borderRadius: "18px",
              boxShadow: "0 4px 24px rgba(33,40,50,0.08)",
              minHeight: 320,
              maxWidth: 340,
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              cursor: "pointer",
              transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 32px rgba(33,40,50,0.12)",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

export default ReviewCategories
