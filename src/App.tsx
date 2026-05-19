import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
const Index = lazy(() => import("./pages/Index"));
const HajjPackages = lazy(() => import("./pages/HajjPackages"));
const UmrahPackages = lazy(() => import("./pages/UmrahPackages"));
const VisaAssistance = lazy(() => import("./pages/VisaAssistance"));
const HajjTraining = lazy(() => import("./pages/HajjTraining"));
const FAQs = lazy(() => import("./pages/FAQs"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const TrackApplication = lazy(() => import("./pages/TrackApplication"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SignIn = lazy(() => import("./pages/auth/SignIn"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const ForcedPasswordChange = lazy(() => import("./pages/portal/ForcedPasswordChange"));
const DocumentUploadPortal = lazy(() => import("./pages/portal/DocumentUploadPortal"));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview"));
const AdminPackages = lazy(() => import("./pages/admin/AdminPackages"));
const AdminHotels = lazy(() => import("./pages/admin/AdminHotels"));
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminDocumentReview = lazy(() => import("./pages/admin/AdminDocumentReview"));
const AdminTraining = lazy(() => import("./pages/admin/AdminTraining"));
const RitualGuidance = lazy(() => import("./pages/RitualGuidance"));
const AdminRitualGuidance = lazy(() => import("./pages/admin/AdminRitualGuidance"));
const UserOverview = lazy(() => import("./pages/user/UserOverview"));
const UserBookings = lazy(() => import("./pages/user/UserBookings"));
const UserTestimonials = lazy(() => import("./pages/user/UserTestimonials"));
const UserApply = lazy(() => import("./pages/user/UserApply"));
const UserProfileSettings = lazy(() => import("./pages/user/UserProfileSettings"));
const UserChat = lazy(() => import("./pages/user/UserChat"));
const AdminChat = lazy(() => import("./pages/admin/AdminChat"));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">Loading…</div>
            </div>
          }
        >
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/hajj-packages" element={<HajjPackages />} />
          <Route path="/umrah-packages" element={<UmrahPackages />} />
          <Route path="/visa-assistance" element={<VisaAssistance />} />
          <Route path="/hajj-training" element={<HajjTraining />} />
          <Route path="/ritual-guidance" element={<RitualGuidance />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/track-application" element={<TrackApplication />} />

          {/* Auth Routes */}
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route path="/auth/sign-up" element={<SignUp />} />

          {/* Portal Routes (Public - for applicants) */}
          <Route path="/portal/password-change" element={<ForcedPasswordChange />} />
          <Route path="/portal/upload-documents" element={<DocumentUploadPortal />} />

          {/* User Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/bookings"
            element={
              <ProtectedRoute>
                <UserBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/apply"
            element={
              <ProtectedRoute>
                <UserApply />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submit-testimonial"
            element={
              <ProtectedRoute>
                <UserTestimonials />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/testimonials"
            element={
              <ProtectedRoute>
                <UserTestimonials />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute>
                <UserProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/chat"
            element={
              <ProtectedRoute>
                <UserChat />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin", "support", "visa_officer"]}>
                <AdminOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/packages"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPackages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hotels"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminHotels />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute allowedRoles={["admin", "support"]}>
                <AdminBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/testimonials"
            element={
              <ProtectedRoute allowedRoles={["admin", "support"]}>
                <AdminTestimonials />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/documents"
            element={
              <ProtectedRoute allowedRoles={["admin", "visa_officer"]}>
                <AdminDocumentReview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/training"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminTraining />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/ritual-guidance"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminRitualGuidance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/chat"
            element={
              <ProtectedRoute allowedRoles={["admin", "support"]}>
                <AdminChat />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
