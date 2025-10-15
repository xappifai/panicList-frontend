// src/components/ClientDashboard/ServiceTracking.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Chip,
  Divider,
  Grid,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
  Phone as PhoneIcon,
  Message as MessageIcon,
  Payment as PaymentIcon,
  RateReview as RateReviewIcon,
} from "@mui/icons-material";
import { orderAPI, feedbackAPI, userAPI } from "../../services/apiService.js";
import { stripeService } from "../../services/stripeService.js";
import ReviewModal from "../ReviewModal.jsx";

export default function ServiceTracking() {
  const navigate = useNavigate();
  const { id: orderId } = useParams();
  const location = useLocation();
  
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  // Function to refresh order data
  const refreshOrderData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('ServiceTracking - orderId from params:', orderId);
      console.log('ServiceTracking - location.pathname:', location.pathname);
      console.log('ServiceTracking - location.search:', location.search);
      console.log('ServiceTracking - location.state:', location.state);
      
      let order;
      if (location.state && location.state.orderData) {
        // Use data passed from navigation
        console.log('Using order data from location.state');
        order = location.state.orderData;
      } else if (orderId) {
        // Fetch order details from API
        console.log('Fetching order data from API for orderId:', orderId);
        order = await orderAPI.getOrderById(orderId);
      } else {
        console.error('No order ID provided - orderId:', orderId);
        throw new Error('No order ID provided');
      }
      
      // Set a fallback provider name immediately
      if (order.providerId && !order.providerName) {
        order.providerName = `Provider ${order.providerId?.slice(-8)}`;
      }
      
      // Try to fetch provider details asynchronously
      if (order.providerId) {
        userAPI.getUserById(order.providerId)
          .then(providerResponse => {
            console.log('Provider response:', providerResponse);
            if (providerResponse.success && providerResponse.data && providerResponse.data.fullName) {
              // Update the order data with the real provider name
              setOrderData(prevOrder => ({
                ...prevOrder,
                providerName: providerResponse.data.fullName
              }));
              console.log('Provider name updated to:', providerResponse.data.fullName);
            }
          })
          .catch(error => {
            console.error('Error fetching provider details:', error);
          });
      }
      
      setOrderData(order);
      console.log('ServiceTracking - Order data:', order);
      console.log('ServiceTracking - Payment status:', order.paymentStatus);
      console.log('ServiceTracking - Order status:', order.status);
      console.log('ServiceTracking - Provider ID:', order.providerId);
      console.log('ServiceTracking - Provider Name:', order.providerName);
      console.log('ServiceTracking - All order keys:', Object.keys(order));
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshOrderData();
  }, [orderId, location.state]);

  // Check if order has been reviewed when order data changes
  useEffect(() => {
    if (orderData) {
      checkIfReviewed();
    }
  }, [orderData]);

  // Check for payment success in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('payment') === 'success') {
      setSuccessMessage('Payment completed successfully!');
      // Refresh order data to show updated status
      setTimeout(() => {
        refreshOrderData();
      }, 1000);
    }
  }, [location.search]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleContactProvider = () => {
    console.log("Contacting provider...");
  };

  const handleCancelTask = () => {
    console.log("Canceling task...");
  };

  // Check if order has been reviewed
  const checkIfReviewed = async () => {
    if (!orderData?.id) return;
    
    try {
      // Check if there's already a review for this order
      const response = await feedbackAPI.getClientFeedbacks(1, 100);
      if (response.success && response.data) {
        const hasReview = response.data.some(feedback => feedback.orderId === orderData.id);
        setHasReviewed(hasReview);
      }
    } catch (error) {
      console.error('Error checking review status:', error);
    }
  };

  const handlePostReview = () => {
    setReviewModalOpen(true);
  };

  const handleReviewSubmitted = (reviewData) => {
    console.log('Review submitted:', reviewData);
    setHasReviewed(true);
    setSuccessMessage('Thank you for your review!');
  };

  const handlePayment = async () => {
    try {
      setPaymentLoading(true);
      await stripeService.createOrderPaymentSession(orderData.id);
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Failed to initiate payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Get progress value based on order status
  const getProgressValue = (status) => {
    switch (status) {
      case 'pending':
        return 10;
      case 'confirmed':
        return 25;
      case 'in_progress':
        return 60;
      case 'completed':
        return 100;
      case 'cancelled':
        return 0;
      default:
        return 10;
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Loading order details...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Error: {error}
        </Typography>
        <Button variant="outlined" onClick={handleBack}>
          Go Back
        </Button>
      </Box>
    );
  }

  // No order data
  if (!orderData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Order not found
        </Typography>
        <Button variant="outlined" onClick={handleBack}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      {/* Header with Breadcrumbs */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              color: "#6B7280",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#F3F4F6",
              },
            }}
          >
            Tasks
          </Button>
          <Typography sx={{ color: "#6B7280" }}>/</Typography>
          <Typography sx={{ color: "#6B7280", fontWeight: 600 }}>
            {orderData.serviceDetails?.category || 'Service'}
          </Typography>
        </Box>
        
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1F2937",
            mb: 1,
          }}
        >
          {orderData.serviceDetails?.title || 'Service Order'}
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: "#6B7280",
            fontSize: "1rem",
          }}
        >
          Order ID: {orderData.orderNumber || orderData.id}
        </Typography>
      </Box>

      {/* Success Message */}
      {successMessage && (
        <Box sx={{ mb: 3 }}>
          <Alert 
            severity="success" 
            sx={{ 
              backgroundColor: "#D1FAE5", 
              color: "#065F46",
              border: "1px solid #10B981",
              borderRadius: 2
            }}
          >
            {successMessage}
          </Alert>
        </Box>
      )}

      {/* Task Status Section */}
      <Card sx={{ 
        backgroundColor: "#FFFFFF", 
        borderRadius: 3, 
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
        mb: 4,
        width: "100%"
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#1F2937",
              mb: 3,
            }}
          >
            Task Status
          </Typography>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Typography
              variant="h6"
              sx={{
                color: "#1F2937",
                fontWeight: 600,
                minWidth: "fit-content",
              }}
            >
              {orderData.status || 'pending'}
            </Typography>
            
            <Box sx={{ flexGrow: 1 }}>
              <LinearProgress
                variant="determinate"
                value={getProgressValue(orderData.status)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#E5E7EB",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#374151",
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Booking Details Section */}
      <Card sx={{ 
        backgroundColor: "#FFFFFF", 
        borderRadius: 3, 
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
        mb: 4,
        width: "100%"
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#1F2937",
              mb: 3,
            }}
          >
            Booking Details
          </Typography>

          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Tasker */}
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                    <PersonIcon sx={{ color: "#6B7280", fontSize: "1.25rem" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6B7280",
                        fontWeight: 500,
                      }}
                    >
                      Tasker:
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#1F2937",
                      fontWeight: 600,
                      ml: 3,
                    }}
                  >
                    {orderData.providerName || orderData.providerDetails?.fullName || `Provider ${orderData.providerId?.slice(-8)}` || 'Provider'}
                  </Typography>
                </Box>

                {/* Time */}
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                    <TimeIcon sx={{ color: "#6B7280", fontSize: "1.25rem" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6B7280",
                        fontWeight: 500,
                      }}
                    >
                      Time:
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#1F2937",
                      fontWeight: 600,
                      ml: 3,
                    }}
                  >
                    {orderData.bookingDetails?.scheduledTime || 'Not scheduled'}
                  </Typography>
                </Box>

                {/* Address */}
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                    <LocationIcon sx={{ color: "#6B7280", fontSize: "1.25rem" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6B7280",
                        fontWeight: 500,
                      }}
                    >
                      Address:
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#1F2937",
                      fontWeight: 600,
                      ml: 3,
                    }}
                  >
                    {orderData.bookingDetails?.address || 'Address not provided'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Date */}
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                    <CalendarIcon sx={{ color: "#6B7280", fontSize: "1.25rem" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6B7280",
                        fontWeight: 500,
                      }}
                    >
                      Date:
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#1F2937",
                      fontWeight: 600,
                      ml: 3,
                    }}
                  >
                    {orderData.bookingDetails?.scheduledDate ? 
                      new Date(orderData.bookingDetails.scheduledDate).toLocaleDateString() :
                      'Not scheduled'
                    }
                  </Typography>
                </Box>

                {/* Duration */}
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                    <ScheduleIcon sx={{ color: "#6B7280", fontSize: "1.25rem" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6B7280",
                        fontWeight: 500,
                      }}
                    >
                      Duration:
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#1F2937",
                      fontWeight: 600,
                      ml: 3,
                    }}
                  >
                    {orderData.bookingDetails?.duration ? 
                      `${orderData.bookingDetails.duration} hours` :
                      'Not specified'
                    }
                  </Typography>
                </Box>

                {/* Task Details */}
                <Box>
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 1 }}>
                    <DescriptionIcon sx={{ color: "#6B7280", fontSize: "1.25rem", mt: 0.25 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6B7280",
                        fontWeight: 500,
                      }}
                    >
                      Task Details:
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#1F2937",
                      fontWeight: 600,
                      ml: 3,
                    }}
                  >
                    {orderData.bookingDetails?.notes || 
                     orderData.serviceDetails?.description || 
                     'No additional details provided'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Actions Section */}
      <Card sx={{ 
        backgroundColor: "#FFFFFF", 
        borderRadius: 3, 
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
        width: "100%"
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#1F2937",
              mb: 3,
            }}
          >
            Actions
          </Typography>

          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {/* Payment Button - Show for orders with pending payment */}
            {orderData.paymentStatus === 'pending' && (
              <Button
                variant="contained"
                startIcon={<PaymentIcon />}
                onClick={handlePayment}
                disabled={paymentLoading}
                sx={{
                  backgroundColor: "#10B981",
                  color: "white",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  "&:hover": {
                    backgroundColor: "#059669",
                  },
                  "&:disabled": {
                    backgroundColor: "#9CA3AF",
                    color: "white",
                  },
                }}
              >
                {paymentLoading ? 'Processing...' : `Pay $${orderData.pricing?.totalAmount || 0}`}
              </Button>
            )}
            
            <Button
              variant="contained"
              startIcon={<PhoneIcon />}
              onClick={handleContactProvider}
              sx={{
                backgroundColor: "#00ADB4",
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "#009DA4",
                },
              }}
            >
              Contact Provider
            </Button>
            
            {/* Show Post Review button for paid orders, Cancel Task for others */}
            {orderData?.paymentStatus === 'paid' ? (
              <Button
                variant="contained"
                onClick={handlePostReview}
                disabled={hasReviewed}
                startIcon={<RateReviewIcon />}
                sx={{
                  backgroundColor: hasReviewed ? "#10B981" : "#00ADB5",
                  color: "white",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  "&:hover": {
                    backgroundColor: hasReviewed ? "#059669" : "#009DA4",
                  },
                  "&:disabled": {
                    backgroundColor: "#10B981",
                    color: "white",
                  },
                }}
              >
                {hasReviewed ? "Review Submitted ✓" : "Post a Review"}
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={handleCancelTask}
                sx={{
                  borderColor: "#D1D5DB",
                  color: "#374151",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  "&:hover": {
                    borderColor: "#9CA3AF",
                    backgroundColor: "#F9FAFB",
                  },
                }}
              >
                Cancel Task
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Review Modal */}
      <ReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        orderData={orderData}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </Box>
  );
}
