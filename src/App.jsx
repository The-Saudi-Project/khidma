import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Layouts
import CustomerLayout from './components/common/CustomerLayout'
import ProviderLayout from './components/common/ProviderLayout'
import AdminLayout from './components/common/AdminLayout'

// Auth pages
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'

// Customer pages
import ServicesPage from './pages/customer/ServicesPage'
import ServiceDetailPage from './pages/customer/ServiceDetailPage'
import BookingPage from './pages/customer/BookingPage'
import MyBookingsPage from './pages/customer/MyBookingsPage'
import BookingDetailPage from './pages/customer/BookingDetailPage'
import ProfilePage from './pages/customer/ProfilePage'
import SupportPage from './pages/customer/SupportPage'

// Provider pages
import ProviderDashboard from './pages/provider/ProviderDashboard'
import ProviderJobsPage from './pages/provider/ProviderJobsPage'
import ProviderJobDetailPage from './pages/provider/ProviderJobDetailPage'
import ProviderEarningsPage from './pages/provider/ProviderEarningsPage'
import ProviderProfilePage from './pages/provider/ProviderProfilePage'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminBookingsPage from './pages/admin/AdminBookingsPage'
import AdminBookingDetailPage from './pages/admin/AdminBookingDetailPage'
import AdminServicesPage from './pages/admin/AdminServicesPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage'
import AdminPayoutsPage from './pages/admin/AdminPayoutsPage'
import AdminSupportPage from './pages/admin/AdminSupportPage'
import AdminAuditPage from './pages/admin/AdminAuditPage'

import LoadingSpinner from './components/common/LoadingSpinner'

// ─── Route guards ─────────────────────────────────────────────────────────────
function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner fullscreen />
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={getDefaultRoute(user.role)} replace />
  }
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner fullscreen />
  if (user) return <Navigate to={getDefaultRoute(user.role)} replace />
  return children
}

function getDefaultRoute(role) {
  if (role === 'admin') return '/admin'
  if (role === 'provider') return '/provider'
  return '/services'
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Public auth routes */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

          {/* Customer routes */}
          <Route path="/" element={<ProtectedRoute roles={['customer']}><CustomerLayout /></ProtectedRoute>}>
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/:id" element={<ServiceDetailPage />} />
            <Route path="book/:serviceId" element={<BookingPage />} />
            <Route path="bookings" element={<MyBookingsPage />} />
            <Route path="bookings/:id" element={<BookingDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="support" element={<SupportPage />} />
          </Route>

          {/* Provider routes */}
          <Route path="/provider" element={<ProtectedRoute roles={['provider']}><ProviderLayout /></ProtectedRoute>}>
            <Route index element={<ProviderDashboard />} />
            <Route path="jobs" element={<ProviderJobsPage />} />
            <Route path="jobs/:id" element={<ProviderJobDetailPage />} />
            <Route path="earnings" element={<ProviderEarningsPage />} />
            <Route path="profile" element={<ProviderProfilePage />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="bookings/:id" element={<AdminBookingDetailPage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="payouts" element={<AdminPayoutsPage />} />
            <Route path="support" element={<AdminSupportPage />} />
            <Route path="audit" element={<AdminAuditPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

function RootRedirect() {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner fullscreen />
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={getDefaultRoute(user.role)} replace />
}
