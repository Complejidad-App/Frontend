import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Hook genérico para llamadas a la API con estados de carga y error.
 *
 * @param {Function} fetcher - función async que devuelve los datos.
 * @param {object} [options]
 * @param {boolean} [options.immediate=true] - si ejecuta al montar.
 * @param {Array} [options.deps=[]] - dependencias que re-disparan la llamada.
 */
export function useApi(fetcher, { immediate = true, deps = [] } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)

  const fetcherRef = useRef(fetcher)
  useEffect(() => {
    fetcherRef.current = fetcher
  })

  const callIdRef = useRef(0)

  const run = useCallback(async (...args) => {
    const callId = ++callIdRef.current
    setLoading(true)
    setError(null)
    try {
      const result = await fetcherRef.current(...args)
      if (callId === callIdRef.current) setData(result)
      return result
    } catch (err) {
      if (callId === callIdRef.current) setError(err)
      return undefined
    } finally {
      if (callId === callIdRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (immediate) run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error, run, setData }
}
