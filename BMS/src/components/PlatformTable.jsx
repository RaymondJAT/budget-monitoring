import { useState, useMemo } from 'react'
import {
  FaChevronUp,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaFilter,
  FaTimes,
} from 'react-icons/fa'

// Budget Monitoring Table Component
const PlatformTable = ({
  columns = [],
  data = [],
  title = 'Budget Monitoring',
  onRowClick,
  pagination = true,
  pageSize = 10,
  searchable = false,
  sortable = false,
  filterable = false,
  striped = true,
  bordered = true,
  hoverable = true,
  loading = false,
  emptyMessage = 'No budget data available',
  className = '',
}) => {
  // State management
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState({})
  const [showFilters, setShowFilters] = useState(false)

  // Calculate total pages
  const totalPages = Math.ceil(data.length / pageSize)

  // Filter data based on search term and filters
  const filteredData = useMemo(() => {
    let result = [...data]

    // Apply search
    if (searchTerm && searchable) {
      result = result.filter((row) =>
        columns.some((col) => {
          const value = col.accessor ? col.accessor(row) : row[col.key]
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        })
      )
    }

    // Apply filters
    if (Object.keys(activeFilters).length > 0) {
      result = result.filter((row) =>
        Object.entries(activeFilters).every(([key, filterValue]) => {
          if (!filterValue || filterValue === 'all') return true
          const cellValue = columns.find((c) => c.key === key)?.accessor
            ? columns.find((c) => c.key === key).accessor(row)
            : row[key]
          return cellValue?.toString().toLowerCase() === filterValue.toLowerCase()
        })
      )
    }

    return result
  }, [data, searchTerm, activeFilters, columns, searchable])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortable) return filteredData

    const sorted = [...filteredData].sort((a, b) => {
      const col = columns.find((c) => c.key === sortConfig.key)
      let aValue = col?.accessor ? col.accessor(a) : a[sortConfig.key]
      let bValue = col?.accessor ? col.accessor(b) : b[sortConfig.key]

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue)
      }
      return aValue - bValue
    })

    return sortConfig.direction === 'asc' ? sorted : sorted.reverse()
  }, [filteredData, sortConfig, columns, sortable])

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData
    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize, pagination])

  // Handle sort
  const handleSort = (key) => {
    if (!sortable) return

    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      setSortConfig({ key: null, direction: 'asc' })
      return
    }

    setSortConfig({ key, direction })
  }

  // Handle filter change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...activeFilters }
    if (value && value !== 'all') {
      newFilters[key] = value
    } else {
      delete newFilters[key]
    }
    setActiveFilters(newFilters)
  }

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    setCurrentPage(1)
  }

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({})
    setSearchTerm('')
    setShowFilters(false)
  }

  // Get unique values for filter dropdowns
  const getFilterOptions = (key) => {
    const col = columns.find((c) => c.key === key)
    if (!col || !col.filterable) return []

    const values = data.map((row) => (col.accessor ? col.accessor(row) : row[key]))
    return Array.from(new Set(values.filter(Boolean))).sort()
  }

  // Render cell content
  const renderCell = (row, column) => {
    if (column.render) {
      return column.render(row)
    }

    const value = column.accessor ? column.accessor(row) : row[column.key]

    // Budget-specific formats
    if (column.format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value || 0)
    }

    if (column.format === 'date') {
      return value ? new Date(value).toLocaleDateString() : '-'
    }

    if (column.format === 'percentage') {
      return `${(value || 0).toFixed(1)}%`
    }

    if (column.format === 'number') {
      return new Intl.NumberFormat().format(value || 0)
    }

    if (column.format === 'status') {
      const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        completed: 'bg-blue-100 text-blue-800',
        verified: 'bg-purple-100 text-purple-800',
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        on_track: 'bg-green-100 text-green-800',
        at_risk: 'bg-orange-100 text-orange-800',
        overspent: 'bg-red-100 text-red-800',
        under_budget: 'bg-blue-100 text-blue-800',
      }
      const colorClass = statusColors[value?.toLowerCase()] || 'bg-gray-100 text-gray-800'
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
          {value?.replace('_', ' ') || '-'}
        </span>
      )
    }

    if (column.format === 'variance') {
      const variance = value || 0
      const colorClass =
        variance > 0 ? 'text-green-600' : variance < 0 ? 'text-red-600' : 'text-gray-600'

      return (
        <span className={`font-medium ${colorClass}`}>
          {variance > 0 ? '+' : ''}
          {variance.toFixed(1)}%
        </span>
      )
    }

    return value || column.emptyValue || '-'
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow ${className}`}>
        {title && (
          <div className="px-6 py-4 border-b">
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((_, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header with title, search, and filters */}
      <div className="px-4 py-3 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
        </div>

        <div className="flex items-center space-x-3">
          {/* Search input */}
          {searchable && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm w-48"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center"
                >
                  <FaTimes className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          )}

          {/* Filter button */}
          {filterable && (
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg border text-sm ${
                  showFilters || Object.keys(activeFilters).length > 0
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaFilter className="h-3.5 w-3.5" />
                {Object.keys(activeFilters).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {Object.keys(activeFilters).length}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter dropdown */}
      {showFilters && filterable && (
        <div className="px-4 py-3 border-b bg-gray-50">
          <div className="flex flex-wrap gap-3">
            {columns
              .filter((col) => col.filterable)
              .map((col) => (
                <div key={col.key} className="flex-1 min-w-[180px]">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {col.header}
                  </label>
                  <select
                    value={activeFilters[col.key] || ''}
                    onChange={(e) => handleFilterChange(col.key, e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All {col.header}</option>
                    {getFilterOptions(col.key).map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5"
              >
                <FaTimes className="h-3 w-3" />
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active filters display */}
      {Object.keys(activeFilters).length > 0 && (
        <div className="px-4 py-2 border-b bg-blue-50">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-medium text-blue-700">Active Filters:</span>
            {Object.entries(activeFilters).map(([key, value]) => {
              const col = columns.find((c) => c.key === key)
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800"
                >
                  {col?.header}: {value}
                  <button
                    onClick={() => handleFilterChange(key, '')}
                    className="ml-1.5 text-blue-600 hover:text-blue-800"
                  >
                    <FaTimes className="h-2.5 w-2.5" />
                  </button>
                </span>
              )
            })}
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <FaTimes className="h-2.5 w-2.5" />
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y divide-gray-200 ${bordered ? 'border' : ''}`}>
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.className || ''
                  } ${
                    column.align === 'right'
                      ? 'text-right'
                      : column.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  }`}
                >
                  <div
                    className={`flex items-center ${
                      column.align === 'right'
                        ? 'justify-end'
                        : column.align === 'center'
                        ? 'justify-center'
                        : 'justify-start'
                    }`}
                  >
                    <span className="whitespace-nowrap">{column.header}</span>
                    {sortable && column.sortable !== false && (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="ml-1.5 p-0.5 hover:bg-gray-200 rounded"
                      >
                        {sortConfig.key === column.key ? (
                          sortConfig.direction === 'asc' ? (
                            <FaChevronUp className="h-3 w-3 text-blue-600" />
                          ) : (
                            <FaChevronDown className="h-3 w-3 text-blue-600" />
                          )
                        ) : (
                          <div className="flex flex-col -space-y-1">
                            <FaChevronUp className="h-2 w-2 text-gray-400" />
                            <FaChevronDown className="h-2 w-2 text-gray-400" />
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            className={`bg-white divide-y divide-gray-200 ${striped ? 'even:bg-gray-50' : ''}`}
          >
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`${hoverable ? 'hover:bg-gray-50 cursor-pointer' : ''} ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-3 text-sm whitespace-nowrap ${
                        column.cellClassName || ''
                      } ${
                        column.align === 'right'
                          ? 'text-right'
                          : column.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                      }`}
                    >
                      {renderCell(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-10 w-10 text-gray-300 mb-2">
                      <FaSearch className="h-full w-full" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">No results found</p>
                    <p className="text-xs text-gray-500 mt-0.5">{emptyMessage}</p>
                    {(searchTerm || Object.keys(activeFilters).length > 0) && (
                      <button
                        onClick={clearFilters}
                        className="mt-3 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1.5"
                      >
                        <FaTimes className="h-3 w-3" />
                        Clear filters and search
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && filteredData.length > pageSize && (
        <div className="px-4 py-3 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-gray-700 mb-3 sm:mb-0">
            Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, filteredData.length)}
            </span>{' '}
            of <span className="font-medium">{filteredData.length}</span> results
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <FaChevronLeft className="h-3 w-3" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-2.5 py-1 rounded text-xs ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <FaChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Pre-configured budget monitoring columns
export const budgetColumns = {
  // Basic budget overview
  basic: [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      filterable: true,
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      filterable: true,
    },
    {
      key: 'project',
      header: 'Project',
      sortable: true,
      filterable: true,
    },
    {
      key: 'allocated',
      header: 'Allocated Budget',
      format: 'currency',
      align: 'right',
      sortable: true,
    },
    {
      key: 'spent',
      header: 'Spent',
      format: 'currency',
      align: 'right',
      sortable: true,
    },
    {
      key: 'remaining',
      header: 'Remaining',
      format: 'currency',
      align: 'right',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      format: 'status',
      sortable: true,
      filterable: true,
    },
  ],

  // Detailed budget tracking
  detailed: [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      filterable: true,
    },
    {
      key: 'project',
      header: 'Project',
      sortable: true,
      filterable: true,
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      filterable: true,
    },
    {
      key: 'allocated',
      header: 'Allocated',
      format: 'currency',
      align: 'right',
      sortable: true,
    },
    {
      key: 'spent',
      header: 'Spent',
      format: 'currency',
      align: 'right',
      sortable: true,
    },
    {
      key: 'remaining',
      header: 'Remaining',
      format: 'currency',
      align: 'right',
      sortable: true,
    },
    {
      key: 'utilization',
      header: 'Utilization %',
      accessor: (row) => (row.allocated > 0 ? ((row.spent / row.allocated) * 100).toFixed(1) : 0),
      align: 'right',
      sortable: true,
      render: (row) => {
        const utilization = row.allocated > 0 ? (row.spent / row.allocated) * 100 : 0
        const colorClass =
          utilization > 90
            ? 'text-red-600'
            : utilization > 70
            ? 'text-orange-600'
            : 'text-green-600'
        return <span className={`font-medium ${colorClass}`}>{utilization.toFixed(1)}%</span>
      },
    },
    {
      key: 'status',
      header: 'Status',
      format: 'status',
      sortable: true,
      filterable: true,
    },
  ],

  // Budget requests
  requests: [
    {
      key: 'id',
      header: 'Request ID',
      sortable: true,
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      filterable: true,
    },
    {
      key: 'project',
      header: 'Project',
      sortable: true,
      filterable: true,
    },
    {
      key: 'amount',
      header: 'Amount',
      format: 'currency',
      align: 'right',
      sortable: true,
    },
    {
      key: 'purpose',
      header: 'Purpose',
      filterable: true,
    },
    {
      key: 'requested_by',
      header: 'Requested By',
      sortable: true,
      filterable: true,
    },
    {
      key: 'request_date',
      header: 'Request Date',
      format: 'date',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      format: 'status',
      sortable: true,
      filterable: true,
    },
  ],

  // Budget variance
  variance: [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      filterable: true,
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      filterable: true,
    },
    {
      key: 'budgeted',
      header: 'Budgeted',
      format: 'currency',
      align: 'right',
      sortable: true,
    },
    {
      key: 'actual',
      header: 'Actual',
      format: 'currency',
      align: 'right',
      sortable: true,
    },
    {
      key: 'variance',
      header: 'Variance',
      format: 'currency',
      align: 'right',
      sortable: true,
      render: (row) => {
        const variance = row.actual - row.budgeted
        const colorClass =
          variance > 0 ? 'text-red-600' : variance < 0 ? 'text-green-600' : 'text-gray-600'
        const sign = variance > 0 ? '+' : ''
        return (
          <span className={`font-medium ${colorClass}`}>
            {sign}
            {variance.toLocaleString()}
          </span>
        )
      },
    },
    {
      key: 'variance_percent',
      header: 'Variance %',
      format: 'variance',
      align: 'right',
      sortable: true,
      accessor: (row) =>
        row.budgeted > 0 ? ((row.actual - row.budgeted) / row.budgeted) * 100 : 0,
    },
  ],
}

// Helper function to create budget data
export const createBudgetData = (type = 'basic', count = 20) => {
  const departments = ['Finance', 'IT', 'Marketing', 'HR', 'Operations', 'Sales']
  const projects = [
    'Website Redesign',
    'Software Upgrade',
    'Marketing Campaign',
    'Office Renovation',
    'Training Program',
  ]
  const categories = ['Salaries', 'Equipment', 'Marketing', 'Travel', 'Software', 'Maintenance']
  const statuses = ['on_track', 'at_risk', 'overspent', 'under_budget']

  return Array.from({ length: count }, (_, i) => {
    const allocated = Math.floor(Math.random() * 50000) + 10000
    const spent = Math.floor(Math.random() * allocated * 1.2) // Can be over budget
    const remaining = allocated - spent

    const baseData = {
      id: `BGT${2024000 + i}`,
      department: departments[i % departments.length],
      project: projects[i % projects.length],
      allocated,
      spent,
      remaining,
      status: statuses[i % statuses.length],
    }

    if (type === 'detailed') {
      return {
        ...baseData,
        category: categories[i % categories.length],
      }
    }

    if (type === 'requests') {
      return {
        id: `REQ${2024000 + i}`,
        department: departments[i % departments.length],
        project: projects[i % projects.length],
        amount: Math.floor(Math.random() * 20000) + 1000,
        purpose: ['New equipment', 'Travel expenses', 'Software license', 'Marketing materials'][
          i % 4
        ],
        requested_by: ['John Doe', 'Jane Smith', 'Bob Wilson', 'Alice Johnson'][i % 4],
        request_date: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String(
          (i % 28) + 1
        ).padStart(2, '0')}`,
        status: ['pending', 'approved', 'rejected'][i % 3],
      }
    }

    if (type === 'variance') {
      const budgeted = Math.floor(Math.random() * 50000) + 10000
      const actual = budgeted * (0.8 + Math.random() * 0.4) // 80-120% of budget

      return {
        id: `VAR${2024000 + i}`,
        department: departments[i % departments.length],
        category: categories[i % categories.length],
        budgeted,
        actual: Math.round(actual),
      }
    }

    return baseData
  })
}

export default PlatformTable
