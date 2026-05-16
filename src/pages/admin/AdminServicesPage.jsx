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
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Service</th><th>Category</th><th>Price</th><th>Duration</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {data.map(s => (
                <tr key={s._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        {s.image
                          ? <img src={s.image} className="w-8 h-8 rounded-lg object-cover" alt="" />
                          : <span className="text-sm">🏠</span>}
                      </div>
                      <span className="font-medium text-white">{s.name}</span>
                    </div>
                  </td>
                  <td className="text-slate-500">{s.category}</td>
                  <td className="font-semibold">{formatCurrency(s.price)}</td>
                  <td className="text-slate-500">{s.duration} min</td>
                  <td>
                    <span className={s.isActive ? 'badge-green' : 'badge-gray'}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(s)} className="btn-ghost btn-sm p-1.5">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(s)} className="btn-ghost btn-sm p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
