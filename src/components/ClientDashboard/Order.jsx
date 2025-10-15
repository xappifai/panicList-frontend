// src/components/ClientDashboard/Order.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Pagination,
  PaginationItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { orderAPI } from "../../services/apiService.js";

// Utility function to format dates safely
const formatDate = (dateValue) => {
  if (!dateValue) return 'Not scheduled';
  
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
      // Check if it's a serialized Firestore timestamp (from JSON)
      else if (dateValue._firestore && dateValue._seconds !== undefined) {
        date = new Date(dateValue._seconds * 1000);
      }
    }
    // Handle timestamp numbers
    else if (typeof dateValue === 'number') {
      date = new Date(dateValue);
    }
    // Handle strings
    else if (typeof dateValue === 'string') {
      // Try parsing as ISO string first
      date = new Date(dateValue);
      
      // If that fails, try parsing as timestamp string
      if (isNaN(date.getTime())) {
        const timestamp = parseInt(dateValue);
        if (!isNaN(timestamp)) {
          date = new Date(timestamp);
        }
      }
    }
    
    // Check if the date is valid
    if (!date || isNaN(date.getTime())) {
      console.warn('Invalid date format:', dateValue);
      return 'Invalid Date';
    }
    
    // Format the date
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Date formatting error:', error, dateValue);
    return 'Invalid Date';
  }
};

// Mock data for orders
const mockOrders = [
  {
    id: 1,
    profile: { name: "Sophia Clark", avatar: "/images/avatar1.jpg", initial: "S" },
    provider: "Sophia Clark",
    serviceType: "Cleaning",
    paymentStatus: "Active",
    date: "2023-01-15",
    workStatus: "Completed",
  },
  {
    id: 2,
    profile: { name: "Ethan Bennett", avatar: "/images/avatar2.jpg", initial: "E" },
    provider: "Ethan Bennett",
    serviceType: "Plumbing",
    paymentStatus: "Pending",
    date: "2023-02-20",
    workStatus: "Completed",
  },
  {
    id: 3,
    profile: { name: "Ava Evans", avatar: "/images/avatar3.jpg", initial: "A" },
    provider: "Ava Evans",
    serviceType: "Electrical",
    paymentStatus: "Active",
    date: "2023-03-10",
    workStatus: "Completed",
  },
  {
    id: 4,
    profile: { name: "Isabella Green", avatar: "/images/avatar4.jpg", initial: "I" },
    provider: "Isabella Green",
    serviceType: "Handyman",
    paymentStatus: "Suspended",
    date: "2023-04-05",
    workStatus: "Completed",
  },
  {
    id: 5,
    profile: { name: "Mia Ingram", avatar: "/images/avatar5.jpg", initial: "M" },
    provider: "Mia Ingram",
    serviceType: "Gardening",
    paymentStatus: "Active",
    date: "2023-05-12",
    workStatus: "Completed",
  },
  {
    id: 6,
    profile: { name: "Olivia Carter", avatar: null, initial: "K" },
    provider: "Olivia Carter",
    serviceType: "Painting",
    paymentStatus: "Pending",
    date: "2023-06-18",
    workStatus: "Completed",
  },
  {
    id: 7,
    profile: { name: "Noah Foster", avatar: null, initial: "K" },
    provider: "Noah Foster",
    serviceType: "Cleaning",
    paymentStatus: "Active",
    date: "2023-07-22",
    workStatus: "Completed",
  },
  {
    id: 8,
    profile: { name: "Jackson Hayes", avatar: null, initial: "K" },
    provider: "Jackson Hayes",
    serviceType: "Plumbing",
    paymentStatus: "Active",
    date: "2023-08-30",
    workStatus: "Completed",
  },
  {
    id: 9,
    profile: { name: "Lucas Jenkins", avatar: null, initial: "H" },
    provider: "Lucas Jenkins",
    serviceType: "Electrical",
    paymentStatus: "Pending",
    date: "2023-09-14",
    workStatus: "Completed",
  },
  {
    id: 10,
    profile: { name: "Liam Davis", avatar: null, initial: "H" },
    provider: "Liam Davis",
    serviceType: "Handyman",
    paymentStatus: "Active",
    date: "2023-10-08",
    workStatus: "Completed",
  },
];

// Statistics data
const statsData = [
  { title: "Completed Jobs", value: "12", color: "#10B981" },
  { title: "Active Jobs", value: "5", color: "#3B82F6" },
  { title: "Pending Payment", value: "2", color: "#F59E0B" },
  { title: "Cancelled Jobs", value: "3", color: "#EF4444" },
];

