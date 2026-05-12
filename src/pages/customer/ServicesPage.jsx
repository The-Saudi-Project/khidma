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
    <div className="min-h-screen bg-white -mx-4 sm:-mx-8 px-4 sm:px-8 py-10 animate-fade-in pb-20 relative overflow-hidden">
      {/* Background Lighting Effects */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-brand-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Section */}
      <div className="mb-12 relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={14} className="text-[#C5A059]" />
          <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.2em]">Dammam · Eastern Province</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#081225] tracking-tight leading-tight">
          Elite <span className="text-[#C5A059]">Khidma</span> Catalog
        </h1>
        <p className="text-slate-500 mt-4 text-lg max-w-2xl font-medium">Deploy professional maintenance modules for premium residences and enterprises.</p>
      </div>

      {/* Sector Selector Toggle - Adjusted for White BG */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mb-10 border border-slate-200/60 relative z-10 shadow-inner">
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
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                ${isActive 
                  ? 'bg-[#081225] text-white shadow-xl scale-[1.02]' 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              <Icon size={16} />
              {s.label}
            </button>
          )
        })}
      </div>

      {/* Search & Filter Bar - Sticky Lighter Glassmorphic */}
      <div className="sticky top-4 z-20 bg-white/80 backdrop-blur-xl rounded-3xl p-3 mb-12 border border-slate-200/60 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-4">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-28 py-4 text-sm text-[#081225] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#081225]/20 transition-all"
              placeholder={`Search ${sector} modules...`}
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#081225] text-white font-black uppercase tracking-tighter text-[11px] h-11 px-6 rounded-xl hover:bg-brand-800 transition-colors">
              Execute
            </button>
          </form>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {dynamicCategories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat)
                  setSearchParams({ sector, category: cat })
                }}
                className={`flex-shrink-0 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border
                  ${category === cat
                    ? 'bg-[#081225] text-white border-[#081225] shadow-lg'
                    : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400 hover:text-slate-700'
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
        <section className="mb-16 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-[#081225] flex items-center gap-3">
              <Sparkles size={24} className="text-[#C5A059]" /> Master Tier Deployments
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredServices.map(service => (
              <FeaturedCard key={service._id} service={service} onClick={() => navigate(`/services/${service._id}`)} />
            ))}
          </div>
        </section>
      )}

      {/* All Services Grid */}
      <section className="relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-xl font-black text-[#081225] uppercase tracking-widest">
            {search ? `Log: "${search}"` : category === 'All' ? 'Full Operational Catalog' : `${category} Modules`}
          </h2>
          <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <SlidersHorizontal size={14} className="ml-3 text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-transparent border-none text-xs font-black uppercase tracking-wider text-[#081225] cursor-pointer focus:ring-0 pr-8 py-1.5"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value} className="bg-white text-[#081225]">{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center"><InlineLoader /></div>
        ) : services.length === 0 ? (
          <div className="glass-navy rounded-[2.5rem] p-12 text-center border-white/5">
            <EmptyState
              icon={Search}
              title="Matrix Empty"
              description="No matching modules found in the current sector parameters."
              action={<button onClick={() => { setSearch(''); setSearchInput(''); setCategory('All') }} className="bg-[#C5A059] text-[#081225] px-6 py-2.5 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-white transition-colors">Reset Filters</button>}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
      className="group relative h-80 rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] border border-white/5"
    >
      <img 
        src={service.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?q=80&w=1000'} 
        alt={service.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#081225] via-[#081225]/60 to-transparent" />
      
      <div className="absolute top-6 left-6">
        <span className="bg-[#C5A059] text-[#081225] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
          <Shield size={12} /> Master Verified
        </span>
      </div>

      <div className="absolute bottom-8 left-8 right-8">
        <p className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.3em] mb-2">{service.category}</p>
        <h3 className="text-3xl font-black text-white mb-3 leading-tight tracking-tight">{service.name}</h3>
        <div className="flex items-center gap-5">
          <span className="text-white text-lg font-black font-mono">{formatCurrency(service.price)}</span>
          <div className="h-1.5 w-1.5 rounded-full bg-[#C5A059]/40" />
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Clock size={14} className="text-[#C5A059]" /> {service.duration} min
          </span>
        </div>
      </div>
    </div>
  )
}

function ServiceCard({ service, onClick }) {
  const isPremium = service.name.toLowerCase().includes('premium') || service.name.toLowerCase().includes('vip') || service.price > 400

  return (
    <div onClick={onClick} className="bg-[#081225] group flex flex-col h-full hover:shadow-[0_20px_50px_rgba(197,160,89,0.25)] transition-all duration-500 rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-[#C5A059]/30 hover:-translate-y-2 cursor-pointer">
      <div className="h-56 relative overflow-hidden">
        <img 
          src={service.image || 'https://images.unsplash.com/photo-1621905231291-00741c7e6335?q=80&w=1000'} 
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#081225] via-transparent to-transparent opacity-60" />
        
        {isPremium && (
          <div className="absolute top-4 right-4">
            <div className="bg-[#C5A059] p-2 rounded-xl shadow-lg">
              <Star size={14} className="text-[#081225] fill-[#081225]" />
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-4">
          <span className="bg-white/5 backdrop-blur-md text-[#C5A059] text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border border-white/10">
            {service.category}
          </span>
        </div>
      </div>

      <div className="p-7 flex flex-col flex-1 relative">
        {/* Subtle scanline background */}
        <div className="absolute inset-0 bg-scanlines opacity-[0.02] pointer-events-none" />

        <div className="flex-1 relative">
          <h3 className="font-black text-white text-xl mb-3 group-hover:text-[#C5A059] transition-colors leading-tight">
            {service.name}
          </h3>
          <p className="text-slate-400 text-xs font-medium line-clamp-2 leading-relaxed mb-6">
            {service.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5 relative">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white font-mono">
                {formatCurrency(service.price)}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                {service.priceType === 'starting_from' ? 'from' : service.priceType === 'hourly' ? '/hr' : ''}
              </span>
            </div>
          </div>
          <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[#C5A059] transition-all duration-500 border border-white/10 group-hover:border-[#C5A059]">
            <ChevronRight size={20} className="text-[#C5A059] group-hover:text-[#081225] transform group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}
