// src/components/AdminDashboard/ReviewFeedback.jsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  Rating,
} from "@mui/material";
import { Star as StarIcon, LocalFireDepartment as FlameIcon } from "@mui/icons-material";

const ReviewFeedback = () => {
  const reviews = [
    {
      id: 1,
      name: "Alexandra Della",
      service: "Cleaning",
      review: "The work was amazing but didn't expect the delay...",
      rating: 8.9,
      avatar: "A",
    },
    {
      id: 2,
      name: "Alexandra Della",
      service: "Cleaning",
      review: "The work was amazing but didn't expect the delay...",
      rating: 8.9,
      avatar: "A",
    },
    {
      id: 3,
      name: "Alexandra Della",
      service: "Cleaning",
      review: "The work was amazing but didn't expect the delay...",
      rating: 8.9,
      avatar: "A",
    },
    {
      id: 4,
      name: "Alexandra Della",
      service: "Cleaning",
      review: "The work was amazing but didn't expect the delay...",
      rating: 8.9,
      avatar: "A",
    },
  ];

  return (
    <Card
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 3,
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        border: "1px solid #E5E7EB",
        height: "100%",
        minHeight: { xs: "auto", lg: "400px" },
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#1F2937",
            fontSize: "1.125rem",
            mb: 3,
          }}
        >
          Review Feedback
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
          {reviews.map((review) => (
            <Box
              key={review.id}
              sx={{
                border: "1px solid #E5E7EB",
                borderRadius: 2,
                p: 2,
                backgroundColor: "#F9FAFB",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#00ADB4",
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  {review.avatar}
                </Avatar>
                
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "#1F2937",
                        fontSize: "0.875rem",
                      }}
                    >
                      {review.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <FlameIcon sx={{ fontSize: 12, color: "#F59E0B" }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#6B7280",
                          fontSize: "0.75rem",
                          backgroundColor: "#F3F4F6",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        {review.service}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#374151",
                      fontSize: "0.875rem",
                      mb: 1,
                      lineHeight: 1.4,
                    }}
                  >
                    {review.review}
                  </Typography>
                  
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <StarIcon sx={{ color: "#F59E0B", fontSize: 16 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#1F2937",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                      }}
                    >
                      {review.rating}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#00ADB4",
            color: "white",
            textTransform: "none",
            fontWeight: 600,
            py: 1.5,
            "&:hover": {
              backgroundColor: "#009DA4",
            },
          }}
        >
          MANAGE REVIEWS
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReviewFeedback;
