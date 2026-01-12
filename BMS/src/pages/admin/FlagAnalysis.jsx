import { useMemo, useState } from 'react'
import PlatformTable from '../../components/PlatformTable'

const flagAnalysisColumns = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    width: '10%',
    align: 'center',
  },
  {
    key: 'employee',
    label: 'Employee',
    sortable: true,
    width: '15%',
    align: 'left',
  },
  {
    key: 'from',
    label: 'From',
    sortable: true,
    width: '12%',
    align: 'left',
  },
  {
    key: 'to',
    label: 'To',
    sortable: true,
    width: '12%',
    align: 'left',
  },
  {
    key: 'transportMode',
    label: 'Transport Mode',
    sortable: true,
    width: '15%',
    align: 'left',
  },
  {
    key: 'minAmount',
    label: 'Min Amount',
    sortable: true,
    width: '10%',
    align: 'right',
    render: (value) => `₱${value.toLocaleString()}`,
  },
  {
    key: 'maxAmount',
    label: 'Max Amount',
    sortable: true,
    width: '10%',
    align: 'right',
    render: (value) => `₱${value.toLocaleString()}`,
  },
  {
    key: 'amount',
    label: 'Amount',
    sortable: true,
    width: '10%',
    align: 'right',
    render: (value, row) => {
      const isAboveMax = value > row.maxAmount
      const isBelowMin = value < row.minAmount

      let textColor = 'text-green-600'
      if (isAboveMax) {
        textColor = 'text-red-600'
      } else if (isBelowMin) {
        textColor = 'text-amber-600'
      }

      return <span className={`font-semibold ${textColor}`}>₱{value.toLocaleString()}</span>
    },
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    width: '6%',
    align: 'center',
    render: (value) => {
      let bgColor = 'bg-gray-100'
      let textColor = 'text-gray-800'

      switch (value) {
        case 'Applied':
          bgColor = 'bg-blue-100'
          textColor = 'text-blue-800'
          break
        case 'Pending':
          bgColor = 'bg-yellow-100'
          textColor = 'text-yellow-800'
          break
        case 'Rejected':
          bgColor = 'bg-red-100'
          textColor = 'text-red-800'
          break
        default:
          bgColor = 'bg-gray-100'
          textColor = 'text-gray-800'
      }

      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
          {value}
        </span>
      )
    },
  },
]

const createFlagAnalysisData = (count) => {
  const employees = [
    'John Smith',
    'Maria Garcia',
    'David Chen',
    'Sarah Johnson',
    'Michael Brown',
    'Lisa Wang',
    'Robert Davis',
    'Emily Taylor',
    'James Wilson',
    'Sophia Martinez',
  ]

  const locations = [
    'Manila',
    'Quezon City',
    'Makati',
    'Taguig',
    'Pasig',
    'Mandaluyong',
    'San Juan',
    'Parañaque',
    'Las Piñas',
    'Muntinlupa',
    'Cebu City',
    'Davao City',
    'Iloilo City',
    'Bacolod',
    'Baguio',
  ]

  const transportModes = [
    'Company Van',
    'Company Truck',
    'Company Car',
    'Public Bus',
    'Public Jeepney',
    'Taxi',
    'Grab/Uber',
    'Motorcycle',
    'Air Travel',
    'Sea Travel',
  ]

  const statuses = ['Pending', 'Applied', 'Rejected']

  return Array.from({ length: count }, (_, i) => {
    const minAmount = Math.floor(Math.random() * 1000) + 500
    const maxAmount = minAmount + Math.floor(Math.random() * 2000) + 1000
    const amount = Math.floor(Math.random() * 3000) + 300

    // Randomly make some amounts problematic
    const problemType = Math.random()
    let finalAmount = amount
    if (problemType < 0.3) {
      // Above max
      finalAmount = maxAmount + Math.floor(Math.random() * 1000) + 500
    } else if (problemType < 0.5) {
      // Below min
      finalAmount = minAmount - Math.floor(Math.random() * 300)
    }

    const fromIndex = i % locations.length
    const toIndex = (i + Math.floor(Math.random() * (locations.length - 1)) + 1) % locations.length

    return {
      id: i + 1,
      employee: employees[i % employees.length],
      from: locations[fromIndex],
      to: locations[toIndex],
      transportMode: transportModes[i % transportModes.length],
      minAmount: minAmount,
      maxAmount: maxAmount,
      amount: finalAmount,
      status: statuses[i % statuses.length],
      date: `2024-${((i % 12) + 1).toString().padStart(2, '0')}-${((i % 28) + 1)
        .toString()
        .padStart(2, '0')}`,
      reason: Math.random() > 0.7 ? 'Exceeds budget' : 'Within guidelines',
    }
  })
}

