import { useMemo, useState } from 'react'
import PlatformTable from '../../components/PlatformTable'
import Cards from '../../components/Cards'

const revolvingFundColumns = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    align: 'center',
    minWidth: '80px',
    render: (value) => (
      <span className="font-medium text-gray-800 text-sm">{value.toString().padStart(3, '0')}</span>
    ),
  },
  {
    key: 'budgetName',
    label: 'Budget Name',
    sortable: true,
    align: 'left',
    minWidth: '150px',
    render: (value) => <span className="font-medium text-gray-800 text-sm">{value}</span>,
  },
  {
    key: 'startDate',
    label: 'Start',
    sortable: true,
    align: 'center',
    minWidth: '100px',
    render: (value) => {
      const date = new Date(value)
      return (
        <span className="text-gray-700 text-xs">
          {date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: '2-digit' })}
        </span>
      )
    },
  },
  {
    key: 'endDate',
    label: 'End',
    sortable: true,
    align: 'center',
    minWidth: '100px',
    render: (value) => {
      const date = new Date(value)
      return (
        <span className="text-gray-700 text-xs">
          {date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: '2-digit' })}
        </span>
      )
    },
  },
  {
    key: 'beginning',
    label: 'Beginning',
    sortable: true,
    align: 'right',
    minWidth: '100px',
    render: (value) => (
      <span className="font-semibold text-blue-700 text-sm">₱{value.toLocaleString()}</span>
    ),
  },
  {
    key: 'added',
    label: 'Added',
    sortable: true,
    align: 'right',
    minWidth: '90px',
    render: (value) => (
      <span className="font-semibold text-green-700 text-sm">₱{value.toLocaleString()}</span>
    ),
  },
  {
    key: 'totalFund',
    label: 'Total',
    sortable: true,
    align: 'right',
    minWidth: '100px',
    render: (value) => (
      <span className="font-semibold text-purple-700 text-sm">₱{value.toLocaleString()}</span>
    ),
  },
  {
    key: 'issued',
    label: 'Issued',
    sortable: true,
    align: 'right',
    minWidth: '90px',
    render: (value) => (
      <span className="font-semibold text-amber-700 text-sm">₱{value.toLocaleString()}</span>
    ),
  },
  {
    key: 'returned',
    label: 'Returned',
    sortable: true,
    align: 'right',
    minWidth: '100px',
    render: (value) => (
      <span className="font-semibold text-teal-700 text-sm">₱{value.toLocaleString()}</span>
    ),
  },
  {
    key: 'outstanding',
    label: 'Outstanding',
    sortable: true,
    align: 'right',
    minWidth: '110px',
    render: (value) => {
      let textColor = 'text-gray-700'
      if (value > 0) {
        textColor = 'text-red-700'
      }
      return <span className={`font-semibold ${textColor} text-sm`}>₱{value.toLocaleString()}</span>
    },
  },
  {
    key: 'amountExpended',
    label: 'Expended',
    sortable: true,
    align: 'right',
    minWidth: '100px',
    render: (value) => (
      <span className="font-semibold text-rose-700 text-sm">₱{value.toLocaleString()}</span>
    ),
  },
  {
    key: 'ended',
    label: 'Ended',
    sortable: true,
    align: 'right',
    minWidth: '90px',
    render: (value) => (
      <span className="font-semibold text-indigo-700 text-sm">₱{value.toLocaleString()}</span>
    ),
  },
  {
    key: 'liquidated',
    label: 'Liquidated',
    sortable: true,
    align: 'right',
    minWidth: '110px',
    render: (value) => (
      <span className="font-semibold text-emerald-700 text-sm">₱{value.toLocaleString()}</span>
    ),
  },
  {
    key: 'unliquidated',
    label: 'Unliquidated',
    sortable: true,
    align: 'right',
    minWidth: '110px',
    render: (value) => {
      let textColor = 'text-gray-700'
      if (value > 0) {
        textColor = 'text-amber-700'
      }
      return <span className={`font-semibold ${textColor} text-sm`}>₱{value.toLocaleString()}</span>
    },
  },
  {
    key: 'balance',
    label: 'Balance',
    sortable: true,
    align: 'right',
    minWidth: '100px',
    render: (value) => {
      let textColor = 'text-green-700'
      if (value < 0) {
        textColor = 'text-red-700'
      } else if (value < 10000) {
        textColor = 'text-amber-700'
      }
      return <span className={`font-semibold ${textColor} text-sm`}>₱{value.toLocaleString()}</span>
    },
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    align: 'center',
    minWidth: '120px',
    render: (value) => {
      let bgColor = 'bg-gray-100'
      let textColor = 'text-gray-800'
      let borderColor = 'border-gray-300'

      switch (value) {
        case 'Open':
          bgColor = 'bg-blue-50'
          textColor = 'text-blue-800'
          borderColor = 'border-blue-200'
          break
        case 'On Review':
          bgColor = 'bg-yellow-50'
          textColor = 'text-yellow-800'
          borderColor = 'border-yellow-200'
          break
        case 'Cleared':
          bgColor = 'bg-green-50'
          textColor = 'text-green-800'
          borderColor = 'border-green-200'
          break
        case 'Closed':
          bgColor = 'bg-gray-100'
          textColor = 'text-gray-800'
          borderColor = 'border-gray-300'
          break
        default:
          bgColor = 'bg-gray-100'
          textColor = 'text-gray-800'
          borderColor = 'border-gray-300'
      }

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold border ${bgColor} ${textColor} ${borderColor}`}
        >
          {value}
        </span>
      )
    },
  },
]

const createRevolvingFundData = (count) => {
  const budgetNames = [
    'Petty Cash Fund',
    'Emergency Fund',
    'Travel Fund',
    'Office Supplies Fund',
    'Maintenance Fund',
    'Marketing Fund',
    'Training Fund',
    'Utilities Fund',
    'Equipment Fund',
    'Contingency Fund',
    'Project Alpha Fund',
    'Client Entertainment Fund',
    'Research Fund',
    'Team Building Fund',
    'Conference Fund',
  ]

  // Generate random dates
  const generateRandomDate = (startOffset = 0, endOffset = 365) => {
    const start = new Date()
    start.setDate(start.getDate() - endOffset)
    const end = new Date()
    end.setDate(end.getDate() - startOffset)

    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    return randomDate.toISOString().split('T')[0]
  }

  return Array.from({ length: count }, (_, i) => {
    const beginning = Math.floor(Math.random() * 50000) + 10000
    const added = Math.floor(Math.random() * 30000) + 5000
    const totalFund = beginning + added
    const issued = Math.floor(totalFund * (Math.random() * 0.7 + 0.3))
    const returned = Math.floor(issued * (Math.random() * 0.4))
    const outstanding = Math.max(0, issued - returned)
    const amountExpended = Math.floor(issued * (Math.random() * 0.8 + 0.1))
    const ended = Math.floor(Math.random() * 10000)
    const liquidated = Math.floor(amountExpended * (Math.random() * 0.7 + 0.2))
    const unliquidated = Math.max(0, amountExpended - liquidated)
    const balance = totalFund - issued - ended

    const statuses = ['Open', 'On Review', 'Cleared', 'Closed']
    const statusWeights = [0.3, 0.2, 0.3, 0.2]
    const randomStatus = Math.random()
    let statusIndex = 0
    let cumulative = 0

    for (let j = 0; j < statusWeights.length; j++) {
      cumulative += statusWeights[j]
      if (randomStatus <= cumulative) {
        statusIndex = j
        break
      }
    }

    const startDate = generateRandomDate(180, 365)
    const endDate = generateRandomDate(0, 180)

    return {
      id: i + 1,
      budgetName: budgetNames[i % budgetNames.length],
      startDate: startDate,
      endDate: endDate,
      beginning: beginning,
      added: added,
      totalFund: totalFund,
      issued: issued,
      returned: returned,
      outstanding: outstanding,
      amountExpended: amountExpended,
      ended: ended,
      liquidated: liquidated,
      unliquidated: unliquidated,
      balance: balance,
      status: statuses[statusIndex],
      department: ['Finance', 'HR', 'IT', 'Operations', 'Marketing'][i % 5],
      custodian: `Custodian ${String.fromCharCode(65 + (i % 26))}`,
      fiscalYear: '2024',
    }
  })
}

const RevolvingFund = () => {
  const [sortKey, setSortKey] = useState('id')
  const [sortDirection, setSortDirection] = useState('asc')
  const [statusFilter, setStatusFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const revolvingFundData = useMemo(() => createRevolvingFundData(30), [])

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...revolvingFundData]

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    // Apply department filter
    if (departmentFilter) {
      filtered = filtered.filter((item) => item.department === departmentFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.budgetName.toLowerCase().includes(query) ||
          item.custodian.toLowerCase().includes(query) ||
          item.department.toLowerCase().includes(query) ||
          `rf-${item.id.toString().padStart(4, '0')}`.includes(query)
      )
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortKey === 'startDate' || sortKey === 'endDate') {
        const dateA = new Date(a[sortKey])
        const dateB = new Date(b[sortKey])
        if (dateA < dateB) return sortDirection === 'asc' ? -1 : 1
        if (dateA > dateB) return sortDirection === 'asc' ? 1 : -1
        return 0
      }

      const numericFields = [
        'beginning',
        'added',
        'totalFund',
        'issued',
        'returned',
        'outstanding',
        'amountExpended',
        'ended',
        'liquidated',
        'unliquidated',
        'balance',
      ]
      if (numericFields.includes(sortKey)) {
        if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
        if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
        return 0
      }

      if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [revolvingFundData, sortKey, sortDirection, statusFilter, departmentFilter, searchQuery])

  const handleSort = (key) => {
    setSortDirection((prev) => (sortKey === key && prev === 'asc' ? 'desc' : 'asc'))
    setSortKey(key)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 p-3">
        <div className="mt-3">
          <Cards />
        </div>

        <div className="bg-component shadow-lg rounded-lg border border-slate-400 mb-3">
          <div className="px-4 py-1">
            <h1 className="text-2xl font-bold text-gray-800">Revolving Fund Management</h1>
            <p className="text-gray-600">Track and manage revolving funds across departments</p>
          </div>

          {/* Action buttons and filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 pb-2 gap-3">
            <div className="flex flex-wrap gap-2">
              <select
                className="px-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Open">Open</option>
                <option value="On Review">On Review</option>
                <option value="Cleared">Cleared</option>
                <option value="Closed">Closed</option>
              </select>
              <select
                className="px-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                {Array.from(new Set(revolvingFundData.map((item) => item.department))).map(
                  (dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search budget name, custodian, or department..."
                className="px-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table container */}
        <div className="h-[calc(100vh-480px)] lg:h-[calc(100vh-450px)] xl:h-[calc(100vh-360px)] overflow-hidden">
          <div className="bg-component shadow-lg rounded-lg border border-slate-400 h-full flex flex-col p-2">
            <div className="overflow-x-auto overflow-y-auto h-full">
              <PlatformTable
                columns={revolvingFundColumns}
                data={filteredAndSortedData}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
                maxHeight="none"
                title="Revolving Fund Details"
                responsive={true}
                containerClassName="h-full"
                tableClassName="w-full table-auto"
                headerClassName="sticky top-0 bg-white z-10"
                cellClassName="whitespace-nowrap"
                onView={(row) => console.log('View revolving fund details:', row)}
                onEdit={(row) => console.log('Edit revolving fund:', row)}
                onDelete={(row) => console.log('Close revolving fund:', row)}
                actionButtonProps={{
                  viewLabel: 'View',
                  editLabel: 'Edit',
                  deleteLabel: 'Close',
                  showView: true,
                  showEdit: true,
                  showDelete: false,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RevolvingFund
