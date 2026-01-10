import { useState, useEffect, useMemo } from 'react'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const CashFlowChart = ({ startDate, endDate }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [reportDate, setReportDate] = useState('')

  // Generate mock data
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

      // Cash Fund
      const cashTotal = 1500000 + Math.random() * 500000
      const cashLiquidated = cashTotal * 0.55 + Math.random() * 100000
      const cashUnliquidated = cashTotal - cashLiquidated

      // GCash Fund
      const gcashTotal = 1000000 + Math.random() * 400000
      const gcashLiquidated = gcashTotal * 0.6 + Math.random() * 80000
      const gcashUnliquidated = gcashTotal - gcashLiquidated

      mockData.push({
        dateKey,
        dateLabel,
        totalFund: Math.round(cashTotal + gcashTotal),
        totalLiquidated: Math.round(cashLiquidated + gcashLiquidated),
        totalUnliquidated: Math.round(cashUnliquidated + gcashUnliquidated),
        cashLiquidated: Math.round(cashLiquidated),
        cashUnliquidated: Math.round(cashUnliquidated),
        gcashLiquidated: Math.round(gcashLiquidated),
        gcashUnliquidated: Math.round(gcashUnliquidated),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      })
    }

    return mockData
  }

  useEffect(() => {
    const mock = generateMockData()
    setData(mock)
    if (mock.length > 0) {
      const monthName = new Date(0, mock[0].month - 1).toLocaleString('default', {
        month: 'long',
      })
      setReportDate(`${monthName} `)
    }
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
          <p className="text-gray-500 text-sm">Loading Cash Flow...</p>
        </div>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="h-full w-full flex items-center justify-center p-4">
        <p className="text-gray-500">No Cash Flow Data</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full bg-component shadow-xl rounded-lg border border-slate-400 flex flex-col">
      <div className="p-4 shrink-0 text-center">
        <p className="font-bold mb-0">Cash Flow Overview</p>
        {reportDate && <small className="text-gray-500">Reporting Period: {reportDate}</small>}
      </div>

      <div className="flex-1 min-h-0 px-3 sm:px-4 pb-3 sm:pb-4">
        <div className="w-full h-full min-h-55">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
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

              {/* Line for Total Fund */}
              <Line
                type="monotone"
                dataKey="totalFund"
                stroke="#1c6b1e"
                strokeWidth={2}
                name="Total Fund"
              />

              {/* Stacked bars */}
              <Bar
                dataKey="totalLiquidated"
                fill="#2464c9"
                name="Total Liquidated"
                barSize={20}
                stackId="stack1"
              />
              <Bar
                dataKey="totalUnliquidated"
                fill="#f2950a"
                name="Total Unliquidated"
                barSize={20}
                stackId="stack1"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default CashFlowChart
