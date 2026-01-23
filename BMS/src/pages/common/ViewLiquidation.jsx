import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useMemo, useState, useEffect } from 'react'

const ViewLiquidation = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [currentUserRole, setCurrentUserRole] = useState('requester')

  useEffect(() => {
    if (location.state?.role) {
      setCurrentUserRole(location.state.role)
    }
  }, [location.state])

  // Mock data for liquidation
  const liquidationData = useMemo(() => {
    return {
      id: parseInt(id) || 1,
      referenceId: `LIQ-${(900000 + (parseInt(id) || 1)).toString().padStart(6, '0')}`,
      employee: location.state?.liquidationData?.employee || 'Juan Dela Cruz',
      department: location.state?.liquidationData?.department || 'Information Technology',
      position: 'Senior Software Developer',
      liquidationType: location.state?.liquidationData?.liquidationType || 'Travel Expense',
      liquidationDate: new Date().toISOString().split('T')[0],
      deadlineDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      supportingDocs: location.state?.liquidationData?.supportingDocs || 3,
      approvalStatus: location.state?.liquidationData?.approvalStatus || 'Under Verification',
      notes: location.state?.liquidationData?.notes || 'All receipts attached',

      // Expenses table data
      expenses: [
        {
          id: 1,
          date: '2024-03-15',
          rtNumber: 'RT-001',
          storeName: 'Office Depot',
          particulars: 'Office Supplies',
          purpose: 'Team Project',
          from: 'Office',
          to: 'Office',
          modeOfTransportation: 'Personal Vehicle',
          amount: 2450.75,
          remarks:
            'Receipt attached for printer ink, paper, and pens. All items purchased for the upcoming team project.',
          uploadedReceipts: ['receipt1.jpg', 'receipt2.jpg'],
        },
        {
          id: 2,
          date: '2024-03-16',
          rtNumber: 'RT-002',
          storeName: 'Petron Gas Station',
          particulars: 'Fuel',
          purpose: 'Client Meeting Travel',
          from: 'Manila',
          to: 'Laguna',
          modeOfTransportation: 'Company Car',
          amount: 3200.0,
          remarks:
            'Official travel to meet with ABC Corp client. Filled up 40 liters of diesel fuel.',
          uploadedReceipts: ['receipt3.jpg'],
        },
        {
          id: 3,
          date: '2024-03-17',
          rtNumber: 'RT-003',
          storeName: 'Starbucks',
          particulars: 'Client Meeting',
          purpose: 'Business Development',
          from: 'Makati',
          to: 'Makati',
          modeOfTransportation: 'Walking',
          amount: 850.5,
          remarks:
            'Coffee meeting with potential partner for Q3 collaboration. Discussed integration possibilities.',
          uploadedReceipts: ['receipt4.jpg'],
        },
        {
          id: 4,
          date: '2024-03-18',
          rtNumber: 'RT-004',
          storeName: 'Lazada',
          particulars: 'Software License',
          purpose: 'Project Requirement',
          from: 'Online',
          to: 'Office',
          modeOfTransportation: 'Delivery',
          amount: 12500.0,
          remarks:
            'Annual subscription for project management software. Needed for team collaboration on new project.',
          uploadedReceipts: ['receipt5.pdf', 'invoice.pdf'],
        },
      ],

      // Summary
      totalAmount: 20001.25,
      submittedDate: new Date().toISOString().split('T')[0],
      verifiedBy: 'Maria Santos',
      verifiedDate: '2024-03-20',
      approvedBy: 'John Smith',
      approvedDate: '2024-03-21',
    }
  }, [id, location.state])

  const [selectedExpense, setSelectedExpense] = useState(null)
  const [viewingReceipt, setViewingReceipt] = useState(null)

  const handleBack = () => {
    navigate(-1)
  }

  const handlePrint = () => {
    console.log('Printing liquidation:', liquidationData.id)
    window.print()
  }

  const handleDownloadPDF = () => {
    console.log('Downloading PDF for liquidation:', liquidationData.id)
    // Implement PDF download functionality
  }

  const handleApprove = () => {
    console.log('Approving liquidation:', liquidationData.id)
    alert('Liquidation approved successfully!')
  }

  const handleReject = () => {
    console.log('Rejecting liquidation:', liquidationData.id)
    alert('Liquidation rejected!')
  }

  const handleVerify = () => {
    console.log('Verifying liquidation:', liquidationData.id)
    alert('Liquidation verified!')
  }

  const handleViewReceipt = (receiptName) => {
    setViewingReceipt(receiptName)
    // In a real application, this would open a modal or new tab with the receipt image/PDF
    console.log('Viewing receipt:', receiptName)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const handleExpenseClick = (expense) => {
    setSelectedExpense(expense)
    setViewingReceipt(null)
  }

  const renderActionButtons = () => {
    return (
      <div className="flex flex-wrap gap-2">
        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium flex items-center gap-2 cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print
        </button>

        {/* Role-based actions - Approve/Reject for both teamLeader and approver roles */}
        {(currentUserRole === 'teamLeader' || currentUserRole === 'approver') && (
          <>
            <button
              onClick={handleApprove}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center gap-2 cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Approve
            </button>
            <button
              onClick={handleReject}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium flex items-center gap-2 cursor-pointer"
            >
              <svg
                className="w-4 h-4"
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
              Reject
            </button>
          </>
        )}

        {currentUserRole === 'custodian' && (
          <button
            onClick={handleVerify}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Verify
          </button>
        )}

        {/* Download PDF Button */}
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium flex items-center gap-2 border border-slate-400 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download PDF
        </button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 p-3">
        {/* Main header section */}
        <div className="bg-component shadow-lg rounded-lg border border-slate-400 mb-3">
          <div className="px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="flex items-center text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  <span className="text-sm">Back</span>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Liquidation Details</h1>
                  <p className="text-gray-600">Reference: {liquidationData.referenceId}</p>
                </div>
              </div>
              <div>{renderActionButtons()}</div>
            </div>
          </div>
        </div>

        {/* Liquidation Details */}
        <div className="bg-component shadow-lg rounded-lg border border-slate-400 mb-3">
          <div className="px-6 py-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Liquidation Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Employee</label>
                <p className="mt-1 font-medium">{liquidationData.employee}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Department</label>
                <p className="mt-1 font-medium">{liquidationData.department}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Liquidation Type</label>
                <p className="mt-1 font-medium">{liquidationData.liquidationType}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Liquidation Date</label>
                <p className="mt-1 font-medium">{formatDate(liquidationData.liquidationDate)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-3 h-[calc(100vh-270px)]">
          {/* Expenses Table - Takes more width now */}
          <div className="lg:w-3/4 flex flex-col">
            <div className="bg-component shadow-lg rounded-lg border border-slate-400 flex-1 flex flex-col min-h-0">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-bold text-gray-800">Expense Details</h2>
              </div>

              <div className="flex-1 overflow-hidden p-4">
                <div className="h-full overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Date
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          RT#
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Store Name
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Particulars
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Purpose
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          From
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          To
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Transportation
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Amount
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          View
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {liquidationData.expenses.map((expense) => (
                        <tr
                          key={expense.id}
                          className="hover:bg-gray-50"
                          onClick={() => handleExpenseClick(expense)}
                        >
                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                            {formatDate(expense.date)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-mono">
                            {expense.rtNumber}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                            {expense.storeName}
                          </td>
                          <td
                            className="px-3 py-2 text-sm truncate max-w-45"
                            title={expense.particulars}
                          >
                            {expense.particulars}
                          </td>
                          <td
                            className="px-3 py-2 text-sm truncate max-w-45"
                            title={expense.purpose}
                          >
                            {expense.purpose}
                          </td>
                          <td className="px-3 py-2 text-sm truncate max-w-30" title={expense.from}>
                            {expense.from}
                          </td>
                          <td className="px-3 py-2 text-sm truncate max-w-30" title={expense.to}>
                            {expense.to}
                          </td>
                          <td
                            className="px-3 py-2 text-sm truncate max-w-35"
                            title={expense.modeOfTransportation}
                          >
                            {expense.modeOfTransportation}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-semibold text-green-700">
                            {formatCurrency(expense.amount)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                            <button
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleExpenseClick(expense)
                              }}
                              title="View expense details"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Panel - Reduced width */}
          <div className="lg:w-1/4 flex flex-col gap-3 min-h-0">
            {/* Amount Summary - Compact */}
            <div className="bg-component shadow-lg rounded-lg border border-slate-400">
              <div className="px-4 py-3 border-b border-slate-200">
                <h2 className="text-lg font-bold text-gray-800">Amount Summary</h2>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                    <span className="text-xl font-bold text-green-700">
                      {formatCurrency(liquidationData.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Expense Details - Compact */}
            <div className="bg-component shadow-lg rounded-lg border border-slate-400 flex-1 flex flex-col min-h-0">
              <div className="px-4 py-3 border-b border-slate-200">
                <h2 className="text-lg font-bold text-gray-800 truncate">
                  {selectedExpense ? `${selectedExpense.rtNumber}` : 'Select Expense'}
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {selectedExpense ? (
                  <div className="space-y-3 h-full">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Remarks
                      </label>
                      <div className="p-2 bg-gray-50 rounded border border-slate-200 text-sm max-h-24 overflow-y-auto">
                        {selectedExpense.remarks}
                      </div>
                    </div>

                    <div className="flex-1 min-h-0">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Receipts
                      </label>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {selectedExpense.uploadedReceipts.map((receipt, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-1.5 bg-blue-50 rounded border border-blue-100 hover:bg-blue-100 transition-colors group cursor-pointer"
                            onClick={() => handleViewReceipt(receipt)}
                          >
                            <div className="flex items-center gap-1 min-w-0 flex-1">
                              <svg
                                className="w-3 h-3 text-blue-600 shrink-0"
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
                              <span
                                className="text-xs font-medium text-blue-800 truncate hover:text-blue-900 transition-colors"
                                title={`Click to view ${receipt}`}
                              >
                                {receipt}
                              </span>
                            </div>
                            <button
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition shrink-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewReceipt(receipt)
                              }}
                              title="View receipt"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Receipt Viewer Section */}
                    {viewingReceipt && (
                      <div className="pt-3 border-t border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <h3
                            className="text-xs font-medium text-gray-700 truncate"
                            title={viewingReceipt}
                          >
                            {viewingReceipt}
                          </h3>
                          <button
                            onClick={() => setViewingReceipt(null)}
                            className="text-gray-500 hover:text-gray-700 shrink-0"
                            title="Close preview"
                          >
                            <svg
                              className="w-3 h-3"
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
                        </div>
                        <div className="bg-gray-100 border border-gray-300 rounded p-2 text-center">
                          <svg
                            className="w-8 h-8 text-gray-400 mx-auto mb-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-xs text-gray-600">
                            {viewingReceipt.endsWith('.pdf') ? 'PDF Preview' : 'Image Preview'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 h-full flex flex-col items-center justify-center">
                    <svg
                      className="w-10 h-10 text-gray-300 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <p className="mt-2 text-xs text-gray-500">Click on an expense to see details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewLiquidation
