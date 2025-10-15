// src/components/AdminDashboard/pages/SubscriptionPayment.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  CalendarToday as CalendarIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";

const SubscriptionPayment = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("free");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock subscription data
  const subscriptionData = {
    monthlySubscriptions: 1250,
    yearlySubscriptions: 350,
    freeUsers: 5000,
    totalRevenue: 15000,
    churnRate: 2.5,
  };

  // Mock payment logs data
  const paymentLogs = [
    {
      id: 1,
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      providerId: "12345",
      name: "Sophia Clark",
      email: "sophia.clark@email.com",
      serviceType: "Cleaning",
      paymentStatus: "Failed",
      registrationDate: "2023-01-15",
    },
    {
      id: 2,
      profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      providerId: "12346",
      name: "Ethan Bennett",
      email: "ethan.bennett@email.com",
      serviceType: "Plumbing",
      paymentStatus: "Pending",
      registrationDate: "2023-02-20",
    },
    {
      id: 3,
      profileImage: null,
      profileInitial: "K",
      providerId: "12347",
      name: "Olivia Carter",
      email: "olivia.carter@email.com",
      serviceType: "Electrical",
      paymentStatus: "Active",
      registrationDate: "2023-03-10",
    },
    {
      id: 4,
      profileImage: null,
      profileInitial: "H",
      providerId: "12348",
      name: "Liam Davis",
      email: "liam.davis@email.com",
      serviceType: "Handyman",
      paymentStatus: "Suspended",
      registrationDate: "2023-04-05",
    },
    {
      id: 5,
      profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      providerId: "12349",
      name: "Ava Evans",
      email: "ava.evans@email.com",
      serviceType: "Gardening",
      paymentStatus: "Active",
      registrationDate: "2023-05-12",
    },
    {
      id: 6,
      profileImage: null,
      profileInitial: "K",
      providerId: "12350",
      name: "Noah Foster",
      email: "noah.foster@email.com",
      serviceType: "Painting",
      paymentStatus: "Pending",
      registrationDate: "2023-06-18",
    },
    {
      id: 7,
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      providerId: "12351",
      name: "Isabella Green",
      email: "isabella.green@email.com",
      serviceType: "Cleaning",
      paymentStatus: "Active",
      registrationDate: "2023-07-22",
    },
    {
      id: 8,
      profileImage: null,
      profileInitial: "K",
      providerId: "12352",
      name: "Jackson Hayes",
      email: "jackson.hayes@email.com",
      serviceType: "Plumbing",
      paymentStatus: "Active",
      registrationDate: "2023-08-30",
    },
    {
      id: 9,
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      providerId: "12353",
      name: "Mia Ingram",
      email: "mia.ingram@email.com",
      serviceType: "Electrical",
      paymentStatus: "Suspended",
      registrationDate: "2023-09-15",
    },
    {
      id: 10,
      profileImage: null,
      profileInitial: "K",
      providerId: "12354",
      name: "Lucas Jenkins",
      email: "lucas.jenkins@email.com",
      serviceType: "Handyman",
      paymentStatus: "Active",
      registrationDate: "2023-10-01",
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return { bg: '#F3F4F6', color: '#374151' };
      case 'pending':
        return { bg: '#DBEAFE', color: '#1E40AF' };
      case 'failed':
        return { bg: '#DBEAFE', color: '#1E40AF' };
      case 'suspended':
        return { bg: '#DBEAFE', color: '#1E40AF' };
      default:
        return { bg: '#F3F4F6', color: '#374151' };
    }
  };

  const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleViewItem = () => {
    console.log("View item:", selectedItem);
    handleMenuClose();
  };

  const handleEditItem = () => {
    console.log("Edit item:", selectedItem);
    handleMenuClose();
  };

  const handleDeleteItem = () => {
    console.log("Delete item:", selectedItem);
    handleMenuClose();
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Page Title */}
      <Typography variant="h4" sx={{ fontWeight: 700, color: "#1F2937", fontSize: "1.875rem", mb: 4 }}>
        Subscriptions & Payments
      </Typography>

      {/* Subscription Overview Section */}
      <Typography variant="h5" sx={{ fontWeight: 600, color: "#374151", fontSize: "1.25rem", mb: 3 }}>
        Subscription Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {/* Active Monthly Subscriptions */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            backgroundColor: "#FFFFFF", 
            borderRadius: 3, 
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            border: "1px solid #E2E8F0",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              transform: "translateY(-2px)"
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: "#DBEAFE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <PeopleIcon sx={{ fontSize: 24, color: "#1E40AF" }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "#6B7280", fontSize: "0.875rem" }}>
                    Active Monthly
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6B7280", fontSize: "0.875rem" }}>
                    Subscriptions
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: "#1E40AF", fontSize: "2.25rem" }}>
                {subscriptionData.monthlySubscriptions.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Yearly Subscriptions */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            backgroundColor: "#FFFFFF", 
            borderRadius: 3, 
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            border: "1px solid #E2E8F0",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              transform: "translateY(-2px)"
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: "#D1FAE5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <CalendarIcon sx={{ fontSize: 24, color: "#059669" }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "#6B7280", fontSize: "0.875rem" }}>
                    Active Yearly
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6B7280", fontSize: "0.875rem" }}>
                    Subscriptions
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: "#059669", fontSize: "2.25rem" }}>
                {subscriptionData.yearlySubscriptions.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Free Users */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            backgroundColor: "#FFFFFF", 
            borderRadius: 3, 
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            border: "1px solid #E2E8F0",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              transform: "translateY(-2px)"
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: "#FEF3C7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <PeopleIcon sx={{ fontSize: 24, color: "#D97706" }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "#6B7280", fontSize: "0.875rem" }}>
                    Free Users
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: "#D97706", fontSize: "2.25rem" }}>
                {subscriptionData.freeUsers.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Revenue Analytics Section */}
      <Typography variant="h5" sx={{ fontWeight: 600, color: "#374151", fontSize: "1.25rem", mb: 3 }}>
        Revenue Analytics
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {/* Total Revenue This Month */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ 
            backgroundColor: "#FFFFFF", 
            borderRadius: 3, 
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            border: "1px solid #E2E8F0",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              transform: "translateY(-2px)"
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: "#DBEAFE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <TrendingUpIcon sx={{ fontSize: 24, color: "#1E40AF" }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "#6B7280", fontSize: "0.875rem" }}>
                    Total Revenue
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6B7280", fontSize: "0.875rem" }}>
                    This Month
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: "#1E40AF", fontSize: "2.25rem" }}>
                ${subscriptionData.totalRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Subscription Churn Rate */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ 
            backgroundColor: "#FFFFFF", 
            borderRadius: 3, 
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            border: "1px solid #E2E8F0",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              transform: "translateY(-2px)"
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: "#FEE2E2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <TrendingUpIcon sx={{ fontSize: 24, color: "#DC2626" }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "#6B7280", fontSize: "0.875rem" }}>
                    Subscription
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6B7280", fontSize: "0.875rem" }}>
                    Churn Rate
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: "#DC2626", fontSize: "2.25rem" }}>
                {subscriptionData.churnRate}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Payment Logs Section */}
      <Typography variant="h5" sx={{ fontWeight: 600, color: "#374151", fontSize: "1.25rem", mb: 3 }}>
        Payment Logs
      </Typography>
      
      {/* Search and Filters */}
      <Card sx={{ mb: 4, backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <TextField
              placeholder="Search providers"
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
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Monthly</InputLabel>
              <Select
                value={filterType}
                label="Monthly"
                onChange={(e) => setFilterType(e.target.value)}
                sx={{
                  backgroundColor: "#F9FAFB",
                  "&:hover": {
                    backgroundColor: "#F3F4F6",
                  },
                }}
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
                <MenuItem value="free">Free</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Yearly</InputLabel>
              <Select
                value={filterType}
                label="Yearly"
                onChange={(e) => setFilterType(e.target.value)}
                sx={{
                  backgroundColor: "#F9FAFB",
                  "&:hover": {
                    backgroundColor: "#F3F4F6",
                  },
                }}
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
                <MenuItem value="free">Free</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Free</InputLabel>
              <Select
                value={filterType}
                label="Free"
                onChange={(e) => setFilterType(e.target.value)}
                sx={{
                  backgroundColor: "#F9FAFB",
                  "&:hover": {
                    backgroundColor: "#F3F4F6",
                  },
                }}
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
                <MenuItem value="free">Free</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Payment Logs Table */}
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
                {paymentLogs.map((log) => (
                  <TableRow key={log.id} sx={{ "&:hover": { backgroundColor: "#F9FAFB" } }}>
                    <TableCell sx={{ py: 2 }}>
                      {log.profileImage ? (
                        <Avatar src={log.profileImage} sx={{ width: 32, height: 32 }} />
                      ) : (
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32, 
                          backgroundColor: log.profileInitial === 'K' ? '#F59E0B' : '#10B981',
                          fontSize: "0.875rem"
                        }}>
                          {log.profileInitial}
                        </Avatar>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#374151", fontWeight: 600 }}>
                        #{log.providerId}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
                        {log.name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#6B7280" }}>
                        {log.email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#374151" }}>
                        {log.serviceType}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={log.paymentStatus}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(log.paymentStatus).bg,
                          color: getStatusColor(log.paymentStatus).color,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          height: 24,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#374151" }}>
                        {log.registrationDate}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, log)}
                        sx={{ color: "#6B7280" }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={9}
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
        <MenuItem onClick={handleViewItem} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon>
            <ViewIcon sx={{ fontSize: 20, color: "#00ADB4" }} />
          </ListItemIcon>
          <ListItemText
            primary="View"
            sx={{
              "& .MuiTypography-root": {
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#1F2937",
              },
            }}
          />
        </MenuItem>
        <MenuItem onClick={handleEditItem} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon>
            <EditIcon sx={{ fontSize: 20, color: "#F59E0B" }} />
          </ListItemIcon>
          <ListItemText
            primary="Edit"
            sx={{
              "& .MuiTypography-root": {
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#1F2937",
              },
            }}
          />
        </MenuItem>
        <MenuItem onClick={handleDeleteItem} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon>
            <DeleteIcon sx={{ fontSize: 20, color: "#EF4444" }} />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            sx={{
              "& .MuiTypography-root": {
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#1F2937",
              },
            }}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default SubscriptionPayment;
