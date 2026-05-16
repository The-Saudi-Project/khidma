import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, CalendarDays, Settings, Users,
  CreditCard, DollarSign, HeadphonesIcon, LogOut,
  ShieldCheck, UserPlus, Zap, Crown, User
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LanguageToggle from './LanguageToggle'
import { Avatar } from './LoadingSpinner'
import BottomNav from './BottomNav'
import PWAInstallBanner from './PWAInstallBanner'

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: AdminLayout
// PURPOSE: Layout shell for logged-in Administrators. Features purple/gold tier.
// KEY DECISIONS:
//   - Removed mobile hamburger drawer in favor of BottomNav (PWA goal)
//   - Integrated PWAInstallBanner
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminLayout() {
  const { t } = useTranslation('common')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#0B1120] flex">
      {/* Floating Navy shell wrapper tailored for supreme administrative presence */}
      <aside className="hidden lg:flex flex-col w-72 p-4 sticky top-0 h-screen flex-shrink-0">
        <div className="flex-1 bg-[#0B1120] rounded-3xl p-5 flex flex-col justify-between border border-white/10 shadow-2xl text-white relative overflow-hidden">
          {/* Subtle purple/gold backstop bloom */}
          <div className="absolute top-0 end-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full blur-2xl pointer-events-none" />

          <SidebarContent user={user} onLogout={handleLogout} />
        </div>
      </aside>

      {/* Principal workspace viewport */}
      {/* Added pb-20 to ensure content isn't hidden behind the BottomNav on mobile */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        <header className="hidden lg:flex items-center justify-end gap-4 px-8 py-4 sticky top-0 z-30 bg-[#0B1120]/80 backdrop-blur-md">
          {/* Signal status verification text */}
          <div className="flex items-center gap-2 px-3 py-1 glass rounded-2xl border border-white/5 shadow-2xl text-xs text-slate-500 font-medium me-auto">
            <Zap size={14} className="text-[#8B5CF6]" />
            <span>Encrypted Administration Array Active</span>
          </div>

          <LanguageToggle />
        </header>

        {/* Mobile top structural header - Minimalist */}
        <header className="lg:hidden sticky top-0 z-30 bg-white/5 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#8B5CF6] rounded-lg flex items-center justify-center font-extrabold text-white">
              <Crown size={16} />
            </div>
            <span className="font-extrabold text-white text-lg tracking-tight">Khidma Admin</span>
          </div>
          
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-red-500 hover:text-red-600 transition-colors"
              aria-label="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:px-8 lg:py-4 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Native App Elements */}
      <BottomNav role="admin" />
      <PWAInstallBanner />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: SidebarContent
// PURPOSE: Reusable sidebar logic (now exclusive to desktop view)
// ─────────────────────────────────────────────────────────────────────────────
function SidebarContent({ user, onLogout }) {
  const { t } = useTranslation('common')
  
  const NAV = [
    { to: '/admin', label: t('nav.dashboard'), icon: LayoutDashboard, end: true },
    { to: '/admin/bookings', label: t('nav.adminBookings'), icon: CalendarDays },
    { to: '/admin/services', label: t('nav.adminServices'), icon: Settings },
    { to: '/admin/users', label: t('nav.users'), icon: Users },
    { to: '/admin/provider-applications', label: t('nav.applications'), icon: UserPlus },
    { to: '/admin/payments', label: t('nav.payments'), icon: CreditCard },
    { to: '/admin/payouts', label: t('nav.payouts'), icon: DollarSign },
    { to: '/admin/support', label: t('nav.support'), icon: HeadphonesIcon },
    { to: '/admin/audit', label: 'Audit Logs', icon: ShieldCheck },
  ]

  return (
    <div className="flex flex-col h-full bg-[#0B1120] border-e border-white/5 p-6 glass">
      {/* Brand High Tier Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
            <ShieldCheck className="text-brand-500" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter">KHIDMA</h1>
            <div className="text-[10px] font-bold text-brand-500 uppercase tracking-widest leading-none">ADMIN PORTAL</div>
          </div>
        </div>
      </div>

      {/* Primary Navigation Array */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-2">
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `
              flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200
              ${isActive 
                ? 'bg-brand-500 text-[#0B1120] shadow-[0_8px_20px_rgba(34,197,94,0.3)]' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/5'
              }
            `}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Root User Profile Partition */}
      <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
        <div className="px-4 py-3 glass rounded-2xl border border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
            <User size={18} className="text-brand-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold text-white truncate">{user?.name}</div>
            <div className="text-[10px] text-slate-500 font-medium truncate">{user?.email}</div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <LogOut size={20} />
          <span>{t('actions.logout')}</span>
        </button>
      </div>
    </div>
  )
}

