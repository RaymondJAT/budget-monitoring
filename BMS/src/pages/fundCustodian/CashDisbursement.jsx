import { useMemo, useState } from 'react'
import PlatformTable from '../../components/PlatformTable'
import Cards from '../../components/Cards'
import { cardDataCustodian } from '../../data/cardData'

const cashDisbursementColumns = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    align: 'center',
    minWidth: '80px',
    render: (value) => (
      <span className="font-medium text-gray-800 text-sm">{value.toString().padStart(3, '0')}</span>
    ),
  },
  {
    key: 'revolvingFund',
    label: 'Revolving Fund',
    sortable: true,
    align: 'left',
    minWidth: '150px',
    render: (value) => <span className="font-medium text-gray-800 text-sm">{value}</span>,
  },
  {
    key: 'dateIssue',
    label: 'Date Issue',
    sortable: true,
    align: 'center',
    minWidth: '100px',
    render: (value) => {
      const date = new Date(value)
      return (
        <span className="text-gray-700 text-xs">
          {date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: '2-digit' })}
        </span>
      )
    },
  },
  {
    key: 'receivedBy',
    label: 'Received By',
    sortable: true,
    align: 'left',
    minWidth: '120px',
    render: (value) => <span className="font-medium text-gray-800 text-sm">{value}</span>,
  },
  {
    key: 'department',
    label: 'Department',
    sortable: true,
    align: 'left',
    minWidth: '120px',
    render: (value) => <span className="font-medium text-gray-800 text-sm">{value}</span>,
  },
  {
    key: 'particulars',
    label: 'Particulars',
    sortable: true,
    align: 'left',
    minWidth: '180px',
    render: (value) => <span className="text-gray-700 text-sm">{value}</span>,
  },
  {
    key: 'cashVoucher',
    label: 'Cash Voucher',
    sortable: true,
    align: 'center',
    minWidth: '100px',
    render: (value) => (
      <span className="font-medium text-blue-600 text-sm">
        CV-{value.toString().padStart(4, '0')}
      </span>
    ),
  },
  {
    key: 'amountIssue',
    label: 'Amount Issue',
    sortable: true,
    align: 'right',
    minWidth: '110px',
    render: (value) => (
      <span className="font-semibold text-amber-700 text-sm">₱{value.toLocaleString()}</span>
    ),
  },
  {
    key: 'amountExpended',
    label: 'Amount Expended',
    sortable: true,
    align: 'right',
    minWidth: '120px',
    render: (value) => (
      <span className="font-semibold text-rose-700 text-sm">₱{value.toLocaleString()}</span>
    ),
  },
  {
    key: 'outstandingAmount',
    label: 'Outstanding',
    sortable: true,
    align: 'right',
    minWidth: '130px',
    render: (value) => {
      let textColor = 'text-gray-700'
      if (value > 0) {
        textColor = 'text-red-700'
      }
      return <span className={`font-semibold ${textColor} text-sm`}>₱{value.toLocaleString()}</span>
    },
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    align: 'center',
    minWidth: '120px',
    render: (value) => {
      let bgColor = 'bg-gray-100'
      let textColor = 'text-gray-800'
      let borderColor = 'border-gray-300'

      switch (value) {
        case 'Liquidated':
          bgColor = 'bg-green-50'
          textColor = 'text-green-800'
          borderColor = 'border-green-200'
          break
        case 'Unliquidated':
          bgColor = 'bg-yellow-50'
          textColor = 'text-yellow-800'
          borderColor = 'border-yellow-200'
          break
        default:
          bgColor = 'bg-gray-100'
          textColor = 'text-gray-800'
          borderColor = 'border-gray-300'
      }

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold border ${bgColor} ${textColor} ${borderColor}`}
        >
          {value}
        </span>
      )
    },
  },
  {
    key: 'dateLiquidated',
    label: 'Date Liquidated',
    sortable: true,
    align: 'center',
    minWidth: '110px',
    render: (value) => {
      if (!value) {
        return <span className="text-gray-400 text-xs">-</span>
      }
      const date = new Date(value)
      return (
        <span className="text-gray-700 text-xs">
          {date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: '2-digit' })}
        </span>
      )
    },
  },
]

const createCashDisbursementData = (count) => {
  const revolvingFunds = [
    'Petty Cash Fund',
    'Emergency Fund',
    'Travel Fund',
    'Office Supplies Fund',
    'Maintenance Fund',
    'Marketing Fund',
    'Training Fund',
    'Utilities Fund',
    'Equipment Fund',
    'Contingency Fund',
  ]

  const particulars = [
    'Office Supplies Purchase',
    'Travel Expenses - Client Meeting',
    'Equipment Maintenance',
    'Team Lunch',
    'Software Subscription',
    'Conference Registration',
    'Transportation Allowance',
    'Utility Bill Payment',
    'Training Materials',
    'Emergency Repair',
    'Marketing Materials',
    'Client Entertainment',
    'Research Materials',
    'Office Furniture',
    'Internet Subscription',
  ]

  const departments = ['Finance', 'HR', 'IT', 'Sales', 'R&D']
  const employees = [
    'John Smith',
    'Maria Garcia',
    'Robert Johnson',
    'Sarah Williams',
    'Michael Brown',
    'Lisa Davis',
    'David Miller',
    'Jennifer Wilson',
    'James Taylor',
    'Patricia Anderson',
  ]

  // Generate random dates
  const generateRandomDate = (startOffset = 0, endOffset = 90) => {
    const start = new Date()
    start.setDate(start.getDate() - endOffset)
    const end = new Date()
    end.setDate(end.getDate() - startOffset)

    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    return randomDate.toISOString().split('T')[0]
  }

  const generateLiquidationDate = (issueDate) => {
    const issue = new Date(issueDate)

    issue.setDate(issue.getDate() + Math.floor(Math.random() * 30) + 1)
    return issue.toISOString().split('T')[0]
  }

  return Array.from({ length: count }, (_, i) => {
    const amountIssue = Math.floor(Math.random() * 50000) + 5000
    const amountExpended = Math.floor(amountIssue * (Math.random() * 0.8 + 0.1))
    const outstandingAmount = Math.max(0, amountIssue - amountExpended)

    const dateIssue = generateRandomDate(30, 90)

    let status = 'Unliquidated'
    let dateLiquidated = null

    if (Math.random() < 0.4 || outstandingAmount === 0) {
      status = 'Liquidated'
      dateLiquidated = generateLiquidationDate(dateIssue)
    }

    return {
      id: i + 1,
      revolvingFund: revolvingFunds[i % revolvingFunds.length],
      dateIssue: dateIssue,
      receivedBy: employees[i % employees.length],
      department: departments[i % departments.length],
      particulars: particulars[i % particulars.length],
      cashVoucher: i + 1001,
      amountIssue: amountIssue,
      amountExpended: amountExpended,
      outstandingAmount: outstandingAmount,
      status: status,
      dateLiquidated: dateLiquidated,
    }
  })
}

const CashDisbursement = () => {
  const [sortKey, setSortKey] = useState('id')
  const [sortDirection, setSortDirection] = useState('asc')
  const [statusFilter, setStatusFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const cashDisbursementData = useMemo(() => createCashDisbursementData(30), [])

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...cashDisbursementData]

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
          item.revolvingFund.toLowerCase().includes(query) ||
          item.receivedBy.toLowerCase().includes(query) ||
          item.department.toLowerCase().includes(query) ||
          item.particulars.toLowerCase().includes(query) ||
          `cv-${item.cashVoucher.toString().padStart(4, '0')}`.includes(query)
      )
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortKey === 'dateIssue' || sortKey === 'dateLiquidated') {
        const dateA = new Date(a[sortKey] || 0)
        const dateB = new Date(b[sortKey] || 0)
        if (dateA < dateB) return sortDirection === 'asc' ? -1 : 1
        if (dateA > dateB) return sortDirection === 'asc' ? 1 : -1
        return 0
      }

      const numericFields = ['amountIssue', 'amountExpended', 'outstandingAmount', 'cashVoucher']
      if (numericFields.includes(sortKey)) {
        if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
        if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
        return 0
      }

      if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [cashDisbursementData, sortKey, sortDirection, statusFilter, departmentFilter, searchQuery])

  const handleSort = (key) => {
    setSortDirection((prev) => (sortKey === key && prev === 'asc' ? 'desc' : 'asc'))
    setSortKey(key)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 p-3">
        <div className="mt-3">
          <Cards cardData={cardDataCustodian} />
        </div>

        <div className="bg-component shadow-lg rounded-lg border border-slate-400 mb-3">
          <div className="px-4 py-1">
            <h1 className="text-2xl font-bold text-gray-800">Cash Disbursement Management</h1>
            <p className="text-gray-600">Track and manage cash disbursements and liquidations</p>
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
                <option value="Liquidated">Liquidated</option>
                <option value="Unliquidated">Unliquidated</option>
              </select>
              <select
                className="px-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 text-sm"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                {Array.from(new Set(cashDisbursementData.map((item) => item.department))).map(
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
                placeholder="Search revolving fund, received by, or particulars..."
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
            <div className="overflow-x-auto overflow-y-auto h-full">
              <PlatformTable
                columns={cashDisbursementColumns}
                data={filteredAndSortedData}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
                maxHeight="none"
                title="Cash Disbursement Details"
                responsive={true}
                containerClassName="h-full"
                tableClassName="w-full table-auto"
                headerClassName="sticky top-0 bg-white z-10"
                cellClassName="whitespace-nowrap"
                onEdit={(row) => console.log('Edit cash disbursement:', row)}
                actionButtonProps={{
                  editLabel: 'Edit Cash Disbursement',
                  showEdit: true,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CashDisbursement
