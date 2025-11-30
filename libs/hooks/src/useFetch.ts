import { useState, useEffect } from 'react'

interface UseFetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

/**
 * Hook for fetching data from API
 */
export function useFetch<T>(url: string): UseFetchState<T> {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        setState({ data, loading: false, error: null })
      } catch (error) {
        setState({ data: null, loading: false, error: error as Error })
      }
    }

    fetchData()
  }, [url])

  return state
}
