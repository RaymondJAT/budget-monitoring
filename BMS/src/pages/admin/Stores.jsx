import { useMemo, useState } from 'react'
import PlatformTable from '../../components/PlatformTable'

const storesColumns = [
  {
    key: 'storeNumber',
    label: 'Store Number',
    sortable: true,
    width: '20%',
  },
  {
    key: 'storeName',
    label: 'Store Name',
    sortable: true,
    width: '30%',
  },
  {
    key: 'cityProvince',
    label: 'City/Province',
    sortable: true,
    width: '30%',
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    width: '20%',
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

const createStoresData = (count) => {
  const storeNames = [
    'Main Branch',
    'Downtown Plaza',
    'Mall of Asia',
    'Greenhills Center',
    'Bonifacio High Street',
    'Megamall',
    'Glorietta',
    'Robinsons Place',
    'SM North EDSA',
    'Trinoma',
    'Ayala Center',
    'Market! Market!',
    'Festival Mall',
    'Sta. Lucia',
    'UP Town Center',
  ]

  const cities = [
    'Manila',
    'Quezon City',
    'Makati',
    'Taguig',
    'Pasig',
    'Mandaluyong',
    'Pasay',
    'San Juan',
    'Parañaque',
    'Las Piñas',
    'Muntinlupa',
    'Marikina',
    'Valenzuela',
    'Caloocan',
    'Malabon',
  ]

  const provinces = [
    'Metro Manila',
    'Cavite',
    'Laguna',
    'Rizal',
    'Bulacan',
    'Batangas',
    'Pampanga',
    'Nueva Ecija',
    'Tarlac',
    'Zambales',
  ]

  const statuses = ['Active', 'Inactive']

  return Array.from({ length: count }, (_, i) => {
    const city = cities[i % cities.length]
    const province = provinces[i % provinces.length]

    return {
      id: i + 1,
      storeNumber: `ST${(i + 1000).toString().padStart(4, '0')}`,
      storeName: storeNames[i % storeNames.length],
      cityProvince: `${city}, ${province}`,
      address: `${Math.floor(Math.random() * 100) + 1} ${
        ['Main St', 'Ave', 'Blvd', 'Road'][i % 4]
      }, ${city}`,
      contactNumber: `+63 9${Math.floor(Math.random() * 90000000) + 10000000}`,
      manager: `Manager ${i + 1}`,
      openingDate: `202${Math.floor(i / 10) % 3}-${((i % 12) + 1).toString().padStart(2, '0')}-${(
        (i % 28) +
        1
      )
        .toString()
        .padStart(2, '0')}`,
      status: statuses[i % statuses.length],
      revenue: Math.floor(Math.random() * 1000000) + 500000,
      employees: Math.floor(Math.random() * 50) + 10,
    }
  })
}

const Stores = () => {
  const [sortKey, setSortKey] = useState('storeNumber')
  const [sortDirection, setSortDirection] = useState('asc')

  const storesData = useMemo(() => createStoresData(20), [])

  const sortedStoresData = useMemo(() => {
    return [...storesData].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [storesData, sortKey, sortDirection])

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
            <h1 className="text-2xl font-bold text-gray-800">Store Management</h1>
            <p className="text-gray-600">Manage company stores and their locations</p>
          </div>

          {/* Action buttons and filters */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2 px-4 pb-2">
              {' '}
              <select className="px-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm">
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <select className="px-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm">
                <option value="">All Locations</option>
                <option value="Manila">Manila</option>
                <option value="Quezon City">Quezon City</option>
                <option value="Makati">Makati</option>
                <option value="Province">Province</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 px-4 pb-2">
              <input
                type="text"
                placeholder="Search stores..."
                className="px-6 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm"
              />
            </div>
          </div>
        </div>
        {/* Table container */}
        <div className="h-[calc(100vh-280px)] lg:h-[calc(100vh-250px)] xl:h-[calc(100vh-220px)] overflow-hidden">
          <div className="bg-component shadow-lg rounded-lg border border-slate-400 h-full flex flex-col p-2">
            <PlatformTable
              columns={storesColumns}
              data={sortedStoresData}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
              maxHeight="calc(100% - 60px)"
              title="Store List"
              responsive={true}
              containerClassName="h-full"
              onEdit={(row) => console.log('Edit store:', row)}
              actionButtonProps={{
                editLabel: 'Edit Store',
                showEdit: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stores
