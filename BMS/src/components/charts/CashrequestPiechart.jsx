import { useEffect, useRef, useCallback } from 'react'
import * as echarts from 'echarts'

const CashrequestPiechart = ({ data, sidebarOpen }) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const resizeObserverRef = useRef(null)

  // Colors for the pie chart
  const COLORS = {
    pending_requests: '#f2950a',
    approved_requests: '#1c6b1e',
    completed_requests: '#2464c9',
    rejected_requests: '#dd2525',
  }

  // Initialize and update chart
  const initChart = useCallback(() => {
    if (!chartRef.current || !data) return

    // Dispose existing instance if it exists
    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    // Initialize ECharts instance
    chartInstance.current = echarts.init(chartRef.current)

    // Process data: only include request keys
    const processedData = Object.entries(data)
      .filter(([key]) => key.includes('requests'))
      .map(([key, value]) => ({
        name: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        value,
        color: COLORS[key] || '#888888',
      }))

    const total = processedData.reduce((sum, entry) => sum + entry.value, 0)

    const containerWidth = chartRef.current?.clientWidth || 400
    const isSmallScreen = containerWidth < 400
    const isVerySmallScreen = containerWidth < 300

    // Calculate optimal positions based on container size
    const pieCenterX = isSmallScreen ? '50%' : '40%' // Move pie to the left on desktop
    const legendLeft = isSmallScreen ? 'center' : '60%' // Move legend to the right on desktop
    const legendTop = isSmallScreen ? 'bottom' : 'middle'
    const legendBottom = isSmallScreen ? '5%' : 'auto'

    // Adjust pie radius based on available space
    const pieRadius = isVerySmallScreen
      ? ['35%', '60%']
      : isSmallScreen
      ? ['45%', '70%']
      : ['50%', '75%'] // Smaller radius on desktop to make room for legend

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          const percent = total ? ((params.value / total) * 100).toFixed(1) : 0
          return `
            <div style="padding: 8px; min-width: 180px;">
              <div style="font-weight: bold; margin-bottom: 6px; font-size: 13px; color: #333;">
                ${params.name}
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 4px;">
                <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${params.color}; margin-right: 8px;"></div>
                <span style="font-size: 12px; color: #666;">Value:</span>
              </div>
              <div style="font-weight: 600; font-size: 13px; color: ${params.color};">
                ${params.value} request(s) (${percent}%)
              </div>
            </div>
          `
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#ddd',
        borderWidth: 1,
        textStyle: {
          color: '#333',
          fontSize: 12,
        },
        extraCssText: `
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          border-radius: 6px;
        `,
      },
      legend: {
        type: isSmallScreen ? 'scroll' : 'plain',
        orient: isSmallScreen ? 'horizontal' : 'vertical',
        left: legendLeft,
        top: legendTop,
        bottom: legendBottom,
        align: 'left',
        itemWidth: 12,
        itemHeight: 12,
        itemGap: isSmallScreen ? 6 : 10,
        textStyle: {
          fontSize: isSmallScreen ? 10 : 11,
          color: '#666',
          fontWeight: 'normal',
        },
        // More compact legend on desktop
        formatter: function (name) {
          const item = processedData.find((d) => d.name === name)
          if (!item) return name
          const percent = total ? ((item.value / total) * 100).toFixed(1) : 0
          // Even shorter on very small screens
          if (isVerySmallScreen) {
            const shortName = name.split(' ')[0]
            return `${shortName}: ${item.value}`
          }
          // Compact format for desktop
          if (!isSmallScreen) {
            return `${name}: ${item.value}`
          }
          return `${name}: ${item.value} (${percent}%)`
        },
        // Add background for better visibility on small screens
        backgroundColor: isSmallScreen ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
        borderColor: isSmallScreen ? '#eee' : 'transparent',
        borderWidth: isSmallScreen ? 1 : 0,
        borderRadius: isSmallScreen ? 4 : 0,
        padding: isSmallScreen ? [5, 10] : [0, 0],
      },
      series: [
        {
          name: 'Cash Requests',
          type: 'pie',
          radius: pieRadius,
          center: [pieCenterX, '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'inside',
            formatter: function (params) {
              return `${((params.value / total) * 100).toFixed(0)}%`
            },
            fontSize: isSmallScreen ? 11 : 12,
            color: '#fff',
            fontWeight: 'bold',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          },
          labelLine: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: isSmallScreen ? 13 : 14,
              fontWeight: 'bold',
            },
            scale: true,
            scaleSize: 5,
          },
          data: processedData.map((item) => ({
            name: item.name,
            value: item.value,
            itemStyle: {
              color: item.color,
            },
          })),
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200
          },
        },
      ],
      graphic:
        total === 0
          ? [
              {
                type: 'text',
                left: 'center',
                top: '50%',
                style: {
                  text: 'No Data',
                  fill: '#999',
                  fontSize: 16,
                  fontWeight: 'bold',
                },
              },
            ]
          : [],
    }

    chartInstance.current.setOption(option)

    // Handle resize
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize()
      }
    }

    // Add resize observer for better responsiveness
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect()
    }

    resizeObserverRef.current = new ResizeObserver(handleResize)
    if (chartRef.current) {
      resizeObserverRef.current.observe(chartRef.current)
    }

    // Also handle window resize for fallback
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [data, sidebarOpen])

  // Initialize chart when data changes
  useEffect(() => {
    const cleanup = initChart()
    return cleanup
  }, [initChart])

  // Handle sidebar toggle
  useEffect(() => {
    const timer = setTimeout(() => {
      if (chartInstance.current) {
        chartInstance.current.resize()
        initChart()
      }
    }, 150)

    return () => clearTimeout(timer)
  }, [sidebarOpen, initChart])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose()
        chartInstance.current = null
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [])

  if (!data) {
    return (
      <div className="h-full w-full flex items-center justify-center p-4">
        <p className="text-gray-500">No Data Available</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <div
        ref={chartRef}
        style={{
          width: '100%',
          height: '280px',
          minHeight: '280px',
          transition: 'all 0.3s ease',
        }}
      />
    </div>
  )
}

export default CashrequestPiechart
