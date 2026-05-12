import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { servicesAPI } from '../../api'
import { formatCurrency } from '../../utils/helpers'
import { Search, Clock, ChevronRight, SlidersHorizontal, Sparkles, Star, MapPin, Shield, Zap } from 'lucide-react'
import { InlineLoader, EmptyState } from '../../components/common/LoadingSpinner'

const SECTORS = [
  { id: 'residential', label: 'Home', icon: Sparkles },
  { id: 'commercial', label: 'Business', icon: Shield },
  { id: 'industrial', label: 'Industrial', icon: Zap }
]

const SORT_OPTIONS = [
  { value: 'sortOrder', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

export default function ServicesPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const urlCategory = searchParams.get('category')
  const urlSearch = searchParams.get('search')
  const urlSector = searchParams.get('sector')

  const [search, setSearch] = useState(urlSearch || '')
  const [sector, setSector] = useState(urlSector || 'residential')
  const [category, setCategory] = useState(urlCategory || 'All')
  const [sortBy, setSortBy] = useState('sortOrder')
  const [searchInput, setSearchInput] = useState(urlSearch || '')

  // Sync state if URL changes
  useEffect(() => {
    if (urlCategory) setCategory(urlCategory)
    if (urlSearch) {
      setSearch(urlSearch)
      setSearchInput(urlSearch)
    }
    if (urlSector) setSector(urlSector)
  }, [urlCategory, urlSearch, urlSector])

  const { data, isLoading } = useQuery({
    queryKey: ['services', { sector, category, search, sortBy }],
    queryFn: () => servicesAPI.getServices({
      sector,
      category: category === 'All' ? undefined : category,
      search: search || undefined,
      sortBy
    }),
    select: d => d.data.data
  })

  const services = data?.services || []
  const dynamicCategories = ['All', ...(data?.categories || [])]
  const featuredServices = services.filter(s => s.sortOrder > 0 && s.sortOrder <= 4)

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
  }

  return (
    <div className="animate-fade-in pb-12">
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={14} className="text-brand-600" />
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">Dammam & Eastern Province</span>
        </div>
        <h1 className="text-4xl font-black text-[#081225] tracking-tight">
          Explore Premium Services
        </h1>
        <p className="text-slate-500 mt-2 text-lg">Elite home solutions for modern living in Dammam.</p>
      </div>

      {/* Sector Selector Toggle */}
      <div className="flex bg-slate-100 p-1 rounded-2xl w-fit mb-8 shadow-inner">
        {SECTORS.map(s => {
          const Icon = s.icon
          const isActive = sector === s.id
          return (
            <button
              key={s.id}
              onClick={() => {
                setSector(s.id)
                setCategory('All')
                setSearchParams({ sector: s.id, category: 'All' })
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all
                ${isActive 
                  ? 'bg-white text-[#081225] shadow-sm scale-[1.02]' 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              <Icon size={16} className={isActive ? 'text-[#C5A059]' : ''} />
              {s.label}
            </button>
          )
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="sticky top-0 z-20 bg-[#f8fafc]/80 backdrop-blur-md py-4 -mx-4 px-4 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-11 pr-24 py-4 shadow-sm border-none bg-white"
              placeholder={`Search ${sector} services...`}
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-gold btn-sm h-10 px-6">
              Search
            </button>
          </form>

          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
            {dynamicCategories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat)
                  setSearchParams({ sector, category: cat })
                }}
                className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all
                  ${category === cat
                    ? 'bg-[#081225] text-white shadow-lg'
                    : 'bg-white text-slate-500 hover:text-[#081225] hover:bg-slate-50 border border-slate-100'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Section */}
      {category === 'All' && !search && featuredServices.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#081225] flex items-center gap-2">
              <Sparkles size={20} className="text-[#C5A059]" /> Featured Master Services
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredServices.map(service => (
              <FeaturedCard key={service._id} service={service} onClick={() => navigate(`/services/${service._id}`)} />
            ))}
          </div>
        </section>
      )}

      {/* All Services Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#081225]">
            {search ? `Results for "${search}"` : category === 'All' ? 'All Catalog Services' : `${category} Services`}
          </h2>
          <div className="relative">
            <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-white border-none shadow-sm rounded-xl pl-9 py-2 pr-8 text-xs font-bold text-slate-600 cursor-pointer focus:ring-2 focus:ring-brand-500"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <InlineLoader />
        ) : services.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No services found"
            description="Try adjusting your search or filters to explore more of our Dammam catalog."
            action={<button onClick={() => { setSearch(''); setSearchInput(''); setCategory('All') }} className="btn-secondary">Clear filters</button>}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <ServiceCard key={service._id} service={service} onClick={() => navigate(`/services/${service._id}`)} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function FeaturedCard({ service, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
    >
      <img 
        src={service.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?q=80&w=1000'} 
        alt={service.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#081225] via-[#081225]/40 to-transparent" />
      
      <div className="absolute top-4 left-4">
        <span className="bg-[#C5A059] text-[#081225] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
          Master Level
        </span>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <p className="text-[#C5A059] text-xs font-black uppercase tracking-widest mb-1">{service.category}</p>
        <h3 className="text-2xl font-black text-white mb-2 leading-tight">{service.name}</h3>
        <div className="flex items-center gap-4">
          <span className="text-white font-mono font-bold">{formatCurrency(service.price)}</span>
          <div className="h-1 w-1 rounded-full bg-white/30" />
          <span className="text-white/70 text-xs flex items-center gap-1">
            <Clock size={12} /> {service.duration} min
          </span>
        </div>
      </div>
    </div>
  )
}

function ServiceCard({ service, onClick }) {
  const isPremium = service.name.toLowerCase().includes('premium') || service.name.toLowerCase().includes('vip') || service.price > 400

  return (
    <div onClick={onClick} className="glass-card group flex flex-col h-full hover:shadow-2xl transition-all duration-300 overflow-hidden border-none">
      <div className="h-48 relative overflow-hidden">
        <img 
          src={service.image || 'https://images.unsplash.com/photo-1621905231291-00741c7e6335?q=80&w=1000'} 
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {isPremium && (
          <div className="absolute top-3 right-3">
            <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-xl shadow-lg">
              <Star size={14} className="text-[#C5A059] fill-[#C5A059]" />
            </div>
          </div>
        )}

        <div className="absolute bottom-3 left-3">
          <span className="bg-[#081225]/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
            {service.category}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-black text-[#081225] text-lg mb-2 group-hover:text-brand-600 transition-colors">
            {service.name}
          </h3>
          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-4">
            {service.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-[#081225] font-mono">
                {formatCurrency(service.price)}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                {service.priceType === 'starting_from' ? 'from' : service.priceType === 'hourly' ? '/hr' : ''}
              </span>
            </div>
          </div>
          <button className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-[#081225] transition-all duration-300">
            <ChevronRight size={18} className="text-slate-400 group-hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
