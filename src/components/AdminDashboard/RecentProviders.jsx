// src/components/AdminDashboard/RecentProviders.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Pagination,
  CircularProgress,
  Alert,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import { userAPI } from "../../services/apiService";

// Utility function to format dates safely
const formatDate = (dateValue) => {
  if (!dateValue) return 'N/A';
  
  try {
    let date;
    
    // Handle Firestore timestamp objects
    if (dateValue && typeof dateValue === 'object') {
      // Check if it's a Firestore timestamp (has seconds and nanoseconds)
      if (dateValue.seconds !== undefined && dateValue.nanoseconds !== undefined) {
        // Convert Firestore timestamp to JavaScript Date
        date = new Date(dateValue.seconds * 1000 + dateValue.nanoseconds / 1000000);
      }
      // Check if it's a Firestore timestamp with toDate method
      else if (typeof dateValue.toDate === 'function') {
        date = dateValue.toDate();
      }
      // Check if it's a regular Date object
      else if (dateValue instanceof Date) {
        date = dateValue;
      }
      // Check if it has a _seconds property (another Firestore timestamp format)
      else if (dateValue._seconds !== undefined) {
        date = new Date(dateValue._seconds * 1000);
      }
    }
    // Handle timestamp numbers
    else if (typeof dateValue === 'number') {
      date = new Date(dateValue);
    }
    // Handle strings
    else if (typeof dateValue === 'string') {
      date = new Date(dateValue);
    }
    
    // Check if the date is valid
    if (!date || isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    // Format the date and time
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('Date formatting error:', error, dateValue);
    return 'Invalid Date';
  }
};

const RecentProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ROWS_PER_PAGE = 5;

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch providers from the backend (admin route - no filtering)
        console.log('Fetching providers with admin route...');
        console.log('Current user from localStorage:', localStorage.getItem('user'));
        console.log('Firebase token from localStorage:', localStorage.getItem('firebaseToken'));
        const response = await userAPI.getAdminProviders(1, 50);
        console.log('Admin providers response:', response);

        if (response.success) {
          const providerData = response.data || [];
          
          // Process provider data
          const processedProviders = providerData.map((provider, index) => ({
            id: provider.uid || provider.id || index,
            name: provider.fullName || 'Unknown Provider',
            email: provider.email || 'No email',
            avatar: (provider.fullName || 'U').charAt(0).toUpperCase(),
            plan: provider.subscription?.plan || 'Free',
            subscriptionDate: formatDate(provider.createdAt),
            paymentStatus: provider.subscription?.status === 'active' ? 'Active' : 'Inactive',
            statusColor: provider.subscription?.status === 'active' ? '#10B981' : '#F59E0B',
            status: provider.status || 'active',
            userType: provider.userType || 'provider'
          }));

          setProviders(processedProviders);
          setTotalPages(Math.ceil(processedProviders.length / ROWS_PER_PAGE));
        } else {
          throw new Error(response.message || 'Failed to fetch providers');
        }
      } catch (err) {
        console.error('Error fetching providers:', err);
        setError(err.message || 'Failed to load providers');
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const paginatedProviders = providers.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );
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
          Recent Providers
        </Typography>

        <TableContainer sx={{ 
          overflowX: "auto",
          "& .MuiTable-root": {
            minWidth: { xs: 650, lg: "auto" }
          }
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#6B7280",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid #E5E7EB",
                    py: 2,
                  }}
                >
                  USERS
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#6B7280",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid #E5E7EB",
                    py: 2,
                  }}
                >
                  PLAN
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#6B7280",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid #E5E7EB",
                    py: 2,
                  }}
                >
                  DATE OF SUBSCRIPTION
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#6B7280",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid #E5E7EB",
                    py: 2,
                  }}
                >
                  PAYMENT STATUS
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#6B7280",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid #E5E7EB",
                    py: 2,
                  }}
                >
                  ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress size={24} />
                    <Typography sx={{ mt: 2, color: "#6B7280" }}>
                      Loading providers...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  </TableCell>
                </TableRow>
              ) : paginatedProviders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" sx={{ color: "#6B7280" }}>
                      No providers found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProviders.map((provider) => (
                  <TableRow key={provider.id} sx={{ "&:hover": { backgroundColor: "#F9FAFB" } }}>
                    <TableCell sx={{ borderBottom: "1px solid #F3F4F6", py: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: "#00ADB4",
                            fontSize: "1rem",
                            fontWeight: 600,
                          }}
                        >
                          {provider.avatar}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "#1F2937",
                              fontSize: "0.875rem",
                            }}
                          >
                            {provider.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#6B7280",
                              fontSize: "0.75rem",
                            }}
                          >
                            {provider.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #F3F4F6", py: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#374151",
                          fontSize: "0.875rem",
                        }}
                      >
                        {provider.plan}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #F3F4F6", py: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#374151",
                          fontSize: "0.875rem",
                        }}
                      >
                        {provider.subscriptionDate}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #F3F4F6", py: 2 }}>
                      <Chip
                        label={provider.paymentStatus}
                        size="small"
                        sx={{
                          backgroundColor: provider.statusColor,
                          color: "white",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          height: 24,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #F3F4F6", py: 2 }}>
                      <IconButton size="small" sx={{ color: "#6B7280" }}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
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
      </CardContent>
    </Card>
  );
};

export default RecentProviders;
