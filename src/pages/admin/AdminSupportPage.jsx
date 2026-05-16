import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supportAPI } from '../../api'
import { formatDateTime } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { MessageCircle, ChevronDown, ChevronUp, Send, Loader2 } from 'lucide-react'
import { InlineLoader, EmptyState, StatusBadge, Pagination } from '../../components/common/LoadingSpinner'

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'waiting_customer', label: 'Waiting Customer' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
]

export default function AdminSupportPage() {
  const qc = useQueryClient()
  const [status, setStatus] = useState('open')
  const [page, setPage] = useState(1)
  const [openTicket, setOpenTicket] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-tickets', { status, page }],
    queryFn: () => supportAPI.getAllTickets({ status: status || undefined, page, limit: 20 }),
    select: d => d.data
  })

  const tickets = data?.data?.tickets || []
  const meta = data?.meta

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Support Tickets</h1>
        <p className="page-subtitle">Manage customer and provider support requests</p>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
        {STATUS_FILTERS.map(f => (
          <button key={f.value} onClick={() => { setStatus(f.value); setPage(1) }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
              ${status === f.value ? 'bg-brand-600 text-white' : 'glass border border-white/10 text-slate-400 hover:border-brand-300'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? <InlineLoader /> : tickets.length === 0 ? (
        <EmptyState icon={MessageCircle} title="No tickets found"
          description={status === 'open' ? 'All caught up! No open tickets.' : 'No tickets in this category'} />
      ) : (
        <div className="space-y-2">
          {tickets.map(ticket => (
            <TicketRow
              key={ticket._id}
              ticket={ticket}
              isOpen={openTicket === ticket._id}
              onToggle={() => setOpenTicket(openTicket === ticket._id ? null : ticket._id)}
              onUpdated={() => qc.invalidateQueries(['admin-tickets'])}
            />
          ))}
          <div className="mt-4">
            <Pagination meta={meta} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  )
}

function TicketRow({ ticket, isOpen, onToggle, onUpdated }) {
  const qc = useQueryClient()
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const { data: fullTicket } = useQuery({
    queryKey: ['admin-ticket', ticket._id],
    queryFn: () => supportAPI.getTicket(ticket._id),
    enabled: isOpen,
    select: d => d.data.data.ticket
  })

  const handleReply = async () => {
    if (!reply.trim()) return
    setSending(true)
    try {
      await supportAPI.replyToTicket(ticket._id, reply)
      setReply('')
      qc.invalidateQueries(['admin-ticket', ticket._id])
      onUpdated()
      toast.success('Reply sent.')
    } catch { toast.error('Failed to send reply.') }
    finally { setSending(false) }
  }

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true)
    try {
      await supportAPI.updateTicketStatus(ticket._id, newStatus)
      qc.invalidateQueries(['admin-ticket', ticket._id])
      onUpdated()
      toast.success('Status updated.')
    } catch { toast.error('Failed to update status.') }
    finally { setUpdatingStatus(false) }
  }

  return (
    <div className="glass-card overflow-hidden">
      <button onClick={onToggle}
        className="w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-colors text-left">
        <div className="w-8 h-8 bg-white/5 rounded-2xl flex items-center justify-center flex-shrink-0">
          <MessageCircle size={15} className="text-slate-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-white text-sm">{ticket.subject}</p>
            <StatusBadge status={ticket.status} type="ticket" />
            <span className={`badge text-xs ${ticket.submittedByRole === 'provider' ? 'badge-purple' : 'badge-premium'}`}>
              {ticket.submittedByRole}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span>#{ticket.ticketNumber}</span>
            <span>{ticket.submittedBy?.name}</span>
            <span>{formatDateTime(ticket.createdAt)}</span>
          </div>
        </div>
        {isOpen ? <ChevronUp size={15} className="text-slate-400 mt-0.5" /> : <ChevronDown size={15} className="text-slate-400 mt-0.5" />}
      </button>

      {isOpen && (
        <div className="border-t border-white/5 p-4 animate-slide-up">
          {fullTicket ? (
            <>
              {/* Messages */}
              <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
                {fullTicket.messages?.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.senderRole === 'admin' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      msg.senderRole === 'admin' ? 'bg-slate-900 text-white' : 'bg-brand-100 text-brand-700'
                    }`}>
                      {msg.senderRole === 'admin' ? 'A' : msg.sender?.name?.[0] || 'U'}
                    </div>
                    <div className={`max-w-sm px-3 py-2 rounded-2xl text-sm ${
                      msg.senderRole === 'admin' ? 'bg-slate-900 text-white' : 'bg-white/5 text-slate-200'
                    }`}>
                      <p className="text-xs opacity-60 mb-0.5">{msg.sender?.name} · {formatDateTime(msg.createdAt)}</p>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Status controls */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-xs text-slate-500 font-medium">Change status:</span>
                {['in_progress', 'waiting_customer', 'resolved', 'closed'].map(s => (
                  <button key={s} disabled={updatingStatus || ticket.status === s}
                    onClick={() => handleStatusChange(s)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border
                      ${ticket.status === s ? 'bg-brand-600 text-white border-brand-600' : 'glass border-white/10 text-slate-400 hover:border-brand-300'}`}>
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Reply */}
              {!['resolved', 'closed'].includes(ticket.status) && (
                <div className="flex gap-2">
                  <input className="input-glass flex-1" placeholder="Type your reply…"
                    value={reply} onChange={e => setReply(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleReply()} />
                  <button onClick={handleReply} disabled={sending || !reply.trim()} className="btn-primary px-4">
                    {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-6 flex justify-center">
              <Loader2 size={20} className="animate-spin text-slate-400" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
