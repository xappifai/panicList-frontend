// src/components/RecommendationsListing.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Chip, Divider } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { listingAPI, apiUtils } from "../services/apiService.js";

export default function Recommendations({
  heading = "Recommendations",
  width = "100%",
  height = "100%",
  limit = 3,
  providerId: propProviderId,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        const currentUser = apiUtils.getUser();
        const providerId = propProviderId || currentUser?.uid;
        if (!providerId) {
          setItems([]);
          setLoading(false);
          return;
        }

        // Prefer active listings; if none, fall back to any status
        let resp = await listingAPI.getListingsByProvider(providerId, {
          limit,
          offset: 0,
          sortBy: "createdAt",
          sortOrder: "desc",
          status: "active",
        });

        let listings = resp?.data?.listings || resp?.listings || [];
        if (!listings.length) {
          resp = await listingAPI.getListingsByProvider(providerId, {
            limit,
            offset: 0,
            sortBy: "createdAt",
            sortOrder: "desc",
          });
          listings = resp?.data?.listings || resp?.listings || [];
        }
        const mapped = listings.map((listing) => ({
          image: listing?.images?.[0]?.url || "/assets/images/handyperson.jpg",
          label: listing?.title || "Untitled",
          price: `From $${Number(listing?.pricing?.amount || 0).toFixed(0)}`,
        }));
        setItems(mapped);
      } catch (error) {
        console.error("Failed to load provider listings for dashboard:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [propProviderId, limit]);

  return (
    <Box
      sx={{
        width,
        height,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        border: "1px solid #E5E7EB",
        borderRadius: "10px",
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
          pb: 1,
          borderBottom: "1px solid #E5E7EB",
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

      {/* cards */}
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
        {items.map((item, i) => (
          <Box
            key={i}
            sx={{
              position: "relative",
              mb: 2,
              borderRadius: 1,
              overflow: "hidden",
              height: 200,
            }}
          >
            <Box
              component="img"
              src={item.image}
              alt={item.label}
              sx={{ width: "100%", height: "100%", objectFit: "fill",mt:2 }}
            />
            <Chip
              label="New"
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                bgcolor: "#BDE8EA",
                color: "#333333",
                fontWeight: 600,
                fontFamily: "Manrope, sans-serif",
                borderRadius: "3px",
              }}
            />
            <Chip
              icon={
                <WhatshotIcon
                  sx={{ fontSize: 16, color: "#FFFFFF", ml: "-2px" }}
                />
              }
              label="15% off"
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "#F3723B",
                color: "#FFFFFF",
                fontWeight: 600,
                fontFamily: "Manrope, sans-serif",
                borderRadius: "3px",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                left: 8,
                color: "common.white",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 700,
                }}
              >
                {item.label}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontFamily: "Manrope, sans-serif" }}
              >
                {item.price}
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
        View More
      </Typography>
    </Box>
  );
}
