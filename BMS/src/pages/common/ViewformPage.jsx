import { useParams, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'

const ViewFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentUserRole] = useState('requester')

  // Mock data
  const requestData = useMemo(() => {
    const generateAmountInWords = (amount) => {
      const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
      const teens = [
        'Ten',
        'Eleven',
        'Twelve',
        'Thirteen',
        'Fourteen',
        'Fifteen',
        'Sixteen',
        'Seventeen',
        'Eighteen',
        'Nineteen',
      ]
      const tens = [
        '',
        '',
        'Twenty',
        'Thirty',
        'Forty',
        'Fifty',
        'Sixty',
        'Seventy',
        'Eighty',
        'Ninety',
      ]

      if (amount === 0) return 'Zero Pesos Only'

      const million = Math.floor(amount / 1000000)
      const thousand = Math.floor((amount % 1000000) / 1000)
      const hundred = Math.floor((amount % 1000) / 100)
      const remainder = amount % 100

      let words = ''

      if (million > 0) {
        words += `${units[million] || ''} Million `
      }

      if (thousand > 0) {
        words += `${units[thousand] || ''} Thousand `
      }

      if (hundred > 0) {
        words += `${units[hundred]} Hundred `
      }

      if (remainder > 0) {
        if (remainder < 10) {
          words += `${units[remainder]} `
        } else if (remainder < 20) {
          words += `${teens[remainder - 10]} `
        } else {
          words += `${tens[Math.floor(remainder / 10)]} ${units[remainder % 10]} `
        }
      }

      return words.trim() + ' Pesos Only'
    }

    const amount = Math.floor(Math.random() * 50000) + 1000
    const requestDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)

    return {
      id: parseInt(id) || 1,
      referenceId: `REQ-${(100000 + (parseInt(id) || 1)).toString().padStart(6, '0')}`,
      employee: 'Juan Dela Cruz',
      department: 'Information Technology',
      position: 'Senior Software Developer',
      particulars: 'Office Supplies Purchase for Q3 2024',
      amount: amount,
      amountInWords: generateAmountInWords(amount),
      requestDate: requestDate.toISOString().split('T')[0],
      teamLead: 'Maria Santos',
      notes: 'Urgent requirement for upcoming project',
    }
  }, [id])

  const handleBack = () => {
    navigate(-1)
  }

  const handleApprove = () => {
    console.log('Approving request:', requestData.id)
    alert('Request approved successfully!')
  }

  const handleReject = () => {
    console.log('Rejecting request:', requestData.id)
    alert('Request rejected!')
  }

  const handleVerify = () => {
    console.log('Verifying request:', requestData.id)
    alert('Request verified!')
  }

  const handleComplete = () => {
    console.log('Completing request:', requestData.id)
    alert('Request completed!')
  }

  const handlePrint = () => {
    console.log('Printing request:', requestData.id)
    window.print()
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

  const renderActionButtons = () => {
    return (
      <div className="flex flex-wrap gap-2">
        {/* Print Button - Common for all roles */}
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium flex items-center gap-2"
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

        {/* Role-based actions */}
        {currentUserRole === 'teamLeader' && (
          <>
            <button
              onClick={handleApprove}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center gap-2"
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
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium flex items-center gap-2"
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
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium flex items-center gap-2"
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

        {currentUserRole === 'finance' && (
          <button
            onClick={handleComplete}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Complete
          </button>
        )}

        {/* Common actions for all roles */}
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium flex items-center gap-2 border border-slate-400">
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

        {currentUserRole === 'requester' && (
          <button className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>
        )}
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
                  className="flex items-center text-blue-600 hover:text-blue-800"
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
                  <h1 className="text-2xl font-bold text-gray-800">Request Details</h1>
                  <p className="text-gray-600">Reference: {requestData.referenceId}</p>
                </div>
              </div>
              <div>{renderActionButtons()}</div>
            </div>
          </div>
        </div>

        {/* Requester Details */}
        <div className="bg-component shadow-lg rounded-lg border border-slate-400 mb-3">
          <div className="px-6 py-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Requester Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Employee</label>
                <p className="mt-1 text-gray-900 font-medium">{requestData.employee}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Department</label>
                <p className="mt-1 text-gray-900 font-medium">{requestData.department}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Position</label>
                <p className="mt-1 text-gray-900 font-medium">{requestData.position}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Team Lead</label>
                <p className="mt-1 text-gray-900 font-medium">{requestData.teamLead}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Request Details */}
          <div className="lg:col-span-2">
            <div className="bg-component shadow-lg rounded-lg border border-slate-400 p-6 h-full">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-slate-200">
                Request Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Reference ID</label>
                    <p className="mt-1 text-gray-900 font-medium font-mono">
                      {requestData.referenceId}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Request Date</label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {formatDate(requestData.requestDate)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Particulars</label>
                    <p className="mt-1 text-gray-900 font-medium">{requestData.particulars}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Amount</label>
                    <p className="mt-1 text-2xl font-bold text-green-700">
                      ₱{requestData.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Amount in Words
                    </label>
                    <p className="mt-1 text-gray-900 italic">{requestData.amountInWords}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Notes</label>
                    <p className="mt-1 text-gray-900">{requestData.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amount Summary */}
          <div>
            <div className="bg-component shadow-lg rounded-lg border border-slate-400 p-6 h-full">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-slate-200">
                Amount Summary
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="px-4 py-3 text-right">
                        <span className="text-lg font-semibold text-gray-800">
                          ₱{requestData.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-2xl font-bold text-green-700">
                          ₱{requestData.amount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2" className="px-4 py-3 pt-6 border-t border-slate-300">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                          <span className="text-2xl font-bold text-green-700">
                            ₱{requestData.amount.toLocaleString()}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewFormPage
