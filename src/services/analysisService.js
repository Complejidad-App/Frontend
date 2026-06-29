import client from './client'

/**
 * POST /analysis/stats
 * @param {number[]} values
 * @returns {Promise<{count:number, mean:number, median:number, std:number,
 *   min:number, max:number, histogram:{bin_start:number, bin_end:number, frequency:number}[]}>}
 */
export async function getStats(values) {
  const { data } = await client.post('/analysis/stats', { values })
  return data
}
