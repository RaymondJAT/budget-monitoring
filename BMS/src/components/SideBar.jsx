import { useState } from 'react'
import {
  FiChevronsRight,
  FiTag,
  FiUsers,
  FiSettings,
  FiFileText,
  FiChevronDown,
  FiChevronRight,
  FiHome,
  FiMonitor,
  FiShoppingCart,
  FiBarChart,
} from 'react-icons/fi'
import { LuPhilippinePeso, LuLayoutDashboard } from 'react-icons/lu'
import { BiPieChartAlt2 } from 'react-icons/bi'
import { TbMoneybag } from 'react-icons/tb'
import { motion, AnimatePresence } from 'framer-motion'
import Card from './Cards'

export const Example = () => {
  return (
    <div className="flex bg-slate-100">
      <Sidebar />
      <ExampleContent />
    </div>
  )
}

const Sidebar = () => {
  const [open, setOpen] = useState(true)
  const [selected, setSelected] = useState('Dashboard')
  const [expandedItems, setExpandedItems] = useState([])

  const toggleExpand = (title) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    )
  }

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 border-r border-slate-300 bg-white p-2"
      style={{
        width: open ? '225px' : 'fit-content',
      }}
    >
      <TitleSection open={open} />

      <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-120px)]">
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
    <motion.button
      layout
      onClick={() => setSelected(title)}
      className={`relative flex h-10 w-full items-center rounded-md transition-colors cursor-pointer ${
        selected === title ? 'bg-rose-100 text-rose-800' : 'hover:bg-rose-100'
      }`}
    >
      <motion.div layout className="grid h-full w-10 place-content-center text-lg">
        <Icon />
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="text-xs font-medium"
        >
          {title}
        </motion.span>
      )}

      {notifs && open && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          style={{ y: '-50%' }}
          transition={{ delay: 0.5 }}
          className="absolute right-2 top-1/2 size-4 rounded bg-rose-800 text-xs text-white flex items-center justify-center"
        >
          {notifs}
        </motion.span>
      )}
    </motion.button>
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
      <motion.button
        layout
        onClick={toggleExpand}
        className={`relative flex h-10 w-full items-center rounded-md transition-colors cursor-pointer hover:bg-rose-100 ${
          selected === title ? 'bg-rose-100 text-rose-800' : ''
        }`}
      >
        <motion.div layout className="grid h-full w-10 place-content-center text-lg">
          <Icon />
        </motion.div>

        {open && (
          <>
            <motion.span
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
              className="text-xs font-medium flex-1 text-left"
            >
              {title}
            </motion.span>

            <motion.div layout className="grid h-full w-6 place-content-center text-xs">
              <FiChevronRight
                className={`transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
              />
            </motion.div>
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {open && expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-10 space-y-1 border-l border-rose-200 pl-2">
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
    <motion.button
      layout
      onClick={() => setSelected(label)}
      className={`relative flex h-8 w-full items-center rounded-md transition-colors cursor-pointer text-xs ${
        isSelected ? 'bg-rose-50 text-rose-700 font-medium' : 'hover:bg-rose-50 text-slate-600'
      }`}
    >
      <motion.span layout className="pl-2 flex-1 text-left">
        {label}
      </motion.span>

      {notifs && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mr-2 size-4 rounded-full bg-rose-800 text-[10px] text-white flex items-center justify-center"
        >
          {notifs}
        </motion.span>
      )}
    </motion.button>
  )
}

const TitleSection = ({ open }) => {
  return (
    <div className="mb-3 border-b border-slate-300 pb-3">
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-rose-100">
        <div className="flex items-center gap-2">
          <Logo />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              <span className="block text-xs font-semibold">Budget Monitoring</span>
              <span className="block text-xs text-slate-500">BMS</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

const Logo = () => {
  return (
    <motion.div
      layout
      className="grid size-10 shrink-0 place-content-center rounded-md bg-rose-900"
    >
      <svg
        width="24"
        height="auto"
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
    </motion.div>
  )
}

const ToggleClose = ({ open, setOpen }) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors hover:bg-rose-50 cursor-pointer"
    >
      <div className="flex items-center p-2">
        <motion.div layout className="grid size-10 place-content-center text-lg">
          <FiChevronsRight className={`transition-transform ${open && 'rotate-180'}`} />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium"
          >
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  )
}

const ExampleContent = () => (
  <div className="h-screen w-full overflow-auto">
    <div className="min-h-full p-3">
      <Card />
    </div>
  </div>
)
