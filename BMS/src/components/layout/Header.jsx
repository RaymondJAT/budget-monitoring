import { FiBell, FiChevronDown, FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { notifications } from '../../data/notifications'

const Header = () => {
  const [showCalendar, setShowCalendar] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Get current date string
  const currentDateString = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Generate calendar for current month
  const generateCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // First day of the month
    const firstDay = new Date(year, month, 1)
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)
    // Days in month
    const daysInMonth = lastDay.getDate()
    // Starting day of week (0 = Sunday, 1 = Monday, etc.)
    const startDay = firstDay.getDay()

    const days = []

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        isToday: false,
      })
    }

    // Current month days
    const today = new Date()
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      days.push({
        date,
        isCurrentMonth: true,
        isToday:
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear(),
      })
    }

    // Next month days
    const totalCells = 42 // 6 weeks * 7 days
    const nextMonthDays = totalCells - days.length
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false,
      })
    }

    return days
  }

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Format month and year
  const formatMonthYear = () => {
    return currentMonth.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })
  }

  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Sample events for the month
  const monthlyEvents = [
    {
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 15),
      title: 'Budget Review',
    },
    {
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 20),
      title: 'Report Due',
    },
    {
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 25),
      title: 'Team Meeting',
    },
  ]

  return (
    <header className="sticky top-0 z-30 bg-component border-r border-b border-slate-400">
      <div className="flex items-center justify-between px-6 py-2">
        <div className="flex-1 flex justify-end items-center space-x-4">
          {/* Calendar */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCalendar(!showCalendar)
                setShowNotifications(false)
              }}
              className="relative p-2 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
            >
              <FiCalendar size={20} />
            </button>

            <AnimatePresence>
              {showCalendar && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50"
                >
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold">Calendar</h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={prevMonth}
                          className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                        >
                          <FiChevronLeft size={16} />
                        </button>
                        <span className="text-sm font-medium">{formatMonthYear()}</span>
                        <button
                          onClick={nextMonth}
                          className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                        >
                          <FiChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{currentDateString}</p>
                  </div>

                  {/* Calendar Grid */}
                  <div className="p-4">
                    {/* Day Names */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {dayNames.map((day) => (
                        <div
                          key={day}
                          className="text-center text-xs font-medium text-gray-500 py-1"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1">
                      {generateCalendar().map((day, index) => {
                        const hasEvent = monthlyEvents.some(
                          (event) =>
                            event.date.getDate() === day.date.getDate() &&
                            event.date.getMonth() === day.date.getMonth() &&
                            event.date.getFullYear() === day.date.getFullYear()
                        )

                        return (
                          <div
                            key={index}
                            className={`
                              text-center text-sm p-1 rounded cursor-pointer relative
                              ${!day.isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                              ${day.isToday ? 'bg-rose-100 text-rose-700 font-medium' : ''}
                              hover:bg-gray-100
                            `}
                            onClick={() => setCurrentDate(day.date)}
                          >
                            {day.date.getDate()}
                            {hasEvent && (
                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-rose-500"></div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowCalendar(false)
              }}
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu)
                setShowCalendar(false)
                setShowNotifications(false)
              }}
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
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer">
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
