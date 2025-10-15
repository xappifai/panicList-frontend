// App.jsx
import { Routes, Route } from "react-router-dom";

// public site
import Layout from "./components/Layout";
import Home from "./pages/LandingPage";
import About from "./pages/AboutContact";
import Help from "./pages/HelpAndFAQ";
import Privacy from "./pages/PrivacyPolicyPage";
import Contact from "./pages/Contact";
import ServicesRendered from "./pages/ServicesRendered";


// client dashboard
import ClientDashboardLayout from "./components/Layouts/ClientDashboardLayout";
import ClientDashboard from "./pages/ClientDashboard";
import Order from "./components/ClientDashboard/Order";
import Provider from "./components/ClientDashboard/Provider";
import ClientProviderProfile from "./components/ClientDashboard/Provider[id]";
import BookingConfirmation from "./components/ClientDashboard/BookingConfirmation";
import BookingConfirmed from "./components/ClientDashboard/BookingConfirmed";
import TaskDetails from "./components/ClientDashboard/TaskDetails";
import Reviews from "./components/ClientDashboard/Reviews";
import BillingPayment from "./components/ClientDashboard/BillingPayment";
import Settings from "./components/ClientDashboard/Settings";
import ServiceTracking from "./components/ClientDashboard/ServiceTracking";

// provider dashboard
import ProviderDashboardLayout from "./components/Layouts/ProviderDashboardLayout";
import ProviderDashboard from "./pages/ProviderDashboard";
import ProviderListingManagement from "./components/ProviderDashboard/ListingManagement";
import AddNewListing from "./components/ProviderDashboard/AddNewListing";
import ClientsManagement from "./components/ProviderDashboard/ClientsManagement";
import ProviderReviews from "./components/ProviderDashboard/ProviderReviews";
import ProviderAnalytics from "./components/ProviderDashboard/ProviderAnalytics";
import ProviderPayment from "./components/ProviderDashboard/ProviderPayment";
import ProviderProfile from "./components/ProviderDashboard/ProviderProfile";
import WithdrawalRequests from "./components/ProviderDashboard/WithdrawalRequests";
import ReviewsPage from "./pages/Review";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Signup from "./pages/Signup";
import PricingPlans from "./pages/PricingPlans";
import PaymentSuccess from "./pages/PaymentSuccess";

// admin dashboard
import AdminDashboardLayout from "./components/Layouts/AdminDashboardLayout";
import AdminDashboard from "./pages/AdminDashboard";
import ProviderManagement from "./pages/ProviderManagement";
import ProviderDetail from "./components/AdminDashboard/pages/ProviderDetail[id]";
import AddProvider from "./components/AdminDashboard/pages/AddProvider";
import AdminClientManagement from "./components/AdminDashboard/pages/AdminClientManagement";
import AdminBasicAnalytics from "./components/AdminDashboard/pages/AdminBasicAnalytics";
import ListingManagement from "./components/AdminDashboard/pages/ListingManagement";
import OrderManagement from "./components/AdminDashboard/pages/OrderManagement";
import OrderDetail from "./components/AdminDashboard/pages/OrderDetail[id]";
import SubscriptionPayment from "./components/AdminDashboard/pages/SubscriptionPayment";
import Support from "./components/AdminDashboard/pages/Support";
import AdminSettings from "./components/AdminDashboard/pages/Settings";

function App() {
  return (
    <Routes>
      {/* Public-facing pages */}
      <Route element={<Layout />}>
        <Route path="/" index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="help" element={<Help />} />
        <Route path="privacy-policy" element={<Privacy />} />
        <Route path="login" element={<Login />} />
        <Route path="admin-login" element={<AdminLogin />} />
        <Route path="signup" element={<Signup />} />
        <Route path="pricing-plans" element={<PricingPlans />} />
        <Route path="payment-success" element={<PaymentSuccess />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/ServicesRendered" element={<ServicesRendered />} />
        
      </Route>

      {/* Client dashboard */}
      <Route path="client-dashboard" element={<ClientDashboardLayout />}>
        <Route index element={<ClientDashboard />} />
        <Route path="orders" element={<Order />} />
        <Route path="recommendations" element={<Provider />} />
        <Route path="recommendations/:id" element={<ClientProviderProfile />} />
        <Route path="booking" element={<BookingConfirmation />} />
        <Route path="booking-confirmed" element={<BookingConfirmed />} />
        <Route path="task-details" element={<TaskDetails />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="billing-payment" element={<BillingPayment />} />
        <Route path="settings" element={<Settings />} />
        <Route path="service-tracking/:id" element={<ServiceTracking />} />
        {/* add more nested client routes here if needed */}
      </Route>

      {/* Provider dashboard */}
      <Route path="provider-dashboard" element={<ProviderDashboardLayout />}>
        <Route index element={<ProviderDashboard />} />
        <Route path="listing-management" element={<ProviderListingManagement />} />
        <Route path="add-listing" element={<AddNewListing />} />
        <Route path="clients" element={<ClientsManagement />} />
        <Route path="reviews" element={<ProviderReviews />} />
        <Route path="analytics" element={<ProviderAnalytics />} />
        <Route path="payment" element={<ProviderPayment />} />
        <Route path="withdrawal" element={<WithdrawalRequests />} />
        <Route path="settings" element={<ProviderProfile />} />
        {/* add more nested provider routes here if needed */}
      </Route>

      {/* Admin dashboard */}
      <Route path="admin-dashboard" element={<AdminDashboardLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="providers" element={<ProviderManagement />} />
        <Route path="providers/:id" element={<ProviderDetail />} />
        <Route path="providers/add" element={<AddProvider />} />
        <Route path="clients" element={<AdminClientManagement />} />
        <Route path="analytics" element={<AdminBasicAnalytics />} />
        <Route path="listings" element={<ListingManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="subscriptions" element={<SubscriptionPayment />} />
        <Route path="support" element={<Support />} />
        <Route path="settings" element={<AdminSettings />} />
        {/* add more nested admin routes here if needed */}
      </Route>

      {/* Optional: catch-all for 404s */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default App;
