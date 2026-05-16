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

      <div className="flex gap-3 mb-4 flex-wrap">
        <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1) }} className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9 py-2 text-sm w-60" placeholder="Search by name or email…"
            value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        </form>
        <div className="flex gap-2">
          {['', 'customer', 'provider', 'admin'].map(r => (
            <button key={r} onClick={() => { setRole(r); setPage(1) }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all capitalize
                ${role === r ? 'bg-brand-600 text-white' : 'bg-white/[0.03] border border-white/10 text-slate-400 hover:border-brand-300'}`}>
              {r || 'All'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? <InlineLoader /> : (
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>User</th><th>Role</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} size="sm" />
                      <div>
                        <p className="font-medium text-white">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="capitalize badge-gray">{u.role}</span></td>
                  <td className="text-slate-500 text-sm">{formatDate(u.createdAt)}</td>
                  <td><span className={u.isActive ? 'badge-green' : 'badge-red'}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    {u.role !== 'admin' && (
                      <button onClick={() => handleToggle(u._id)} disabled={toggling === u._id}
                        className="btn-ghost btn-sm gap-1.5">
                        {toggling === u._id ? <Loader2 size={13} className="animate-spin" /> :
                          u.isActive ? <><ToggleRight size={16} className="text-brand-400" /> Deactivate</> :
                                       <><ToggleLeft size={16} className="text-slate-400" /> Activate</>}
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
