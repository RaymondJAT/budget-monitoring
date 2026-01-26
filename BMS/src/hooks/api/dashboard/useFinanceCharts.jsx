import { useMemo } from 'react'
import { useFetch } from '../../useFetch'

export function useFinanceCharts(startDate, endDate) {
  const url = useMemo(() => {
    let u = '/api5012/dashboard/get_finance_charts'
    if (startDate && endDate) {
      u += `?startDate=${startDate}&endDate=${endDate}`
    }
    return u
  }, [startDate, endDate])

  const { data, loading, error } = useFetch(url, {}, [url])

  const requestStatus = useMemo(() => data?.request_status?.[0] || {}, [data])

  return { requestStatus, loading, error }
}
