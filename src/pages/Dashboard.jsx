import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  Users,
  Target,
  Network as NetworkIcon,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts'
import KpiCard from '../components/ui/KpiCard'
import Card, { CardBody, CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { SkeletonCard } from '../components/ui/Skeleton'
import { LoadingState, ErrorState } from '../components/ui/StateViews'
import { useApi } from '../hooks/useApi'
import { getFollowersGraph, getInfluenceMaximization, getStats } from '../services'
import {
  buildCreatorMetrics,
  estimatedEngagementRate,
  formatCompact,
  formatCurrency,
} from '../utils/metrics'

async function loadDashboard() {
  const [graph, greedy] = await Promise.all([
    getFollowersGraph({ topN: 60 }),
    getInfluenceMaximization({ k: 5, topN: 60 }),
  ])
  const inDegrees = graph.nodes.map((n) => n.in_degree)
  const stats = await getStats(inDegrees)
  return { graph, greedy, stats }
}

const chartTooltipStyle = {
  contentStyle: {
    background: '#0f172a',
    border: '1px solid rgba(148,163,184,0.2)',
    borderRadius: 12,
    fontSize: 12,
  },
  labelStyle: { color: '#e2e8f0' },
  itemStyle: { color: '#c4b5fd' },
}

function Dashboard() {
  const { data, loading, error, run } = useApi(loadDashboard)

  const derived = useMemo(() => {
    if (!data) return null
    const { graph, greedy, stats } = data
    const maxInDegree = Math.max(...graph.nodes.map((n) => n.in_degree), 1)
    const creators = graph.nodes
      .map((n) => buildCreatorMetrics(n, maxInDegree))
      .sort((a, b) => b.inDegree - a.inDegree)
    const hubs = creators.filter((c) => c.isHub)
    const marketEngagement =
      creators.reduce((sum, c) => sum + estimatedEngagementRate(c.inDegree), 0) /
      (creators.length || 1)

    const distribution = stats.histogram.map((bin) => ({
      range: `${Math.round(bin.bin_start)}–${Math.round(bin.bin_end)}`,
      frequency: bin.frequency,
    }))

    const topCreators = creators.slice(0, 8).map((c) => ({
      id: c.id,
      influencia: c.inDegree,
    }))

    const recommended = greedy.selected
      .map((id) => creators.find((c) => c.id === id))
      .filter(Boolean)

    return {
      maxInDegree,
      creators,
      hubs,
      marketEngagement,
      distribution,
      topCreators,
      recommended,
      coverage: greedy.stats.coverage_pct,
      numNodes: graph.stats.num_nodes,
      numEdges: graph.stats.num_edges,
    }
  }, [data])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <Card>
          <CardBody>
            <LoadingState label="Calculando métricas del mercado…" />
          </CardBody>
        </Card>
      </div>
    )
  }

  if (error) return <ErrorState error={error} onRetry={run} />
  if (!derived) return null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-50">Visión general del mercado</h2>
        <p className="text-sm text-slate-400">
          Indicadores clave de la red de creadores de TikTok analizada.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Activity}
          label="Engagement promedio"
          value={`${derived.marketEngagement.toFixed(1)}%`}
          hint="Estimado del mercado"
          accent="violet"
        />
        <KpiCard
          icon={Users}
          label="Creadores top"
          value={derived.hubs.length}
          hint={`de ${derived.numNodes} cuentas analizadas`}
          accent="indigo"
        />
        <KpiCard
          icon={Target}
          label="Cobertura óptima (k=5)"
          value={`${derived.coverage.toFixed(0)}%`}
          hint="Recomendador inteligente"
          accent="emerald"
        />
        <KpiCard
          icon={NetworkIcon}
          label="Conexiones de red"
          value={formatCompact(derived.numEdges)}
          hint={`${derived.numNodes} nodos`}
          accent="cyan"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Distribución de audiencia"
            subtitle="Frecuencia de creadores por nivel de influencia (in-degree)"
          />
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={derived.distribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="range" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                  <Tooltip {...chartTooltipStyle} cursor={{ fill: 'rgba(139,92,246,0.08)' }} />
                  <Bar dataKey="frequency" name="Creadores" radius={[6, 6, 0, 0]}>
                    {derived.distribution.map((_, i) => (
                      <Cell key={i} fill="#8b5cf6" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Top creadores por influencia"
            subtitle="Mayores in-degree dentro de la red"
          />
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={derived.topCreators} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="id"
                    width={72}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                  />
                  <Tooltip {...chartTooltipStyle} cursor={{ fill: 'rgba(56,189,248,0.08)' }} />
                  <Bar dataKey="influencia" name="Influencia" radius={[0, 6, 6, 0]}>
                    {derived.topCreators.map((_, i) => (
                      <Cell key={i} fill="#22d3ee" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Creadores recomendados para campaña"
          subtitle="Selección del algoritmo voraz de maximización de influencia"
          action={
            <Link
              to="/recomendador"
              className="inline-flex items-center gap-1 text-xs font-medium text-violet-300 hover:text-violet-200"
            >
              Ver recomendador <ArrowRight size={14} />
            </Link>
          }
        />
        <CardBody className="space-y-3">
          {derived.recommended.map((c, i) => (
            <div
              key={c.id}
              className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-3"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-500/15 text-sm font-bold text-violet-200">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-slate-100">@{c.id}</p>
                  {c.isHub && (
                    <Badge variant="violet">
                      <TrendingUp size={11} /> Hub
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {c.inDegree} seguidores en red · {c.engagementRate}% engagement
                </p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-xs text-slate-400">Costo/post estimado</p>
                <p className="text-sm font-semibold text-slate-100">
                  {formatCurrency(c.costPerPost)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Afinidad</p>
                <p className="text-sm font-semibold text-emerald-300">{c.affinity}/100</p>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  )
}

export default Dashboard
