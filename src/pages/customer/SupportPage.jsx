import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supportAPI } from '../../api'
import { formatDateTime } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { MessageCircle, Plus, Send, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { InlineLoader, EmptyState, StatusBadge } from '../../components/common/LoadingSpinner'

export default function SupportPage() {
  const qc = useQueryClient()
  const [showNewForm, setShowNewForm] = useState(false)
  const [openTicket, setOpenTicket] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['my-tickets'],
    queryFn: () => supportAPI.getMyTickets(),
    select: d => d.data.data.tickets
  })

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Support</h1>
          <p className="page-subtitle">Get help with your bookings or account</p>
        </div>
        <button onClick={() => setShowNewForm(true)} className="btn-primary btn-sm">
          <Plus size={14} /> New ticket
        </button>
      </div>

      {showNewForm && (
        <NewTicketForm onClose={() => setShowNewForm(false)} onCreated={() => { qc.invalidateQueries(['my-tickets']); setShowNewForm(false) }} />
      )}

      {isLoading ? <InlineLoader /> : (data?.length === 0) ? (
        <EmptyState icon={MessageCircle} title="No support tickets"
          description="Have a question? Open a ticket and we'll help."
          action={<button onClick={() => setShowNewForm(true)} className="btn-primary">Open a ticket</button>} />
      ) : (
        <div className="space-y-3">
          {data.map(ticket => (
            <TicketCard key={ticket._id} ticket={ticket}
              isOpen={openTicket === ticket._id}
              onToggle={() => setOpenTicket(openTicket === ticket._id ? null : ticket._id)}
              onReply={() => qc.invalidateQueries(['my-tickets'])} />
          ))}
        </div>
      )}
    </div>
  )
}

function NewTicketForm({ onClose, onCreated }) {
  const [form, setForm] = useState({ subject: '', category: 'other', message: '' })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (!form.subject || !form.message) return toast.error('Subject and message are required')
    setSaving(true)
    try {
      await supportAPI.createTicket(form)
      toast.success('Ticket submitted! We\'ll respond shortly.')
      onCreated()
    } catch { toast.error('Failed to create ticket.') }
    finally { setSaving(false) }
  }

  return (
    <div className="glass-card p-5 mb-4 animate-slide-up">
      <h3 className="font-semibold text-white mb-4">New Support Ticket</h3>
      <div className="space-y-3">
        <div>
          <label className="label">Subject *</label>
          <input className="input" placeholder="Briefly describe your issue"
            value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
        </div>
        <div>
          <label className="label">Category</label>
          <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            {[
              ['booking_issue', 'Booking Issue'],
              ['payment_issue', 'Payment Issue'],
              ['provider_issue', 'Provider Issue'],
              ['account_issue', 'Account Issue'],
              ['other', 'Other'],
            ].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Message *</label>
          <textarea className="input-glass resize-none" rows={4}
            placeholder="Describe your issue in detail…"
            value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="btn-primary flex-1 justify-center">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <><Send size={14} /> Submit</>}
          </button>
        </div>
      </div>
    </div>
  )
}

function TicketCard({ ticket, isOpen, onToggle, onReply }) {
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const qc = useQueryClient()

  const { data: fullTicket } = useQuery({
    queryKey: ['ticket', ticket._id],
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
      qc.invalidateQueries(['ticket', ticket._id])
      onReply()
    } catch { toast.error('Failed to send reply.') }
    finally { setSending(false) }
  }

  return (
    <div className="glass-card overflow-hidden">
      <button onClick={onToggle} className="w-full p-4 text-left hover:bg-white/5 transition-colors flex items-start gap-3">
        <div className="w-9 h-9 bg-white/5 rounded-2xl flex items-center justify-center flex-shrink-0">
          <MessageCircle size={16} className="text-slate-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-white text-sm truncate">{ticket.subject}</p>
            <StatusBadge status={ticket.status} type="ticket" />
          </div>
          <p className="text-xs text-slate-400 mt-0.5">#{ticket.ticketNumber} · {formatDateTime(ticket.createdAt)}</p>
        </div>
        {isOpen ? <ChevronUp size={16} className="text-slate-400 mt-1" /> : <ChevronDown size={16} className="text-slate-400 mt-1" />}
      </button>

      {isOpen && (
        <div className="border-t border-white/5 p-4">
          {fullTicket ? (
            <>
              <div className="space-y-3 mb-4 max-h-72 overflow-y-auto">
                {fullTicket.messages?.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.senderRole === 'admin' ? '' : 'flex-row-reverse'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${msg.senderRole === 'admin' ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      {msg.senderRole === 'admin' ? 'A' : 'Y'}
                    </div>
                    <div className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${msg.senderRole === 'admin' ? 'bg-white/5 text-slate-200' : 'bg-brand-600 text-white'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
              {!['resolved', 'closed'].includes(ticket.status) && (
                <div className="flex gap-2">
                  <input className="input-glass flex-1" placeholder="Type a reply…"
                    value={reply} onChange={e => setReply(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleReply()} />
                  <button onClick={handleReply} disabled={sending || !reply.trim()} className="btn-primary px-3">
                    {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  </button>
                </div>
              )}
            </>
          ) : <div className="py-4 flex justify-center"><Loader2 size={18} className="animate-spin text-slate-400" /></div>}
        </div>
      )}
    </div>
  )
}
