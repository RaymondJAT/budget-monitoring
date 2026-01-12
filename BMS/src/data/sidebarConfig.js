import { FiUsers, FiSettings, FiFileText } from 'react-icons/fi'
import { LuLayoutDashboard, LuPhilippinePeso } from 'react-icons/lu'
import { BiPieChartAlt2 } from 'react-icons/bi'
import { TbMoneybag } from 'react-icons/tb'

export const sidebarOptions = [
  { type: 'single', title: 'Dashboard', Icon: LuLayoutDashboard, path: '/' },
  {
    type: 'dropdown',
    title: 'User Management',
    Icon: FiUsers,
    items: [
      { label: 'Users', path: '/users' },
      { label: 'Access', path: '/access' },
    ],
  },
  {
    type: 'dropdown',
    title: 'Configuration',
    Icon: FiSettings,
    items: [
      { label: 'Stores', path: 'stores' },
      { label: 'Store Routes', path: '/store-routes' },
      { label: 'Flag Analysis', path: '/flag-analysis', notifs: 5 },
      { label: 'Transport', path: '/transport' },
      { label: 'Particulars', path: '/particulars' },
    ],
  },
  {
    type: 'dropdown',
    title: 'Fund Management',
    Icon: LuPhilippinePeso,
    items: [
      { label: 'Budget Allocation', path: '/budget-allocation' },
      { label: 'Revolving Fund', path: '/revolving-fund', notifs: 3 },
      { label: 'Cash Disbursement', path: '/cash-disbursement', notifs: 5 },
    ],
  },
  {
    type: 'dropdown',
    title: 'Cash Requests',
    Icon: TbMoneybag,
    items: [
      { label: 'My Requests', path: '/my-request', notifs: 5 },
      { label: 'For Liquidation', path: '/for-liquidation', notifs: 8 },
      { label: 'Pending Approvals', path: '/pending-approvals' },
      { label: 'Approved Requests', path: '/approved-request' },
      { label: 'Rejected Requests', path: '/rejected-request' },
      { label: 'For Processing', path: '/for-processing' },
    ],
  },
  {
    type: 'dropdown',
    title: 'Liquidations',
    Icon: FiFileText,
    items: [
      { label: 'For Review', path: '/liquidations/review', notifs: 2 },
      { label: 'Approved', path: '/liquidations/approved' },
      { label: 'Reimbursements', path: '/liquidations/reimbursements' },
      { label: 'Archive', path: '/liquidations/archive' },
    ],
  },
  { type: 'single', title: 'Reporting', Icon: BiPieChartAlt2, path: '/reporting' },
]
