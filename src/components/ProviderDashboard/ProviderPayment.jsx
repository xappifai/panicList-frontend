import React, { useState, useEffect } from "react";
import ProviderAuthGuard from "./ProviderAuthGuard";
import {
  Box,
  Card,
  Typography,
  Button,
  Chip,
  Avatar,
  IconButton,
  Checkbox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Pagination,
  CircularProgress,
  Alert,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { stripeService } from "../../services/stripeService";
import { orderAPI, stripeAPI } from "../../services/apiService";

const money = (n) => n.toLocaleString(undefined, { style: "currency", currency: "USD" });

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
      minWidth: 76,
    }}
  />
);

const STATUS = {
  paid: { bg: "#E7F7EF", fg: "#10B981" },
  pending: { bg: "#FFF6E6", fg: "#F59E0B" },
};

const methods = [
  { id: "card", brand: "Mastercard", last4: "0325", detail: "Expires 03/2025", icon: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
  { id: "paypal", brand: "PayPal", last4: "", detail: "Active", icon: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" },
];

const orders = [
  { id: "#1234", date: "05/15/2024", amount: 120, status: "paid" },
  { id: "#1234", date: "04/15/2024", amount: 120, status: "paid" },
  { id: "#1234", date: "03/15/2024", amount: 120, status: "pending" },
];

export default function ProviderPayment() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [planBillingCycle, setPlanBillingCycle] = useState("monthly");
  const [currentPlan, setCurrentPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [planError, setPlanError] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const PLAN_CONFIG = {
    free: {
      label: "Free",
      monthly: { price: 0 },
      yearly: { price: 0 },
      features: ["Up to 5 listings", "Up to 10 images", "Basic support"],
      color: "#9CA3AF",
    },
    basic: {
      label: "Basic",
      monthly: { price: 29.99 },
      yearly: { price: 299.99 },
      features: ["Up to 25 listings", "Up to 50 images", "Priority support", "Analytics"],
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

  const formatDate = (value) => {
    try {
      if (!value) return null;
      // Firestore Timestamp from web SDK
      if (typeof value?.toDate === 'function') return value.toDate();
      // Firestore Timestamp from admin (seconds/_seconds)
      if (typeof value?.seconds === 'number') return new Date(value.seconds * 1000);
      if (typeof value?._seconds === 'number') return new Date(value._seconds * 1000);
      // Milliseconds since epoch
      if (typeof value === 'number') return new Date(value);
      // ISO/string date
      if (typeof value === 'string') return new Date(value);
      // Fallback: try constructing Date directly
      return new Date(value);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const loadPlan = async () => {
      try {
        setPlanLoading(true);
        setPlanError("");
        const response = await stripeService.getCurrentPlan();
        if (response.success) {
          setCurrentPlan(response.plan);
        } else {
          if (response.error && String(response.error).toLowerCase().includes('plan not found')) {
            setCurrentPlan(null);
            setPlanError("");
          } else {
            setPlanError(response.error || "Failed to load current plan");
          }
        }
      } catch (err) {
        const msg = typeof err === 'string' ? err : err?.error || err?.message || "Failed to load current plan";
        if (String(msg).toLowerCase().includes('plan not found')) {
          setCurrentPlan(null);
          setPlanError("");
        } else {
          setPlanError(msg);
        }
      } finally {
        setPlanLoading(false);
      }
    };
    loadPlan();
    // Load payment methods
    (async () => {
      try {
        const pm = await stripeAPI.getPaymentMethods();
        if (pm.success) setPaymentMethods(pm.paymentMethods);
      } catch (_) {}
    })();
    // Load provider orders
    (async () => {
      try {
        setOrdersLoading(true);
        const myOrders = await orderAPI.getMyOrders({ limit: 10, offset: 0, sortBy: 'createdAt', sortOrder: 'desc' });
        const arr = myOrders?.data?.orders || myOrders?.orders || [];
        setOrders(arr);
      } catch (_) {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    })();
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
        const refreshed = await stripeService.getCurrentPlan();
        if (refreshed.success) setCurrentPlan(refreshed.plan);
      }
    } catch (err) {
      setPlanError(typeof err === 'string' ? err : err?.error || err?.message || "Unable to start checkout");
    }
  };

  return (
    <ProviderAuthGuard>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827" }}>Payment & Subscription</Typography>
          <Button variant="contained" sx={{ textTransform: "none", background: "#00ADB4" }} onClick={() => navigate('/provider-dashboard/withdrawal')}>Request Withdrawal</Button>
        </Box>

        {/* Payment Analytics */}
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#111827" }}>Payment Analytics</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
          {[{k:"Available Balance", v:1250}, {k:"Pending Balance", v:350}, {k:"Lifetime Earnings", v:5500}].map((m) => (
            <Card key={m.k} elevation={0} sx={{ p: 2, border: "1px solid #E5E7EB", borderRadius: 2 }}>
              <Typography sx={{ color: "#6B7280", fontSize: 12 }}>{m.k}</Typography>
              <Typography sx={{ fontWeight: 800, color: "#111827", mt: 0.5 }}>{money(m.v)}</Typography>
            </Card>
          ))}
        </Box>

        {/* Payment Methods - removed as requested */}

        {/* Order Billing History */}
        <Card elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: 2 }}>
          <Box sx={{ px: 2, py: 1.25, borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#111827" }}>Order Billing History</Typography>
          </Box>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0, background: '#FFFFFF' }}>
            <Table size="small" sx={{
              '& th': { color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', fontSize: 12 },
              '& td': { color: '#111827', fontSize: 14 },
            }}>
              <TableHead>
                <TableRow sx={{ background: "#F9FAFB" }}>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Invoice</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ordersLoading ? (
                  <TableRow><TableCell colSpan={5}><Typography variant="caption" sx={{ color: '#6B7280' }}>Loading…</Typography></TableCell></TableRow>
                ) : orders.length === 0 ? (
                  <TableRow><TableCell colSpan={5}><Typography variant="caption" sx={{ color: '#6B7280' }}>No orders</Typography></TableCell></TableRow>
                ) : (
                  orders.map((o, i) => {
                    const total = o.pricing?.totalAmount ?? o.totalAmount ?? 0;
                    const created = formatDate(o.createdAt) || formatDate(o.bookingDetails?.scheduledDate) || formatDate(o.updatedAt);
                    return (
                      <TableRow key={o.id || i} hover sx={{ backgroundColor: '#FFFFFF', "&:nth-of-type(odd)": { backgroundColor: "#FCFCFD" } }}>
                        <TableCell>#{(o.id || o.orderId || '').toString().slice(-6) || '—'}</TableCell>
                        <TableCell>{created && !isNaN(created.getTime()) ? created.toLocaleDateString() : '—'}</TableCell>
                        <TableCell>{money(total)}</TableCell>
                        <TableCell>
                          {o.paymentStatus === 'paid' && <StatusChip label="Paid" color={STATUS.paid} />}
                          {o.paymentStatus !== 'paid' && <StatusChip label="Pending" color={STATUS.pending} />}
                        </TableCell>
                        <TableCell>
                          <Button variant="text" size="small" sx={{ textTransform: "none", color: "#00ADB4" }}>Download</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "center", py: 1.5 }}>
            <Pagination
              count={5}
              page={page}
              onChange={(_, p) => setPage(p)}
              size="small"
              sx={{
                '& .MuiPaginationItem-root': { color: '#374151', fontWeight: 600 },
                '& .MuiPaginationItem-root.Mui-selected': { background: '#00ADB4', color: '#fff' },
              }}
            />
          </Box>
        </Card>

        {/* Plans & Subscription */}
        <Card elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: 2, mb: 2 }}>
          <Box sx={{ px: 2, py: 1.25, borderBottom: "1px solid #E5E7EB", background: "#F9FAFB", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#111827" }}>Plans & Subscription</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button variant="outlined" size="small" onClick={() => setPlanBillingCycle(planBillingCycle === 'monthly' ? 'yearly' : 'monthly')} sx={{ textTransform: 'none' }}>
                Billing: {planBillingCycle === 'monthly' ? 'Monthly' : 'Yearly'}
              </Button>
              <Button variant="text" size="small" onClick={() => window.dispatchEvent(new Event('focus'))} sx={{ textTransform: 'none', color: '#00ADB4' }}>Refresh</Button>
            </Box>
          </Box>
          <Box sx={{ p: 2 }}>
            {planLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}><CircularProgress size={24} /></Box>
            ) : planError ? (
              <Alert severity="error">{planError}</Alert>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                {(() => {
                  const effectivePlanName = currentPlan?.planName || 'free';
                  const effectivePlanType = currentPlan?.planType || planBillingCycle;
                  const effectiveDaysRemaining = currentPlan?.daysRemaining;
                  return (
                    <>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#6B7280' }}>Current Plan</Typography>
                        <Typography sx={{ fontWeight: 700, color: '#111827' }}>{PLAN_CONFIG[effectivePlanName]?.label || effectivePlanName}</Typography>
                        <Typography variant="caption" sx={{ color: '#6B7280' }}>
                          {effectivePlanType.replace(/^./, (c) => c.toUpperCase())}
                          {effectiveDaysRemaining != null ? ` • ${effectiveDaysRemaining} days remaining` : ''}
                        </Typography>
                      </Box>
                    </>
                  );
                })()}
              </Box>
            )}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
              {Object.keys(PLAN_CONFIG).map((planKey) => {
                const plan = PLAN_CONFIG[planKey];
                const isCurrent = (currentPlan?.planName || 'free') === planKey;
                const price = plan[planBillingCycle].price;
                return (
                  <Card key={planKey} sx={{ p: 2, borderRadius: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: isCurrent ? `2px solid ${plan.color}` : '1px solid #E5E7EB' }}>
                    <Typography sx={{ fontWeight: 700, color: '#111827', mb: 0.5 }}>{plan.label}</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1F2937', mb: 1 }}>
                      {price === 0 ? 'Free' : `$${price}`} <Typography component="span" variant="body2" sx={{ color: '#6B7280' }}>/ {planBillingCycle}</Typography>
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1 }}>
                      {plan.features.map((f) => (
                        <Typography key={f} variant="caption" sx={{ color: '#6B7280' }}>• {f}</Typography>
                      ))}
                    </Box>
                    <Button
                      fullWidth
                      variant={isCurrent ? 'outlined' : 'contained'}
                      onClick={() => !isCurrent && handleChoosePlan(planKey)}
                      disabled={isCurrent}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        backgroundColor: isCurrent ? 'transparent' : plan.color,
                        color: isCurrent ? '#111827' : '#fff',
                        '&:hover': { backgroundColor: isCurrent ? 'transparent' : '#009DA4' },
                      }}
                    >
                      {isCurrent ? 'Current Plan' : (price === 0 ? 'Choose Free' : 'Upgrade')}
                    </Button>
                  </Card>
                );
              })}
            </Box>
          </Box>
        </Card>

        {/* Subscription Renewal */}
        <Card elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: 2 }}>
          <Box sx={{ px: 2, py: 1.25, borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#111827" }}>Subscription Renewal</Typography>
          </Box>
          <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {planLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CircularProgress size={18} />
                <Typography variant="caption" sx={{ color: '#6B7280' }}>Loading renewal info…</Typography>
              </Box>
            ) : currentPlan ? (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Chip
                    size="small"
                    label={`${(PLAN_CONFIG[currentPlan.planName]?.label || currentPlan.planName)} Plan`}
                    sx={{ background: "#EEF7F8", color: "#00ADB4", fontWeight: 700 }}
                  />
                  <Typography variant="caption" sx={{ color: "#6B7280" }}>
                    {(() => {
                      const d = formatDate(currentPlan.endDate);
                      return d && !isNaN(d.getTime())
                        ? `Renews on ${d.toLocaleDateString()}`
                        : 'Renewal date not available';
                    })()}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  sx={{ textTransform: "none", background: "#00ADB4" }}
                  onClick={() => window.dispatchEvent(new Event('focus'))}
                >
                  Refresh
                </Button>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Chip size="small" label="Free Plan" sx={{ background: "#F3F4F6", color: "#374151", fontWeight: 700 }} />
                <Typography variant="caption" sx={{ color: "#6B7280" }}>No renewal scheduled</Typography>
              </Box>
            )}
          </Box>
        </Card>
      </Box>
    </ProviderAuthGuard>
  );
}


