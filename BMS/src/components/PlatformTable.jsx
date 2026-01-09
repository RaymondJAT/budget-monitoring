import { FiChevronUp, FiChevronDown } from 'react-icons/fi'
import ActionButtons from './buttons/ActionButtons'

// budget table columns
export const budgetColumns = [
  {
    key: 'department',
    label: 'Department',
    sortable: true,
    width: '25%',
    align: 'left',
  },
  {
    key: 'allocated',
    label: 'Allocated',
    sortable: true,
    render: (v) => `₱${v.toLocaleString()}`,
    width: '20%',
    align: 'center',
  },
  {
    key: 'spent',
    label: 'Spent',
    sortable: true,
    render: (v) => `₱${v.toLocaleString()}`,
    width: '20%',
    align: 'center',
  },
  {
    key: 'remaining',
    label: 'Remaining',
    sortable: true,
    render: (v) => (
      <span className={`font-semibold ${v < 0 ? 'text-red-600' : 'text-green-600'}`}>
        ₱{v.toLocaleString()}
      </span>
    ),
    width: '20%',
    align: 'center',
  },
  {
    key: 'utilization',
    label: 'Utilization',
    render: (v) => (
      <div className="w-full flex flex-col items-center">
        <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            className={`h-full ${
              v > 90 ? 'bg-red-500' : v > 70 ? 'bg-yellow-400' : 'bg-green-500'
            }`}
            style={{ width: `${v}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 mt-1">{v}%</span>
      </div>
    ),
    width: '15%',
    align: 'center',
  },
]

// mock data generator
export const createBudgetData = (count = 6) => {
  return Array.from({ length: count }).map((_, i) => {
    const allocated = 500_000 + i * 150_000
    const spent = Math.floor(allocated * (0.4 + Math.random() * 0.7))

    return {
      id: i + 1,
      department: `Department ${i + 1}`,
      allocated,
      spent,
      remaining: allocated - spent,
      utilization: Math.min(100, Math.round((spent / allocated) * 100)),
    }
  })
}

// table component
const PlatformTable = ({
  columns,
  data,
  sortKey,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onDelete,
  maxHeight = '400px',
  actionButtonProps = {},
  title = null,
  titleAlignment = 'left',
}) => {
  return (
    <div className="rounded-sm border border-gray-200 bg-white overflow-hidden">
      {/* Title Section */}
      {title && (
        <div
          className={`px-3 py-3  bg-white
          ${
            titleAlignment === 'center'
              ? 'text-center'
              : titleAlignment === 'right'
              ? 'text-right'
              : 'text-left'
          }
        `}
        >
          <h3 className="text-[13px] font-semibold text-gray-800">{title}</h3>
        </div>
      )}

      {/* Table Section */}
      <div className="overflow-auto" style={{ maxHeight }}>
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-300 sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && onSort(col.key)}
                  className={`px-4 py-3 font-semibold uppercase
                    ${col.sortable ? 'cursor-pointer hover:text-gray-900' : ''}
                    ${col.align === 'center' ? 'text-center' : 'text-left'}
                  `}
                  style={{ width: col.width }}
                >
                  <div
                    className={`flex items-center gap-1
                      ${col.align === 'center' ? 'justify-center' : 'justify-start'}
                    `}
                  >
                    {col.label}
                    {sortKey === col.key &&
                      (sortDirection === 'asc' ? <FiChevronUp /> : <FiChevronDown />)}
                  </div>
                </th>
              ))}
              <th
                className="px-4 py-3 text-center font-semibold uppercase"
                style={{ width: '15%' }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3
                      ${col.align === 'center' ? 'text-center' : 'text-left'}
                    `}
                    style={{ width: col.width }}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                <td className="px-4 py-3 text-center" style={{ width: '15%' }}>
                  <ActionButtons
                    row={row}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    {...actionButtonProps}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="p-4 text-center text-gray-500">No data available</div>
        )}
      </div>
    </div>
  )
}

export default PlatformTable
