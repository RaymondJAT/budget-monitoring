import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const OutstandingBalance = ({ startDate, endDate }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock data generator
  const generateMockData = () => {
    const baseDate = new Date(2024, 0, 1)
    const days = 7
    const mockData = []

    for (let i = 0; i < days; i++) {
      const currentDate = new Date(baseDate)
      currentDate.setDate(baseDate.getDate() + i)

      const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(currentDate.getDate()).padStart(2, '0')}`

      const dateLabel = currentDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })

      const totalIssued = 2000000 + Math.random() * 1000000
      const totalLiquidated = totalIssued * (0.4 + Math.random() * 0.4)
      const totalUnliquidated = totalIssued - totalLiquidated

      mockData.push({
        dateKey,
        dateLabel,
        total_issued: Math.round(totalIssued),
        total_liquidated: Math.round(totalLiquidated),
        total_unliquidated: Math.round(totalUnliquidated),
      })
    }

    return mockData
  }

  // Load mock data
  useEffect(() => {
    setLoading(true)
    const mock = generateMockData()
    setData(mock)
    setLoading(false)
  }, [startDate, endDate])

  const uniqueDates = useMemo(
    () =>
      Array.from(new Map(data.map((d) => [d.dateKey, d.dateLabel])).entries()).map(
        ([key, label]) => ({ dateKey: key, dateLabel: label })
      ),
    [data]
  )

  if (loading && !data.length) {
    return (
      <div className="h-full w-full flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mb-2"></div>
          <p className="text-gray-500 text-sm">Loading Outstanding Balance...</p>
        </div>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="h-full w-full flex items-center justify-center p-4">
        <p className="text-gray-500">No Outstanding Balance Data</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full bg-component shadow-xl rounded-lg border border-slate-400 flex flex-col">
      <div className="p-4 shrink-0">
        <div className="text-center mb-3">
          <p className="font-bold mb-0">Revolving Fund Summary</p>
          <small className="text-gray-500">Outstanding Balance Overview</small>
        </div>
      </div>

      <div className="flex-1 min-h-0 px-3 sm:px-4 pb-3 sm:pb-4">
        <div className="w-full h-full min-h-55">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="dateKey"
                ticks={uniqueDates.map((d) => d.dateKey)}
                tickFormatter={(key) => {
                  const match = uniqueDates.find((d) => d.dateKey === key)
                  return match ? match.dateLabel : key
                }}
                tick={{ fontSize: 10 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />

              <YAxis
                tickFormatter={(value) =>
                  `₱${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                }
              />

              <Tooltip
                formatter={(value) =>
                  `₱${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                }
              />

              <Legend wrapperStyle={{ fontSize: '0.7rem' }} />

              <Line
                type="monotone"
                dataKey="total_issued"
                stroke="#1c6b1e"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                name="Total Issued"
              />
              <Line
                type="monotone"
                dataKey="total_liquidated"
                stroke="#2464c9"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                name="Total Liquidated"
              />
              <Line
                type="monotone"
                dataKey="total_unliquidated"
                stroke="#f2950a"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                name="Total Unliquidated"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default OutstandingBalance
