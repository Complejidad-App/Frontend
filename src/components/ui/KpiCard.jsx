import Card from './Card'

function KpiCard({ icon: Icon, label, value, hint, accent = 'violet' }) {
  const accents = {
    violet: 'from-violet-500/20 to-violet-500/5 text-violet-300 ring-violet-500/30',
    indigo: 'from-indigo-500/20 to-indigo-500/5 text-indigo-300 ring-indigo-500/30',
    cyan: 'from-cyan-500/20 to-cyan-500/5 text-cyan-300 ring-cyan-500/30',
    emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-300 ring-emerald-500/30',
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-start justify-between p-5">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-50">{value}</p>
          {hint && <p className="mt-1 truncate text-xs text-slate-400">{hint}</p>}
        </div>
        {Icon && (
          <span
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ring-1 ${accents[accent]}`}
          >
            <Icon size={20} />
          </span>
        )}
      </div>
    </Card>
  )
}

export default KpiCard
