const variants = {
  violet: 'bg-violet-500/15 text-violet-200 ring-violet-500/30',
  cyan: 'bg-cyan-500/15 text-cyan-200 ring-cyan-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-200 ring-emerald-500/30',
  amber: 'bg-amber-500/15 text-amber-200 ring-amber-500/30',
  slate: 'bg-white/5 text-slate-300 ring-white/10',
  rose: 'bg-rose-500/15 text-rose-200 ring-rose-500/30',
}

function Badge({ children, variant = 'slate', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

export default Badge
