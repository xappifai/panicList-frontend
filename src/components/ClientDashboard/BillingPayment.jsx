// src/components/ClientDashboard/BillingPayment.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  PaginationItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Star as StarIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { stripeService } from "../../services/stripeService";

const PLAN_CONFIG = {
  free: {
    label: "Free",
    monthly: { price: 0 },
    yearly: { price: 0 },
    features: [
      "Up to 5 listings",
      "Up to 10 images",
      "Basic support",
    ],
    color: "#9CA3AF",
  },
  basic: {
    label: "Basic",
    monthly: { price: 29.99 },
    yearly: { price: 299.99 },
    features: [
      "Up to 25 listings",
      "Up to 50 images",
      "Priority support",
      "Analytics",
    ],
    color: "#00ADB4",
  },
  premium: {
    label: "Premium",
    monthly: { price: 59.99 },
    yearly: { price: 599.99 },
    features: [
      "Up to 100 listings",
      "Up to 200 images",
      "Priority support",
      "Advanced analytics",
      "Custom domain",
      "API access",
    ],
    color: "#111827",
  },
  enterprise: {
    label: "Enterprise",
    monthly: { price: 99.99 },
    yearly: { price: 999.99 },
    features: [
      "Unlimited listings",
      "Unlimited images",
      "Dedicated support",
      "Advanced analytics",
      "Custom domain",
      "API access",
      "White-label",
    ],
    color: "#111827",
  },
};

