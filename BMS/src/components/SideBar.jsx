import { useState } from 'react'
import { FiChevronsRight, FiChevronRight } from 'react-icons/fi'
import { LuLayoutDashboard, LuPhilippinePeso } from 'react-icons/lu'
import { BiPieChartAlt2 } from 'react-icons/bi'
import { TbMoneybag } from 'react-icons/tb'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUsers, FiSettings, FiFileText } from 'react-icons/fi'

const Sidebar = ({ open, setOpen }) => {
  const [selected, setSelected] = useState('Dashboard')
  const [expandedItems, setExpandedItems] = useState([])

  const toggleExpand = (title) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    )
  }

  return (
    <motion.nav
      className="sticky top-0 h-screen shrink-0 border-r border-slate-400 bg-white p-2 flex flex-col"
      initial={false}
      animate={{ width: open ? 225 : 56 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        left: 0,
        zIndex: 40,
      }}
    >
      <TitleSection open={open} />

      <div className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-rose">
        <Option
          Icon={LuLayoutDashboard}
          title="Dashboard"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />

        <DropdownOption
          Icon={FiUsers}
          title="User Management"
          open={open}
          expanded={expandedItems.includes('User Management')}
          toggleExpand={() => toggleExpand('User Management')}
          items={[
            { label: 'Users', href: '/users' },
            { label: 'Access', href: '/users/access' },
          ]}
          selected={selected}
          setSelected={setSelected}
        />

        <DropdownOption
          Icon={FiSettings}
          title="Operations"
          open={open}
          expanded={expandedItems.includes('Operations')}
          toggleExpand={() => toggleExpand('Operations')}
          items={[
            { label: 'Stores', href: '/operations/stores' },
            { label: 'Store Routes', href: '/operations/store-routes' },
            { label: 'Flag Analysis', href: '/operations/flag-analysis', notifs: 5 },
            { label: 'Transport', href: '/operations/transport' },
            { label: 'Particulars', href: '/operations/particulars' },
          ]}
          selected={selected}
          setSelected={setSelected}
        />

        <DropdownOption
          Icon={LuPhilippinePeso}
          title="Fund Management"
          open={open}
          expanded={expandedItems.includes('Fund Management')}
          toggleExpand={() => toggleExpand('Fund Management')}
          items={[
            { label: 'Budget Allocation', href: '/funds/budget' },
            { label: 'Revolving Fund', href: '/funds/revolving-fund', notifs: 3 },
            { label: 'Cash Disbursement', href: '/funds/cash-disbursement', notifs: 5 },
          ]}
          selected={selected}
          setSelected={setSelected}
        />

        <DropdownOption
          Icon={TbMoneybag}
          title="Cash Requests"
          open={open}
          expanded={expandedItems.includes('Cash Requests')}
          toggleExpand={() => toggleExpand('Cash Requests')}
          items={[
            { label: 'New Request', href: '/cash/new', notifs: 5 },
            { label: 'Pending', href: '/cash/pending', notifs: 8 },
            { label: 'Approved', href: '/cash/approved' },
            { label: 'Rejected', href: '/cash/rejected' },
            { label: 'History', href: '/cash/history' },
          ]}
          selected={selected}
          setSelected={setSelected}
        />

        <DropdownOption
          Icon={FiFileText}
          title="Liquidations"
          open={open}
          expanded={expandedItems.includes('Liquidations')}
          toggleExpand={() => toggleExpand('Liquidations')}
          items={[
            { label: 'For Review', href: '/liquidations/review', notifs: 2 },
            { label: 'Approved', href: '/liquidations/approved' },
            { label: 'Reimbursements', href: '/liquidations/reimbursements' },
            { label: 'Archive', href: '/liquidations/archive' },
          ]}
          selected={selected}
          setSelected={setSelected}
        />

        <Option
          Icon={BiPieChartAlt2}
          title="Reporting"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  )
}

