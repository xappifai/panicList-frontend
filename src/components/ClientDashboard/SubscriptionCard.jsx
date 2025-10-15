// src/components/ClientDashboard/SubscriptionCard.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Divider, CircularProgress } from "@mui/material";
import { stripeService } from "../../services/stripeService";

export default function SubscriptionCard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const resp = await stripeService.getCurrentPlan();
        if (resp?.success) {
          setPlan(resp.plan);
        } else {
          setError(resp?.error || "");
        }
      } catch (e) {
        setError(typeof e === 'string' ? e : e?.error || e?.message || '');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const labelFromPlan = (p) => {
    if (!p) return { title: '—', sub: 'Subscription' };
    const name = (p.planName || '').charAt(0).toUpperCase() + (p.planName || '').slice(1);
    const type = (p.planType || '').charAt(0).toUpperCase() + (p.planType || '').slice(1);
    return { title: type || '—', sub: name ? `${name} Plan` : 'Subscription' };
  };

  const { title, sub } = labelFromPlan(plan);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: "10px",
        border: "1px solid #E5E7EB",
        fontFamily: "Manrope, sans-serif",
      }}
    >
      {/* Teal header with wave */}
      <Box
        sx={{
          position: "relative",
          flex: 1,
          bgcolor: "primary.main", // teal background
          color: "common.white",
          px: 3,
          pt: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          fontFamily: "Manrope, sans-serif",
        }}
      >
        {/* Wave Image as a background */}
        <Box
          component="img"
          src="/assets/images/waves.png"
          alt="Wave Background"
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 0,
            width: "100%",
            height: "auto",
          }}
        />

        <Box>
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} sx={{ color: 'white' }} />
              <Typography variant="body2">Loading…</Typography>
            </Box>
          ) : (
            <>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  fontFamily: "Manrope, sans-serif",
                }}
              >
                {title}
              </Typography>
              <Typography sx={{ fontFamily: "Manrope, sans-serif" }}>
                {sub}
              </Typography>
            </>
          )}
        </Box>

        {/* Percentage badge */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            bgcolor: "grey.200",
            borderRadius: 1,
            px: 1,
            py: 0.5,
            fontFamily: "Manrope, sans-serif",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "black",
              fontFamily: "Manrope, sans-serif",
            }}
          >
            12%
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Manage button */}
      <Box
        sx={{ p: 2, textAlign: "center", fontFamily: "Manrope, sans-serif" }}
      >
          {error ? (
            <Typography variant="caption" color="error">{error}</Typography>
          ) : (
            <Typography
              variant="button"
              color="primary.dark"
              sx={{ fontFamily: "Manrope, sans-serif" }}
            >
              Manage Subscription
            </Typography>
          )}
      </Box>
    </Box>
  );
}
