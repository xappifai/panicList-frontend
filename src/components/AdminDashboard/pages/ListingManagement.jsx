// src/components/AdminDashboard/pages/ListingManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { listingAPI } from "../../../services/apiService";

const ListingManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalListings, setTotalListings] = useState(0);

  const ROWS_PER_PAGE = 9;

  // Format date utility
  const formatDate = (dateValue) => {
    if (!dateValue) return 'Not available';
    
    try {
      let date;
      
      // Handle Firestore timestamp objects
      if (dateValue && typeof dateValue === 'object') {
        if (dateValue.seconds !== undefined && dateValue.nanoseconds !== undefined) {
          date = new Date(dateValue.seconds * 1000 + dateValue.nanoseconds / 1000000);
        } else if (typeof dateValue.toDate === 'function') {
          date = dateValue.toDate();
        } else if (dateValue instanceof Date) {
          date = dateValue;
        } else if (dateValue._seconds !== undefined) {
          date = new Date(dateValue._seconds * 1000);
        }
      } else if (typeof dateValue === 'number') {
        date = new Date(dateValue);
      } else if (typeof dateValue === 'string') {
        date = new Date(dateValue);
        if (isNaN(date.getTime())) {
          const timestamp = parseInt(dateValue);
          if (!isNaN(timestamp)) {
            date = new Date(timestamp);
          }
        }
      }
      
      if (!date || isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      console.error('Date formatting error:', error, dateValue);
      return 'Invalid Date';
    }
  };

  // Fetch listings from the database
  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await listingAPI.getAllListings({
        limit: ROWS_PER_PAGE,
        offset: (currentPage - 1) * ROWS_PER_PAGE,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        category: serviceCategory || undefined,
        search: searchQuery || undefined
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
            new Date(listing.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          discount: listing.pricing?.discount ? `${listing.pricing.discount}% off` : null,
          status: listing.status || 'draft',
          category: listing.category || 'General',
          providerId: listing.providerId,
          createdAt: formatDate(listing.createdAt),
          description: listing.description || 'No description available'
        }));

        setServices(processedListings);
        setTotalListings(response.total || processedListings.length);
        setTotalPages(response.totalPages || Math.ceil(processedListings.length / ROWS_PER_PAGE));
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

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchListings();
  }, [currentPage, serviceCategory]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1); // Reset to first page when searching
      } else {
        fetchListings();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Mock review data
  const reviewHomepageData = Array.from({ length: 3 }, (_, index) => ({
    id: `RVW00${index + 1}`,
    title: "Plumbing Review",
    content: "Reviews on Pipe repairs...",
    date: "2023-01-15",
    status: "Active"
  }));

  const reviewPageData = Array.from({ length: 4 }, (_, index) => ({
    id: `RVW00${index + 1}`,
    name: "Plumbing Review",
    review: "Reviews on Pipe repairs...",
    date: "2023-01-15",
    rating: 4.0,
    status: "Active"
  }));

  const complaintsData = Array.from({ length: 3 }, (_, index) => ({
    id: `RVW00${index + 1}`,
    name: "Plumbing Review",
    complains: "Reviews on Pipe repairs...",
    date: "2023-01-15",
    rating: 4.0,
    status: "Active"
  }));

  const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleViewItem = () => {
    console.log("View item:", selectedItem);
    handleMenuClose();
  };

  const handleEditItem = () => {
    console.log("Edit item:", selectedItem);
    handleMenuClose();
  };

  const handleDeleteItem = () => {
    console.log("Delete item:", selectedItem);
    handleMenuClose();
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Content & List Management Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1F2937",
              fontSize: "1.875rem",
              mb: 0.5
            }}
          >
            Content & List Management
          </Typography>
          <Typography variant="body2" sx={{ color: "#6B7280" }}>
            {loading ? 'Loading...' : `${totalListings} total listings`}
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          onClick={fetchListings} 
          disabled={loading}
          sx={{ 
            textTransform: "none", 
            borderColor: "#00ADB4", 
            color: "#00ADB4",
            "&:hover": {
              borderColor: "#009DA4",
              backgroundColor: "#F0FDFA"
            }
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Search and Filter Section */}
      <Card sx={{ mb: 3, backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <TextField
              placeholder="Search Service"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#6B7280" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flexGrow: 1,
                minWidth: 300,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#F9FAFB",
                  "&:hover": {
                    backgroundColor: "#F3F4F6",
                  },
                },
              }}
            />
            
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Service Category</InputLabel>
              <Select
                value={serviceCategory}
                label="Service Category"
                onChange={(e) => setServiceCategory(e.target.value)}
                sx={{
                  backgroundColor: "#F9FAFB",
                  "&:hover": {
                    backgroundColor: "#F3F4F6",
                  },
                }}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="plumbing">Plumbing</MenuItem>
                <MenuItem value="electrical">Electrical</MenuItem>
                <MenuItem value="cleaning">Cleaning</MenuItem>
                <MenuItem value="handyman">Handyman</MenuItem>
                <MenuItem value="gardening">Gardening</MenuItem>
                <MenuItem value="painting">Painting</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: "#00ADB4",
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#009DA4",
                },
              }}
            >
              Add Service
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Service Listings Grid */}
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
      ) : services.length === 0 ? (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography variant="body1" sx={{ color: "#6B7280" }}>
            No listings found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card sx={{ 
              backgroundColor: "#FFFFFF", 
              borderRadius: 3, 
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              height: "100%",
              position: "relative"
            }}>
              <CardContent sx={{ p: 0 }}>
                {/* Service Image */}
                <Box sx={{ position: "relative", height: 200 }}>
                  <Box
                    component="img"
                    src={service.image}
                    alt={service.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12
                    }}
                  />
                  
                  {/* New Tag */}
                  {service.newTag && (
                    <Chip
                      label="New"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        backgroundColor: "#DBEAFE",
                        color: "#1E40AF",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        height: 24,
                      }}
                    />
                  )}
                  
                  {/* Discount Tag */}
                  <Box sx={{ position: "absolute", top: 12, right: 40 }}>
                    <Chip
                      label={service.discount}
                      size="small"
                      icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        backgroundColor: "#F59E0B",
                        color: "white",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        height: 24,
                      }}
                    />
                  </Box>
                  
                  {/* Actions Menu */}
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, service)}
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                      },
                    }}
                  >
                    <MoreVertIcon sx={{ fontSize: 20, color: "#374151" }} />
                  </IconButton>
                </Box>
                
                {/* Service Details */}
                <Box sx={{ p: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1F2937",
                      fontSize: "1rem",
                      mb: 1,
                      lineHeight: 1.3
                    }}
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#00ADB4",
                      fontWeight: 600,
                      fontSize: "0.875rem"
                    }}
                  >
                    {service.price}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            size="small"
          sx={{
            "& .MuiPaginationItem-root": {
              borderRadius: 2,
              mx: 0.5,
              color: "#1F2937",
            },
            "& .Mui-selected": {
              backgroundColor: "#00ADB4",
              color: "white",
              "&:hover": {
                backgroundColor: "#009DA4",
              },
            },
          }}
          />
        </Box>
      )}

      {/* Review Moderation Section */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#1F2937",
          fontSize: "1.875rem",
          mb: 3
        }}
      >
        Review Moderation
      </Typography>

      {/* Review Homepage Table */}
      <Card sx={{ mb: 4, backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#1F2937",
              fontSize: "1.125rem",
              mb: 3
            }}
          >
            Review Homepage
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Profile</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Review ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Content</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviewHomepageData.map((review, index) => (
                  <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#F9FAFB" } }}>
                    <TableCell sx={{ py: 2 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: "#1E40AF",
                          fontSize: "0.875rem"
                        }}
                      >
                        U
                      </Avatar>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#374151" }}>
                        {review.id}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
                        {review.title}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#6B7280" }}>
                        {review.content}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#374151" }}>
                        {review.date}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={review.status}
                        size="small"
                        sx={{
                          backgroundColor: "#DBEAFE",
                          color: "#1E40AF",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          height: 24,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, review)}
                        sx={{ color: "#6B7280" }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Review Page Table */}
      <Card sx={{ mb: 4, backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#1F2937",
              fontSize: "1.125rem",
              mb: 3
            }}
          >
            Review Page
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Profile</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Client ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Review</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Rating</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviewPageData.map((review, index) => (
                  <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#F9FAFB" } }}>
                    <TableCell sx={{ py: 2 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: "#1E40AF",
                          fontSize: "0.875rem"
                        }}
                      >
                        U
                      </Avatar>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#374151" }}>
                        {review.id}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
                        {review.name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#6B7280" }}>
                        {review.review}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#374151" }}>
                        {review.date}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
                        {review.rating}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={review.status}
                        size="small"
                        sx={{
                          backgroundColor: "#DBEAFE",
                          color: "#1E40AF",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          height: 24,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, review)}
                        sx={{ color: "#6B7280" }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Complaints Handling Table */}
      <Card sx={{ backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#1F2937",
              fontSize: "1.125rem",
              mb: 3
            }}
          >
            Complaints Handling
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Profile</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Complains</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Rating</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {complaintsData.map((complaint, index) => (
                  <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#F9FAFB" } }}>
                    <TableCell sx={{ py: 2 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: "#1E40AF",
                          fontSize: "0.875rem"
                        }}
                      >
                        U
                      </Avatar>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#374151" }}>
                        {complaint.id}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
                        {complaint.name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#6B7280" }}>
                        {complaint.complains}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#374151" }}>
                        {complaint.date}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
                        {complaint.rating}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={complaint.status}
                        size="small"
                        sx={{
                          backgroundColor: "#DBEAFE",
                          color: "#1E40AF",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          height: 24,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, complaint)}
                        sx={{ color: "#6B7280" }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            border: "1px solid #E5E7EB",
            backgroundColor: "#FFFFFF",
          },
        }}
      >
        <MenuItem onClick={handleViewItem} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon>
            <ViewIcon sx={{ fontSize: 20, color: "#00ADB4" }} />
          </ListItemIcon>
          <ListItemText 
            primary="View" 
            sx={{ 
              "& .MuiTypography-root": { 
                fontSize: "0.875rem", 
                fontWeight: 500,
                color: "#1F2937"
              } 
            }} 
          />
        </MenuItem>
        <MenuItem onClick={handleEditItem} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon>
            <EditIcon sx={{ fontSize: 20, color: "#F59E0B" }} />
          </ListItemIcon>
          <ListItemText 
            primary="Edit" 
            sx={{ 
              "& .MuiTypography-root": { 
                fontSize: "0.875rem", 
                fontWeight: 500,
                color: "#1F2937"
              } 
            }} 
          />
        </MenuItem>
        <MenuItem onClick={handleDeleteItem} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon>
            <DeleteIcon sx={{ fontSize: 20, color: "#EF4444" }} />
          </ListItemIcon>
          <ListItemText 
            primary="Delete" 
            sx={{ 
              "& .MuiTypography-root": { 
                fontSize: "0.875rem", 
                fontWeight: 500,
                color: "#1F2937"
              } 
            }} 
          />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ListingManagement;
