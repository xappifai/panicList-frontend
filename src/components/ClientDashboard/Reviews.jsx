// src/components/ClientDashboard/Reviews.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Rating,
} from "@mui/material";
import {
  Add as AddIcon,
  AccessTime,
} from "@mui/icons-material";
import { feedbackAPI } from "../../services/apiService";
import { useUser } from "../../contexts/UserContext";

export default function Reviews() {
  const { user } = useUser();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch user's feedback
  useEffect(() => {
    console.log('Reviews useEffect triggered, user:', user);
    console.log('User UID:', user?.uid);
    
    const fetchFeedbacks = async () => {
      if (!user?.uid) {
        console.log('No user UID, skipping feedback fetch');
        return;
      }
      
      console.log('Starting to fetch feedbacks...');
      try {
        setLoading(true);
        setError("");
        
        const response = await feedbackAPI.getClientFeedbacks(1, 10);
        console.log('Feedback API response:', response);
        
        if (response.success) {
          setFeedbacks(response.data || []);
          console.log('Feedbacks set:', response.data);
        } else {
          setError(response.message || "Failed to fetch feedback");
        }
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Failed to fetch your reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [user?.uid]);


  const handleAddReview = () => {
    // Handle add review logic
    console.log("Adding new review...");
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      {/* Header */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        mb: 4 
      }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1F2937",
          }}
        >
          My Reviews
        </Typography>
        
        <Box sx={{ display: "flex", gap: 2 }}>
       
          
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddReview}
            sx={{
              backgroundColor: "#34D399",
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#10B981",
              },
            }}
          >
            Add Review
          </Button>
        </Box>
      </Box>



      {/* Reviews Section */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#1F2937",
            mb: 3,
          }}
        >
          My Reviews ({feedbacks.length})
        </Typography>


        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : feedbacks.length === 0 ? (
          <Card
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: "12px",
              border: "1px solid #e0e0e0",
              backgroundColor: "white",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: "#666" }}>
              No reviews yet
            </Typography>
            <Typography variant="body2" sx={{ color: "#999" }}>
              You haven't submitted any reviews yet. Complete a service to leave a review!
            </Typography>
          </Card>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {feedbacks.map((feedback) => (
              <Card
                key={feedback.id}
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 3,
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  width: "100%",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  {/* Service Info */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "#333",
                        mb: 0.5,
                      }}
                    >
                      {feedback.serviceName || "Service"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        fontSize: "0.85rem",
                      }}
                    >
                      Provider: {feedback.providerName || "Provider"}
                    </Typography>
                  </Box>

                  {/* Rating */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Rating
                      value={feedback.rating}
                      readOnly
                      sx={{
                        "& .MuiRating-iconFilled": {
                          color: "#ffc107",
                        },
                        "& .MuiSvgIcon-root": {
                          fontSize: "1.1rem",
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        ml: 1,
                        color: "#666",
                        fontWeight: 500,
                      }}
                    >
                      {feedback.rating}/5
                    </Typography>
                  </Box>

                  {/* Comment */}
                  {feedback.comment && (
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 2,
                        lineHeight: 1.6,
                        color: "#666",
                        fontSize: "0.9rem",
                        fontStyle: "italic",
                        backgroundColor: "#f8f9fa",
                        p: 2,
                        borderRadius: "8px",
                      }}
                    >
                      "{feedback.comment}"
                    </Typography>
                  )}

                  {/* Date */}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AccessTime sx={{ fontSize: "0.9rem", color: "#999", mr: 0.5 }} />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#999",
                          fontSize: "0.75rem",
                        }}
                      >
                        {feedback.createdAt ? new Date(feedback.createdAt.toDate ? feedback.createdAt.toDate() : feedback.createdAt).toLocaleDateString() : "Unknown date"}
                      </Typography>
                    </Box>
                    <Chip
                      label="Submitted"
                      size="small"
                      sx={{
                        backgroundColor: "#e8f5e8",
                        color: "#2e7d32",
                        fontSize: "0.7rem",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

    </Box>
  );
}
