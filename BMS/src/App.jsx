import { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from './components/SideBar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [sortKey, setSortKey] = useState('department')
  const [sortDirection, setSortDirection] = useState('asc')

  const handleSort = (key) => {
    setSortDirection((prev) => (sortKey === key && prev === 'asc' ? 'desc' : 'asc'))
    setSortKey(key)
  }

  return (
    <div className="bg-slate-200 h-screen overflow-hidden font-[customFont]">
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

          {/* Dashboard Component */}
          <Dashboard
            sortKey={sortKey}
            setSortKey={setSortKey}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            handleSort={handleSort}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default App
