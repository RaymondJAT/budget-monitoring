import { useMemo } from 'react'
import Cards from '../components/Cards'
import CashFlowChart from '../components/charts/CashflowChart'
import CashrequestPiechart from '../components/charts/CashrequestPiechart'
import LiquidationPiechart from '../components/charts/LiquidationPiechart'
import OutstandingBalanceChart from '../components/charts/OutstandingBalanceChart'
import PlatformTable, { budgetColumns, createBudgetData } from '../components/PlatformTable'

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

  return (
    <div className="pt-6 p-3 space-y-3">
      {/* Dashboard Cards */}
      <Cards />

      {/* Top Section */}
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Cash Flow Chart */}
          <div className="lg:col-span-8">
            <CashFlowChart />
          </div>

          {/* Right column with Cash Requests Pie Chart */}
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

      {/* Budget Monitoring Table Section */}
      <div className="space-y-6">
        <div className="bg-component shadow-lg rounded-sm border border-slate-400 p-4">
          <PlatformTable
            columns={budgetColumns}
            data={sortedBudgets}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            maxHeight="300px"
            title="Pending Cash Requests"
            onView={(row) => console.log('View', row)}
            onEdit={(row) => console.log('Edit', row)}
            onDelete={(row) => console.log('Delete', row)}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-component shadow-lg rounded-sm border border-slate-400 p-4">
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
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-component shadow-lg rounded-sm border border-slate-400 p-4">
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
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
