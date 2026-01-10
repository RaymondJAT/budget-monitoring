import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180)
  const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180)

  return (
    <text x={x} y={y} fill="white" fontSize={10} textAnchor="middle" dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const LiquidationPieChart = ({ data }) => {
  if (!data) {
    return (
      <div className="h-full w-full flex items-center justify-center p-4">
        <p className="text-gray-500">No Data Available</p>
      </div>
    )
  }

  // Colors for liquidation statuses
  const COLORS = {
    pending_liquidations: '#f2950a',
    approved_liquidations: '#1c6b1e',
    verified_liquidations: '#6736da',
    completed_liquidations: '#2464c9',
    rejected_liquidations: '#dd2525',
  }

  // Process data: filter only liquidation keys
  const processedData = useMemo(() => {
    return Object.entries(data)
      .filter(([key]) => key.includes('liquidations'))
      .map(([key, value]) => ({
        name: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        value,
        color: COLORS[key] || '#888888',
      }))
  }, [data])

  const total = processedData.reduce((sum, entry) => sum + entry.value, 0)

  return (
    <div className="h-full w-full bg-component rounded-sm flex flex-col">
      <div className="flex-1 min-h-62.5 px-3 sm:px-4 pb-3 sm:pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={processedData}
              dataKey="value"
              nameKey="name"
              outerRadius="80%"
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {processedData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name) => {
                const percent = total ? ((value / total) * 100).toFixed(1) : 0
                return [`${value} liquidation(s) (${percent}%)`, name]
              }}
              contentStyle={{
                fontSize: '0.75rem',
                backgroundColor: '#fff',
                borderRadius: 6,
              }}
            />

            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{ fontSize: '0.70rem', paddingLeft: 10 }}
              formatter={(name) => {
                const item = processedData.find((d) => d.name === name)
                const percent = total ? ((item.value / total) * 100).toFixed(1) : 0
                return `${name}: ${item.value} (${percent}%)`
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default LiquidationPieChart
