import { useMemo, useState } from 'react'
import { Share2, Waypoints, GitBranch } from 'lucide-react'
import Card, { CardBody, CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import NetworkGraph from '../components/network/NetworkGraph'
import { LoadingState, ErrorState } from '../components/ui/StateViews'
import { useApi } from '../hooks/useApi'
import { getFollowersGraph, getMaxFlow, getMinimumSpanningTree } from '../services'
import { formatCompact } from '../utils/metrics'

const TOP_N = 60

const tabs = [
  { id: 'graph', label: 'Grafo de seguidores', icon: Share2 },
  { id: 'flow', label: 'Flujo máximo', icon: Waypoints },
  { id: 'mst', label: 'Árbol de cobertura (MST)', icon: GitBranch },
]

const fetchers = {
  graph: () => getFollowersGraph({ topN: TOP_N }),
  flow: () => getMaxFlow({ topN: TOP_N }),
  mst: () => getMinimumSpanningTree({ topN: TOP_N }),
}

const descriptions = {
  graph:
    'Creadores más influyentes (en violeta los hubs). Cuanto mayor el nodo, mayor su número de seguidores dentro de la red.',
  flow:
    'Audiencia máxima garantizada entre un creador origen y un nicho destino. En cian las rutas activas que transportan flujo.',
  mst:
    'Conjunto mínimo de conexiones para cubrir toda la red al menor costo, evitando colaboraciones redundantes.',
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-50">{value}</p>
    </div>
  )
}

function Network() {
  const [tab, setTab] = useState('graph')
  const { data, loading, error, run } = useApi(fetchers[tab], { deps: [tab] })

  const graphProps = useMemo(() => {
    if (!data) return null
    if (tab === 'graph') {
      return {
        getNodeColor: (n) => (n.is_hub ? '#a78bfa' : '#475569'),
        getEdgeColor: () => 'rgba(148,163,184,0.12)',
        legend: [
          { color: '#a78bfa', label: 'Creador (hub)' },
          { color: '#475569', label: 'Usuario' },
        ],
      }
    }
    if (tab === 'flow') {
      return {
        getNodeColor: (n) =>
          n.role === 'origen' ? '#34d399' : n.role === 'destino' ? '#fbbf24' : '#475569',
        getEdgeColor: (e) => (e.is_active ? '#22d3ee' : 'rgba(148,163,184,0.08)'),
        getEdgeWidth: (e) => (e.is_active ? 1 + e.flow * 0.5 : 0.6),
        legend: [
          { color: '#34d399', label: 'Origen' },
          { color: '#fbbf24', label: 'Destino' },
          { color: '#22d3ee', label: 'Ruta activa' },
        ],
      }
    }
    return {
      getNodeColor: (n) => (n.is_hub ? '#a78bfa' : '#475569'),
      getEdgeColor: (e) => (e.in_mst ? '#8b5cf6' : 'rgba(148,163,184,0.06)'),
      getEdgeWidth: (e) => (e.in_mst ? 1.8 : 0.5),
      isEdgeVisible: (e) => e.in_mst,
      legend: [
        { color: '#8b5cf6', label: 'Arista del MST' },
        { color: '#a78bfa', label: 'Creador (hub)' },
      ],
    }
  }, [data, tab])

  const stats = useMemo(() => {
    if (!data) return []
    if (tab === 'graph') {
      return [
        { label: 'Nodos', value: data.stats.num_nodes },
        { label: 'Conexiones', value: data.stats.num_edges },
        { label: 'Umbral de hub', value: data.stats.threshold },
      ]
    }
    if (tab === 'flow') {
      return [
        { label: 'Origen', value: `@${data.source}` },
        { label: 'Destino', value: `@${data.target}` },
        { label: 'Flujo máximo', value: formatCompact(data.max_flow) },
        { label: 'Rutas activas', value: data.stats.num_active_edges },
      ]
    }
    return [
      { label: 'Nodos', value: data.stats.num_nodes },
      { label: 'Aristas del MST', value: data.stats.mst_num_edges },
      { label: 'Costo total', value: data.stats.total_cost.toFixed(2) },
    ]
  }, [data, tab])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-50">Red de Influencia</h2>
        <p className="text-sm text-slate-400">
          Explora la estructura de la red de creadores con distintos algoritmos de grafos.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-gradient-to-r from-violet-500/20 to-indigo-500/10 text-violet-100 ring-1 ring-violet-500/30'
                : 'border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {!loading && !error && stats.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
      )}

      <Card>
        <CardHeader title={tabs.find((t) => t.id === tab)?.label} subtitle={descriptions[tab]} />
        <CardBody>
          {loading && <LoadingState label="Calculando el grafo…" />}
          {error && <ErrorState error={error} onRetry={run} />}
          {!loading && !error && data && graphProps && (
            <>
              <div className="mb-3 flex flex-wrap gap-4">
                {graphProps.legend.map((l) => (
                  <LegendDot key={l.label} {...l} />
                ))}
              </div>
              <div className="mx-auto aspect-square w-full max-w-2xl rounded-2xl border border-white/5 bg-slate-950/40">
                <NetworkGraph
                  nodes={data.nodes}
                  edges={data.edges}
                  getNodeColor={graphProps.getNodeColor}
                  getEdgeColor={graphProps.getEdgeColor}
                  getEdgeWidth={graphProps.getEdgeWidth}
                  isEdgeVisible={graphProps.isEdgeVisible}
                />
              </div>
              <p className="mt-3 text-center text-xs text-slate-500">
                Pasa el cursor sobre un nodo para ver su ID y número de seguidores.
              </p>
            </>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody className="flex items-start gap-3">
          <Badge variant="amber">Nota</Badge>
          <p className="text-xs leading-relaxed text-slate-400">
            Las posiciones de los nodos provienen del layout circular calculado por el backend.
            Las métricas de seguidores corresponden al in-degree dentro del subgrafo de los{' '}
            {TOP_N} nodos más influyentes.
          </p>
        </CardBody>
      </Card>
    </div>
  )
}

export default Network
