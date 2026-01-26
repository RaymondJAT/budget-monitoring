import { useMemo } from 'react'
import { useFetch } from '../../useFetch'

export function usePendingRequests(startDate, endDate) {
  const url = useMemo(() => {
    let u = 'api5012/cash_request/getapproved_cash_requests?status=approved'
    if (startDate && endDate) {
      u += `&startDate=${startDate}&endDate=${endDate}`
    }
    return u
  }, [startDate, endDate])

  const { data, loading, error } = useFetch(url, {}, [url])

  const pendingRequests = useMemo(
    () =>
      (data || []).map((item, i) => ({
        ...item,
        id: item.id ?? `req-${i}`,
        formType: 'Cash Request',
      })),
    [data],
  )

  return { pendingRequests, loading, error }
}
