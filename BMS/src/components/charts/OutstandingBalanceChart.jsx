import { useState, useEffect, useRef, useCallback } from 'react'
import * as echarts from 'echarts'

const OutstandingBalanceChart = ({ startDate, endDate }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const resizeObserverRef = useRef(null)

  // Mock data for revolving fund summary
  const generateMockData = () => {
    const baseDate = new Date(2024, 0, 1) // Jan 1, 2024
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
        year: 'numeric',
      })

      // Generate random values for each day
      const totalIssued = 2000000 + Math.random() * 1000000
      const totalLiquidated = totalIssued * (0.4 + Math.random() * 0.4) // 40-80% liquidated
      const totalUnliquidated = totalIssued - totalLiquidated

      mockData.push({
        start_date: dateKey,
        total_issued: Math.round(totalIssued),
        total_liquidated: Math.round(totalLiquidated),
        total_unliquidated: Math.round(totalUnliquidated),
        dateKey,
        dateLabel,
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

    // Calculate responsive values
    const containerWidth = chartRef.current?.clientWidth || 600
    const isSmallScreen = containerWidth < 500

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#ddd',
        borderWidth: 1,
        textStyle: {
          color: '#333',
          fontSize: isSmallScreen ? 10 : 12,
        },
        formatter: function (params) {
          const dateData = data[params[0].dataIndex]
          if (!dateData) return ''

          return `
            <div style="padding: ${isSmallScreen ? '8px' : '10px'}; min-width: ${
            isSmallScreen ? '200px' : '250px'
          };">
              <div style="font-weight: bold; margin-bottom: ${
                isSmallScreen ? '8px' : '10px'
              }; font-size: ${isSmallScreen ? '12px' : '14px'}; color: #333;">
                ${dateData.dateLabel}
              </div>
              
              <div style="margin-bottom: ${isSmallScreen ? '8px' : '10px'}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <div style="display: flex; align-items: center;">
                    <div style="width: 10px; height: 10px; border-radius: 50%; background-color: #1c6b1e; margin-right: 8px;"></div>
                    <span style="font-size: ${
                      isSmallScreen ? '11px' : '12px'
                    }; color: #666;">Total Issued:</span>
                  </div>
                  <span style="font-weight: 600; font-size: ${
                    isSmallScreen ? '11px' : '12px'
                  }; color: #15803d;">₱${Number(dateData.total_issued).toLocaleString()}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <div style="display: flex; align-items: center;">
                    <div style="width: 10px; height: 10px; border-radius: 50%; background-color: #2464c9; margin-right: 8px;"></div>
                    <span style="font-size: ${
                      isSmallScreen ? '11px' : '12px'
                    }; color: #666;">Total Liquidated:</span>
                  </div>
                  <span style="font-weight: 600; font-size: ${
                    isSmallScreen ? '11px' : '12px'
                  }; color: #1d4ed8;">₱${Number(dateData.total_liquidated).toLocaleString()}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div style="display: flex; align-items: center;">
                    <div style="width: 10px; height: 10px; border-radius: 50%; background-color: #f2950a; margin-right: 8px;"></div>
                    <span style="font-size: ${
                      isSmallScreen ? '11px' : '12px'
                    }; color: #666;">Total Unliquidated:</span>
                  </div>
                  <span style="font-weight: 600; font-size: ${
                    isSmallScreen ? '11px' : '12px'
                  }; color: #b45309;">₱${Number(
            dateData.total_unliquidated
          ).toLocaleString()}</span>
                </div>
              </div>
              
              <div style="border-top: 1px solid #eee; padding-top: ${
                isSmallScreen ? '8px' : '10px'
              }">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: ${
                    isSmallScreen ? '11px' : '12px'
                  }; color: #666; font-weight: 600;">Outstanding Balance:</span>
                  <span style="font-weight: 600; font-size: ${
                    isSmallScreen ? '12px' : '13px'
                  }; color: #7c3aed;">
                    ₱${Number(dateData.total_unliquidated).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          `
        },
      },
      legend: {
        data: ['Total Issued', 'Total Liquidated', 'Total Unliquidated'],
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
            type: ['line', 'bar'],
            title: {
              line: 'Line Chart',
              bar: 'Bar Chart',
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
          name: 'Total Issued',
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
          data: data.map((item) => item.total_issued),
        },
        {
          name: 'Total Liquidated',
          type: 'line',
          smooth: true,
          lineStyle: {
            width: isSmallScreen ? 2 : 3,
            color: '#2464c9',
          },
          itemStyle: {
            color: '#2464c9',
          },
          symbolSize: isSmallScreen ? 6 : 8,
          data: data.map((item) => item.total_liquidated),
        },
        {
          name: 'Total Unliquidated',
          type: 'line',
          smooth: true,
          lineStyle: {
            width: isSmallScreen ? 2 : 3,
            color: '#f2950a',
          },
          itemStyle: {
            color: '#f2950a',
          },
          symbolSize: isSmallScreen ? 6 : 8,
          data: data.map((item) => item.total_unliquidated),
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

  // Initialize with mock data
  useEffect(() => {
    setLoading(true)
    const mockData = generateMockData()
    setData(mockData)
    setLoading(false)
  }, [startDate, endDate])

  // Initialize chart when data changes
  useEffect(() => {
    const cleanup = initChart()
    return cleanup
  }, [initChart])

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

  // Loading / Empty states
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
    <div className="h-full w-full bg-white rounded-sm border border-slate-400 flex flex-col">
      <div className="p-4 shrink-0">
        <div className="text-center mb-3">
          <p className="font-bold mb-0">Revolving Fund Summary</p>
          <small className="text-gray-500">Outstanding Balance Overview</small>
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

export default OutstandingBalanceChart
