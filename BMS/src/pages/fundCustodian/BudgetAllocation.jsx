import { useMemo, useState } from 'react'
import PlatformTable from '../../components/PlatformTable'
import Cards from '../../components/Cards'
import { cardDataCustodian } from '../../data/cardData'

const budgetAllocationColumns = [
  {
    key: 'date',
    label: 'Date',
    sortable: true,
    width: '15%',
    align: 'center',
    render: (value) => {
      const date = new Date(value)
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })

      return <span className="text-gray-700 font-medium">{formattedDate}</span>
    },
  },
  {
    key: 'department',
    label: 'Department',
    sortable: true,
    width: '25%',
    align: 'left',
    render: (value) => <span className="font-medium text-gray-800">{value}</span>,
  },
  {
    key: 'allocatedBudget',
    label: 'Allocated Budget',
    sortable: true,
    width: '15%',
    align: 'right',
    render: (value) => (
      <span className="font-semibold text-blue-700">₱{value.toLocaleString()}</span>
    ),
  },
  {
    key: 'usedAmount',
    label: 'Used Amount',
    sortable: true,
    width: '15%',
    align: 'right',
    render: (value) => (
      <span className="font-semibold text-green-700">₱{value.toLocaleString()}</span>
    ),
  },
  {
    key: 'remaining',
    label: 'Remaining',
    sortable: true,
    width: '15%',
    align: 'right',
    render: (value, row) => {
      const isNegative = value < 0
      const isLow = value < row.allocatedBudget * 0.1

      let textColor = 'text-green-700'
      if (isNegative) {
        textColor = 'text-red-700'
      } else if (isLow) {
        textColor = 'text-amber-700'
      }

      return <span className={`font-semibold ${textColor}`}>₱{value.toLocaleString()}</span>
    },
  },
  {
    key: 'utilization',
    label: 'Utilization (%)',
    sortable: true,
    width: '15%',
    align: 'center',
    render: (value) => {
      let bgColor = 'bg-green-100'
      let textColor = 'text-green-800'

      if (value > 100) {
        bgColor = 'bg-red-100'
        textColor = 'text-red-800'
      } else if (value > 90) {
        bgColor = 'bg-amber-100'
        textColor = 'text-amber-800'
      } else if (value < 30) {
        bgColor = 'bg-blue-100'
        textColor = 'text-blue-800'
      }

      return (
        <div className="flex flex-col items-center">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>
            {value.toFixed(1)}%
          </span>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
            <div
              className={`h-full ${
                value > 100 ? 'bg-red-500' : value > 90 ? 'bg-amber-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(value, 100)}%` }}
            />
          </div>
        </div>
      )
    },
  },
]

const createBudgetAllocationData = (count) => {
  const departments = [
    'Sales',
    'Human Resources',
    'Finance',
    'Information Technology',
    'Research & Development',
    'Administration',
  ]

  const generateRandomDate = () => {
    const start = new Date()
    start.setDate(start.getDate() - 365)
    const end = new Date()

    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))

    return randomDate.toISOString().split('T')[0]
  }

  return Array.from({ length: count }, (_, i) => {
    const allocatedBudget = Math.floor(Math.random() * 2000000) + 500000
    const utilizationRate = Math.random() * 120
    const usedAmount = Math.floor((allocatedBudget * utilizationRate) / 100)
    const remaining = allocatedBudget - usedAmount

    return {
      id: i + 1,
      date: generateRandomDate(),
      department: departments[i % departments.length],
      allocatedBudget: allocatedBudget,
      usedAmount: usedAmount,
      remaining: remaining,
      utilization: utilizationRate,
      status: ['Active', 'Completed', 'Overspent', 'Underutilized'][Math.floor(Math.random() * 4)],
      manager: `Manager ${String.fromCharCode(65 + (i % 26))}`,
      fiscalYear: '2024',
    }
  })
}

const BudgetAllocation = () => {
  const [sortKey, setSortKey] = useState('date')
  const [sortDirection, setSortDirection] = useState('asc')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [budgetTypeFilter, setBudgetTypeFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const budgetData = useMemo(() => createBudgetAllocationData(25), [])

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...budgetData]

    // department filter
    if (departmentFilter) {
      filtered = filtered.filter((item) => item.department === departmentFilter)
    }

    // search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.department.toLowerCase().includes(query) ||
          item.manager.toLowerCase().includes(query) ||
          item.fiscalYear.toLowerCase().includes(query)
      )
    }

    // sorting
    return filtered.sort((a, b) => {
      if (sortKey === 'date') {
        const dateA = new Date(a[sortKey])
        const dateB = new Date(b[sortKey])
        if (dateA < dateB) return sortDirection === 'asc' ? -1 : 1
        if (dateA > dateB) return sortDirection === 'asc' ? 1 : -1
        return 0
      }

      if (['allocatedBudget', 'usedAmount', 'remaining', 'utilization'].includes(sortKey)) {
        if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
        if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
        return 0
      }

      if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [budgetData, sortKey, sortDirection, departmentFilter, budgetTypeFilter, searchQuery])

  const handleSort = (key) => {
    setSortDirection((prev) => (sortKey === key && prev === 'asc' ? 'desc' : 'asc'))
    setSortKey(key)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 p-3">
        <div className="mt-3">
          <Cards cardData={cardDataCustodian} />
        </div>

        <div className="bg-component shadow-lg rounded-lg border border-slate-400 mb-3">
          <div className="px-4 py-1">
            <h1 className="text-2xl font-bold text-gray-800">Budget Allocation & Utilization</h1>
            <p className="text-gray-600">Monitor department budgets and spending patterns</p>
          </div>

          {/* Action buttons and filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 pb-2 gap-3">
            <div className="flex flex-wrap gap-2">
              <select
                className="px-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                {Array.from(new Set(budgetData.map((item) => item.department))).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <select
                className="px-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm"
                value={budgetTypeFilter}
                onChange={(e) => setBudgetTypeFilter(e.target.value)}
              >
                <option value="">All Budget Types</option>
                <option value="Annual">Annual</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Monthly">Monthly</option>
                <option value="Project">Project</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search department, manager, or fiscal year..."
                className="px-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setSearchQuery('')}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table container */}
        <div className="h-[calc(100vh-480px)] lg:h-[calc(100vh-450px)] xl:h-[calc(100vh-360px)] overflow-hidden">
          <div className="bg-component shadow-lg rounded-lg border border-slate-400 h-full flex flex-col p-2">
            <PlatformTable
              columns={budgetAllocationColumns}
              data={filteredAndSortedData}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
              maxHeight="calc(100% - 60px)"
              title="Budget Allocation Details"
              responsive={true}
              containerClassName="h-full"
              onView={(row) => console.log('View budget details:', row)}
              actionButtonProps={{
                viewLabel: 'View Details',
                showView: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BudgetAllocation