export default function Order() {
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [upcoming, setUpcoming] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Fetch orders data
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        limit: 10,
        offset: (page - 1) * 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      // Add filters if selected
      if (status) filters.status = status;
      if (serviceCategory) filters.category = serviceCategory;

      const response = await orderAPI.getMyOrders(filters);
      
      if (response.success) {
        const ordersData = response.data.orders || [];
        console.log('Orders data received:', ordersData);
        // Log the first order's date format for debugging
        if (ordersData.length > 0) {
          const firstOrder = ordersData[0];
          const scheduledDate = firstOrder.bookingDetails?.scheduledDate;
          console.log('First order date format:', {
            scheduledDate: scheduledDate,
            type: typeof scheduledDate,
            isObject: typeof scheduledDate === 'object',
            hasSeconds: scheduledDate?.seconds !== undefined,
            hasNanoseconds: scheduledDate?.nanoseconds !== undefined,
            hasToDate: typeof scheduledDate?.toDate === 'function',
            hasUnderscoreSeconds: scheduledDate?._seconds !== undefined,
            formatted: formatDate(scheduledDate)
          });
        }
        setOrders(ordersData);
        setTotalPages(Math.ceil(response.data.total / 10));
      } else {
        throw new Error(response.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await orderAPI.getUserOrderStatistics();
      
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchOrders();
  }, [page, status, serviceCategory]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return { bg: "#D1FAE5", text: "#10B981" };
      case "pending":
        return { bg: "#FFFBEB", text: "#F59E0B" };
      case "failed":
        return { bg: "#FEE2E2", text: "#EF4444" };
      case "refunded":
        return { bg: "#F3F4F6", text: "#6B7280" };
      default:
        return { bg: "#F3F4F6", text: "#6B7280" };
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "completed":
        return { bg: "#D1FAE5", text: "#10B981" };
      case "in_progress":
        return { bg: "#E0E7FF", text: "#3B82F6" };
      case "confirmed":
        return { bg: "#FEF3C7", text: "#F59E0B" };
      case "pending":
        return { bg: "#FFFBEB", text: "#F59E0B" };
      case "cancelled":
        return { bg: "#FEE2E2", text: "#EF4444" };
      default:
        return { bg: "#F3F4F6", text: "#6B7280" };
    }
  };

  const handleOrderClick = (order) => {
    navigate(`/client-dashboard/service-tracking/${order.id}`, { 
      state: { orderData: order } 
    });
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
        My Orders
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats ? (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 2,
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  border: "1px solid #E5E7EB",
                }}
              >
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6B7280",
                      fontSize: "0.875rem",
                      mb: 1,
                    }}
                  >
                    Total Orders
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: "#1F2937",
                      fontSize: "2rem",
                    }}
                  >
                    {stats.total}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 2,
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  border: "1px solid #E5E7EB",
                }}
              >
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6B7280",
                      fontSize: "0.875rem",
                      mb: 1,
                    }}
                  >
                    Completed
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: "#10B981",
                      fontSize: "2rem",
                    }}
                  >
                    {stats.byStatus?.completed || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 2,
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  border: "1px solid #E5E7EB",
                }}
              >
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6B7280",
                      fontSize: "0.875rem",
                      mb: 1,
                    }}
                  >
                    In Progress
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: "#3B82F6",
                      fontSize: "2rem",
                    }}
                  >
                    {stats.byStatus?.in_progress || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 2,
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  border: "1px solid #E5E7EB",
                }}
              >
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6B7280",
                      fontSize: "0.875rem",
                      mb: 1,
                    }}
                  >
                    Pending
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: "#F59E0B",
                      fontSize: "2rem",
                    }}
                  >
                    {stats.byStatus?.pending || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <Card sx={{ p: 3, textAlign: "center" }}>
              <CircularProgress />
              <Typography sx={{ mt: 2, color: "#6B7280" }}>
                Loading statistics...
              </Typography>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Search and Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
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
            minWidth: "250px",
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
            <MenuItem value="cleaning" sx={{ color: "#1F2937" }}>Cleaning</MenuItem>
            <MenuItem value="plumbing" sx={{ color: "#1F2937" }}>Plumbing</MenuItem>
            <MenuItem value="electrical" sx={{ color: "#1F2937" }}>Electrical</MenuItem>
            <MenuItem value="handyman" sx={{ color: "#1F2937" }}>Handyman</MenuItem>
            <MenuItem value="gardening" sx={{ color: "#1F2937" }}>Gardening</MenuItem>
            <MenuItem value="painting" sx={{ color: "#1F2937" }}>Painting</MenuItem>
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
            value={upcoming}
            onChange={(e) => setUpcoming(e.target.value)}
            displayEmpty
            IconComponent={KeyboardArrowDownIcon}
            sx={{ color: "#374151" }}
          >
            <MenuItem value="" sx={{ color: "#6B7280" }}>Upcoming</MenuItem>
            <MenuItem value="today" sx={{ color: "#1F2937" }}>Today</MenuItem>
            <MenuItem value="week" sx={{ color: "#1F2937" }}>This Week</MenuItem>
            <MenuItem value="month" sx={{ color: "#1F2937" }}>This Month</MenuItem>
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
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            displayEmpty
            IconComponent={KeyboardArrowDownIcon}
            sx={{ color: "#374151" }}
          >
            <MenuItem value="" sx={{ color: "#6B7280" }}>Status</MenuItem>
            <MenuItem value="active" sx={{ color: "#1F2937" }}>Active</MenuItem>
            <MenuItem value="pending" sx={{ color: "#1F2937" }}>Pending</MenuItem>
            <MenuItem value="suspended" sx={{ color: "#1F2937" }}>Suspended</MenuItem>
            <MenuItem value="completed" sx={{ color: "#1F2937" }}>Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Orders Table */}
      <Card
        sx={{
          backgroundColor: "#FFFFFF",
          borderRadius: 2,
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#FFFFFF" }}>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    color: "#6B7280", 
                    py: 2,
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  Profile
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    color: "#6B7280", 
                    py: 2,
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  Provider
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    color: "#6B7280", 
                    py: 2,
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  Service Type
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    color: "#6B7280", 
                    py: 2,
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  Payment Status
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    color: "#6B7280", 
                    py: 2,
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  Date
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    color: "#6B7280", 
                    py: 2,
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  Work Status
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    color: "#6B7280", 
                    py: 2,
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ py: 4, textAlign: "center" }}>
                    <CircularProgress />
                    <Typography sx={{ mt: 2, color: "#6B7280" }}>
                      Loading orders...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ py: 4, textAlign: "center" }}>
                    <Alert severity="error">
                      {error}
                    </Alert>
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ py: 4, textAlign: "center" }}>
                    <Typography variant="body1" sx={{ color: "#6B7280" }}>
                      No orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow
                    key={order.id}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#F9FAFB",
                      },
                      borderBottom: "1px solid #F3F4F6",
                    }}
                    onClick={() => handleOrderClick(order)}
                  >
                    {/* Profile Column - Service Title */}
                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: "#00ADB4",
                            color: "white",
                            fontWeight: 600,
                          }}
                        >
                          {order.serviceDetails?.title?.charAt(0)?.toUpperCase() || 
                           order.serviceDetails?.category?.charAt(0)?.toUpperCase() || 
                           'S'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ color: "#374151", fontWeight: 500 }}>
                            {order.serviceDetails?.title || 'Service'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#6B7280" }}>
                            Order #{order.orderNumber || order.id?.slice(-8)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    {/* Provider Column */}
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#374151" }}>
                        {order.providerName || `Provider ${order.providerId?.slice(-8)}`}
                      </Typography>
                    </TableCell>
                    
                    {/* Service Type Column */}
                    <TableCell sx={{ py: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#2563EB",
                          fontWeight: 500,
                        }}
                      >
                        {order.serviceDetails?.category || 'General Service'}
                      </Typography>
                    </TableCell>
                    
                    {/* Payment Status Column */}
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={order.paymentStatus || 'pending'}
                        sx={{
                          backgroundColor: getPaymentStatusColor(order.paymentStatus || 'pending').bg,
                          color: getPaymentStatusColor(order.paymentStatus || 'pending').text,
                          fontWeight: 500,
                          fontSize: "0.75rem",
                        }}
                      />
                    </TableCell>
                    
                    {/* Date Column */}
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#374151" }}>
                        {formatDate(order.bookingDetails?.scheduledDate)}
                      </Typography>
                      {order.bookingDetails?.scheduledTime && (
                        <Typography variant="caption" sx={{ color: "#6B7280", display: "block" }}>
                          {order.bookingDetails.scheduledTime}
                        </Typography>
                      )}
                    </TableCell>
                    
                    {/* Work Status Column */}
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={order.status || 'pending'}
                        sx={{
                          backgroundColor: getOrderStatusColor(order.status || 'pending').bg,
                          color: getOrderStatusColor(order.status || 'pending').text,
                          fontWeight: 500,
                          fontSize: "0.75rem",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <IconButton size="small">
                        <MoreVertIcon sx={{ color: "#374151" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#00ADB4",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#009DA4",
                    },
                  },
                  "&:not(.Mui-selected)": {
                    color: "#374151",
                    "&:hover": {
                      backgroundColor: "#F3F4F6",
                    },
                  },
                }}
              />
            )}
          />
        </Box>
      )}
    </Box>
  );
}
