import { useMemo, useState } from 'react'
import PlatformTable from '../../components/PlatformTable'

const userColumns = [
  {
    key: 'employeeId',
    label: 'Employee ID',
    sortable: true,
    width: '15%',
  },
  {
    key: 'fullName',
    label: 'Full Name',
    sortable: true,
    width: '25%',
  },
  {
    key: 'username',
    label: 'Username',
    sortable: true,
    width: '20%',
  },
  {
    key: 'accessLevel',
    label: 'Access Level',
    sortable: true,
    width: '20%',
    render: (value) => {
      const levelColors = {
        Admin: 'bg-purple-100 text-purple-800',
        Manager: 'bg-blue-100 text-blue-800',
        Supervisor: 'bg-green-100 text-green-800',
        User: 'bg-gray-100 text-gray-800',
        Viewer: 'bg-yellow-100 text-yellow-800',
      }
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            levelColors[value] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {value}
        </span>
      )
    },
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

const createUserData = (count) => {
  const firstNames = [
    'John',
    'Jane',
    'Michael',
    'Sarah',
    'David',
    'Lisa',
    'Robert',
    'Maria',
    'James',
    'Jennifer',
  ]
  const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez',
  ]
  const departments = ['Finance', 'IT', 'HR', 'Operations', 'Marketing', 'Sales', 'Admin']
  const accessLevels = ['Admin', 'Manager', 'Supervisor', 'User', 'Viewer']
  const statuses = ['Active', 'Inactive', 'Pending']

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[i % firstNames.length]
    const lastName = lastNames[i % lastNames.length]
    const department = departments[i % departments.length]

    return {
      id: i + 1,
      employeeId: `EMP${(i + 1001).toString().padStart(4, '0')}`,
      fullName: `${firstName} ${lastName}`,
      username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
      department: department,
      accessLevel: accessLevels[i % accessLevels.length],
      status: statuses[i % statuses.length],
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      lastLogin: `2024-${((i % 12) + 1).toString().padStart(2, '0')}-${((i % 28) + 1)
        .toString()
        .padStart(2, '0')}`,
    }
  })
}

const Users = () => {
  const [sortKey, setSortKey] = useState('employeeId')
  const [sortDirection, setSortDirection] = useState('asc')

  const users = useMemo(() => createUserData(20), [])

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [users, sortKey, sortDirection])

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
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600">Manage system users and their access levels</p>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center ">
            <div className="flex space-x-2 px-4 pb-2">
              {' '}
              <select className="px-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm">
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 px-4 pb-2">
              <input
                type="text"
                placeholder="Search users..."
                className="px-6 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm"
              />
            </div>
          </div>
        </div>
        {/* Table container */}
        <div className="h-[calc(100vh-280px)] lg:h-[calc(100vh-250px)] xl:h-[calc(100vh-220px)] overflow-hidden">
          <div className="bg-component shadow-gl rounded-lg border border-slate-400 h-full flex flex-col p-2">
            <PlatformTable
              columns={userColumns}
              data={sortedUsers}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
              maxHeight="calc(100% - 60px)"
              title="User List"
              responsive={true}
              containerClassName="h-full"
              onView={(row) => console.log('View user:', row)}
              onEdit={(row) => console.log('Edit user:', row)}
              onDelete={(row) => console.log('Delete user:', row)}
              actionButtonProps={{
                viewLabel: 'View Details',
                editLabel: 'Edit User',
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

export default Users
