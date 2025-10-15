// src/components/ClientDashboard/BookingConfirmed.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Divider,
  IconButton,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

export default function BookingConfirmed() {
  const navigate = useNavigate();
  const location = useLocation();
  const { providerData, bookingDetails, paymentMethod, bookingId, total } = location.state || {};

  const handleBack = () => {
    navigate(-1);
  };

  const handleClose = () => {
    navigate('/client-dashboard');
  };

  const handleViewBookings = () => {
    navigate('/client-dashboard/orders');
  };

  const handleBackToHome = () => {
    navigate('/client-dashboard');
  };

  // Format date and time for display
  const formatDateTime = () => {
    if (!bookingDetails.date || !bookingDetails.time) return "Not specified";
    
    const date = new Date(bookingDetails.date);
    const time = bookingDetails.time;
    
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    const formattedDate = date.toLocaleDateString('en-US', options);
    const formattedTime = time;
    
    return `${formattedDate} at ${formattedTime}`;
  };

  return (
    <Box sx={{ 
      width: "100%", 
      maxWidth: "800px", 
      mx: "auto", 
      px: 3,
      py: 4 
    }}>
      {/* Header with Breadcrumbs and Close Button */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        mb: 4 
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
            Back
          </Button>
          <Typography sx={{ color: "#6B7280" }}>/</Typography>
          <Typography sx={{ color: "#6B7280" }}>Booking Confirmed</Typography>
        </Box>
        
        <IconButton
          onClick={handleClose}
          sx={{
            color: "#6B7280",
            "&:hover": {
              backgroundColor: "#F3F4F6",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Success Message */}
      <Box sx={{ 
        textAlign: "center", 
        mb: 6,
        maxWidth: "500px",
        mx: "auto"
      }}>
        {/* Success Icon */}
        <Box
          sx={{
            width: 80,
            height: 80,
            backgroundColor: "#10B981",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CheckCircleIcon sx={{ color: "white", fontSize: "3rem" }} />
        </Box>

        {/* Main Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: "#1F2937",
            mb: 2,
            fontSize: "2.5rem",
          }}
        >
          Booking Confirmed!
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body1"
          sx={{
            color: "#6B7280",
            fontSize: "1.125rem",
            mb: 3,
            lineHeight: 1.6,
          }}
        >
          Your booking has been successfully confirmed. You will receive a confirmation email shortly.
        </Typography>

        {/* Booking ID */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
          <Typography
            variant="body1"
            sx={{
              color: "#6B7280",
              fontWeight: 500,
            }}
          >
            Booking ID:
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#1F2937",
              fontWeight: 700,
              fontFamily: "monospace",
            }}
          >
            #{bookingId}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 6 }} />

      {/* Booking Details Card */}
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

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Provider */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#6B7280",
                  mb: 1,
                  fontWeight: 500,
                }}
              >
                Provider:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={providerData?.profileImage}
                  sx={{ width: 40, height: 40 }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    color: "#1F2937",
                    fontWeight: 600,
                  }}
                >
                  {providerData?.name || providerData?.businessName || 'Provider'}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#6B7280",
                  ml: 6,
                }}
              >
                Service: {providerData?.service || "Cleaning"}
              </Typography>
            </Box>

            {/* Service */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#6B7280",
                  mb: 1,
                  fontWeight: 500,
                }}
              >
                Service:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#1F2937",
                  fontWeight: 600,
                }}
              >
                Deep Cleaning
              </Typography>
            </Box>

            {/* Date & Time */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#6B7280",
                  mb: 1,
                  fontWeight: 500,
                }}
              >
                Date & Time:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#1F2937",
                  fontWeight: 600,
                }}
              >
                {formatDateTime()}
              </Typography>
            </Box>

            {/* Address */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#6B7280",
                  mb: 1,
                  fontWeight: 500,
                }}
              >
                Address:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#1F2937",
                  fontWeight: 600,
                }}
              >
                {bookingDetails?.address || "123 Main St, Anytown, USA"}
              </Typography>
            </Box>

            {/* Notes */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#6B7280",
                  mb: 1,
                  fontWeight: 500,
                }}
              >
                Notes:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#1F2937",
                  fontWeight: 600,
                }}
              >
                {bookingDetails?.notes || "Please bring your own cleaning supplies."}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Price Summary Card */}
      <Card sx={{ 
        backgroundColor: "#FFFFFF", 
        borderRadius: 3, 
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
        mb: 6,
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
            Price Summary
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Service Cost */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body1" sx={{ color: "#374151" }}>
                Service Cost (2 hrs x ${providerData?.hourlyRate || 60}/hr)
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: "#1F2937" }}>
                ${(providerData?.hourlyRate || 60) * 2}
              </Typography>
            </Box>

            {/* Service Fee */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body1" sx={{ color: "#374151" }}>
                Service Fee
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: "#1F2937" }}>
                $10.00
              </Typography>
            </Box>

            {/* Taxes */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body1" sx={{ color: "#374151" }}>
                Occupancy Taxes
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: "#1F2937" }}>
                $5.00
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Total */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1F2937" }}>
                Total
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1F2937" }}>
                ${(providerData?.hourlyRate || 60) * 2 + 15}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          justifyContent: "center",
          pb: 3,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="outlined"
          onClick={handleViewBookings}
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
          View My Bookings
        </Button>
        
        <Button
          variant="contained"
          onClick={() => navigate('/client-dashboard/task-details', {
            state: {
              providerData,
              bookingDetails,
              paymentMethod,
              bookingId,
              total
            }
          })}
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
          }}
        >
          Pay
        </Button>
        
        <Button
          variant="contained"
          onClick={handleBackToHome}
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
          Back to Home
        </Button>
      </Box>
    </Box>
  );
}
