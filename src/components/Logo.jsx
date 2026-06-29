import { Activity } from 'lucide-react'

function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-900/40">
        <Activity size={20} className="text-white" strokeWidth={2.5} />
      </span>
      {!compact && (
        <span className="text-lg font-bold tracking-tight text-slate-50">
          Trend<span className="text-violet-400">Pulse</span>
        </span>
      )}
    </div>
  )
}

export default Logo
