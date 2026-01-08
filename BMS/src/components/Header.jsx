import { FiBell, FiChevronDown, FiCalendar } from 'react-icons/fi'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { notifications } from '../data/notifications'

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-white border-r border-b border-slate-400">
      {/* Top Section */}
      <div className="flex items-center justify-between px-6 py-2">
        {/* Left Section */}
        <div className="flex-1">
          <div className="mb-1">
            <h1 className="text-lg font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-sm text-gray-600">
              Welcome back! Here's what's happening with your budget today.
            </p>
          </div>
        </div>

        {/* Right Section - Icons and User Profile */}
        <div className="flex-1 flex justify-end items-center space-x-4">
          {/* Calendar Icon */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
          >
            <FiCalendar size={20} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
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
              className="flex items-center space-x-3 p-2 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
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
                    <button className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer">
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
      {/* <div className="px-6 py-2 bg-gray-50 border-t">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="hover:text-rose-600 cursor-pointer">Dashboard</span>
          <span>/</span>
          <span className="text-gray-800">Overview</span>
        </div>
      </div> */}
    </header>
  )
}

export default Header
