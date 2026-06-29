import client from './client'

/**
 * GET /mst/kruskal
 * Árbol de expansión mínima (Kruskal): cobertura de la red al menor costo.
 * @param {{ topN?: number, threshold?: number }} params
 */
export async function getMinimumSpanningTree({ topN = 60, threshold = 14 } = {}) {
  const { data } = await client.get('/mst/kruskal', {
    params: { top_n: topN, threshold },
  })
  return data
}
