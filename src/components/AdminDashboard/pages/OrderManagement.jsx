// src/components/AdminDashboard/pages/OrderManagement.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
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
  Menu,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { orderAPI, userAPI } from "../../../services/apiService";

const OrderManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const ROWS_PER_PAGE = 10;

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
      
      // Format the date
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      console.error('Date formatting error:', error, dateValue);
      return 'Invalid Date';
    }
  };

  // Fetch orders from the database
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch orders from the backend
      const response = await orderAPI.getAllOrders({
        limit: ROWS_PER_PAGE,
        offset: (currentPage - 1) * ROWS_PER_PAGE,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      if (response.success) {
        const ordersData = response.data?.orders || response.data || [];
        
        // Process orders data and fetch client/provider details
        const processedOrders = await Promise.all(ordersData.map(async (order, index) => {
          let clientName = 'Unknown Client';
          let providerName = 'Unknown Provider';
          let clientProfileImage = null;
          
          console.log(`Processing order ${index}:`, {
            orderId: order.id,
            clientId: order.clientId,
            providerId: order.providerId,
            clientDetails: order.clientDetails,
            customerId: order.customerId,
            userId: order.userId,
            allFields: Object.keys(order),
            amountFields: {
              pricing_totalAmount: order.pricing?.totalAmount,
              pricing_total: order.pricing?.total,
              paymentDetails_amount: order.paymentDetails?.amount,
              totalAmount: order.totalAmount,
              amount: order.amount,
              price: order.price,
              cost: order.cost,
              payment_amount: order.payment?.amount,
              billing_total: order.billing?.total,
              bookingDetails_totalAmount: order.bookingDetails?.totalAmount
            },
            fullOrderStructure: order
          });
          
          // Log all fields that might contain amounts
          console.log(`Order ${index} - All possible amount fields:`, {
            paymentDetails: order.paymentDetails,
            totalAmount: order.totalAmount,
            amount: order.amount,
            price: order.price,
            cost: order.cost,
            payment: order.payment,
            billing: order.billing,
            bookingDetails: order.bookingDetails,
            serviceDetails: order.serviceDetails,
            orderDetails: order.orderDetails,
            pricing: order.pricing,
            fees: order.fees,
            subtotal: order.subtotal,
            tax: order.tax,
            total: order.total
          });
          
          // Fetch client details - try multiple approaches
          try {
            // Try to get client ID from various possible fields
            const clientId = order.clientId || order.customerId || order.userId || order.client?.uid || order.client?.id;
            console.log(`Looking for client ID in order. Found: ${clientId}`);
            
            // First, try to get client name from order.clientDetails (most reliable)
            if (order.clientDetails && (order.clientDetails.fullName || order.clientDetails.name)) {
              clientName = order.clientDetails.fullName || order.clientDetails.name;
              console.log(`Client name from order.clientDetails: ${clientName}`);
            }
            // If not found in clientDetails, try API calls with any client ID we found
            else if (clientId) {
              console.log(`Fetching client details for clientId: ${clientId}`);
              
              // Try public API first
              try {
                const clientResponse = await userAPI.getPublicUserById(clientId);
                console.log(`Public client response for ${clientId}:`, clientResponse);
                
                if (clientResponse.success && clientResponse.data && clientResponse.data.fullName) {
                  clientName = clientResponse.data.fullName;
                  clientProfileImage = clientResponse.data.profileImage || clientResponse.data.avatar || null;
                  console.log(`Client name found via public API: ${clientName}`);
                  console.log(`Client profile image: ${clientProfileImage}`);
                } else {
                  throw new Error('Public API failed or no fullName');
                }
              } catch (publicErr) {
                console.log(`Public API failed for ${clientId}, trying full user API`);
                
                // Try full user API as fallback
                try {
                  const fullClientResponse = await userAPI.getUserById(clientId);
                  console.log(`Full client response for ${clientId}:`, fullClientResponse);
                  
                  if (fullClientResponse.success && fullClientResponse.data && fullClientResponse.data.fullName) {
                    clientName = fullClientResponse.data.fullName;
                    clientProfileImage = fullClientResponse.data.profileImage || fullClientResponse.data.avatar || null;
                    console.log(`Client name found via full API: ${clientName}`);
                    console.log(`Client profile image: ${clientProfileImage}`);
                  } else {
                    throw new Error('Full API also failed or no fullName');
                  }
                } catch (fullErr) {
                  console.log(`Both APIs failed for ${clientId}, using fallback`);
                  clientName = 'Unknown Client';
                }
              }
            } else {
              console.log(`No client ID found in order, using fallback`);
              clientName = 'Unknown Client';
            }
          } catch (err) {
            console.error('Error fetching client details:', err);
            clientName = 'Unknown Client';
          }

          // Fetch provider details
          try {
            if (order.providerId) {
              console.log(`Fetching provider details for providerId: ${order.providerId}`);
              
              // Try public API first
              try {
                const providerResponse = await userAPI.getPublicUserById(order.providerId);
                console.log(`Public provider response for ${order.providerId}:`, providerResponse);
                
                if (providerResponse.success && providerResponse.data) {
                  providerName = providerResponse.data.fullName || 'Unknown Provider';
                  console.log(`Provider name found via public API: ${providerName}`);
                } else {
                  throw new Error('Public API failed');
                }
              } catch (publicErr) {
                console.log(`Public API failed for ${order.providerId}, trying full user API`);
                
                // Try full user API as fallback
                try {
                  const fullProviderResponse = await userAPI.getUserById(order.providerId);
                  console.log(`Full provider response for ${order.providerId}:`, fullProviderResponse);
                  
                  if (fullProviderResponse.success && fullProviderResponse.data) {
                    providerName = fullProviderResponse.data.fullName || 'Unknown Provider';
                    console.log(`Provider name found via full API: ${providerName}`);
                  } else {
                    throw new Error('Full API also failed');
                  }
                } catch (fullErr) {
                  console.log(`Both APIs failed for ${order.providerId}`);
                  providerName = 'Unknown Provider';
                }
              }
            } else {
              console.log(`No providerId found in order`);
              providerName = 'Unknown Provider';
            }
          } catch (err) {
            console.error('Error fetching provider details:', err);
            providerName = 'Unknown Provider';
          }

          // Determine amount with debugging
          let amount = '$0';
          let amountSource = 'none';
          
          if (order.pricing?.totalAmount) {
            amount = `$${order.pricing.totalAmount}`;
            amountSource = 'pricing.totalAmount';
          } else if (order.paymentDetails?.amount) {
            amount = `$${order.paymentDetails.amount}`;
            amountSource = 'paymentDetails.amount';
          } else if (order.totalAmount) {
            amount = `$${order.totalAmount}`;
            amountSource = 'totalAmount';
          } else if (order.amount) {
            amount = `$${order.amount}`;
            amountSource = 'amount';
          } else if (order.price) {
            amount = `$${order.price}`;
            amountSource = 'price';
          } else if (order.cost) {
            amount = `$${order.cost}`;
            amountSource = 'cost';
          } else if (order.payment?.amount) {
            amount = `$${order.payment.amount}`;
            amountSource = 'payment.amount';
          } else if (order.billing?.total) {
            amount = `$${order.billing.total}`;
            amountSource = 'billing.total';
          } else if (order.bookingDetails?.totalAmount) {
            amount = `$${order.bookingDetails.totalAmount}`;
            amountSource = 'bookingDetails.totalAmount';
          } else if (order.serviceDetails?.price) {
            amount = `$${order.serviceDetails.price}`;
            amountSource = 'serviceDetails.price';
          } else if (order.orderDetails?.total) {
            amount = `$${order.orderDetails.total}`;
            amountSource = 'orderDetails.total';
          } else if (order.pricing?.total) {
            amount = `$${order.pricing.total}`;
            amountSource = 'pricing.total';
          } else if (order.fees?.total) {
            amount = `$${order.fees.total}`;
            amountSource = 'fees.total';
          } else if (order.subtotal) {
            amount = `$${order.subtotal}`;
            amountSource = 'subtotal';
          } else if (order.tax) {
            amount = `$${order.tax}`;
            amountSource = 'tax';
          } else if (order.total) {
            amount = `$${order.total}`;
            amountSource = 'total';
          }
          
          console.log(`Order ${index} amount: ${amount} (from ${amountSource})`);

          return {
            id: order.id || order._id || index,
            clientId: order.clientId || order.customerId || order.userId || order.client?.uid || order.client?.id || 'N/A',
            clientName: clientName,
            providerId: order.providerId || 'N/A',
            providerName: providerName,
            amount: amount,
            requestDate: formatDate(order.createdAt || order.bookingDetails?.scheduledDate),
            paymentStatus: order.paymentStatus === 'paid' ? 'Active' : 
                          order.paymentStatus === 'pending' ? 'Pending' : 
                          order.paymentStatus === 'failed' ? 'Suspended' : 'Pending',
            status: order.status || 'pending',
            avatar: clientName.charAt(0).toUpperCase(),
            hasImage: !!clientProfileImage,
            profileImage: clientProfileImage,
            orderData: order // Keep original order data for reference
          };
        }));

        setOrders(processedOrders);
        setTotalOrders(response.total || processedOrders.length);
        setTotalPages(Math.ceil((response.total || processedOrders.length) / ROWS_PER_PAGE));
      } else {
        throw new Error(response.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when page changes
  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return { backgroundColor: "#DBEAFE", color: "#1E40AF" };
      case "Pending":
        return { backgroundColor: "#F3F4F6", color: "#374151" };
      case "Suspended":
        return { backgroundColor: "#6B7280", color: "white" };
      default:
        return { backgroundColor: "#F3F4F6", color: "#374151" };
    }
  };

  const getAvatarColor = (name) => {
    const colors = ["#F59E0B", "#10B981", "#EF4444", "#8B5CF6", "#06B6D4"];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleMenuOpen = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleViewOrder = () => {
    console.log("View order clicked for:", selectedOrder);
    if (selectedOrder) {
      console.log("Navigating to:", `/admin-dashboard/orders/${selectedOrder.id}`);
      navigate(`/admin-dashboard/orders/${selectedOrder.id}`);
    }
    handleMenuClose();
  };

  const handleEditOrder = () => {
    console.log("Edit order:", selectedOrder);
    handleMenuClose();
  };

  const handleDeleteOrder = () => {
    console.log("Delete order:", selectedOrder);
    handleMenuClose();
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1F2937",
            fontSize: "1.875rem",
          }}
        >
          Order Management
        </Typography>
          <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
            {loading ? 'Loading...' : `${totalOrders} total orders`}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={fetchOrders}
          disabled={loading}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderColor: "#00ADB4",
            color: "#00ADB4",
            "&:hover": {
              borderColor: "#009DA4",
              backgroundColor: "#F0FDFA",
            },
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Search and Filters Section */}
      <Card sx={{ mb: 3, backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder="Search orders"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#6B7280" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flexGrow: 1,
                minWidth: 300,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#F9FAFB",
                  "&:hover": {
                    backgroundColor: "#F3F4F6",
                  },
                },
              }}
            />

            {/* Service Category Filter */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Service Category</InputLabel>
              <Select
                value={serviceCategory}
                label="Service Category"
                onChange={(e) => setServiceCategory(e.target.value)}
                sx={{
                  backgroundColor: "#F9FAFB",
                  "&:hover": {
                    backgroundColor: "#F3F4F6",
                  },
                }}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="cleaning">Cleaning</MenuItem>
                <MenuItem value="plumbing">Plumbing</MenuItem>
                <MenuItem value="electrical">Electrical</MenuItem>
                <MenuItem value="handyman">Handyman</MenuItem>
                <MenuItem value="gardening">Gardening</MenuItem>
                <MenuItem value="painting">Painting</MenuItem>
              </Select>
            </FormControl>

            {/* Location Filter */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Location</InputLabel>
              <Select
                value={location}
                label="Location"
                onChange={(e) => setLocation(e.target.value)}
                sx={{
                  backgroundColor: "#F9FAFB",
                  "&:hover": {
                    backgroundColor: "#F3F4F6",
                  },
                }}
              >
                <MenuItem value="">All Locations</MenuItem>
                <MenuItem value="new-york">New York</MenuItem>
                <MenuItem value="los-angeles">Los Angeles</MenuItem>
                <MenuItem value="chicago">Chicago</MenuItem>
                <MenuItem value="houston">Houston</MenuItem>
                <MenuItem value="phoenix">Phoenix</MenuItem>
              </Select>
            </FormControl>

            {/* Status Filter */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
                sx={{
                  backgroundColor: "#F9FAFB",
                  "&:hover": {
                    backgroundColor: "#F3F4F6",
                  },
                }}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card sx={{ backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Profile</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Client ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Client Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Provider ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Provider Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Request Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Payment Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ mt: 2, color: "#6B7280" }}>
                        Loading orders...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                      </Alert>
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" sx={{ color: "#6B7280" }}>
                        No orders found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                  <TableRow key={order.id} sx={{ "&:hover": { backgroundColor: "#F9FAFB" } }}>
                    <TableCell sx={{ py: 2 }}>
                      {order.hasImage && order.profileImage ? (
                        <Avatar
                          src={order.profileImage}
                          alt={order.clientName}
                          sx={{
                            width: 40,
                            height: 40,
                            border: "2px solid #E5E7EB"
                          }}
                        />
                      ) : (
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: getAvatarColor(order.clientName),
                            fontSize: "1rem",
                            fontWeight: 600,
                          }}
                        >
                          {order.avatar}
                        </Avatar>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#00ADB4" }}>
                        #{order.clientId}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
                        {order.clientName}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#00ADB4" }}>
                        #{order.providerId}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#374151" }}>
                          {order.providerName}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#10B981" }}>
                        {order.amount}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#374151" }}>
                        {order.requestDate}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={order.paymentStatus}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(order.paymentStatus).backgroundColor,
                          color: getStatusColor(order.paymentStatus).color,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          height: 24,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, order)}
                        sx={{ color: "#6B7280" }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
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

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            border: "1px solid #E5E7EB",
            backgroundColor: "#FFFFFF",
          },
        }}
      >
        <MenuItem onClick={handleViewOrder} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon>
            <ViewIcon sx={{ fontSize: 20, color: "#00ADB4" }} />
          </ListItemIcon>
          <ListItemText
            primary="View"
            sx={{
              "& .MuiTypography-root": {
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#1F2937"
              }
            }}
          />
        </MenuItem>
        <MenuItem onClick={handleEditOrder} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon>
            <EditIcon sx={{ fontSize: 20, color: "#F59E0B" }} />
          </ListItemIcon>
          <ListItemText
            primary="Edit"
            sx={{
              "& .MuiTypography-root": {
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#1F2937"
              }
            }}
          />
        </MenuItem>
        <MenuItem onClick={handleDeleteOrder} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon>
            <DeleteIcon sx={{ fontSize: 20, color: "#EF4444" }} />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            sx={{
              "& .MuiTypography-root": {
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#1F2937"
              }
            }}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default OrderManagement;
