// src/components/ClientDashboard/BookingConfirmation.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Avatar,
  FormControlLabel,
  Checkbox,
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DatePicker, TimePicker } from "rsuite";
import {
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Note as NoteIcon,
  CreditCard as CreditCardIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import { orderAPI } from "../../services/apiService.js";
import { stripeService } from "../../services/stripeService.js";
import { useUser } from "../../contexts/UserContext.jsx";

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const providerData = location.state?.providerData || null;

  // If provider data is missing, show a friendly message but avoid crashing later
  const safeProvider = providerData || { listings: [], name: 'Provider', businessName: 'Provider' };

  const [selectedListing, setSelectedListing] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    date: null,
    time: null,
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    },
    notes: "",
    duration: "", // hours
  });

  // Auto-fill user data when component mounts
  useEffect(() => {
    if (user) {
      // Auto-fill address from user profile
      if (user.address) {
        setBookingDetails(prev => ({
          ...prev,
          address: {
            street: user.address.street || "",
            city: user.address.city || "",
            state: user.address.state || "",
            zipCode: user.address.zipCode || "",
            country: user.address.country || ""
          }
        }));
      }
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState({
    visa: true,
    cardNumber: "1234",
  });

  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Set default listing when component mounts
  useEffect(() => {
    if (safeProvider.listings && safeProvider.listings.length > 0) {
      setSelectedListing(safeProvider.listings[0]);
    }
  }, [safeProvider.listings]);

  const handleInputChange = (field, value) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setBookingDetails(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
    setBookingDetails(prev => ({
      ...prev,
      [field]: value
    }));
    }
  };

  const handleListingChange = (listingId) => {
    const listing = safeProvider.listings.find(l => l.id === listingId);
    setSelectedListing(listing);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);


      // Debug: Log current booking details
      console.log('=== BOOKING VALIDATION DEBUG ===');
      console.log('selectedListing:', selectedListing);
      console.log('bookingDetails:', bookingDetails);
      console.log('bookingDetails.date:', bookingDetails.date, 'type:', typeof bookingDetails.date);
      console.log('bookingDetails.time:', bookingDetails.time, 'type:', typeof bookingDetails.time);
      console.log('bookingDetails.address:', bookingDetails.address, 'type:', typeof bookingDetails.address);
      console.log('================================');

      // Validate required fields
      if (!selectedListing) {
        throw new Error('Please select a service');
      }
      if (!bookingDetails.date) {
        throw new Error('Please select a date');
      }
      if (!bookingDetails.time) {
        throw new Error('Please select a time');
      }
      if (!bookingDetails.duration || bookingDetails.duration === '') {
        throw new Error('Please select duration');
      }
      // Check if at least one address field is filled
      const hasAddress = bookingDetails.address && (
        bookingDetails.address.street?.trim() ||
        bookingDetails.address.city?.trim() ||
        bookingDetails.address.state?.trim() ||
        bookingDetails.address.zipCode?.trim() ||
        bookingDetails.address.country?.trim()
      );
      
      if (!hasAddress) {
        throw new Error('Please enter a service address');
      }

      // Calculate pricing
      const baseAmount = selectedListing.pricing?.amount || 0;
      const duration = bookingDetails.duration || 1;
      const subtotal = baseAmount * duration;
      const taxes = subtotal * 0.1; // 10% tax
      const totalAmount = subtotal + taxes;

      // Create order data
      const orderData = {
        providerId: providerData.id,
        listingId: selectedListing.id,
        serviceDetails: {
          title: selectedListing.title,
          category: selectedListing.category,
          description: selectedListing.description,
          pricing: selectedListing.pricing
        },
        bookingDetails: {
          scheduledDate: bookingDetails.date.toISOString(),
          scheduledTime: bookingDetails.time.toTimeString().slice(0, 5), // HH:MM format
          duration: parseInt(bookingDetails.duration),
          address: [
            bookingDetails.address.street,
            bookingDetails.address.city,
            bookingDetails.address.state,
            bookingDetails.address.zipCode,
            bookingDetails.address.country
          ].filter(Boolean).join(', '),
          notes: bookingDetails.notes || '',
          specialInstructions: ''
        },
        pricing: {
          baseAmount: subtotal,
          taxes: taxes,
          fees: 0,
          discounts: 0,
          totalAmount: totalAmount,
          currency: selectedListing.pricing?.currency || 'USD'
        }
      };

      // Create the order
      const response = await orderAPI.createOrder(orderData);
      
      if (response.success) {
        setSuccess('Order created successfully! Redirecting to payment...');
        
        // Start payment process
        setPaymentLoading(true);
        
        try {
          // Create Stripe payment session for the order
          await stripeService.createOrderPaymentSession(response.data.id);
        } catch (paymentError) {
          console.error('Payment error:', paymentError);
          setError('Failed to initiate payment. Please try again.');
          setPaymentLoading(false);
          return;
        }
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setError(error.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedListing) {
      return { subtotal: 0, taxes: 0, total: 0 };
    }
    
    const baseAmount = selectedListing.pricing?.amount || 0;
    const duration = parseInt(bookingDetails.duration) || 1;
    const subtotal = baseAmount * duration;
    const taxes = subtotal * 0.1; // 10% tax
    const total = subtotal + taxes;
    
    return { subtotal, taxes, total };
  };

  const { subtotal, taxes, total } = calculateTotal();

  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      {/* Header */}
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
            Back
          </Button>
          <Typography sx={{ color: "#6B7280" }}>/</Typography>
          <Typography sx={{ color: "#6B7280" }}>Confirm</Typography>
        </Box>
        
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1F2937",
          }}
        >
          Enter Detail
        </Typography>
      </Box>

      {/* Error and Success Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={4} sx={{ width: "100%" }}>
        {/* Left Column - Booking Form */}
        <Grid item xs={12} lg={8} sx={{ width: "100%" }}>
          {/* Task Details */}
          <Card sx={{ mb: 4, backgroundColor: "#FFFFFF", borderRadius: 2, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", width: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#1F2937",
                  mb: 3,
                }}
              >
                Task Details
              </Typography>
              
              {/* Service Selection */}
              {safeProvider.listings && safeProvider.listings.length > 1 && (
                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth>
                    <Select
                      value={selectedListing?.id || ''}
                      onChange={(e) => handleListingChange(e.target.value)}
                      displayEmpty
                      sx={{
                        backgroundColor: "#F9FAFB",
                        color: "#1F2937",
                        "& fieldset": {
                          borderColor: "#E5E7EB",
                        },
                        "&:hover fieldset": {
                          borderColor: "#D1D5DB",
                        },
                        "& .MuiSelect-select": {
                          color: "#1F2937",
                        },
                      }}
                    >
                      <MenuItem 
                        value="" 
                        disabled
                        sx={{ 
                          color: "#6B7280",
                          "&.Mui-disabled": {
                            color: "#9CA3AF"
                          }
                        }}
                      >
                        Select a service
                      </MenuItem>
                      {safeProvider.listings.map((listing) => (
                        <MenuItem 
                          key={listing.id} 
                          value={listing.id}
                          sx={{ 
                            color: "#1F2937",
                            "&:hover": {
                              backgroundColor: "#F3F4F6",
                              color: "#1F2937"
                            },
                            "&.Mui-selected": {
                              backgroundColor: "#E0F2FE",
                              color: "#0369A1",
                              "&:hover": {
                                backgroundColor: "#BAE6FD"
                              }
                            }
                          }}
                        >
                          {listing.title} - ${listing.pricing?.amount || 0}/{listing.pricing?.type || 'hour'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}
              
              <Grid container spacing={3}>
                {/* Service */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: "#00ADB4",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <HomeIcon sx={{ color: "white", fontSize: "1.5rem" }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: "#1F2937",
                        }}
                      >
                        {selectedListing?.title || providerData.service}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#6B7280",
                        }}
                      >
                        {selectedListing?.category || providerData.serviceType}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Provider */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      src={providerData.profileImage}
                      sx={{ width: 48, height: 48 }}
                    />
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: "#1F2937",
                        }}
                      >
                        Provider
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#6B7280",
                        }}
                      >
                        {providerData.name}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* When Section */}
          <Card sx={{ mb: 4, backgroundColor: "#FFFFFF", borderRadius: 2, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", width: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: "#00ADB4",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CalendarIcon sx={{ color: "white", fontSize: "1.5rem" }} />
                </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#1F2937",
                }}
              >
                When
              </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <DatePicker
                    value={bookingDetails.date}
                    onChange={(value) => handleInputChange("date", value)}
                    placeholder="Select date"
                    format="yyyy-MM-dd"
                    disabledDate={(date) => date < new Date().setHours(0, 0, 0, 0)}
                    style={{
                      width: "100%",
                      backgroundColor: "#F9FAFB",
                      border: "1px solid #E5E7EB",
                      borderRadius: "4px",
                      padding: "8px 12px",
                      fontSize: "16px",
                      color: "#1F2937",
                    }}
                    cleanable={false}
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TimePicker
                    value={bookingDetails.time}
                    onChange={(value) => handleInputChange("time", value)}
                    placeholder="Select time"
                    format="HH:mm"
                    style={{
                      width: "100%",
                      backgroundColor: "#F9FAFB",
                      border: "1px solid #E5E7EB",
                      borderRadius: "4px",
                      padding: "8px 12px",
                      fontSize: "16px",
                      color: "#1F2937",
                    }}
                    cleanable={false}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Select
                    value={bookingDetails.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    displayEmpty
                    fullWidth
                    sx={{
                      backgroundColor: "#F9FAFB",
                      color: "#1F2937",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#D1D5DB",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#00ADB4",
                      },
                      "& .MuiSelect-select": {
                        color: "#1F2937",
                        padding: "16.5px 14px",
                      },
                      "& .MuiSelect-icon": {
                        color: "#6B7280",
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: "#FFFFFF",
                          "& .MuiMenuItem-root": {
                            color: "#1F2937",
                            "&:hover": {
                              backgroundColor: "#F3F4F6",
                            },
                            "&.Mui-selected": {
                              backgroundColor: "#E0F7FA",
                              color: "#00ADB4",
                            },
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select duration</em>
                    </MenuItem>
                    {Array.from({ length: 24 }, (_, i) => i + 1).map((hour) => (
                      <MenuItem key={hour} value={hour}>
                        {hour} {hour === 1 ? 'hour' : 'hours'}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
              
            </CardContent>
          </Card>

          {/* Where Section */}
          <Card sx={{ mb: 4, backgroundColor: "#FFFFFF", borderRadius: 2, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", width: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: "#00ADB4",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LocationIcon sx={{ color: "white", fontSize: "1.5rem" }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#1F2937",
                  }}
                >
                  Where
                </Typography>
              </Box>
              
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Street Address"
                  value={bookingDetails.address.street}
                  onChange={(e) => handleInputChange("address.street", e.target.value)}
                    fullWidth
                  placeholder="Enter street address"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                        <LocationIcon sx={{ color: "#6B7280" }} />
                        </InputAdornment>
                      ),
                    }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F9FAFB",
                      color: "#1F2937",
                      "& fieldset": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D1D5DB",
                      },
                      "& input": {
                        color: "#1F2937",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6B7280",
                      "&.Mui-focused": {
                        color: "#00ADB4",
                      },
                    },
                  }}
                />
                
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    label="City"
                    value={bookingDetails.address.city}
                    onChange={(e) => handleInputChange("address.city", e.target.value)}
                    fullWidth
                    placeholder="City"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#F9FAFB",
                        color: "#1F2937",
                        "& fieldset": {
                          borderColor: "#E5E7EB",
                        },
                        "&:hover fieldset": {
                          borderColor: "#D1D5DB",
                        },
                        "& input": {
                          color: "#1F2937",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#6B7280",
                        "&.Mui-focused": {
                          color: "#00ADB4",
                        },
                      },
                    }}
                  />
                  <TextField
                    label="State"
                    value={bookingDetails.address.state}
                    onChange={(e) => handleInputChange("address.state", e.target.value)}
                    fullWidth
                    placeholder="State"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#F9FAFB",
                        color: "#1F2937",
                        "& fieldset": {
                          borderColor: "#E5E7EB",
                        },
                        "&:hover fieldset": {
                          borderColor: "#D1D5DB",
                        },
                        "& input": {
                          color: "#1F2937",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#6B7280",
                        "&.Mui-focused": {
                          color: "#00ADB4",
                        },
                      },
                    }}
                  />
                  <TextField
                    label="ZIP Code"
                    value={bookingDetails.address.zipCode}
                    onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
                    fullWidth
                    placeholder="ZIP Code"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#F9FAFB",
                        color: "#1F2937",
                        "& fieldset": {
                          borderColor: "#E5E7EB",
                        },
                        "&:hover fieldset": {
                          borderColor: "#D1D5DB",
                        },
                        "& input": {
                          color: "#1F2937",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#6B7280",
                        "&.Mui-focused": {
                          color: "#00ADB4",
                        },
                      },
                    }}
                  />
                </Box>
              
              <TextField
                  label="Country"
                  value={bookingDetails.address.country}
                  onChange={(e) => handleInputChange("address.country", e.target.value)}
                fullWidth
                  placeholder="Country"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#F9FAFB",
                      color: "#1F2937",
                    "& fieldset": {
                      borderColor: "#E5E7EB",
                    },
                    "&:hover fieldset": {
                      borderColor: "#D1D5DB",
                    },
                      "& input": {
                        color: "#1F2937",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6B7280",
                      "&.Mui-focused": {
                        color: "#00ADB4",
                    },
                  },
                }}
              />
                
                {user?.address && (
                  <Typography variant="caption" sx={{ color: "#6B7280", mt: 1 }}>
                    Address auto-filled from your profile. You can edit any field as needed.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card sx={{ mb: 4, backgroundColor: "#FFFFFF", borderRadius: 2, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", width: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: "#00ADB4",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <NoteIcon sx={{ color: "white", fontSize: "1.5rem" }} />
                </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#1F2937",
                }}
              >
                  Additional Notes
              </Typography>
              </Box>
              
              <TextField
                label="Notes"
                multiline
                rows={4}
                value={bookingDetails.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                fullWidth
                placeholder="Add any special instructions or comments..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1 }}>
                      <NoteIcon sx={{ color: "#6B7280" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#F9FAFB",
                    color: "#1F2937",
                    "& fieldset": {
                      borderColor: "#E5E7EB",
                    },
                    "&:hover fieldset": {
                      borderColor: "#D1D5DB",
                    },
                    "& textarea": {
                      color: "#1F2937",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#6B7280",
                    "&.Mui-focused": {
                      color: "#00ADB4",
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Price Summary & Payment Combined */}
        <Grid item xs={12} lg={4} sx={{ width: "100%" }}>
          <Card sx={{ backgroundColor: "#FFFFFF", borderRadius: 2, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", width: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              {/* Price Summary Section */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#1F2937",
                  mb: 3,
                }}
              >
                Price Summary
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="body1" sx={{ color: "#374151" }}>
                    {selectedListing?.title || providerData.service}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: "#1F2937" }}>
                    ${selectedListing?.pricing?.amount || providerData.startingPrice}
                  </Typography>
                </Box>
                
                {bookingDetails.duration > 1 && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      Duration: {bookingDetails.duration} hours
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      ${subtotal}
                    </Typography>
                  </Box>
                )}
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="body1" sx={{ color: "#374151" }}>
                    Subtotal
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: "#1F2937" }}>
                    ${subtotal}
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="body1" sx={{ color: "#374151" }}>
                    Taxes
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: "#1F2937" }}>
                    ${taxes}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  mb: 2,
                  p: 2,
                  backgroundColor: "#F3F4F6",
                  borderRadius: 2,
                  border: "2px solid #00ADB4"
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1F2937" }}>
                    Total Amount
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#00ADB4" }}>
                    ${total}
                  </Typography>
                </Box>
              </Box>

              {/* Payment Method Section removed */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          mt: 4,
          pb: 3,
          width: "100%",
        }}
      >
        <Button
          variant="outlined"
          onClick={handleBack}
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
          Back
        </Button>
        
        <Button
          variant="contained"
          startIcon={<PaymentIcon />}
          onClick={handleConfirm}
          disabled={loading || paymentLoading || !selectedListing}
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
            "&:disabled": {
              backgroundColor: "#9CA3AF",
            },
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
              Creating Order...
            </>
          ) : paymentLoading ? (
            <>
              <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
              Redirecting to Payment...
            </>
          ) : (
            "Pay Now"
          )}
        </Button>
      </Box>
    </Box>
  );
}
