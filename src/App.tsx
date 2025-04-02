
import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ReactNode, Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ExploreRwanda from "./pages/ExploreRwanda";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import BookingSuccess from "./pages/BookingSuccess";
import ExperienceDetails from "./pages/ExperienceDetails";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminPage from "./pages/admin/AdminPage";
import Dashboard from "./pages/admin/Dashboard";
import AdminLayout from "./components/layout/AdminLayout";
import ProviderLayout from "./components/layout/ProviderLayout";
import TouristLayout from "./components/layout/TouristLayout";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderExperiences from "./pages/provider/ProviderExperiences";
import ProviderExperienceForm from "./pages/provider/ProviderExperienceForm";
import ProviderBookings from "./pages/provider/ProviderBookings";
import ProviderBookingDetail from "./pages/provider/ProviderBookingDetail";
import ProviderProfile from "./pages/provider/ProviderProfile";
import TouristProfile from "./pages/tourist/TouristProfile";
import CourseManagement from "./pages/admin/CourseManagement";
import UserManagement from "./pages/admin/UserManagement";
import AdminProfile from "./pages/admin/AdminProfile";
import RequirementsStatus from "./pages/admin/RequirementsStatus";
import ProviderLogin from "./pages/provider/ProviderLogin";
import ProviderRegister from "./pages/provider/ProviderRegister";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import CourseContent from "./pages/CourseContent";
import MyCourses from "./pages/tourist/MyCourses";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function SuspenseWrapper({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
      {children}
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <SuspenseWrapper>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/explore" element={<ExploreRwanda />} />
              <Route path="/experiences/:id" element={<ExperienceDetails />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetails />} />

              {/* Tourist Protected Routes */}
              <Route path="/courses/:courseId/content/:enrollmentId" element={
                <ProtectedRoute>
                  <CourseContent />
                </ProtectedRoute>
              } />
              <Route path="/booking/:id" element={
                <ProtectedRoute>
                  <TouristLayout>
                    <Booking />
                  </TouristLayout>
                </ProtectedRoute>
              } />
              <Route path="/payment/:bookingId" element={
                <ProtectedRoute>
                  <TouristLayout>
                    <Payment />
                  </TouristLayout>
                </ProtectedRoute>
              } />
              <Route path="/booking-success/:bookingId" element={
                <ProtectedRoute>
                  <TouristLayout>
                    <BookingSuccess />
                  </TouristLayout>
                </ProtectedRoute>
              } />
              <Route path="/tourist/profile" element={
                <ProtectedRoute>
                  <TouristLayout>
                    <TouristProfile />
                  </TouristLayout>
                </ProtectedRoute>
              } />
              <Route path="/tourist/my-courses" element={
                <ProtectedRoute>
                  <TouristLayout>
                    <MyCourses />
                  </TouristLayout>
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <AdminPage title="Admin" />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/profile" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <AdminProfile />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <UserManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/courses" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <CourseManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/requirements" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <RequirementsStatus />
                  </AdminLayout>
                </ProtectedRoute>
              } />

              {/* Guide/Provider Routes */}
              <Route path="/guide/login" element={<ProviderLogin />} />
              <Route path="/guide/register" element={<ProviderRegister />} />
              <Route path="/guide/dashboard" element={
                <ProtectedRoute requiredRole="provider">
                  <ProviderLayout>
                    <ProviderDashboard />
                  </ProviderLayout>
                </ProtectedRoute>
              } />
              <Route path="/guide/profile" element={
                <ProtectedRoute requiredRole="provider">
                  <ProviderLayout>
                    <ProviderProfile />
                  </ProviderLayout>
                </ProtectedRoute>
              } />
              <Route path="/guide/experiences" element={
                <ProtectedRoute requiredRole="provider">
                  <ProviderLayout>
                    <ProviderExperiences />
                  </ProviderLayout>
                </ProtectedRoute>
              } />
              <Route path="/guide/experiences/new" element={
                <ProtectedRoute requiredRole="provider">
                  <ProviderLayout>
                    <ProviderExperienceForm />
                  </ProviderLayout>
                </ProtectedRoute>
              } />
              <Route path="/guide/experiences/edit/:id" element={
                <ProtectedRoute requiredRole="provider">
                  <ProviderLayout>
                    <ProviderExperienceForm />
                  </ProviderLayout>
                </ProtectedRoute>
              } />
              <Route path="/guide/bookings" element={
                <ProtectedRoute requiredRole="provider">
                  <ProviderLayout>
                    <ProviderBookings />
                  </ProviderLayout>
                </ProtectedRoute>
              } />
              <Route path="/guide/bookings/:id" element={
                <ProtectedRoute requiredRole="provider">
                  <ProviderLayout>
                    <ProviderBookingDetail />
                  </ProviderLayout>
                </ProtectedRoute>
              } />

              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SuspenseWrapper>
          <Toaster position="top-right" />
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
