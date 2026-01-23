import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PlatformTable from '../../components/PlatformTable'
import Cards from '../../components/Cards'
import { cardDataRequester } from '../../data/cardData'
import CashRequestForm from '../../components/modal/CashRequestForm'

const myRequestColumns = [
  {
    key: 'referenceId',
    label: 'Reference ID',
    sortable: true,
    width: '12%',
    align: 'center',
    render: (value) => (
      <span className="font-mono font-semibold text-blue-700">
        REQ-{value.toString().padStart(6, '0')}
      </span>
    ),
  },
  {
    key: 'employee',
    label: 'Employee',
    sortable: true,
    width: '18%',
    align: 'left',
    render: (value) => <span className="font-medium text-gray-800">{value}</span>,
  },
  {
    key: 'department',
    label: 'Department',
    sortable: true,
    width: '15%',
    align: 'left',
    render: (value) => <span className="text-gray-700">{value}</span>,
  },
  {
    key: 'particulars',
    label: 'Particulars',
    sortable: true,
    width: '25%',
    align: 'left',
    render: (value) => (
      <div className="max-w-xs truncate" title={value}>
        <span className="text-gray-800">{value}</span>
      </div>
    ),
  },
  {
    key: 'amount',
    label: 'Amount',
    sortable: true,
    width: '10%',
    align: 'right',
    render: (value) => (
      <span className="font-semibold text-green-700">₱{value.toLocaleString()}</span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    width: '10%',
    align: 'center',
    render: (value) => {
      const statusConfig = {
        Pending: { color: 'bg-amber-100 text-amber-800', border: 'border-amber-200' },
        Approved: { color: 'bg-green-100 text-green-800', border: 'border-green-200' },
        Rejected: { color: 'bg-red-100 text-red-800', border: 'border-red-200' },
      }

      const config = statusConfig[value] || statusConfig['Pending']

      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.color} ${config.border}`}
        >
          {value}
        </span>
      )
    },
  },
  {
    key: 'requestDate',
    label: 'Request Date',
    sortable: true,
    width: '10%',
    align: 'center',
    render: (value) => {
      const date = new Date(value)
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })

      return <span className="text-gray-700">{formattedDate}</span>
    },
  },
]

const createMyRequestData = (count) => {
  const employees = [
    'Juan Dela Cruz',
    'Maria Santos',
    'John Smith',
    'Anna Reyes',
    'Michael Johnson',
    'Sarah Lim',
    'Robert Garcia',
    'Jennifer Lee',
    'David Chen',
    'Michelle Tan',
  ]

  const departments = [
    'Sales',
    'Human Resources',
    'Finance',
    'Information Technology',
    'Research & Development',
    'Administration',
  ]

  const particulars = [
    'Office Supplies Purchase',
    'Business Travel Expenses',
    'Team Building Activity',
    'Software Subscription Renewal',
    'Training and Development',
    'Client Meeting Catering',
    'Equipment Maintenance',
    'Conference Registration',
    'Marketing Campaign Materials',
    'Utility Bill Payment',
    'Vehicle Fuel Reimbursement',
    'Emergency Petty Cash',
    'Project Materials',
    'Annual Software License',
    'Team Lunch Meeting',
  ]

  // Only Pending, Approved, and Rejected statuses
  const statuses = ['Pending', 'Approved', 'Rejected']

  const generateRandomDate = () => {
    const start = new Date()
    start.setDate(start.getDate() - 90)
    const end = new Date()

    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    return randomDate.toISOString().split('T')[0]
  }

  return Array.from({ length: count }, (_, i) => {
    const amount = Math.floor(Math.random() * 50000) + 1000
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    return {
      id: i + 1,
      referenceId: 100000 + i + 1,
      employee: employees[Math.floor(Math.random() * employees.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      particulars: particulars[Math.floor(Math.random() * particulars.length)],
      amount: amount,
      status: status,
      requestDate: generateRandomDate(),
      priority: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      approvedBy: status === 'Pending' ? '' : `Approver ${Math.floor(Math.random() * 5) + 1}`,
      approvedDate: status === 'Pending' ? '' : generateRandomDate(),
      notes: status === 'Rejected' ? 'Budget constraints' : '',
    }
  })
}

const MyRequest = () => {
  const navigate = useNavigate()
  const [sortKey, setSortKey] = useState('requestDate')
  const [sortDirection, setSortDirection] = useState('desc')
  const [statusFilter, setStatusFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [showCashRequestForm, setShowCashRequestForm] = useState(false)

  const requestData = useMemo(() => {
    const data = createMyRequestData(50)
    return Array.isArray(data) ? data : []
  }, [])

  // Get unique departments for filter dropdown
  const uniqueDepartments = useMemo(() => {
    if (!Array.isArray(requestData)) return []
    return Array.from(new Set(requestData.map((item) => item.department))).filter(Boolean)
  }, [requestData])

  //   filter
  const filteredAndSortedData = useMemo(() => {
    if (!Array.isArray(requestData)) return []

    let filtered = [...requestData]

    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    if (departmentFilter) {
      filtered = filtered.filter((item) => item.department === departmentFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.referenceId.toString().includes(query) ||
          item.employee.toLowerCase().includes(query) ||
          item.department.toLowerCase().includes(query) ||
          item.particulars.toLowerCase().includes(query),
      )
    }

    // Sorting
    return filtered.sort((a, b) => {
      if (sortKey === 'requestDate' || sortKey === 'approvedDate') {
        const dateA = new Date(a[sortKey])
        const dateB = new Date(b[sortKey])
        if (dateA < dateB) return sortDirection === 'asc' ? -1 : 1
        if (dateA > dateB) return sortDirection === 'asc' ? 1 : -1
        return 0
      }

      if (['amount'].includes(sortKey)) {
        if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
        if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
        return 0
      }

      if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [requestData, sortKey, sortDirection, statusFilter, departmentFilter, searchQuery])

  const handleSort = (key) => {
    setSortDirection((prev) => (sortKey === key && prev === 'asc' ? 'desc' : 'asc'))
    setSortKey(key)
  }

  const handleSelectionChange = (selectedIds) => {
    setSelectedRows(selectedIds)
  }

  const handleSelectAll = (isSelected, allIds) => {
    setSelectAll(isSelected)
    setSelectedRows(isSelected ? allIds : [])
  }

  // Actions
  const handleNewRequest = () => {
    setShowCashRequestForm(true)
  }

  const handleCloseCashRequestForm = () => {
    setShowCashRequestForm(false)
  }

  const handleSubmitCashRequest = (formData) => {
    console.log('New cash request submitted:', formData)
    alert('Cash request submitted successfully!')
  }

  const handleExportSelected = () => {
    if (selectedRows.length === 0) return

    // selected rows data
    const selectedData = requestData.filter((row) => selectedRows.includes(row.id))

    const exportData = selectedData.map((row) => ({
      'Reference ID': `REQ-${row.referenceId.toString().padStart(6, '0')}`,
      Employee: row.employee,
      Department: row.department,
      Particulars: row.particulars,
      Amount: `₱${row.amount.toLocaleString()}`,
      Status: row.status,
      'Request Date': new Date(row.requestDate).toLocaleDateString(),
    }))

    console.log('Data to export:', exportData)
  }

  const handleRowClick = (row) => {
    console.log('Row clicked:', row)
    navigate(`/view-form/${row.id}`, {
      state: {
        role: 'requester',
        status: row.status,
      },
    })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 p-3">
        {/* Header cards */}
        <div className="mt-3">
          <Cards cardData={cardDataRequester} />
        </div>

        {/* Main header section */}
        <div className="bg-component shadow-lg rounded-lg border border-slate-400 mb-3">
          <div className="px-4 py-1">
            <h1 className="text-2xl font-bold text-gray-800">My Cash Requests</h1>
            <p className="text-gray-600">Manage and track your cash request submissions</p>
          </div>

          {/* Filters and search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 pb-2 gap-3">
            <div className="flex flex-wrap gap-2">
              <select
                className="px-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <select
                className="px-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                {uniqueDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search by ID, employee, department, or particulars..."
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
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-2">
                <button
                  onClick={handleNewRequest}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2 cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>New Request</span>
                </button>

                {/* Export Selected button */}
                {selectedRows.length > 0 && (
                  <button
                    onClick={handleExportSelected}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span>Export Selected ({selectedRows.length})</span>
                  </button>
                )}
              </div>
            </div>

            <PlatformTable
              columns={myRequestColumns}
              data={filteredAndSortedData}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
              maxHeight="calc(100% - 60px)"
              title={null}
              responsive={true}
              containerClassName="h-full"
              showCheckboxes={true}
              selectedRows={selectedRows}
              onSelectionChange={handleSelectionChange}
              selectAll={selectAll}
              onSelectAll={handleSelectAll}
              onRowClick={handleRowClick}
              onDownload={(row) => console.log('Download request:', row)}
              actionButtonProps={{
                downloadLabel: 'Download PDF',
                showDownload: true,
                onSubmit: (row) => console.log('Submit request:', row),
              }}
            />
          </div>
        </div>
      </div>

      {/* Cash Request Form Modal */}
      <CashRequestForm
        isOpen={showCashRequestForm}
        onClose={handleCloseCashRequestForm}
        onSubmit={handleSubmitCashRequest}
      />
    </div>
  )
}

export default MyRequest
