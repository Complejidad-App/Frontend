import client from './client'

/**
 * GET /flow/max
 * Flujo máximo de audiencia garantizada entre un creador (origen) y un nicho (destino).
 * @param {{ topN?: number, source?: string, target?: string }} params
 */
export async function getMaxFlow({ topN = 60, source, target } = {}) {
  const params = { top_n: topN }
  if (source) params.source = source
  if (target) params.target = target
  const { data } = await client.get('/flow/max', { params })
  return data
}
