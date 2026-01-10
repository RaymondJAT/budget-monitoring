import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi'

const ActionButtons = ({
  onView,
  onEdit,
  onDelete,
  row,
  viewLabel = 'View',
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  size = 'md',
  showLabels = false,
  showView = true,
  showEdit = true,
  showDelete = true,
}) => {
  const sizeClasses = {
    sm: 'p-1 text-sm',
    md: 'p-2',
    lg: 'p-3 text-lg',
  }

  return (
    <div className="flex justify-center gap-2">
      {showView && (
        <button
          onClick={() => onView(row)}
          className={`${sizeClasses[size]} rounded hover:bg-blue-50 text-blue-600 flex items-center gap-1 cursor-pointer`}
          title={viewLabel}
          aria-label={`${viewLabel} ${row.department || row.name || 'item'}`}
        >
          <FiEye />
          {showLabels && <span className="hidden sm:inline">{viewLabel}</span>}
        </button>
      )}

      {showEdit && (
        <button
          onClick={() => onEdit(row)}
          className={`${sizeClasses[size]} rounded hover:bg-yellow-50 text-yellow-600 flex items-center gap-1 cursor-pointer`}
          title={editLabel}
          aria-label={`${editLabel} ${row.department || row.name || 'item'}`}
        >
          <FiEdit />
          {showLabels && <span className="hidden sm:inline">{editLabel}</span>}
        </button>
      )}

      {showDelete && (
        <button
          onClick={() => onDelete(row)}
          className={`${sizeClasses[size]} rounded hover:bg-red-50 text-red-600 flex items-center gap-1 cursor-pointer`}
          title={deleteLabel}
          aria-label={`${deleteLabel} ${row.department || row.name || 'item'}`}
        >
          <FiTrash2 />
          {showLabels && <span className="hidden sm:inline">{deleteLabel}</span>}
        </button>
      )}
    </div>
  )
}

export default ActionButtons
