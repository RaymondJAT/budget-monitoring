import { BrowserRouter as Router } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from './components/layout/SideBar'
import Header from './components/layout/Header'
import Routing from './routes/Routing'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [sortKey, setSortKey] = useState('department')
  const [sortDirection, setSortDirection] = useState('asc')

  const handleSort = (key) => {
    setSortDirection((prev) => (sortKey === key && prev === 'asc' ? 'desc' : 'asc'))
    setSortKey(key)
  }

  return (
    <Router>
      <div className="h-screen overflow-hidden font-mono bg-linear-to-br from-red-800 via-rose-100 to-red-600">
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
            <Routing
              sortKey={sortKey}
              setSortKey={setSortKey}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              handleSort={handleSort}
            />
          </div>
        </motion.div>
      </div>
    </Router>
  )
}

export default App
