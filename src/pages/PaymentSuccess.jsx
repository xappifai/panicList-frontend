import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  CheckCircle,
  ArrowForward,
} from "@mui/icons-material";
import { stripeService } from "../services/stripeService.js";
import { apiUtils } from "../services/apiService.js";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setError("No session ID found");
        setLoading(false);
        return;
      }

      if (!apiUtils.isAuthenticated()) {
        setError("Please login to complete payment");
        setLoading(false);
        // Redirect to login page after showing error
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }

      try {
        const response = await stripeService.handlePaymentSuccess(sessionId);
        
        if (response.success) {
          setSuccess(response.message);
          setPlan(response.plan);
          
          // Redirect based on user type
          const user = apiUtils.getUser?.();
          if (user?.userType === 'provider') {
            navigate("/provider-dashboard");
          } else {
            navigate("/client-dashboard");
          }
        } else {
          // Fallback: check current plan in case webhook already activated it
          try {
            const planCheck = await stripeService.getCurrentPlan();
            if (planCheck.success) {
              setSuccess("Plan activated successfully");
              setPlan(planCheck.plan);
              const user = apiUtils.getUser?.();
              if (user?.userType === 'provider') {
                navigate("/provider-dashboard");
              } else {
                navigate("/client-dashboard");
              }
              return;
            }
          } catch (_) {}
          setError(response.error || "Payment processing failed");
        }
      } catch (err) {
        console.error('PaymentSuccess: Error handling payment success:', err);
        // Extract meaningful error message
        const msg = err?.response?.data?.error
          || err?.response?.data?.message
          || err?.error
          || err?.message
          || (typeof err === 'string' ? err : null)
          || "Failed to process payment";
        
        // Fallback: check current plan
        try {
          const planCheck = await stripeService.getCurrentPlan();
          if (planCheck.success) {
            setSuccess("Plan activated successfully");
            setPlan(planCheck.plan);
            const user = apiUtils.getUser?.();
            if (user?.userType === 'provider') {
              navigate("/provider-dashboard");
            } else {
              navigate("/client-dashboard");
            }
            return;
          }
        } catch (_) {}
        
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    handlePaymentSuccess();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: "16px",
            }}
          >
            <CircularProgress size={60} sx={{ mb: 3, color: "#00ADB5" }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Processing Payment...
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please wait while we confirm your payment and activate your plan.
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: "16px",
          }}
        >
          {error ? (
            <>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "#f44336",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <Typography variant="h3" sx={{ color: "white" }}>
                  ✗
                </Typography>
              </Box>
              
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: "#f44336" }}>
                Payment Failed
              </Typography>
              
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
              
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/pricing-plans")}
                sx={{
                  backgroundColor: "#00ADB5",
                  color: "white",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: "10px",
                  "&:hover": {
                    backgroundColor: "#009DA5",
                  },
                }}
              >
                Try Again
              </Button>
            </>
          ) : (
            <>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "#4caf50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <CheckCircle sx={{ fontSize: 50, color: "white" }} />
              </Box>
              
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: "#4caf50" }}>
                Payment Successful!
              </Typography>
              
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
              
              {plan && (
                <Box
                  sx={{
                    backgroundColor: "#f5f5f5",
                    p: 3,
                    borderRadius: "10px",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Plan Details
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Plan:</strong> {plan.planName} ({plan.planType})
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Price:</strong> ${plan.price}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Duration:</strong> {plan.planType === 'monthly' ? '1 Month' : '1 Year'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Days Remaining:</strong> {plan.daysRemaining}
                  </Typography>
                </Box>
              )}
              
              <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
                You will be redirected to your dashboard in a few seconds...
              </Typography>
              
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/provider-dashboard")}
                endIcon={<ArrowForward />}
                sx={{
                  backgroundColor: "#00ADB5",
                  color: "white",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: "10px",
                  "&:hover": {
                    backgroundColor: "#009DA5",
                  },
                }}
              >
                Go to Dashboard
              </Button>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
