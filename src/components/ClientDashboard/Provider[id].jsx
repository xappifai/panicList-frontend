// src/components/ClientDashboard/Provider[id].jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  IconButton,
  Divider,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { userAPI, listingAPI, authAPI, feedbackAPI } from "../../services/apiService";
import {
  ArrowBack as ArrowBackIcon,
  Star as StarIcon,
  StarHalf as StarHalfIcon,
  StarBorder as StarBorderIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Image as ImageIcon,
} from "@mui/icons-material";

// Service categories mapping
const serviceCategories = {
  'home_repair': 'Home Repair',
  'cleaning': 'Cleaning',
  'landscaping': 'Landscaping',
  'painting': 'Painting',
  'plumbing': 'Plumbing',
  'electrical': 'Electrical',
  'hvac': 'HVAC',
  'handyman': 'Handyman',
  'moving': 'Moving',
  'other': 'Other'
};

// Pricing types mapping
const pricingTypes = {
  'fixed': 'Fixed Price',
  'hourly': 'Per Hour',
  'per_square_foot': 'Per Square Foot',
  'custom': 'Custom Quote'
};

// Helper functions for formatting listing data
const formatPricing = (pricing) => {
  if (!pricing) return 'Contact for pricing';
  
  const type = pricingTypes[pricing.type] || pricing.type;
  const amount = pricing.amount ? `$${pricing.amount}` : '';
  const currency = pricing.currency && pricing.currency !== 'USD' ? ` ${pricing.currency}` : '';
  
  if (pricing.description) {
    return `${amount}${currency} - ${pricing.description}`;
  }
  
  return `${amount}${currency} (${type})`;
};

const formatAvailability = (availability) => {
  if (!availability) return 'Contact for availability';
  
  if (availability.schedule) {
    return availability.schedule;
  }
  
  if (availability.timeSlots && availability.timeSlots.length > 0) {
    const days = availability.timeSlots
      .filter(slot => slot.available)
      .map(slot => `${slot.day}: ${slot.startTime}-${slot.endTime}`)
      .join(', ');
    return days || 'Contact for availability';
  }
  
  return availability.responseTime || 'Contact for availability';
};

const formatLocation = (location) => {
  if (!location) return 'Service area not specified';
  
  let result = location.coverage || 'Service area not specified';
  
  if (location.serviceRadius) {
    result += ` (${location.serviceRadius} mile radius)`;
  }
  
  if (location.specificAreas && location.specificAreas.length > 0) {
    result += ` - Areas: ${location.specificAreas.join(', ')}`;
  }
  
  return result;
};

