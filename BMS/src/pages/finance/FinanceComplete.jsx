import { useMemo, useState } from 'react'
import PlatformTable from '../../components/PlatformTable'

const financeCompleteColumns = [
  {
    key: 'referenceId',
    label: 'Reference ID',
    sortable: true,
    width: '12%',
    align: 'center',
    render: (value) => (
      <span className="font-mono font-semibold text-blue-700">
        FCP-{value.toString().padStart(6, '0')}
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
        Completed: { color: 'bg-emerald-100 text-emerald-800', border: 'border-emerald-200' },
      }

      const config = statusConfig[value] || statusConfig['Completed']

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
      if (!value) return <span className="text-gray-400">-</span>

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

const createFinanceCompleteData = (count) => {
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

  const generateRandomDate = (startDaysAgo = 90) => {
    const start = new Date()
    start.setDate(start.getDate() - startDaysAgo)
    const end = new Date()

    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    return randomDate.toISOString().split('T')[0]
  }

  return Array.from({ length: count }, (_, i) => {
    const amount = Math.floor(Math.random() * 50000) + 1000
    const liquidationDate = generateRandomDate(120)
    const completionDate = generateRandomDate(30)

    return {
      id: i + 1,
      referenceId: 1900000 + i + 1,
      employee: employees[Math.floor(Math.random() * employees.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      particulars: particulars[Math.floor(Math.random() * particulars.length)],
      amount: amount,
      status: 'Completed',
      liquidationDate: liquidationDate,
      completionDate: completionDate,
      completedBy: `Finance Officer ${Math.floor(Math.random() * 5) + 1}`,
      completionNotes: [
        'All documents verified and processed',
        'Payment released successfully',
        'Liquidation fully completed',
        'Audit requirements satisfied',
        'Process completed without issues',
        'All receipts accounted for',
      ][Math.floor(Math.random() * 6)],
      paymentMethod: ['Cash', 'Check', 'Bank Transfer', 'Online Payment'][
        Math.floor(Math.random() * 4)
      ],
      receiptNumber: `RCPT-FIN-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(5, '0')}`,
      notes: 'Finance processing completed successfully',
    }
  })
}

const FinanceComplete = () => {
  const [sortKey, setSortKey] = useState('liquidationDate')
  const [sortDirection, setSortDirection] = useState('desc')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  const financeCompleteData = useMemo(() => createFinanceCompleteData(35), [])

  //   filter
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...financeCompleteData]

    if (departmentFilter) {
      filtered = filtered.filter((item) => item.department === departmentFilter)
    }

    if (paymentMethodFilter) {
      filtered = filtered.filter((item) => item.paymentMethod === paymentMethodFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.referenceId.toString().includes(query) ||
          item.employee.toLowerCase().includes(query) ||
          item.department.toLowerCase().includes(query) ||
          item.particulars.toLowerCase().includes(query) ||
          item.completedBy.toLowerCase().includes(query) ||
          item.receiptNumber.toLowerCase().includes(query) ||
          item.completionNotes.toLowerCase().includes(query)
      )
    }

    // Sorting
    return filtered.sort((a, b) => {
      if (sortKey === 'liquidationDate' || sortKey === 'completionDate') {
        const dateA = new Date(a[sortKey] || 0)
        const dateB = new Date(b[sortKey] || 0)
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
  }, [
    financeCompleteData,
    sortKey,
    sortDirection,
    departmentFilter,
    paymentMethodFilter,
    searchQuery,
  ])

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

    const selectedData = financeCompleteData.filter((row) => selectedRows.includes(row.id))

    const exportData = selectedData.map((row) => ({
      'Reference ID': `FCP-${row.referenceId.toString().padStart(6, '0')}`,
      Employee: row.employee,
      Department: row.department,
      Particulars: row.particulars,
      Amount: `₱${row.amount.toLocaleString()}`,
      Status: row.status,
      'Liquidation Date': row.liquidationDate
        ? new Date(row.liquidationDate).toLocaleDateString()
        : '-',
      'Completion Date': row.completionDate
        ? new Date(row.completionDate).toLocaleDateString()
        : '-',
      'Completed By': row.completedBy,
      'Completion Notes': row.completionNotes,
      'Payment Method': row.paymentMethod,
      'Receipt Number': row.receiptNumber,
      Notes: row.notes,
    }))

    const headers = [
      'Reference ID',
      'Employee',
      'Department',
      'Particulars',
      'Amount',
      'Status',
      'Liquidation Date',
      'Completion Date',
      'Completed By',
      'Completion Notes',
      'Payment Method',
      'Receipt Number',
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
          row['Liquidation Date'],
          row['Completion Date'],
          `"${row['Completed By']}"`,
          `"${row['Completion Notes']}"`,
          row['Payment Method'],
          row['Receipt Number'],
          `"${row['Notes']}"`,
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `finance-complete-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 p-3">
        {/* Main header section */}
        <div className="bg-component shadow-lg rounded-lg border border-slate-400 mb-3">
          <div className="px-4 py-1">
            <h1 className="text-2xl font-bold text-gray-800">Finance Completed Liquidations</h1>
            <p className="text-gray-600">View liquidations completed by finance department</p>
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
                {Array.from(new Set(financeCompleteData.map((item) => item.department))).map(
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
                placeholder="Search by ID, employee, department, particulars, or receipt number..."
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
              columns={financeCompleteColumns}
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
              onDownload={(row) => console.log('Download completion documentation:', row)}
              actionButtonProps={{
                downloadLabel: 'Download Receipt',
                showDownload: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinanceComplete
