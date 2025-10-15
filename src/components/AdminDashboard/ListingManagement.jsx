// src/components/AdminDashboard/ListingManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { listingAPI } from "../../services/apiService";

const ListingManagement = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all listings from the backend
        const response = await listingAPI.getAllListings({
          limit: 6, // Show only 6 listings for the dashboard
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });

               if (response.success) {
                 const listingData = response.data?.listings || response.data || [];
                 
                 // Process listing data
                 const processedListings = listingData.map((listing, index) => ({
            id: listing.id || listing._id || index,
            title: listing.title || listing.serviceName || 'Untitled Service',
            price: listing.pricing?.hourlyRate ? 
              `From $${listing.pricing.hourlyRate}/hour` : 
              listing.pricing?.basePrice ? 
                `From $${listing.pricing.basePrice}` : 
                'Price on request',
            image: listing.images?.[0] || '/src/assets/images/handyperson.jpg',
            newTag: listing.status === 'active' && 
              new Date(listing.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // New if created within last 7 days
            discount: listing.pricing?.discount ? `${listing.pricing.discount}% off` : null,
            status: listing.status || 'draft',
            category: listing.category || 'General',
            providerId: listing.providerId
          }));

          setListings(processedListings);
        } else {
          throw new Error(response.message || 'Failed to fetch listings');
        }
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError(err.message || 'Failed to load listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

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
          Listing Management
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={24} />
            <Typography sx={{ ml: 2, color: "#6B7280" }}>
              Loading listings...
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ py: 4 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Box>
        ) : listings.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography variant="body1" sx={{ color: "#6B7280" }}>
              No listings found
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 3 }}>
            {listings.map((listing) => (
              <Box
                key={listing.id}
                sx={{
                  border: "1px solid #E5E7EB",
                  borderRadius: 2,
                  overflow: "hidden",
                  backgroundColor: "#F9FAFB",
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <Box
                    component="img"
                    src={listing.image}
                    alt={listing.title}
                    sx={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                    }}
                  />
                  
                  {/* New Tag */}
                  {listing.newTag && (
                    <Chip
                      label="New"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        backgroundColor: "#10B981",
                        color: "white",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        height: 20,
                      }}
                    />
                  )}
                  
                  {/* Discount Tag */}
                  {listing.discount && (
                    <Chip
                      label={listing.discount}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "#F59E0B",
                        color: "white",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        height: 20,
                      }}
                    />
                  )}
                </Box>
                
                <Box sx={{ p: 2 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: "#1F2937",
                      fontSize: "0.875rem",
                      mb: 1,
                      lineHeight: 1.4,
                    }}
                  >
                    {listing.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#00ADB4",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                    }}
                  >
                    {listing.price}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}

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
          MANAGE LISTINGS
        </Button>
      </CardContent>
    </Card>
  );
};

export default ListingManagement;
