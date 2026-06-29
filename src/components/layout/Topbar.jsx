import { Menu, Bell } from 'lucide-react'
import { useApi } from '../../hooks/useApi'
import { getHealth } from '../../services'

function HealthIndicator() {
  const { data, error, loading } = useApi(getHealth)
  const online = !error && data?.status === 'ok'

  let color = 'bg-amber-400'
  let label = 'Conectando…'
  if (!loading) {
    color = online ? 'bg-emerald-400' : 'bg-rose-400'
    label = online ? 'Backend conectado' : 'Backend sin conexión'
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
      <span className={`h-2 w-2 rounded-full ${color} ${online ? 'animate-pulse' : ''}`} />
      <span className="hidden text-xs font-medium text-slate-300 sm:inline">{label}</span>
    </div>
  )
}

function Topbar({ onMenu, title }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-white/10 bg-slate-950/60 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-base font-semibold text-slate-100">{title}</h1>
          <p className="hidden text-xs text-slate-400 sm:block">
            Inteligencia de marketing de influencers · TikTok
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <HealthIndicator />
        <button
          type="button"
          className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-white/10"
          aria-label="Notificaciones"
        >
          <Bell size={18} />
        </button>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-semibold text-white">
          TP
        </div>
      </div>
    </header>
  )
}

export default Topbar
