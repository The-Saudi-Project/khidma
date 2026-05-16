import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Briefcase, DollarSign, User,
  LogOut, Bell, ShieldCheck, Zap
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar } from './LoadingSpinner'
import LanguageToggle from './LanguageToggle'
import { useNotifications } from '../../hooks/useNotifications'
import BottomNav from './BottomNav'
import PWAInstallBanner from './PWAInstallBanner'

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: ProviderLayout
// PURPOSE: Layout shell for logged-in Providers. Features a green accent theme.
// KEY DECISIONS:
//   - Removed mobile hamburger drawer in favor of BottomNav (PWA goal)
//   - Integrated PWAInstallBanner
//   - Added UI for "Status: Available/Offline" as requested
// ─────────────────────────────────────────────────────────────────────────────

export default function ProviderLayout() {
  const { t } = useTranslation('common')
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)
  const { unreadCount, notifications, markAllAsRead } = useNotifications()

  // TODO: Connect to backend PATCH /api/provider/availability
  const [isAvailable, setIsAvailable] = useState(() => {
    return localStorage.getItem('khidma_provider_status') !== 'offline'
  })

  const toggleAvailability = () => {
    const newState = !isAvailable
    setIsAvailable(newState)
    localStorage.setItem('khidma_provider_status', newState ? 'available' : 'offline')
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#0B1120] flex">
      {/* Floating Navy shell wrapper tailored for premium feel (Desktop) */}
      <aside className="hidden lg:flex flex-col w-72 p-4 sticky top-0 h-screen flex-shrink-0">
        <div className="flex-1 bg-[#0B1120] rounded-3xl p-5 flex flex-col justify-between border border-white/10 shadow-2xl text-white relative overflow-hidden">
          {/* Green highlight abstract lighting bloom */}
          <div className="absolute top-0 end-0 w-32 h-32 bg-[#10B981]/10 rounded-full blur-2xl pointer-events-none" />

          <SidebarContent 
            user={user}
            onLogout={handleLogout}
            isAvailable={isAvailable}
            toggleAvailability={toggleAvailability}
          />
        </div>
      </aside>

      {/* Principal layout pipeline */}
      {/* Added pb-20 to ensure content isn't hidden behind the BottomNav on mobile */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        <header className="hidden lg:flex items-center justify-end gap-4 px-8 py-4 sticky top-0 z-30 bg-[#0B1120]/80 backdrop-blur-md">
          {/* Signal active state preview badge */}
          <div className="flex items-center gap-2 px-3 py-1 glass rounded-2xl border border-white/5 shadow-2xl text-xs text-slate-500 font-medium me-auto">
            <Zap size={14} className="text-[#10B981]" />
            <span>Notifications</span>
          </div>

          <LanguageToggle />
          
          <div className="relative">
            <button type="button" onClick={() => setNotifOpen((o) => !o)}
              className="relative p-2.5 glass rounded-2xl border border-white/5 shadow-2xl hover:border-white/10 text-slate-300 transition-colors"
              aria-label="Notifications">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -end-1 min-w-[1.25rem] h-[1.25rem] px-1 bg-[#10B981] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-2xl">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute end-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl border border-white/5 glass shadow-modal z-50 text-start animate-scale-in">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]/50">
                  <span className="text-xs font-bold text-white uppercase tracking-tight">Fleet Tasks</span>
                  <button type="button" className="text-xs text-[#10B981] font-bold hover:underline" onClick={() => { markAllAsRead(); setNotifOpen(false) }}>
                    {t('actions.markAllRead')}
                  </button>
                </div>
                <ul className="divide-y divide-white/[0.05]">
                  {notifications.slice(0, 5).map((n) => (
                    <li key={n._id} className="p-3 hover:bg-white/[0.02]/80 transition-colors">
                      <p className="text-xs font-bold text-white">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                    </li>
                  ))}
                  {!notifications.length && (
                    <li className="text-xs text-slate-400 py-8 text-center">Zero incoming job alerts.</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </header>

        {/* Mobile top structural header - Minimalist */}
        <header className="lg:hidden sticky top-0 z-30 bg-white/5 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center font-extrabold text-white">K</div>
            <span className="font-extrabold text-white text-lg tracking-tight">Khidma Fleet</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/provider/profile')} // Map bell to profile on mobile
              className="relative p-2 text-slate-300"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#10B981] rounded-full" />
              )}
            </button>
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

        <main className="flex-1 p-4 lg:px-8 lg:py-4 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Native App Elements */}
      <BottomNav role="provider" />
      <PWAInstallBanner />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: SidebarContent
// PURPOSE: Reusable sidebar logic (now exclusive to desktop view)
// ─────────────────────────────────────────────────────────────────────────────
function SidebarContent({ user, onLogout, isAvailable, toggleAvailability }) {
  const { t } = useTranslation('common')
  
  const NAV = [
    { to: '/provider', label: t('nav.dashboard'), icon: LayoutDashboard, end: true },
    { to: '/provider/jobs', label: t('nav.jobs'), icon: Briefcase },
    { to: '/provider/earnings', label: t('nav.earnings'), icon: DollarSign },
    { to: '/provider/profile', label: t('nav.profile'), icon: User },
  ]

  return (
    <div className="flex flex-col h-full py-4">
      <div className="px-2 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <Briefcase size={20} className="text-[#0B1120]" />
          </div>
          <div>
            <span className="text-white font-extrabold text-xl tracking-tight block leading-none">Khidma</span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-500 block mt-1 opacity-90">Professional</span>
          </div>
        </div>
      </div>

      <div className="px-2 mb-8">
        <button 
          onClick={toggleAvailability}
          className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${
            isAvailable 
            ? 'bg-brand-500/10 border-brand-500/30' 
            : 'bg-white/5 border-white/10 opacity-60'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-brand-500 animate-pulse' : 'glass0'}`} />
            <span className={`text-xs font-bold uppercase tracking-widest ${isAvailable ? 'text-brand-400' : 'text-slate-400'}`}>
              {isAvailable ? 'Status: Active' : 'Status: Offline'}
            </span>
          </div>
          <div className={`w-10 h-5 rounded-full relative transition-colors ${isAvailable ? 'bg-brand-500' : 'bg-slate-700'}`}>
            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isAvailable ? 'left-6' : 'left-1'}`} />
          </div>
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `sidebar-link flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${isActive ? 'bg-brand-500 text-[#0B1120] shadow-[0_8px_20px_rgba(34,197,94,0.3)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`
            }
          >
            <item.icon size={20} />
            <span className="flex-1">{item.label}</span>
          </NavLink>
        ))}
      </nav>

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

