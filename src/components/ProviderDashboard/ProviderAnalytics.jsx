import React, { useEffect, useMemo, useState } from "react";
import ProviderAuthGuard from "./ProviderAuthGuard";
import {
  Box,
  Card,
  Typography,
  LinearProgress,
  Divider,
} from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid
} from "recharts";
import { orderAPI, apiUtils, feedbackAPI } from "../../services/apiService.js";

const MetricCard = ({ title, value }) => (
  <Card elevation={0} sx={{ p: 2, border: "1px solid #E5E7EB", borderRadius: 2 }}>
    <Typography sx={{ color: "#6B7280", fontSize: 12 }}>{title}</Typography>
    <Typography sx={{ fontWeight: 800, color: "#111827", mt: 0.5 }}>{value}</Typography>
  </Card>
);

const MiniBar = ({ data }) => (
  <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, height: 72 }}>
    {data.map((h, i) => (
      <Box key={i} sx={{ width: 10, height: h, background: "#CBD5E1", borderRadius: 1 }} />
    ))}
  </Box>
);

const RatingBreakdown = ({ avg, dist }) => {
  const safeDist = dist && typeof dist === 'object' ? dist : { 1:0, 2:0, 3:0, 4:0, 5:0 };
  const total = Object.values(safeDist).reduce((a,b)=>a+b,0) || 1;
  const order = [5,4,3,2,1];
  return (
    <Card elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: 2 }}>
      <Box sx={{ px: 2, py: 1, borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111827" }}>Ratings Breakdown</Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Typography sx={{ fontWeight: 800, color: "#111827", mb: 0.5 }}>{avg?.toFixed(1) || '0.0'}</Typography>
        <Typography sx={{ color: "#6B7280", fontSize: 12, mb: 1 }}>Overall</Typography>
        {order.map((s) => (
          <Box key={s} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography sx={{ width: 40, color: '#6B7280', fontSize: 12 }}>{s} Stars</Typography>
            <LinearProgress variant="determinate" value={Math.round(((safeDist[s]||0)/total)*100)} sx={{ flex: 1, height: 6, borderRadius: 4, background: '#E5E7EB', '& .MuiLinearProgress-bar': { background: '#00ADB4' } }} />
          </Box>
        ))}
      </Box>
    </Card>
  );
};

