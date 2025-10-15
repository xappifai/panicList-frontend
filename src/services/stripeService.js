import { loadStripe } from '@stripe/stripe-js';
import { stripeAPI } from './apiService.js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Stripe service for frontend
export const stripeService = {
  // Initialize Stripe
  getStripe: async () => {
    return await stripePromise;
  },

  // Create checkout session and redirect to Stripe
  createCheckoutSession: async (planName, planType) => {
    try {
      const successUrl = `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/pricing-plans`;

      console.log('Stripe service - creating checkout session:', {
        planName,
        planType,
        successUrl,
        cancelUrl
      });

      const response = await stripeAPI.createCheckoutSession(
        planName,
        planType,
        successUrl,
        cancelUrl
      );

      if (response.success) {
        if (response.freePlan) {
          // Free plan - no payment required
          return {
            success: true,
            freePlan: true,
            message: response.message,
            plan: response.plan
          };
        } else {
          // Paid plan - redirect to Stripe checkout
          const stripe = await stripeService.getStripe();
          const { error } = await stripe.redirectToCheckout({
            sessionId: response.sessionId
          });

          if (error) {
            throw new Error(error.message);
          }

          return {
            success: true,
            redirecting: true
          };
        }
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  },

  // Handle payment success
  handlePaymentSuccess: async (sessionId) => {
    try {
      const response = await stripeAPI.handlePaymentSuccess(sessionId);
      return response;
    } catch (error) {
      console.error('Error handling payment success:', error);
      throw error;
    }
  },

  // Get current plan
  getCurrentPlan: async () => {
    try {
      const response = await stripeAPI.getCurrentPlan();
      return response;
    } catch (error) {
      console.error('Error getting current plan:', error);
      throw error;
    }
  },

  // Create order payment session and redirect to Stripe
  createOrderPaymentSession: async (orderId) => {
    try {
      const { orderAPI } = await import('./apiService.js');
      
      console.log('Stripe service - creating order payment session for order:', orderId);
      
      const response = await orderAPI.createOrderPaymentSession(orderId);
      
      if (response.success) {
        const stripe = await stripeService.getStripe();
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.data.sessionId
        });

        if (error) {
          throw new Error(error.message);
        }
        
        return {
          success: true,
          message: 'Redirecting to payment...'
        };
      } else {
        throw new Error(response.message || 'Failed to create payment session');
      }
    } catch (error) {
      console.error('Stripe service - order payment error:', error);
      throw error;
    }
  },

  // Upgrade plan
  upgradePlan: async (newPlanName, newPlanType) => {
    try {
      const response = await stripeAPI.upgradePlan(newPlanName, newPlanType);
      return response;
    } catch (error) {
      console.error('Error upgrading plan:', error);
      throw error;
    }
  },

  // Cancel plan
  cancelPlan: async () => {
    try {
      const response = await stripeAPI.cancelPlan();
      return response;
    } catch (error) {
      console.error('Error cancelling plan:', error);
      throw error;
    }
  }
};

export default stripeService;
