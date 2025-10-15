// src/components/ClientDashboard/ServiceHistoryTable.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Pagination,
  Stack,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { orderAPI, userAPI, apiUtils } from "../services/apiService.js";

// Utility to consistently generate a color from a string
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    /* eslint-disable no-bitwise */
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    /* eslint-enable no-bitwise */
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

export default function ServiceHistoryTable({ heading = "Customer Interactions" }) {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ROWS_PER_PAGE = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = apiUtils.getUser();
        const providerId = currentUser?.uid;
        if (!providerId) {
          setRows([]);
          setTotalPages(1);
          return;
        }

        // Fetch provider orders
        const result = await orderAPI.getOrdersByProvider(providerId, {
          limit: 100,
          offset: 0,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        const orders = result?.data?.orders || result?.orders || [];

        // Group by client and map minimal fields
        const customerMap = new Map();
        for (const order of orders) {
          const customerId = order.clientId || order.customerId || order.userId || order?.clientDetails?.uid;
          if (!customerId) continue;
          if (!customerMap.has(customerId)) customerMap.set(customerId, []);
          customerMap.get(customerId).push(order);
        }

        const customers = Array.from(customerMap.entries());

        // Fetch client user documents (minimal public endpoint first)
        const mappedRows = await Promise.all(
          customers.slice(0, 100).map(async ([customerId, customerOrders]) => {
            let fullName = "Unknown Client";
            let email = "No email";

            try {
              const pub = await userAPI.getPublicUserById(customerId);
              if (pub?.success && pub?.data) {
                fullName = pub.data.fullName || fullName;
                email = pub.data.email || email;
              }
            } catch {}

            if (fullName === "Unknown Client" || email === "No email") {
              try {
                const userRes = await userAPI.getUserById(customerId);
                if (userRes?.success && userRes?.data) {
                  fullName = userRes.data.fullName || fullName;
                  email = userRes.data.email || email;
                }
              } catch {}
            }

            // Determine latest order, payment and status
            const latest = customerOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
            const payment = latest?.paymentStatus || "pending";
            const status = latest?.status || "pending";
            const createdAt = latest?.bookingDetails?.scheduledDate || latest?.createdAt;
            const date = createdAt
              ? new Date(createdAt?.seconds ? createdAt.seconds * 1000 : createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "--";

            return {
              name: fullName,
              email,
              avatar: null,
              payment: payment.charAt(0).toUpperCase() + payment.slice(1),
              date,
              status: status === "in_progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1),
            };
          })
        );

        // Pagination (client-side)
        const start = (page - 1) * ROWS_PER_PAGE;
        const end = start + ROWS_PER_PAGE;
        setTotalPages(Math.max(1, Math.ceil(mappedRows.length / ROWS_PER_PAGE)));
        setRows(mappedRows.slice(start, end));
      } catch (e) {
        console.error("Failed to load customer interactions:", e);
        setRows([]);
        setTotalPages(1);
      }
    };

    fetchData();
  }, [page]);

  return (
    <Box
      sx={{
        height: "400px",
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
          {heading}
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
          "&::-webkit-scrollbar-button": { display: "none" },
        }}
      >
        <Table size="small" sx={{ minWidth: "100%" }}>
          <TableHead
            sx={{ position: "sticky", top: 0, backgroundColor: "white", zIndex: 1 }}
          >
            <TableRow>
              {["SERVICE PROVIDERS", "PAYMENT", "DATE", "WORK STATUS", "ACTIONS"].map(
                (label) => (
                  <TableCell
                    key={label}
                    sx={{ fontWeight: 700, color: "#283C50", fontFamily: "Manrope, sans-serif" }}
                  >
                    {label}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={idx} sx={{ bgcolor: "#fff" }}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      src={row.avatar || undefined}
                      sx={{ bgcolor: stringToColor(row.name), color: theme.palette.common.white }}
                    >
                      {!row.avatar && row.name[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "#283C50", fontWeight: 600, fontFamily: "Manrope, sans-serif" }}>
                        {row.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "Manrope, sans-serif" }}>
                        {row.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={row.payment} size="small" sx={{ backgroundColor: "#E9ECEF", borderRadius: "3px", color: "#283C50", fontWeight: 600, fontFamily: "Manrope, sans-serif" }} />
                </TableCell>
                <TableCell sx={{ color: "black", fontFamily: "Manrope, sans-serif" }}>{row.date}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    size="small"
                    sx={{
                      borderRadius: "3px",
                      fontWeight: 600,
                      fontFamily: "Manrope, sans-serif",
                      backgroundColor: row.status === "Completed" ? "#E1FBED" : row.status === "In Progress" ? "#EBEEFA" : "#FFEBD0",
                      color: row.status === "Completed" ? "#17C666" : row.status === "In Progress" ? "#00ADB4" : "#FFA21D",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* pagination */}
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mt={2}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, p) => setPage(p)}
          siblingCount={0}
          boundaryCount={1}
          size="small"
          sx={{
            "& .MuiPaginationItem-root": { color: "black", fontFamily: "Manrope, sans-serif" },
            "& .Mui-selected": { backgroundColor: "primary.main", color: "#fff" },
          }}
        />
      </Stack>
    </Box>
  );
}
