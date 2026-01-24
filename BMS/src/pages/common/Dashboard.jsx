import { useMemo } from 'react'
import Cards from '../../components/Cards'
import CashFlowChart from '../../components/charts/CashflowChart'
import CashrequestPiechart from '../../components/charts/CashrequestPiechart'
import LiquidationPiechart from '../../components/charts/LiquidationPiechart'
import OutstandingBalanceChart from '../../components/charts/OutstandingBalanceChart'
import PlatformTable, { budgetColumns, createBudgetData } from '../../components/PlatformTable'
import { cardDataCustodian } from '../../data/cardData'

const Dashboard = ({ sortKey, sortDirection, handleSort }) => {
  const budgets = useMemo(() => createBudgetData(8), [])

  const sortedBudgets = useMemo(() => {
    return [...budgets].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [budgets, sortKey, sortDirection])

  // Mock data for the pie charts
  const cashRequestsData = {
    pending_requests: 10,
    approved_requests: 25,
    completed_requests: 15,
    rejected_requests: 5,
  }

  const liquidationsData = {
    pending_liquidations: 8,
    approved_liquidations: 20,
    verified_liquidations: 12,
    completed_liquidations: 18,
    rejected_liquidations: 3,
  }

  // Define columns for Pending Cash Requests
  const pendingCashRequestColumns = [
    {
      label: 'Reference ID',
      key: 'referenceId',
      sortable: true,
    },
    {
      label: 'Employee',
      key: 'employee',
      sortable: true,
    },
    {
      label: 'Particulars',
      key: 'particulars',
      sortable: true,
    },
    {
      label: 'Amount',
      key: 'amount',
      sortable: true,
      cell: (value) => `₱${value.toLocaleString()}`,
    },
    {
      label: 'Status',
      key: 'status',
      sortable: true,
      cell: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'Pending'
              ? 'bg-yellow-100 text-yellow-800'
              : value === 'Approved'
                ? 'bg-green-100 text-green-800'
                : value === 'Rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value}
        </span>
      ),
    },
  ]

  // Mock data for pending cash requests (replace with your actual data)
  const pendingCashRequestData = useMemo(
    () => [
      {
        id: 1,
        referenceId: 'CR-2024-001',
        employee: 'John Doe',
        particulars: 'Office Supplies Purchase',
        amount: 15000,
        status: 'Pending',
      },
      {
        id: 2,
        referenceId: 'CR-2024-002',
        employee: 'Jane Smith',
        particulars: 'Business Travel Expense',
        amount: 25000,
        status: 'Pending',
      },
      {
        id: 3,
        referenceId: 'CR-2024-003',
        employee: 'Mike Johnson',
        particulars: 'Equipment Maintenance',
        amount: 18000,
        status: 'Pending',
      },
      {
        id: 4,
        referenceId: 'CR-2024-004',
        employee: 'Sarah Williams',
        particulars: 'Conference Registration',
        amount: 12000,
        status: 'Pending',
      },
      // Add more mock data as needed
    ],
    [],
  )

  // Sort pending cash requests data
  const sortedPendingCashRequests = useMemo(() => {
    return [...pendingCashRequestData].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [pendingCashRequestData, sortKey, sortDirection])

  return (
    <div className="pt-6 p-3 space-y-3">
      {/* Dashboard Cards */}
      <Cards cardData={cardDataCustodian} />

      {/* Top Section */}
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Cash Flow Chart */}
          <div className="lg:col-span-8">
            <CashFlowChart />
          </div>

          {/* Right Cash Requests */}
          <div className="lg:col-span-4">
            <div className="h-full w-full bg-component shadow-xl rounded-lg border border-slate-400 flex flex-col">
              <div className="p-3 shrink-0">
                <div className="text-center">
                  <p className="font-bold text-sm mb-1">Cash Requests</p>
                  <small className="text-gray-500 text-xs">Distribution</small>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <CashrequestPiechart data={cashRequestsData} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Left */}
          <div className="w-full lg:col-span-8">
            <OutstandingBalanceChart />
          </div>

          {/* Right */}
          <div className="lg:col-span-4">
            <div className="h-full w-full bg-component shadow-xl rounded-lg border border-slate-400 flex flex-col">
              <div className="p-3 shrink-0">
                <div className="text-center">
                  <p className="font-bold text-sm mb-1">Liquidations</p>
                  <small className="text-gray-500 text-xs">Status Overview</small>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <LiquidationPiechart data={liquidationsData} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Pending Cash Requests */}
          <div className="bg-component shadow-lg rounded-lg border border-slate-400 p-4">
            <PlatformTable
              columns={pendingCashRequestColumns}
              data={sortedPendingCashRequests}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
              maxHeight="300px"
              title="Pending Cash Requests"
              onView={(row) => console.log('View', row)}
              onEdit={(row) => console.log('Edit', row)}
              onDelete={(row) => console.log('Delete', row)}
              showActions={false}
            />
          </div>

          {/* Pending Liquidations */}
          <div className="bg-component shadow-lg rounded-lg border border-slate-400 p-4">
            <PlatformTable
              columns={budgetColumns}
              data={sortedBudgets}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
              maxHeight="300px"
              title="Pending Liquidations"
              onView={(row) => console.log('View', row)}
              onEdit={(row) => console.log('Edit', row)}
              onDelete={(row) => console.log('Delete', row)}
              showActions={false}
            />
          </div>
        </div>
      </div>

      {/* revolving fund activity */}
      <div className="space-y-6">
        <div className="bg-component shadow-lg rounded-lg border border-slate-400 p-4">
          <PlatformTable
            columns={budgetColumns}
            data={sortedBudgets}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            maxHeight="300px"
            title="Revolving Fund Activity"
            onView={(row) => console.log('View', row)}
            onEdit={(row) => console.log('Edit', row)}
            onDelete={(row) => console.log('Delete', row)}
            showActions={false}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
