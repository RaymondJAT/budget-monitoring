import { useMemo, useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const CashRequestPieChart = ({ data }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [containerHeight, setContainerHeight] = useState(300)

  // Check screen size and calculate container height
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)

      // Calculate appropriate container height based on screen size
      if (width < 768) {
        setContainerHeight(250) // Mobile
      } else if (width < 1024) {
        setContainerHeight(280) // Tablet
      } else {
        setContainerHeight(320) // Desktop
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Early exit if no data
  if (!data) {
    return (
      <div className="h-full w-full flex items-center justify-center p-3 sm:p-4">
        <p className="text-gray-500 text-sm sm:text-base">No Data Available</p>
      </div>
    )
  }

  const COLORS = {
    pending_requests: '#f2950a',
    approved_requests: '#1c6b1e',
    completed_requests: '#2464c9',
    rejected_requests: '#dd2525',
  }

  // Filter only request keys
  const processedData = useMemo(() => {
    return Object.entries(data)
      .filter(([key]) => key.includes('requests'))
      .map(([key, value]) => ({
        name: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        value,
        color: COLORS[key] || '#888888',
      }))
  }, [data])

  const total = processedData.reduce((sum, entry) => sum + entry.value, 0)

  // Responsive settings - matching LiquidationPieChart
  const chartSettings = {
    outerRadius: isMobile ? '60%' : isTablet ? '70%' : '80%',
    innerRadius: isMobile ? '20%' : isTablet ? '30%' : '40%',
    labelFontSize: isMobile ? 9 : isTablet ? 10 : 11,
    tooltipFontSize: isMobile ? '11px' : isTablet ? '12px' : '13px',
    legendFontSize: isMobile ? '0.7rem' : isTablet ? '0.75rem' : '0.8rem',
    legendIconSize: isMobile ? 8 : isTablet ? 10 : 12,
  }

  // Custom label renderer with responsive font size - matching LiquidationPieChart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    // Hide labels on very small screens if they might overlap
    if (isMobile && percent < 0.05) return null

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180)
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        fontSize={chartSettings.labelFontSize}
        fontWeight="medium"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  // Determine legend layout based on screen size - matching LiquidationPieChart
  const legendLayout = isMobile ? 'horizontal' : 'vertical'
  const legendVerticalAlign = isMobile ? 'bottom' : 'middle'
  const legendAlign = isMobile ? 'center' : 'right'

  return (
    <div
      className="h-full w-full bg-component rounded-lg flex flex-col"
      style={{ minHeight: `${containerHeight}px` }}
    >
      <div className="flex-1 min-h-0 w-full h-full px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4">
        <ResponsiveContainer width="100%" height="100%" minHeight={250}>
          <PieChart>
            <Pie
              data={processedData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={chartSettings.outerRadius}
              innerRadius={chartSettings.innerRadius}
              labelLine={false}
              label={renderCustomizedLabel}
              paddingAngle={2}
            >
              {processedData.map((entry, index) => (
                <Cell key={index} fill={entry.color} stroke="#fff" strokeWidth={1} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name) => {
                const percent = total ? ((value / total) * 100).toFixed(1) : 0
                return [`${value} request(s) (${percent}%)`, name]
              }}
              contentStyle={{
                fontSize: chartSettings.tooltipFontSize,
                backgroundColor: '#fff',
                borderRadius: 6,
                border: '1px solid #d1d5db',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                padding: isMobile ? '6px 8px' : '8px 10px',
                zIndex: 1000,
              }}
              wrapperStyle={{ zIndex: 1000 }}
            />

            <Legend
              layout={legendLayout}
              verticalAlign={legendVerticalAlign}
              align={legendAlign}
              wrapperStyle={{
                fontSize: chartSettings.legendFontSize,
                paddingLeft: isMobile ? 0 : 10,
                paddingTop: isMobile ? '10px' : '0',
                paddingRight: isMobile ? 0 : 5,
                zIndex: 10,
                maxWidth: isMobile ? '100%' : 'auto',
                lineHeight: isMobile ? '1.2' : '1.5',
              }}
              iconSize={chartSettings.legendIconSize}
              iconType="circle"
              formatter={(name) => {
                const item = processedData.find((d) => d.name === name)
                if (!item) return name
                const percent = total ? ((item.value / total) * 100).toFixed(1) : 0

                if (isMobile) {
                  // Shorten labels for mobile: "Pending Requests" -> "Pending: 8"
                  const shortName = name.split(' ')[0]
                  return `${shortName}: ${item.value}`
                } else if (isTablet) {
                  // Medium length for tablet
                  return `${name}: ${item.value}`
                } else {
                  // Full for desktop
                  return `${name}: ${item.value} (${percent}%)`
                }
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default CashRequestPieChart
