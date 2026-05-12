import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Briefcase, DollarSign, User,
  LogOut, Menu, X, Bell, ShieldCheck, Zap
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar } from './LoadingSpinner'
import LanguageToggle from './LanguageToggle'
import { useNotifications } from '../../hooks/useNotifications'

export default function ProviderLayout() {
  const { t } = useTranslation('common')
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const { unreadCount, notifications, markAllAsRead } = useNotifications()

  const NAV = [
    { to: '/provider', label: t('nav.dashboard'), icon: LayoutDashboard, end: true },
    { to: '/provider/jobs', label: t('nav.jobs'), icon: Briefcase },
    { to: '/provider/earnings', label: t('nav.earnings'), icon: DollarSign },
    { to: '/provider/profile', label: t('nav.profile'), icon: User },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const SidebarContent = ({ onClose, isDesktop }) => (
    <div className="flex flex-col h-full">
      {/* Upper Brand Badge area */}
      <div>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#10B981] rounded-xl flex items-center justify-center text-[#081225] font-black text-base shadow-sm">
              K
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight block leading-none">{t('appName')}</span>
              <span className="text-[9px] font-mono tracking-widest uppercase text-[#10B981] block mt-0.5">Talent Fleet</span>
            </div>
          </div>
          
          {onClose && (
            <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Live matching beacon simulator inside workspace shell */}
        <div className="mb-4 bg-gradient-to-r from-[#10B981]/10 to-transparent rounded-xl p-3 border border-[#10B981]/20 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-ping flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider">Geofence Listening</p>
            <p className="text-xs text-slate-300 truncate">SLA dispatch active</p>
          </div>
        </div>

        {/* Dynamic navigation matrix */}
        <nav className="flex flex-col gap-1.5">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#10B981] text-[#081225] shadow-sm font-black tracking-wide'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Embedded footer operations dashboard telemetry */}
      <div className="pt-4 border-t border-white/10 space-y-2 mt-auto">
        {!isDesktop && (
          <div className="relative mb-2">
            <button type="button" onClick={() => setNotifOpen((o) => !o)}
              className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
              <span className="flex items-center gap-3">
                <Bell size={16} />
                Dispatches
              </span>
              {unreadCount > 0 && (
                <span className="bg-[#10B981] text-[#081225] text-[10px] font-black rounded-full px-1.5 py-0.5">
                  {unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="mt-2 rounded-xl bg-white/5 border border-white/10 p-2 text-start">
                <button type="button" className="text-[10px] text-[#10B981] font-bold block mb-2" onClick={() => { markAllAsRead(); setNotifOpen(false) }}>
                  {t('actions.markAllRead')}
                </button>
                {notifications.slice(0, 3).map((n) => (
                  <p key={n._id} className="text-[11px] text-slate-300 py-1 border-b border-white/5 last:border-0 truncate">{n.title}</p>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/5">
          <Avatar name={user?.name || 'Talent User'} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate flex items-center gap-1">
              <span>{user?.name || 'Verified Tech'}</span>
              <ShieldCheck size={12} className="text-[#10B981] flex-shrink-0" />
            </p>
            <p className="text-[10px] text-[#C5A059] font-mono truncate">Tier-1 Cleared</p>
          </div>
        </div>

        <button type="button" onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
          <LogOut size={16} />
          <span>{t('actions.logout')}</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Floating Navy shell wrapper tailored for premium feel */}
      <aside className="hidden lg:flex flex-col w-72 p-4 sticky top-0 h-screen flex-shrink-0">
        <div className="flex-1 bg-[#081225] rounded-3xl p-5 flex flex-col justify-between border border-white/10 shadow-glass text-white relative overflow-hidden">
          {/* Green highlight abstract lighting bloom */}
          <div className="absolute top-0 end-0 w-32 h-32 bg-[#10B981]/10 rounded-full blur-2xl pointer-events-none" />

          <SidebarContent isDesktop />
        </div>
      </aside>

      {/* Mobile Drawer wrapper */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute start-0 top-0 bottom-0 w-72 bg-[#081225] text-white p-5 z-10 flex flex-col justify-between">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Principal layout pipeline */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden lg:flex items-center justify-end gap-4 px-8 py-4 sticky top-0 z-30 bg-surface-50/80 backdrop-blur-md">
          {/* Signal active state preview badge */}
          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-xl border border-slate-100 shadow-sm text-xs text-slate-500 font-medium me-auto">
            <Zap size={14} className="text-[#C5A059]" />
            <span>Telemetry Channel Active</span>
          </div>

          <LanguageToggle />
          
          <div className="relative">
            <button type="button" onClick={() => setNotifOpen((o) => !o)}
              className="relative p-2.5 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-slate-200 text-slate-700 transition-colors"
              aria-label="Notifications">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -end-1 min-w-[1.25rem] h-[1.25rem] px-1 bg-[#10B981] text-[#081225] text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute end-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-modal z-50 text-start animate-scale-in">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Fleet Tasks</span>
                  <button type="button" className="text-xs text-[#10B981] font-bold hover:underline" onClick={() => { markAllAsRead(); setNotifOpen(false) }}>
                    {t('actions.markAllRead')}
                  </button>
                </div>
                <ul className="divide-y divide-slate-50">
                  {notifications.slice(0, 5).map((n) => (
                    <li key={n._id} className="p-3 hover:bg-slate-50/80 transition-colors">
                      <p className="text-xs font-bold text-slate-900">{n.title}</p>
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

        {/* Mobile top structural header */}
        <header className="lg:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center gap-3">
          <button type="button" onClick={() => setMobileOpen(true)} className="p-2 bg-slate-50 rounded-xl text-slate-700">
            <Menu size={20} />
          </button>
          <span className="font-extrabold text-[#081225] text-lg flex-1 tracking-tight">Khidma Fleet</span>
          <LanguageToggle />
        </header>

        <main className="flex-1 p-4 lg:px-8 lg:py-4 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
