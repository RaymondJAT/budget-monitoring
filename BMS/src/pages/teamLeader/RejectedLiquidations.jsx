import { useMemo, useState } from 'react'
import PlatformTable from '../../components/PlatformTable'
import Cards from '../../components/Cards'
import { cardDataCustodian } from '../../data/cardData'

const rejectedLiquidationsColumns = [
  {
    key: 'referenceId',
    label: 'Reference ID',
    sortable: true,
    width: '12%',
    align: 'center',
    render: (value) => (
      <span className="font-mono font-semibold text-blue-700">
        RLIQ-{value.toString().padStart(6, '0')}
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
        Rejected: { color: 'bg-red-100 text-red-800', border: 'border-red-200' },
      }

      const config = statusConfig[value] || statusConfig['Rejected']

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
    key: 'liquidationDate',
    label: 'Liquidation Date',
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

const createRejectedLiquidationsData = (count) => {
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

  const statuses = ['Rejected']

  const liquidationTypes = [
    'Travel Expense',
    'Office Supplies',
    'Equipment Purchase',
    'Training Course',
    'Conference Fees',
    'Team Building',
    'Client Entertainment',
    'Project Materials',
    'Software License',
    'Maintenance Services',
  ]

  const rejectionReasons = [
    'Insufficient documentation',
    'Missing receipts',
    'Policy violation',
    'Budget exceeded',
    'Incorrect particulars',
    'Not business-related',
    'Submitted after deadline',
    'Duplicate submission',
    'Incomplete supporting docs',
    'Outside approval limits',
  ]

  const generateRandomDate = (startDaysAgo = 90) => {
    const start = new Date()
    start.setDate(start.getDate() - startDaysAgo)
    const end = new Date()

    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    return randomDate.toISOString().split('T')[0]
  }

  return Array.from({ length: count }, (_, i) => {
    const amount = Math.floor(Math.random() * 50000) + 1000
    const status = 'Rejected'
    const liquidationDate = generateRandomDate(120)
    const rejectionDate = generateRandomDate(30)

    return {
      id: i + 1,
      referenceId: 1400000 + i + 1,
      employee: employees[Math.floor(Math.random() * employees.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      particulars: particulars[Math.floor(Math.random() * particulars.length)],
      amount: amount,
      status: status,
      liquidationDate: liquidationDate,
      rejectionDate: rejectionDate,
      liquidationType: liquidationTypes[Math.floor(Math.random() * liquidationTypes.length)],
      supportingDocs: Math.floor(Math.random() * 5) + 1,
      rejectedBy: `Reviewer ${Math.floor(Math.random() * 5) + 1}`,
      rejectionReason: rejectionReasons[Math.floor(Math.random() * rejectionReasons.length)],
      resubmittable: Math.random() > 0.5,
      resubmissionDate: Math.random() > 0.7 ? generateRandomDate(14) : null,
      appealStatus: Math.random() > 0.8 ? 'Pending Review' : 'No Appeal',
      appealNotes: Math.random() > 0.8 ? 'Under consideration' : '',
      notes: 'Review rejection reason for possible resubmission or appeal',
    }
  })
}

const RejectedLiquidations = () => {
  const [sortKey, setSortKey] = useState('rejectionDate')
  const [sortDirection, setSortDirection] = useState('desc')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [reasonFilter, setReasonFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  const rejectedData = useMemo(() => createRejectedLiquidationsData(20), [])

  //   filter
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...rejectedData]

    if (departmentFilter) {
      filtered = filtered.filter((item) => item.department === departmentFilter)
    }

    if (reasonFilter) {
      filtered = filtered.filter((item) => item.rejectionReason === reasonFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.referenceId.toString().includes(query) ||
          item.employee.toLowerCase().includes(query) ||
          item.department.toLowerCase().includes(query) ||
          item.particulars.toLowerCase().includes(query) ||
          item.liquidationType.toLowerCase().includes(query) ||
          item.rejectedBy.toLowerCase().includes(query) ||
          item.rejectionReason.toLowerCase().includes(query)
      )
    }

    // Sorting
    return filtered.sort((a, b) => {
      if (
        sortKey === 'liquidationDate' ||
        sortKey === 'rejectionDate' ||
        sortKey === 'resubmissionDate'
      ) {
        const dateA = new Date(a[sortKey] || 0)
        const dateB = new Date(b[sortKey] || 0)
        if (dateA < dateB) return sortDirection === 'asc' ? -1 : 1
        if (dateA > dateB) return sortDirection === 'asc' ? 1 : -1
        return 0
      }

      if (['amount', 'supportingDocs'].includes(sortKey)) {
        if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
        if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
        return 0
      }

      if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [rejectedData, sortKey, sortDirection, departmentFilter, reasonFilter, searchQuery])

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

  //   export
  const handleExportSelected = () => {
    if (selectedRows.length === 0) return

    const selectedData = rejectedData.filter((row) => selectedRows.includes(row.id))

    const exportData = selectedData.map((row) => ({
      'Reference ID': `RLIQ-${row.referenceId.toString().padStart(6, '0')}`,
      Employee: row.employee,
      Department: row.department,
      Particulars: row.particulars,
      Amount: `₱${row.amount.toLocaleString()}`,
      Status: row.status,
      'Request Date': new Date(row.liquidationDate).toLocaleDateString(),
      'Rejection Date': row.rejectionDate ? new Date(row.rejectionDate).toLocaleDateString() : '-',
      'Liquidation Type': row.liquidationType,
      'Supporting Documents': row.supportingDocs,
      'Rejected By': row.rejectedBy,
      'Rejection Reason': row.rejectionReason,
      'Can Be Resubmitted': row.resubmittable ? 'Yes' : 'No',
      'Resubmission Date': row.resubmissionDate
        ? new Date(row.resubmissionDate).toLocaleDateString()
        : '-',
      'Appeal Status': row.appealStatus,
      'Appeal Notes': row.appealNotes || '-',
      Notes: row.notes,
    }))

    const headers = [
      'Reference ID',
      'Employee',
      'Department',
      'Particulars',
      'Amount',
      'Status',
      'Request Date',
      'Rejection Date',
      'Liquidation Type',
      'Supporting Documents',
      'Rejected By',
      'Rejection Reason',
      'Can Be Resubmitted',
      'Resubmission Date',
      'Appeal Status',
      'Appeal Notes',
      'Notes',
    ]
    const csvContent = [
      headers.join(','),
      ...exportData.map((row) =>
        [
          row['Reference ID'],
          `"${row['Employee']}"`,
          `"${row['Department']}"`,
          `"${row['Particulars']}"`,
          row['Amount'].replace('₱', '').replace(/,/g, ''),
          row['Status'],
          row['Request Date'],
          row['Rejection Date'],
          row['Liquidation Type'],
          row['Supporting Documents'],
          `"${row['Rejected By']}"`,
          `"${row['Rejection Reason']}"`,
          row['Can Be Resubmitted'],
          row['Resubmission Date'],
          row['Appeal Status'],
          `"${row['Appeal Notes']}"`,
          `"${row['Notes']}"`,
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `rejected-liquidations-${new Date().toISOString().split('T')[0]}.csv`
    )
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 p-3">
        <div className="mt-3">
          <Cards cardData={cardDataCustodian} />
        </div>

        {/* Main header section */}
        <div className="bg-component shadow-lg rounded-lg border border-slate-400 mb-3">
          <div className="px-4 py-1">
            <h1 className="text-2xl font-bold text-gray-800">Rejected Liquidations</h1>
            <p className="text-gray-600">
              View rejected liquidation requests and rejection details
            </p>
          </div>

          {/* Filters and search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 pb-2 gap-3">
            <div className="flex flex-wrap gap-2">
              <select
                className="px-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                {Array.from(new Set(rejectedData.map((item) => item.department))).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <select
                className="px-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm"
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
              >
                <option value="">All Rejection Reasons</option>
                {Array.from(new Set(rejectedData.map((item) => item.rejectionReason))).map(
                  (reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search by ID, employee, department, particulars, or rejection reason..."
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
                {selectedRows.length > 0 && (
                  <>
                    <button
                      onClick={handleExportSelected}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center gap-2"
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
                  </>
                )}
              </div>
            </div>

            <PlatformTable
              columns={rejectedLiquidationsColumns}
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
              onDownload={(row) => console.log('Download rejection documentation:', row)}
              actionButtonProps={{
                downloadLabel: 'Download Rejection',
                showDownload: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RejectedLiquidations
