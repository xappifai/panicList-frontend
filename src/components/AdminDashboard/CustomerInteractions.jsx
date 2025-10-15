// src/components/AdminDashboard/CustomerInteractions.jsx
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
import { orderAPI, userAPI } from "../../services/apiService";

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

const CustomerInteractions = () => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ROWS_PER_PAGE = 5;

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch recent orders from the backend
        const response = await orderAPI.getAllOrders({
          limit: 50, // Fetch more to handle pagination
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });

               if (response.success) {
                 const ordersData = response.data?.orders || response.data || [];
                 
                 // Group orders by customer and fetch client details
                 const customerGroups = {};
                 ordersData.forEach((order) => {
            const customerId = order.clientId || order.customerId || order.userId;
            if (customerId) {
              if (!customerGroups[customerId]) {
                customerGroups[customerId] = {
                  customerId,
                  orders: [],
                  latestOrderDate: null,
                  statuses: new Set()
                };
              }
              
              customerGroups[customerId].orders.push(order);
              
              // Track latest order date
              const orderDate = order.bookingDetails?.scheduledDate || order.createdAt;
              if (orderDate && (!customerGroups[customerId].latestOrderDate || 
                  new Date(orderDate) > new Date(customerGroups[customerId].latestOrderDate))) {
                customerGroups[customerId].latestOrderDate = orderDate;
              }
              
              // Track statuses
              if (order.status) customerGroups[customerId].statuses.add(order.status);
            }
          });

          // Fetch client details for each customer
          const customerPromises = Object.keys(customerGroups).map(async (customerId) => {
            try {
              let clientDetails = {
                fullName: 'Unknown Client',
                email: 'No email',
                uid: customerId
              };
              
              // Try to get client details from the order data first
              const orderClientDetails = customerGroups[customerId].orders[0]?.clientDetails;
              
              // Fetch minimal fields via backend
              try {
                const publicResponse = await userAPI.getPublicUserById(customerId);
                if (publicResponse.success && publicResponse.data) {
                  const publicData = publicResponse.data;
                  clientDetails = {
                    ...clientDetails,
                    uid: publicData.uid || customerId,
                    fullName: publicData.fullName || clientDetails.fullName,
                    email: publicData.email || clientDetails.email
                  };
                }
              } catch (publicErr) {
                console.error(`Public user API failed for ${customerId}:`, publicErr);
              }

              // If still missing, fetch full user document
              if (clientDetails.fullName === 'Unknown Client' || clientDetails.email === 'No email') {
                try {
                  const userResponse = await userAPI.getUserById(customerId);
                  if (userResponse.success && userResponse.data) {
                    const userData = userResponse.data;
                    clientDetails = {
                      fullName: userData.fullName || clientDetails.fullName,
                      email: userData.email || clientDetails.email,
                      uid: userData.uid || customerId,
                      ...userData
                    };
                  }
                } catch (userError) {
                  console.error(`User API failed for ${customerId}:`, userError);
                }
              }

              // Final fallback to order data
              if ((clientDetails.fullName === 'Unknown Client' || clientDetails.email === 'No email') && orderClientDetails) {
                clientDetails = {
                  fullName: orderClientDetails.fullName || orderClientDetails.name || clientDetails.fullName,
                  email: orderClientDetails.email || clientDetails.email,
                  uid: customerId,
                  ...orderClientDetails
                };
              }
              
              return {
                ...customerGroups[customerId],
                clientDetails: clientDetails,
                statuses: Array.from(customerGroups[customerId].statuses)
              };
              
            } catch (error) {
              console.error(`Error processing customer ${customerId}:`, error);
              return {
                ...customerGroups[customerId],
                clientDetails: {
                  fullName: 'Unknown Client',
                  email: 'No email',
                  uid: customerId
                },
                statuses: Array.from(customerGroups[customerId].statuses)
              };
            }
          });

          const customersWithDetails = await Promise.all(customerPromises);
          
          // Process interactions data
          const processedInteractions = customersWithDetails.map((customer, index) => {
            const clientName = customer.clientDetails?.fullName || 'Unknown Client';
            const clientEmail = customer.clientDetails?.email || 'No email';
            
            // Get primary order status (most common or latest)
            const primaryOrderStatus = customer.statuses.length > 0 ? 
              customer.statuses[customer.statuses.length - 1] : 'pending';
            
            // Determine reply status based on order status
            let replyStatus = 'New';
            if (primaryOrderStatus === 'completed') replyStatus = 'Sent';
            else if (primaryOrderStatus === 'in_progress') replyStatus = 'New';
            else if (primaryOrderStatus === 'cancelled') replyStatus = 'Returning';
            
            // Determine work status and color
            let workStatus = 'In Progress';
            let statusColor = '#8B5CF6';
            
            if (primaryOrderStatus === 'completed') {
              workStatus = 'Completed';
              statusColor = '#10B981';
            } else if (primaryOrderStatus === 'cancelled') {
              workStatus = 'Not Interested';
              statusColor = '#F59E0B';
            } else if (primaryOrderStatus === 'pending') {
              workStatus = 'Pending';
              statusColor = '#F59E0B';
            }

            return {
              id: customer.customerId || index,
              name: clientName,
              email: clientEmail,
              avatar: clientName.charAt(0).toUpperCase(),
              reply: replyStatus,
              date: formatDate(customer.latestOrderDate),
              workStatus: workStatus,
              statusColor: statusColor,
            };
          });

          // Sort by latest order date
          processedInteractions.sort((a, b) => 
            new Date(b.date) - new Date(a.date)
          );

          setInteractions(processedInteractions);
          setTotalPages(Math.ceil(processedInteractions.length / ROWS_PER_PAGE));
        } else {
          throw new Error(response.message || 'Failed to fetch interactions');
        }
      } catch (err) {
        console.error('Error fetching interactions:', err);
        setError(err.message || 'Failed to load interactions');
      } finally {
        setLoading(false);
      }
    };

    fetchInteractions();
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const paginatedInteractions = interactions.slice(
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
          Customer Interactions
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
                  REPLY
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
                  DATE
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
                  WORK STATUS
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
                      Loading interactions...
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
              ) : paginatedInteractions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" sx={{ color: "#6B7280" }}>
                      No interactions found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedInteractions.map((interaction) => (
                  <TableRow key={interaction.id} sx={{ "&:hover": { backgroundColor: "#F9FAFB" } }}>
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
                          {interaction.avatar}
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
                            {interaction.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#6B7280",
                              fontSize: "0.75rem",
                            }}
                          >
                            {interaction.email}
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
                        {interaction.reply}
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
                        {interaction.date}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #F3F4F6", py: 2 }}>
                      <Chip
                        label={interaction.workStatus}
                        size="small"
                        sx={{
                          backgroundColor: interaction.statusColor,
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

export default CustomerInteractions;
