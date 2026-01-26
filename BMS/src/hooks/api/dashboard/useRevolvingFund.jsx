import { useMemo } from 'react'
import { useFetch } from '../../useFetch'

export function useRevolvingFund(startDate, endDate) {
  const url = useMemo(() => {
    let u = 'api5001/revolving_fund_activity/getrevolving_fund_activity'
    if (startDate && endDate) {
      u += `?startDate=${startDate}&endDate=${endDate}`
    }
    return u
  }, [startDate, endDate])

  const { data, loading, error } = useFetch(url, {}, [url])

  return {
    revolvingFundData: data?.data || [],
    loading,
    error,
  }
}
