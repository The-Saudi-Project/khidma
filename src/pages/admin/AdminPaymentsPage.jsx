import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { paymentsAPI } from '../../api'
import { formatDate, formatCurrency } from '../../utils/helpers'
import { CreditCard, ExternalLink } from 'lucide-react'
import { InlineLoader, EmptyState, Pagination, StatusBadge } from '../../components/common/LoadingSpinner'

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'rejected', label: 'Rejected' },
]

export default function AdminPaymentsPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('pending')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-payments', { status, page }],
    queryFn: () => paymentsAPI.getAllPayments({ status: status || undefined, page, limit: 20 }),
    select: d => d.data
  })

  const payments = data?.data?.payments || []
  const meta = data?.meta

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Payments</h1>
        <p className="page-subtitle">Review and confirm payment proof uploads</p>
      </div>

      <div className="flex gap-2 mb-5">
        {STATUS_FILTERS.map(f => (
          <button key={f.value} onClick={() => { setStatus(f.value); setPage(1) }}
            className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all
              ${status === f.value ? 'bg-brand-600 text-white' : 'glass border border-white/10 text-slate-400 hover:border-brand-300'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? <InlineLoader /> : payments.length === 0 ? (
        <EmptyState icon={CreditCard} title="No payments found"
          description={status === 'pending' ? 'No payments awaiting review' : 'No payments in this category'} />
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Uploaded</th>
                <th>Status</th>
                <th>Proof</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p._id}>
                  <td>
                    <button onClick={() => navigate(`/admin/bookings/${p.booking?._id}`)}
                      className="font-mono text-xs text-brand-600 hover:underline">
                      #{p.booking?.bookingNumber}
                    </button>
                    <p className="text-xs text-slate-400 mt-0.5">{p.booking?.serviceName}</p>
                  </td>
                  <td>
                    <p className="font-medium text-white text-sm">{p.customer?.name}</p>
                    <p className="text-xs text-slate-400">{p.customer?.email}</p>
                  </td>
                  <td className="font-bold text-white">{formatCurrency(p.amount)}</td>
                  <td className="text-slate-500 text-sm">{formatDate(p.createdAt)}</td>
                  <td><StatusBadge status={p.status} type="payment" /></td>
                  <td>
                    {p.proofFile?.path && (
                      <a href={p.proofFile.path} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium">
                        <ExternalLink size={12} /> View
                      </a>
                    )}
                  </td>
                  <td>
                    {p.status === 'pending' && (
                      <button onClick={() => navigate(`/admin/bookings/${p.booking?._id}`)}
                        className="btn-primary btn-sm">
                        Review
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination meta={meta} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}
