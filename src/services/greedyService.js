import client from './client'

/**
 * GET /greedy/influence-maximization
 * Recomendador: con un presupuesto de k creadores, devuelve el conjunto que
 * maximiza el alcance total y los retornos decrecientes paso a paso.
 * @param {{ k?: number, topN?: number }} params
 */
export async function getInfluenceMaximization({ k = 5, topN = 60 } = {}) {
  const { data } = await client.get('/greedy/influence-maximization', {
    params: { k, top_n: topN },
  })
  return data
}
