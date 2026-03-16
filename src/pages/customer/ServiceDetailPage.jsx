import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { servicesAPI } from '../../api'
import { formatCurrency } from '../../utils/helpers'
import { Clock, CheckCircle, ArrowLeft, Star, Loader2 } from 'lucide-react'
import { InlineLoader } from '../../components/common/LoadingSpinner'

export default function ServiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () => servicesAPI.getService(id),
    select: d => d.data.data.service
  })

  if (isLoading) return <InlineLoader />
  if (!data) return <div className="text-center py-20 text-slate-400">Service not found.</div>

  const service = data

  return (
    <div className="animate-fade-in max-w-2xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft size={16} /> Back to services
      </button>

      {/* Image */}
      <div className="h-56 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 overflow-hidden mb-6">
        {service.image ? (
          <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-7xl opacity-20">🏠</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <span className="badge-blue mb-2">{service.category}</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">{service.name}</h1>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(service.price)}</p>
          <p className="text-xs text-slate-400">
            {service.priceType === 'starting_from' ? 'starting from' :
             service.priceType === 'hourly' ? 'per hour' : 'fixed price'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6 text-sm text-slate-500">
        <span className="flex items-center gap-1.5"><Clock size={14} /> {service.duration} min</span>
        {service.averageRating > 0 && (
          <span className="flex items-center gap-1.5">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            {service.averageRating} rating
          </span>
        )}
        <span>{service.totalBookings} bookings</span>
      </div>

      <p className="text-slate-600 leading-relaxed mb-6">{service.description}</p>

      {/* Features */}
      {service.features?.length > 0 && (
        <div className="card p-5 mb-6">
          <h3 className="font-semibold text-slate-800 mb-3">What's included</h3>
          <ul className="space-y-2">
            {service.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                <CheckCircle size={15} className="text-emerald-500 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() => navigate(`/book/${service._id}`)}
        className="btn-primary btn-lg w-full"
      >
        Book This Service
      </button>
    </div>
  )
}
