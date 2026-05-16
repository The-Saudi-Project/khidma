import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageToggle from '../components/common/LanguageToggle'
import BecomeProviderSection from '../components/landing/BecomeProviderSection'
import {
  Sparkles, Shield, Clock, Search, CheckCircle2, Star, ChevronRight,
  Smartphone, Award, Zap, HeartHandshake, ShieldCheck, Wrench, Paintbrush,
  Car, Truck, Scissors, ArrowRight, Check, Building, ShoppingBag, Settings,
  Plus, Minus, Play, Download, ArrowUpRight, BarChart3, Fingerprint, Lock
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

const FAQ_ITEMS = [
  { q: 'How are Khidma professionals vetted?', a: 'Every technician undergoes a rigorous 5-step background check, skills verification, and behavioral interview. We only onboard the top 5% of applicants.' },
  { q: 'Is there a warranty on services?', a: 'Yes. All completed payloads carry a 30-day Khidma Quality Guarantee. If the resolution is not absolute, we deploy a Master Tech to rectify it at zero cost.' },
  { q: 'Can I track my technician in real-time?', a: 'Absolutely. Once dispatched, our interactive map provides live GPS telemetry and an exact ETA down to the minute.' },
  { q: 'What is the "Encrypted Layer"?', a: 'We employ bank-grade 256-bit encryption for all data and financial transactions, ensuring your private estate details remain strictly confidential.' },
]

export default function LandingPage() {
  const { t, i18n } = useTranslation('common')
  const navigate = useNavigate()
  const isRTL = i18n.dir() === 'rtl'
  
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)

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

      {/* 2. Brand Trust Strip */}
      <div className="bg-[#081225] border-y border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="text-xl font-black tracking-widest text-white uppercase flex items-center gap-2">
            <Building size={20} /> AL-RAJHI ESTATES
          </div>
          <div className="text-xl font-black tracking-widest text-white uppercase flex items-center gap-2">
            <ShieldCheck size={20} /> ARAMCO FM
          </div>
          <div className="text-xl font-black tracking-widest text-white uppercase flex items-center gap-2">
            <Award size={20} /> NEOM DEV
          </div>
          <div className="text-xl font-black tracking-widest text-white uppercase flex items-center gap-2 hidden md:flex">
            <Building size={20} /> EMAAR
          </div>
        </div>
      </div>

      {/* 3. Core Values (Bento Grid) */}
      <section className="py-24 px-4 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 mb-6">
              <Star size={14} className="text-[#C5A059] fill-[#C5A059]" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#C5A059]">The Khidma Standard</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-[#081225] tracking-tight leading-tight">
              Absolute Precision.<br />Zero Compromise.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 auto-rows-[280px]">
            <div className="md:col-span-2 bg-[#081225] rounded-3xl p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#10B981]/20 to-transparent rounded-bl-full pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                  <ShieldCheck size={28} className="text-[#10B981]" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white mb-3">Vetted Excellence</h3>
                  <p className="text-slate-400 font-medium max-w-md">Every technician clears a rigorous 5-stage background check, ensuring only the top 5% step foot into your property.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-10 border border-slate-100 relative group overflow-hidden">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                  <Clock size={28} className="text-[#C5A059]" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#081225] mb-2">On-Time SLA</h3>
                  <p className="text-slate-500 font-medium text-sm">Automated dispatch guarantees arrival within exact allocated windows.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-10 border border-slate-100 relative group overflow-hidden">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                  <BarChart3 size={28} className="text-[#C5A059]" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#081225] mb-2">Fixed Pricing</h3>
                  <p className="text-slate-500 font-medium text-sm">Transparent matrix billing. No hidden fees, no last-minute negotiations.</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-[#C5A059] rounded-3xl p-10 relative overflow-hidden group">
              <div className="absolute top-1/2 right-10 -translate-y-1/2 pointer-events-none opacity-20">
                <Fingerprint size={160} className="text-[#081225]" />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="w-14 h-14 bg-[#081225]/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-[#081225]/20">
                  <Lock size={28} className="text-[#081225]" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-[#081225] mb-3">Bank-Grade Escrow</h3>
                  <p className="text-[#081225]/70 font-bold max-w-md">Funds are held securely and only released when the service meets our absolute standard of quality.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Premium Value Proposition (Split Screen) */}
      <section className="py-24 bg-surface-50 border-y border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#C5A059]/10 to-transparent rounded-[3rem] transform -rotate-3 scale-105" />
              <div className="relative bg-white rounded-[3rem] p-8 border border-slate-100 shadow-[0_20px_50px_rgba(8,18,37,0.05)] h-[600px] flex flex-col">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#081225] rounded-xl flex items-center justify-center text-[#C5A059] font-black">K</div>
                    <span className="font-extrabold text-lg tracking-tight">Active Dispatch</span>
                  </div>
                  <span className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] font-bold text-[10px] uppercase tracking-widest rounded-full">Secure</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">System Notification</p>
                    <p className="text-sm font-bold text-[#081225]">Master Plumber dispatched to your coordinates.</p>
                  </div>
                  
                  <div className="bg-[#081225] text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <p className="text-[10px] font-black text-[#10B981] uppercase tracking-widest mb-1">ETA</p>
                        <p className="text-3xl font-black tracking-tight">12 MIN</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Provider</p>
                        <p className="text-sm font-bold">Faisal A.</p>
                        <div className="flex items-center gap-1 mt-1 justify-end">
                          <Star size={12} className="fill-[#C5A059] text-[#C5A059]" />
                          <span className="text-[10px] font-bold text-slate-300">4.9</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Search size={20} className="text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-slate-100 rounded-full w-3/4 mb-2" />
                      <div className="h-2 bg-slate-100 rounded-full w-1/2" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50">
                  <div className="h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center px-4">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping mr-3" />
                    <span className="text-xs font-bold text-slate-400">Tracking telemetry active...</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 mb-6 shadow-sm">
                  <Shield size={14} className="text-[#081225]" />
                  <span className="text-xs font-black uppercase tracking-wider text-[#081225]">The Premium Edge</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-[#081225] tracking-tight leading-[1.1]">
                  Command your estate from <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#081225] to-[#C5A059]">one interface.</span>
                </h2>
              </div>

              <div className="space-y-6">
                {[
                  { title: 'Live Telemetry', desc: 'Watch your assigned professional approach your location in real-time.' },
                  { title: 'Digital Sign-offs', desc: 'Approve completion and release funds purely through the platform.' },
                  { title: 'Encrypted Audits', desc: 'Every transaction and interaction is logged in your secure history.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0 text-[#C5A059] font-black">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-[#081225] mb-1">{item.title}</h4>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => navigate('/services')} className="btn-primary btn-lg rounded-2xl flex items-center gap-2 group">
                Initiate Dispatch 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories Section - High Contrast (Navy Glass on White) */}
      <section className="py-24 px-4 relative overflow-hidden bg-white">
        {/* Animated Background Lighting (Subtle Blobs) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-600/5 rounded-full blur-[120px] animate-blob" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C5A059]/5 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 mb-6 animate-fade-in">
              <Sparkles size={14} className="text-[#C5A059]" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#C5A059]">Elite Marketplace</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-[#081225] tracking-tight leading-tight animate-slide-up">
              {searchQuery.trim() ? `Search Results for "${searchQuery}"` : (
                <>Experience the <span className="text-[#C5A059]">Master Tier</span></>
              )}
            </h2>
            <p className="text-lg text-slate-500 mt-6 font-medium animate-slide-up animation-delay-500 max-w-2xl mx-auto">
              Precision-engineered home and business solutions for the most discerning clients in Saudi Arabia.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCategories.map((cat, idx) => {
              const Icon = cat.icon
              const sectorInfo = SECTOR_METADATA[cat.sector]
              const catalogName = cat.id === 'ac' ? 'AC & Appliances' : cat.name
              return (
                <div
                  key={cat.id}
                  onClick={() => navigate(`/services?sector=${cat.sector}&category=${encodeURIComponent(catalogName)}`)}
                  className="group cursor-pointer relative animate-fade-in bg-[#081225] rounded-[2.5rem] p-8 h-full flex flex-col justify-between border border-white/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(197,160,89,0.25)] hover:border-[#C5A059]/30 overflow-hidden"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Interior Decorative Pattern (Scanlines) */}
                  <div className="absolute inset-0 bg-scanlines opacity-[0.03] pointer-events-none" />
                  
                  <div className="relative z-10 flex-1 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-start justify-between mb-8 relative">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 group-hover:bg-[#C5A059] transition-all duration-500 flex items-center justify-center border border-white/10 group-hover:border-[#C5A059] shadow-inner">
                          <Icon className="w-8 h-8 text-[#C5A059] group-hover:text-[#081225] transition-colors duration-500" />
                        </div>
                        <div className="text-end">
                          <span className="text-[12px] font-black text-white uppercase tracking-tighter block">
                            {cat.price}
                          </span>
                          <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.15em] mt-1.5 block">
                            {sectorInfo.label}
                          </span>
                        </div>
                      </div>

                      <div className="relative">
                        <h3 className="text-2xl font-black text-white flex flex-col leading-tight">
                          <span>{isRTL ? cat.nameAr : cat.name}</span>
                          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1.5">
                            {isRTL ? cat.name : cat.nameAr}
                          </span>
                        </h3>
                        
                        <p className="text-sm text-slate-400 mt-4 font-medium leading-relaxed line-clamp-2">
                          {cat.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-8 mt-8 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <span className="text-[12px] font-black uppercase tracking-[0.2em] text-white/50 group-hover:text-white transition-colors">
                          Deploy
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#C5A059]/20 group-hover:border-[#C5A059]/40 transition-all">
                        <ChevronRight size={18} className="text-white group-hover:text-[#C5A059] transform group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 6. App Download Prompt (Mobile Mockup) */}
      <section className="py-24 relative overflow-hidden bg-[#081225]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C5A059]/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-[3rem] overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 md:p-16 lg:p-20 backdrop-blur-md">
            <div className="md:w-1/2 text-center md:text-start mb-12 md:mb-0">
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.1] mb-6">
                Carry the Master Tier in your pocket.
              </h2>
              <p className="text-lg text-slate-300 font-medium mb-10 max-w-md mx-auto md:mx-0">
                Install the Khidma Progressive Web App to access instant bookings, push notifications, and offline mode.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-[#081225] rounded-xl font-black flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors shadow-lg">
                  <Download size={20} /> Install App
                </button>
                <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white rounded-xl font-black flex items-center justify-center gap-3 hover:bg-white/5 transition-colors">
                  Create Account
                </Link>
              </div>
            </div>

            <div className="md:w-5/12 relative flex justify-center w-full">
              {/* Abstract Mobile Device */}
              <div className="w-[280px] h-[580px] bg-[#081225] rounded-[3rem] border-[8px] border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col items-center">
                {/* Dynamic Island */}
                <div className="w-24 h-7 bg-black rounded-full mt-2 absolute top-0 z-20" />
                
                {/* Screen Content */}
                <div className="w-full h-full bg-surface-50 pt-16 px-4 pb-6 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-[10px] font-black uppercase text-[#C5A059] tracking-wider">Good Morning</p>
                      <p className="text-lg font-black text-[#081225]">Ahmad</p>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex justify-center items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    </div>
                  </div>

                  <div className="bg-[#081225] text-white rounded-2xl p-4 mb-4 shadow-lg">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-[#10B981]">Active Payload</p>
                    <p className="text-lg font-black mb-1">Deep Cleaning</p>
                    <p className="text-xs text-slate-400">Arriving in 15 mins</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 flex flex-col justify-center items-center gap-2">
                      <Sparkles size={24} className="text-[#C5A059]" />
                      <span className="text-[10px] font-bold text-[#081225]">Cleaning</span>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 flex flex-col justify-center items-center gap-2">
                      <Wrench size={24} className="text-[#C5A059]" />
                      <span className="text-[10px] font-bold text-[#081225]">Plumbing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Master Tier UI Elevation */}
      <section className="py-28 bg-white relative overflow-hidden">
        {/* Ambient background watermark/gradient grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 mb-4 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#081225]">Frictionless Engagement</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-[#081225] tracking-tight leading-tight">
              The <span className="text-[#C5A059]">Khidma</span> Protocol
            </h2>
            <p className="text-base sm:text-lg text-slate-500 mt-4 max-w-xl mx-auto font-medium">
              Three streamlined phases engineered to dispatch elite talent directly to your mapped coordinates.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Architectural timeline connector */}
            <div className="hidden md:block absolute top-1/2 start-[18%] end-[18%] h-[2px] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent transform -translate-y-8" />

            {[
              {
                step: '01',
                title: 'Define Payload',
                desc: 'Select customized Master Tier service modules, input precise coverage parameters, and lock mapping coordinates instantly.',
                icon: Smartphone
              },
              {
                step: '02',
                title: 'Algorithmic Routing',
                desc: 'Our enterprise backend calculates real-time proximity and authenticates background parameters to match top-tier local talent.',
                icon: HeartHandshake
              },
              {
                step: '03',
                title: 'Authorize Closure',
                desc: 'Upon full deployment success, authorize digital commission release securely. Backed by our absolute satisfaction standard.',
                icon: CheckCircle2
              }
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <div 
                  key={item.step} 
                  className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_12px_40px_-12px_rgba(8,18,37,0.06)] relative z-10 text-center group hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(197,160,89,0.15)] hover:border-[#C5A059]/30 overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-full opacity-50 group-hover:from-[#C5A059]/5 transition-colors duration-500 pointer-events-none" />

                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100/80 mx-auto flex items-center justify-center relative mb-8 group-hover:bg-[#081225] transition-colors duration-500 shadow-inner">
                      <span className="absolute -top-2.5 bg-[#C5A059] text-[#081225] text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
                        STEP {item.step}
                      </span>
                      <Icon className="w-7 h-7 text-[#081225] group-hover:text-[#C5A059] transition-colors duration-500 transform group-hover:scale-110 duration-500" />
                    </div>

                    <h3 className="font-black text-xl text-[#081225] mb-3 group-hover:text-[#C5A059] transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#081225] flex items-center gap-1">
                      System Phase Active <ChevronRight size={12} className="text-[#C5A059]" />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Providers Showcase - Elevated Contrast Aesthetic */}
      <section className="py-28 px-4 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 mb-3">
              <Award size={12} className="text-[#C5A059]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#081225]">Verified Experts</span>
            </div>
            <h2 className="text-4xl font-black text-[#081225] tracking-tight leading-tight">
              Elite Network Partners
            </h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">Fully vetted technicians authorized for deployment across key Gulf hubs.</p>
          </div>
          <Link 
            to="/services" 
            className="group px-6 py-3 rounded-xl bg-slate-50 hover:bg-[#081225] border border-slate-100 text-xs font-black uppercase tracking-widest text-[#081225] hover:text-white transition-all duration-300 flex items-center gap-2 hover:shadow-lg"
          >
            <span>Browse Master Profiles</span>
            <ArrowRight size={14} className="text-[#C5A059] transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {FEATURED_PROVIDERS.map((provider, idx) => (
            <div 
              key={provider.name} 
              className="bg-white rounded-[2rem] p-7 border border-slate-100 flex flex-col justify-between relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5"
            >
              {/* Top ambient tag background strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#081225] via-[#C5A059] to-[#081225]" />

              <div className="absolute top-5 right-5">
                <span className="bg-[#10B981]/10 text-[#10B981] px-3 py-1 rounded-full flex items-center gap-1 font-black text-[9px] tracking-widest uppercase border border-[#10B981]/20">
                  <Check size={10} className="stroke-[3]" /> SLA PASS
                </span>
              </div>

              <div>
                <div className="flex items-center gap-4 mb-6 pt-2">
                  <div className="w-14 h-14 rounded-2xl bg-[#081225] text-[#C5A059] font-black text-xl flex items-center justify-center shadow-lg border border-[#C5A059]/30 relative flex-shrink-0">
                    {provider.name.charAt(0)}
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#10B981] rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-[#081225] text-base leading-tight">{provider.name}</h3>
                    <p className="text-xs text-[#C5A059] font-bold mt-0.5">{provider.title}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50/80 rounded-2xl p-4 mb-6 border border-slate-100/50">
                  <div>
                    <span className="text-slate-400 block text-[9px] font-black uppercase tracking-wider">Assigned Sector</span>
                    <span className="font-bold text-xs text-[#081225] mt-0.5 block">{provider.city} Grid</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] font-black uppercase tracking-wider">Payloads Closed</span>
                    <span className="font-bold text-xs text-[#081225] mt-0.5 block">{provider.reviews} Active</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                  <span className="font-black text-sm text-[#081225]">{provider.rating}</span>
                  <span className="text-[10px] font-bold text-slate-400">({provider.reviews} verified)</span>
                </div>
                <button 
                  onClick={() => navigate('/services')} 
                  type="button" 
                  className="text-[11px] font-black uppercase tracking-wider text-[#081225] hover:text-[#C5A059] transition-colors flex items-center gap-1"
                >
                  <span>Dispatch</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Metrics Counter Banner - Master Tier Matrix */}
      <section className="py-20 bg-[#081225] text-white relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-scanlines opacity-[0.03] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {[
              { value: '45,000+', label: 'Total Deployments Handled' },
              { value: '1,200+', label: 'Authorized Technicians' },
              { value: '12 Hubs', label: 'Saudi Urban Coverage Map' },
              { value: '99.4%', label: 'SLA Quality Retention' },
            ].map((stat, idx) => (
              <div key={idx} className="p-4 border-e border-white/5 last:border-e-0 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#C5A059]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                <p className="relative text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#C5A059] tracking-tight">
                  {stat.value}
                </p>
                <p className="relative text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-3 group-hover:text-white transition-colors">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section - Premium Executive Look */}
      <section className="py-28 px-4 max-w-5xl mx-auto relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">Executive Approval</span>
          </div>
          <h2 className="text-4xl font-black text-[#081225] tracking-tight">Patron Attestations</h2>
        </div>

        <div className="relative bg-white rounded-[2.5rem] p-10 sm:p-14 border border-slate-100 shadow-[0_20px_80px_-15px_rgba(8,18,37,0.08)]">
          <div className="absolute -top-6 left-12 w-12 h-12 rounded-2xl bg-[#C5A059] text-[#081225] flex items-center justify-center font-serif text-4xl font-bold shadow-lg select-none">
            &ldquo;
          </div>

          <div className="min-h-[140px] flex items-center justify-center relative z-10 pt-4">
            <p className="text-lg sm:text-xl font-medium text-slate-800 italic text-center leading-relaxed max-w-3xl">
              &ldquo;{TESTIMONIALS[activeTestimonial].quote}&rdquo;
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <div className="text-center sm:text-start">
              <p className="font-black text-base text-[#081225]">{TESTIMONIALS[activeTestimonial].name}</p>
              <p className="text-xs text-[#C5A059] font-bold tracking-wide mt-0.5">{TESTIMONIALS[activeTestimonial].role}</p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              {[...Array(TESTIMONIALS[activeTestimonial].rating)].map((_, idx) => (
                <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-[10px] font-black text-[#081225] ml-1">5.0</span>
            </div>
          </div>

          {/* Precision pill toggles */}
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                type="button"
                aria-label={`Attestation ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeTestimonial === idx ? 'w-10 bg-[#081225]' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 9. Dynamic FAQ */}
      <section className="py-24 bg-surface-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#081225] tracking-tight">Intelligence Base</h2>
            <p className="text-slate-500 font-medium mt-4">Clarifications on the Khidma Master Protocol.</p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden ${
                    isOpen ? 'border-[#C5A059] shadow-md' : 'border-slate-200 shadow-sm hover:border-slate-300'
                  }`}
                >
                  <button
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                  >
                    <span className={`font-black text-lg ${isOpen ? 'text-[#081225]' : 'text-slate-700'}`}>
                      {faq.q}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[#C5A059] text-[#081225]' : 'bg-slate-100 text-slate-500'}`}>
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </div>
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-slate-500 font-medium leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Keep internal onboard module integrated */}
      <BecomeProviderSection />

      {/* Premium Exit Footer CTA - Immersive Grid Interface */}
      <footer className="bg-[#081225] text-white pt-20 pb-12 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-scanlines opacity-[0.02] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/5">
            
            <div className="lg:col-span-4 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C5A059] rounded-xl flex items-center justify-center text-[#081225] font-black text-lg shadow-lg">
                  K
                </div>
                <div>
                  <span className="font-black text-xl tracking-tight block text-white leading-none">Khidma</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C5A059] block mt-1">Master Tier Platform</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm">
                Engineered for absolute operational precision and elite technical dispatch across private estates and corporate facilities in Saudi Arabia.
              </p>
              <div className="pt-2 flex items-center gap-3">
                {/* Immersive Client App Downloads */}
                <div className="px-3.5 py-2 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2.5 cursor-pointer hover:bg-white/10 hover:border-[#C5A059]/40 transition-all duration-300">
                  <Smartphone size={18} className="text-[#C5A059]" />
                  <div className="text-start">
                    <span className="text-[8px] uppercase block text-slate-400 leading-none font-bold">iOS Terminal</span>
                    <span className="text-xs font-black block leading-tight text-white">App Store</span>
                  </div>
                </div>
                <div className="px-3.5 py-2 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2.5 cursor-pointer hover:bg-white/10 hover:border-[#C5A059]/40 transition-all duration-300">
                  <Award size={18} className="text-[#10B981]" />
                  <div className="text-start">
                    <span className="text-[8px] uppercase block text-slate-400 leading-none font-bold">Android Build</span>
                    <span className="text-xs font-black block leading-tight text-white">Google Play</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 col-span-6 space-y-4 pt-1">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#C5A059] block">Operations</span>
              <ul className="space-y-2.5 text-xs font-medium text-slate-300">
                <li><Link to="/services" className="hover:text-white transition-colors block">Scope Directory</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors block">Client Provisioning</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors block">Gateway Telemetry</Link></li>
                <li><a href="#become-provider" className="hover:text-white transition-colors block">Vetted Integration</a></li>
              </ul>
            </div>

            <div className="lg:col-span-2 col-span-6 space-y-4 pt-1">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#C5A059] block">Assurance</span>
              <ul className="space-y-2.5 text-xs font-medium text-slate-300">
                <li><span className="text-slate-500 cursor-not-allowed block">Master Protocols</span></li>
                <li><span className="text-slate-500 cursor-not-allowed block">Encrypted State</span></li>
                <li><span className="text-slate-500 cursor-not-allowed block">Commission SLA (30%)</span></li>
                <li><span className="text-slate-500 cursor-not-allowed block">Anti-Tamper Layer</span></li>
              </ul>
            </div>

            {/* Elite Subscription Stream */}
            <div className="lg:col-span-4 space-y-4 pt-1">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#C5A059] block">Dispatch Telemetry</span>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Receive key infrastructure releases and seasonal capacity expansion notifications directly to your secure node.
              </p>
              <div className="flex gap-2 pt-1">
                <input
                  type="email"
                  placeholder="Enter authorized identity email"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#C5A059] font-medium"
                />
                <button 
                  type="button" 
                  onClick={() => alert('Secure node synchronized.')} 
                  className="bg-[#C5A059] text-[#081225] py-3 px-6 text-xs rounded-xl font-black uppercase tracking-wider hover:bg-white transition-colors flex-shrink-0"
                >
                  Sync
                </button>
              </div>
            </div>

          </div>

          <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
            <p>
              © {new Date().getFullYear()} Khidma Core Infrastructure Inc. State Cryptographically Enforced.
            </p>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Riyadh</span>
              <span>•</span>
              <span>Jeddah</span>
              <span>•</span>
              <span>Dammam</span>
              <span>•</span>
              <span className="text-[#C5A059] font-bold uppercase tracking-wider text-[10px]">Gulf Central Cluster</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
