import { AlertTriangle, RefreshCw, Inbox } from 'lucide-react'
import Spinner from './Spinner'

export function LoadingState({ label = 'Cargando datos…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
      <Spinner size={28} />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function ErrorState({ error, onRetry }) {
  const message = typeof error === 'string' ? error : error?.message
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/5 py-12 px-6 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-rose-500/15 text-rose-300">
        <AlertTriangle size={22} />
      </span>
      <div>
        <p className="text-sm font-semibold text-rose-200">Ocurrió un error</p>
        <p className="mt-1 max-w-md text-xs text-rose-200/70">
          {message || 'No se pudieron cargar los datos.'}
        </p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 inline-flex items-center gap-2 rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-100 hover:bg-rose-500/20"
        >
          <RefreshCw size={14} /> Reintentar
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title = 'Sin resultados', message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center text-slate-400">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-white/5 text-slate-300">
        <Inbox size={22} />
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-200">{title}</p>
        {message && <p className="mt-1 max-w-md text-xs text-slate-400">{message}</p>}
      </div>
    </div>
  )
}
