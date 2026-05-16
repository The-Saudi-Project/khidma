import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { servicesAPI } from '../../api'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Loader2, Settings } from 'lucide-react'
import { InlineLoader, EmptyState, ConfirmModal } from '../../components/common/LoadingSpinner'

const EMPTY_FORM = { name: '', description: '', category: '', price: '', priceType: 'fixed', duration: 60, features: '', isActive: true }

export default function AdminServicesPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => servicesAPI.getServicesAdmin({ limit: 50 }),
    select: d => d.data.data.services
  })

  const refetch = () => qc.invalidateQueries(['admin-services'])

  const openCreate = () => { setForm(EMPTY_FORM); setEditingService(null); setImageFile(null); setShowForm(true) }
  const openEdit = (s) => {
    setForm({ name: s.name, description: s.description, category: s.category, price: s.price, priceType: s.priceType, duration: s.duration, features: s.features?.join(', ') || '', isActive: s.isActive })
    setEditingService(s)
    setImageFile(null)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.description || !form.category || !form.price) {
      return toast.error('Please fill all required fields')
    }
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (imageFile) fd.append('image', imageFile)

      if (editingService) {
        await servicesAPI.updateService(editingService._id, fd)
        toast.success('Service updated!')
      } else {
        await servicesAPI.createService(fd)
        toast.success('Service created!')
      }
      setShowForm(false)
      refetch()
    } catch { toast.error('Failed to save service.') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await servicesAPI.deleteService(deleteTarget._id)
      toast.success('Service deactivated.')
      setDeleteTarget(null)
      refetch()
    } catch { toast.error('Failed to delete service.') }
    finally { setDeleting(false) }
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Services</h1>
          <p className="page-subtitle">Manage your service catalog</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> New service</button>
      </div>

      {isLoading ? <InlineLoader /> : !data?.length ? (
        <EmptyState icon={Settings} title="No services yet"
          action={<button onClick={openCreate} className="btn-primary">Create first service</button>} />
      ) : (
        <div className="glass rounded-3xl border border-white/5 shadow-2xl overflow-hidden mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-xs">
                {data.map(s => (
                  <tr key={s._id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-brand-500/20">
                          {s.image
                            ? <img src={s.image} className="w-8 h-8 rounded-lg object-cover" alt="" />
                            : <span className="text-sm">🏠</span>}
                        </div>
                        <span className="font-bold text-white">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-medium">{s.category}</td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-white">{formatCurrency(s.price)}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-medium">{s.duration} min</td>
                    <td className="py-3.5 px-4">
                      <span className={s.isActive ? 'px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'px-2 py-1 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20'}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteTarget(s)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Service form modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box max-w-lg w-full overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">
                {editingService ? 'Edit Service' : 'New Service'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">Service name *</label>
                <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="label">Category *</label>
                <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  <option value="">Select category…</option>
                  {['Cleaning', 'AC & Appliances', 'Plumbing', 'Electrical', 'Painting', 'Pest Control', 'Handyman', 'Moving', 'Other'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Description *</label>
                <textarea className="input-glass resize-none" rows={3}
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Price (SAR) *</label>
                  <input type="number" className="input" value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Price type</label>
                  <select className="input" value={form.priceType} onChange={e => setForm(f => ({ ...f, priceType: e.target.value }))}>
                    <option value="fixed">Fixed</option>
                    <option value="starting_from">Starting from</option>
                    <option value="hourly">Hourly</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Duration (minutes)</label>
                <input type="number" className="input" value={form.duration}
                  onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
              </div>
              <div>
                <label className="label">Features <span className="text-slate-400 font-normal">(comma-separated)</span></label>
                <input className="input" placeholder="Filter cleaning, Deep clean, Window washing"
                  value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} />
              </div>
              <div>
                <label className="label">Service image</label>
                <input type="file" accept="image/*" className="input-glass py-2" onChange={e => setImageFile(e.target.files[0])} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={form.isActive}
                  onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                <label htmlFor="isActive" className="text-sm text-slate-300 font-medium cursor-pointer">Active (visible to customers)</label>
              </div>
            </div>
            <div className="p-6 border-t border-white/5 flex gap-3">
              <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
                {saving ? <Loader2 size={15} className="animate-spin" /> : editingService ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title={`Deactivate "${deleteTarget?.name}"?`}
        message="This service will be hidden from customers. Existing bookings won't be affected."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
        danger
      />
    </div>
  )
}
