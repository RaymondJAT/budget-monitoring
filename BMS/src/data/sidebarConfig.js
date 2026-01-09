import { FiUsers, FiSettings, FiFileText } from 'react-icons/fi'
import { LuLayoutDashboard, LuPhilippinePeso } from 'react-icons/lu'
import { BiPieChartAlt2 } from 'react-icons/bi'
import { TbMoneybag } from 'react-icons/tb'

export const sidebarOptions = [
  { type: 'single', title: 'Dashboard', Icon: LuLayoutDashboard, path: '/dashboard' },
  {
    type: 'dropdown',
    title: 'User Management',
    Icon: FiUsers,
    items: [
      { label: 'Users', href: '/users' },
      { label: 'Access', href: '/users/access' },
    ],
  },
  {
    type: 'dropdown',
    title: 'Operations',
    Icon: FiSettings,
    items: [
      { label: 'Stores', href: '/operations/stores' },
      { label: 'Store Routes', href: '/operations/store-routes' },
      { label: 'Flag Analysis', href: '/operations/flag-analysis', notifs: 5 },
      { label: 'Transport', href: '/operations/transport' },
      { label: 'Particulars', href: '/operations/particulars' },
    ],
  },
  {
    type: 'dropdown',
    title: 'Fund Management',
    Icon: LuPhilippinePeso,
    items: [
      { label: 'Budget Allocation', href: '/funds/budget' },
      { label: 'Revolving Fund', href: '/funds/revolving-fund', notifs: 3 },
      { label: 'Cash Disbursement', href: '/funds/cash-disbursement', notifs: 5 },
    ],
  },
  {
    type: 'dropdown',
    title: 'Cash Requests',
    Icon: TbMoneybag,
    items: [
      { label: 'New Request', href: '/cash/new', notifs: 5 },
      { label: 'Pending', href: '/cash/pending', notifs: 8 },
      { label: 'Approved', href: '/cash/approved' },
      { label: 'Rejected', href: '/cash/rejected' },
      { label: 'History', href: '/cash/history' },
    ],
  },
  {
    type: 'dropdown',
    title: 'Liquidations',
    Icon: FiFileText,
    items: [
      { label: 'For Review', href: '/liquidations/review', notifs: 2 },
      { label: 'Approved', href: '/liquidations/approved' },
      { label: 'Reimbursements', href: '/liquidations/reimbursements' },
      { label: 'Archive', href: '/liquidations/archive' },
    ],
  },
  { type: 'single', title: 'Reporting', Icon: BiPieChartAlt2, path: '/reporting' },
]
