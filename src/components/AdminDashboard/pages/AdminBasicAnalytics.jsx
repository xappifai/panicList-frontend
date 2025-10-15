// src/components/AdminDashboard/pages/AdminBasicAnalytics.jsx
import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Visibility as VisibilityIcon,
  People as PeopleIcon,
  Speed as BounceRateIcon,
  AccountBalance as AccountBalanceIcon,
} from "@mui/icons-material";

const AdminBasicAnalytics = () => {
  // Mock data for charts (in real app, this would come from charts library)
  const generateChartData = (type, count) => {
    if (type === 'line') {
      // Generate wavy line chart data with realistic fluctuations
      const baseValue = 60;
      const data = [];
      for (let i = 0; i < count; i++) {
        const fluctuation = Math.sin(i * 0.3) * 20 + Math.cos(i * 0.2) * 15;
        data.push(Math.max(30, Math.min(90, baseValue + fluctuation)));
      }
      return data;
    } else if (type === 'bar') {
      // Generate bar chart data with similar heights for stability
      return [65, 70, 68, 72];
    }
    return [];
  };

  const trafficData = [
    {
      title: "Page Views",
      value: "12,500",
      change: "+15%",
      changeType: "increase",
      icon: <VisibilityIcon />,
      chartData: generateChartData('line', 30),
      chartType: 'line'
    },
    {
      title: "Unique Visitors",
      value: "8,200",
      change: "+10%",
      changeType: "increase",
      icon: <PeopleIcon />,
      chartData: generateChartData('bar', 4),
      chartType: 'bar'
    },
    {
      title: "Bounce Rate",
      value: "45%",
      change: "-5%",
      changeType: "decrease",
      icon: <BounceRateIcon />,
      chartData: generateChartData('bar', 4),
      chartType: 'bar'
    },
    {
      title: "Provider Withdrawal",
      value: "12,500",
      change: "+15%",
      changeType: "increase",
      icon: <AccountBalanceIcon />,
      chartData: generateChartData('line', 30),
      chartType: 'line'
    }
  ];

  const providerStats = [
    {
      name: "Sophia Bennett",
      category: "Photography",
      reviews: 250,
      rating: 95
    },
    {
      name: "Ethan Carter",
      category: "Web Development",
      reviews: 220,
      rating: 90
    },
    {
      name: "Olivia Davis",
      category: "Graphic Design",
      reviews: 200,
      rating: 85
    },
    {
      name: "Liam Foster",
      category: "Tutoring",
      reviews: 180,
      rating: 80
    },
    {
      name: "Ava Green",
      category: "Music Lessons",
      reviews: 150,
      rating: 75
    }
  ];

  const withdrawalData = [
    {
      provider: "Sophia Bennett",
      amount: "$1,500",
      date: "2024-07-15"
    },
    {
      provider: "Ethan Carter",
      amount: "$1,200",
      date: "2024-07-16"
    },
    {
      provider: "Olivia Davis",
      amount: "$1,000",
      date: "2024-07-17"
    },
    {
      provider: "Liam Foster",
      amount: "$800",
      date: "2024-07-18"
    },
    {
      provider: "Ava Green",
      amount: "$500",
      date: "2024-07-19"
    }
  ];

  const renderChart = (data, type) => {
    if (type === 'line') {
      return (
        <Box sx={{ height: 80, position: 'relative' }}>
          {/* Line Chart */}
          <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'end', 
            gap: 0.5,
            position: 'relative'
          }}>
            {data.map((value, index) => (
              <Box
                key={index}
                sx={{
                  width: 3,
                  height: `${value * 0.8}px`,
                  backgroundColor: "#374151",
                  borderRadius: 0,
                  position: 'relative'
                }}
              />
            ))}
          </Box>
          
          {/* X-axis Labels */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 1,
            fontSize: '0.75rem',
            color: '#9CA3AF'
          }}>
            <span>Day 1</span>
            <span>Day 5</span>
            <span>Day 10</span>
            <span>Day 15</span>
            <span>Day 20</span>
            <span>Day 25</span>
            <span>Day 30</span>
          </Box>
        </Box>
      );
    } else if (type === 'bar') {
      return (
        <Box sx={{ height: 80, position: 'relative' }}>
          {/* Bar Chart */}
          <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'end', 
            gap: 2,
            position: 'relative'
          }}>
            {data.map((value, index) => (
              <Box
                key={index}
                sx={{
                  width: 16,
                  height: `${value * 0.8}px`,
                  backgroundColor: "#D1D5DB",
                  borderRadius: 0,
                  position: 'relative'
                }}
              />
            ))}
          </Box>
          
          {/* X-axis Labels */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 1,
            fontSize: '0.75rem',
            color: '#9CA3AF'
          }}>
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </Box>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1F2937",
            fontSize: "1.875rem",
            mb: 1
          }}
        >
          Basic Analytics
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#6B7280",
            fontSize: "1rem"
          }}
        >
          Overview of platform performance and key metrics
        </Typography>
      </Box>

      {/* Traffic Analytics Section */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: "#1F2937",
          fontSize: "1.25rem",
          mb: 3
        }}
      >
        Traffic Analytics
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {trafficData.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              backgroundColor: "#FFFFFF", 
              borderRadius: 3, 
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              height: "100%"
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6B7280",
                        fontSize: "0.875rem",
                        mb: 0.5
                      }}
                    >
                      {metric.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: "#1F2937",
                        fontSize: "1.5rem"
                      }}
                    >
                      {metric.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      color: "#00ADB4",
                      opacity: 0.7
                    }}
                  >
                    {metric.icon}
                  </Box>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6B7280",
                      fontSize: "0.875rem"
                    }}
                  >
                    Last 30 Days{" "}
                    <span style={{ 
                      color: metric.changeType === "increase" ? "#10B981" : "#EF4444",
                      fontWeight: 600
                    }}>
                      {metric.change}
                    </span>
                  </Typography>
                </Box>

                {/* Chart */}
                <Box sx={{ mt: 2 }}>
                  {renderChart(metric.chartData, metric.chartType)}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Provider Statistics Section */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: "#1F2937",
          fontSize: "1.25rem",
          mb: 3
        }}
      >
        Provider Statistics
      </Typography>
      
      <Card sx={{ mb: 4, backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
        <CardContent sx={{ p: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Provider</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Reviews</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {providerStats.map((provider, index) => (
                  <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#F9FAFB" } }}>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
                        {provider.name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#6B7280" }}>
                        {provider.category}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
                        {provider.reviews}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937", minWidth: 30 }}>
                          {provider.rating}
                        </Typography>
                        <Box sx={{ flexGrow: 1, maxWidth: 100 }}>
                          <LinearProgress
                            variant="determinate"
                            value={provider.rating}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "#E5E7EB",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: "#00ADB4",
                                borderRadius: 4,
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Revenue Reports Section */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: "#1F2937",
          fontSize: "1.25rem",
          mb: 3
        }}
      >
        Revenue Reports
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Monthly Subscription Revenue */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ 
            backgroundColor: "#FFFFFF", 
            borderRadius: 3, 
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            height: "100%"
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#6B7280",
                  fontSize: "0.875rem",
                  mb: 1
                }}
              >
                Monthly Subscription Revenue
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#1F2937",
                  fontSize: "1.5rem",
                  mb: 1
                }}
              >
                $15,000
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TrendingUpIcon sx={{ fontSize: 16, color: "#10B981" }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "#10B981",
                    fontSize: "0.875rem"
                  }}
                >
                  +5%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Provider Withdrawals */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ 
            backgroundColor: "#FFFFFF", 
            borderRadius: 3, 
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            height: "100%"
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#6B7280",
                  fontSize: "0.875rem",
                  mb: 1
                }}
              >
                Provider Withdrawals
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#1F2937",
                  fontSize: "1.5rem",
                  mb: 1
                }}
              >
                $8,000
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TrendingDownIcon sx={{ fontSize: 16, color: "#EF4444" }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "#EF4444",
                    fontSize: "0.875rem"
                  }}
                >
                  -10%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Withdrawals Table */}
      <Card sx={{ backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#1F2937",
              fontSize: "1.125rem",
              mb: 3
            }}
          >
            Withdrawals
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Provider</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2 }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {withdrawalData.map((withdrawal, index) => (
                  <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#F9FAFB" } }}>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
                        {withdrawal.provider}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#10B981" }}>
                        {withdrawal.amount}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: "#6B7280" }}>
                        {withdrawal.date}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminBasicAnalytics;
