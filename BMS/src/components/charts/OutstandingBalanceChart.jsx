import { useState, useEffect, useMemo } from 'react'
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
        '0',
      )}-${String(currentDate.getDate()).padStart(2, '0')}`

      const dateLabel = currentDate.toLocaleDateString('en-US', {
        month: isMobile ? 'numeric' : 'short',
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
  }, [startDate, endDate, isMobile])

  const uniqueDates = useMemo(
    () =>
      Array.from(new Map(data.map((d) => [d.dateKey, d.dateLabel])).entries()).map(
        ([key, label]) => ({ dateKey: key, dateLabel: label }),
      ),
    [data],
  )

  // Responsive chart settings
  const chartSettings = {
    marginTop: isMobile ? 5 : isTablet ? 8 : 10,
    marginRight: isMobile ? 15 : isTablet ? 25 : 30,
    marginLeft: isMobile ? 10 : isTablet ? 15 : 25,
    marginBottom: isMobile ? 25 : isTablet ? 25 : 30,
    xAxisFontSize: isMobile ? 10 : isTablet ? 11 : 13,
    yAxisFontSize: isMobile ? 10 : isTablet ? 11 : 13,
    legendFontSize: isMobile ? '0.7rem' : isTablet ? '0.75rem' : '0.8rem',
    tooltipFontSize: isMobile ? '11px' : isTablet ? '12px' : '13px',
    lineStrokeWidth: isMobile ? 1.5 : isTablet ? 1.8 : 2,
    dotRadius: isMobile ? 2 : isTablet ? 2.5 : 3,
    activeDotRadius: isMobile ? 3 : isTablet ? 4 : 5,
    legendHeight: isMobile ? 30 : isTablet ? 32 : 36,
    xAxisHeight: isMobile ? 45 : isTablet ? 50 : 60,
    yAxisWidth: isMobile ? 45 : isTablet ? 50 : 60,
  }

  return (
    <div className="h-full w-full bg-component shadow-xl rounded-lg border border-slate-400 flex flex-col">
      <div className="p-3 sm:p-4 shrink-0">
        <div className="text-center mb-2 sm:mb-3">
          <p className={`font-bold mb-0 ${isMobile ? 'text-sm' : 'text-base'}`}>
            Revolving Fund Summary
          </p>
          <small className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Outstanding Balance Overview
          </small>
        </div>
      </div>

      <div className="flex-1 min-h-0 px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4">
        {loading ? (
          // Loading state inside container
          <div className="h-full w-full flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2 sm:mb-3"></div>
              <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Loading Outstanding Balance Data...
              </p>
            </div>
          </div>
        ) : !data.length ? (
          // No data state inside container
          <div className="h-full w-full flex items-center justify-center">
            <div className="flex flex-col items-center text-gray-500">
              <svg
                className={`${isMobile ? 'w-10 h-10' : isTablet ? 'w-11 h-11' : 'w-12 h-12'} mb-2 sm:mb-3 text-gray-300`}
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
              <p className={`text-gray-400 ${isMobile ? 'text-sm' : 'text-base'}`}>
                No Outstanding Balance Data Available
              </p>
            </div>
          </div>
        ) : (
          // Chart content with responsive settings
          <div className="w-full h-full min-h-55">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: chartSettings.marginTop,
                  right: chartSettings.marginRight,
                  left: chartSettings.marginLeft,
                  bottom: chartSettings.marginBottom,
                }}
              >
                <CartesianGrid strokeDasharray={isMobile ? '2 2' : '3 3'} />

                <XAxis
                  dataKey="dateKey"
                  ticks={uniqueDates.map((d) => d.dateKey)}
                  tickFormatter={(key) => {
                    const match = uniqueDates.find((d) => d.dateKey === key)
                    return match ? match.dateLabel : key
                  }}
                  tick={{ fontSize: chartSettings.xAxisFontSize }}
                  interval={isMobile ? 0 : 'preserveStartEnd'}
                  angle={isMobile ? -35 : isTablet ? -25 : -20}
                  textAnchor="end"
                  height={chartSettings.xAxisHeight}
                />

                <YAxis
                  tickFormatter={(value) =>
                    `₱${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                  }
                  width={chartSettings.yAxisWidth}
                  tick={{ fontSize: chartSettings.yAxisFontSize }}
                  tickCount={isMobile ? 5 : 6}
                />

                <Tooltip
                  formatter={(value) =>
                    `₱${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                  }
                  contentStyle={{
                    fontSize: chartSettings.tooltipFontSize,
                    backgroundColor: '#fff',
                    borderRadius: 6,
                    border: '1px solid #d1d5db',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    padding: isMobile ? '6px 8px' : '8px 10px',
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="total_issued"
                  stroke="#1c6b1e"
                  strokeWidth={chartSettings.lineStrokeWidth}
                  dot={{ r: chartSettings.dotRadius }}
                  activeDot={{ r: chartSettings.activeDotRadius }}
                  name="Total Issued"
                />

                <Line
                  type="monotone"
                  dataKey="total_liquidated"
                  stroke="#2464c9"
                  strokeWidth={chartSettings.lineStrokeWidth}
                  dot={{ r: chartSettings.dotRadius }}
                  activeDot={{ r: chartSettings.activeDotRadius }}
                  name="Total Liquidated"
                />

                <Line
                  type="monotone"
                  dataKey="total_unliquidated"
                  stroke="#f2950a"
                  strokeWidth={chartSettings.lineStrokeWidth}
                  dot={{ r: chartSettings.dotRadius }}
                  activeDot={{ r: chartSettings.activeDotRadius }}
                  name="Total Unliquidated"
                />

                <Legend
                  wrapperStyle={{
                    fontSize: chartSettings.legendFontSize,
                    paddingTop: isMobile ? '5px' : '0',
                  }}
                  verticalAlign="bottom"
                  height={chartSettings.legendHeight}
                  iconSize={isMobile ? 8 : isTablet ? 10 : 12}
                  formatter={(name) => {
                    if (isMobile) {
                      // Shorten labels for mobile
                      return name.replace('Total ', '')
                    }
                    return name
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

export default OutstandingBalance
