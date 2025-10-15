// src/pages/ProviderManagement.jsx
import React, { useState } from "react";
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
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";

const ProviderManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");

  // Mock provider data
  const providers = [
    {
      id: "12345",
      name: "Sophia Clark",
      email: "sophia.clark@email.com",
      serviceType: "Cleaning",
      paymentStatus: "Active",
      registrationDate: "2023-01-15",
      rating: 4.8,
      avatar: "S",
      hasImage: true,
    },
    {
      id: "12346",
      name: "Ethan Bennett",
      email: "ethan.bennett@email.com",
      serviceType: "Plumbing",
      paymentStatus: "Pending",
      registrationDate: "2023-02-20",
      rating: 4.5,
      avatar: "E",
      hasImage: true,
    },
    {
      id: "12347",
      name: "Olivia Carter",
      email: "olivia.carter@email.com",
      serviceType: "Electrical",
      paymentStatus: "Active",
      registrationDate: "2023-03-10",
      rating: 4.9,
      avatar: "O",
      hasImage: false,
    },
    {
      id: "12348",
      name: "Liam Davis",
      email: "liam.davis@email.com",
      serviceType: "Handyman",
      paymentStatus: "Suspended",
      registrationDate: "2023-04-05",
      rating: 4.2,
      avatar: "L",
      hasImage: false,
    },
    {
      id: "12349",
      name: "Ava Evans",
      email: "ava.evans@email.com",
      serviceType: "Gardening",
      paymentStatus: "Active",
      registrationDate: "2023-05-12",
      rating: 4.7,
      avatar: "A",
      hasImage: true,
    },
    {
      id: "12350",
      name: "Mia Ingram",
      email: "mia.ingram@email.com",
      serviceType: "Painting",
      paymentStatus: "Pending",
      registrationDate: "2023-06-18",
      rating: 4.6,
      avatar: "M",
      hasImage: true,
    },
    {
      id: "12351",
      name: "Noah Foster",
      email: "noah.foster@email.com",
      serviceType: "Cleaning",
      paymentStatus: "Active",
      registrationDate: "2023-07-22",
      rating: 4.4,
      avatar: "N",
      hasImage: false,
    },
    {
      id: "12352",
      name: "Jackson Hayes",
      email: "jackson.hayes@email.com",
      serviceType: "Plumbing",
      paymentStatus: "Active",
      registrationDate: "2023-08-30",
      rating: 4.8,
      avatar: "J",
      hasImage: false,
    },
    {
      id: "12353",
      name: "Lucas Jenkins",
      email: "lucas.jenkins@email.com",
      serviceType: "Electrical",
      paymentStatus: "Pending",
      registrationDate: "2023-09-14",
      rating: 4.3,
      avatar: "L",
      hasImage: false,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return { backgroundColor: "#DBEAFE", color: "#1E40AF" };
      case "Pending":
        return { backgroundColor: "#F3F4F6", color: "#374151" };
      case "Suspended":
        return { backgroundColor: "#FEF2F2", color: "#DC2626" };
      default:
        return { backgroundColor: "#F3F4F6", color: "#374151" };
    }
  };

  const getAvatarColor = (name) => {
    const colors = ["#F59E0B", "#10B981", "#EF4444", "#8B5CF6", "#06B6D4"];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1F2937",
            fontSize: "1.875rem",
          }}
        >
          Providers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
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
          Add Provider
        </Button>
      </Box>

      {/* Search and Filters Section */}
      <Card sx={{ mb: 3, backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
        <CardContent sx={{ p: 3 }}>
          {/* Search Bar */}
          <TextField
            fullWidth
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

      {/* Providers Table */}
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
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Rating Avg.</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {providers.map((provider) => (
                  <TableRow key={provider.id} sx={{ "&:hover": { backgroundColor: "#F9FAFB" } }}>
                    <TableCell sx={{ py: 2 }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: provider.hasImage ? "#00ADB4" : getAvatarColor(provider.name),
                          fontSize: "1rem",
                          fontWeight: 600,
                        }}
                      >
                        {provider.avatar}
                      </Avatar>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#00ADB4" }}>
                        #{provider.id}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
                        {provider.name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#6B7280" }}>
                        {provider.email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#374151" }}>
                        {provider.serviceType}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={provider.paymentStatus}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(provider.paymentStatus).backgroundColor,
                          color: getStatusColor(provider.paymentStatus).color,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          height: 24,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#374151" }}>
                        {provider.registrationDate}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
                        {provider.rating}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <IconButton size="small" sx={{ color: "#6B7280" }}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <Pagination
              count={9}
              page={1}
              size="small"
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: 2,
                  mx: 0.5,
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
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProviderManagement;
