import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HajjPackages from "./pages/HajjPackages";
import UmrahPackages from "./pages/UmrahPackages";
import VisaAssistance from "./pages/VisaAssistance";
import NotFound from "./pages/NotFound";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminPackages from "./pages/admin/AdminPackages";
import AdminHotels from "./pages/admin/AdminHotels";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import UserOverview from "./pages/user/UserOverview";
import UserBookings from "./pages/user/UserBookings";
import UserTestimonials from "./pages/user/UserTestimonials";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/hajj-packages" element={<HajjPackages />} />
          <Route path="/umrah-packages" element={<UmrahPackages />} />
          <Route path="/visa-assistance" element={<VisaAssistance />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/packages" element={<AdminPackages />} />
          <Route path="/admin/hotels" element={<AdminHotels />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/testimonials" element={<AdminTestimonials />} />

          {/* User Routes */}
          <Route path="/dashboard" element={<UserOverview />} />
          <Route path="/dashboard/bookings" element={<UserBookings />} />
          <Route path="/dashboard/testimonials" element={<UserTestimonials />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
