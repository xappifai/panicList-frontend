import React, { useMemo, useState, useEffect } from "react";
import ProviderAuthGuard from "./ProviderAuthGuard";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Pagination,
  CircularProgress,
  Alert
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { orderAPI, userAPI, apiUtils } from "../../services/apiService.js";

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

const statusChip = (label, color) => (
  <Chip
    label={label}
    size="small"
    sx={{
      height: 22,
      fontSize: 12,
      backgroundColor: color.bg,
      color: color.fg,
      borderRadius: 1.5,
      fontWeight: 600,
    }}
  />
);

const STATUS_COLORS = {
  completed: { bg: "#E7F7EF", fg: "#10B981" },
  scheduled: { bg: "#E6F4FF", fg: "#3B82F6" },
  inProgress: { bg: "#FFF6E6", fg: "#F59E0B" },
  notInterested: { bg: "#FEE2E2", fg: "#EF4444" },
  new: { bg: "#F3F4F6", fg: "#6B7280" },
  returning: { bg: "#EDE9FE", fg: "#7C3AED" },
  sent: { bg: "#F3F4F6", fg: "#6B7280" },
};

export default function ClientsManagement() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [plan, setPlan] = useState("");
  const [page, setPage] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const ROWS_PER_PAGE = 10;

  // Get current provider ID
  const currentUser = apiUtils.getUser();
  const providerId = currentUser?.uid;

  // Group orders by customer and fetch client details
  const fetchProviderCustomers = async () => {
    if (!providerId) {
      setError('Provider ID not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all orders for this provider in batches (API limit is 100)
      let allOrders = [];
      let offset = 0;
      const batchSize = 100;
      let hasMoreOrders = true;
      let batchCount = 0;

      console.log('Starting to fetch provider orders in batches...');

      while (hasMoreOrders) {
        batchCount++;
        console.log(`Fetching batch ${batchCount}, offset: ${offset}`);
        
        const ordersResponse = await orderAPI.getOrdersByProvider(providerId, {
          limit: batchSize,
          offset: offset,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });

        if (!ordersResponse.success) {
          throw new Error(ordersResponse.message || 'Failed to fetch orders');
        }

        const batchOrders = ordersResponse.data.orders || [];
        allOrders = [...allOrders, ...batchOrders];
        
        console.log(`Batch ${batchCount}: Got ${batchOrders.length} orders, total so far: ${allOrders.length}`);

        // Check if we got fewer orders than requested (end of data)
        if (batchOrders.length < batchSize) {
          hasMoreOrders = false;
          console.log('Reached end of orders data');
        } else {
          offset += batchSize;
        }

        // Safety check to prevent infinite loops
        if (offset > 1000) {
          console.warn('Reached maximum offset limit, stopping pagination');
          hasMoreOrders = false;
        }
      }

      console.log(`Finished fetching orders. Total orders: ${allOrders.length}`);

      const orders = allOrders;
      
      // Group orders by customer ID
      console.log('Grouping orders by customer ID...');
      console.log('Sample order structure:', orders[0]); // Debug: show first order structure
      
      const customerGroups = {};
      orders.forEach((order, index) => {
        // Try multiple ways to get customer ID
        const customerId = order.clientId || 
                          order.clientDetails?.uid || 
                          order.clientDetails?.id ||
                          order.customerId ||
                          order.userId;
        
        console.log(`Order ${index}:`, {
          id: order.id,
          clientId: order.clientId,
          clientDetails: order.clientDetails,
          customerId: order.customerId,
          userId: order.userId,
          extractedCustomerId: customerId
        });
        
        if (customerId) {
          if (!customerGroups[customerId]) {
            customerGroups[customerId] = {
              customerId,
              orders: [],
              totalAmount: 0,
              orderCount: 0,
              latestOrderDate: null,
              statuses: new Set(),
              paymentStatuses: new Set()
            };
          }
          
          customerGroups[customerId].orders.push(order);
          customerGroups[customerId].totalAmount += order.paymentDetails?.amount || 0;
          customerGroups[customerId].orderCount += 1;
          
          // Track latest order date
          const orderDate = order.bookingDetails?.scheduledDate || order.createdAt;
          if (orderDate && (!customerGroups[customerId].latestOrderDate || 
              new Date(orderDate) > new Date(customerGroups[customerId].latestOrderDate))) {
            customerGroups[customerId].latestOrderDate = orderDate;
          }
          
          // Track statuses
          if (order.status) customerGroups[customerId].statuses.add(order.status);
          if (order.paymentStatus) customerGroups[customerId].paymentStatuses.add(order.paymentStatus);
        } else {
          console.warn('Order without customer ID:', {
            orderId: order.id,
            orderStructure: order
          });
        }
      });

      console.log(`Grouped orders into ${Object.keys(customerGroups).length} customers`);
      console.log('Customer groups:', customerGroups);

      // If no customers were grouped, show a fallback message
      if (Object.keys(customerGroups).length === 0) {
        console.error('No customers found after grouping orders');
        setError('No customers found. Please check the order data structure.');
        setLoading(false);
        return;
      }

      // Fetch client details for each customer
      console.log('Fetching client details for customers:', Object.keys(customerGroups));
      
      // Fetch client details for each customer from Firestore via backend
      
      const customerPromises = Object.keys(customerGroups).map(async (customerId) => {
        try {
          console.log(`Processing customer ID: ${customerId}`);
          console.log(`Sample order for this customer:`, customerGroups[customerId].orders[0]);
          
          // First, try to get client details from the order data (most reliable)
          const orderClientDetails = customerGroups[customerId].orders[0]?.clientDetails;
          console.log(`Order client details for ${customerId}:`, orderClientDetails);
          
          let clientDetails = {
            fullName: 'Unknown Client',
            email: 'No email',
            uid: customerId
          };
          
          // Fetch minimal fields (fullName, email, uid) via backend hitting Firestore
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

          // If still missing, fetch full user document via backend (still Firestore)
          if (clientDetails.fullName === 'Unknown Client' || clientDetails.email === 'No email') {
            try {
              const userResponse = await userAPI.getUserById(customerId);
              if (userResponse.success && userResponse.data) {
                const userData = userResponse.data;
                clientDetails = {
                  fullName: userData.fullName || clientDetails.fullName,
                  email: userData.email || clientDetails.email,
                  phoneNumber: userData.phoneNumber || '',
                  address: userData.address || {},
                  uid: userData.uid || customerId,
                  userType: userData.userType || 'client',
                  status: userData.status || 'active',
                  ...userData
                };
              }
            } catch (userError) {
              console.error(`User API failed for ${customerId}:`, userError);
            }
          }

          // Final fallback to order data if user doc not available
          if ((clientDetails.fullName === 'Unknown Client' || clientDetails.email === 'No email') && orderClientDetails) {
            clientDetails = {
              fullName: orderClientDetails.fullName || orderClientDetails.name || orderClientDetails.displayName || clientDetails.fullName,
              email: orderClientDetails.email || clientDetails.email,
              uid: customerId,
              ...orderClientDetails
            };
          }
            
            // If userAPI failed, try alternative approaches
            if (clientDetails.fullName === 'Unknown Client') {
              console.log(`Primary API failed, trying alternative methods for ${customerId}...`);
              
              // Try using the authAPI to get user by ID (if available)
              try {
                // Try to get user details using a different endpoint
                const altResponse = await fetch(`/api/auth/user/${customerId}`, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('firebaseToken')}`,
                    'Content-Type': 'application/json'
                  }
                });
                
                if (altResponse.ok) {
                  const altData = await altResponse.json();
                  console.log(`Alternative API response for ${customerId}:`, altData);
                  
                  if (altData.success && altData.data) {
                    const userData = altData.data;
                    clientDetails = {
                      fullName: userData.fullName || 'Unknown Client',
                      email: userData.email || 'No email',
                      phoneNumber: userData.phoneNumber || '',
                      address: userData.address || {},
                      uid: userData.uid || customerId,
                      userType: userData.userType || 'client',
                      status: userData.status || 'active',
                      ...userData
                    };
                    console.log(`Successfully using alternative API client details for ${customerId}:`, clientDetails);
                  }
                } else {
                  console.error(`Alternative API failed with status: ${altResponse.status}`);
                }
              } catch (altError) {
                console.error(`Alternative API call failed for ${customerId}:`, altError);
              }
              
              // If still no data, try using order data as fallback
              if (clientDetails.fullName === 'Unknown Client' && orderClientDetails) {
                console.log(`Using order client details as final fallback for ${customerId}`);
                clientDetails = {
                  fullName: orderClientDetails.fullName || 
                           orderClientDetails.name || 
                           orderClientDetails.displayName ||
                           'Unknown Client',
                  email: orderClientDetails.email || 'No email',
                  uid: customerId,
                  ...orderClientDetails
                };
                console.log(`Using order client details for ${customerId}:`, clientDetails);
              }
            }
          
          return {
            ...customerGroups[customerId],
            clientDetails: clientDetails,
            statuses: Array.from(customerGroups[customerId].statuses),
            paymentStatuses: Array.from(customerGroups[customerId].paymentStatuses)
          };
          
        } catch (error) {
          console.error(`Error processing customer ${customerId}:`, error);
          // Final fallback
          return {
            ...customerGroups[customerId],
            clientDetails: {
              fullName: 'Unknown Client',
              email: 'No email',
              uid: customerId
            },
            statuses: Array.from(customerGroups[customerId].statuses),
            paymentStatuses: Array.from(customerGroups[customerId].paymentStatuses)
          };
        }
      });

      const customersWithDetails = await Promise.all(customerPromises);
      console.log('Customers with details:', customersWithDetails);
      
      // Apply filters
      let filteredCustomers = customersWithDetails.filter(customer => {
        const matchesSearch = search ? 
          `${customer.clientDetails?.fullName || ''} ${customer.clientDetails?.email || ''}`
        .toLowerCase()
            .includes(search.toLowerCase()) : true;
        const matchesStatus = !status || customer.statuses.includes(status);
        const matchesPaymentStatus = !plan || customer.paymentStatuses.includes(plan);
        return matchesSearch && matchesStatus && matchesPaymentStatus;
      });

      console.log('Filtered customers:', filteredCustomers);

      // Sort by latest order date
      filteredCustomers.sort((a, b) => 
        new Date(b.latestOrderDate) - new Date(a.latestOrderDate)
      );

      // Apply pagination
      const startIndex = (page - 1) * ROWS_PER_PAGE;
      const endIndex = startIndex + ROWS_PER_PAGE;
      const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

      console.log('Final paginated customers:', paginatedCustomers);

      setCustomers(paginatedCustomers);
      setTotalCustomers(filteredCustomers.length);
      setTotalPages(Math.ceil(filteredCustomers.length / ROWS_PER_PAGE));

    } catch (error) {
      console.error('Error fetching provider customers:', error);
      setError(error.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchProviderCustomers();
  }, [page, search, status, plan, providerId]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (page !== 1) {
        setPage(1); // Reset to first page when searching
      } else {
        fetchProviderCustomers();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <ProviderAuthGuard>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827" }}>
              Client Management
            </Typography>
            <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
              {loading ? 'Loading...' : `${totalCustomers} total customers`}
          </Typography>
          </Box>
          <Button 
            variant="contained" 
            sx={{ textTransform: "none", background: "#00ADB4" }}
            onClick={fetchProviderCustomers}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        {/* Search */}
        <TextField
          placeholder="Search by client name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          aria-label="Search customers"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#9CA3AF" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            background: "#fff",
            borderRadius: 1,
            border: "1px solid #E5E7EB",
          }}
        />

        {/* Filters */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select displayEmpty value={category} onChange={(e) => setCategory(e.target.value)} sx={{ background: "#fff" }}>
              <MenuItem value=""><em>Service Category</em></MenuItem>
              <MenuItem value="plumbing">Plumbing</MenuItem>
              <MenuItem value="electrical">Electrical</MenuItem>
              <MenuItem value="cleaning">Cleaning</MenuItem>
              <MenuItem value="landscaping">Landscaping</MenuItem>
              <MenuItem value="painting">Painting</MenuItem>
              <MenuItem value="handyman">Handyman</MenuItem>
              <MenuItem value="hvac">HVAC</MenuItem>
              <MenuItem value="appliance">Appliance Repair</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select displayEmpty value={status} onChange={(e) => setStatus(e.target.value)} sx={{ background: "#fff" }}>
              <MenuItem value=""><em>Order Status</em></MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select displayEmpty value={plan} onChange={(e) => setPlan(e.target.value)} sx={{ background: "#fff" }}>
              <MenuItem value=""><em>Payment Status</em></MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="refunded">Refunded</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Customers table */}
        <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid #E5E7EB" }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: "#F9FAFB" }}>
                  <TableCell sx={{ fontWeight: 700, color: "#6B7280", textTransform: "uppercase", fontSize: 12 }}>Client ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#6B7280", textTransform: "uppercase", fontSize: 12 }}>Client Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#6B7280", textTransform: "uppercase", fontSize: 12 }}>Total Orders</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#6B7280", textTransform: "uppercase", fontSize: 12 }}>Total Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#6B7280", textTransform: "uppercase", fontSize: 12 }}>Payment Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#6B7280", textTransform: "uppercase", fontSize: 12 }}>Latest Order</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#6B7280", textTransform: "uppercase", fontSize: 12 }}>Order Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#6B7280", textTransform: "uppercase", fontSize: 12 }} align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ py: 4, textAlign: "center" }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ mt: 2, color: "#000000" }}>
                        Loading customers...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ py: 4, textAlign: "center" }}>
                      <Alert severity="error">
                        {error}
                      </Alert>
                    </TableCell>
                  </TableRow>
                ) : customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ py: 4, textAlign: "center" }}>
                      <Typography variant="body1" sx={{ color: "#000000" }}>
                        No customers found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer, idx) => {
                    const clientName = customer.clientDetails?.fullName || 'Unknown Client';
                    const clientEmail = customer.clientDetails?.email || '';
                    const totalAmount = customer.totalAmount || 0;
                    const orderCount = customer.orderCount || 0;
                    
                    // Get primary payment status (most common or latest)
                    const primaryPaymentStatus = customer.paymentStatuses.length > 0 ? 
                      customer.paymentStatuses[customer.paymentStatuses.length - 1] : 'pending';
                    
                    // Get primary order status (most common or latest)
                    const primaryOrderStatus = customer.statuses.length > 0 ? 
                      customer.statuses[customer.statuses.length - 1] : 'pending';
                    
                    return (
                      <TableRow key={customer.customerId || idx} hover sx={{ "&:nth-of-type(odd)": { backgroundColor: "#FCFCFD" } }}>
                        <TableCell sx={{ width: 150 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#000000" }}>
                            {customer.clientDetails?.uid || customer.customerId}
                          </Typography>
                        </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                            <Avatar sx={{ width: 28, height: 28 }}>
                              {clientName.charAt(0).toUpperCase()}
                            </Avatar>
                        <Box>
                              <Typography sx={{ fontWeight: 600, lineHeight: 1.2, color: "#000000" }}>
                                {clientName}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#6B7280" }}>
                                {clientEmail}
                              </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 600, color: "#3B82F6" }}>
                            {orderCount} orders
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 600, color: "#000000" }}>
                            ${totalAmount.toFixed(2)} USD
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {statusChip(
                            primaryPaymentStatus,
                            primaryPaymentStatus === 'paid' ? STATUS_COLORS.completed :
                            primaryPaymentStatus === 'pending' ? STATUS_COLORS.scheduled :
                            primaryPaymentStatus === 'failed' ? STATUS_COLORS.notInterested :
                            STATUS_COLORS.new
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#000000" }}>
                            {formatDate(customer.latestOrderDate)}
                          </Typography>
                        </TableCell>
                    <TableCell>
                          {statusChip(
                            primaryOrderStatus,
                            primaryOrderStatus === 'completed' ? STATUS_COLORS.completed :
                            primaryOrderStatus === 'in_progress' ? STATUS_COLORS.inProgress :
                            primaryOrderStatus === 'confirmed' ? STATUS_COLORS.scheduled :
                            primaryOrderStatus === 'cancelled' ? STATUS_COLORS.notInterested :
                            STATUS_COLORS.new
                          )}
                    </TableCell>
                    <TableCell sx={{ width: 70 }} align="right">
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
          {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 1.5 }}>
            <Pagination
                count={totalPages}
              page={page}
              onChange={(_, p) => setPage(p)}
              size="medium"
              color="primary"
              shape="rounded"
              variant="outlined"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#374151',
                  borderColor: '#D1D5DB',
                  fontWeight: 700,
                  minWidth: 40,
                  height: 40,
                },
                '& .MuiPaginationItem-root:hover': {
                  backgroundColor: '#F3F4F6',
                },
                '& .MuiPaginationItem-root.Mui-selected': {
                  backgroundColor: '#00ADB4',
                  borderColor: '#00ADB4',
                  color: '#fff',
                },
              }}
            />
          </Box>
          )}
        </Paper>

      </Box>
    </ProviderAuthGuard>
  );
}


