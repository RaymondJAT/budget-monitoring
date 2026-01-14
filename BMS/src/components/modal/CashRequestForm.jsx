import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CashRequestForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    particulars: '',
    employee: 'Juan Dela Cruz',
    department: 'Information Technology',
    position: 'Senior Software Developer',
    requestDate: new Date().toISOString().split('T')[0],
    teamLead: '',
    amount: '',
  })

  const teamLeads = [
    'Maria Santos',
    'John Smith',
    'Anna Reyes',
    'Michael Johnson',
    'Sarah Lim',
    'Robert Garcia',
  ]

  const departments = [
    'Information Technology',
    'Finance',
    'Human Resources',
    'Sales',
    'Marketing',
    'Operations',
    'Research & Development',
    'Administration',
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setFormData((prev) => ({
      ...prev,
      amount: value,
    }))
  }

  const handleClearAmount = () => {
    setFormData((prev) => ({
      ...prev,
      amount: '',
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    onSubmit(formData)
    onClose()
  }

  const formatAmount = (amount) => {
    if (!amount) return ''
    return `₱${parseInt(amount).toLocaleString()}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="relative bg-component shadow-xl rounded-lg border border-slate-400 w-full max-w-2xl max-h-[90vh] overflow-hidden"
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
            <div className="bg-linear-to-r from-red-800 to-red-600 text-white px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">New Cash Request</h2>
                  <p className="text-red-100 text-sm mt-0.5">
                    Fill out the form to submit a new cash request
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:text-red-200 transition p-1 rounded-full hover:bg-red-700 cursor-pointer"
                >
                  <svg
                    className="w-6 h-6"
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

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Particulars */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Particulars <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="particulars"
                        value={formData.particulars}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-1 bg-white"
                        rows="2"
                        placeholder="Enter details about the cash request..."
                        required
                      />
                    </div>

                    {/* Employee */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employee <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="employee"
                        value={formData.employee}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-1 bg-white"
                        required
                      />
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-1 bg-white"
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Position */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-1 bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Request Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Request Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="requestDate"
                        value={formData.requestDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-1 bg-white"
                        required
                      />
                    </div>

                    {/* Team Lead */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Team Lead <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="teamLead"
                        value={formData.teamLead}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-1 bg-white"
                        required
                      >
                        <option value="">Select Team Lead</option>
                        {teamLeads.map((lead) => (
                          <option key={lead} value={lead}>
                            {lead}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (₱) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="amount"
                          value={formatAmount(formData.amount)}
                          onChange={handleAmountChange}
                          className="w-full px-3 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-1 bg-white pr-10"
                          placeholder="0.00"
                          required
                        />
                        {formData.amount && (
                          <button
                            type="button"
                            onClick={handleClearAmount}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <svg
                              className="w-5 h-5"
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
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Enter amount in pesos</p>
                    </div>

                    {/* Preview */}
                    <div className="bg-gray-50 p-2 rounded-lg border border-slate-200">
                      <h3 className="font-medium text-gray-700 mb-2">Amount Preview</h3>
                      <div className="text-xl font-bold text-green-700">
                        {formData.amount ? formatAmount(formData.amount) : '₱0.00'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-slate-400 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-linear-to-r from-green-700 to-green-600 text-white rounded-lg hover:from-green-800 hover:to-green-700 transition-all font-medium shadow-sm hover:shadow cursor-pointer"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CashRequestForm
