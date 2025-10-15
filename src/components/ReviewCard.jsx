"use client"
import { Box, Typography, Button, Chip } from "@mui/material"
import { Star, Lock } from "@mui/icons-material"

const ReviewCategoryCard = ({ image, title, description, reviewCount, onViewReviews, sx = {} }) => {
  return (
    <Box
      onClick={onViewReviews}
      sx={{
        ...sx,
        "&:active": {
          transform: "scale(0.98)",
        },
      }}
    >
      {/* Service Image */}
      <Box
        sx={{
          width: "100%",
          height: 180,
          borderRadius: "12px",
          overflow: "hidden",
          mb: 2,
          position: "relative",
        }}
      >
        <Box
          component="img"
          src={image}
          alt={title}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Review count overlay */}
        <Chip
          icon={<Star sx={{ fontSize: "16px !important" }} />}
          label={reviewCount}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            color: "primary.dark",
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        />
      </Box>

      {/* Category Title */}
      <Typography
        variant="h6"
        sx={{
          fontFamily: "Manrope, sans-serif",
          fontWeight: 700,
          color: "primary.dark",
          mb: 1,
          fontSize: "1.25rem",
          textAlign: "center",
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      <Typography
        variant="body2"
        sx={{
          fontFamily: "Manrope, sans-serif",
          fontWeight: 400,
          color: "text.secondary",
          lineHeight: 1.6,
          mb: 2,
          flex: 1,
          textAlign: "center",
          fontSize: "0.95rem",
        }}
      >
        {description}
      </Typography>

      {/* View Reviews Button */}
      <Button
        variant="contained"
        startIcon={<Lock sx={{ fontSize: "16px !important" }} />}
        sx={{
          fontFamily: "Manrope, sans-serif",
          fontWeight: 600,
          textTransform: "none",
          borderRadius: "8px",
          px: 3,
          py: 1,
          fontSize: "0.9rem",
          backgroundColor: "primary.main",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        }}
      >
        View Reviews
      </Button>

      {/* Subscription notice */}
      <Typography
        variant="caption"
        sx={{
          fontFamily: "Manrope, sans-serif",
          color: "text.secondary",
          textAlign: "center",
          mt: 1,
          fontSize: "0.75rem",
        }}
      >
        Subscription required
      </Typography>
    </Box>
  )
}

export default ReviewCategoryCard
