import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutGrid, CalendarDays, User, HeadphonesIcon,
  LogOut, Bell, Menu, X, ShieldAlert
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar } from './LoadingSpinner'
import LanguageToggle from './LanguageToggle'
import { useNotifications } from '../../hooks/useNotifications'

export default function CustomerLayout() {
  const { t } = useTranslation('common')
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
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
    <div className="min-h-screen bg-surface-50 flex">
      {/* Premium Floating Glass Sidebar Container */}
      <aside className="hidden lg:flex flex-col w-72 p-4 sticky top-0 h-screen flex-shrink-0">
        <div className="flex-1 bg-[#081225] rounded-3xl p-5 flex flex-col justify-between border border-white/10 shadow-glass text-white relative overflow-hidden">
          {/* Subtle gold glow lighting corner */}
          <div className="absolute top-0 end-0 w-32 h-32 bg-[#C5A059]/10 rounded-full blur-2xl pointer-events-none" />

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

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute start-0 top-0 bottom-0 w-72 bg-[#081225] text-white p-5 z-10 flex flex-col justify-between">
            <SidebarContent
              nav={nav}
              user={user}
              unreadCount={unreadCount}
              notifications={notifications}
              notifOpen={notifOpen}
              setNotifOpen={setNotifOpen}
              markAllAsRead={markAllAsRead}
              onLogout={handleLogout}
              onClose={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main Container Shell */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden lg:flex items-center justify-end gap-4 px-8 py-4 sticky top-0 z-30 bg-surface-50/80 backdrop-blur-md">
          {/* Verified tier indicators preview */}
          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-xl border border-slate-100 shadow-sm text-xs text-slate-500 font-medium me-auto">
            <ShieldAlert size={14} className="text-[#10B981]" />
            <span>Encrypted Layer</span>
          </div>

          <LanguageToggle />

          <div className="relative">
            <button
              type="button"
              onClick={() => setNotifOpen((o) => !o)}
              className="relative p-2.5 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-slate-200 text-slate-700 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -end-1 min-w-[1.25rem] h-[1.25rem] px-1 bg-[#C5A059] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute end-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-modal z-50 text-start animate-scale-in">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Notifications</span>
                  <button type="button" className="text-xs text-[#C5A059] font-bold hover:underline" onClick={() => { markAllAsRead(); setNotifOpen(false) }}>
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
                    <li className="text-xs text-slate-400 py-8 text-center">Terminal quiet — zero unread dispatches.</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </header>

        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center gap-3">
          <button type="button" onClick={() => setMobileOpen(true)} className="p-2 bg-slate-50 rounded-xl text-slate-700">
            <Menu size={20} />
          </button>
          <span className="font-extrabold text-[#081225] text-lg flex-1 tracking-tight">Khidma</span>
          <LanguageToggle />
        </header>

        <main className="flex-1 p-4 lg:px-8 lg:py-4 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function SidebarContent({
  nav, user, unreadCount, notifications, notifOpen, setNotifOpen, markAllAsRead, onLogout, onClose, isDesktop
}) {
  const { t } = useTranslation('common')
  return (
    <div className="flex flex-col h-full">
      {/* Top Brand Identity */}
      <div>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C5A059] rounded-xl flex items-center justify-center text-[#081225] font-black text-base shadow-sm">
              K
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight block leading-none">{t('appName')}</span>
              <span className="text-[9px] font-bold tracking-widest uppercase text-[#C5A059] block mt-0.5">Patron Shell</span>
            </div>
          </div>
          
          {onClose && (
            <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation list tailored with transparent white hover states */}
        <nav className="flex flex-col gap-1.5">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#C5A059] text-[#081225] shadow-sm'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Profile & Exit actions inside Navy container */}
      <div className="pt-4 border-t border-white/10 space-y-2 mt-auto">
        {!isDesktop && (
          <div className="relative mb-2">
            <button
              type="button"
              onClick={() => setNotifOpen((o) => !o)}
              className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-3">
                <Bell size={16} />
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="bg-[#C5A059] text-[#081225] text-[10px] font-black rounded-full px-1.5 py-0.5">
                  {unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="mt-2 rounded-xl bg-white/5 border border-white/10 p-2 text-start">
                <button type="button" className="text-[10px] text-[#C5A059] font-bold block mb-2" onClick={() => { markAllAsRead(); setNotifOpen(false) }}>
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
          <Avatar name={user?.name || 'Patron User'} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Valued Patron'}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email || 'Premium tier'}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut size={16} />
          <span>{t('actions.logout')}</span>
        </button>
      </div>
    </div>
  )
}
