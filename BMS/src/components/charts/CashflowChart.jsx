import { useState, useEffect, useRef, useCallback } from 'react'
import * as echarts from 'echarts'

const CashFlowChart = ({ startDate, endDate, sidebarOpen }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [reportDate, setReportDate] = useState('')
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const resizeObserverRef = useRef(null)

  // Mock data for Cash and GCash revolving funds for each day
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

      // Cash Revolving Fund
      const cashTotalFund = 1500000 + Math.random() * 500000
      const cashLiquidated = cashTotalFund * 0.55 + Math.random() * 100000
      const cashUnliquidated = cashTotalFund - cashLiquidated

      // GCash Revolving Fund
      const gcashTotalFund = 1000000 + Math.random() * 400000
      const gcashLiquidated = gcashTotalFund * 0.6 + Math.random() * 80000
      const gcashUnliquidated = gcashTotalFund - gcashLiquidated

      // Day totals (Cash + GCash)
      const dayTotalFund = cashTotalFund + gcashTotalFund
      const dayTotalLiquidated = cashLiquidated + gcashLiquidated
      const dayTotalUnliquidated = cashUnliquidated + gcashUnliquidated

      mockData.push({
        // Cash Fund data
        cashLiquidated: Math.round(cashLiquidated),
        cashUnliquidated: Math.round(cashUnliquidated),

        // GCash Fund data
        gcashLiquidated: Math.round(gcashLiquidated),
        gcashUnliquidated: Math.round(gcashUnliquidated),

        // Day totals (for the chart)
        totalFund: Math.round(dayTotalFund),
        totalLiquidated: Math.round(dayTotalLiquidated),
        totalUnliquidated: Math.round(dayTotalUnliquidated),

        // Date info
        dateKey,
        dateLabel,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      })
    }

    return mockData
  }

  // Initialize and update chart
  const initChart = useCallback(() => {
    if (!chartRef.current || data.length === 0) return

    // Dispose existing instance if it exists
    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    // Initialize ECharts instance
    chartInstance.current = echarts.init(chartRef.current)

    const dates = data.map((item) => item.dateLabel)

    // Calculate responsive values based on container width
    const containerWidth = chartRef.current?.clientWidth || 600
    const isSmallScreen = containerWidth < 500
    const isMediumScreen = containerWidth < 700

    const option = {
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#ddd',
        borderWidth: 1,
        textStyle: {
          color: '#333',
          fontSize: isSmallScreen ? 10 : 12,
        },
        extraCssText: `
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          border-radius: 6px;
        `,
        formatter: function (params) {
          const dateData = data[params.dataIndex]
          if (!dateData) return ''

          const seriesName = params.seriesName
          const value = params.value

          if (seriesName === 'Total Fund') {
            return `
              <div style="padding: ${isSmallScreen ? '8px' : '10px'};">
                <div style="font-weight: bold; margin-bottom: ${
                  isSmallScreen ? '6px' : '8px'
                }; font-size: ${isSmallScreen ? '12px' : '14px'}; color: #333;">
                  ${dateData.dateLabel}, ${dateData.year}
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 4px;">
                  <div style="width: 10px; height: 10px; border-radius: 50%; background-color: #1c6b1e; margin-right: 8px;"></div>
                  <span style="font-size: ${
                    isSmallScreen ? '11px' : '12px'
                  }; color: #666;">Total Fund:</span>
                </div>
                <div style="font-weight: 600; font-size: ${
                  isSmallScreen ? '12px' : '14px'
                }; color: #15803d;">
                  ₱${dateData.totalFund.toLocaleString()}
                </div>
              </div>
            `
          }

          // Check if it's a Cash series
          if (seriesName.includes('Cash') && !seriesName.includes('GCash')) {
            const isLiquidated = seriesName.includes('Liquidated')
            const amount = isLiquidated ? dateData.cashLiquidated : dateData.cashUnliquidated
            const color = isLiquidated ? '#2464c9' : '#f2950a'
            const label = isLiquidated ? 'Liquidated' : 'Unliquidated'

            return `
              <div style="padding: ${isSmallScreen ? '8px' : '10px'};">
                <div style="font-weight: bold; margin-bottom: ${
                  isSmallScreen ? '6px' : '8px'
                }; font-size: ${isSmallScreen ? '12px' : '14px'}; color: #333;">
                  ${dateData.dateLabel}, ${dateData.year}
                </div>
                <div style="font-weight: 600; color: #666; margin-bottom: ${
                  isSmallScreen ? '4px' : '6px'
                }; font-size: ${isSmallScreen ? '11px' : '12px'}">
                  Cash Revolving Fund
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 4px;">
                  <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${color}; margin-right: 8px;"></div>
                  <span style="font-size: ${
                    isSmallScreen ? '11px' : '12px'
                  }; color: #666;">${label}:</span>
                </div>
                <div style="font-weight: 600; font-size: ${
                  isSmallScreen ? '12px' : '14px'
                }; color: ${color};">
                  ₱${amount.toLocaleString()}
                </div>
              </div>
            `
          }

          // Check if it's a GCash series
          if (seriesName.includes('GCash')) {
            const isLiquidated = seriesName.includes('Liquidated')
            const amount = isLiquidated ? dateData.gcashLiquidated : dateData.gcashUnliquidated
            const color = isLiquidated ? '#3b82f6' : '#f97316'
            const label = isLiquidated ? 'Liquidated' : 'Unliquidated'

            return `
              <div style="padding: ${isSmallScreen ? '8px' : '10px'};">
                <div style="font-weight: bold; margin-bottom: ${
                  isSmallScreen ? '6px' : '8px'
                }; font-size: ${isSmallScreen ? '12px' : '14px'}; color: #333;">
                  ${dateData.dateLabel}, ${dateData.year}
                </div>
                <div style="font-weight: 600; color: #666; margin-bottom: ${
                  isSmallScreen ? '4px' : '6px'
                }; font-size: ${isSmallScreen ? '11px' : '12px'}">
                  GCash Revolving Fund
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 4px;">
                  <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${color}; margin-right: 8px;"></div>
                  <span style="font-size: ${
                    isSmallScreen ? '11px' : '12px'
                  }; color: #666;">${label}:</span>
                </div>
                <div style="font-weight: 600; font-size: ${
                  isSmallScreen ? '12px' : '14px'
                }; color: ${color};">
                  ₱${amount.toLocaleString()}
                </div>
              </div>
            `
          }

          return ''
        },
      },
      legend: {
        data: [
          'Total Fund',
          'Cash Liquidated',
          'Cash Unliquidated',
          'GCash Liquidated',
          'GCash Unliquidated',
        ],
        type: isSmallScreen ? 'scroll' : 'plain',
        bottom: 0,
        textStyle: {
          fontSize: isSmallScreen ? 9 : 11,
        },
        itemWidth: isSmallScreen ? 12 : 14,
        itemHeight: isSmallScreen ? 8 : 10,
        itemGap: isSmallScreen ? 5 : 10,
        pageIconSize: isSmallScreen ? 8 : 10,
      },
      grid: {
        left: isSmallScreen ? '8%' : '3%',
        right: isSmallScreen ? '8%' : '4%',
        bottom: isSmallScreen ? '18%' : '15%',
        top: '10%',
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {
            title: 'Save as Image',
            pixelRatio: 2,
          },
          dataView: {
            title: 'Data View',
            readOnly: true,
            lang: ['Data View', 'Close', 'Refresh'],
          },
          magicType: {
            show: true,
            type: ['line', 'bar', 'stack'],
            title: {
              line: 'Switch to Line',
              bar: 'Switch to Bar',
              stack: 'Switch to Stack',
            },
          },
          restore: {
            show: true,
            title: 'Restore',
          },
        },
        right: '2%',
        top: '2%',
        iconStyle: {
          borderWidth: 0.5,
        },
        emphasis: {
          iconStyle: {
            borderWidth: 1,
          },
        },
        itemSize: isSmallScreen ? 14 : 16,
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisPointer: {
          type: 'shadow',
        },
        axisLabel: {
          rotate: isSmallScreen ? 60 : 45,
          fontSize: isSmallScreen ? 9 : 11,
          margin: isSmallScreen ? 20 : 15,
          interval: 0,
        },
        axisTick: {
          alignWithLabel: true,
          show: !isSmallScreen,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: function (value) {
            if (isSmallScreen && value >= 1000000) {
              return `₱${(value / 1000000).toFixed(1)}M`
            }
            return `₱${(value / 1000).toFixed(0)}K`
          },
          fontSize: isSmallScreen ? 9 : 11,
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            opacity: 0.7,
          },
        },
      },
      series: [
        {
          name: 'Total Fund',
          type: 'line',
          smooth: true,
          lineStyle: {
            width: isSmallScreen ? 2 : 3,
            color: '#1c6b1e',
          },
          itemStyle: {
            color: '#1c6b1e',
          },
          symbolSize: isSmallScreen ? 6 : 8,
          data: data.map((item) => item.totalFund),
        },
        {
          name: 'Cash Liquidated',
          type: 'bar',
          stack: 'cash',
          barWidth: isSmallScreen ? '20%' : '30%',
          barGap: '30%',
          barCategoryGap: '40%',
          itemStyle: {
            color: '#2464c9',
          },
          emphasis: {
            focus: 'self',
          },
          data: data.map((item) => item.cashLiquidated),
        },
        {
          name: 'Cash Unliquidated',
          type: 'bar',
          stack: 'cash',
          barWidth: isSmallScreen ? '20%' : '30%',
          itemStyle: {
            color: '#f2950a',
          },
          emphasis: {
            focus: 'self',
          },
          data: data.map((item) => item.cashUnliquidated),
        },
        {
          name: 'GCash Liquidated',
          type: 'bar',
          stack: 'gcash',
          barWidth: isSmallScreen ? '20%' : '30%',
          itemStyle: {
            color: '#3b82f6',
          },
          emphasis: {
            focus: 'self',
          },
          data: data.map((item) => item.gcashLiquidated),
        },
        {
          name: 'GCash Unliquidated',
          type: 'bar',
          stack: 'gcash',
          barWidth: isSmallScreen ? '20%' : '30%',
          itemStyle: {
            color: '#f97316',
          },
          emphasis: {
            focus: 'self',
          },
          data: data.map((item) => item.gcashUnliquidated),
        },
      ],
      animation: true,
      animationDuration: 500,
      animationEasing: 'cubicOut',
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
  }, [data])

  // Initialize chart when data changes
  useEffect(() => {
    const cleanup = initChart()
    return cleanup
  }, [initChart])

  // Handle sidebar toggle - only resize, don't reinitialize
  useEffect(() => {
    const timer = setTimeout(() => {
      if (chartInstance.current) {
        chartInstance.current.resize()
      }
    }, 150)

    return () => clearTimeout(timer)
  }, [sidebarOpen]) // Remove initChart from dependencies

  useEffect(() => {
    // Use generated mock data
    const mockData = generateMockData()
    setData(mockData)

    if (mockData.length > 0) {
      const monthName = new Date(0, mockData[0].month - 1).toLocaleString('default', {
        month: 'long',
      })
      setReportDate(`${monthName} ${mockData[0].year}`)
    }

    setLoading(false)
  }, [startDate, endDate])

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

  // Show loader only for first load
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
    <div className="h-full w-full bg-white rounded-sm border border-slate-400 flex flex-col">
      <div className="p-4 shrink-0">
        <div className="text-center mb-3">
          <p className="font-bold mb-0">Cash Flow Overview</p>
          {reportDate && <small className="text-gray-500">Reporting Period: {reportDate}</small>}
        </div>
      </div>

      {/* Chart container */}
      <div className="flex-1 min-h-0 px-3 sm:px-4 pb-3 sm:pb-4">
        <div
          ref={chartRef}
          style={{
            width: '100%',
            height: '100%',
            minHeight: '200px',
            transition: 'all 0.3s ease',
          }}
        />
      </div>
    </div>
  )
}

export default CashFlowChart
