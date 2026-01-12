import { useMemo, useState } from 'react'
import PlatformTable from '../../components/PlatformTable'

const accessColumns = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    width: '15%',
  },
  {
    key: 'accessName',
    label: 'Access Name',
    sortable: true,
    width: '35%',
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
  {
    key: 'createdAt',
    label: 'Created At',
    sortable: true,
    width: '30%',
    render: (value) => <span className="text-gray-700">{value}</span>,
  },
]

const createAccessData = (count) => {
  const accessNames = [
    'Administrator',
    'Finance Manager',
    'Team Leader',
    'Employee',
    'View Only',
    'Auditor',
    'Supervisor',
    'HR Manager',
    'IT Admin',
    'Operations Lead',
  ]
  const statuses = ['Active', 'Inactive', 'Pending']
  const dates = [
    '2024-01-15 09:30:00',
    '2024-02-20 14:45:00',
    '2024-03-10 11:20:00',
    '2024-04-05 16:10:00',
    '2024-05-12 08:15:00',
    '2024-06-18 13:25:00',
    '2024-07-22 10:40:00',
    '2024-08-30 15:55:00',
    '2024-09-14 12:30:00',
    '2024-10-08 09:00:00',
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    accessName: accessNames[i % accessNames.length],
    description: `${accessNames[i % accessNames.length]} access level for the system`,
    status: statuses[i % statuses.length],
    createdAt: dates[i % dates.length],
    updatedAt: dates[(i + 1) % dates.length],
    userCount: Math.floor(Math.random() * 50) + 1,
    permissions: Math.floor(Math.random() * 20) + 5,
  }))
}

const Access = () => {
  const [sortKey, setSortKey] = useState('id')
  const [sortDirection, setSortDirection] = useState('asc')

  const accessData = useMemo(() => createAccessData(20), [])

  const sortedAccessData = useMemo(() => {
    return [...accessData].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [accessData, sortKey, sortDirection])

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
            <h1 className="text-2xl font-bold text-gray-800">Access Management</h1>
            <p className="text-gray-600">Manage system access levels and permissions</p>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2 px-4 pb-2">
              <select className="px-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm">
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 px-4 pb-2">
              <input
                type="text"
                placeholder="Search access..."
                className="px-6 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm"
              />
            </div>
          </div>
        </div>
        {/* Table container */}
        <div className="h-[calc(100vh-280px)] lg:h-[calc(100vh-250px)] xl:h-[calc(100vh-220px)] overflow-hidden">
          <div className="bg-component shadow-lg rounded-lg border border-slate-400 h-full flex flex-col p-2">
            <PlatformTable
              columns={accessColumns}
              data={sortedAccessData}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
              maxHeight="calc(100% - 60px)"
              title="Access List"
              responsive={true}
              containerClassName="h-full"
              onEdit={(row) => console.log('Edit access:', row)}
              actionButtonProps={{
                editLabel: 'Edit Access',
                showEdit: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Access
