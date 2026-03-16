import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Briefcase, DollarSign, User, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Avatar } from './LoadingSpinner'

const NAV = [
  { to: '/provider',          label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/provider/jobs',     label: 'My Jobs',   icon: Briefcase },
  { to: '/provider/earnings', label: 'Earnings',  icon: DollarSign },
  { to: '/provider/profile',  label: 'Profile',   icon: User },
]

export default function ProviderLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const SidebarContent = ({ onClose }) => (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-8 px-2 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">Khidma</span>
            <span className="ml-2 text-xs bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded font-medium">Provider</span>
          </div>
        </div>
        {onClose && <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={18} /></button>}
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Icon size={18} /><span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar name={user?.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs text-slate-400">Provider</p>
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
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 sticky top-0 h-screen">
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
          <span className="font-bold text-brand-700 text-lg">Khidma</span>
        </header>
        <main className="flex-1 p-4 lg:p-8 max-w-6xl w-full mx-auto"><Outlet /></main>
      </div>
    </div>
  )
}
