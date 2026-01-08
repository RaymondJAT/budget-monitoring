import { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from './components/SideBar'
import Header from './components/Header'
import Cards from './components/Cards'
import CashFlowChart from './components/charts/CashflowChart'
import CashrequestPiechart from './components/charts/CashrequestPiechart'
import LiquidationPiechart from './components/charts/LiquidationPiechart'
import OutstandingBalanceChart from './components/charts/OutstandingBalanceChart'
import PlatformTable, { budgetColumns, createBudgetData } from './components/PlatformTable'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

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

  // Create sample budget data
  const budgetData = createBudgetData('basic', 25)

  return (
    <div className="bg-slate-100 h-screen overflow-hidden font-[customFont]">
      {/* Sidebar */}
      <Sidebar open={isSidebarOpen} setOpen={setIsSidebarOpen} />

      {/* Main content */}
      <motion.div
        className="h-screen overflow-auto"
        animate={{
          marginLeft: isSidebarOpen ? 225 : 56,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="min-h-full max-w-full">
          <Header />

          <div className="pt-6 p-3 space-y-4">
            {/* Dashboard Cards */}
            <Cards />

            {/* Top Section - 70%/30% layout */}
            <div className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Cash Flow Chart - 70% width */}
                <div className="lg:col-span-8">
                  <CashFlowChart sidebarOpen={isSidebarOpen} />
                </div>

                {/* Right column with Cash Requests Pie Chart */}
                <div className="lg:col-span-4">
                  <div className="h-full w-full bg-white rounded-sm border border-slate-400 flex flex-col">
                    <div className="p-3 shrink-0">
                      <div className="text-center">
                        <p className="font-bold text-sm mb-1">Cash Requests</p>
                        <small className="text-gray-500 text-xs">Distribution</small>
                      </div>
                    </div>
                    <div className="flex-1 min-h-0">
                      <CashrequestPiechart data={cashRequestsData} sidebarOpen={isSidebarOpen} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section - Two charts side by side */}
            <div className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left - Outstanding Balance Chart */}
                <div className="w-full lg:col-span-8">
                  <OutstandingBalanceChart sidebarOpen={isSidebarOpen} />
                </div>

                {/* Right - Liquidations Pie Chart */}
                <div className="lg:col-span-4">
                  <div className="h-full w-full bg-white rounded-sm border border-slate-400 flex flex-col">
                    <div className="p-3 shrink-0">
                      <div className="text-center">
                        <p className="font-bold text-sm mb-1">Liquidations</p>
                        <small className="text-gray-500 text-xs">Status Overview</small>
                      </div>
                    </div>
                    <div className="flex-1 min-h-0">
                      <LiquidationPiechart data={liquidationsData} sidebarOpen={isSidebarOpen} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Monitoring Tables Section */}
            <div className="space-y-6">
              {/* Budget Overview Table */}
              <div className="bg-white rounded-lg shadow">
                <PlatformTable
                  columns={budgetColumns.basic}
                  data={budgetData}
                  title="Budget Overview"
                  searchable
                  sortable
                  filterable
                  pagination
                  pageSize={8}
                  onRowClick={(row) => console.log('Budget selected:', row)}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default App
