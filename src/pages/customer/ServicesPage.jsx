import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { servicesAPI } from '../../api'
import { formatCurrency } from '../../utils/helpers'
import { Search, Clock, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { InlineLoader, EmptyState } from '../../components/common/LoadingSpinner'

const CATEGORIES = ['All', 'Cleaning', 'AC & Appliances', 'Plumbing', 'Electrical', 'Painting', 'Pest Control', 'Handyman']
const SORT_OPTIONS = [
  { value: 'sortOrder', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

export default function ServicesPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('sortOrder')
  const [searchInput, setSearchInput] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['services', { category, search, sortBy }],
    queryFn: () => servicesAPI.getServices({
      category: category === 'All' ? undefined : category,
      search: search || undefined,
      sortBy
    }),
    select: d => d.data.data
  })

  const services = data?.services || []

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 text-balance">
          What service do you need?
        </h1>
        <p className="text-slate-500 mt-2">Professional home services across Saudi Arabia</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="input pl-11 pr-24 py-3.5"
          placeholder="Search services…"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary btn-sm">
          Search
        </button>
      </form>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {/* Category pills */}
        <div className="flex gap-2 flex-shrink-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${category === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex-shrink-0 ml-auto">
          <div className="relative">
            <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="input pl-8 py-2 pr-8 text-sm w-44 cursor-pointer"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      {!isLoading && search && (
        <p className="text-sm text-slate-500 mb-4">
          {services.length} result{services.length !== 1 ? 's' : ''} for "{search}"
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <InlineLoader />
      ) : services.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No services found"
          description="Try adjusting your search or filters"
          action={<button onClick={() => { setSearch(''); setSearchInput(''); setCategory('All') }} className="btn-secondary">Clear filters</button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(service => (
            <ServiceCard key={service._id} service={service} onClick={() => navigate(`/services/${service._id}`)} />
          ))}
        </div>
      )}
    </div>
  )
}

function ServiceCard({ service, onClick }) {
  return (
    <div onClick={onClick} className="card-hover overflow-hidden group">
      {/* Image placeholder */}
      <div className="h-40 bg-gradient-to-br from-brand-50 to-brand-100 relative overflow-hidden">
        {service.image ? (
          <img src={service.image} alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-20 select-none">🏠</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="badge-blue text-xs">{service.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-brand-700 transition-colors">
          {service.name}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {service.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-slate-900">
                {formatCurrency(service.price)}
              </span>
              {service.priceType === 'starting_from' && (
                <span className="text-xs text-slate-400">starting from</span>
              )}
              {service.priceType === 'hourly' && (
                <span className="text-xs text-slate-400">/hr</span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-400">
              <Clock size={11} />
              <span>{service.duration} min</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center group-hover:bg-brand-600 transition-colors">
            <ChevronRight size={16} className="text-brand-600 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </div>
  )
}
