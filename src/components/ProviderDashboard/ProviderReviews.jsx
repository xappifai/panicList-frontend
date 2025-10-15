import React, { useState, useEffect } from "react";
import ProviderAuthGuard from "./ProviderAuthGuard";
import {
  Box,
  Card,
  Typography,
  LinearProgress,
  Avatar,
  Rating,
  Pagination,
  CircularProgress,
  Alert,
} from "@mui/material";
// removed action/engagement icons per request
import AccessTime from "@mui/icons-material/AccessTime";
import { feedbackAPI } from "../../services/apiService";
import { useUser } from "../../contexts/UserContext";

const RatingBar = ({ stars, percent }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Typography sx={{ width: 12, textAlign: "right", color: "#6B7280", fontSize: 12 }}>{stars}</Typography>
    <LinearProgress
      variant="determinate"
      value={percent}
      sx={{ flex: 1, height: 6, borderRadius: 4, background: "#E5E7EB", "& .MuiLinearProgress-bar": { background: "#00ADB4" } }}
    />
    <Typography sx={{ width: 32, textAlign: "right", color: "#6B7280", fontSize: 12 }}>{percent}%</Typography>
  </Box>
);

const toJsDate = (value) => {
  try {
    if (!value) return null;
    if (typeof value?.toDate === 'function') return value.toDate();
    if (typeof value?.seconds === 'number') return new Date(value.seconds * 1000);
    if (typeof value?._seconds === 'number') return new Date(value._seconds * 1000);
    if (typeof value === 'number') return new Date(value);
    if (typeof value === 'string') return new Date(value);
    return new Date(value);
  } catch {
    return null;
  }
};

const ReviewItem = ({ feedback }) => (
  <Box sx={{ display: "flex", gap: 2, py: 2.5 }}>
    <Avatar sx={{ width: 44, height: 44, backgroundColor: "#00ADB4" }}>
      {feedback.clientName ? feedback.clientName.charAt(0).toUpperCase() : 'C'}
    </Avatar>
    <Box sx={{ flex: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
        <Typography sx={{ fontWeight: 700, color: "#111827" }}>
          {feedback.clientName || "Client"}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <AccessTime sx={{ fontSize: 14, color: "#6B7280" }} />
          <Typography sx={{ color: "#6B7280", fontSize: 12 }}>
            {(() => {
              const d = toJsDate(feedback.createdAt) || toJsDate(feedback.updatedAt);
              return d && !isNaN(d.getTime()) ? d.toLocaleDateString() : 'Unknown date';
            })()}
          </Typography>
        </Box>
      </Box>
      <Typography sx={{ color: "#6B7280", fontSize: 12, mb: 0.5 }}>
        Service: {feedback.serviceName || "Service"}
      </Typography>
      <Rating value={feedback.rating} readOnly size="small" sx={{ my: 0.5, "& .MuiRating-iconFilled": { color: "#00ADB4" } }} />
      {feedback.comment && (
        <Typography sx={{ color: "#374151", lineHeight: 1.6, mt: 1 }}>
          "{feedback.comment}"
        </Typography>
      )}
      {/* action/engagement removed */}
    </Box>
  </Box>
);

export default function ProviderReviews() {
  const { user } = useUser();
  const [page, setPage] = useState(1);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({});

  // Fetch provider's feedback
  useEffect(() => {
    console.log('ProviderReviews useEffect triggered, user:', user);
    console.log('User UID:', user?.uid);
    
    const fetchFeedbacks = async () => {
      if (!user?.uid) {
        console.log('No user UID, skipping feedback fetch');
        return;
      }
      
      console.log('Starting to fetch provider feedbacks...');
      try {
        setLoading(true);
        setError("");
        
        const response = await feedbackAPI.getProviderFeedbacks(user.uid, page, 10);
        console.log('Provider Feedback API response:', response);
        
        if (response.success) {
          setFeedbacks(response.data || []);
          setTotalPages(response.pagination?.totalPages || 1);
          
          // Calculate average rating and distribution
          const ratings = response.data?.map(f => f.rating) || [];
          if (ratings.length > 0) {
            const avg = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
            setAverageRating(avg);
            
            // Calculate distribution
            const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            ratings.forEach(rating => {
              if (distribution.hasOwnProperty(rating)) {
                distribution[rating]++;
              }
            });
            setRatingDistribution(distribution);
          }
          
          console.log('Provider feedbacks set:', response.data);
        } else {
          setError(response.message || "Failed to fetch feedback");
        }
      } catch (err) {
        console.error("Error fetching provider feedback:", err);
        setError("Failed to fetch your reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [user?.uid, page]);

  return (
    <ProviderAuthGuard>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827" }}>
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
          <Card elevation={0} sx={{ p: 4, border: "1px solid #E5E7EB", borderRadius: 2, textAlign: "center" }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#666" }}>
              No reviews yet
            </Typography>
            <Typography variant="body2" sx={{ color: "#999" }}>
              You haven't received any reviews yet. Complete some services to start getting feedback!
            </Typography>
          </Card>
        ) : (
          <>
            <Card elevation={0} sx={{ p: 3, border: "1px solid #E5E7EB", borderRadius: 2 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "220px 1fr" }, gap: 3 }}>
                {/* Summary */}
                <Box>
                  <Typography sx={{ fontSize: 32, fontWeight: 800, color: "#111827", lineHeight: 1 }}>
                    {averageRating.toFixed(1)}
                  </Typography>
                  <Rating value={Math.round(averageRating)} readOnly sx={{ "& .MuiRating-iconFilled": { color: "#00ADB4" } }} />
                  <Typography sx={{ color: "#6B7280", fontSize: 14, mt: 0.5 }}>
                    {feedbacks.length} reviews
                  </Typography>
                </Box>

                {/* Distribution */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {[5, 4, 3, 2, 1].map(stars => {
                    const count = ratingDistribution[stars] || 0;
                    const percent = feedbacks.length > 0 ? Math.round((count / feedbacks.length) * 100) : 0;
                    return <RatingBar key={stars} stars={stars} percent={percent} />;
                  })}
                </Box>
              </Box>
            </Card>

            <Card elevation={0} sx={{ p: 2, border: "1px solid #E5E7EB", borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#111827", px: 1, py: 1.5 }}>All reviews</Typography>
              <Box sx={{ px: 1 }}>
                {feedbacks.map((feedback) => (
                  <ReviewItem key={feedback.id} feedback={feedback} />
                ))}
              </Box>

              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, p) => setPage(p)}
                    size="small"
                    siblingCount={1}
                    boundaryCount={1}
                    sx={{
                      '& .MuiPaginationItem-root': { color: '#6B7280', fontWeight: 600 },
                      '& .MuiPaginationItem-root.Mui-selected': { background: '#111827', color: '#fff' },
                    }}
                  />
                </Box>
              )}
            </Card>
          </>
        )}
      </Box>
    </ProviderAuthGuard>
  );
}


