import { useMemo, useState } from 'react'
import PlatformTable from '../../components/PlatformTable'

const transportColumns = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    width: '20%',
  },
  {
    key: 'modeOfTransport',
    label: 'Mode Of Transportation',
    sortable: true,
    width: '50%',
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    width: '30%',
    render: (value) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Active'
            ? 'bg-green-100 text-green-800'
            : value === 'Inactive'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}
      >
        {value}
      </span>
    ),
  },
]

const createTransportData = (count) => {
  const transportModes = [
    'Company Vehicle - Van',
    'Company Vehicle - Truck',
    'Company Vehicle - Car',
    'Public Transportation - Bus',
    'Public Transportation - Jeepney',
    'Public Transportation - Taxi',
    'Air Transport - Domestic',
    'Air Transport - International',
    'Sea Transport - Ferry',
    'Sea Transport - Cargo Ship',
    'Motorcycle Courier',
    'Bicycle Courier',
    'Walk-in Delivery',
    'Third Party Logistics',
    'Express Delivery Service',
  ]

  const descriptions = [
    'For bulk item deliveries and team transport',
    'Heavy equipment and large item transport',
    'Executive and small item transport',
    'Inter-city and provincial transport',
    'Local area transport and delivery',
    'Urgent and special delivery transport',
    'Long distance and time-sensitive transport',
    'International shipments and deliveries',
    'Island and coastal area transport',
    'Bulk cargo and overseas shipments',
    'Quick and small package delivery',
    'Eco-friendly local delivery option',
    'Local area personal delivery',
    'External logistics partner services',
    'Priority and guaranteed delivery service',
  ]

  const statuses = ['Active', 'Inactive']
  const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'CNG']
  const capacities = ['Small', 'Medium', 'Large', 'Extra Large']

  return Array.from({ length: count }, (_, i) => {
    return {
      id: i + 1,
      modeOfTransport: transportModes[i % transportModes.length],
      description: descriptions[i % descriptions.length],
      status: statuses[i % statuses.length],
      fuelType: fuelTypes[i % fuelTypes.length],
      capacity: capacities[i % capacities.length],
      registrationNumber: `TR${(i + 1000).toString().padStart(4, '0')}`,
      driver: `Driver ${i + 1}`,
      lastMaintenance: `2024-${((i % 12) + 1).toString().padStart(2, '0')}-${((i % 28) + 1)
        .toString()
        .padStart(2, '0')}`,
      dailyRate: Math.floor(Math.random() * 5000) + 1000,
      availability: Math.random() > 0.3 ? 'Available' : 'In Use',
    }
  })
}

const Transport = () => {
  const [sortKey, setSortKey] = useState('id')
  const [sortDirection, setSortDirection] = useState('asc')

  const transportData = useMemo(() => createTransportData(20), [])

  const sortedTransportData = useMemo(() => {
    return [...transportData].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [transportData, sortKey, sortDirection])

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
            <h1 className="text-2xl font-bold text-gray-800">Transport Management</h1>
            <p className="text-gray-600">Manage transportation modes and their availability</p>
          </div>

          {/* Action buttons and filters */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2 px-4 pb-2">
              <select className="px-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm">
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <select className="px-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm">
                <option value="">All Types</option>
                <option value="Company Vehicle">Company Vehicle</option>
                <option value="Public Transportation">Public Transportation</option>
                <option value="Air Transport">Air Transport</option>
                <option value="Sea Transport">Sea Transport</option>
                <option value="Courier">Courier</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 px-4 pb-2">
              <input
                type="text"
                placeholder="Search transport..."
                className="px-6 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm"
              />
            </div>
          </div>
        </div>
        {/* Table container */}
        <div className="h-[calc(100vh-280px)] lg:h-[calc(100vh-250px)] xl:h-[calc(100vh-220px)] overflow-hidden">
          <div className="bg-component shadow-lg rounded-lg border border-slate-400 h-full flex flex-col p-2">
            <PlatformTable
              columns={transportColumns}
              data={sortedTransportData}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
              maxHeight="calc(100% - 60px)"
              title="Transport List"
              responsive={true}
              containerClassName="h-full"
              onView={(row) => console.log('View transport:', row)}
              onEdit={(row) => console.log('Edit transport:', row)}
              onDelete={(row) => console.log('Delete transport:', row)}
              actionButtonProps={{
                viewLabel: 'View Details',
                editLabel: 'Edit Transport',
                deleteLabel: 'Deactivate',
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

export default Transport
