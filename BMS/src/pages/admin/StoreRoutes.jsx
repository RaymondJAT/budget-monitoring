import { useMemo, useState } from 'react'
import PlatformTable from '../../components/PlatformTable'

const storeRoutesColumns = [
  {
    key: 'referenceId',
    label: 'Reference ID',
    sortable: true,
    width: '15%',
    align: 'center',
  },
  {
    key: 'employee',
    label: 'Employee',
    sortable: true,
    width: '20%',
    align: 'left',
  },
  {
    key: 'storeName',
    label: 'Store Name',
    sortable: true,
    width: '30%',
    align: 'left',
    render: (value) => <span className="font-medium text-gray-800">{value}</span>,
  },
  {
    key: 'amount',
    label: 'Amount',
    sortable: true,
    width: '20%',
    align: 'right',
    render: (value) => (
      <span className="font-semibold text-blue-700">₱{value.toLocaleString()}</span>
    ),
  },
  {
    key: 'liquidationDate',
    label: 'Liquidation Date',
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
]

const createStoreRoutesData = (count) => {
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
    'Thomas Anderson',
    'Jennifer Lopez',
    'William Lee',
    'Amanda Clark',
    'Christopher Wong',
  ]

  const storeNames = [
    'SM Supermall - North EDSA',
    'Robinsons Place - Manila',
    'Ayala Center - Makati',
    'Megamall - Ortigas',
    'SM Mall of Asia - Pasay',
    'Festival Mall - Alabang',
    'Greenbelt Mall - Makati',
    'Trinoma - Quezon City',
    'Power Plant Mall - Rockwell',
    'UP Town Center - Quezon City',
    'Venice Grand Canal - McKinley',
    'Market! Market! - Taguig',
    'Starmall - Alabang',
    'Century Mall - Makati',
    'Walter Mart - Makati',
    'Puregold - Various Branches',
    'Savemore Market - Metro Manila',
    'Shopwise - Hypermarket',
    'Cash & Carry - Makati',
    'Landmark - Trinoma',
  ]

  // Generate random dates
  const generateRandomDate = () => {
    const start = new Date()
    start.setDate(start.getDate() - 90)
    const end = new Date()

    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))

    return randomDate.toISOString().split('T')[0]
  }

  return Array.from({ length: count }, (_, i) => {
    const referencePrefix = 'STR'
    const referenceNumber = (1000 + i).toString().padStart(6, '0')

    const amount = Math.floor(Math.random() * 50000) + 1000

    return {
      id: i + 1,
      referenceId: `${referencePrefix}-${referenceNumber}`,
      employee: employees[i % employees.length],
      storeName: `${storeNames[i % storeNames.length]}`,
      amount: amount,
      liquidationDate: generateRandomDate(),

      region: ['NCR', 'Luzon', 'Visayas', 'Mindanao'][Math.floor(Math.random() * 4)],
      visitType: ['Regular Visit', 'Inventory', 'Audit', 'Promotion', 'Delivery'][
        Math.floor(Math.random() * 5)
      ],
      status: ['Completed', 'Pending', 'In Progress'][Math.floor(Math.random() * 3)],
      receiptNumber: `REC-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(5, '0')}`,
    }
  })
}

const StoreRoutes = () => {
  const [sortKey, setSortKey] = useState('referenceId')
  const [sortDirection, setSortDirection] = useState('asc')
  const [storeTypeFilter, setStoreTypeFilter] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const storeRoutesData = useMemo(() => createStoreRoutesData(30), [])

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...storeRoutesData]

    if (regionFilter) {
      filtered = filtered.filter((item) => item.region === regionFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.employee.toLowerCase().includes(query) ||
          item.storeName.toLowerCase().includes(query) ||
          item.referenceId.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortKey === 'liquidationDate') {
        const dateA = new Date(a[sortKey])
        const dateB = new Date(b[sortKey])
        if (dateA < dateB) return sortDirection === 'asc' ? -1 : 1
        if (dateA > dateB) return sortDirection === 'asc' ? 1 : -1
        return 0
      }

      if (sortKey === 'amount') {
        if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
        if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
        return 0
      }

      if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [storeRoutesData, sortKey, sortDirection, storeTypeFilter, regionFilter, searchQuery])

  const handleSort = (key) => {
    setSortDirection((prev) => (sortKey === key && prev === 'asc' ? 'desc' : 'asc'))
    setSortKey(key)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 p-3">
        <div className="bg-component shadow-lg rounded-lg border border-slate-400 mb-3">
          {/* Header with title */}
          <div className="px-4 py-1">
            <h1 className="text-2xl font-bold text-gray-800">Store Routes & Liquidations</h1>
            <p className="text-gray-600">Track store visits and liquidation records</p>
          </div>

          {/* Action buttons and filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 pb-2 gap-3">
            <div className="flex flex-wrap gap-2">
              <select
                className="px-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
              >
                <option value="">All Regions</option>
                <option value="NCR">NCR</option>
                <option value="Luzon">Luzon</option>
                <option value="Visayas">Visayas</option>
                <option value="Mindanao">Mindanao</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search employee, store, or reference ID..."
                className="px-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table container */}
        <div className="h-[calc(100vh-280px)] lg:h-[calc(100vh-250px)] xl:h-[calc(100vh-220px)] overflow-hidden">
          <div className="bg-component shadow-lg rounded-lg border border-slate-400 h-full flex flex-col p-2">
            <PlatformTable
              columns={storeRoutesColumns}
              data={filteredAndSortedData}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
              maxHeight="calc(100% - 60px)"
              title="Store Routes & Liquidations"
              responsive={true}
              containerClassName="h-full"
              showActions={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoreRoutes
