// src/components/AdminDashboard/pages/Support.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
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
  Chip,
  Link,
  Pagination,
} from "@mui/material";
import {
  Search as SearchIcon,
  Reply as ReplyIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";

const Support = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("monthly");
  const [currentPage, setCurrentPage] = useState(1);

  // Mock support data
  const supportTickets = [
    {
      id: 1,
      name: "Sophia Clark",
      email: "sophia.clark@email.com",
      subject: "Inquiry about family vacation",
      message: "I'm interested in a family vacation package to the coast. Could you provide more details?",
      received: "2024-07-26 10:00 AM",
      status: "New",
    },
    {
      id: 2,
      name: "Ethan Bennett",
      email: "ethan.bennett@email.com",
      subject: "Booking modification request",
      message: "I need to change the dates of my existing booking. Is this possible?",
      received: "2024-07-25 03:30 PM",
      status: "In Progress",
    },
    {
      id: 3,
      name: "Olivia Carter",
      email: "olivia.carter@email.com",
      subject: "Feedback on recent trip",
      message: "We had an amazing time on our recent trip to the mountains. Thank you for your excellent service!",
      received: "2024-07-24 09:15 AM",
      status: "Resolved",
    },
    {
      id: 4,
      name: "Liam Davis",
      email: "liam.davis@email.com",
      subject: "Technical issue with booking",
      message: "I'm unable to complete my booking. The payment page keeps showing an error.",
      received: "2024-07-23 02:45 PM",
      status: "New",
    },
    {
      id: 5,
      name: "Ava Evans",
      email: "ava.evans@email.com",
      subject: "Cancellation request",
      message: "Due to unforeseen circumstances, I need to cancel my upcoming trip. What are the cancellation policies?",
      received: "2024-07-22 11:20 AM",
      status: "In Progress",
    },
    {
      id: 6,
      name: "Noah Foster",
      email: "noah.foster@email.com",
      subject: "Special dietary requirements",
      message: "I have specific dietary restrictions. Can you accommodate these during the tour?",
      received: "2024-07-21 04:15 PM",
      status: "Resolved",
    },
    {
      id: 7,
      name: "Isabella Green",
      email: "isabella.green@email.com",
      subject: "Group booking inquiry",
      message: "We're planning a corporate retreat for 25 people. Do you offer group discounts?",
      received: "2024-07-20 09:30 AM",
      status: "New",
    },
    {
      id: 8,
      name: "Jackson Hayes",
      email: "jackson.hayes@email.com",
      subject: "Weather-related concerns",
      message: "I'm worried about the weather affecting our outdoor activities. What's your policy on weather cancellations?",
      received: "2024-07-19 01:45 PM",
      status: "In Progress",
    },
    {
      id: 9,
      name: "Mia Ingram",
      email: "mia.ingram@email.com",
      subject: "Transportation arrangements",
      message: "Do you provide airport transfers? If not, can you recommend reliable transportation services?",
      received: "2024-07-18 10:00 AM",
      status: "Resolved",
    },
    {
      id: 10,
      name: "Lucas Jenkins",
      email: "lucas.jenkins@email.com",
      subject: "Insurance coverage questions",
      message: "What type of insurance coverage is included in the tour package? Do I need additional coverage?",
      received: "2024-07-17 03:20 PM",
      status: "New",
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'new':
        return { bg: '#F3F4F6', color: '#374151' };
      case 'in progress':
        return { bg: '#DBEAFE', color: '#1E40AF' };
      case 'resolved':
        return { bg: '#D1FAE5', color: '#059669' };
      default:
        return { bg: '#F3F4F6', color: '#374151' };
    }
  };

  const handleReply = (ticket) => {
    console.log("Reply to ticket:", ticket);
    // Implement reply functionality
  };

  const handleView = (ticket) => {
    console.log("View ticket:", ticket);
    // Implement view functionality
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Page Title */}
      <Typography variant="h4" sx={{ fontWeight: 700, color: "#1F2937", fontSize: "1.875rem", mb: 1 }}>
        Support
      </Typography>
      <Typography variant="body1" sx={{ color: "#6B7280", fontSize: "1rem", mb: 4 }}>
        Manage system-level configurations and settings.
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

      {/* Support Tickets Table */}
      <Card sx={{ backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Message</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Received</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {supportTickets.map((ticket) => (
                  <TableRow key={ticket.id} sx={{ "&:hover": { backgroundColor: "#F9FAFB" } }}>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
                        {ticket.name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#6B7280" }}>
                        {ticket.email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#374151", fontWeight: 500 }}>
                        {ticket.subject}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: "#6B7280",
                          maxWidth: 300,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {ticket.message}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#374151" }}>
                        {ticket.received}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={ticket.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(ticket.status).bg,
                          color: getStatusColor(ticket.status).color,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          height: 24,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      {ticket.status === "Resolved" ? (
                        <Link
                          component="button"
                          variant="body2"
                          onClick={() => handleView(ticket)}
                          sx={{
                            color: "#00ADB4",
                            textDecoration: "none",
                            fontWeight: 500,
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          <ViewIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                          View
                        </Link>
                      ) : (
                        <Link
                          component="button"
                          variant="body2"
                          onClick={() => handleReply(ticket)}
                          sx={{
                            color: "#00ADB4",
                            textDecoration: "none",
                            fontWeight: 500,
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          <ReplyIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                          Reply
                        </Link>
                      )}
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
    </Box>
  );
};

export default Support;