const Option = ({ Icon, title, selected, setSelected, open, notifs }) => {
  return (
    <button
      onClick={() => setSelected(title)}
      className={`relative flex h-10 w-full items-center rounded-md transition-colors cursor-pointer ${
        selected === title ? 'bg-rose-100 text-rose-800' : 'hover:bg-rose-100'
      }`}
    >
      <div className="grid h-full w-10 place-content-center text-lg shrink-0">
        <Icon />
      </div>
      {open && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="text-sm font-medium whitespace-nowrap"
        >
          {title}
        </motion.span>
      )}

      {notifs && open && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="absolute right-2 top-1/2 size-4 rounded bg-rose-800 text-xs text-white flex items-center justify-center -translate-y-1/2"
        >
          {notifs}
        </motion.span>
      )}
    </button>
  )
}

const DropdownOption = ({
  Icon,
  title,
  open,
  expanded,
  toggleExpand,
  items,
  selected,
  setSelected,
}) => {
  return (
    <div className="space-y-1">
      <button
        onClick={toggleExpand}
        className={`relative flex h-10 w-full items-center rounded-md transition-colors cursor-pointer hover:bg-rose-100 ${
          selected === title ? 'bg-rose-100 text-rose-800' : ''
        }`}
      >
        <div className="relative flex items-center w-full">
          <div className="grid h-full w-10 place-content-center text-lg shrink-0">
            <Icon />
          </div>

          {open && (
            <>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium flex-1 text-left whitespace-nowrap"
              >
                {title}
              </motion.span>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid h-full w-6 place-content-center text-xs shrink-0"
              >
                <FiChevronRight
                  className={`transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
                />
              </motion.div>
            </>
          )}
        </div>
      </button>

      <AnimatePresence>
        {open && expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-2 space-y-1 pl-2">
              {items.map((item) => (
                <DropdownItem
                  key={item.label}
                  label={item.label}
                  href={item.href}
                  notifs={item.notifs}
                  selected={selected}
                  setSelected={setSelected}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const DropdownItem = ({ label, href, notifs, selected, setSelected }) => {
  const isSelected = selected === label

  return (
    <button
      onClick={() => setSelected(label)}
      className={`relative flex h-8 w-full items-center rounded-md transition-colors cursor-pointer text-xs ${
        isSelected ? 'bg-rose-50 text-rose-700 font-medium' : 'hover:bg-rose-50 text-slate-600'
      }`}
    >
      <span className="pl-8 flex-1 text-left whitespace-nowrap">{label}</span>

      {notifs && (
        <span className="mr-2 size-4 rounded-full bg-rose-800 text-[10px] text-white flex items-center justify-center shrink-0">
          {notifs}
        </span>
      )}
    </button>
  )
}

const TitleSection = ({ open }) => {
  return (
    <div className="mb-3 border-b border-slate-300 pb-3">
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-rose-100">
        <div className="flex items-center gap-2">
          <Logo />
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div
                  key="title-content"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap pt-2"
                >
                  <span className="block text-md font-semibold">Budget Monitoring</span>
                  <span className="block text-xs text-slate-500">BMS</span>
                </motion.div>
              ) : (
                <motion.div
                  key="empty-space"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="w-0"
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

const Logo = () => {
  return (
    <div className="grid size-10 shrink-0 place-content-center rounded-md bg-rose-900">
      <svg
        width="24"
        // height="auto"
        viewBox="0 0 50 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-slate-50"
      >
        <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" stopColor="#000000"></path>
        <path
          d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
          stopColor="#000000"
        ></path>
      </svg>
    </div>
  )
}

const ToggleClose = ({ open, setOpen }) => {
  return (
    <div className="mt-2 border-t border-slate-300">
      <button
        onClick={() => setOpen((pv) => !pv)}
        className="w-full transition-colors hover:bg-rose-50 cursor-pointer bg-white shrink-0"
      >
        <div
          className={`flex items-center p-2 hover:bg-rose-50 rounded-md transition-colors ${
            open ? 'justify-start' : 'justify-center'
          }`}
        >
          <div className="grid size-10 place-content-center text-lg shrink-0">
            <FiChevronsRight
              className={`transition-transform duration-300 ${open && 'rotate-180'}`}
            />
          </div>

          {/* Hide text with slide animation */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              {open ? (
                <motion.span
                  key="hide-text"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  Hide
                </motion.span>
              ) : (
                <motion.div
                  key="empty-space"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="w-0"
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </button>
    </div>
  )
}

export default Sidebar
