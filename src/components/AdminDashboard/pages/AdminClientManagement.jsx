// src/components/AdminDashboard/pages/AdminClientManagement.jsx
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
import { userAPI } from "../../../services/apiService";

const AdminClientManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClients, setTotalClients] = useState(0);

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

  // Fetch clients from the database
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch clients from the backend (admin route)
      const response = await userAPI.getAdminClients(currentPage, ROWS_PER_PAGE);

      if (response.success) {
        const clientData = response.data || [];
        
        // Process client data
        const processedClients = clientData.map((client, index) => ({
          id: client.uid || client.id || index,
          name: client.fullName || 'Unknown Client',
          email: client.email || 'No email',
          serviceType: 'Client', // Clients don't have service types like providers
          paymentStatus: client.status === 'active' ? 'Active' : 
                        client.status === 'pending' ? 'Pending' : 'Suspended',
          registrationDate: formatDate(client.createdAt),
          avatar: (client.fullName || 'U').charAt(0).toUpperCase(),
          hasImage: false, // We'll set this based on actual image availability
          status: client.status || 'active',
          userType: client.userType || 'client'
        }));

        setClients(processedClients);
        setTotalClients(response.pagination?.total || processedClients.length);
        setTotalPages(response.pagination?.totalPages || Math.ceil(processedClients.length / ROWS_PER_PAGE));
      } else {
        throw new Error(response.message || 'Failed to fetch clients');
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when page changes
  useEffect(() => {
    fetchClients();
  }, [currentPage]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return { backgroundColor: "#00ADB4", color: "white" };
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

  const handleMenuOpen = (event, client) => {
    setAnchorEl(event.currentTarget);
    setSelectedClient(client);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedClient(null);
  };

  const handleViewClient = () => {
    if (selectedClient) {
      navigate(`/admin-dashboard/clients/${selectedClient.id}`);
    }
    handleMenuClose();
  };

  const handleEditClient = () => {
    // Handle edit functionality
    console.log("Edit client:", selectedClient);
    handleMenuClose();
  };

  const handleDeleteClient = () => {
    // Handle delete functionality
    console.log("Delete client:", selectedClient);
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
            Clients
          </Typography>
          <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
            {loading ? 'Loading...' : `${totalClients} total clients`}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={fetchClients}
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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin-dashboard/clients/add")}
            sx={{
              backgroundColor: "#00ADB4",
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1.5,
              "&:hover": {
                backgroundColor: "#009DA4",
              },
            }}
          >
            Add Client
          </Button>
        </Box>
      </Box>

      {/* Search and Filters Section */}
      <Card sx={{ mb: 3, backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
        <CardContent sx={{ p: 3 }}>
          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search clients"
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
              mb: 3,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#F9FAFB",
                "&:hover": {
                  backgroundColor: "#F3F4F6",
                },
              },
            }}
          />

          {/* Filters */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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

      {/* Clients Table */}
      <Card sx={{ backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Profile</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Provider ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Service Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Payment Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Registration Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ mt: 2, color: "#6B7280" }}>
                        Loading clients...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                      </Alert>
                    </TableCell>
                  </TableRow>
                ) : clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" sx={{ color: "#6B7280" }}>
                        No clients found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map((client) => (
                    <TableRow key={client.id} sx={{ "&:hover": { backgroundColor: "#F9FAFB" } }}>
                      <TableCell sx={{ py: 2 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: client.hasImage ? "#00ADB4" : getAvatarColor(client.name),
                            fontSize: "1rem",
                            fontWeight: 600,
                          }}
                        >
                          {client.avatar}
                        </Avatar>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#00ADB4" }}>
                          #{client.id}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
                          {client.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" sx={{ color: "#6B7280" }}>
                          {client.email}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" sx={{ color: "#374151" }}>
                          {client.serviceType}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          label={client.paymentStatus}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(client.paymentStatus).backgroundColor,
                            color: getStatusColor(client.paymentStatus).color,
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            height: 24,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" sx={{ color: "#374151" }}>
                          {client.registrationDate}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, client)}
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
        <MenuItem onClick={handleViewClient} sx={{ py: 1.5, px: 2 }}>
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
        <MenuItem onClick={handleEditClient} sx={{ py: 1.5, px: 2 }}>
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
        <MenuItem onClick={handleDeleteClient} sx={{ py: 1.5, px: 2 }}>
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

export default AdminClientManagement;
