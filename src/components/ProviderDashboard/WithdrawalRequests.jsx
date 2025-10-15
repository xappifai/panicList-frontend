import React, { useState } from "react";
import ProviderAuthGuard from "./ProviderAuthGuard";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Chip,
  IconButton,
  Pagination,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const STATUS = {
  completed: { bg: "#E5E7EB", fg: "#6B7280" },
  pending: { bg: "#FFF6E6", fg: "#F59E0B" },
};

const StatusChip = ({ label, color }) => (
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
      minWidth: 86,
    }}
  />
);

const rows = [
  { id: "#12345", amount: "$200.00", method: "Bank Account", date: "2024-07-20", status: "completed" },
  { id: "#12346", amount: "$150.00", method: "Bank Account", date: "2024-07-15", status: "completed" },
  { id: "#12347", amount: "$300.00", method: "Bank Account", date: "2024-07-10", status: "completed" },
  { id: "#12348", amount: "$250.00", method: "Bank Account", date: "2024-07-05", status: "completed" },
  { id: "#12349", amount: "$100.00", method: "Bank Account", date: "2024-07-01", status: "completed" },
];

export default function WithdrawalRequests() {
  const [page, setPage] = useState(1);

  return (
    <ProviderAuthGuard>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827" }}>Withdrawal Requests</Typography>

        {/* Form - stacked */}
        <Box>
          <Box sx={{ maxWidth: 360 }}>
            <Typography sx={{ color: "#6B7280", fontSize: 12, mb: 0.5 }}>Amount to Withdraw</Typography>
            <TextField fullWidth placeholder="Enter amount" size="small" sx={{ background: '#FFFFFF' }} />
          </Box>
          <Box sx={{ maxWidth: 360, mt: 2 }}>
            <Typography sx={{ color: "#6B7280", fontSize: 12, mb: 0.5 }}>Payment Method</Typography>
            <TextField fullWidth placeholder="Bank Account" size="small" sx={{ background: '#FFFFFF' }} />
          </Box>
          <Button sx={{ mt: 2, textTransform: "none", background: "#00ADB4", borderRadius: 999, px: 2.5, height: 32, boxShadow: 'none' }} variant="contained">Request Withdrawal</Button>
        </Box>

        {/* History */}
        <Card elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: 2 }}>
          <Box sx={{ px: 2, py: 1.25, borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#111827" }}>Withdrawal History</Typography>
          </Box>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0, background: '#FFFFFF' }}>
            <Table size="small" sx={{ '& th': { color: '#6B7280', fontWeight: 600, fontSize: 12 }, '& td': { color: '#111827', fontSize: 14 } }}>
              <TableHead>
                <TableRow sx={{ background: "#F9FAFB" }}>
                  <TableCell>Request ID</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r, i) => (
                  <TableRow key={i} hover sx={{ backgroundColor: '#FFFFFF' }}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.amount}</TableCell>
                    <TableCell>{r.method}</TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>
                      {r.status === 'completed' && <StatusChip label="Completed" color={STATUS.completed} />}
                      {r.status === 'pending' && <StatusChip label="Pending" color={STATUS.pending} />}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small"><MoreVertIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 1.5 }}>
            <Pagination
              count={9}
              page={page}
              onChange={(_, p) => setPage(p)}
              size="small"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#374151',
                  fontWeight: 600,
                  minWidth: 28,
                  height: 28,
                  border: '1px solid #D1D5DB',
                  borderRadius: '999px',
                },
                '& .MuiPaginationItem-root.Mui-selected': {
                  background: '#00ADB4',
                  color: '#fff',
                  borderColor: '#00ADB4',
                }
              }}
            />
          </Box>
        </Card>
      </Box>
    </ProviderAuthGuard>
  );
}
