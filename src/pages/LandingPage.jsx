import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageToggle from '../components/common/LanguageToggle'
import BecomeProviderSection from '../components/landing/BecomeProviderSection'
import {
  Sparkles, Shield, Clock, Search, CheckCircle2, Star, ChevronRight,
  Smartphone, Award, Zap, HeartHandshake, ShieldCheck, Wrench, Paintbrush,
  Car, Truck, Scissors, ArrowRight, Check, Building, ShoppingBag, Settings
} from 'lucide-react'

// Mock categories for interactive layout discovery
const SECTOR_METADATA = {
  residential: { label: 'Home Services', desc: 'Elite solutions for your residence', icon: Sparkles },
  commercial: { label: 'Business & Office', desc: 'Professional facilities management', icon: Shield },
  industrial: { label: 'Industrial Support', desc: 'Heavy-duty technical operations', icon: Zap }
}

const CATEGORIES = [
  { id: 'cleaning', sector: 'residential', name: 'Home Cleaning', nameAr: 'تنظيف المنازل', icon: Sparkles, desc: 'Deep sanitation & upkeep', price: 'from 120 SAR' },
  { id: 'plumbing', sector: 'residential', name: 'Plumbing', nameAr: 'سباكة', icon: Wrench, desc: 'Pipe repair & installation', price: 'from 80 SAR' },
  { id: 'electrical', sector: 'residential', name: 'Electrical', nameAr: 'كهرباء', icon: Zap, desc: 'Wiring, lighting & safety', price: 'from 90 SAR' },
  { id: 'ac', sector: 'residential', name: 'AC Repair', nameAr: 'صيانة المكيفات', icon: Shield, desc: 'Freon recharge & overhaul', price: 'from 150 SAR' },
  { id: 'corporate', sector: 'commercial', name: 'Office Maintenance', nameAr: 'صيانة المكاتب', icon: Building, desc: 'Daily housekeeping & FM', price: 'Contract base' },
  { id: 'retail', sector: 'commercial', name: 'Retail Support', nameAr: 'دعم التجزئة', icon: ShoppingBag, desc: 'Mall & shop management', price: '24/7 Support' },
  { id: 'industrial', sector: 'industrial', name: 'Industrial HVAC', nameAr: 'التكييف الصناعي', icon: Settings, desc: 'Chillers & AHU support', price: 'Custom Quote' },
  { id: 'moving', sector: 'residential', name: 'Movers', nameAr: 'نقل عفش', icon: Truck, desc: 'Secure packing & transit', price: 'from 400 SAR' },
]

const FEATURED_PROVIDERS = [
  { name: 'Fahad Al-Otaibi', title: 'Master AC Technician', rating: 4.9, reviews: 142, verified: true, city: 'Riyadh' },
  { name: 'Sarah Mansour', title: 'Premium Home Stylist', rating: 5.0, reviews: 98, verified: true, city: 'Jeddah' },
  { name: 'Tariq Ziad', title: 'Advanced Electrical Specialist', rating: 4.8, reviews: 210, verified: true, city: 'Dammam' },
]

const TESTIMONIALS = [
  { name: 'Abdulrahman K.', role: 'Homeowner, Riyadh', quote: 'Khidma completely changed how we manage our estate. Elite technicians arrived perfectly on time. Worth every Riyal.', rating: 5 },
  { name: 'Nouf Al-Saud', role: 'Executive, Jeddah', quote: 'The interactive snapshot pricing and verified identity badges provide true peace of mind. Simply outstanding interface.', rating: 5 },
  { name: 'Majed R.', role: 'Property Manager', quote: 'Integrating maintenance requests through this digital marketplace saved us countless administrative hours. Highly recommended.', rating: 5 },
]

