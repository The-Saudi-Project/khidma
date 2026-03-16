import { Loader2 } from 'lucide-react'
import { getStatusConfig, PAYMENT_STATUS, TICKET_STATUS } from '../../utils/helpers'

// ─── Loading Spinner ──────────────────────────────────────────────────────────
export default function LoadingSpinner({ fullscreen, size = 24 }) {
  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-brand-600" size={32} />
          <p className="text-sm text-slate-500 font-medium">Loading…</p>
        </div>
      </div>
    )
  }
  return <Loader2 className="animate-spin text-brand-600" size={size} />
}

export function InlineLoader() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="animate-spin text-brand-500" size={28} />
    </div>
  )
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status, type = 'booking' }) {
  let config
  if (type === 'booking') config = getStatusConfig(status)
  else if (type === 'payment') config = PAYMENT_STATUS[status] || { label: status, badge: 'badge-gray' }
  else if (type === 'ticket') config = TICKET_STATUS[status] || { label: status, badge: 'badge-gray' }
  else config = { label: status, badge: 'badge-gray' }

  return <span className={config.badge}>{config.label}</span>
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && (
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <Icon size={28} className="text-slate-400" />
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      {description && <p className="text-sm text-slate-400 mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export function Pagination({ meta, onPageChange }) {
  if (!meta || meta.pages <= 1) return null
  const { page, pages } = meta

  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
      <p className="text-sm text-slate-500">
        Page {page} of {pages} · {meta.total} total
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!meta.hasPrev}
          className="btn-secondary btn-sm"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!meta.hasNext}
          className="btn-secondary btn-sm"
        >
          Next
        </button>
      </div>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, color = 'blue', trend }) {
  const colors = {
    blue:   { bg: 'bg-brand-50',   icon: 'text-brand-600',   ring: 'ring-brand-100' },
    green:  { bg: 'bg-emerald-50', icon: 'text-emerald-600', ring: 'ring-emerald-100' },
    yellow: { bg: 'bg-amber-50',   icon: 'text-amber-600',   ring: 'ring-amber-100' },
    red:    { bg: 'bg-red-50',     icon: 'text-red-500',     ring: 'ring-red-100' },
    purple: { bg: 'bg-purple-50',  icon: 'text-purple-600',  ring: 'ring-purple-100' },
  }
  const c = colors[color] || colors.blue

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <p className="stat-label">{label}</p>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bg} ring-1 ${c.ring}`}>
            <Icon size={18} className={c.icon} />
          </div>
        )}
      </div>
      <p className="stat-value">{value}</p>
      {trend && <p className="text-xs text-slate-400 mt-1">{trend}</p>}
    </div>
  )
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
export function ConfirmModal({ open, title, message, onConfirm, onCancel, loading, danger }) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box p-6 max-w-sm" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500 mt-2">{message}</p>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 btn ${danger ? 'btn-danger' : 'btn-primary'} justify-center`}
          >
            {loading ? <LoadingSpinner size={16} /> : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
export function Avatar({ name = '', size = 'md' }) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' }
  return (
    <div className={`${sizes[size]} rounded-full bg-brand-600 text-white flex items-center justify-center font-semibold flex-shrink-0`}>
      {initials}
    </div>
  )
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
export function StarRating({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill={i <= rating ? '#f59e0b' : 'none'}
          stroke={i <= rating ? '#f59e0b' : '#cbd5e1'} strokeWidth="1.5">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}
