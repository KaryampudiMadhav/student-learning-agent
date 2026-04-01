import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, Bot, Gauge, Home, LogOut, Menu, Rocket, Workflow, BookOpen, TrendingUp } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { ParticlesBackground } from '../background/ParticlesBackground'
import { AIMentorWidget } from '../chat/AIMentorWidget'

void motion

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/workflow', label: 'Workflow', icon: Workflow },
  { to: '/learning', label: 'Learning', icon: BookOpen },
  { to: '/history', label: 'History', icon: TrendingUp },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/agents', label: 'Agent Logs', icon: Bot },
  { to: '/evaluation', label: 'Evaluation', icon: Gauge },
]

export function AppLayout({ children }) {
  const navigate = useNavigate()
  const { user, logout, ui, toggleSidebar, closeSidebar } = useAppStore()

  const onLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="relative min-h-screen text-slate-100">
      <ParticlesBackground />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.16),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.12),transparent_35%),linear-gradient(180deg,#020617_0%,#020617_35%,#030712_100%)]" />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
          <Link to="/dashboard" className="flex items-center gap-2 text-lg font-semibold tracking-wide text-cyan-300">
            <Rocket className="h-5 w-5" />
            Neural Learning OS
          </Link>
          <div className="hidden items-center gap-3 md:flex">
            <span className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
              {user?.email || 'Guest'}
            </span>
            <button onClick={onLogout} className="rounded-lg border border-rose-300/30 px-3 py-1.5 text-sm text-rose-200 hover:bg-rose-500/10">
              Logout
            </button>
          </div>
          <button className="md:hidden" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="flex w-full items-start">
        <aside className={`fixed bottom-0 left-0 top-16 z-40 w-64 border-r border-white/10 bg-slate-950/95 p-4 backdrop-blur-xl transition-transform md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0 md:rounded-none md:border-y-0 md:border-l-0 ${ui.sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="mb-4 flex items-center justify-between md:hidden">
            <span className="text-sm text-cyan-300">Menu</span>
            <button onClick={closeSidebar}>
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${isActive ? 'bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-300/30' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
        </aside>

        <motion.div layout className="min-w-0 flex-1 px-4 pt-5 sm:px-6 lg:px-10">{children}</motion.div>
      </div>

      <AIMentorWidget />
    </div>
  )
}
