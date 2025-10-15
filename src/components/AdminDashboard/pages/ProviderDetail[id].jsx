// src/components/AdminDashboard/pages/ProviderDetail[id].jsx
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

const ProviderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock provider data - in real app, this would come from API
  const provider = {
    id: "123456",
    name: "Sophia Clark",
    email: "sophia.clark@email.com",
    contact: "+1 (555) 123-4567",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    package: {
      title: "Monthly",
      status: "Pending",
      subscriptionDates: "July 15 - July 22, 2024"
    },
    services: [
      { name: "Plumbing", clients: 30, status: "Successful" },
      { name: "Electric", clients: 32, status: "Failed" }
    ],
    paymentHistory: [
      { date: "July 1, 2024", amount: "$1,250", status: "Withdraw" },
      { date: "July 15, 2024", amount: "$1,250", status: "Withdraw" }
    ]
  };

  const handleBackToProviders = () => {
    navigate("/admin-dashboard/providers");
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            href="#"
            onClick={handleBackToProviders}
            sx={{ 
              color: "#00ADB4", 
              cursor: "pointer",
              "&:hover": { color: "#009DA4" }
            }}
          >
            Providers
          </Link>
          <Typography sx={{ color: "#1F2937" }}>Provider Details</Typography>
        </Breadcrumbs>
      </Box>

      {/* Provider Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
        <Avatar
          src={provider.profileImage}
          sx={{
            width: 80,
            height: 80,
            border: "3px solid #E5E7EB"
          }}
        />
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1F2937",
              fontSize: "1.875rem",
              mb: 1
            }}
          >
            Provider #{provider.id}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToProviders}
            sx={{
              borderColor: "#D1D5DB",
              color: "#6B7280",
              textTransform: "none",
              "&:hover": {
                borderColor: "#9CA3AF",
                backgroundColor: "#F9FAFB"
              }
            }}
          >
            Back to Providers
          </Button>
        </Box>
      </Box>

      {/* User Info Section */}
      <Card sx={{ mb: 3, backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#1F2937",
              fontSize: "1.125rem",
              mb: 3
            }}
          >
            User Info
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6B7280",
                    fontSize: "0.875rem",
                    mb: 0.5
                  }}
                >
                  Name
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: "#1F2937",
                    fontSize: "1rem"
                  }}
                >
                  {provider.name}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6B7280",
                    fontSize: "0.875rem",
                    mb: 0.5
                  }}
                >
                  Contact
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: "#1F2937",
                    fontSize: "1rem"
                  }}
                >
                  {provider.contact}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6B7280",
                    fontSize: "0.875rem",
                    mb: 0.5
                  }}
                >
                  Email
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: "#1F2937",
                    fontSize: "1rem"
                  }}
                >
                  {provider.email}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Package Info Section */}
      <Card sx={{ mb: 3, backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#1F2937",
              fontSize: "1.125rem",
              mb: 3
            }}
          >
            Package Info
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6B7280",
                    fontSize: "0.875rem",
                    mb: 0.5
                  }}
                >
                  Title
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: "#1F2937",
                    fontSize: "1rem"
                  }}
                >
                  {provider.package.title}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6B7280",
                    fontSize: "0.875rem",
                    mb: 0.5
                  }}
                >
                  Status
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: "#1F2937",
                    fontSize: "1rem"
                  }}
                >
                  {provider.package.status}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6B7280",
                    fontSize: "0.875rem",
                    mb: 0.5
                  }}
                >
                  Subscription Dates
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: "#1F2937",
                    fontSize: "1rem"
                  }}
                >
                  {provider.package.subscriptionDates}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Services Section */}
      <Card sx={{ mb: 3, backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#1F2937",
              fontSize: "1.125rem",
              mb: 3
            }}
          >
            Services
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Clients</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {provider.services.map((service, index) => (
                  <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#F9FAFB" } }}>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#374151" }}>
                        {service.name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "#00ADB4",
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" }
                        }}
                      >
                        {service.clients}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: service.status === "Successful" ? "#10B981" : "#EF4444"
                        }}
                      >
                        {service.status}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Payment History Section */}
      <Card sx={{ backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#1F2937",
              fontSize: "1.125rem",
              mb: 3
            }}
          >
            Payment History
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {provider.paymentHistory.map((payment, index) => (
                  <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#F9FAFB" } }}>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#374151" }}>
                        {payment.date}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
                        {payment.amount}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: "#D1D5DB",
                          color: "#6B7280",
                          textTransform: "none",
                          fontSize: "0.75rem",
                          py: 0.5,
                          px: 2,
                          "&:hover": {
                            borderColor: "#9CA3AF",
                            backgroundColor: "#F9FAFB"
                          }
                        }}
                      >
                        {payment.status}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProviderDetail;
