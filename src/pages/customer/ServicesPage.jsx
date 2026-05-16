import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { servicesAPI } from '../../api'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { 
  Search, Filter, Star, ShieldCheck, ArrowRight, Sparkles, 
  ChevronRight, Award, Zap, Building, Settings, Wrench
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSector, setActiveSector] = useState('residential')
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const search = params.get('search')
    if (search) setSearchQuery(search)
    fetchServices()
  }, [location.search])

  const fetchServices = async () => {
    try {
      const { data } = await servicesAPI.getServices()
      setServices(data.data.services || [])
    } catch (err) {
      toast.error('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const SECTORS = [
    { id: 'residential', label: 'Residential', icon: Sparkles, desc: 'Home & Living' },
    { id: 'commercial', label: 'Commercial', icon: Building, desc: 'Office & Retail' },
    { id: 'industrial', label: 'Industrial', icon: Settings, desc: 'Heavy Equipment' }
  ]

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-[#0B1120] pb-20">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-12 pb-16 px-4 sm:px-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
              <Zap size={14} className="text-brand-400" />
              <span className="text-[10px] font-bold text-brand-300 uppercase tracking-widest">Master Verified Catalog</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Elite <span className="text-brand-500">Service</span> Modules.
            </h1>
            <p className="text-slate-400 max-w-xl font-medium leading-relaxed">
              Deploy professional maintenance solutions with absolute precision. All technicians are vetted and verified for Tier-1 performance.
            </p>
          </div>

          <div className="w-full md:w-96 p-1.5 bg-white/5 rounded-2xl border border-white/10 flex items-center focus-within:ring-2 focus-within:ring-brand-500/50 transition-all">
            <Search className="w-5 h-5 text-slate-500 ms-3" />
            <input
              type="text"
              placeholder="Search specific modules..."
              className="w-full px-4 py-3 bg-transparent text-white text-sm placeholder:text-slate-500 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SIDEBAR: Sectors & Standards */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
            <div className="glass-card !p-6 sticky top-28">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Service Sectors</h3>
              <div className="space-y-2">
                {SECTORS.map((sector) => (
                  <button
                    key={sector.id}
                    onClick={() => setActiveSector(sector.id)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                      activeSector === sector.id 
                        ? 'bg-brand-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <sector.icon size={18} />
                      <span>{sector.label}</span>
                    </div>
                    {activeSector === sector.id && <ChevronRight size={16} />}
                  </button>
                ))}
              </div>

              <div className="mt-10 pt-10 border-t border-white/5 space-y-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Khidma Quality</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center border border-emerald-500/20">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-white uppercase tracking-wider">Tier-1 Vetting</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Top 5% technicians only</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                      <Award className="w-4 h-4 text-brand-400" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-white uppercase tracking-wider">Resolution Guarantee</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">30-day quality assurance</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN: Catalog Grid */}
          <div className="flex-1 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <div 
                    key={service._id}
                    onClick={() => navigate(`/services/${service._id}`)}
                    className="glass-card group cursor-pointer hover:border-brand-500/40 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl group-hover:bg-brand-500/10 transition-all" />
                    
                    <div className="flex items-start justify-between mb-8 relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20 group-hover:scale-110 transition-transform duration-500">
                        {service.name.toLowerCase().includes('ac') ? <ShieldCheck className="w-8 h-8 text-brand-400" /> : 
                         service.name.toLowerCase().includes('clean') ? <Sparkles className="w-8 h-8 text-brand-400" /> :
                         service.name.toLowerCase().includes('plumb') ? <Wrench className="w-8 h-8 text-brand-400" /> :
                         <Zap className="w-8 h-8 text-brand-400" />}
                      </div>
                      <div className="px-3 py-1 rounded-full bg-brand-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20">
                        Available Now
                      </div>
                    </div>

                    <div className="relative z-10 space-y-3">
                      <h3 className="text-2xl font-extrabold text-white group-hover:text-brand-400 transition-colors">{service.name}</h3>
                      <p className="text-sm text-slate-400 font-medium leading-relaxed line-clamp-2">{service.description}</p>
                      
                      <div className="pt-8 mt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Starting Price</div>
                          <div className="text-lg font-black text-brand-400">{service.basePrice} SAR</div>
                        </div>
                        <div className="btn-primary !p-3 rounded-xl group-hover:px-6 transition-all">
                          <ArrowRight size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center glass-card">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No matching modules found</h3>
                  <p className="text-slate-400 max-w-xs mx-auto">Try refining your search or exploring our standard sectors.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
