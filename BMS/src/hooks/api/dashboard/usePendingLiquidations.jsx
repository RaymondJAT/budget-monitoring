import { useMemo } from 'react'
import { useFetch } from '../../useFetch'

export function usePendingLiquidations(startDate, endDate) {
  const url = useMemo(() => {
    let u = 'api5012/liquidation/getapproved_liquidation?status=approved'
    if (startDate && endDate) {
      u += `&startDate=${startDate}&endDate=${endDate}`
    }
    return u
  }, [startDate, endDate])

  const { data, loading, error } = useFetch(url, {}, [url])

  const pendingLiquidations = useMemo(() => {
    const apiData = Array.isArray(data) ? data : data?.data || []
    return apiData.map((item, i) => ({
      ...item,
      id: item.id || item._id || `liq-${i}`,
      formType: 'Liquidation',
    }))
  }, [data])

  return { pendingLiquidations, loading, error }
}
