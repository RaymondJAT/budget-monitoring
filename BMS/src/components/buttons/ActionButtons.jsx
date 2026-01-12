import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi'
import { LuFolderCheck } from 'react-icons/lu'

const ActionButtons = ({
  onView,
  onEdit,
  onDelete,
  onSubmit, // New prop for submit action
  row,
  viewLabel = 'View',
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  submitLabel = 'Submit', // New prop for submit label
  size = 'md',
  showLabels = false,
  showView = true,
  showEdit = true,
  showDelete = true,
  showSubmit = true, // New prop to control submit button visibility
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

      {showSubmit && ( // New Submit button with check-in-folder icon
        <button
          onClick={() => onSubmit(row)}
          className={`${sizeClasses[size]} rounded hover:bg-green-50 text-green-600 flex items-center gap-1 cursor-pointer`}
          title={submitLabel}
          aria-label={`${submitLabel} ${row.department || row.name || 'item'}`}
        >
          <LuFolderCheck />
          {showLabels && <span className="hidden sm:inline">{submitLabel}</span>}
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
