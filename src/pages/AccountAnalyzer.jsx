import { useMemo, useState } from 'react'
import { Search, UserSearch, Sparkles } from 'lucide-react'
import Card, { CardBody, CardHeader } from '../components/ui/Card'
import CreatorProfileCard from '../components/CreatorProfileCard'
import { EmptyState, ErrorState, LoadingState } from '../components/ui/StateViews'
import { useApi } from '../hooks/useApi'
import { getFollowersGraph } from '../services'
import { buildCreatorMetrics } from '../utils/metrics'

const POOL_SIZE = 200

function AccountAnalyzer() {
  const { data, loading, error, run } = useApi(() => getFollowersGraph({ topN: POOL_SIZE }))
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [notFound, setNotFound] = useState(false)

  const { creators, topPicks } = useMemo(() => {
    if (!data) return { creators: [], topPicks: [] }
    const max = Math.max(...data.nodes.map((n) => n.in_degree), 1)
    const list = data.nodes
      .map((n) => buildCreatorMetrics(n, max))
      .sort((a, b) => b.inDegree - a.inDegree)
    return { creators: list, topPicks: list.slice(0, 12) }
  }, [data])

  const selected = useMemo(
    () => creators.find((c) => c.id === selectedId) ?? null,
    [creators, selectedId],
  )

  const handleSearch = (e) => {
    e.preventDefault()
    const id = query.trim()
    if (!id) return
    const found = creators.find((c) => c.id === id)
    setSelectedId(found ? id : null)
    setNotFound(!found)
  }

  const pick = (id) => {
    setSelectedId(id)
    setQuery(id)
    setNotFound(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-50">Analizador de Cuentas</h2>
        <p className="text-sm text-slate-400">
          Ingresa el ID de una cuenta de TikTok para evaluar su impacto e idoneidad para tu marca.
        </p>
      </div>

      <Card>
        <CardBody>
          <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej: 7861312"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-2.5 pl-10 pr-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition-opacity hover:opacity-90"
            >
              <UserSearch size={16} /> Analizar
            </button>
          </form>

          {!loading && !error && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-slate-400">
                Cuentas destacadas en la red:
              </p>
              <div className="flex flex-wrap gap-2">
                {topPicks.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => pick(c.id)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      selectedId === c.id
                        ? 'border-violet-500/50 bg-violet-500/20 text-violet-100'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    @{c.id}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {loading && (
        <Card>
          <CardBody>
            <LoadingState label="Cargando red de creadores…" />
          </CardBody>
        </Card>
      )}

      {error && <ErrorState error={error} onRetry={run} />}

      {!loading && !error && notFound && (
        <Card>
          <CardBody>
            <EmptyState
              title="Cuenta no encontrada"
              message={`No se encontró la cuenta "${query}" entre las ${creators.length} cuentas más influyentes de la red. Prueba con una de las destacadas.`}
            />
          </CardBody>
        </Card>
      )}

      {!loading && !error && selected && <CreatorProfileCard creator={selected} />}

      {!loading && !error && !selected && !notFound && (
        <Card>
          <CardHeader title="Selecciona una cuenta" subtitle="Resultados del análisis" />
          <CardBody>
            <div className="flex flex-col items-center gap-3 py-10 text-center text-slate-400">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-violet-500/10 text-violet-300">
                <Sparkles size={22} />
              </span>
              <p className="max-w-sm text-sm">
                Busca un ID o elige una cuenta destacada para ver su tarjeta de perfil con
                seguidores, engagement, costo estimado por post y afinidad de marca.
              </p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}

export default AccountAnalyzer
