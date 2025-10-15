// src/components/ClientDashboard/TaskDetails.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Divider,
  Grid,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";

export default function TaskDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { providerData, bookingDetails, paymentMethod, bookingId, total } = location.state || {};

  const handleBack = () => {
    navigate(-1);
  };

  const handleContactProvider = () => {
    // Handle contact provider logic
    console.log("Contacting provider...");
  };

  const handleCancelTask = () => {
    // Handle cancel task logic
    console.log("Canceling task...");
  };

  // Format date for display
  const formatDate = () => {
    if (!bookingDetails?.date) return "Not specified";
    
    const date = new Date(bookingDetails.date);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <Box sx={{ 
      width: "100%", 
      maxWidth: "800px", 
      mx: "auto", 
      px: 3,
      py: 4 
    }}>
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
          <Typography sx={{ color: "#6B7280", fontWeight: 600 }}>Cleaning</Typography>
        </Box>
        
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1F2937",
            mb: 1,
          }}
        >
          Cleaning
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: "#6B7280",
            fontSize: "1rem",
          }}
        >
          Task ID: 123456789
        </Typography>
      </Box>

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
          
          <Box sx={{ mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={25}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "#E5E7EB",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#1F2937",
                  borderRadius: 4,
                },
              }}
            />
          </Box>
          
          <Typography
            variant="body1"
            sx={{
              color: "#1F2937",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            New
          </Typography>
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
                    {providerData?.name || "Emily Carter"}
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
                    {bookingDetails?.time || "10:00 AM"}
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
                    {bookingDetails?.address || "123 Maple Street, Anytown, USA"}
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
                    {formatDate()}
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
                    3 hours
                  </Typography>
                </Box>

                {/* Task Details */}
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                    <DescriptionIcon sx={{ color: "#6B7280", fontSize: "1.25rem" }} />
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
                    General house cleaning, including vacuuming, mopping, and dusting.
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
            Actions
          </Typography>

          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <Button
              variant="contained"
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
            
            <Button
              variant="contained"
              onClick={handleCancelTask}
              sx={{
                backgroundColor: "#9CA3AF",
                color: "#374151",
                textTransform: "none",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "#6B7280",
                },
              }}
            >
              Cancel Task
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
