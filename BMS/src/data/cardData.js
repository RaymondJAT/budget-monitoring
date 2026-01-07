import { FiCreditCard, FiUsers, FiCheckSquare } from 'react-icons/fi'
import { PiSealWarningBold } from 'react-icons/pi'

export const cardData = [
  {
    title: 'Pending Requests',
    count: '12',
    total: '50',
    Icon: PiSealWarningBold,
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
    Icon: FiUsers,
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