export default function ProviderAnalytics() {
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [monthlyBookings, setMonthlyBookings] = useState([]); // [{m:'Jan', v:10}]
  const [monthlyEarnings, setMonthlyEarnings] = useState([]); // [{d:'Jan', v:100}]
  const [serviceBookings, setServiceBookings] = useState([]); // [{label:'Plumbing', v:12}]
  const [serviceEarnings, setServiceEarnings] = useState([]); // [{label:'Plumbing', v:1200}]
  const [avgRating, setAvgRating] = useState(0);
  const [ratingDist, setRatingDist] = useState({ 1:0, 2:0, 3:0, 4:0, 5:0 });

  const monthLabels = useMemo(() => {
    const labels = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(d.toLocaleString("en-US", { month: "short" }));
    }
    return labels; // Jan..Dec rolling 12
  }, []);

  const toJsDate = (value) => {
    try {
      if (!value) return null;
      if (value instanceof Date) return value;
      if (typeof value?.toDate === "function") return value.toDate();
      if (value?.seconds !== undefined) return new Date(value.seconds * 1000);
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const currentUser = apiUtils.getUser();
        const providerId = currentUser?.uid;
        if (!providerId) {
          setLoading(false);
          return;
        }

        // Fetch all provider orders in batches
        const batchSize = 100;
        let offset = 0;
        const allOrders = [];
        // Cap at 2000 for safety
        for (let guard = 0; guard < 20; guard++) {
          const resp = await orderAPI.getOrdersByProvider(providerId, {
            limit: batchSize,
            offset,
            sortBy: "createdAt",
            sortOrder: "desc",
          });
          const orders = resp?.data?.orders || resp?.orders || [];
          allOrders.push(...orders);
          if (orders.length < batchSize) break;
          offset += batchSize;
        }

        // Aggregations from orders
        const monthCountsMap = new Map(monthLabels.map((m) => [m, 0]));
        const monthEarnMap = new Map(monthLabels.map((m) => [m, 0]));
        const svcCountMap = new Map();
        const svcEarnMap = new Map();
        let totalEarn = 0;

        allOrders.forEach((order) => {
          const dateVal = order?.bookingDetails?.scheduledDate || order?.createdAt;
          const jsDate = toJsDate(dateVal);
          const monthKey = jsDate
            ? jsDate.toLocaleString("en-US", { month: "short" })
            : monthLabels[monthLabels.length - 1];

          const amount = Number(order?.pricing?.totalAmount || 0);
          const paid = order?.paymentStatus === "paid";
          // Count bookings
          if (monthCountsMap.has(monthKey)) {
            monthCountsMap.set(monthKey, monthCountsMap.get(monthKey) + 1);
          }
          // Earnings per month (paid only)
          if (paid && monthEarnMap.has(monthKey)) {
            monthEarnMap.set(monthKey, monthEarnMap.get(monthKey) + amount);
            totalEarn += amount;
          }

          // Service type aggregations
          const category = order?.serviceDetails?.category || "other";
          svcCountMap.set(category, (svcCountMap.get(category) || 0) + 1);
          if (paid) {
            svcEarnMap.set(category, (svcEarnMap.get(category) || 0) + amount);
          }
        });

        setTotalEarnings(totalEarn);
        setMonthlyBookings(monthLabels.map((m) => ({ m, v: monthCountsMap.get(m) || 0 })));
        setMonthlyEarnings(monthLabels.map((m) => ({ d: m, v: Math.round((monthEarnMap.get(m) || 0)) })));

        const svcCountsArr = Array.from(svcCountMap.entries()).map(([label, v]) => ({ label, v }));
        const svcEarnArr = Array.from(svcEarnMap.entries()).map(([label, v]) => ({ label, v }));
        // Sort by value desc, take top 6
        svcCountsArr.sort((a, b) => b.v - a.v);
        svcEarnArr.sort((a, b) => b.v - a.v);
        setServiceBookings(svcCountsArr.slice(0, 6));
        setServiceEarnings(svcEarnArr.slice(0, 6));
        // Fetch rating stats
        try {
          const fb = await feedbackAPI.getFeedbackStats(providerId);
          if (fb?.success) {
            const data = fb.data || fb;
            setAvgRating(Number(data.averageRating || 0));
            setRatingDist({
              1: Number(data.distribution?.[1] || 0),
              2: Number(data.distribution?.[2] || 0),
              3: Number(data.distribution?.[3] || 0),
              4: Number(data.distribution?.[4] || 0),
              5: Number(data.distribution?.[5] || 0),
            });
          }
        } catch (err) {
          console.warn('Feedback stats not available:', err);
        }
      } catch (e) {
        console.error("Analytics load failed:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [monthLabels]);

  const fmtCurrency = (v) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v || 0);

  return (
    <ProviderAuthGuard>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827" }}>Analytics</Typography>

        {/* Top metrics */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
          <MetricCard title="Profile Views" value="1,234" />
          <MetricCard title="Conversion Rate" value="15%" />
          <MetricCard title="Total Earning" value={fmtCurrency(totalEarnings)} />
          <MetricCard title="Top Services" value="3" />
        </Box>

        {/* Monthly trend */}
        <Card elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 2 }}>
          <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827' }}>Monthly Bookings Trend</Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Box sx={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyBookings.slice(-12)}> 
                  <defs>
                    <linearGradient id="colorTeal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ADB4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00ADB4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip cursor={{ stroke: '#E5E7EB' }} />
                  <Area type="monotone" dataKey="v" stroke="#00ADB4" fill="url(#colorTeal)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Card>

        {/* Three cards row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          <Card elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 2 }}>
            <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827' }}>Earnings</Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography sx={{ fontWeight: 800, color: '#111827' }}>{fmtCurrency(monthlyEarnings.slice(-1)[0]?.v)}</Typography>
              <Typography sx={{ color: '#6B7280', fontSize: 12, mb: 1 }}>Last Month</Typography>
              <Box sx={{ height: 120 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyEarnings.slice(-6)}> 
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2F7" />
                    <XAxis dataKey="d" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip />
                    <Bar dataKey="v" fill="#CBD5E1" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Card>
          <Card elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 2 }}>
            <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827' }}>Bookings</Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography sx={{ fontWeight: 800, color: '#111827' }}>{monthlyBookings.slice(-1)[0]?.v || 0}</Typography>
              <Typography sx={{ color: '#6B7280', fontSize: 12, mb: 1 }}>Last Month</Typography>
              <Box sx={{ height: 120 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyBookings.slice(-6).map(({ m, v }) => ({ d: m, v }))}> 
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2F7" />
                    <XAxis dataKey="d" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip />
                    <Bar dataKey="v" fill="#DDEEEF" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Card>
          <RatingBreakdown />
        </Box>

        {/* Earnings per service type */}
        <Card elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 2 }}>
          <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827' }}>Earnings Per Service Type</Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 140, px: 1 }}>
              {(() => {
                const max = Math.max(1, ...serviceEarnings.map((x) => x.v));
                return serviceEarnings.map((x) => (
                  <Box key={x.label} sx={{ width: 60, height: Math.max(8, Math.round((x.v / max) * 120)), background: '#DDEEEF', borderRadius: 1 }} />
                ));
              })()}
            </Box>
            <Box sx={{ display: 'flex', gap: 6, color: '#6B7280', fontSize: 12, mt: 1, px: 1 }}>
              {serviceEarnings.map((x) => (
                <Typography key={x.label} sx={{ width: 60, textAlign: 'center' }}>{x.label}</Typography>
              ))}
            </Box>
          </Box>
        </Card>

        {/* Review ratings breakdown */}
        <Card elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 2 }}>
          <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827' }}>Review Ratings Breakdown</Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Typography sx={{ color: '#111827', fontWeight: 800 }}>4.8/5.0</Typography>
            <Typography sx={{ color: '#6B7280', fontSize: 12, mb: 1 }}>Overall <span style={{ color: '#10B981' }}>+2%</span></Typography>
            {[5,4,3,2,1].map((s, i) => (
              <Box key={s} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography sx={{ width: 40, color: '#6B7280', fontSize: 12 }}>{s} Stars</Typography>
                <LinearProgress variant="determinate" value={[80,95,70,68,22][i]} sx={{ flex: 1, height: 8, borderRadius: 4, background: '#E5E7EB', '& .MuiLinearProgress-bar': { background: '#DDEEEF' } }} />
                <Box sx={{ width: 2, height: 8, background: '#9CA3AF' }} />
              </Box>
            ))}
          </Box>
        </Card>
      </Box>
    </ProviderAuthGuard>
  );
}


