import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AdminAuthProvider>
        <BrowserRouter>
          <PageTransition>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/advertisements" element={<Advertisements />} />
              <Route path="/rentals" element={<Rentals />} />
              <Route path="/create-listing" element={<CreateListingPage />} />
              <Route path="/my-listings" element={<MyListings />} />
              <Route path="/items/:productId" element={<ItemDetail />} />
              <Route path="/request-rental/:productId" element={<RequestRentalPage />} />
              <Route path="/verify-email" element={<VerifyEmailNotice />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route 
                path="/admin/dashboard/*" 
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </BrowserRouter>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
