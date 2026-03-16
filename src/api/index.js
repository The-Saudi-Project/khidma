import api from './client'

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  changePassword: (data) => api.put('/auth/change-password', data),
}

// ─── Users ────────────────────────────────────────────────────────────────────
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  deleteAccount: () => api.delete('/users/account'),
  addAddress: (data) => api.post('/users/addresses', data),
  updateAddress: (id, data) => api.put(`/users/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
  updateAvailability: (isAvailable) => api.patch('/users/providers/availability', { isAvailable }),
  // Admin
  getAllUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  getProviders: (params) => api.get('/users/providers', { params }),
  createProvider: (data) => api.post('/users/providers', data),
  toggleUserStatus: (id) => api.patch(`/users/${id}/toggle-status`),
}

// ─── Services ─────────────────────────────────────────────────────────────────
export const servicesAPI = {
  getServices: (params) => api.get('/services', { params }),
  getService: (id) => api.get(`/services/${id}`),
  getServicesAdmin: (params) => api.get('/services/admin/all', { params }),
  createService: (data) => api.post('/services', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateService: (id, data) => api.put(`/services/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteService: (id) => api.delete(`/services/${id}`),
}

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const bookingsAPI = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: (params) => api.get('/bookings/my', { params }),
  getBooking: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id, reason) => api.patch(`/bookings/${id}/cancel`, { reason }),
  rescheduleBooking: (id, data) => api.patch(`/bookings/${id}/reschedule`, data),
  // Provider
  getProviderJobs: (params) => api.get('/bookings/provider/jobs', { params }),
  startJob: (id) => api.patch(`/bookings/${id}/start`),
  completeJob: (id) => api.patch(`/bookings/${id}/complete`),
  // Admin
  getAllBookings: (params) => api.get('/bookings', { params }),
  assignProvider: (id, providerId) => api.patch(`/bookings/${id}/assign-provider`, { providerId }),
  getAdminMetrics: () => api.get('/bookings/admin/metrics'),
}

// ─── Payments ─────────────────────────────────────────────────────────────────
export const paymentsAPI = {
  uploadProof: (bookingId, formData) =>
    api.post(`/payments/bookings/${bookingId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getPayment: (id) => api.get(`/payments/${id}`),
  getAllPayments: (params) => api.get('/payments', { params }),
  confirmPayment: (id) => api.patch(`/payments/${id}/confirm`),
  rejectPayment: (id, reason) => api.patch(`/payments/${id}/reject`, { reason }),
}

// ─── Payouts ──────────────────────────────────────────────────────────────────
export const payoutsAPI = {
  getProviderEarnings: () => api.get('/payouts/provider/earnings'),
  getProviderPayoutHistory: (params) => api.get('/payouts/provider/history', { params }),
  getProviderBalances: () => api.get('/payouts/admin/balances'),
  getAllPayouts: (params) => api.get('/payouts', { params }),
  processPayout: (data) => api.post('/payouts', data),
}

// ─── Notifications ────────────────────────────────────────────────────────────
export const notificationsAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
}

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const reviewsAPI = {
  createReview: (data) => api.post('/reviews', data),
  getProviderReviews: (providerId, params) => api.get(`/reviews/provider/${providerId}`, { params }),
  getAllReviews: (params) => api.get('/reviews', { params }),
}

// ─── Support ──────────────────────────────────────────────────────────────────
export const supportAPI = {
  createTicket: (data) => api.post('/support', data),
  getMyTickets: (params) => api.get('/support/my', { params }),
  getTicket: (id) => api.get(`/support/${id}`),
  replyToTicket: (id, message) => api.post(`/support/${id}/reply`, { message }),
  getAllTickets: (params) => api.get('/support', { params }),
  updateTicketStatus: (id, status) => api.patch(`/support/${id}/status`, { status }),
}

// ─── Audit ────────────────────────────────────────────────────────────────────
export const auditAPI = {
  getLogs: (params) => api.get('/audit', { params }),
}
