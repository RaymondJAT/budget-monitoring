import React, { useState, useEffect } from 'react'

const Calendar = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDates, setSelectedDates] = useState([])
  const [currentMonth, setCurrentMonth] = useState([])
  const [showOrderInfo, setShowOrderInfo] = useState(false)

  // Subscription details state
  const [deliverySchedule, setDeliverySchedule] = useState('morning')
  const [quantity, setQuantity] = useState(20)
  const [customQuantity, setCustomQuantity] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')

  // Initialize with today as selected
  useEffect(() => {
    const today = new Date()
    setSelectedDates([today.toDateString()])
    generateMonthData()
  }, [currentDate])

  const generateMonthData = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Calculate empty cells for first week alignment
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = getDaysInMonth(year, month)

    const monthArray = []

    // Add empty cells for alignment
    for (let i = 0; i < firstDay; i++) {
      monthArray.push(null)
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      monthArray.push({
        date,
        dayOfWeek: date.getDay(),
        dayName: getDayName(date.getDay()),
        isToday: date.toDateString() === new Date().toDateString(),
      })
    }

    setCurrentMonth(monthArray)
  }

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getDayName = (dayIndex) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days[dayIndex]
  }

  const getMonthName = (month) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    return months[month]
  }

  const handleDateClick = (date) => {
    const dateString = date.toDateString()
    let newSelectedDates

    if (selectedDates.includes(dateString)) {
      // Remove if already selected
      newSelectedDates = selectedDates.filter((d) => d !== dateString)
    } else {
      // Add if not selected
      newSelectedDates = [...selectedDates, dateString]
    }

    setSelectedDates(newSelectedDates)

    if (onDateSelect) {
      onDateSelect({
        dates: newSelectedDates,
        schedule: deliverySchedule,
        quantity: quantity === 'custom' ? parseInt(customQuantity) || 0 : quantity,
        instructions: specialInstructions,
      })
    }
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleSelectAllWeekdays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const newSelectedDates = []

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dayOfWeek = date.getDay()
      // Select weekdays only (Mon-Fri, where 1=Mon, 5=Fri)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        newSelectedDates.push(date.toDateString())
      }
    }

    setSelectedDates(newSelectedDates)
    updateParent()
  }

  const handleSelectAllWeekends = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const newSelectedDates = []

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dayOfWeek = date.getDay()
      // Select weekends only (Sat-Sun, where 0=Sun, 6=Sat)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        newSelectedDates.push(date.toDateString())
      }
    }

    setSelectedDates(newSelectedDates)
    updateParent()
  }

  const handleClearAll = () => {
    setSelectedDates([])
    updateParent()
  }

  const updateParent = () => {
    if (onDateSelect) {
      onDateSelect({
        dates: selectedDates,
        schedule: deliverySchedule,
        quantity: quantity === 'custom' ? parseInt(customQuantity) || 0 : quantity,
        instructions: specialInstructions,
      })
    }
  }

  const handleQuantityChange = (value) => {
    setQuantity(value)
    if (value !== 'custom') {
      setCustomQuantity('')
    }
    setTimeout(updateParent, 0)
  }

  const handleCustomQuantityChange = (e) => {
    const value = e.target.value.replace(/\D/g, '') // Numbers only
    setCustomQuantity(value)
    setTimeout(updateParent, 0)
  }

  const handleScheduleChange = (schedule) => {
    setDeliverySchedule(schedule)
    setTimeout(updateParent, 0)
  }

  const handleSpecialInstructionsChange = (e) => {
    setSpecialInstructions(e.target.value)
    setTimeout(updateParent, 0)
  }

  const isDateSelected = (date) => {
    return selectedDates.includes(date.toDateString())
  }

  const getDateStyle = (date, isToday) => {
    const isSelected = isDateSelected(date)

    if (isSelected) {
      if (isToday) {
        return 'bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg'
      }
      return 'bg-gradient-to-br from-amber-200 to-amber-300 text-amber-900 shadow-md'
    }

    if (isToday) {
      return 'bg-amber-100 text-amber-800 border-2 border-amber-300'
    }

    return 'bg-gray-50 hover:bg-amber-50 text-gray-700 hover:text-amber-700'
  }

  const getScheduleTime = () => {
    return deliverySchedule === 'morning' ? '6:30 AM - 10:00 AM' : '3:00 PM - 7:00 PM'
  }

  const getFinalQuantity = () => {
    if (quantity === 'custom') {
      return parseInt(customQuantity) || 0
    }
    return quantity
  }

  const getTotalPandesal = () => {
    return selectedDates.length * getFinalQuantity()
  }

  // Format date for display
  const formatDateDisplay = (dateStr) => {
    const date = new Date(dateStr)
    return `${getDayName(date.getDay())}, ${getMonthName(date.getMonth())} ${date.getDate()}`
  }

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Help Button - Top Right */}
      <div className="flex justify-end px-4 pt-4">
        <button
          onClick={() => setShowOrderInfo(!showOrderInfo)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors duration-200 text-sm font-medium"
        >
          <span>❓</span>
          {showOrderInfo ? 'Hide Order Info' : 'How to Order & FAQ'}
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4">
        {/* Left Panel - Compact Calendar */}
        <div className="lg:w-2/3 flex flex-col">
          <div className="bg-white rounded-2xl shadow-lg p-4 flex-1 flex flex-col">
            {/* Compact Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-800">
                  {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={handleToday}
                  className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg font-medium hover:bg-amber-200 transition-colors duration-200 text-sm"
                >
                  Today
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 hover:text-amber-700 transition-colors text-sm"
                >
                  ←
                </button>
                <button
                  onClick={handleNextMonth}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 hover:text-amber-700 transition-colors text-sm"
                >
                  →
                </button>
              </div>
            </div>

            {/* Compact Calendar Grid */}
            <div className="flex-1 overflow-auto">
              <div className="min-w-max">
                {/* Weekday Headers - Compact */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div
                      key={index}
                      className="text-center py-2 text-xs font-semibold text-gray-500"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Compact Dates Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {currentMonth.map((dayData, index) => {
                    if (!dayData) {
                      return <div key={index} className="aspect-square"></div>
                    }

                    const { date, isToday } = dayData
                    const isSelected = isDateSelected(date)

                    return (
                      <div key={index} className="relative">
                        <button
                          onClick={() => handleDateClick(date)}
                          className={`w-full aspect-square flex flex-col items-center justify-center rounded-lg transition-all duration-200 ${getDateStyle(
                            date,
                            isToday
                          )} 
                            ${
                              isSelected ? 'transform hover:scale-105' : 'hover:scale-102'
                            } text-sm`}
                        >
                          <span className="text-base font-semibold">{date.getDate()}</span>

                          {/* Selection indicator */}
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAllWeekdays}
                  className="flex-1 px-3 py-2 bg-white border border-amber-200 text-amber-700 rounded-lg font-medium hover:bg-amber-50 transition-colors duration-200 text-sm"
                >
                  All Weekdays
                </button>
                <button
                  onClick={handleSelectAllWeekends}
                  className="flex-1 px-3 py-2 bg-white border border-amber-200 text-amber-700 rounded-lg font-medium hover:bg-amber-50 transition-colors duration-200 text-sm"
                >
                  All Weekends
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Subscription Details */}
        <div className="lg:w-1/3 flex flex-col h-full">
          <div className="bg-gradient-to-b from-amber-50 to-orange-50 rounded-2xl shadow-lg p-4 flex-1 flex flex-col overflow-hidden">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-1">Pandesal Subscription</h3>
              <p className="text-sm text-gray-600">Customize your delivery</p>
            </div>

            {/* Compact Sections */}
            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              {/* Delivery Schedule */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
                  <span className="text-amber-600">⏰</span>
                  Delivery Schedule
                </h4>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleScheduleChange('morning')}
                    className={`flex-1 py-2 rounded-lg border transition-all duration-200 flex flex-col items-center justify-center ${
                      deliverySchedule === 'morning'
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-200 hover:border-amber-200 hover:bg-amber-50'
                    }`}
                  >
                    <span className="font-medium text-sm">Morning</span>
                    <span className="text-xs text-gray-600">6:30-10 AM</span>
                  </button>

                  <button
                    onClick={() => handleScheduleChange('evening')}
                    className={`flex-1 py-2 rounded-lg border transition-all duration-200 flex flex-col items-center justify-center ${
                      deliverySchedule === 'evening'
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-200 hover:border-amber-200 hover:bg-amber-50'
                    }`}
                  >
                    <span className="font-medium text-sm">Evening</span>
                    <span className="text-xs text-gray-600">3-7 PM</span>
                  </button>
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
                  <span className="text-amber-600">🥖</span>
                  Quantity per Delivery
                </h4>

                <div className="grid grid-cols-4 gap-1 mb-3">
                  {[20, 40, 50, 'custom'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleQuantityChange(option)}
                      className={`py-2 rounded-md transition-all duration-200 text-sm ${
                        quantity === option
                          ? 'bg-amber-500 text-white font-semibold'
                          : 'bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-700'
                      }`}
                    >
                      {option === 'custom' ? 'Custom' : `${option}`}
                    </button>
                  ))}
                </div>

                {quantity === 'custom' && (
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        value={customQuantity}
                        onChange={handleCustomQuantityChange}
                        placeholder="Enter quantity"
                        className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-200 focus:outline-none"
                      />
                      <span className="absolute right-3 top-2 text-gray-500 text-sm">pcs</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Minimum: 20 pieces</p>
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
                  <span className="text-amber-600">📝</span>
                  Special Instructions
                </h4>

                <textarea
                  value={specialInstructions}
                  onChange={handleSpecialInstructionsChange}
                  placeholder="Any special requests?"
                  className="w-full h-20 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-200 focus:outline-none resize-none"
                  rows="3"
                />
              </div>

              {/* Selected Dates */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-800 text-sm">Selected Dates</h4>
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                    {selectedDates.length} day{selectedDates.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {selectedDates.length > 0 ? (
                    selectedDates.map((dateStr, index) => {
                      const date = new Date(dateStr)
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-amber-50 rounded text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 flex items-center justify-center bg-amber-100 rounded">
                              <span className="text-amber-800 font-bold text-xs">
                                {date.getDate()}
                              </span>
                            </div>
                            <span className="font-medium text-gray-800">
                              {getDayName(date.getDay()).substring(0, 3)}
                            </span>
                          </div>
                          <span className="text-amber-700 text-xs">
                            {deliverySchedule === 'morning' ? '6:30-10 AM' : '3-7 PM'}
                          </span>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-3 text-gray-400 text-sm">
                      <p>No dates selected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary - Fixed at bottom */}
            <div className="mt-4 pt-4 border-t border-amber-200">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-lg">Order Summary</h4>
                  <div className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full">
                    📦
                  </div>
                </div>

                {/* Order Dates Display */}
                {selectedDates.length > 0 && (
                  <div className="mb-3 p-2 bg-white/10 rounded-lg">
                    <p className="text-amber-100 text-xs font-medium mb-1">Delivery Dates:</p>
                    <div className="space-y-1">
                      {selectedDates.slice(0, 3).map((dateStr, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-xs">{formatDateDisplay(dateStr)}</span>
                          <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded">
                            {deliverySchedule === 'morning' ? 'Morning' : 'Evening'}
                          </span>
                        </div>
                      ))}
                      {selectedDates.length > 3 && (
                        <div className="text-center">
                          <span className="text-xs text-amber-200">
                            +{selectedDates.length - 3} more date
                            {selectedDates.length - 3 !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-100 text-sm">Selected Days</span>
                    <span className="font-bold">{selectedDates.length}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-amber-100 text-sm">Pieces per delivery</span>
                    <span className="font-bold">{getFinalQuantity()} pcs</span>
                  </div>

                  <div className="h-px bg-white/20 my-1"></div>

                  <div className="flex justify-between items-center text-base">
                    <span className="font-bold">Total Pandesal</span>
                    <span className="font-bold">{getTotalPandesal()} pcs</span>
                  </div>

                  {specialInstructions && (
                    <div className="mt-2 text-xs text-amber-200 bg-white/10 p-2 rounded">
                      📝 With special instructions
                    </div>
                  )}
                </div>

                <button
                  className="w-full py-3 bg-white text-amber-700 font-bold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white text-sm"
                  disabled={
                    selectedDates.length === 0 ||
                    (quantity === 'custom' && (!customQuantity || parseInt(customQuantity) < 20))
                  }
                >
                  {selectedDates.length === 0
                    ? 'Select Delivery Dates'
                    : `Subscribe to ${selectedDates.length} Delivery${
                        selectedDates.length !== 1 ? 's' : ''
                      }`}
                </button>

                <p className="text-center text-amber-200 text-xs mt-3">
                  🎉 Free delivery on all subscriptions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible How to Order & FAQ Section */}
      {showOrderInfo && (
        <div className="px-4 pb-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-800">How to Order & FAQ</h3>
              <button
                onClick={() => setShowOrderInfo(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Delivery Schedule Section */}
              <div className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-amber-600">🚚</span>
                    Delivery Schedule
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-semibold text-amber-700 mb-1">Morning Delivery</h5>
                      <p className="text-gray-700 text-sm">
                        Monday to Saturday 6:30 AM to 10:00 AM
                      </p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-amber-700 mb-1">
                        Afternoon/Night Delivery
                      </h5>
                      <p className="text-gray-700 text-sm">Monday to Saturday 3:00 PM to 7:00 PM</p>
                    </div>
                    <div className="pt-3 border-t border-amber-200">
                      <h5 className="font-semibold text-amber-700 mb-1">Cut-off Times</h5>
                      <p className="text-gray-700 text-sm">
                        Cut-off for Monday delivery is Saturday, 7:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cancellation & Refund Policy */}
                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-red-600">⚠️</span>
                    Cancellation & Refund Policy
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>
                        Strictly no cancellations or refunds once an order form is completed and
                        delivery has started.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>
                        Cancellation is allowed only if requested at least 2 days before
                        subscription start date (with confirmation from our team).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>
                        Customers may pause or reschedule their subscription if requested before the
                        weekly cutoff (Saturday at 7:00 PM).
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Promos & Discounts Section */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-blue-600">🎯</span>
                  Senior Citizen & PWD Discounts
                </h4>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="space-y-2">
                    <h5 className="font-semibold text-blue-700">1. Discount Eligibility</h5>
                    <p>
                      Each Senior Citizen or PWD cardholder is entitled to one discounted pandesal
                      subscription plan per subscription period, strictly for personal consumption.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-semibold text-blue-700">2. Submission of Valid ID</h5>
                    <p>
                      A valid Senior Citizen ID or PWD ID must be submitted before placing an order
                      to avail of the discount.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-semibold text-blue-700">3. Name Verification</h5>
                    <p>The name on the ID must match the name on the subscription order form.</p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-semibold text-blue-700">4. Separate Orders</h5>
                    <p>
                      If ordering for non-SC/PWD cardholders, please place a separate order through
                      the PandeDaily website.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-semibold text-blue-700">5. Manual Ordering Process</h5>
                    <p>All SC/PWD discount orders must be placed manually with our team:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Finalize your order with our PandeDaily representative</li>
                      <li>Receive a confirmation email with your discounted total</li>
                      <li>
                        Send proof of payment within 24 hours via social media or email at
                        customerservice@pandedaily.com
                      </li>
                    </ol>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-blue-200">
                    <h5 className="font-semibold text-blue-700">6. Discount Limitations</h5>
                    <p>
                      Senior Citizen and PWD discounts cannot be combined with other promos or
                      discounts.
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-white rounded-lg border border-blue-300">
                  <p className="text-sm text-blue-700 font-medium">
                    💡{' '}
                    <span className="ml-1">
                      Need help with SC/PWD orders? Contact us at customerservice@pandedaily.com
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions at Bottom */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:customerservice@pandedaily.com"
                  className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors duration-200 text-center flex items-center justify-center gap-2"
                >
                  📧 Email Support
                </a>
                <button className="flex-1 px-4 py-3 bg-white border-2 border-amber-500 text-amber-700 rounded-lg font-medium hover:bg-amber-50 transition-colors duration-200 text-center">
                  📞 Call Us
                </button>
                <button
                  onClick={() => setShowOrderInfo(false)}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendar
