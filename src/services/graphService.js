import client from './client'

/**
 * GET /graph/followers
 * Analiza el grafo de seguidores y devuelve los creadores más influyentes (hubs).
 * @param {{ topN?: number, threshold?: number }} params
 */
export async function getFollowersGraph({ topN = 60, threshold = 14 } = {}) {
  const { data } = await client.get('/graph/followers', {
    params: { top_n: topN, threshold },
  })
  return data
}