const formatRequirements = (requirements) => {
  if (!requirements) return null;
  
  const reqs = [];
  
  if (requirements.minimumOrder) {
    reqs.push(`Minimum order: $${requirements.minimumOrder}`);
  }
  
  if (requirements.advanceBooking) {
    reqs.push(`Advance booking: ${requirements.advanceBooking} hours`);
  }
  
  if (requirements.specialRequirements) {
    reqs.push(requirements.specialRequirements);
  }
  
  return reqs.length > 0 ? reqs : null;
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`provider-tabpanel-${index}`}
      aria-labelledby={`provider-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProviderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  
  // Data state
  const [provider, setProvider] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Reviews state
  const [providerFeedbacks, setProviderFeedbacks] = useState([]);
  const [fbLoading, setFbLoading] = useState(true);
  const [fbError, setFbError] = useState("");
  const [fbPage, setFbPage] = useState(1);
  const [fbTotalPages, setFbTotalPages] = useState(1);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Fetch provider and listing data
  const fetchProviderData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch provider data using public endpoint (no auth required)
      const providerResponse = await authAPI.getPublicProviderById(id);
      if (!providerResponse.success) {
        throw new Error('Provider not found');
      }

      // Fetch provider's listings (all statuses)
      const listingsResponse = await listingAPI.getListingsByProvider(id, {
        // Remove status filter to show all listings (draft, active, etc.)
        limit: 10
      });

      setProvider(providerResponse.data);
      
      // Handle listings response - check both possible response structures
      let listingsData = [];
      if (listingsResponse.success) {
        // If response has success property, use data.listings
        listingsData = listingsResponse.data?.listings || [];
      } else if (listingsResponse.listings) {
        // If response directly has listings property
        listingsData = listingsResponse.listings;
      } else if (Array.isArray(listingsResponse)) {
        // If response is directly an array
        listingsData = listingsResponse;
      }
      
      setListings(listingsData);
    } catch (error) {
      console.error('Error fetching provider data:', error);
      setError(error.message || 'Failed to load provider data');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (id) {
      fetchProviderData();
    }
  }, [id]);

  // Safe date formatter
  const toJsDate = (value) => {
    try {
      if (!value) return null;
      if (typeof value?.toDate === 'function') return value.toDate();
      if (typeof value?.seconds === 'number') return new Date(value.seconds * 1000);
      if (typeof value?._seconds === 'number') return new Date(value._seconds * 1000);
      if (typeof value === 'number') return new Date(value);
      if (typeof value === 'string') return new Date(value);
      return new Date(value);
    } catch { return null; }
  };

  // Fetch provider reviews
  const fetchProviderFeedbacks = async (page = 1) => {
    try {
      setFbLoading(true);
      setFbError("");
      const resp = await feedbackAPI.getProviderFeedbacks(id, page, 10);
      if (resp?.success) {
        setProviderFeedbacks(resp.data || []);
        setFbTotalPages(resp.pagination?.totalPages || 1);
      } else {
        setFbError(resp?.message || "Failed to load reviews");
        setProviderFeedbacks([]);
        setFbTotalPages(1);
      }
    } catch (e) {
      setFbError(typeof e === 'string' ? e : e?.error || e?.message || 'Failed to load reviews');
      setProviderFeedbacks([]);
      setFbTotalPages(1);
    } finally {
      setFbLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProviderFeedbacks(fbPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, fbPage]);

  const handleBack = () => {
    navigate(-1);
  };

  // Calculate provider statistics
  const getProviderStats = () => {
    if (!provider || !listings.length) {
      return {
        averageRating: 0,
        totalReviews: 0,
        totalListings: 0,
        totalViews: 0,
        totalInquiries: 0,
        primaryService: 'Service',
        startingPrice: 'Contact for pricing'
      };
    }

    const totalRating = listings.reduce((sum, listing) => sum + (listing.statistics?.rating || 0), 0);
    const totalReviews = listings.reduce((sum, listing) => sum + (listing.statistics?.totalReviews || 0), 0);
    const totalViews = listings.reduce((sum, listing) => sum + (listing.statistics?.views || 0), 0);
    const totalInquiries = listings.reduce((sum, listing) => sum + (listing.statistics?.inquiries || 0), 0);
    const averageRating = listings.length > 0 ? totalRating / listings.length : 0;
    
    // Get primary service from most common category
    const serviceCounts = {};
    listings.forEach(listing => {
      serviceCounts[listing.category] = (serviceCounts[listing.category] || 0) + 1;
    });
    const primaryService = Object.keys(serviceCounts).reduce((a, b) => 
      serviceCounts[a] > serviceCounts[b] ? a : b, 'other'
    );

    // Get starting price from lowest priced listing
    const prices = listings
      .map(listing => listing.pricing?.amount)
      .filter(price => price && price > 0);
    const startingPrice = prices.length > 0 ? 
      `From $${Math.min(...prices)}` : 
      'Contact for pricing';

    return {
      averageRating,
      totalReviews,
      totalViews,
      totalInquiries,
      totalListings: listings.length,
      primaryService: serviceCategories[primaryService] || 'Service',
      startingPrice
    };
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} sx={{ color: "#F59E0B", fontSize: "1.25rem" }} />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalfIcon key="half" sx={{ color: "#F59E0B", fontSize: "1.25rem" }} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarBorderIcon key={`empty-${i}`} sx={{ color: "#D1D5DB", fontSize: "1.25rem" }} />);
    }

    return stars;
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ width: "100%" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            color: "#6B7280",
            textTransform: "none",
            mb: 2,
            "&:hover": {
              backgroundColor: "#F3F4F6",
            },
          }}
        >
          Back
        </Button>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  // No provider found
  if (!provider) {
    return (
      <Box sx={{ width: "100%" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            color: "#6B7280",
            textTransform: "none",
            mb: 2,
            "&:hover": {
              backgroundColor: "#F3F4F6",
            },
          }}
        >
          Back
        </Button>
        <Alert severity="warning">
          Provider not found
        </Alert>
      </Box>
    );
  }

  const stats = getProviderStats();

  return (
    <Box sx={{ width: "100%" }}>
      {/* Back Button and Title */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            color: "#6B7280",
            textTransform: "none",
            mb: 2,
            "&:hover": {
              backgroundColor: "#F3F4F6",
            },
          }}
        >
          Back
        </Button>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1F2937",
          }}
        >
          Provider Profile
        </Typography>
      </Box>

      {/* Provider Header Section */}
      <Card sx={{ mb: 3, backgroundColor: "#FFFFFF", borderRadius: 2, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
            {/* Profile Image */}
            <Avatar
              src={provider.profileImage}
              sx={{
                width: 120,
                height: 120,
                border: "3px solid #E5E7EB",
              }}
            >
              {provider.fullName ? 
                provider.fullName.charAt(0).toUpperCase() : 
                provider.businessInfo?.businessName ? 
                provider.businessInfo.businessName.charAt(0).toUpperCase() : 'P'}
            </Avatar>

            {/* Provider Info */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#1F2937",
                  mb: 1,
                }}
              >
                {provider.businessInfo?.businessName || provider.fullName}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#6B7280",
                  mb: 1,
                }}
              >
                Service: {stats.primaryService}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                {renderStars(stats.averageRating)}
                <Typography
                  variant="body1"
                  sx={{
                    color: "#374151",
                    fontWeight: 500,
                    ml: 1,
                  }}
                >
                  {stats.averageRating.toFixed(1)} ({stats.totalReviews} reviews)
                </Typography>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  color: "#6B7280",
                  mb: 2,
                }}
              >
                {stats.startingPrice}
              </Typography>

              {/* Provider Statistics */}
              <Box sx={{ display: "flex", gap: 3, mb: 2, flexWrap: "wrap" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <VisibilityIcon sx={{ color: "#6B7280", fontSize: "1rem" }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6B7280",
                      fontSize: "0.875rem"
                    }}
                  >
                    {stats.totalViews} views
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TrendingUpIcon sx={{ color: "#6B7280", fontSize: "1rem" }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6B7280",
                      fontSize: "0.875rem"
                    }}
                  >
                    {stats.totalInquiries} inquiries
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircleIcon sx={{ color: "#6B7280", fontSize: "1rem" }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6B7280",
                      fontSize: "0.875rem"
                    }}
                  >
                    {stats.totalListings} services
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                onClick={() => navigate('/client-dashboard/booking', { 
                  state: { 
                    providerData: {
                      id: provider.uid || provider.id,
                      name: provider.businessInfo?.businessName || provider.fullName,
                      service: stats.primaryService,
                      profileImage: provider.profileImage,
                      startingPrice: stats.startingPrice,
                      listings: listings
                    }
                  }
                })}
                sx={{
                  backgroundColor: "#00ADB4",
                  color: "white",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#009DA4",
                  },
                }}
              >
                Book Now
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "#E5E7EB", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "1rem",
              color: "#6B7280",
              minHeight: 48,
              "&.Mui-selected": {
                color: "#00ADB4",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#00ADB4",
              height: 3,
            },
          }}
        >
          <Tab label="Overview" />
          <Tab label="Reviews" />
          <Tab label="Availability" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <TabPanel value={tabValue} index={0}>
        {/* About Section */}
        <Card sx={{ mb: 3, backgroundColor: "#FFFFFF", borderRadius: 2, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#1F2937",
                mb: 2,
              }}
            >
              About {provider.businessInfo?.businessName || provider.fullName}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#374151",
                lineHeight: 1.6,
              }}
            >
              {provider.businessInfo?.description || 
               `Professional ${stats.primaryService.toLowerCase()} services with ${stats.totalListings} active listings. Contact us for more information about our services.`}
            </Typography>
          </CardContent>
        </Card>

        {/* Services Section */}
        <Card sx={{ mb: 3, backgroundColor: "#FFFFFF", borderRadius: 2, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#1F2937",
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
            >
              <CheckCircleIcon sx={{ color: "#00ADB4" }} />
              Our Services
            </Typography>
            
            <Box sx={{ 
              display: "flex", 
              gap: 2, 
              overflowX: "auto", 
              pb: 2,
              "&::-webkit-scrollbar": {
                height: 6,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#F3F4F6",
                borderRadius: 3,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#D1D5DB",
                borderRadius: 3,
                "&:hover": {
                  backgroundColor: "#9CA3AF",
                },
              },
            }}>
              {listings && listings.length > 0 ? (
                listings.map((listing, index) => (
                  <Box key={listing.id || index} sx={{ 
                    minWidth: 300, 
                    flexShrink: 0 
                  }}>
                <Card sx={{ 
                  border: "1px solid #E5E7EB", 
                  borderRadius: 2,
                  height: "100%",
                  "&:hover": {
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    transform: "translateY(-2px)",
                    transition: "all 0.2s ease-in-out"
                  }
                }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Chip 
                        label={listing.category || "Service"}
                        size="small"
                        sx={{ 
                          backgroundColor: "#E0F2FE", 
                          color: "#0369A1",
                          fontWeight: 500
                        }} 
                      />
                      {listing.featured && (
                        <Chip 
                          label="Featured"
                          size="small"
                          sx={{ 
                            backgroundColor: "#FEF3C7", 
                            color: "#92400E",
                            fontWeight: 500
                          }} 
                        />
                      )}
                    </Box>
                    
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#1F2937",
                        mb: 1,
                        fontSize: "1.1rem"
                      }}
                    >
                      {listing.title || "Service Title"}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6B7280",
                        mb: 2,
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}
                    >
                      {listing.description || "Service description not available."}
                    </Typography>
                    
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#00ADB4"
                        }}
                      >
                        {formatPricing(listing.pricing)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#6B7280",
                          fontSize: "0.875rem"
                        }}
                      >
                        {listing.pricing?.type === 'hourly' ? 'Per hour' : 
                         listing.pricing?.type === 'fixed' ? 'Fixed price' : 
                         listing.pricing?.type === 'per_sqft' ? 'Per sq ft' : 'Price'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                      {listing.availability?.responseTime && (
                        <Chip 
                          label={listing.availability.responseTime} 
                          size="small" 
                          variant="outlined" 
                          sx={{ 
                            fontSize: "0.75rem",
                            color: "#374151",
                            borderColor: "#D1D5DB",
                            "& .MuiChip-label": {
                              color: "#374151"
                            }
                          }} 
                        />
                      )}
                      {listing.location?.serviceRadius && (
                        <Chip 
                          label={`${listing.location.serviceRadius}km radius`} 
                          size="small" 
                          variant="outlined" 
                          sx={{ 
                            fontSize: "0.75rem",
                            color: "#374151",
                            borderColor: "#D1D5DB",
                            "& .MuiChip-label": {
                              color: "#374151"
                            }
                          }} 
                        />
                      )}
                      {listing.statistics?.rating > 0 && (
                        <Chip 
                          label={`${listing.statistics.rating.toFixed(1)}★`} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            fontSize: "0.75rem",
                            color: "#374151",
                            borderColor: "#D1D5DB",
                            "& .MuiChip-label": {
                              color: "#374151"
                            }
                          }} 
                        />
                      )}
                    </Box>
                    
                    {/* Booking button disabled per request */}
                  </CardContent>
                </Card>
                  </Box>
                ))
              ) : (
                <Box sx={{ 
                  textAlign: "center", 
                  py: 4,
                  backgroundColor: "#F9FAFB",
                  borderRadius: 2,
                  border: "1px dashed #D1D5DB",
                  width: "100%"
                }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#6B7280",
                      mb: 1
                    }}
                  >
                    No services available at the moment
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#9CA3AF",
                      mb: 2
                    }}
                  >
                    This provider hasn't added any services yet
                  </Typography>
                  {process.env.NODE_ENV === 'development' && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#DC2626",
                        fontFamily: "monospace",
                        fontSize: "0.75rem"
                      }}
                    >
                      Debug: Listings count: {listings?.length || 0}, 
                      Loading: {loading ? 'true' : 'false'}, 
                      Error: {error || 'none'}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Service Area Section */}
        <Card sx={{ mb: 3, backgroundColor: "#FFFFFF", borderRadius: 2, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#1F2937",
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
            >
              <LocationIcon sx={{ color: "#00ADB4" }} />
              Service Area
            </Typography>
            
            {/* Map Placeholder */}
            <Box
              sx={{
                width: "100%",
                height: 300,
                backgroundColor: "#F3F4F6",
                borderRadius: 2,
                border: "2px dashed #D1D5DB",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                mb: 3
              }}
            >
              <LocationIcon sx={{ fontSize: 48, color: "#9CA3AF", mb: 1 }} />
              <Typography
                variant="h6"
                sx={{
                  color: "#6B7280",
                  fontWeight: 500,
                  mb: 0.5
                }}
              >
                {provider.address?.city || 'Service Area'}
              </Typography>
              
              {/* Service Area Pins */}
              <Box sx={{ position: "absolute", top: 20, left: 50 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    backgroundColor: "#00ADB4",
                    borderRadius: "50%",
                    border: "2px solid white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                  }}
                />
              </Box>
              <Box sx={{ position: "absolute", top: 80, right: 80 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    backgroundColor: "#00ADB4",
                    borderRadius: "50%",
                    border: "2px solid white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                  }}
                />
              </Box>
              <Box sx={{ position: "absolute", bottom: 60, left: 100 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    backgroundColor: "#00ADB4",
                    borderRadius: "50%",
                    border: "2px solid white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                  }}
                />
              </Box>
            </Box>

            {/* Service Areas List */}
            <Grid container spacing={2}>
              {provider.address && (
                <>
                  {provider.address.street && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Box sx={{ 
                        p: 2, 
                        backgroundColor: "#F9FAFB", 
                        borderRadius: 2, 
                        border: "1px solid #E5E7EB" 
                      }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#6B7280",
                            fontWeight: 500,
                            mb: 0.5
                          }}
                        >
                          Street Address
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#1F2937",
                            fontWeight: 500
                          }}
                        >
                          {provider.address.street}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {provider.address.city && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Box sx={{ 
                        p: 2, 
                        backgroundColor: "#F9FAFB", 
                        borderRadius: 2, 
                        border: "1px solid #E5E7EB" 
                      }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#6B7280",
                            fontWeight: 500,
                            mb: 0.5
                          }}
                        >
                          City
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#1F2937",
                            fontWeight: 500
                          }}
                        >
                          {provider.address.city}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {provider.address.state && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Box sx={{ 
                        p: 2, 
                        backgroundColor: "#F9FAFB", 
                        borderRadius: 2, 
                        border: "1px solid #E5E7EB" 
                      }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#6B7280",
                            fontWeight: 500,
                            mb: 0.5
                          }}
                        >
                          State
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#1F2937",
                            fontWeight: 500
                          }}
                        >
                          {provider.address.state}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </>
              )}
              {(!provider.address || (!provider.address.street && !provider.address.city && !provider.address.state)) && (
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 3, 
                    textAlign: "center",
                    backgroundColor: "#F9FAFB", 
                    borderRadius: 2, 
                    border: "1px dashed #D1D5DB" 
                  }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#6B7280"
                      }}
                    >
                      Service area information not available
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card sx={{ mb: 3, backgroundColor: "#FFFFFF", borderRadius: 2, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#1F2937",
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
            >
              <StarIcon sx={{ color: "#00ADB4" }} />
              Reviews & Ratings
            </Typography>
            
            {fbLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : fbError ? (
              <Alert severity="error">{fbError}</Alert>
            ) : providerFeedbacks.length > 0 ? (
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {providerFeedbacks.map((fb) => (
                    <Card key={fb.id} sx={{ border: '1px solid #E5E7EB', borderRadius: 2 }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ bgcolor: '#00ADB4' }}>{(fb.clientName || 'C').charAt(0).toUpperCase()}</Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 600, color: '#111827' }}>{fb.clientName || 'Client'}</Typography>
                            <Typography variant="caption" sx={{ color: '#6B7280' }}>
                              {(() => { const d = toJsDate(fb.createdAt) || toJsDate(fb.updatedAt); return d && !isNaN(d.getTime()) ? d.toLocaleDateString() : 'Unknown date'; })()}
                            </Typography>
                          </Box>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {renderStars(fb.rating || 0)}
                              <Typography variant="body2" sx={{ color: '#374151', fontWeight: 500 }}>{fb.rating || 0}/5</Typography>
                            </Box>
                          </Box>
                        </Box>
                        {fb.comment && (
                          <Typography variant="body2" sx={{ color: '#374151', mt: 1 }}>
                            "{fb.comment}"
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            ) : (
              <Box sx={{ 
                textAlign: "center", 
                py: 4,
                backgroundColor: "#F9FAFB",
                borderRadius: 2,
                border: "1px dashed #D1D5DB"
              }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#6B7280",
                    mb: 1
                  }}
                >
                  No reviews yet
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#9CA3AF"
                  }}
                >
                  Be the first to review this provider
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {fbLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : fbError ? (
          <Alert severity="error">{fbError}</Alert>
        ) : providerFeedbacks.length === 0 ? (
          <Typography variant="body1" sx={{ color: '#6B7280' }}>No reviews yet</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {providerFeedbacks.map((fb) => (
              <Card key={fb.id} sx={{ border: '1px solid #E5E7EB', borderRadius: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: '#00ADB4' }}>{(fb.clientName || 'C').charAt(0).toUpperCase()}</Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 600, color: '#111827' }}>{fb.clientName || 'Client'}</Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        {(() => { const d = toJsDate(fb.createdAt) || toJsDate(fb.updatedAt); return d && !isNaN(d.getTime()) ? d.toLocaleDateString() : 'Unknown date'; })()}
                      </Typography>
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {renderStars(fb.rating || 0)}
                        <Typography variant="body2" sx={{ color: '#374151', fontWeight: 500 }}>{fb.rating || 0}/5</Typography>
                      </Box>
                    </Box>
                  </Box>
                  {fb.comment && (
                    <Typography variant="body2" sx={{ color: '#374151', mt: 1 }}>
                      "{fb.comment}"
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" sx={{ color: "#6B7280" }}>
          Availability tab content will be implemented here
        </Typography>
      </TabPanel>
    </Box>
  );
};
