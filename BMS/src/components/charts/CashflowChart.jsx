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
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Generate mock data
  const generateMockData = () => {
    const baseDate = new Date(2024, 0, 1)
    const days = isMobile ? 5 : isTablet ? 6 : 7
    const mockData = []

    for (let i = 0; i < days; i++) {
      const currentDate = new Date(baseDate)
      currentDate.setDate(baseDate.getDate() + i)

      const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(
        2,
        '0',
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
  }, [startDate, endDate, isMobile, isTablet])

  const uniqueDates = useMemo(
    () =>
      Array.from(new Map(data.map((d) => [d.dateKey, d.dateLabel])).entries()).map(
        ([key, label]) => ({ dateKey: key, dateLabel: label }),
      ),
    [data],
  )

  // Responsive settings
  const chartSettings = {
    barSize: isMobile ? 12 : isTablet ? 15 : 18,
    xAxisTickFontSize: isMobile ? 10 : isTablet ? 11 : 13,
    yAxisTickFontSize: isMobile ? 10 : isTablet ? 11 : 13,
    legendFontSize: isMobile ? '0.7rem' : isTablet ? '0.75rem' : '0.8rem',
    xAxisAngle: isMobile ? -45 : -20,
    xAxisHeight: isMobile ? 80 : isTablet ? 70 : 60,
    yAxisWidth: isMobile ? 50 : isTablet ? 55 : 60,
    margin: {
      top: 10,
      right: isMobile ? 15 : isTablet ? 20 : 30,
      left: isMobile ? 15 : isTablet ? 18 : 20,
      bottom: isMobile ? 40 : isTablet ? 35 : 30,
    },
    legendHeight: isMobile ? 40 : isTablet ? 38 : 36,
  }

  return (
    <div className="h-full w-full bg-component shadow-xl rounded-lg border border-slate-400 flex flex-col">
      <div className="p-3 sm:p-4 shrink-0 text-center">
        <p className="font-bold text-sm sm:text-base mb-0 sm:mb-1">Cash Flow Overview</p>
        {reportDate && !loading && (
          <small className="text-gray-500 text-xs sm:text-sm">Reporting Period: {reportDate}</small>
        )}
      </div>

      <div className="flex-1 min-h-0 px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4">
        {loading ? (
          // Loading state inside container
          <div className="h-full w-full flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-6 sm:h-8 w-6 sm:w-8 border-b-2 border-blue-500 mb-2 sm:mb-3"></div>
              <p className="text-gray-500 text-xs sm:text-sm">Loading Cash Flow Data...</p>
            </div>
          </div>
        ) : !data.length ? (
          // No data state inside container
          <div className="h-full w-full flex items-center justify-center">
            <div className="flex flex-col items-center text-gray-500">
              <svg
                className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 mb-2 sm:mb-3 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p className="text-gray-400 text-xs sm:text-sm">No Cash Flow Data Available</p>
            </div>
          </div>
        ) : (
          // Chart content with responsive settings
          <div className="w-full h-full min-h-62.5 sm:min-h-70 md:min-h-75">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={chartSettings.margin}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="dateKey"
                  ticks={uniqueDates.map((d) => d.dateKey)}
                  tickFormatter={(key) => {
                    const match = uniqueDates.find((d) => d.dateKey === key)
                    return match ? match.dateLabel : key
                  }}
                  tick={{ fontSize: chartSettings.xAxisTickFontSize }}
                  interval={0}
                  angle={chartSettings.xAxisAngle}
                  textAnchor="end"
                  height={chartSettings.xAxisHeight}
                />
                <YAxis
                  tickFormatter={(value) =>
                    `₱${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                  }
                  width={chartSettings.yAxisWidth}
                  tick={{ fontSize: chartSettings.yAxisTickFontSize }}
                />
                <Tooltip
                  formatter={(value) =>
                    `₱${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                  }
                  contentStyle={{
                    fontSize: isMobile ? '11px' : isTablet ? '12px' : '13px',
                    padding: isMobile ? '6px 8px' : '8px 10px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="totalFund"
                  stroke="#1c6b1e"
                  strokeWidth={isMobile ? 1.5 : 2}
                  name="Total Fund"
                  dot={!isMobile}
                  strokeDasharray={isMobile ? '' : ''}
                />
                <Bar
                  dataKey="totalLiquidated"
                  fill="#2464c9"
                  name="Liquidated"
                  barSize={chartSettings.barSize}
                  stackId="stack1"
                />
                <Bar
                  dataKey="totalUnliquidated"
                  fill="#f2950a"
                  name="Unliquidated"
                  barSize={chartSettings.barSize}
                  stackId="stack1"
                />
                <Legend
                  wrapperStyle={{
                    fontSize: chartSettings.legendFontSize,
                    paddingTop: isMobile ? '5px' : '0',
                  }}
                  verticalAlign="bottom"
                  height={chartSettings.legendHeight}
                  iconSize={isMobile ? 8 : isTablet ? 10 : 12}
                  layout={isMobile ? 'horizontal' : 'horizontal'}
                  align={isMobile ? 'center' : 'center'}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

export default CashFlowChart
