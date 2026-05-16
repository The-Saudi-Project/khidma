import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutGrid, CalendarDays, User, HeadphonesIcon,
  LogOut, Bell, ShieldAlert
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar } from './LoadingSpinner'
import LanguageToggle from './LanguageToggle'
import { useNotifications } from '../../hooks/useNotifications'
import BottomNav from './BottomNav'
import PWAInstallBanner from './PWAInstallBanner'

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: CustomerLayout
// PURPOSE: Layout shell for logged-in Customers. Contains desktop sidebar
//          and mobile BottomNav for a native app feel.
// KEY DECISIONS:
//   - Removed mobile hamburger drawer in favor of BottomNav (PWA goal)
//   - Integrated PWAInstallBanner
// ─────────────────────────────────────────────────────────────────────────────

export default function CustomerLayout() {
  const { t } = useTranslation('common')
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)
  const { unreadCount, notifications, markAllAsRead } = useNotifications()

  const nav = [
    { to: '/services', label: t('nav.services'), icon: LayoutGrid },
    { to: '/bookings', label: t('nav.bookings'), icon: CalendarDays },
    { to: '/profile', label: t('nav.profile'), icon: User },
    { to: '/support', label: t('nav.support'), icon: HeadphonesIcon },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#0B1120] flex">
      {/* Premium Floating Glass Sidebar Container (Desktop Only) */}
      <aside className="hidden lg:flex flex-col w-72 p-4 sticky top-0 h-screen flex-shrink-0">
        <div className="flex-1 bg-[#0B1120] rounded-3xl p-5 flex flex-col justify-between border border-white/10 shadow-2xl text-white relative overflow-hidden">
          {/* Subtle gold glow lighting corner */}
          <div className="absolute top-0 end-0 w-32 h-32 bg-[#22C55E]/10 rounded-full blur-2xl pointer-events-none" />

          <SidebarContent
            nav={nav}
            user={user}
            unreadCount={unreadCount}
            notifications={notifications}
            notifOpen={notifOpen}
            setNotifOpen={setNotifOpen}
            markAllAsRead={markAllAsRead}
            onLogout={handleLogout}
            isDesktop
          />
        </div>
      </aside>

      {/* Main Container Shell */}
      {/* Added pb-20 to ensure content isn't hidden behind the BottomNav on mobile */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        <header className="hidden lg:flex items-center justify-end gap-4 px-8 py-4 sticky top-0 z-30 bg-[#0B1120]/80 backdrop-blur-md">
          {/* Verified tier indicators preview */}
          <div className="flex items-center gap-2 px-3 py-1 glass rounded-2xl border border-white/5 shadow-2xl text-xs text-slate-500 font-medium me-auto">
            <ShieldAlert size={14} className="text-[#10B981]" />
            <span>Encrypted Layer</span>
          </div>

          <LanguageToggle />

          <div className="relative">
            <button
              type="button"
              onClick={() => setNotifOpen((o) => !o)}
              className="relative p-2.5 glass rounded-2xl border border-white/5 shadow-2xl hover:border-white/10 text-slate-300 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -end-1 min-w-[1.25rem] h-[1.25rem] px-1 bg-[#22C55E] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-2xl">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute end-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl border border-white/5 glass shadow-modal z-50 text-start animate-scale-in">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]/50">
                  <span className="text-xs font-bold text-white uppercase tracking-tight">Notifications</span>
                  <button type="button" className="text-xs text-[#22C55E] font-bold hover:underline" onClick={() => { markAllAsRead(); setNotifOpen(false) }}>
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
                    <li className="text-xs text-slate-400 py-8 text-center">No new notifications.</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </header>

        {/* Mobile Header - Minimalist */}
        <header className="lg:hidden sticky top-0 z-30 bg-white/5 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#22C55E] rounded-lg flex items-center justify-center font-extrabold text-white">K</div>
            <span className="font-extrabold text-white text-lg tracking-tight">Khidma</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/profile')} // Map bell to profile/notifications on mobile
              className="relative p-2 text-slate-300"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#22C55E] rounded-full" />
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
      <BottomNav role="customer" />
      <PWAInstallBanner />
    </div>
  )
}

function SidebarContent({ nav, user, onLogout }) {
  const { t } = useTranslation('common')
  
  return (
    <div className="flex flex-col h-full py-4">
      <div className="px-2 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <span className="text-[#0B1120] font-black text-xl tracking-tight">K</span>
          </div>
          <div>
            <span className="text-white font-extrabold text-xl tracking-tight block leading-none">Khidma</span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-500 block mt-1 opacity-90">Patron Portal</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
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
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-2xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut size={16} />
          <span>{t('actions.logout')}</span>
        </button>
      </div>
    </div>
  )
}
