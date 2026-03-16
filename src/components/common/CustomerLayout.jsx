import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutGrid, CalendarDays, User, HeadphonesIcon,
  LogOut, Bell, ChevronDown, Menu, X
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Avatar } from './LoadingSpinner'
import { notificationsAPI } from '../../api'
import { useQuery } from '@tanstack/react-query'

const NAV = [
  { to: '/services',  label: 'Services',  icon: LayoutGrid },
  { to: '/bookings',  label: 'My Bookings', icon: CalendarDays },
  { to: '/profile',   label: 'Profile',   icon: User },
  { to: '/support',   label: 'Support',   icon: HeadphonesIcon },
]

export default function CustomerLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const { data: notifData } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationsAPI.getNotifications({ unreadOnly: true, limit: 5 }),
    refetchInterval: 30000,
    select: d => d.data.data
  })
  const unreadCount = notifData?.unreadCount || 0

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 sticky top-0 h-screen">
        <SidebarContent nav={NAV} user={user} unreadCount={unreadCount} onLogout={handleLogout} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white z-10">
            <SidebarContent nav={NAV} user={user} unreadCount={unreadCount} onLogout={handleLogout} onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-xl hover:bg-slate-100">
            <Menu size={20} />
          </button>
          <span className="font-bold text-brand-700 text-lg">Khidma</span>
        </header>

        <main className="flex-1 p-4 lg:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ nav, user, unreadCount, onLogout, onClose }) {
  return (
    <div className="flex flex-col h-full p-4">
      {/* Logo */}
      <div className="flex items-center justify-between mb-8 px-2 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">Khidma</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
            {label === 'Notifications' && unreadCount > 0 && (
              <span className="ml-auto bg-brand-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar name={user?.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={onLogout} className="sidebar-link w-full mt-1 text-red-500 hover:bg-red-50 hover:text-red-600">
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  )
}
