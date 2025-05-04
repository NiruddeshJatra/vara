import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ProtectedAdminRoute } from "./components/admin/ProtectedAdminRoute";
import PageTransition from "./components/common/PageTransition";
import { ProfileCompletionButton } from "./components/common/ProfileCompletionButton";
import CompleteProfile from '@/pages/CompleteProfile';

// Pages
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Advertisements from "./pages/Advertisements";
import Rentals from "./pages/Rentals";
import CreateListing from "./pages/CreateListing";
import RequestRental from "./pages/RequestRental";
import ItemDetail from "./pages/ItemDetail";
import NotFound from "./pages/NotFound";
import VerifyEmailNotice from "./pages/VerifyEmailNotice";
import EmailVerification from "./pages/EmailVerification";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MyListings from "./pages/MyListings";

import { queryClient } from './lib/react-query';

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AdminAuthProvider>
          <PageTransition>
            <ProfileCompletionButton />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                isAuthenticated ? (
                  <Navigate to="/advertisements" replace />
                ) : (
                  <Index />
                )
              } />
              <Route path="/advertisements" element={
                <Advertisements />
              } />
              <Route path="/items/:productId" element={<ItemDetail />} />
              <Route path="/verify-email" element={<VerifyEmailNotice />} />
              <Route path="/auth/verify-email/:token" element={<EmailVerification />} />

              {/* Authentication Routes */}
              <Route
                path="/auth/login/"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Login />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/auth/registration/"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Register />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/auth/forgot-password/"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <ForgotPassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/auth/reset-password/:uid/:token"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <ResetPassword />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rentals"
                element={
                  <ProtectedRoute>
                    <Rentals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/auth/complete-profile"
                element={
                  <ProtectedRoute>
                    <CompleteProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-listings"
                element={
                  <ProtectedRoute requireCompleteProfile>
                    <MyListings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload-product"
                element={
                  <ProtectedRoute requireCompleteProfile>
                    <CreateListing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/request-rental/:productId"
                element={
                  <ProtectedRoute requireCompleteProfile>
                    <RequestRental />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin/dashboard/*"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </AdminAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
