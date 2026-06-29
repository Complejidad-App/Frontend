import { useMemo, useState } from 'react'
import {
  Sparkles,
  Users,
  Target,
  DollarSign,
  TrendingUp,
  Crown,
} from 'lucide-react'
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'
import Card, { CardBody, CardHeader } from '../components/ui/Card'
import KpiCard from '../components/ui/KpiCard'
import Badge from '../components/ui/Badge'
import { LoadingState, ErrorState } from '../components/ui/StateViews'
import { useApi } from '../hooks/useApi'
import { getInfluenceMaximization } from '../services'
import { buildCreatorMetrics, formatCompact, formatCurrency } from '../utils/metrics'

const TOP_N = 60

function Recommender() {
  const [budget, setBudget] = useState(5)
  const [appliedBudget, setAppliedBudget] = useState(5)

  const { data, loading, error, run } = useApi(
    () => getInfluenceMaximization({ k: appliedBudget, topN: TOP_N }),
    { deps: [appliedBudget] },
  )

  const derived = useMemo(() => {
    if (!data) return null
    const maxInDegree = Math.max(...data.nodes.map((n) => n.in_degree), 1)
    const nodeById = new Map(data.nodes.map((n) => [n.id, n]))

    const ranking = data.steps.map((step) => {
      const node = nodeById.get(step.node)
      const metrics = buildCreatorMetrics(node ?? { id: step.node, in_degree: 0 }, maxInDegree)
      return { ...metrics, ...step }
    })

    const chart = data.steps.map((s) => ({
      step: `#${s.step}`,
      marginal: s.marginal_gain,
      cumulative: s.cumulative_coverage,
    }))

    const totalBudget = ranking.reduce((sum, r) => sum + r.costPerPost, 0)

    return { ranking, chart, totalBudget, stats: data.stats }
  }, [data])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-50">Recomendador Inteligente</h2>
        <p className="text-sm text-slate-400">
          Define tu presupuesto (cantidad de creadores a contratar) y obtén el conjunto que
          maximiza el alcance total de tu campaña.
        </p>
      </div>

      <Card>
        <CardBody>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="budget" className="text-sm font-medium text-slate-300">
                  Presupuesto: creadores a contratar
                </label>
                <span className="rounded-lg bg-violet-500/15 px-3 py-1 text-sm font-bold text-violet-200">
                  {budget}
                </span>
              </div>
              <input
                id="budget"
                type="range"
                min={1}
                max={20}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-violet-500"
              />
              <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                <span>1</span>
                <span>20</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAppliedBudget(budget)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition-opacity hover:opacity-90"
            >
              <Sparkles size={16} /> Recomendar
            </button>
          </div>
        </CardBody>
      </Card>

      {loading && (
        <Card>
          <CardBody>
            <LoadingState label="Optimizando selección de creadores…" />
          </CardBody>
        </Card>
      )}

      {error && <ErrorState error={error} onRetry={run} />}

      {!loading && !error && derived && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              icon={Users}
              label="Creadores seleccionados"
              value={derived.stats.k}
              hint={`de ${derived.stats.top_n} candidatos`}
              accent="violet"
            />
            <KpiCard
              icon={Target}
              label="Audiencia cubierta"
              value={formatCompact(derived.stats.total_covered)}
              hint={`${derived.stats.coverage_pct.toFixed(0)}% de la red`}
              accent="emerald"
            />
            <KpiCard
              icon={TrendingUp}
              label="Cobertura"
              value={`${derived.stats.coverage_pct.toFixed(0)}%`}
              hint="del total analizado"
              accent="cyan"
            />
            <KpiCard
              icon={DollarSign}
              label="Presupuesto estimado"
              value={formatCurrency(derived.totalBudget)}
              hint="suma de costos/post"
              accent="indigo"
            />
          </div>

          <Card>
            <CardHeader
              title="Retornos decrecientes"
              subtitle="Cada creador adicional aporta menos audiencia nueva (ganancia marginal)"
            />
            <CardBody>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={derived.chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                    <XAxis dataKey="step" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        background: '#0f172a',
                        border: '1px solid rgba(148,163,184,0.2)',
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar
                      dataKey="marginal"
                      name="Ganancia marginal"
                      fill="#8b5cf6"
                      radius={[6, 6, 0, 0]}
                    />
                    <Line
                      type="monotone"
                      dataKey="cumulative"
                      name="Cobertura acumulada"
                      stroke="#34d399"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#34d399' }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Creadores recomendados"
              subtitle="Ordenados por el orden de selección del algoritmo voraz"
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-5 py-3 font-medium">#</th>
                    <th className="px-5 py-3 font-medium">Cuenta</th>
                    <th className="px-5 py-3 font-medium">Influencia</th>
                    <th className="px-5 py-3 font-medium">Ganancia marginal</th>
                    <th className="px-5 py-3 font-medium">Cobertura acum.</th>
                    <th className="px-5 py-3 font-medium">Costo/post</th>
                    <th className="px-5 py-3 font-medium">Afinidad</th>
                  </tr>
                </thead>
                <tbody>
                  {derived.ranking.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-white/5 transition-colors hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-3">
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/15 text-xs font-bold text-violet-200">
                          {r.step}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-100">@{r.id}</span>
                          {r.step === 1 && (
                            <Badge variant="amber">
                              <Crown size={11} /> Top
                            </Badge>
                          )}
                          {r.isHub && r.step !== 1 && (
                            <Badge variant="violet">
                              <TrendingUp size={11} /> Hub
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-300">{r.inDegree}</td>
                      <td className="px-5 py-3">
                        <span
                          className={
                            r.marginal_gain > 0
                              ? 'font-medium text-emerald-300'
                              : 'text-slate-500'
                          }
                        >
                          +{r.marginal_gain}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-300">{r.cumulative_coverage}</td>
                      <td className="px-5 py-3 text-slate-300">{formatCurrency(r.costPerPost)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/5">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-400"
                              style={{ width: `${r.affinity}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400">{r.affinity}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

export default Recommender
