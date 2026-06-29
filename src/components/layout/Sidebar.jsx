import { NavLink } from 'react-router-dom'
import { LayoutDashboard, UserSearch, Sparkles, Share2, X } from 'lucide-react'
import Logo from '../Logo'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/analizador', label: 'Analizador de Cuentas', icon: UserSearch },
  { to: '/recomendador', label: 'Recomendador', icon: Sparkles },
  { to: '/red', label: 'Red de Influencia', icon: Share2 },
]

function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay para móvil */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-white/10 bg-slate-950/80 backdrop-blur-xl transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 lg:hidden"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Plataforma
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-500/20 to-indigo-500/10 text-violet-100 ring-1 ring-violet-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/5 p-4">
          <div className="rounded-xl bg-gradient-to-br from-violet-500/15 to-indigo-500/5 p-4 ring-1 ring-violet-500/20">
            <p className="text-xs font-semibold text-violet-100">TrendPulse Analytics</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
              Decisiones de marketing de influencers en TikTok basadas en datos.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
