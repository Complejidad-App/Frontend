// Métricas DERIVADAS / ESTIMADAS en el cliente.
//
// El backend solo expone un grafo de seguidores (in-degree por nodo); NO entrega
// vistas, engagement, costo por post ni afinidad de marca. Estas funciones
// derivan esos indicadores a partir del in-degree con heurísticas simples y
// deterministas, únicamente para fines de visualización del producto TrendPulse.
// Todos los valores que dependen de estas fórmulas se etiquetan como "estimado".

const VIEWS_PER_FOLLOWER = 1850
const ENGAGEMENT_BASE = 2.4
const ENGAGEMENT_PER_DEGREE = 0.45
const ENGAGEMENT_MAX = 14
const COST_BASE = 120
const COST_PER_FOLLOWER = 38

/** Vistas promedio estimadas por publicación. */
export function estimatedAvgViews(inDegree) {
  return Math.round(inDegree * VIEWS_PER_FOLLOWER * (1 + inDegree / 40))
}

/** Tasa de engagement estimada (%). */
export function estimatedEngagementRate(inDegree) {
  const rate = ENGAGEMENT_BASE + inDegree * ENGAGEMENT_PER_DEGREE
  return Math.min(ENGAGEMENT_MAX, Number(rate.toFixed(1)))
}

/** Costo estimado por post (USD). */
export function estimatedCostPerPost(inDegree) {
  return Math.round(COST_BASE + inDegree * COST_PER_FOLLOWER)
}

/**
 * Puntuación de afinidad de marca (0-100), relativa al creador más influyente
 * del conjunto analizado.
 */
export function brandAffinityScore(inDegree, maxInDegree) {
  if (!maxInDegree) return 0
  return Math.round((inDegree / maxInDegree) * 100)
}

/** Eficiencia: alcance estimado por cada dólar invertido. */
export function reachPerDollar(inDegree) {
  const cost = estimatedCostPerPost(inDegree)
  return cost ? Math.round(estimatedAvgViews(inDegree) / cost) : 0
}

/** Construye todas las métricas derivadas de un nodo/creador. */
export function buildCreatorMetrics(node, maxInDegree) {
  const inDegree = node.in_degree ?? 0
  return {
    id: node.id,
    inDegree,
    outDegree: node.out_degree ?? 0,
    isHub: node.is_hub ?? false,
    category: node.category ?? (node.is_hub ? 'creador' : 'usuario'),
    avgViews: estimatedAvgViews(inDegree),
    engagementRate: estimatedEngagementRate(inDegree),
    costPerPost: estimatedCostPerPost(inDegree),
    affinity: brandAffinityScore(inDegree, maxInDegree),
    reachPerDollar: reachPerDollar(inDegree),
  }
}

/** Formatea números grandes (1.2K, 3.4M). */
export function formatCompact(value) {
  return new Intl.NumberFormat('es', { notation: 'compact', maximumFractionDigits: 1 }).format(
    value ?? 0,
  )
}

/** Formatea un monto en dólares. */
export function formatCurrency(value) {
  return new Intl.NumberFormat('es', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value ?? 0)
}
