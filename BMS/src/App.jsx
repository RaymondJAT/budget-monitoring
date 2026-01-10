import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from './components/layout/SideBar'
import Header from './components/layout/Header'
import Dashboard from './pages/common/Dashboard'
import Users from './pages/admin/Users'
import Access from './pages/admin/Access'

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
      <div className="h-screen overflow-hidden font-mono bg-linear-to-br from-red-600 via-rose-100 to-red-500">
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

            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    sortKey={sortKey}
                    setSortKey={setSortKey}
                    sortDirection={sortDirection}
                    setSortDirection={setSortDirection}
                    handleSort={handleSort}
                  />
                }
              />

              <Route path="/users" element={<Users />} />
              <Route path="/access" element={<Access />} />
            </Routes>
          </div>
        </motion.div>
      </div>
    </Router>
  )
}

export default App
