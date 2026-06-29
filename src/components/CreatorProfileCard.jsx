import {
  Users,
  UserPlus,
  Eye,
  Heart,
  DollarSign,
  Gauge,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import Card, { CardBody } from './ui/Card'
import Badge from './ui/Badge'
import { formatCompact, formatCurrency } from '../utils/metrics'

function Metric({ icon: Icon, label, value, sub, estimated }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={15} />
        <span className="text-xs font-medium">{label}</span>
        {estimated && (
          <span className="ml-auto rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-300/90">
            est.
          </span>
        )}
      </div>
      <p className="mt-2 text-xl font-bold text-slate-50">{value}</p>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  )
}

function CreatorProfileCard({ creator }) {
  if (!creator) return null

  const recommended = creator.affinity >= 60
  const verdict = recommended
    ? { variant: 'emerald', icon: CheckCircle2, text: 'Recomendado para campaña' }
    : { variant: 'amber', icon: AlertCircle, text: 'Evaluar según presupuesto' }

  return (
    <Card>
      <CardBody className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-lg font-bold text-white">
              {creator.id.slice(0, 2)}
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-50">@{creator.id}</h3>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant={creator.isHub ? 'violet' : 'slate'}>
                  {creator.isHub ? (
                    <>
                      <TrendingUp size={11} /> Creador (hub)
                    </>
                  ) : (
                    'Usuario'
                  )}
                </Badge>
                <Badge variant={verdict.variant}>
                  <verdict.icon size={11} /> {verdict.text}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric
            icon={Users}
            label="Seguidores (red)"
            value={formatCompact(creator.inDegree)}
            sub="in-degree real"
          />
          <Metric
            icon={UserPlus}
            label="Siguiendo"
            value={formatCompact(creator.outDegree)}
            sub="out-degree real"
          />
          <Metric
            icon={Eye}
            label="Vistas promedio"
            value={formatCompact(creator.avgViews)}
            sub="por post"
            estimated
          />
          <Metric
            icon={Heart}
            label="Engagement"
            value={`${creator.engagementRate}%`}
            estimated
          />
          <Metric
            icon={DollarSign}
            label="Costo / post"
            value={formatCurrency(creator.costPerPost)}
            estimated
          />
          <Metric
            icon={Gauge}
            label="Alcance / USD"
            value={formatCompact(creator.reachPerDollar)}
            sub="eficiencia"
            estimated
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              Puntuación de afinidad de marca
            </span>
            <span className="text-sm font-bold text-emerald-300">
              {creator.affinity}/100
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-400 transition-all"
              style={{ width: `${creator.affinity}%` }}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default CreatorProfileCard
