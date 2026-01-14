import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LiquidationForm = ({ isOpen, onClose, onSubmit }) => {
  const [rows, setRows] = useState([
    {
      id: 1,
      date: new Date().toISOString().split('T')[0],
      rtNumber: '',
      storeName: '',
      particulars: '',
      purpose: '',
      from: '',
      to: '',
      modeOfTransportation: '',
      amount: '',
      receipt: null,
    },
  ])

  const [formData, setFormData] = useState({
    notes: '',
  })

  const storeNames = [
    'SM Supermarket',
    'Robinsons Supermarket',
    'Puregold',
    'Metro Supermarket',
    '7-Eleven',
    'Ministop',
    'Family Mart',
    'Lawson',
    'Mercury Drugstore',
    'Watsons',
  ]

  const particularsList = [
    'Office Supplies',
    'Transportation',
    'Meals',
    'Accommodation',
    'Communication',
    'Utilities',
    'Maintenance',
    'Equipment',
    'Training',
    'Entertainment',
  ]

  const locations = [
    'Manila',
    'Quezon City',
    'Makati',
    'Taguig',
    'Pasig',
    'Mandaluyong',
    'San Juan',
    'Caloocan',
    'Pasay',
    'Valenzuela',
    'Las Piñas',
    'Parañaque',
    'Muntinlupa',
  ]

  const transportModes = [
    'Taxi',
    'Ride-hailing',
    'Private Vehicle',
    'Company Vehicle',
    'Air Travel',
    'Sea Travel',
    'Train',
  ]

  const handleRowChange = (id, field, value) => {
    setRows((prevRows) => prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
  }

  const handleAmountChange = (id, e) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    handleRowChange(id, 'amount', value)
  }

  const handleClearAmount = (id) => {
    handleRowChange(id, 'amount', '')
  }

  const handleAddRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map((row) => row.id)) + 1 : 1
    setRows([
      ...rows,
      {
        id: newId,
        date: new Date().toISOString().split('T')[0],
        rtNumber: '',
        storeName: '',
        particulars: '',
        purpose: '',
        from: '',
        to: '',
        modeOfTransportation: '',
        amount: '',
        receipt: null,
      },
    ])
  }

  const handleRemoveRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id))
    }
  }

  const handleReceiptUpload = (id, e) => {
    const file = e.target.files[0]
    if (file) {
      handleRowChange(id, 'receipt', file)
    }
  }

  const handleRemoveReceipt = (id) => {
    handleRowChange(id, 'receipt', null)
  }

  const handleNotesChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      notes: e.target.value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Liquidation form submitted:', { rows, formData })
    onSubmit({ rows, formData })
    onClose()
  }

  const formatAmount = (amount) => {
    if (!amount) return ''
    return `₱${parseInt(amount).toLocaleString()}`
  }

  const calculateTotal = () => {
    return rows.reduce((sum, row) => sum + parseInt(row.amount || 0), 0)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Full Screen Modal */}
          <motion.div
            className="relative bg-component shadow-xl border border-slate-400 w-screen h-screen m-0 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
              scale: { duration: 0.3 },
              y: { duration: 0.3 },
            }}
          >
            {/* Modal Header */}
            <div className="bg-linear-to-r from-red-800 to-red-600 text-white px-8 py-5">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">Liquidation Form</h2>
                  <p className="text-red-100 text-base mt-1">
                    Submit liquidation details for completed requests
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:text-red-200 transition p-2 rounded-full hover:bg-red-700 cursor-pointer"
                >
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body with Sticky Footer */}
            <div className="p-6 overflow-y-auto h-[calc(100vh-140px)]">
              <form onSubmit={handleSubmit} className="h-full flex flex-col">
                {/* Main Content Container */}
                <div className="flex-1 overflow-y-auto">
                  {/* Table Section */}
                  <div className="mb-6">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-3 mb-3 px-1 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="col-span-1 text-center">Date</div>
                      <div className="col-span-1 text-center">RT#</div>
                      <div className="col-span-2 text-center">Store</div>
                      <div className="col-span-2 text-center">Particulars</div>
                      <div className="col-span-1 text-center">Purpose</div>
                      <div className="col-span-1 text-center">From</div>
                      <div className="col-span-1 text-center">To</div>
                      <div className="col-span-1 text-center">Transport</div>
                      <div className="col-span-1 text-center">Amount</div>
                      <div className="col-span-1 text-center">Actions</div>
                    </div>

                    {/* Table Rows */}
                    <div className="space-y-2">
                      {rows.map((row) => (
                        <div key={row.id} className="grid grid-cols-12 gap-3 items-center px-1">
                          {/* Date */}
                          <div className="col-span-1">
                            <input
                              type="date"
                              value={row.date}
                              onChange={(e) => handleRowChange(row.id, 'date', e.target.value)}
                              className="w-full px-2 py-2.5 text-sm border border-slate-400 rounded focus:outline-none focus:ring-1 bg-white"
                              required
                            />
                          </div>

                          {/* RT Number */}
                          <div className="col-span-1">
                            <input
                              type="text"
                              value={row.rtNumber}
                              onChange={(e) => handleRowChange(row.id, 'rtNumber', e.target.value)}
                              className="w-full px-2 py-2.5 text-sm border border-slate-400 rounded focus:outline-none focus:ring-1 bg-white"
                              placeholder="RT#"
                              required
                            />
                          </div>

                          {/* Store Name */}
                          <div className="col-span-2">
                            <select
                              value={row.storeName}
                              onChange={(e) => handleRowChange(row.id, 'storeName', e.target.value)}
                              className="w-full px-2 py-2.5 text-sm border border-slate-400 rounded focus:outline-none focus:ring-1 bg-white"
                              required
                            >
                              <option value="">Select</option>
                              {storeNames.map((store) => (
                                <option key={store} value={store}>
                                  {store}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Particulars */}
                          <div className="col-span-2">
                            <select
                              value={row.particulars}
                              onChange={(e) =>
                                handleRowChange(row.id, 'particulars', e.target.value)
                              }
                              className="w-full px-2 py-2.5 text-sm border border-slate-400 rounded focus:outline-none focus:ring-1 bg-white"
                              required
                            >
                              <option value="">Select</option>
                              {particularsList.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Purpose */}
                          <div className="col-span-1">
                            <input
                              type="text"
                              value={row.purpose}
                              onChange={(e) => handleRowChange(row.id, 'purpose', e.target.value)}
                              className="w-full px-2 py-2.5 text-sm border border-slate-400 rounded focus:outline-none focus:ring-1 bg-white"
                              placeholder="Purpose"
                              required
                            />
                          </div>

                          {/* From */}
                          <div className="col-span-1">
                            <select
                              value={row.from}
                              onChange={(e) => handleRowChange(row.id, 'from', e.target.value)}
                              className="w-full px-2 py-2.5 text-sm border border-slate-400 rounded focus:outline-none focus:ring-1 bg-white"
                              required
                            >
                              <option value="">Select</option>
                              {locations.map((location) => (
                                <option key={location} value={location}>
                                  {location}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* To */}
                          <div className="col-span-1">
                            <select
                              value={row.to}
                              onChange={(e) => handleRowChange(row.id, 'to', e.target.value)}
                              className="w-full px-2 py-2.5 text-sm border border-slate-400 rounded focus:outline-none focus:ring-1 bg-white"
                              required
                            >
                              <option value="">Select</option>
                              {locations.map((location) => (
                                <option key={location} value={location}>
                                  {location}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Mode of Transportation */}
                          <div className="col-span-1">
                            <select
                              value={row.modeOfTransportation}
                              onChange={(e) =>
                                handleRowChange(row.id, 'modeOfTransportation', e.target.value)
                              }
                              className="w-full px-2 py-2.5 text-sm border border-slate-400 rounded focus:outline-none focus:ring-1 bg-white"
                              required
                            >
                              <option value="">Select</option>
                              {transportModes.map((mode) => (
                                <option key={mode} value={mode}>
                                  {mode}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Amount */}
                          <div className="col-span-1">
                            <div className="relative">
                              <input
                                type="text"
                                value={formatAmount(row.amount)}
                                onChange={(e) => handleAmountChange(row.id, e)}
                                className="w-full px-2 py-2.5 pr-8 text-sm border border-slate-400 rounded focus:outline-none focus:ring-1 bg-white"
                                placeholder="₱0"
                                required
                              />
                              {row.amount && (
                                <button
                                  type="button"
                                  onClick={() => handleClearAmount(row.id)}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                  title="Clear amount"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="col-span-1">
                            <div className="flex items-center justify-center gap-2">
                              {/* Receipt Upload Icon */}
                              <div className="relative group">
                                <input
                                  type="file"
                                  onChange={(e) => handleReceiptUpload(row.id, e)}
                                  className="hidden"
                                  id={`receipt-${row.id}`}
                                  accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <label
                                  htmlFor={`receipt-${row.id}`}
                                  className="cursor-pointer flex items-center justify-center p-2  hover:bg-red-50 rounded transition-colors"
                                  title={
                                    row.receipt ? `Uploaded: ${row.receipt.name}` : 'Upload receipt'
                                  }
                                >
                                  {row.receipt ? (
                                    <svg
                                      className="w-5 h-5 cursor-pointer"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                      />
                                    </svg>
                                  )}
                                </label>
                                {/* Remove Receipt Button */}
                                {row.receipt && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveReceipt(row.id)}
                                    className="absolute -top-1 -right-1 w-4 h-4 text-red-600 hover:text-red-800 bg-white rounded-full shadow border border-red-200 flex items-center justify-center cursor-pointer"
                                    title="Remove receipt"
                                  >
                                    <svg
                                      className="w-2.5 h-2.5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                )}
                              </div>

                              {/* Remove Row Button */}
                              {rows.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveRow(row.id)}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                  title="Remove row"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Row Button */}
                    <div className="flex justify-center mt-4">
                      <button
                        type="button"
                        onClick={handleAddRow}
                        className="px-5 py-2.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Add Row
                      </button>
                    </div>
                  </div>

                  {/* Total Amount and Remarks in One Row */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Total Amount Section */}
                    <div className="p-5 bg-gray-50 rounded-lg border border-slate-200">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Total Amount</h3>
                        <p className="text-sm text-gray-600 mb-3">Sum of all expense amounts</p>
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold text-green-700">
                            ₱{calculateTotal().toLocaleString()}
                          </span>
                          <span className="ml-3 text-sm text-gray-500">
                            {rows.length} item{rows.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Remarks Section */}
                    <div className="p-5 bg-gray-50 rounded-lg border border-slate-200">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">Remarks</h3>
                      <textarea
                        value={formData.notes}
                        onChange={handleNotesChange}
                        className="w-full h-28 px-4 py-3 text-sm border border-slate-400 rounded-lg focus:outline-none focus:ring-1 bg-white resize-none"
                        placeholder="Enter any additional notes, remarks, or special instructions..."
                      />
                    </div>
                  </div>
                </div>

                {/* Sticky Modal Footer */}
                <div className="sticky bottom-0 bg-component pt-4 border-t border-slate-200">
                  <div className="flex justify-end gap-4 py-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2.5 border border-slate-400 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-linear-to-r from-green-800 to-green-600 text-white rounded-lg hover:from-green-900 hover:to-green-700 transition-all font-medium text-sm shadow-sm hover:shadow cursor-pointer"
                    >
                      Submit Liquidation
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LiquidationForm
