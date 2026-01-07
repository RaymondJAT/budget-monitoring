import { FiBell, FiSearch, FiChevronDown, FiCalendar } from 'react-icons/fi'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const notifications = [
    { id: 1, text: 'New cash request submitted', time: '10 min ago' },
    { id: 2, text: 'Liquidation needs review', time: '25 min ago' },
    { id: 3, text: 'Budget allocation updated', time: '1 hour ago' },
  ]

  return (
    <header className="sticky top-0 z-30 bg-white border border-slate-300">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cash requests, users, stores..."
              className="pl-10 pr-4 py-2 w-64 md:w-96 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <FiCalendar size={20} />
            </button>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <FiBell size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50"
                >
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <p className="text-sm">{notification.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 text-center border-t">
                    <button className="text-rose-600 text-sm hover:text-rose-800">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-r from-rose-500 to-pink-500"></div>
              <div className="text-left">
                <p className="text-sm font-semibold">John Doe</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <FiChevronDown />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50"
                >
                  <div className="p-4 border-b">
                    <p className="font-semibold">John Doe</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 rounded transition-colors">
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-6 py-2 bg-gray-50 border-t">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="hover:text-rose-600 cursor-pointer">Dashboard</span>
          <span>/</span>
          <span className="text-gray-800">Overview</span>
        </div>
      </div>
    </header>
  )
}

export default Header
