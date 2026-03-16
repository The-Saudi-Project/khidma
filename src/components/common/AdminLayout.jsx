import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, CalendarDays, Settings, Users,
  CreditCard, DollarSign, HeadphonesIcon, FileText, LogOut, Menu, X, ShieldCheck
} from 'lucide-react'
import { useState } from 'react'
import { Avatar } from './LoadingSpinner'

const NAV = [
  { to: '/admin',          label: 'Dashboard',  icon: LayoutDashboard, end: true },
  { to: '/admin/bookings', label: 'Bookings',   icon: CalendarDays },
  { to: '/admin/payments', label: 'Payments',   icon: CreditCard },
  { to: '/admin/payouts',  label: 'Payouts',    icon: DollarSign },
  { to: '/admin/services', label: 'Services',   icon: Settings },
  { to: '/admin/users',    label: 'Users',      icon: Users },
  { to: '/admin/support',  label: 'Support',    icon: HeadphonesIcon },
  { to: '/admin/audit',    label: 'Audit Log',  icon: ShieldCheck },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const SidebarContent = ({ onClose }) => (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-8 px-2 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">Khidma</span>
            <span className="ml-2 text-xs bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">Admin</span>
          </div>
        </div>
        {onClose && <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={18} /></button>}
      </div>

      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Icon size={17} /><span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar name={user?.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-link w-full mt-1 text-red-500 hover:bg-red-50 hover:text-red-600">
          <LogOut size={16} /><span>Log out</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-surface-50 flex">
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-slate-100 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white z-10">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-xl hover:bg-slate-100"><Menu size={20} /></button>
          <span className="font-bold text-slate-900 text-lg">Admin</span>
        </header>
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto"><Outlet /></main>
      </div>
    </div>
  )
}
