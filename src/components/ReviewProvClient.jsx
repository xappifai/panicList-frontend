// src/components/ClientDashboard/ReviewsList.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Avatar, Divider, CircularProgress, Alert } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarIcon from "@mui/icons-material/Star";
import { feedbackAPI } from "../services/apiService";
import { useUser } from "../contexts/UserContext";

// Utility to consistently generate a color from a string
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    /* eslint-disable no-bitwise */
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    /* eslint-enable no-bitwise */
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

export default function ReviewsList({ heading = "Reviews" }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);

  // Load latest provider reviews across providers for this client’s orders
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const resp = await feedbackAPI.getClientFeedbacks(1, 7);
        if (resp?.success) {
          const data = (resp.data || []).map(f => ({
            name: f.providerName || 'Provider',
            subtitle: f.serviceName || 'Service',
            comment: f.comment || '',
            rating: Number(f.rating || 0).toFixed(1),
          }));
          setReviews(data);
        } else {
          setError(resp?.message || 'Failed to load reviews');
          setReviews([]);
        }
      } catch (e) {
        setError(typeof e === 'string' ? e : e?.error || e?.message || 'Failed to load reviews');
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.uid]);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #E5E7EB",
        borderRadius: "10px",
        backgroundColor: "white",
        py: 2,
        fontFamily: "Manrope, sans-serif",
      }}
    >
      {/* header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          px: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 700,
            color: "#283C50",
          }}
        >
          {heading}
        </Typography>
        <IconButton size="small">
          <MoreVertIcon />
        </IconButton>
      </Box>

      {/* list */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
          // hide scrollbar in WebKit browsers
          "&::-webkit-scrollbar": { display: "none" },
          // hide scrollbar in Firefox
          scrollbarWidth: "none",
          // hide scrollbar in IE/Edge
          msOverflowStyle: "none",
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={20} />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : reviews.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#9CA3AF' }}>No reviews yet</Typography>
        ) : reviews.map((r, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: { xs: "flex-start", sm: "space-between" },
              p: { xs: 1, sm: 2 },
              mb: 1,
              border: "1px dashed #E5E7EB",
              borderRadius: 1,
              backgroundColor: "white",
              gap: { xs: 1, sm: 0 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: { xs: 1, sm: 0 } }}>
              <Avatar
                sx={{
                  width: { xs: 28, sm: 32 },
                  height: { xs: 28, sm: 32 },
                  bgcolor: stringToColor(r.name),
                  color: "#FFFFFF",
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 600,
                }}
              >
                {r.name[0]}
              </Avatar>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: "Manrope, sans-serif",
                    fontWeight: 700,
                    color: "#283C50",
                  }}
                >
                  {r.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "Manrope, sans-serif",
                    color: "#B7B7B7",
                  }}
                >
                  {r.subtitle}
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="body2"
              sx={{
                flex: 1,
                mx: { xs: 0, sm: 2 },
                fontFamily: "Manrope, sans-serif",
                color: "#B7B7B7",
                wordBreak: "break-word",
                textAlign: { xs: "left", sm: "inherit" },
              }}
            >
              {r.comment}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: { xs: 1, sm: 0 } }}>
              <StarIcon sx={{ fontSize: { xs: 24, sm: 36 }, color: "#66CC66" }} />
              <Typography
                sx={{
                  fontSize: { xs: "24px", sm: "36px" },
                  lineHeight: 1,
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 700,
                  color: "#283C50",
                }}
              >
                {r.rating}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 1 }} />
      <Typography
        variant="button"
        display="block"
        textAlign="center"
        sx={{
          fontFamily: "Manrope, sans-serif",
          fontWeight: 600,
          color: "#283C50",
        }}
      >
        Manage Reviews
      </Typography>
    </Box>
  );
}
