// src/components/AdminDashboard/pages/OrderDetail[id].jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  Grid,
  Card,
  CardContent,
  Breadcrumbs,
  Link,
  Chip,
  IconButton,
} from "@mui/material";
import { 
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  Home as HomeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  CreditCard as CreditCardIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
} from "@mui/icons-material";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  console.log("OrderDetail component rendered with ID:", id);

  // Mock order data - in real app, this would come from API
  const order = {
    id: "123456",
    orderDate: "July 22, 2024",
    serviceType: "Plumbing, Electric",
    status: "Pending",
    paymentMethod: "Credit Card",
    paymentDate: "July 22, 2024",
    billingAddress: "Los Andanes",
    client: {
      id: "123456",
      name: "Sophia Clark",
      contact: "+1 (555) 123-4567",
      email: "sophia.clark@email.com",
      address: "Los Andanes",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    provider: {
      id: "123456",
      name: "Sophia Clark",
      contact: "+1 (555) 123-4567",
      email: "sophia.clark@email.com",
      address: "Los Andanes",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    }
  };

  const handleBackToOrders = () => {
    navigate("/admin-dashboard/orders");
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { bg: '#FEF3C7', color: '#D97706', icon: <PendingIcon sx={{ fontSize: 16 }} /> };
      case 'completed':
        return { bg: '#D1FAE5', color: '#059669', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> };
      case 'cancelled':
        return { bg: '#FEE2E2', color: '#DC2626', icon: <PendingIcon sx={{ fontSize: 16 }} /> };
      default:
        return { bg: '#E0E7FF', color: '#3730A3', icon: <PendingIcon sx={{ fontSize: 16 }} /> };
    }
  };

  const statusStyle = getStatusColor(order.status);

  return (
    <Box sx={{ 
      p: 3, 
      backgroundColor: "#F8FAFC",
      minHeight: "100vh"
    }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs 
          aria-label="breadcrumb" 
          separator=" / "
          sx={{
            "& .MuiBreadcrumbs-separator": {
              color: "#94A3B8",
              mx: 1
            }
          }}
        >
          <Link
            underline="hover"
            color="inherit"
            href="#"
            onClick={handleBackToOrders}
            sx={{
              color: "#64748B",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&:hover": { 
                color: "#00ADB4",
                textDecoration: "none"
              },
              transition: "color 0.2s ease"
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            Orders
          </Link>
          <Typography sx={{ 
            color: "#334155", 
            fontSize: "0.875rem",
            fontWeight: 600
          }}>
            Order Details
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Main Content Area - 2x3 Grid Layout */}
      {/* Top Row: Client Details and Provider Details (2 cards) */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Client Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: "#FFFFFF", 
            borderRadius: 4, 
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            height: "100%",
            border: "1px solid #E2E8F0",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              transform: "translateY(-2px)"
            }
          }}>
            <CardContent sx={{ p: 0 }}>
              {/* Header Section with Avatar and Title */}
              <Box sx={{ 
                p: 4, 
                pb: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "16px 16px 0 0",
                color: "white"
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Avatar
                    src={order.client.profileImage}
                    sx={{
                      width: 80,
                      height: 80,
                      border: "4px solid rgba(255, 255, 255, 0.3)",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
                    }}
                  />
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.5rem",
                        mb: 0.5
                      }}
                    >
                      Client #{order.client.id}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.9,
                        fontSize: "0.875rem"
                      }}
                    >
                      Customer Information
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Client Info Section */}
              <Box sx={{ p: 4, pt: 3 }}>
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1, 
                  mb: 3,
                  color: "#667eea"
                }}>
                  <PersonIcon sx={{ fontSize: 20 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1E293B",
                      fontSize: "1.125rem"
                    }}
                  >
                    Client Info
                  </Typography>
                </Box>

                {/* Two Column Layout for Info */}
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <PersonIcon sx={{ fontSize: 16, color: "#64748B" }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748B",
                            fontSize: "0.875rem",
                            fontWeight: 500
                          }}
                        >
                          Name
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#1E293B",
                          fontSize: "1rem",
                          fontWeight: 600
                        }}
                      >
                        {order.client.name}
                      </Typography>
                    </Box>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <PhoneIcon sx={{ fontSize: 16, color: "#64748B" }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748B",
                            fontSize: "0.875rem",
                            fontWeight: 500
                          }}
                        >
                          Contact
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#1E293B",
                          fontSize: "1rem",
                          fontWeight: 600
                        }}
                      >
                        {order.client.contact}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <EmailIcon sx={{ fontSize: 16, color: "#64748B" }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748B",
                            fontSize: "0.875rem",
                            fontWeight: 500
                          }}
                        >
                          Email
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#1E293B",
                          fontSize: "1rem",
                          fontWeight: 600
                        }}
                      >
                        {order.client.email}
                      </Typography>
                    </Box>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <LocationIcon sx={{ fontSize: 16, color: "#64748B" }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748B",
                            fontSize: "0.875rem",
                            fontWeight: 500
                          }}
                        >
                          Address
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#1E293B",
                          fontSize: "1rem",
                          fontWeight: 600
                        }}
                      >
                        {order.client.address}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Provider Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: "#FFFFFF", 
            borderRadius: 4, 
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            height: "100%",
            border: "1px solid #E2E8F0",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              transform: "translateY(-2px)"
            }
          }}>
            <CardContent sx={{ p: 0 }}>
              {/* Header Section with Avatar and Title */}
              <Box sx={{ 
                p: 4, 
                pb: 3,
                background: "linear-gradient(135deg, #00ADB4 0%, #009DA4 100%)",
                borderRadius: "16px 16px 0 0",
                color: "white"
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Avatar
                    src={order.provider.profileImage}
                    sx={{
                      width: 80,
                      height: 80,
                      border: "4px solid rgba(255, 255, 255, 0.3)",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
                    }}
                  />
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.5rem",
                        mb: 0.5
                      }}
                    >
                      Provider #{order.provider.id}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.9,
                        fontSize: "0.875rem"
                      }}
                    >
                      Service Provider
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Provider Info Section */}
              <Box sx={{ p: 4, pt: 3 }}>
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1, 
                  mb: 3,
                  color: "#00ADB4"
                }}>
                  <BusinessIcon sx={{ fontSize: 20 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1E293B",
                      fontSize: "1.125rem"
                    }}
                  >
                    Provider Info
                  </Typography>
                </Box>

                {/* Two Column Layout for Info */}
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <PersonIcon sx={{ fontSize: 16, color: "#64748B" }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748B",
                            fontSize: "0.875rem",
                            fontWeight: 500
                          }}
                        >
                          Name
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#1E293B",
                          fontSize: "1rem",
                          fontWeight: 600
                        }}
                      >
                        {order.provider.name}
                      </Typography>
                    </Box>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <PhoneIcon sx={{ fontSize: 16, color: "#64748B" }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748B",
                            fontSize: "0.875rem",
                            fontWeight: 500
                          }}
                        >
                          Contact
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#1E293B",
                          fontSize: "1rem",
                          fontWeight: 600
                        }}
                      >
                        {order.provider.contact}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <EmailIcon sx={{ fontSize: 16, color: "#64748B" }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748B",
                            fontSize: "0.875rem",
                            fontWeight: 500
                          }}
                        >
                          Email
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#1E293B",
                          fontSize: "1rem",
                          fontWeight: 600
                        }}
                      >
                        {order.provider.email}
                      </Typography>
                    </Box>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <LocationIcon sx={{ fontSize: 16, color: "#64748B" }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748B",
                            fontSize: "0.875rem",
                            fontWeight: 500
                          }}
                        >
                          Address
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#1E293B",
                          fontSize: "1rem",
                          fontWeight: 600
                        }}
                      >
                        {order.provider.address}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Row: Order Details, Payment Details, and Additional Card (3 cards) */}
      <Grid container spacing={3}>
        {/* Payment Details */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            backgroundColor: "#FFFFFF", 
            borderRadius: 4, 
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            height: "100%",
            border: "1px solid #E2E8F0",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              transform: "translateY(-2px)"
            }
          }}>
            <CardContent sx={{ p: 0 }}>
              {/* Header Section with Icon and Title */}
              <Box sx={{ 
                p: 4, 
                pb: 3,
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                borderRadius: "16px 16px 0 0",
                color: "white"
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "4px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
                  }}>
                    <PaymentIcon sx={{ fontSize: 40, color: "white" }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.5rem",
                        mb: 0.5
                      }}
                    >
                      Payment #{order.id}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.9,
                        fontSize: "0.875rem"
                      }}
                    >
                      Transaction Details
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Payment Info Section */}
              <Box sx={{ p: 4, pt: 3 }}>
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1, 
                  mb: 3,
                  color: "#10B981"
                }}>
                  <PaymentIcon sx={{ fontSize: 20 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1E293B",
                      fontSize: "1.125rem"
                    }}
                  >
                    Payment Info
                  </Typography>
                </Box>

                {/* Two Column Layout for Payment Info */}
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <CreditCardIcon sx={{ fontSize: 16, color: "#64748B" }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748B",
                            fontSize: "0.875rem",
                            fontWeight: 500
                          }}
                        >
                          Payment Method
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#1E293B",
                          fontSize: "1rem",
                          fontWeight: 600
                        }}
                      >
                        {order.paymentMethod}
                      </Typography>
                    </Box>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <AssignmentIcon sx={{ fontSize: 16, color: "#64748B" }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748B",
                            fontSize: "0.875rem",
                            fontWeight: 500
                          }}
                        >
                          Status
                        </Typography>
                      </Box>
                      <Chip
                        label={order.status}
                        icon={statusStyle.icon}
                        sx={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          height: 28
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <CalendarIcon sx={{ fontSize: 16, color: "#64748B" }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748B",
                            fontSize: "0.875rem",
                            fontWeight: 500
                          }}
                        >
                          Payment Date
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#1E293B",
                          fontSize: "1rem",
                          fontWeight: 600
                        }}
                      >
                        {order.paymentDate}
                      </Typography>
                    </Box>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <HomeIcon sx={{ fontSize: 16, color: "#64748B" }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748B",
                            fontSize: "0.875rem",
                            fontWeight: 500
                          }}
                        >
                          Billing Address
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#1E293B",
                          fontSize: "1rem",
                          fontWeight: 600
                        }}
                      >
                        {order.billingAddress}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Detail */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            backgroundColor: "#FFFFFF", 
            borderRadius: 4, 
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            height: "100%",
            border: "1px solid #E2E8F0",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              transform: "translateY(-2px)"
            }
          }}>
            <CardContent sx={{ p: 0 }}>
              {/* Header Section with Icon and Title */}
              <Box sx={{ 
                p: 4, 
                pb: 3,
                background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                borderRadius: "16px 16px 0 0",
                color: "white"
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "4px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
                  }}>
                    <ReceiptIcon sx={{ fontSize: 40, color: "white" }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.5rem",
                        mb: 0.5
                      }}
                    >
                      Order #{order.id}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.9,
                        fontSize: "0.875rem"
                      }}
                    >
                      Service Order
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Order Info Section */}
              <Box sx={{ p: 4, pt: 3 }}>
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1, 
                  mb: 3,
                  color: "#F59E0B"
                }}>
                  <ReceiptIcon sx={{ fontSize: 20 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1E293B",
                      fontSize: "1.125rem"
                    }}
                  >
                    Order Info
                  </Typography>
                </Box>

                {/* Two Column Layout for Order Info */}
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <CalendarIcon sx={{ fontSize: 16, color: "#64748B" }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748B",
                            fontSize: "0.875rem",
                            fontWeight: 500
                          }}
                        >
                          Order Date
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#1E293B",
                          fontSize: "1rem",
                          fontWeight: 600
                        }}
                      >
                        {order.orderDate}
                      </Typography>
                    </Box>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <AssignmentIcon sx={{ fontSize: 16, color: "#64748B" }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748B",
                            fontSize: "0.875rem",
                            fontWeight: 500
                          }}
                        >
                          Status
                        </Typography>
                      </Box>
                      <Chip
                        label={order.status}
                        icon={statusStyle.icon}
                        sx={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          height: 28
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <AssignmentIcon sx={{ fontSize: 16, color: "#64748B" }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748B",
                            fontSize: "0.875rem",
                            fontWeight: 500
                          }}
                        >
                          Order ID
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#1E293B",
                          fontSize: "1rem",
                          fontWeight: 600
                        }}
                      >
                        #{order.id}
                      </Typography>
                    </Box>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <AssignmentIcon sx={{ fontSize: 16, color: "#64748B" }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748B",
                            fontSize: "0.875rem",
                            fontWeight: 500
                          }}
                        >
                          Service Type
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#1E293B",
                          fontSize: "1rem",
                          fontWeight: 600
                        }}
                      >
                        {order.serviceType}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetail;