export default function BillingPayment() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("creditCard");
  const [currentPage, setCurrentPage] = useState(1);
  const [planBillingCycle, setPlanBillingCycle] = useState("monthly"); // 'monthly' | 'yearly'
  const [currentPlan, setCurrentPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [planError, setPlanError] = useState("");

  // Mock data for billing history
  const billingHistory = [
    {
      id: 1,
      date: "05/15/2024",
      amount: "$120.00",
      status: "Paid",
      invoice: "Download",
    },
    {
      id: 2,
      date: "04/15/2024",
      amount: "$120.00",
      status: "Paid",
      invoice: "Download",
    },
    {
      id: 3,
      date: "03/15/2024",
      amount: "$120.00",
      status: "Paid",
      invoice: "Download",
    },
  ];

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleAddPaymentMethod = () => {
    // Handle add payment method logic
    console.log("Adding new payment method...");
  };

  const handleUpgradePlan = () => {
    // Handle upgrade plan logic
    console.log("Upgrading plan...");
  };

  const handleManageSubscription = () => {
    // Handle manage subscription logic
    console.log("Managing subscription...");
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // Fetch current plan
  useEffect(() => {
    const loadPlan = async () => {
      try {
        setPlanLoading(true);
        setPlanError("");
        const response = await stripeService.getCurrentPlan();
        if (response.success) {
          setCurrentPlan(response.plan);
        } else {
          // If no plan exists yet, silently show as no current plan
          if (response.error && String(response.error).toLowerCase().includes('plan not found')) {
            setCurrentPlan(null);
            setPlanError("");
          } else {
            setPlanError(response.error || "Failed to load current plan");
          }
        }
      } catch (err) {
        const message = typeof err === 'string' ? err : err?.error || err?.message || "Failed to load current plan";
        if (String(message).toLowerCase().includes('plan not found')) {
          setCurrentPlan(null);
          setPlanError("");
        } else {
          setPlanError(message);
        }
      } finally {
        setPlanLoading(false);
      }
    };
    loadPlan();

    // Refresh plan on window focus or tab visibility change
    const onFocus = () => loadPlan();
    const onVisibility = () => { if (document.visibilityState === 'visible') loadPlan(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const handleChoosePlan = async (planName) => {
    try {
      const result = await stripeService.createCheckoutSession(planName, planBillingCycle);
      if (result?.freePlan) {
        // Free plan activated; refresh current plan
        const refreshed = await stripeService.getCurrentPlan();
        if (refreshed.success) setCurrentPlan(refreshed.plan);
      }
    } catch (err) {
      setPlanError(typeof err === 'string' ? err : err?.error || err?.message || "Unable to start checkout");
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      {/* Page Header */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#1F2937",
          mb: 4,
        }}
      >
        Billing & Payments
      </Typography>

      {/* Payment Analytics Section */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#1F2937",
            mb: 3,
          }}
        >
          Payment Analytics
        </Typography>

        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {/* Total Payment Spent Card */}
          <Card sx={{ 
            backgroundColor: "#FFFFFF", 
            borderRadius: 3, 
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
            flex: "1 1 300px",
            minWidth: "300px"
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="body1"
                sx={{
                  color: "#6B7280",
                  mb: 2,
                  fontWeight: 500,
                }}
              >
                Total Payment Spent This Month
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "#1F2937",
                }}
              >
                $15,0
              </Typography>
            </CardContent>
          </Card>

          {/* Subscription Rate Card */}
          <Card sx={{ 
            backgroundColor: "#FFFFFF", 
            borderRadius: 3, 
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
            flex: "1 1 300px",
            minWidth: "300px"
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="body1"
                sx={{
                  color: "#6B7280",
                  mb: 2,
                  fontWeight: 500,
                }}
              >
                Subscription Rate
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "#1F2937",
                }}
              >
                2.5%
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Payment Methods Section */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#1F2937",
            mb: 3,
          }}
        >
          Payment Methods
        </Typography>

        <Card sx={{ 
          backgroundColor: "#FFFFFF", 
          borderRadius: 3, 
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
          mb: 3,
          width: "100%"
        }}>
          <CardContent sx={{ p: 0 }}>
            {/* Credit Card Row */}
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              p: 3, 
              borderBottom: "1px solid #E5E7EB" 
            }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedPaymentMethod === "creditCard"}
                    onChange={() => handlePaymentMethodChange("creditCard")}
                    sx={{
                      color: "#00ADB4",
                      "&.Mui-checked": {
                        color: "#00ADB4",
                      },
                    }}
                  />
                }
                label=""
                sx={{ mr: 2 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: "#1F2937",
                    mb: 0.5,
                  }}
                >
                  Credit Card
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6B7280",
                  }}
                >
                  Expires 03/2025
                </Typography>
              </Box>
              <IconButton
                sx={{
                  color: "#6B7280",
                  "&:hover": {
                    backgroundColor: "#F3F4F6",
                  },
                }}
              >
                <EditIcon />
              </IconButton>
            </Box>

            {/* PayPal Row */}
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              p: 3 
            }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedPaymentMethod === "paypal"}
                    onChange={() => handlePaymentMethodChange("paypal")}
                    sx={{
                      color: "#00ADB4",
                      "&.Mui-checked": {
                        color: "#00ADB4",
                      },
                    }}
                  />
                }
                label=""
                sx={{ mr: 2 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: "#1F2937",
                    mb: 0.5,
                  }}
                >
                  PayPal
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6B7280",
                  }}
                >
                  Active
                </Typography>
              </Box>
              <IconButton
                sx={{
                  color: "#6B7280",
                  "&:hover": {
                    backgroundColor: "#F3F4F6",
                  },
                }}
              >
                <EditIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddPaymentMethod}
          sx={{
            backgroundColor: "#00ADB4",
            color: "white",
            textTransform: "none",
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#009DA4",
            },
          }}
        >
          Add Payment Method
        </Button>
      </Box>

      {/* Billing History Section */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#1F2937",
            mb: 3,
          }}
        >
          Billing History
        </Typography>

        <Card sx={{ 
          backgroundColor: "#FFFFFF", 
          borderRadius: 3, 
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
          width: "100%"
        }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#6B7280", borderBottom: "1px solid #E5E7EB" }}>
                    Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#6B7280", borderBottom: "1px solid #E5E7EB" }}>
                    Amount
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#6B7280", borderBottom: "1px solid #E5E7EB" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#6B7280", borderBottom: "1px solid #E5E7EB" }}>
                    Invoice
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billingHistory.map((row) => (
                  <TableRow key={row.id} sx={{ borderBottom: "1px solid #E5E7EB" }}>
                    <TableCell sx={{ color: "#374151", py: 2 }}>
                      {row.date}
                    </TableCell>
                    <TableCell sx={{ color: "#374151", py: 2, fontWeight: 600 }}>
                      {row.amount}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={row.status}
                        sx={{
                          backgroundColor: "#F3F4F6",
                          color: "#374151",
                          fontWeight: 500,
                          borderRadius: 2,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography
                        component="span"
                        sx={{
                          color: "#3B82F6",
                          cursor: "pointer",
                          textDecoration: "underline",
                          "&:hover": {
                            color: "#2563EB",
                          },
                        }}
                      >
                        {row.invoice}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Pagination */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={9}
            page={currentPage}
            onChange={handlePageChange}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#00ADB4",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#009DA4",
                    },
                  },
                  "& .MuiPaginationItem-root": {
                    color: "#374151",
                  },
                }}
              />
            )}
          />
        </Box>
      </Box>

      {/* Plans Management */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#1F2937",
            mb: 3,
          }}
        >
          Plans & Subscription
        </Typography>

        {/* Current Plan */}
        <Card sx={{ backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", p: 3, mb: 3 }}>
          {planLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : planError ? (
            <Alert severity="error">{planError}</Alert>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
              {(() => {
                // Derive effective plan when none is set: treat as Free
                const effectivePlanName = currentPlan?.planName || 'free';
                const effectivePlanType = currentPlan?.planType || planBillingCycle;
                const effectiveDaysRemaining = currentPlan?.daysRemaining;
                return (
                  <>
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#6B7280" }}>Current Plan</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#1F2937" }}>
                  {PLAN_CONFIG[effectivePlanName]?.label || effectivePlanName}
                </Typography>
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
                  {(currentPlan?.planType || (window.localStorage.getItem('user') ? (JSON.parse(window.localStorage.getItem('user')).planType || effectivePlanType) : effectivePlanType))
                    .toString()
                    .replace(/^./, (c) => c.toUpperCase())}
                  {effectiveDaysRemaining != null ? ` • ${effectiveDaysRemaining} days remaining` : ''}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => setPlanBillingCycle(planBillingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Billing: {planBillingCycle === 'monthly' ? 'Monthly' : 'Yearly'}
                </Button>
                <Button
                  variant="text"
                  onClick={() => {
                    setPlanLoading(true);
                    // trigger reload via focus handler flow
                    setTimeout(() => window.dispatchEvent(new Event('focus')), 0);
                  }}
                  sx={{ textTransform: 'none', fontWeight: 600, color: '#00ADB4' }}
                >
                  Refresh
                </Button>
              </Box>
                  </>
                );
              })()}
            </Box>
          )}
        </Card>

        {/* Available Plans */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
          {Object.keys(PLAN_CONFIG).map((planKey) => {
            const plan = PLAN_CONFIG[planKey];
            const isCurrent = (currentPlan?.planName || 'free') === planKey;
            const price = plan[planBillingCycle].price;
            return (
              <Card key={planKey} sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: isCurrent ? `2px solid ${plan.color}` : '1px solid #E5E7EB' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827", mb: 1 }}>{plan.label}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#1F2937", mb: 1 }}>
                  {price === 0 ? 'Free' : `$${price}`}
                  <Typography component="span" variant="body2" sx={{ color: "#6B7280", ml: 0.5 }}>/ {planBillingCycle}</Typography>
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
                  {plan.features.map((f) => (
                    <Typography key={f} variant="body2" sx={{ color: "#6B7280" }}>• {f}</Typography>
                  ))}
                </Box>
                <Button
                  fullWidth
                  variant={isCurrent ? "outlined" : "contained"}
                  onClick={() => !isCurrent && handleChoosePlan(planKey)}
                  disabled={isCurrent}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    backgroundColor: isCurrent ? 'transparent' : plan.color,
                    color: isCurrent ? '#111827' : '#fff',
                    '&:hover': {
                      backgroundColor: isCurrent ? 'transparent' : '#009DA4',
                    }
                  }}
                >
                  {isCurrent ? 'Current Plan' : (price === 0 ? 'Choose Free' : 'Upgrade')}
                </Button>
              </Card>
            );
          })}
        </Box>
      </Box>

    </Box>
  );
}
