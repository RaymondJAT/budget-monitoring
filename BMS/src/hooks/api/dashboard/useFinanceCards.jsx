import { useMemo } from 'react'
import { useFetch } from '../../useFetch'
import { cardDataCustodian } from '../../../data/cardData'

export function useFinanceCards(startDate, endDate) {
  const url = useMemo(() => {
    let u = 'api5012/dashboard/get_finance_cards'
    if (startDate && endDate) {
      u += `?startDate=${startDate}&endDate=${endDate}`
    }
    return u
  }, [startDate, endDate])

  const { data, loading, error } = useFetch(url, {}, [url])

  const cards = useMemo(() => {
    const finance = data?.[0] || {}
    return cardDataCustodian.map((item) => ({
      ...item,
      value: finance[item.key] ?? 0,
      subValue: item.subKey ? (finance[item.subKey] ?? 0) : undefined,
    }))
  }, [data])

  return { cards, loading, error }
}
