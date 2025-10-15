# Frontend-Backend Integration Guide

This guide explains how the frontend is integrated with the Firebase backend API.

## 🔧 **API Service Configuration**

### **Base URL Configuration**
The API base URL is configured in `src/services/apiService.js`:

```javascript
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

**To change the backend URL:**
1. Update the `.env` file in the frontend root:
   ```env
   REACT_APP_API_URL=http://your-backend-url:port
   ```
2. Or modify the `BASE_URL` directly in `apiService.js`

### **Environment Variables**
Create a `.env` file in the frontend root:
```env
REACT_APP_API_URL=http://localhost:5000
```

## 🚀 **API Integration Features**

### **Authentication API**
- ✅ **User Signup** - `authAPI.signUp(userData)`
- ✅ **Provider Signup** - `authAPI.signUpProvider(providerData)`
- ✅ **User Login** - `authAPI.signIn(email, password)`
- ✅ **Google Sign-in** - `authAPI.signInWithGoogle()`
- ✅ **Password Reset** - `authAPI.resetPassword(email)`
- ✅ **Profile Update** - `authAPI.updateProfile(profileData)`

### **User Management API**
- ✅ **Get Users** - `userAPI.getUsers()`
- ✅ **Search Users** - `userAPI.searchUsers(query)`
- ✅ **Get Providers** - `userAPI.getProviders()`
- ✅ **Rate Provider** - `userAPI.rateProvider(providerId, rating)`

### **Utility Functions**
- ✅ **Token Management** - `apiUtils.setAuthToken()`, `apiUtils.getAuthToken()`
- ✅ **User Data** - `apiUtils.setUser()`, `apiUtils.getUser()`
- ✅ **Authentication Check** - `apiUtils.isAuthenticated()`
- ✅ **Role Checking** - `apiUtils.isAdmin()`, `apiUtils.isProvider()`, `apiUtils.isClient()`

## 📱 **Updated Pages**

### **1. Login Page (`/login`)**
- ✅ Integrated with backend authentication
- ✅ Loading states and error handling
- ✅ Google sign-in support
- ✅ Password reset functionality
- ✅ Automatic redirect based on user type

### **2. Signup Page (`/signup`)**
- ✅ Client registration with backend
- ✅ Form validation
- ✅ Loading states
- ✅ Link to provider signup

### **3. Provider Signup Page (`/provider-signup`)**
- ✅ Complete provider registration form
- ✅ Business information collection
- ✅ Address information
- ✅ Service selection
- ✅ Backend integration

### **4. Pricing Plans Page (`/pricing-plans`)**
- ✅ Accessible after signup
- ✅ Grid layout with 3 columns
- ✅ Hero section with custom image

## 🔐 **Authentication Flow**

### **Login Process:**
1. User enters credentials
2. Frontend calls `authAPI.signIn(email, password)`
3. Backend validates with Firebase Auth
4. Returns user data and token
5. Frontend stores token and user data
6. Redirects to appropriate dashboard

### **Signup Process:**
1. User fills registration form
2. Frontend calls `authAPI.signUp(userData)` or `authAPI.signUpProvider(providerData)`
3. Backend creates Firebase user and Firestore document
4. Returns success message
5. Redirects to pricing plans

### **Token Management:**
- Tokens stored in localStorage
- Automatic token attachment to API requests
- Token expiration handling
- Automatic logout on token expiry

## 🛡️ **Security Features**

### **Request Interceptors:**
- Automatic token attachment
- Error handling for 401 responses
- Automatic logout on authentication failure

### **Response Interceptors:**
- Centralized error handling
- Token refresh logic (if needed)
- Network error handling

## 📊 **Error Handling**

### **API Errors:**
```javascript
try {
  const response = await authAPI.signIn(email, password);
  // Handle success
} catch (error) {
  // Error is automatically formatted by the API service
  setError(error.message || "Login failed. Please try again.");
}
```

### **Network Errors:**
- Automatic retry logic
- User-friendly error messages
- Loading states during requests

## 🔄 **State Management**

### **User State:**
- Stored in localStorage
- Available via `apiUtils.getUser()`
- Automatically updated on login/signup

### **Authentication State:**
- Checked via `apiUtils.isAuthenticated()`
- Used for route protection
- Automatically managed

## 🚀 **Getting Started**

### **1. Start Backend:**
```bash
cd backend
npm run dev
```

### **2. Start Frontend:**
```bash
cd frontend
npm start
```

### **3. Test Integration:**
1. Navigate to `/signup`
2. Create a new account
3. Check backend logs for API calls
4. Verify user creation in Firebase

## 📝 **API Endpoints Used**

### **Authentication:**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signup/provider` - Provider registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google sign-in
- `POST /api/auth/reset-password` - Password reset
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### **User Management:**
- `GET /api/users/providers` - Get providers
- `GET /api/users/search` - Search users
- `POST /api/users/:id/rating` - Rate provider

## 🔧 **Customization**

### **Adding New API Calls:**
1. Add method to `authAPI` or `userAPI` in `apiService.js`
2. Use in your components
3. Handle loading and error states

### **Modifying Base URL:**
1. Update `.env` file
2. Restart frontend development server

### **Adding New User Types:**
1. Update user type validation in backend
2. Add role checking functions in `apiUtils`
3. Update routing logic in components

## 🐛 **Troubleshooting**

### **Common Issues:**

1. **CORS Errors:**
   - Ensure backend CORS is configured for frontend URL
   - Check `CORS_ORIGIN` in backend `.env`

2. **API Connection Failed:**
   - Verify backend is running on correct port
   - Check `REACT_APP_API_URL` in frontend `.env`

3. **Authentication Issues:**
   - Check Firebase configuration
   - Verify service account key
   - Check backend logs for errors

4. **Token Issues:**
   - Clear localStorage and try again
   - Check token format in network requests

## 📚 **Next Steps**

1. **Add Route Protection:**
   - Create protected route components
   - Implement role-based access control

2. **Add Real-time Features:**
   - WebSocket integration
   - Real-time notifications

3. **Add File Upload:**
   - Profile image upload
   - Document upload for providers

4. **Add Advanced Features:**
   - Email verification
   - Two-factor authentication
   - Social login providers

## 🎯 **Testing**

### **Manual Testing:**
1. Test all signup flows
2. Test login with different user types
3. Test error scenarios
4. Test token expiration

### **API Testing:**
Use tools like Postman to test backend endpoints directly:
- Import the API collection
- Test with different payloads
- Verify response formats

Your frontend is now fully integrated with the Firebase backend! 🎉
