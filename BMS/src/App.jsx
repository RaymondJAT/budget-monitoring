import { useState } from 'react'
import Sidebar from './components/SideBar'
import Header from './components/Header'
import { motion } from 'framer-motion'
import Cards from './components/Cards'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex bg-slate-100 h-screen overflow-hidden">
      <Sidebar open={isSidebarOpen} setOpen={setIsSidebarOpen} />

      <motion.div
        layout
        className="h-screen w-full overflow-auto transition-all duration-300"
        style={{
          marginLeft: isSidebarOpen ? '225px' : '56px',
          width: isSidebarOpen ? 'calc(100% - 225px)' : 'calc(100% - 56px)',
        }}
      >
        <div className="min-h-full p-3">
          <Header />

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-6"
          >
            <Cards />
            {/* <div className="mb-8 pt-2">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
              <p className="text-gray-600 mt-2">
                Welcome back! Here's what's happening with your budget today.
              </p>
            </div> */}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default App