const FlagAnalysis = () => {
  const [sortKey, setSortKey] = useState('id')
  const [sortDirection, setSortDirection] = useState('asc')
  const [statusFilter, setStatusFilter] = useState('')
  const [transportFilter, setTransportFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const flagData = useMemo(() => createFlagAnalysisData(25), [])

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...flagData]

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    // Apply transport filter
    if (transportFilter) {
      filtered = filtered.filter((item) =>
        item.transportMode.toLowerCase().includes(transportFilter.toLowerCase())
      )
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.employee.toLowerCase().includes(query) ||
          item.from.toLowerCase().includes(query) ||
          item.to.toLowerCase().includes(query) ||
          item.transportMode.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [flagData, sortKey, sortDirection, statusFilter, transportFilter, searchQuery])

  const handleSort = (key) => {
    setSortDirection((prev) => (sortKey === key && prev === 'asc' ? 'desc' : 'asc'))
    setSortKey(key)
  }

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = filteredAndSortedData.length
    const aboveMax = filteredAndSortedData.filter((item) => item.amount > item.maxAmount).length
    const belowMin = filteredAndSortedData.filter((item) => item.amount < item.minAmount).length
    const withinRange = total - aboveMax - belowMin

    return {
      total,
      aboveMax,
      belowMin,
      withinRange,
      aboveMaxPercentage: total ? ((aboveMax / total) * 100).toFixed(1) : 0,
      belowMinPercentage: total ? ((belowMin / total) * 100).toFixed(1) : 0,
    }
  }, [filteredAndSortedData])

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 p-3">
        <div className="bg-component shadow-lg rounded-lg border border-slate-400 mb-3">
          {/* Header with title */}
          <div className="px-4 py-1">
            <h1 className="text-2xl font-bold text-gray-800">Transportation Flag Analysis</h1>
            <p className="text-gray-600">Monitor and analyze transportation expense flags</p>
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
                <option value="Pending">Pending</option>
                <option value="Applied">Applied</option>
                <option value="Rejected">Rejected</option>
              </select>
              <select
                className="px-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm"
                value={transportFilter}
                onChange={(e) => setTransportFilter(e.target.value)}
              >
                <option value="">All Transport Modes</option>
                <option value="Van">Van</option>
                <option value="Truck">Truck</option>
                <option value="Car">Car</option>
                <option value="Bus">Bus</option>
                <option value="Taxi">Taxi</option>
                <option value="Air">Air Travel</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search employee, location, or transport..."
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
        <div className="h-[calc(100vh-280px)] lg:h-[calc(100vh-250px)] xl:h-[calc(100vh-220px)] overflow-hidden">
          <div className="bg-component shadow-lg rounded-lg border border-slate-400 h-full flex flex-col p-2">
            <PlatformTable
              columns={flagAnalysisColumns}
              data={filteredAndSortedData}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
              maxHeight="calc(100% - 60px)"
              title="Transportation Expense Flags"
              responsive={true}
              containerClassName="h-full"
              onView={(row) => console.log('View flag details:', row)}
              onEdit={(row) => console.log('Edit flag:', row)}
              onDelete={(row) => console.log('Delete flag:', row)}
              actionButtonProps={{
                viewLabel: 'View Details',
                editLabel: 'Adjust Amount',
                deleteLabel: 'Remove Flag',
                showView: false,
                showEdit: true,
                showDelete: false,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlagAnalysis
