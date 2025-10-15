// API Service for Panic List Frontend
import axios from 'axios';

// Base URL configuration - change this to your backend URL
const BASE_URL = import.meta.env.VITE_API_URL || 'https://paniclist02.onrender.com';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('firebaseToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('firebaseToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API routes
export const authAPI = {
  // User registration
  signUp: async (userData) => {
    try {
      const response = await apiClient.post('/api/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Provider registration
  signUpProvider: async (providerData) => {
    try {
      const response = await apiClient.post('/api/auth/signup/provider', providerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // User login
  signIn: async (email, password, userType = null) => {
    try {
      const response = await apiClient.post('/api/auth/login', { email, password, userType });
      return response.data;
    } catch (error) {
      // Extract error message from different possible locations
      const errorData = error.response?.data;
      if (errorData) {
        // Backend returns error message in 'error' field
        throw errorData.error || errorData.message || errorData;
      }
      throw error.message || 'Login failed. Please try again.';
    }
  },

  // Google sign-in
  signInWithGoogle: async () => {
    try {
      const response = await apiClient.post('/api/auth/google');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout
  signOut: async () => {
    try {
      const response = await apiClient.post('/api/auth/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Password reset
  resetPassword: async (email) => {
    try {
      const response = await apiClient.post('/api/auth/reset-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update password
  updatePassword: async (currentPassword, newPassword) => {
    try {
      const response = await apiClient.put('/api/auth/update-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/api/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/api/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update provider profile
  updateProviderProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/api/auth/provider/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete account
  deleteAccount: async () => {
    try {
      const response = await apiClient.delete('/api/auth/account');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify token
  verifyToken: async (idToken) => {
    try {
      const response = await apiClient.post('/api/auth/verify-token', { idToken });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Public: Get providers (no auth required)
  getPublicProviders: async (service = null, page = 1, limit = 20) => {
    try {
      const params = { page, limit };
      if (service) params.service = service;
      const response = await apiClient.get('/api/auth/providers', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Public: Get provider by ID (no auth required)
  getPublicProviderById: async (providerId) => {
    try {
      const response = await apiClient.get(`/api/auth/providers/${providerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// User management API routes
export const userAPI = {
  // Search users (Admin only)
  searchUsers: async (query, userType = null) => {
    try {
      const params = { q: query };
      if (userType) params.type = userType;
      const response = await apiClient.get('/api/users/search', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all clients (Admin only)
  getClients: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/api/users/clients', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all providers
  getProviders: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/api/users/providers', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all providers (Admin only - no filtering)
  getAdminProviders: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/api/users/admin/providers', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all clients (Admin only)
  getAdminClients: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/api/users/clients', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get providers by service
  getProvidersByService: async (service, page = 1, limit = 10) => {
    try {
      const response = await apiClient.get(`/api/users/providers/by-service/${service}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get limited public user fields by ID (fullName, email, uid)
  getPublicUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/api/users/public/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await apiClient.put(`/api/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user status (Admin only)
  updateUserStatus: async (userId, status) => {
    try {
      const response = await apiClient.put(`/api/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify provider (Admin only)
  verifyProvider: async (userId, status, verifiedBy = null) => {
    try {
      const response = await apiClient.put(`/api/users/${userId}/verify`, {
        status,
        verifiedBy
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Rate provider
  rateProvider: async (providerId, rating) => {
    try {
      const response = await apiClient.post(`/api/users/${providerId}/rating`, { rating });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete user (Admin only)
  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Utility functions
export const apiUtils = {
  // Set auth token
  setAuthToken: (token) => {
    localStorage.setItem('firebaseToken', token);
  },

  // Get auth token
  getAuthToken: () => {
    return localStorage.getItem('firebaseToken');
  },

  // Remove auth token
  removeAuthToken: () => {
    localStorage.removeItem('firebaseToken');
    localStorage.removeItem('user');
  },

  // Set user data
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Get user data
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('firebaseToken');
  },

  // Get user type
  getUserType: () => {
    const user = apiUtils.getUser();
    return user?.userType || null;
  },

  // Check if user is admin
  isAdmin: () => {
    return apiUtils.getUserType() === 'admin';
  },

  // Check if user is provider
  isProvider: () => {
    return apiUtils.getUserType() === 'provider';
  },

  // Check if user is client
  isClient: () => {
    return apiUtils.getUserType() === 'client';
  }
};

// Stripe Payment API routes
export const stripeAPI = {
  // Create Stripe customer
  createCustomer: async () => {
    try {
      const response = await apiClient.post('/api/stripe/create-customer');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create checkout session
  createCheckoutSession: async (planName, planType, successUrl, cancelUrl) => {
    try {
      console.log('API service - sending checkout request:', {
        planName,
        planType,
        successUrl,
        cancelUrl
      });
      
      const response = await apiClient.post('/api/stripe/create-checkout', {
        planName,
        planType,
        successUrl,
        cancelUrl
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Handle payment success
  handlePaymentSuccess: async (sessionId) => {
    try {
      const response = await apiClient.post('/api/stripe/payment-success', {
        stripeSessionId: sessionId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get current plan
  getCurrentPlan: async () => {
    try {
      const response = await apiClient.get('/api/stripe/current-plan');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get saved payment methods (cards)
  getPaymentMethods: async () => {
    try {
      const response = await apiClient.get('/api/stripe/payment-methods');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Upgrade plan
  upgradePlan: async (newPlanName, newPlanType) => {
    try {
      const response = await apiClient.post('/api/stripe/upgrade-plan', {
        newPlanName,
        newPlanType
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cancel plan
  cancelPlan: async () => {
    try {
      const response = await apiClient.post('/api/stripe/cancel-plan');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Listing API routes
export const listingAPI = {
  // Get all listings
  getListings: async (filters = {}) => {
    try {
      const response = await apiClient.get('/api/listings', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all listings (alias for getListings)
  getAllListings: async (filters = {}) => {
    try {
      const response = await apiClient.get('/api/listings', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search listings
  searchListings: async (searchTerm, filters = {}) => {
    try {
      const response = await apiClient.get('/api/listings/search', { 
        params: { q: searchTerm, ...filters } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get listing by ID
  getListingById: async (listingId) => {
    try {
      const response = await apiClient.get(`/api/listings/${listingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get listings by provider
  getListingsByProvider: async (providerId, filters = {}) => {
    try {
      const response = await apiClient.get(`/api/listings/provider/${providerId}`, { 
        params: filters 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create listing (Provider only)
  createListing: async (listingData) => {
    try {
      const response = await apiClient.post('/api/listings', listingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update listing (Provider only)
  updateListing: async (listingId, updateData) => {
    try {
      const response = await apiClient.put(`/api/listings/${listingId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update listing status (Provider only)
  updateListingStatus: async (listingId, status) => {
    try {
      const response = await apiClient.patch(`/api/listings/${listingId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete listing (Provider only)
  deleteListing: async (listingId) => {
    try {
      const response = await apiClient.delete(`/api/listings/${listingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Order API routes
export const orderAPI = {
  // Get all orders
  getOrders: async (filters = {}) => {
    try {
      const response = await apiClient.get('/api/orders', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all orders (alias for getOrders)
  getAllOrders: async (filters = {}) => {
    try {
      const response = await apiClient.get('/api/orders', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get current user's orders
  getMyOrders: async (filters = {}) => {
    try {
      const response = await apiClient.get('/api/orders/my', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get orders by customer
  getOrdersByCustomer: async (customerId, filters = {}) => {
    try {
      const response = await apiClient.get(`/api/orders/customer/${customerId}`, { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get orders by provider
  getOrdersByProvider: async (providerId, filters = {}) => {
    try {
      const response = await apiClient.get(`/api/orders/provider/${providerId}`, { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await apiClient.get(`/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post('/api/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update order
  updateOrder: async (orderId, updateData) => {
    try {
      const response = await apiClient.put(`/api/orders/${orderId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await apiClient.put(`/api/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update payment status
  updatePaymentStatus: async (orderId, paymentStatus) => {
    try {
      const response = await apiClient.put(`/api/orders/${orderId}/payment-status`, { paymentStatus });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cancel order
  cancelOrder: async (orderId, cancellationData) => {
    try {
      const response = await apiClient.post(`/api/orders/${orderId}/cancel`, cancellationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add message to order
  addMessage: async (orderId, messageData) => {
    try {
      const response = await apiClient.post(`/api/orders/${orderId}/messages`, messageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add review to order
  addReview: async (orderId, reviewData) => {
    try {
      const response = await apiClient.post(`/api/orders/${orderId}/review`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get order statistics
  getOrderStatistics: async (filters = {}) => {
    try {
      const response = await apiClient.get('/api/orders/statistics', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user order statistics
  getUserOrderStatistics: async (filters = {}) => {
    try {
      const response = await apiClient.get('/api/orders/statistics/user', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create payment session for order
  createOrderPaymentSession: async (orderId) => {
    try {
      const response = await apiClient.post(`/api/orders/${orderId}/payment`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Feedback API
export const feedbackAPI = {
  // Create a new feedback/review
  createFeedback: async (feedbackData) => {
    try {
      const response = await apiClient.post('/api/feedback', feedbackData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get feedback by ID
  getFeedbackById: async (feedbackId) => {
    try {
      const response = await apiClient.get(`/api/feedback/${feedbackId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get feedbacks for a provider
  getProviderFeedbacks: async (providerId, page = 1, limit = 10) => {
    try {
      const response = await apiClient.get(`/api/feedback/provider/${providerId}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get current client's feedbacks
  getClientFeedbacks: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/api/feedback/client/my', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all feedbacks (Admin only)
  getAllFeedbacks: async (page = 1, limit = 10, filters = {}) => {
    try {
      const response = await apiClient.get('/api/feedback/admin/all', {
        params: { page, limit, ...filters }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update feedback status (Admin only)
  updateFeedbackStatus: async (feedbackId, status) => {
    try {
      const response = await apiClient.put(`/api/feedback/${feedbackId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete feedback
  deleteFeedback: async (feedbackId) => {
    try {
      const response = await apiClient.delete(`/api/feedback/${feedbackId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get feedback statistics
  getFeedbackStats: async (providerId = null) => {
    try {
      const url = providerId ? `/api/feedback/stats/${providerId}` : '/api/feedback/stats';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Export default API client for custom requests
export default apiClient;
