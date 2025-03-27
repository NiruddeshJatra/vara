import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ProtectedAdminRoute } from "./components/admin/ProtectedAdminRoute";
import PageTransition from "./components/common/PageTransition";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Advertisements from "./pages/Advertisements";
import Rentals from "./pages/Rentals";
import CreateListingPage from "./pages/CreateListing";
import MyListings from "./pages/MyListings";
import RequestRentalPage from "./pages/RequestRental";
import ItemDetail from "./pages/ItemDetail";
import NotFound from "./pages/NotFound";
import VerifyEmailNotice from "./pages/VerifyEmailNotice";
import EmailVerification from "./pages/EmailVerification";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AdminAuthProvider>
            <PageTransition>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/advertisements" element={<Advertisements />} />
                <Route path="/items/:productId" element={<ItemDetail />} />
                <Route path="*" element={<NotFound />} />
                
                {/* Authentication Routes (only for non-authenticated users) */}
                <Route 
                  path="/login" 
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <Login />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <Register />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/verify-email" element={<VerifyEmailNotice />} />
                <Route path="/account-confirm-email/:key" element={<EmailVerification />} />
                
                {/* Protected Routes (require authentication) */}
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
                  path="/create-listing" 
                  element={
                    <ProtectedRoute>
                      <CreateListingPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/my-listings" 
                  element={
                    <ProtectedRoute>
                      <MyListings />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/request-rental/:productId" 
                  element={
                    <ProtectedRoute>
                      <RequestRentalPage />
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
              </Routes>
            </PageTransition>
          </AdminAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
