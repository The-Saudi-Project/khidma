// ─── AdminUsersPage ───────────────────────────────────────────────────────────
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { usersAPI } from '../../api'
import { formatDate, formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { Users, Plus, ToggleLeft, ToggleRight, Loader2, Search } from 'lucide-react'
import { InlineLoader, EmptyState, Pagination, Avatar } from '../../components/common/LoadingSpinner'

export default function AdminUsersPage() {
  const qc = useQueryClient()
  const [role, setRole] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [showCreateProvider, setShowCreateProvider] = useState(false)
  const [providerForm, setProviderForm] = useState({ name: '', email: '', password: '', phone: '', skills: '' })
  const [creating, setCreating] = useState(false)
  const [toggling, setToggling] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', { role, search, page }],
    queryFn: () => usersAPI.getAllUsers({ role: role || undefined, search: search || undefined, page, limit: 20 }),
    select: d => d.data
  })

  const users = data?.data?.users || []
  const meta = data?.meta

  const handleToggle = async (userId) => {
    setToggling(userId)
    try {
      await usersAPI.toggleUserStatus(userId)
      toast.success('User status updated.')
      qc.invalidateQueries(['admin-users'])
    } catch { toast.error('Failed to update status.') }
    finally { setToggling(null) }
  }

  const handleCreateProvider = async () => {
    if (!providerForm.name || !providerForm.email || !providerForm.password) return toast.error('Fill required fields')
    setCreating(true)
    try {
      await usersAPI.createProvider({ ...providerForm, skills: providerForm.skills.split(',').map(s => s.trim()).filter(Boolean) })
      toast.success('Provider account created!')
      setShowCreateProvider(false)
      setProviderForm({ name: '', email: '', password: '', phone: '', skills: '' })
      qc.invalidateQueries(['admin-users'])
    } catch { toast.error('Failed to create provider.') }
    finally { setCreating(false) }
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="page-title">Users</h1><p className="page-subtitle">Manage customers and providers</p></div>
        <button onClick={() => setShowCreateProvider(true)} className="btn-primary"><Plus size={16} /> New provider</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center">
        <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1) }} className="relative w-full sm:w-auto">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="w-full sm:w-64 bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all" placeholder="Search by name or email…"
            value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        </form>
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-hide">
          {['', 'customer', 'provider', 'admin'].map(r => (
            <button key={r} onClick={() => { setRole(r); setPage(1) }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize whitespace-nowrap
                ${role === r ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'}`}>
              {r || 'All'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? <InlineLoader /> : (
        <div className="glass rounded-3xl border border-white/5 shadow-2xl overflow-hidden mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-xs">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} size="sm" />
                        <div>
                          <p className="font-bold text-white">{u.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize px-2 py-1 rounded-full text-[10px] font-bold bg-white/5 text-slate-300 border border-white/10">{u.role}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-medium">{formatDate(u.createdAt)}</td>
                    <td className="py-3.5 px-4">
                      <span className={u.isActive ? 'px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'px-2 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20'}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {u.role !== 'admin' && (
                        <div className="flex justify-end">
                          <button onClick={() => handleToggle(u._id)} disabled={toggling === u._id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold transition-colors uppercase tracking-wider">
                            {toggling === u._id ? <Loader2 size={13} className="animate-spin" /> :
                              u.isActive ? <><ToggleRight size={14} className="text-red-400" /> Deactivate</> :
                                           <><ToggleLeft size={14} className="text-emerald-400" /> Activate</>}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-white/5 bg-white/5 p-2">
            <Pagination meta={meta} onPageChange={setPage} />
          </div>
        </div>
      )}

      {showCreateProvider && (
        <div className="modal-overlay" onClick={() => setShowCreateProvider(false)}>
          <div className="modal-box p-6 max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-5">Create Provider Account</h2>
            <div className="space-y-3">
              {[['name', 'Full name *', 'text'], ['email', 'Email *', 'email'], ['password', 'Password *', 'password'], ['phone', 'Phone', 'tel']].map(([k, l, t]) => (
                <div key={k}>
                  <label className="label">{l}</label>
                  <input type={t} className="input" value={providerForm[k]}
                    onChange={e => setProviderForm(f => ({ ...f, [k]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label className="label">Skills <span className="text-slate-400 font-normal">(comma-separated)</span></label>
                <input className="input" placeholder="Cleaning, Plumbing"
                  value={providerForm.skills} onChange={e => setProviderForm(f => ({ ...f, skills: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowCreateProvider(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleCreateProvider} disabled={creating} className="btn-primary flex-1 justify-center">
                {creating ? <Loader2 size={15} className="animate-spin" /> : 'Create Provider'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
