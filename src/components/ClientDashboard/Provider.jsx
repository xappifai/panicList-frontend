// src/components/ClientDashboard/Provider.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Grid,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import providerService from "../../services/providerService";
import {
  Search as SearchIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  MoreVert as MoreVertIcon,
  LocalFireDepartment as FlameIcon,
  KeyboardArrowRight as ArrowRightIcon,
  KeyboardArrowLeft as ArrowLeftIcon,
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

export default function Provider() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [showLeftArrow, setShowLeftArrow] = useState({});
  const scrollRefs = useRef({});
  
  // Data state
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleScroll = (sectionIndex) => {
    const scrollContainer = scrollRefs.current[sectionIndex];
    if (scrollContainer) {
      setShowLeftArrow(prev => ({
        ...prev,
        [sectionIndex]: scrollContainer.scrollLeft > 0
      }));
    }
  };

  const scrollTo = (sectionIndex, direction) => {
    const scrollContainer = scrollRefs.current[sectionIndex];
    if (scrollContainer) {
      const scrollAmount = 300; // Adjust scroll amount as needed
      const newScrollLeft = direction === 'left' 
        ? scrollContainer.scrollLeft - scrollAmount
        : scrollContainer.scrollLeft + scrollAmount;
      
      scrollContainer.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Fetch providers data
  const fetchProvidersData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [featuredProviders, topRatedProviders, allProviders] = await Promise.all([
        providerService.getFeaturedProviders(),
        providerService.getTopRatedProviders({ limit: 8 }),
        providerService.getProvidersWithListings({ limit: 8 })
      ]);

      const sectionsData = [
        {
          title: "Featured Providers",
          providers: featuredProviders.success ? featuredProviders.data : [],
        },
        {
          title: "Top Rated Providers",
          providers: topRatedProviders.success ? topRatedProviders.data : [],
        },
        {
          title: "All Providers",
          providers: allProviders.success ? allProviders.data : [],
        },
      ];

      setSections(sectionsData);
    } catch (error) {
      console.error('Error fetching providers:', error);
      setError('Failed to load providers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchProvidersData();
  }, []);

  // Filter providers based on search and filters
  const getFilteredProviders = (providers) => {
    return providers.filter(provider => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          provider.fullName?.toLowerCase().includes(searchLower) ||
          provider.businessInfo?.businessName?.toLowerCase().includes(searchLower) ||
          provider.listings?.some(listing => 
            listing.title?.toLowerCase().includes(searchLower) ||
            listing.description?.toLowerCase().includes(searchLower)
          );
        if (!matchesSearch) return false;
      }

      // Service category filter
      if (serviceCategory) {
        const hasMatchingService = provider.listings?.some(listing => 
          listing.category === serviceCategory
        );
        if (!hasMatchingService) return false;
      }

      // Price filter
      if (price) {
        const hasMatchingPrice = provider.listings?.some(listing => {
          const listingPrice = listing.pricing?.amount || 0;
          switch (price) {
            case 'low':
              return listingPrice <= 100;
            case 'medium':
              return listingPrice > 100 && listingPrice <= 300;
            case 'high':
              return listingPrice > 300;
            default:
              return true;
          }
        });
        if (!hasMatchingPrice) return false;
      }

      return true;
    });
  };

  // Transform provider data for display
  const transformProviderForDisplay = (provider) => {
    // Providers from public endpoint may use `id` instead of `uid`
    const providerId = provider.uid || provider.id;
    const primaryListing = provider.listings?.[0];
    const averageRating = provider.listings?.reduce((sum, listing) => 
      sum + (listing.statistics?.rating || 0), 0) / (provider.listings?.length || 1);
    const totalReviews = provider.listings?.reduce((sum, listing) => 
      sum + (listing.statistics?.totalReviews || 0), 0);

    return {
      id: providerId,
      name: primaryListing?.title || provider.businessInfo?.businessName || provider.fullName,
      image: primaryListing?.images?.[0]?.url || provider.profileImage || "/images/handyperson.jpg",
      price: primaryListing?.pricing ? 
        `From $${primaryListing.pricing.amount}` : 
        "Contact for pricing",
      rating: averageRating || 0,
      reviews: totalReviews || 0,
      isNew: provider.createdAt && 
        (new Date() - new Date(provider.createdAt)) < (30 * 24 * 60 * 60 * 1000), // 30 days
      discount: primaryListing?.featured ? "Featured" : null,
      category: serviceCategories[primaryListing?.category] || "Service",
      provider: provider,
      listings: provider.listings || []
    };
  };

  const handleProviderClick = (providerId) => {
    navigate(`/client-dashboard/recommendations/${providerId}`);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Page Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#1F2937",
          mb: 3,
        }}
      >
        Recommended Providers
      </Typography>

      {/* Search and Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search Bar */}
        <TextField
          placeholder="Search providers"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            flex: 1,
            minWidth: "300px",
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#FFFFFF",
              borderRadius: 2,
              "& fieldset": {
                borderColor: "#E5E7EB",
              },
              "&:hover fieldset": {
                borderColor: "#D1D5DB",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#6B7280" }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Filter Dropdowns */}
        <FormControl
          sx={{
            minWidth: 150,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#FFFFFF",
              borderRadius: 2,
              "& fieldset": {
                borderColor: "#E5E7EB",
              },
            },
          }}
        >
          <Select
            value={serviceCategory}
            onChange={(e) => setServiceCategory(e.target.value)}
            displayEmpty
            IconComponent={KeyboardArrowDownIcon}
            sx={{ color: "#374151" }}
          >
            <MenuItem value="" sx={{ color: "#6B7280" }}>Service Category</MenuItem>
            {Object.entries(serviceCategories).map(([key, value]) => (
              <MenuItem key={key} value={key} sx={{ color: "#1F2937" }}>{value}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          sx={{
            minWidth: 120,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#FFFFFF",
              borderRadius: 2,
              "& fieldset": {
                borderColor: "#E5E7EB",
              },
            },
          }}
        >
          <Select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            displayEmpty
            IconComponent={KeyboardArrowDownIcon}
            sx={{ color: "#374151" }}
          >
            <MenuItem value="" sx={{ color: "#6B7280" }}>Location</MenuItem>
            <MenuItem value="new-york" sx={{ color: "#1F2937" }}>New York</MenuItem>
            <MenuItem value="los-angeles" sx={{ color: "#1F2937" }}>Los Angeles</MenuItem>
            <MenuItem value="chicago" sx={{ color: "#1F2937" }}>Chicago</MenuItem>
            <MenuItem value="houston" sx={{ color: "#1F2937" }}>Houston</MenuItem>
            <MenuItem value="phoenix" sx={{ color: "#1F2937" }}>Phoenix</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          sx={{
            minWidth: 120,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#FFFFFF",
              borderRadius: 2,
              "& fieldset": {
                borderColor: "#E5E7EB",
              },
            },
          }}
        >
          <Select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            displayEmpty
            IconComponent={KeyboardArrowDownIcon}
            sx={{ color: "#374151" }}
          >
            <MenuItem value="" sx={{ color: "#6B7280" }}>Price</MenuItem>
            <MenuItem value="low" sx={{ color: "#1F2937" }}>$0 - $100</MenuItem>
            <MenuItem value="medium" sx={{ color: "#1F2937" }}>$100 - $300</MenuItem>
            <MenuItem value="high" sx={{ color: "#1F2937" }}>$300+</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Content Sections */}
      {!loading && !error && sections.map((section, sectionIndex) => {
        const filteredProviders = getFilteredProviders(section.providers);
        const displayProviders = filteredProviders.map(transformProviderForDisplay);
        
        if (displayProviders.length === 0) {
          if (sectionIndex === 0) {
            return (
              <Box key={sectionIndex} sx={{ mb: 4 }}>
                <Typography variant="body1" sx={{ color: '#6B7280' }}>
                  No providers found. Try adjusting filters or check back later.
                </Typography>
              </Box>
            );
          }
          return null;
        }
        
        return (
        <Box key={sectionIndex} sx={{ mb: 4 }}>
          {/* Section Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#1F2937",
                fontSize: "1.125rem",
              }}
            >
              {section.title}
            </Typography>
          </Box>

          {/* Provider Cards Row with Navigation Arrows */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              position: "relative",
            }}
          >
            {/* Left Navigation Arrow */}
            {showLeftArrow[sectionIndex] && (
              <IconButton
                onClick={() => scrollTo(sectionIndex, 'left')}
                sx={{
                  backgroundColor: "#3B82F6",
                  color: "white",
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                  zIndex: 1,
                  "&:hover": {
                    backgroundColor: "#2563EB",
                  },
                }}
              >
                <ArrowLeftIcon />
              </IconButton>
            )}

            {/* Provider Cards Row */}
            <Box
              ref={(el) => scrollRefs.current[sectionIndex] = el}
              onScroll={() => handleScroll(sectionIndex)}
              sx={{
                display: "flex",
                gap: 2,
                overflowX: "auto",
                pb: 1,
                flex: 1,
                scrollbarWidth: "none", // Hide scrollbar for Firefox
                msOverflowStyle: "none", // Hide scrollbar for IE/Edge
                "&::-webkit-scrollbar": {
                  display: "none", // Hide scrollbar for Chrome/Safari
                },
              }}
            >
              {displayProviders.map((provider, index) => (
                <Card
                  key={`${sectionIndex}-${index}`}
                  onClick={() => handleProviderClick(provider.id)}
                  sx={{
                    minWidth: 280,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 2,
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    border: "1px solid #E5E7EB",
                    position: "relative",
                    flexShrink: 0,
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  {/* Image Container */}
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={provider.image}
                      alt={provider.name}
                      sx={{
                        objectFit: "cover",
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                      }}
                    />
                    
                    {/* New Tag */}
                    {provider.isNew && (
                      <Chip
                        label="New"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          backgroundColor: "#3B82F6",
                          color: "white",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          height: 24,
                        }}
                      />
                    )}
                    
                    {/* Discount Tag */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 40,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        backgroundColor: "#F59E0B",
                        color: "white",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      <FlameIcon sx={{ fontSize: "0.875rem" }} />
                      {provider.discount}
                    </Box>
                    
                    {/* Options Menu */}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click when clicking menu
                      }}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        color: "#6B7280",
                        width: 32,
                        height: 32,
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 1)",
                        },
                      }}
                    >
                      <MoreVertIcon sx={{ fontSize: "1rem" }} />
                    </IconButton>
                  </Box>

                  {/* Card Content */}
                  <CardContent sx={{ p: 2 }}>
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
                      {provider.name}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6B7280",
                        fontSize: "0.875rem",
                        mb: 1,
                      }}
                    >
                      {provider.price}
                    </Typography>
                    
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#1F2937",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                        }}
                      >
                        {provider.rating} ({provider.reviews} reviews)
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
            
            {/* Right Navigation Arrow */}
            <IconButton
              onClick={() => scrollTo(sectionIndex, 'right')}
              sx={{
                backgroundColor: "#3B82F6",
                color: "white",
                width: 40,
                height: 40,
                flexShrink: 0,
                "&:hover": {
                  backgroundColor: "#2563EB",
                },
              }}
            >
              <ArrowRightIcon />
            </IconButton>
          </Box>
        </Box>
        );
      })}
    </Box>
  );
}
