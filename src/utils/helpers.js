import { format, formatDistanceToNow } from 'date-fns'

// ─── Date formatting ──────────────────────────────────────────────────────────
export const formatDate = (date) => format(new Date(date), 'MMM d, yyyy')
export const formatDateTime = (date) => format(new Date(date), 'MMM d, yyyy · h:mm a')
export const formatTime = (date) => format(new Date(date), 'h:mm a')
export const timeAgo = (date) => formatDistanceToNow(new Date(date), { addSuffix: true })

// ─── Currency ─────────────────────────────────────────────────────────────────
export const formatCurrency = (amount, currency = 'SAR') =>
  `${currency} ${Number(amount).toFixed(2)}`

// ─── Booking status config ────────────────────────────────────────────────────
export const BOOKING_STATUS = {
  pending_payment:   { label: 'Pending Payment',   badge: 'badge-yellow', dot: 'bg-amber-400' },
  payment_uploaded:  { label: 'Payment Uploaded',  badge: 'badge-premium',   dot: 'bg-brand-500' },
  payment_confirmed: { label: 'Payment Confirmed', badge: 'badge-premium',   dot: 'bg-brand-500' },
  provider_assigned: { label: 'Provider Assigned', badge: 'badge-purple', dot: 'bg-purple-500' },
  in_progress:       { label: 'In Progress',       badge: 'badge-premium',   dot: 'bg-brand-600' },
  completed:         { label: 'Completed',         badge: 'badge-green',  dot: 'bg-emerald-500' },
  cancelled:         { label: 'Cancelled',         badge: 'badge-red',    dot: 'bg-red-400' },
  expired:           { label: 'Expired',           badge: 'badge-gray',   dot: 'bg-slate-400' },
}

export const getStatusConfig = (status) =>
  BOOKING_STATUS[status] || { label: status, badge: 'badge-gray', dot: 'bg-slate-400' }

// ─── Payment status ───────────────────────────────────────────────────────────
export const PAYMENT_STATUS = {
  pending:      { label: 'Pending Review',  badge: 'badge-yellow' },
  under_review: { label: 'Under Review',    badge: 'badge-premium' },
  confirmed:    { label: 'Confirmed',       badge: 'badge-green' },
  rejected:     { label: 'Rejected',        badge: 'badge-red' },
}

// ─── Support ticket status ────────────────────────────────────────────────────
export const TICKET_STATUS = {
  open:             { label: 'Open',             badge: 'badge-red' },
  in_progress:      { label: 'In Progress',      badge: 'badge-premium' },
  waiting_customer: { label: 'Waiting on You',   badge: 'badge-yellow' },
  resolved:         { label: 'Resolved',         badge: 'badge-green' },
  closed:           { label: 'Closed',           badge: 'badge-gray' },
}

// ─── Booking timeline labels ──────────────────────────────────────────────────
export const TIMELINE_LABELS = {
  booking_created:   'Booking Created',
  payment_uploaded:  'Payment Uploaded',
  payment_confirmed: 'Payment Confirmed',
  payment_rejected:  'Payment Rejected',
  provider_assigned: 'Provider Assigned',
  rescheduled:       'Booking Rescheduled',
  in_progress:       'Service Started',
  completed:         'Service Completed',
  cancelled:         'Booking Cancelled',
}

// ─── Misc ─────────────────────────────────────────────────────────────────────
export const truncate = (str, n = 60) =>
  str?.length > n ? str.substring(0, n) + '…' : str

export const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

export const classNames = (...classes) => classes.filter(Boolean).join(' ')

export const SERVICE_CATEGORIES = [
  'Cleaning', 'AC & Appliances', 'Plumbing', 'Electrical',
  'Painting', 'Pest Control', 'Handyman', 'Moving', 'Other'
]
