import { NavLink } from 'react-router-dom'
import { Home, Briefcase, Calendar, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function BottomNav() {
  const { user } = useAuth()

  // Define nav items based on role
  let navItems = []

  if (user?.role === 'admin') {
    navItems = [
      { to: '/admin', icon: Home, label: 'Dashboard' },
      { to: '/admin/users', icon: User, label: 'Users' },
      { to: '/admin/settings', icon: Briefcase, label: 'Settings' },
    ]
  } else if (user?.role === 'provider') {
    navItems = [
      { to: '/provider', icon: Home, label: 'Home', end: true },
      { to: '/provider/jobs', icon: Briefcase, label: 'Jobs' },
      { to: '/provider/earnings', icon: Calendar, label: 'Earnings' },
      { to: '/provider/profile', icon: User, label: 'Profile' },
    ]
  } else {
    // Customer
    navItems = [
      { to: '/services', icon: Home, label: 'Home', end: true },
      { to: '/bookings', icon: Calendar, label: 'Bookings' },
      { to: '/profile', icon: User, label: 'Profile' },
    ]
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/10 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-16 h-12 transition-colors ${
                isActive
                  ? 'text-[#22C55E]'
                  : 'text-slate-400 hover:text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={24}
                  className={`mb-1 transition-all ${
                    isActive ? 'scale-110 fill-[#22C55E]/10' : ''
                  }`}
                />
                <span
                  className={`text-[10px] font-bold ${
                    isActive ? 'text-[#22C55E]' : 'text-slate-500'
                  }`}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
