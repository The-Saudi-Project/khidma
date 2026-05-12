import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoadingSpinner from './components/common/LoadingSpinner'
import ErrorBoundary from './components/common/ErrorBoundary'

import CustomerLayout from './components/common/CustomerLayout'
import ProviderLayout from './components/common/ProviderLayout'
import AdminLayout from './components/common/AdminLayout'

const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const SignupPage = lazy(() => import('./pages/auth/SignupPage'))
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'))
const ChangePasswordPage = lazy(() => import('./pages/auth/ChangePasswordPage'))

const ServicesPage = lazy(() => import('./pages/customer/ServicesPage'))
const ServiceDetailPage = lazy(() => import('./pages/customer/ServiceDetailPage'))
const BookingPage = lazy(() => import('./pages/customer/BookingPage'))
const MyBookingsPage = lazy(() => import('./pages/customer/MyBookingsPage'))
const BookingDetailPage = lazy(() => import('./pages/customer/BookingDetailPage'))
const ProfilePage = lazy(() => import('./pages/customer/ProfilePage'))
const SupportPage = lazy(() => import('./pages/customer/SupportPage'))

const ProviderDashboard = lazy(() => import('./pages/provider/ProviderDashboard'))
const ProviderJobsPage = lazy(() => import('./pages/provider/ProviderJobsPage'))
const ProviderJobDetailPage = lazy(() => import('./pages/provider/ProviderJobDetailPage'))
const ProviderEarningsPage = lazy(() => import('./pages/provider/ProviderEarningsPage'))
const ProviderProfilePage = lazy(() => import('./pages/provider/ProviderProfilePage'))

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminBookingsPage = lazy(() => import('./pages/admin/AdminBookingsPage'))
const AdminBookingDetailPage = lazy(() => import('./pages/admin/AdminBookingDetailPage'))
const AdminServicesPage = lazy(() => import('./pages/admin/AdminServicesPage'))
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'))
const AdminPaymentsPage = lazy(() => import('./pages/admin/AdminPaymentsPage'))
const AdminPayoutsPage = lazy(() => import('./pages/admin/AdminPayoutsPage'))
const AdminSupportPage = lazy(() => import('./pages/admin/AdminSupportPage'))
const AdminAuditPage = lazy(() => import('./pages/admin/AdminAuditPage'))
const AdminProviderApplicationsPage = lazy(() => import('./pages/admin/AdminProviderApplicationsPage'))

const LandingPage = lazy(() => import('./pages/LandingPage'))

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <LoadingSpinner fullscreen />
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  if (user.mustChangePassword && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />
  }
  if (roles && roles.length && !roles.includes(user.role)) {
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

function HomeRoute() {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner fullscreen />
  if (user) return <Navigate to={getDefaultRoute(user.role)} replace />
  return (
    <Suspense fallback={<LoadingSpinner fullscreen />}>
      <LandingPage />
    </Suspense>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner fullscreen />}>
          <Routes>
            <Route path="/" element={<HomeRoute />} />

            <Route path="/login" element={<PublicRoute><ErrorBoundary><LoginPage /></ErrorBoundary></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><ErrorBoundary><SignupPage /></ErrorBoundary></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ErrorBoundary><ForgotPasswordPage /></ErrorBoundary></PublicRoute>} />

            <Route path="/change-password" element={(
              <ErrorBoundary>
                <ProtectedRoute>
                  <ChangePasswordPage />
                </ProtectedRoute>
              </ErrorBoundary>
            )} />

            <Route element={(
              <ErrorBoundary>
                <ProtectedRoute roles={['customer']}>
                  <CustomerLayout />
                </ProtectedRoute>
              </ErrorBoundary>
            )}
            >
              <Route path="services" element={<ServicesPage />} />
              <Route path="services/:id" element={<ServiceDetailPage />} />
              <Route path="book/:serviceId" element={<BookingPage />} />
              <Route path="bookings" element={<MyBookingsPage />} />
              <Route path="bookings/:id" element={<BookingDetailPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="support" element={<SupportPage />} />
            </Route>

            <Route path="/provider" element={(
              <ErrorBoundary>
                <ProtectedRoute roles={['provider']}>
                  <ProviderLayout />
                </ProtectedRoute>
              </ErrorBoundary>
            )}
            >
              <Route index element={<ProviderDashboard />} />
              <Route path="jobs" element={<ProviderJobsPage />} />
              <Route path="jobs/:id" element={<ProviderJobDetailPage />} />
              <Route path="earnings" element={<ProviderEarningsPage />} />
              <Route path="profile" element={<ProviderProfilePage />} />
            </Route>

            <Route path="/admin" element={(
              <ErrorBoundary>
                <ProtectedRoute roles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              </ErrorBoundary>
            )}
            >
              <Route index element={<AdminDashboard />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
              <Route path="bookings/:id" element={<AdminBookingDetailPage />} />
              <Route path="services" element={<AdminServicesPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route path="payouts" element={<AdminPayoutsPage />} />
              <Route path="support" element={<AdminSupportPage />} />
              <Route path="audit" element={<AdminAuditPage />} />
              <Route path="provider-applications" element={<AdminProviderApplicationsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
