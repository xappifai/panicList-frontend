import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ExpandMore,
  Check,
  Close,
  ArrowBack,
} from "@mui/icons-material";
import { stripeService } from "../services/stripeService.js";
import { apiUtils } from "../services/apiService.js";

export default function PricingPlans() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [expanded, setExpanded] = useState("panel0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPlan, setCurrentPlan] = useState(null);

  const handleBillingChange = (event, newBillingCycle) => {
    if (newBillingCycle !== null) {
      setBillingCycle(newBillingCycle);
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Check user authentication on component mount
  useEffect(() => {
    const checkUser = () => {
      const user = apiUtils.getUser();
      
      if (!user) {
        // No user data, redirect to login
        console.log('No user data found, redirecting to login');
        navigate('/login');
        return;
      }
      
      if (user.userType !== 'provider') {
        // Not a provider, redirect to appropriate dashboard
        console.log('User is not a provider, redirecting to client dashboard');
        navigate('/client-dashboard');
        return;
      }
      
      // User is a provider, we can proceed to show pricing plans
      // Skip loading current plan for now to avoid authentication issues
      console.log('Provider user found, showing pricing plans');
      console.log('User data:', user);
    };

    checkUser();
  }, []);

  // Handle plan selection
  const handlePlanSelect = async (planId) => {
    const user = apiUtils.getUser();
    
    if (!user) {
      setError("Please login to select a plan");
      navigate('/login');
      return;
    }

    if (user.userType !== 'provider') {
      setError("Only providers can select plans");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log('Creating checkout session for plan:', planId, 'billing:', billingCycle);
      const result = await stripeService.createCheckoutSession(planId, billingCycle);
      
      if (result.success) {
        if (result.freePlan) {
          // Free plan activated
          setSuccess(result.message);
          setCurrentPlan(result.plan);
          
          // Redirect to provider dashboard after a delay
          setTimeout(() => {
            navigate("/provider-dashboard");
          }, 2000);
        } else if (result.redirecting) {
          // Redirecting to Stripe checkout
          setSuccess("Redirecting to payment...");
        }
      }
    } catch (error) {
      console.error('Error selecting plan:', error);
      
      // If we get a 401, it means we need proper authentication
      if (error.response?.status === 401) {
        setError("Authentication required. Please log out and log back in to continue.");
        // Don't redirect automatically, let user decide
      } else {
        setError(error.message || "Failed to select plan. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: "free",
      name: "FREE",
      description: "Perfect for getting started with basic features.",
      price: "$0",
      period: "Forever",
      features: [
        { text: "Up to 5 listings", included: true },
        { text: "Basic profile", included: true },
        { text: "Email support", included: true },
        { text: "Basic analytics", included: false },
        { text: "Custom domain", included: false },
        { text: "API access", included: false },
        { text: "Priority support", included: false },
        { text: "White label", included: false },
      ],
      popular: false,
      buttonColor: "primary",
    },
    {
      id: "basic",
      name: "BASIC",
      description: "For growing providers who need more features.",
      price: billingCycle === "monthly" ? "$29.99" : "$299.99",
      period: billingCycle === "monthly" ? "Per month" : "Per year",
      features: [
        { text: "Up to 25 listings", included: true },
        { text: "Enhanced profile", included: true },
        { text: "Priority support", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Custom domain", included: false },
        { text: "API access", included: false },
        { text: "White label", included: false },
      ],
      popular: true,
      buttonColor: "secondary",
    },
    {
      id: "premium",
      name: "PREMIUM",
      description: "For established providers with advanced needs.",
      price: billingCycle === "monthly" ? "$59.99" : "$599.99",
      period: billingCycle === "monthly" ? "Per month" : "Per year",
      features: [
        { text: "Up to 100 listings", included: true },
        { text: "Premium profile", included: true },
        { text: "Priority support", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Custom domain", included: true },
        { text: "API access", included: true },
        { text: "White label", included: false },
      ],
      popular: false,
      buttonColor: "primary",
    },
    {
      id: "enterprise",
      name: "ENTERPRISE",
      description: "For large businesses with unlimited needs.",
      price: billingCycle === "monthly" ? "$99.99" : "$999.99",
      period: billingCycle === "monthly" ? "Per month" : "Per year",
      features: [
        { text: "Unlimited listings", included: true },
        { text: "Enterprise profile", included: true },
        { text: "24/7 priority support", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Custom domain", included: true },
        { text: "Full API access", included: true },
        { text: "White label solution", included: true },
      ],
      popular: false,
      buttonColor: "primary",
    },
  ];

  const faqData = [
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription in your dashboard.",
    },
    {
      question: "Will I get a refund?",
      answer: "Refunds are not issued for partial months, but you'll retain access until your billing period ends.",
    },
    {
      question: "Is my payment secure?",
      answer: "Yes, we use Stripe/PayPal with full PCI compliance",
    },
  ];

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box sx={{ backgroundColor: "white", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  color: "#212832",
                  mb: 2,
                  "& span": {
                    color: "#00ADB5",
                  },
                }}
              >
                Pick a <span>plan</span> that's right for you
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#666",
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                Pricing plans for businesses at every stage of growth. Try our risk-free for 14 days. No credit card required.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "400px",
                }}
              >
                <Box
                  component="img"
                  src="/assets/images/plan_heroSection.png"
                  alt="Pricing Plans Hero"
                  sx={{
                    maxWidth: "100%",
                    height: "auto",
                    maxHeight: "400px",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Pricing Plans Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          {/* Billing Toggle */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
            <ToggleButtonGroup
              value={billingCycle}
              exclusive
              onChange={handleBillingChange}
              sx={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                "& .MuiToggleButton-root": {
                  px: 3,
                  py: 1.5,
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  "&.Mui-selected": {
                    backgroundColor: "#00ADB5",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#00ADB5",
                    },
                  },
                  "&:not(.Mui-selected)": {
                    backgroundColor: "transparent",
                    color: "#666",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  },
                },
              }}
            >
              <ToggleButton value="free">Free</ToggleButton>
              <ToggleButton value="monthly">Monthly</ToggleButton>
              <ToggleButton value="yearly">Yearly</ToggleButton>
              <ToggleButton 
                value="yearly" 
                sx={{ 
                  backgroundColor: "#fff3cd !important",
                  color: "#856404 !important",
                  "&:hover": {
                    backgroundColor: "#ffeaa7 !important",
                  }
                }}
              >
                Save 20%
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Error and Success Messages */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, maxWidth: '1200px', mx: 'auto' }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3, maxWidth: '1200px', mx: 'auto' }}>
              {success}
            </Alert>
          )}

          {/* Current Plan Display */}
          {currentPlan && (
            <Alert severity="info" sx={{ mb: 3, maxWidth: '1200px', mx: 'auto' }}>
              Current Plan: {currentPlan.planName} ({currentPlan.planType}) - {currentPlan.daysRemaining} days remaining
            </Alert>
          )}

          {/* Pricing Cards */}
          <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
            <Grid container spacing={3} sx={{ flexWrap: 'nowrap' }}>
              {plans.map((plan, index) => (
                <Grid item xs={12} md={4} key={index} sx={{ flex: '1 1 0%' }}>
                <Paper
                  elevation={plan.popular ? 8 : 2}
                  sx={{
                    p: 4,
                    borderRadius: "16px",
                    height: "100%",
                    position: "relative",
                    backgroundColor: plan.popular ? "#00ADB5" : "white",
                    color: plan.popular ? "white" : "#212832",
                    transform: plan.popular ? "scale(1.05)" : "none",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: plan.popular ? "scale(1.07)" : "scale(1.02)",
                    },
                  }}
                >
                  {plan.popular && (
                    <Chip
                      label="Popular"
                      sx={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#212832",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  )}

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      color: plan.popular ? "white" : "#212832",
                    }}
                  >
                    {plan.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      mb: 3,
                      color: plan.popular ? "rgba(255,255,255,0.8)" : "#666",
                    }}
                  >
                    {plan.description}
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: plan.popular ? "white" : "#212832",
                      }}
                    >
                      {plan.price}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: plan.popular ? "rgba(255,255,255,0.8)" : "#666",
                      }}
                    >
                      {plan.period}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    {plan.features.map((feature, featureIndex) => (
                      <Box
                        key={featureIndex}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor: feature.included ? "#4caf50" : "#f44336",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 2,
                          }}
                        >
                          {feature.included ? (
                            <Check sx={{ color: "white", fontSize: 14 }} />
                          ) : (
                            <Close sx={{ color: "white", fontSize: 14 }} />
                          )}
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: plan.popular ? "rgba(255,255,255,0.9)" : "#666",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {feature.text}
                          {feature.comingSoon && (
                            <Chip
                              label="Coming Soon"
                              size="small"
                              sx={{
                                ml: 1,
                                backgroundColor: "#4caf50",
                                color: "white",
                                fontSize: "10px",
                                height: "20px",
                              }}
                            />
                          )}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    onClick={() => handlePlanSelect(plan.id)}
                    sx={{
                      py: 1.5,
                      backgroundColor: plan.popular ? "white" : "#00ADB5",
                      color: plan.popular ? "#00ADB5" : "white",
                      fontWeight: 600,
                      borderRadius: "10px",
                      mb: 2,
                      "&:hover": {
                        backgroundColor: plan.popular ? "#f5f5f5" : "#009DA5",
                      },
                      "&:disabled": {
                        backgroundColor: "#ccc",
                        color: "#666",
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : plan.id === "free" ? (
                      "Get Started Free"
                    ) : (
                      "Choose Plan"
                    )}
                  </Button>

                  <Typography
                    variant="caption"
                    sx={{
                      color: plan.popular ? "rgba(255,255,255,0.7)" : "#999",
                      textAlign: "center",
                      display: "block",
                    }}
                  >
                    No credit card required
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          </Box>
        </Container>
      </Box>

      {/* Payment Methods Section */}
      <Box sx={{ backgroundColor: "white", py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "#212832",
                mb: 2,
              }}
            >
              Payment Methods
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#666",
                fontWeight: 400,
              }}
            >
              We accept Visa, American Express, Mastercard, Paypal and Crypto
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            {["Visa", "Mastercard", "Maestro", "PayPal", "Discover", "Amex", "Bitcoin", "Ethereum", "Litecoin"].map((method, index) => (
              <Box
                key={index}
                sx={{
                  width: 80,
                  height: 50,
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  color: "#666",
                  border: "1px solid #e0e0e0",
                }}
              >
                {method}
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#212832",
              mb: 2,
              textAlign: "center",
            }}
          >
            FAQ (Payments)
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#666",
              textAlign: "center",
              mb: 6,
              maxWidth: 800,
              mx: "auto",
            }}
          >
            Monthly plans renew automatically each month. Yearly plans renew once per year. Cancel anytime from your dashboard. Receipts and billing history available in your account.
          </Typography>

          <Box sx={{ maxWidth: 800, mx: "auto" }}>
            {faqData.map((faq, index) => (
              <Accordion
                key={index}
                expanded={expanded === `panel${index}`}
                onChange={handleAccordionChange(`panel${index}`)}
                sx={{
                  mb: 2,
                  borderRadius: "8px",
                  "&:before": {
                    display: "none",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    fontWeight: 600,
                    color: "#212832",
                  }}
                >
                  {faq.question}
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: "#666" }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Footer Navigation */}
      <Box sx={{ backgroundColor: "white", py: 4, borderTop: "1px solid #e0e0e0" }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              sx={{
                backgroundColor: "#666",
                color: "white",
                px: 4,
                py: 1.5,
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: "#555",
                },
              }}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#00ADB5",
                color: "white",
                px: 4,
                py: 1.5,
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: "#009DA5",
                },
              }}
            >
              Continue
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
