// src/components/ProviderDashboard/FinanceComponent.jsx
import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController, // ← import BarController
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController, // ← register BarController
  Title,
  Tooltip,
  Legend
);

// Set Manrope as the default font for all Chart.js text
ChartJS.defaults.font.family = "Manrope";
ChartJS.defaults.color = "#283C50";

export default function FinanceComponent() {
  const financeData = {
    labels: [
      "JAN/23",
      "FEB/23",
      "MAR/23",
      "APR/23",
      "MAY/23",
      "JUN/23",
      "JUL/23",
      "AUG/23",
      "SEP/23",
      "OCT/23",
      "NOV/23",
      "DEC/23",
    ],
    datasets: [
      {
        type: "line",
        label: "Earned",
        data: [
          5486, 4950, 7500, 6800, 5600, 5200, 7000, 7300, 6900, 7800, 8000,
          8500,
        ],
        borderColor: "#00796b",
        backgroundColor: "rgba(0,121,107,0.2)",
        tension: 0.3,
        fill: true,
      },
      {
        type: "bar",
        label: "Earned",
        data: [
          5486, 4950, 7500, 6800, 5600, 5200, 7000, 7300, 6900, 7800, 8000,
          8500,
        ],
        borderColor: "#00796b",
        backgroundColor: "rgba(0,121,107,0.8)",
        maxBarThickness: 12,
        borderRadius: 6,
      },
      {
        type: "line",
        label: "Projected",
        data: [
          9275, 9400, 9600, 9200, 9700, 9900, 10200, 10000, 10300, 10600, 10800,
          11000,
        ],
        borderColor: "#9e9e9e",
        backgroundColor: "rgba(158,158,158,0.2)",
        tension: 0.3,
        fill: true,
      },
      {
        type: "bar",
        label: "Projected",
        data: [
          9275, 9400, 9600, 9200, 9700, 9900, 10200, 10000, 10300, 10600, 10800,
          11000,
        ],
        borderColor: "#9e9e9e",
        backgroundColor: "rgba(158,158,158,0.8)",
        maxBarThickness: 12,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false }, beginAtZero: true },
    },
    datasets: {
      bar: {
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      },
    },
  };

  const stats = [
    { label: "Earned", value: "$5,486", progress: 45, color: "#00796b" },
    { label: "Projected", value: "$9,275", progress: 55, color: "#43a047" },
    { label: "Rejected", value: "$3,868", progress: 40, color: "#e53935" },
    { label: "Revenue", value: "$50,668", progress: 70, color: "#1e88e5" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        backgroundColor: "white",
        borderRadius: 2,
        px: 2,
      }}
    >
      {/* Header */}
      <Typography
        variant="h6"
        sx={{
          p: 3,
          fontFamily: "Manrope",
          color: "#283C50",
          fontWeight: "bold",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        Finance
      </Typography>

      {/* Chart */}
      <Box sx={{ width: "100%", height: 350, p: 3 }}>
        <Line data={financeData} options={chartOptions} />
      </Box>

      <Divider sx={{ my: 3, width: "100%" }} />

      {/* Custom stat cards */}
      <Box sx={{ display: "flex", gap: 3, p: 3, width: "100%" }}>
        {stats.map(({ label, value, progress, color }) => (
          <Box
            key={label}
            sx={{
              flex: 1,
              p: 2,
              border: "1px dashed #E5E7EB",
              borderRadius: 1,
              backgroundColor: "#fff",
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontFamily: "Manrope", color: "text.secondary" }}
            >
              {label}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mt: 1,
                fontFamily: "Manrope",
                color: "#283C50",
                fontWeight: "bold",
              }}
            >
              {value}
            </Typography>
            <Box
              sx={{
                mt: 1,
                height: 6,
                borderRadius: 3,
                backgroundColor: "#E5E7EB",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: color,
                  borderRadius: 3,
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
