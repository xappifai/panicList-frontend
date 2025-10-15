import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Pagination,
  CircularProgress,
  Alert,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { orderAPI } from "../services/apiService.js";

// Utility function to format dates safely (same as in Order.jsx)
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

// Utility function to get payment status color
const getPaymentStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return { bg: "#E1FBED", color: "#17C666" };
    case "pending":
      return { bg: "#FFEBD0", color: "#FFA21D" };
    case "failed":
      return { bg: "#FFE5E5", color: "#FF4444" };
    case "refunded":
      return { bg: "#E9ECEF", color: "#283C50" };
    default:
      return { bg: "#E9ECEF", color: "#283C50" };
  }
};

// Utility function to get work status color
const getWorkStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return { bg: "#E1FBED", color: "#17C666" };
    case "in_progress":
    case "confirmed":
      return { bg: "#EBEEFA", color: "#00ADB4" };
    case "pending":
      return { bg: "#FFEBD0", color: "#FFA21D" };
    case "cancelled":
      return { bg: "#FFE5E5", color: "#FF4444" };
    default:
      return { bg: "#E9ECEF", color: "#283C50" };
  }
};

const ROWS_PER_PAGE = 8;

export default function JobHistoryTable() {
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch orders data
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        limit: ROWS_PER_PAGE,
        offset: (page - 1) * ROWS_PER_PAGE,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      const response = await orderAPI.getMyOrders(filters);
      
      if (response.success) {
        setOrders(response.data.orders || []);
        setTotalPages(Math.ceil(response.data.total / ROWS_PER_PAGE));
      } else {
        throw new Error(response.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message || 'Failed to load job history');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when page changes
  useEffect(() => {
    fetchOrders();
  }, [page]);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #E5E7EB",
        borderRadius: "10px",
        py: 2,
        backgroundColor: "white",
        fontFamily: "Manrope, sans-serif",
      }}
    >
      {/* header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          px: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#283C50",
            fontFamily: "Manrope, sans-serif",
          }}
        >
          Job History
        </Typography>
        <IconButton size="small">
          <MoreVertIcon />
        </IconButton>
      </Box>

      {/* scrollable table container */}
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          flex: 1,
          bgcolor: "white",
          boxShadow: "none",
          overflowY: "auto",
        }}
      >
        <Table size="small" sx={{ minWidth: "100%" }}>
          <TableHead
            sx={{
              position: "sticky",
              top: 0,
              backgroundColor: "white",
              zIndex: 1,
            }}
          >
            <TableRow>
              {["SERVICE PROVIDERS", "PAYMENT", "DATE", "WORK STATUS", "ACTIONS"].map((label) => (
                <TableCell
                  key={label}
                  sx={{
                    fontWeight: 700,
                    color: "#283C50",
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ py: 4, textAlign: "center" }}>
                  <CircularProgress size={24} />
                  <Typography sx={{ mt: 2, color: "#6B7280", fontFamily: "Manrope, sans-serif" }}>
                    Loading job history...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ py: 4, textAlign: "center" }}>
                  <Alert severity="error" sx={{ fontFamily: "Manrope, sans-serif" }}>
                    {error}
                  </Alert>
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ py: 4, textAlign: "center" }}>
                  <Typography variant="body1" sx={{ color: "#6B7280", fontFamily: "Manrope, sans-serif" }}>
                    No job history found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order, idx) => {
                const paymentStatusColors = getPaymentStatusColor(order.paymentStatus);
                const workStatusColors = getWorkStatusColor(order.status);
                
                return (
                  <TableRow key={order.id || idx} sx={{ bgcolor: "#fff" }}>
                    <TableCell>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#283C50",
                          fontWeight: 600,
                          fontFamily: "Manrope, sans-serif",
                        }}
                      >
                        {order.serviceDetails?.title || 'Service'}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#6B7280",
                          fontFamily: "Manrope, sans-serif",
                        }}
                      >
                        Order #{order.orderNumber || order.id?.slice(-8)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.paymentStatus || 'pending'}
                        size="small"
                        sx={{
                          backgroundColor: paymentStatusColors.bg,
                          borderRadius: "3px",
                          color: paymentStatusColors.color,
                          fontWeight: 600,
                          fontFamily: "Manrope, sans-serif",
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "black",
                        fontFamily: "Manrope, sans-serif",
                      }}
                    >
                      {formatDate(order.bookingDetails?.scheduledDate || order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status || 'pending'}
                        size="small"
                        sx={{
                          borderRadius: "3px",
                          fontWeight: 600,
                          fontFamily: "Manrope, sans-serif",
                          backgroundColor: workStatusColors.bg,
                          color: workStatusColors.color,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2, pl: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#212832', // black for non-active
              },
              '& .Mui-selected': {
                color: '#fff',
                backgroundColor: '#00ADB4',
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
} 