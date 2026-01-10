import { useMemo, useState } from 'react'
import PlatformTable from '../../components/PlatformTable'

const particularsColumns = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    width: '10%',
  },
  {
    key: 'code',
    label: 'Code',
    sortable: true,
    width: '15%',
  },
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    width: '20%',
  },
  {
    key: 'type',
    label: 'Type',
    sortable: true,
    width: '15%',
    render: (value) => (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {value}
      </span>
    ),
  },
  {
    key: 'description',
    label: 'Description',
    sortable: false,
    width: '25%',
    render: (value) => (
      <span className="text-gray-600 text-sm truncate" title={value}>
        {value.length > 50 ? `${value.substring(0, 50)}...` : value}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    width: '15%',
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

const createParticularsData = (count) => {
  const codes = [
    'TRV001',
    'ACCOM002',
    'MEAL003',
    'MISC004',
    'FUEL005',
    'MAT006',
    'EQP007',
    'SVC008',
    'ADV009',
    'RMB010',
    'TAX011',
    'INS012',
    'UTIL013',
    'COMM014',
    'TRAIN015',
  ]

  const names = [
    'Travel Expenses',
    'Accommodation',
    'Meals & Entertainment',
    'Miscellaneous',
    'Fuel & Transportation',
    'Materials',
    'Equipment Rental',
    'Professional Services',
    'Advances',
    'Reimbursements',
    'Taxes',
    'Insurance',
    'Utilities',
    'Communication',
    'Training & Development',
  ]

  const types = [
    'Travel',
    'Accommodation',
    'Meals',
    'General',
    'Transport',
    'Materials',
    'Equipment',
    'Services',
    'Advances',
    'Reimbursement',
    'Tax',
    'Insurance',
    'Utilities',
    'Communication',
    'Training',
  ]

  const descriptions = [
    'Business travel expenses including airfare, hotel, and local transport',
    'Hotel accommodations and lodging expenses',
    'Business meals, client entertainment, and food expenses',
    'General miscellaneous business expenses',
    'Fuel costs, vehicle maintenance, and transportation fees',
    'Raw materials and supplies for operations',
    'Equipment rental and leasing costs',
    'Professional and consulting services',
    'Employee advances and petty cash',
    'Employee expense reimbursements',
    'Business taxes and government fees',
    'Insurance premiums and coverage',
    'Electricity, water, and other utility bills',
    'Phone, internet, and communication services',
    'Employee training and development programs',
  ]

  const statuses = ['Active', 'Inactive']
  const categories = ['Operating', 'Capital', 'Administrative', 'Sales', 'Marketing']

  return Array.from({ length: count }, (_, i) => {
    return {
      id: i + 1,
      code: codes[i % codes.length],
      name: names[i % names.length],
      type: types[i % types.length],
      description: descriptions[i % descriptions.length],
      status: statuses[i % statuses.length],
      category: categories[i % categories.length],
      createdAt: `2024-${((i % 12) + 1).toString().padStart(2, '0')}-${((i % 28) + 1)
        .toString()
        .padStart(2, '0')}`,
      updatedAt: `2024-${(((i + 1) % 12) + 1).toString().padStart(2, '0')}-${(((i + 1) % 28) + 1)
        .toString()
        .padStart(2, '0')}`,
      budgetAllocation: Math.floor(Math.random() * 100000) + 10000,
      usedAmount: Math.floor(Math.random() * 50000) + 5000,
    }
  })
}

const Particulars = () => {
  const [sortKey, setSortKey] = useState('id')
  const [sortDirection, setSortDirection] = useState('asc')

  const particularsData = useMemo(() => createParticularsData(20), [])

  const sortedParticularsData = useMemo(() => {
    return [...particularsData].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [particularsData, sortKey, sortDirection])

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
            <h1 className="text-2xl font-bold text-gray-800">Particulars Management</h1>
            <p className="text-gray-600">Manage expense particulars and categories</p>
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
                <option value="Travel">Assets</option>
                <option value="Accommodation">Liabilities</option>
                <option value="Meals">Expenses</option>
                <option value="General">Revenues</option>
                <option value="Transport">Equities</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 px-4 pb-2">
              <input
                type="text"
                placeholder="Search particulars..."
                className="px-6 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm"
              />
            </div>
          </div>
        </div>
        {/* Table container */}
        <div className="h-[calc(100vh-280px)] lg:h-[calc(100vh-250px)] xl:h-[calc(100vh-220px)] overflow-hidden">
          <div className="bg-component shadow-lg rounded-lg border border-slate-400 h-full flex flex-col p-2">
            <PlatformTable
              columns={particularsColumns}
              data={sortedParticularsData}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
              maxHeight="calc(100% - 60px)"
              title="Particulars List"
              responsive={true}
              containerClassName="h-full"
              onView={(row) => console.log('View particular:', row)}
              onEdit={(row) => console.log('Edit particular:', row)}
              onDelete={(row) => console.log('Delete particular:', row)}
              actionButtonProps={{
                viewLabel: 'View Details',
                editLabel: 'Edit Particular',
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

export default Particulars
