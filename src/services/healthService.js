import client from './client'

/**
 * GET /health — verifica si la API está activa.
 * @returns {Promise<{status:string}>}
 */
export async function getHealth() {
  const { data } = await client.get('/health')
  return data
}