export default function LandingPage() {
  const { t, i18n } = useTranslation('common')
  const navigate = useNavigate()
  const isRTL = i18n.dir() === 'rtl'
  
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return CATEGORIES
    const q = searchQuery.toLowerCase()
    return CATEGORIES.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.nameAr.includes(q) || 
      c.desc.toLowerCase().includes(q)
    )
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-surface-50 selection:bg-[#C5A059]/20 selection:text-[#081225]">
      {/* Floating Glass Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#081225] rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-[#C5A059] font-black text-lg tracking-wider">K</span>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#081225] block leading-none">{t('appName')}</span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#C5A059] block mt-0.5">Premium Services</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageToggle />
            <Link to="/services" className="hidden md:inline-block text-xs font-bold text-slate-600 hover:text-[#081225] px-3 py-2">
              Explore Catalog
            </Link>
            <Link to="/login" className="text-xs font-bold text-slate-700 hover:text-[#081225] px-3 py-2">
              {t('actions.login')}
            </Link>
            <Link to="/signup" className="btn-gold text-xs py-2 px-4 rounded-xl font-bold">
              {t('actions.signup')}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#081225] pt-12 pb-24 lg:pt-20 lg:pb-32 text-white">
        {/* Soft background light blooms */}
        <div className="absolute top-1/4 start-1/3 w-96 h-96 bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 end-10 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <Award size={14} className="text-[#C5A059]" />
                <span className="text-xs font-bold tracking-wide text-brand-100">Saudi Arabia&apos;s Elite Services Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-balance">
                Elite Home Services. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E6D5B8] to-[#C5A059]">
                  Delivered with Trust.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Connect instantly with top-tier vetted technicians across Riyadh, Jeddah, and the Gulf. Absolute pricing clarity with luxury standards.
              </p>

              {/* Integrated Service Search Bar */}
              <div className="max-w-lg mx-auto lg:mx-0 p-1.5 bg-white rounded-2xl shadow-glass flex items-center focus-within:ring-2 focus-within:ring-[#C5A059]">
                <Search className="w-5 h-5 text-slate-400 ms-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search cleaning, AC, plumbing, movers..."
                  className="w-full px-3 py-3.5 bg-transparent text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => {
                    navigate(`/services?search=${encodeURIComponent(searchQuery)}`)
                  }}
                  className="btn-gold py-3 px-5 rounded-xl text-xs font-bold flex-shrink-0"
                >
                  Book Now
                </button>
              </div>

              {/* Quick Suggestion Pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2">
                <span className="text-xs text-slate-400 font-medium">Popular:</span>
                {['AC Repair', 'Deep Cleaning', 'Electrical', 'Painting'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    type="button"
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Trust Badges Row */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span className="text-xs font-bold text-slate-300">Vetted Techs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C5A059]" />
                  <span className="text-xs font-bold text-slate-300">Instant Slots</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-[#5f9bd7]" />
                  <span className="text-xs font-bold text-slate-300">Platform Guarantee</span>
                </div>
              </div>
            </div>

            {/* Right Graphics/Illustration Block */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md lg:max-w-none">
                {/* Premium floating glass backplates to anchor illustration */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#C5A059]/10 to-transparent rounded-3xl transform rotate-3 scale-105 border border-white/5" />
                <div className="absolute -inset-1 bg-[#10B981]/5 rounded-3xl transform -rotate-2 scale-100 border border-white/5" />
                
                {/* Embedded High-Fidelity Artifact Render/Illustration Container */}
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-glass overflow-hidden animate-float">
                  <div className="absolute top-0 end-0 bg-gradient-to-l from-white/10 to-transparent px-4 py-1 text-[9px] tracking-widest font-bold uppercase text-[#C5A059] rounded-bl-xl">
                    Secure Sandbox
                  </div>
                  
                  {/* Visual Artwork Container */}
                  <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-[#081225] via-[#1a4371] to-[#081225] p-4 flex flex-col justify-between border border-white/5 shadow-inner relative overflow-hidden">
                    {/* Decorative abstract glowing lines representing automated workflows */}
                    <div className="absolute start-0 top-1/3 w-full h-px bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent" />
                    <div className="absolute start-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-[#10B981]/20 to-transparent" />
                    
                    {/* Top UI card preview mock inside hero artwork */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center justify-between animate-pulse-subtle">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#C5A059] flex items-center justify-center text-white font-bold text-xs">
                          AC
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Central Cooling Check</p>
                          <p className="text-[10px] text-brand-200">Assigned to Master Tech</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                        IN ROUTE
                      </span>
                    </div>

                    {/* Circular dial abstraction graphic */}
                    <div className="my-auto text-center relative py-4">
                      <div className="w-28 h-28 mx-auto rounded-full border-4 border-dashed border-[#C5A059]/30 border-t-[#C5A059] animate-spin duration-1000 flex items-center justify-center" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-white block">100%</span>
                        <span className="text-[9px] font-bold text-[#C5A059] tracking-widest uppercase block">Verified Quality</span>
                      </div>
                    </div>

                    {/* Bottom floating summary layout */}
                    <div className="bg-[#081225]/90 rounded-xl p-3 border border-white/10 flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping flex-shrink-0" />
                      <p className="text-[11px] text-slate-300 font-medium truncate flex-1">
                        Live match: <span className="text-white font-bold">Provider 1.2km away</span>
                      </p>
                      <span className="text-[10px] font-bold text-[#C5A059]">Instant</span>
                    </div>
                  </div>

                  {/* Trust metadata overlay bar */}
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-slate-400">
                    <span>Secured with 256-bit Token Layer</span>
                    <span className="flex items-center gap-1 font-bold text-slate-300">
                      <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" /> 4.9 Global Avg
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto relative overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-600/5 rounded-full blur-[80px] animate-blob animation-delay-2000" />
        
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 mb-4 animate-fade-in">
            <Sparkles size={12} className="text-[#C5A059]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">Service Ecosystem</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-[#081225] tracking-tight animate-slide-up">
            {searchQuery.trim() ? `Search Results for "${searchQuery}"` : 'Explore Elite Service Categories'}
          </h2>
          <p className="text-base text-slate-500 mt-4 font-medium animate-slide-up animation-delay-500">
            Premium operational modules optimized for instant localized dispatch.
          </p>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="card p-12 text-center max-w-md mx-auto">
            <p className="text-base font-bold text-slate-700">No matching services found.</p>
            <p className="text-xs text-slate-400 mt-1">Try searching for generic keywords like &apos;AC&apos;, &apos;Cleaning&apos;, or &apos;Plumbing&apos;.</p>
            <button onClick={() => setSearchQuery('')} className="btn-secondary btn-sm mt-4 font-bold">
              Reset search query
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {filteredCategories.map((cat, idx) => {
              const Icon = cat.icon
              const sectorInfo = SECTOR_METADATA[cat.sector]
              const catalogName = cat.id === 'ac' ? 'AC & Appliances' : cat.name
              return (
                <div
                  key={cat.id}
                  onClick={() => navigate(`/services?sector=${cat.sector}&category=${encodeURIComponent(catalogName)}`)}
                  className="group cursor-pointer relative animate-fade-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Premium Glow Effect on Hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C5A059] to-[#081225] rounded-[2.5rem] opacity-0 group-hover:opacity-20 blur transition duration-500" />
                  
                  <div className="relative bg-white rounded-[2.5rem] p-7 h-full border border-slate-100 flex flex-col justify-between transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2 overflow-hidden">
                    {/* Interior Design Patterns */}
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-[#C5A059]/10 transition-colors duration-500" />
                    
                    <div>
                      <div className="flex items-start justify-between mb-6 relative">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-[#081225] transition-all duration-500 flex items-center justify-center shadow-inner group-hover:shadow-gold/20">
                          <Icon className="w-7 h-7 text-[#081225] group-hover:text-[#C5A059] transition-colors duration-500" />
                        </div>
                        <div className="text-end">
                          <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-tighter block">
                            {cat.price}
                          </span>
                          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-0.5 block">
                            {sectorInfo.label}
                          </span>
                        </div>
                      </div>

                      <div className="relative">
                        <h3 className="text-xl font-black text-[#081225] flex flex-col">
                          <span>{isRTL ? cat.nameAr : cat.name}</span>
                          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-0.5">
                            {isRTL ? cat.name : cat.nameAr}
                          </span>
                        </h3>
                        
                        <p className="text-xs text-slate-500 mt-3 font-medium leading-relaxed line-clamp-2">
                          {cat.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-50 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[#C5A059] transition-all">
                      <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] opacity-0 group-hover:opacity-100 animate-pulse" />
                        Book Now
                      </span>
                      <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center group-hover:border-[#C5A059]/30 transition-all">
                        <ChevronRight size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white border-y border-slate-100/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] block mb-2">Absolute Convenience</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#081225]">The Khidma Process</h2>
            <p className="text-sm text-slate-500 mt-2">Three frictionless steps to restore state-of-the-art living.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Visual connecting process line */}
            <div className="hidden md:block absolute top-1/2 start-[15%] end-[15%] h-0.5 bg-gradient-to-r from-brand-100 via-[#C5A059]/40 to-brand-100 transform -translate-y-6" />

            {[
              { step: '01', title: 'Book Service', desc: 'Select optimized time-slots and define mapping coordinates instantly.', icon: Smartphone },
              { step: '02', title: 'Get Matched', desc: 'Our algorithmic routing connects your payload to verified local talent.', icon: HeartHandshake },
              { step: '03', title: 'Service Completed', desc: 'Pay securely and authorize final commission closure upon total happiness.', icon: CheckCircle2 }
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <div key={item.step} className="bg-surface-50 rounded-3xl p-8 border border-slate-100 relative z-10 text-center group hover:bg-white transition-colors hover:shadow-glass">
                  <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm mx-auto flex items-center justify-center font-black text-sm text-[#081225] group-hover:border-[#C5A059] group-hover:text-[#C5A059] transition-colors mb-6">
                    {item.step}
                  </div>
                  <Icon className="w-8 h-8 text-[#081225] mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Providers Showcase */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] block mb-1">Elite Partners</span>
            <h2 className="text-3xl font-extrabold text-[#081225]">Meet Our Verified Professionals</h2>
          </div>
          <Link to="/services" className="btn-secondary btn-sm font-bold flex items-center gap-1">
            <span>View All Profiles</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURED_PROVIDERS.map((provider) => (
            <div key={provider.name} className="card p-6 flex flex-col justify-between text-start relative overflow-hidden border-slate-200/60">
              <div className="absolute top-4 end-4">
                <span className="badge-green bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold text-[10px]">
                  <Check size={10} /> Verified ID
                </span>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#081225] text-[#C5A059] font-bold text-sm flex items-center justify-center shadow-inner flex-shrink-0 border border-[#C5A059]/20">
                    {provider.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{provider.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">{provider.title}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-xl p-3 mb-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Coverage</span>
                    <span className="font-bold text-slate-800">{provider.city} Area</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Completed</span>
                    <span className="font-bold text-slate-800">{provider.reviews} Jobs</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-xs text-slate-900">{provider.rating}</span>
                  <span className="text-[10px] text-slate-400">({provider.reviews})</span>
                </div>
                <button onClick={() => navigate('/services')} type="button" className="text-xs font-bold text-[#081225] hover:text-[#C5A059] transition-colors">
                  Request Available Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Metrics Counter Banner */}
      <section className="py-16 bg-[#081225] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C5A059]/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '45,000+', label: 'Total Bookings Completed' },
              { value: '1,200+', label: 'Active Verified Providers' },
              { value: '12 Cities', label: 'Kingdom Coverage Map' },
              { value: '99.4%', label: 'Satisfaction Index' },
            ].map((stat, idx) => (
              <div key={idx} className="p-4 border-e border-white/5 last:border-e-0">
                <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#C5A059] tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] block mb-2">Unbiased Excellence</span>
          <h2 className="text-3xl font-extrabold text-[#081225]">What Our Patrons Attest</h2>
        </div>

        <div className="glass-card bg-white p-8 sm:p-10 border-slate-200/80 shadow-glass relative">
          <div className="absolute -top-4 start-8 text-5xl text-[#C5A059]/20 font-serif select-none">
            &ldquo;
          </div>

          <div className="min-h-[120px] flex items-center justify-center">
            <p className="text-base sm:text-lg font-medium text-slate-800 italic text-center leading-relaxed">
              &ldquo;{TESTIMONIALS[activeTestimonial].quote}&rdquo;
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-start">
              <p className="font-bold text-sm text-slate-900">{TESTIMONIALS[activeTestimonial].name}</p>
              <p className="text-xs text-slate-400 font-medium">{TESTIMONIALS[activeTestimonial].role}</p>
            </div>

            <div className="flex items-center gap-1">
              {[...Array(TESTIMONIALS[activeTestimonial].rating)].map((_, idx) => (
                <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>

          {/* Testimonial pill toggles */}
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                type="button"
                aria-label={`Slide ${idx + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  activeTestimonial === idx ? 'w-8 bg-[#081225]' : 'bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Keep internal onboard module integrated */}
      <BecomeProviderSection />

      {/* Premium Exit Footer CTA */}
      <footer className="bg-[#081225] text-white pt-16 pb-12 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-white/10">
            
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#081225] font-black text-sm">
                  K
                </div>
                <span className="font-extrabold text-lg tracking-tight block">Khidma Platform</span>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm">
                Engineered for operational excellence and robust client trust. Delivering high-impact digital marketplace infrastructure across the Gulf.
              </p>
              <div className="pt-2 flex items-center gap-3">
                {/* Mock app download badges */}
                <div className="px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors">
                  <Smartphone size={16} className="text-[#C5A059]" />
                  <div className="text-start">
                    <span className="text-[8px] uppercase block text-slate-400 leading-none font-bold">Download on</span>
                    <span className="text-xs font-bold block leading-tight">App Store</span>
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors">
                  <Award size={16} className="text-[#10B981]" />
                  <div className="text-start">
                    <span className="text-[8px] uppercase block text-slate-400 leading-none font-bold">Get it on</span>
                    <span className="text-xs font-bold block leading-tight">Google Play</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 col-span-6 space-y-3">
              <span className="text-xs font-bold tracking-widest uppercase text-[#C5A059] block">Solutions</span>
              <ul className="space-y-2 text-xs font-medium text-slate-300">
                <li><Link to="/services" className="hover:text-white transition-colors">Service Scope</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Instant Scheduling</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Client Gateway</Link></li>
                <li><a href="#become-provider" className="hover:text-white transition-colors">Join as Talent</a></li>
              </ul>
            </div>

            <div className="lg:col-span-2 col-span-6 space-y-3">
              <span className="text-xs font-bold tracking-widest uppercase text-[#C5A059] block">Legal &amp; Trust</span>
              <ul className="space-y-2 text-xs font-medium text-slate-300">
                <li><span className="text-slate-500 cursor-not-allowed">Terms of Core Service</span></li>
                <li><span className="text-slate-500 cursor-not-allowed">Data Vault Protocol</span></li>
                <li><span className="text-slate-500 cursor-not-allowed">Commission SLA (30%)</span></li>
                <li><span className="text-slate-500 cursor-not-allowed">Fraud Abatement Info</span></li>
              </ul>
            </div>

            {/* Newsletter Container Block */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-xs font-bold tracking-widest uppercase text-[#C5A059] block">Dispatch Insights</span>
              <p className="text-xs text-slate-400 font-medium">Subscribe for key infrastructure upgrades and premium promotions directly to your terminal.</p>
              <div className="flex gap-2 pt-1">
                <input
                  type="email"
                  placeholder="Enter corporate email"
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                />
                <button type="button" onClick={() => alert('Subscription saved.')} className="btn-gold py-2 px-4 text-xs rounded-xl font-bold">
                  Join
                </button>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p className="font-medium">
              © {new Date().getFullYear()} Khidma Platforms Inc. All Rights Securely Handled.
            </p>
            <div className="flex items-center gap-4">
              <span>Riyadh</span>
              <span>•</span>
              <span>Jeddah</span>
              <span>•</span>
              <span>Dammam</span>
              <span>•</span>
              <span className="text-[#C5A059] font-bold">Gulf Premium Hub</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
