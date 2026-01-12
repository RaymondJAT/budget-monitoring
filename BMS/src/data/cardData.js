import { FiCreditCard, FiCheckSquare, FiClock, FiActivity } from 'react-icons/fi'
import { IoReceiptOutline } from 'react-icons/io5'

// Custodian card
export const cardDataCustodian = [
  {
    title: 'Pending Requests',
    count: '12',
    total: '50',
    Icon: FiClock,
    href: '#',
    color: 'rose',
    isCurrency: false,
  },
  {
    title: 'Released Vouchers',
    count: '25',
    total: '60',
    Icon: FiCheckSquare,
    href: '#',
    color: 'rose',
    isCurrency: false,
  },
  {
    title: 'Verified Liquidations',
    count: '8',
    total: '15',
    Icon: IoReceiptOutline,
    href: '#',
    color: 'rose',
    isCurrency: false,
  },
  {
    title: 'Outstanding Balance',
    count: '4,250',
    total: '10,000',
    Icon: FiCreditCard,
    href: '#',
    color: 'rose',
    isCurrency: true,
  },
]

// Requester card
export const cardDataRequester = [
  {
    title: 'Pending Requests',
    count: '12',
    total: '50',
    Icon: FiClock,
    href: '#',
    color: 'rose',
    isCurrency: false,
  },
  {
    title: 'Approved Requests',
    count: '25',
    total: '60',
    Icon: FiCheckSquare,
    href: '#',
    color: 'rose',
    isCurrency: false,
  },
  {
    title: 'Pending Liquidations',
    count: '8',
    total: '15',
    Icon: FiActivity,
    href: '#',
    color: 'rose',
    isCurrency: false,
  },
  {
    title: 'Remaining Balance',
    count: '4,250',
    total: '10,000',
    Icon: FiCreditCard,
    href: '#',
    color: 'rose',
    isCurrency: true,
  },
]

// Team Leader card
export const cardDataApprover = [
  {
    title: 'Pending Approvals',
    count: '12',
    total: '50',
    Icon: FiClock,
    href: '#',
    color: 'rose',
    isCurrency: false,
  },
  {
    title: 'Pending Liquidations',
    count: '25',
    total: '60',
    Icon: IoReceiptOutline,
    href: '#',
    color: 'rose',
    isCurrency: false,
  },
]
