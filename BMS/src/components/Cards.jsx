import { FiCreditCard, FiMail, FiUser, FiUsers, FiCheckSquare } from 'react-icons/fi'
import { PiSealWarningBold } from 'react-icons/pi'

const HoverDevCards = () => {
  return (
    <div className="p-4">
      {/* <p className="text-xl font-semibold mb-2">Settings</p> */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card
          title="Pending Requests"
          subtitle="Manage Requests"
          href="#"
          Icon={PiSealWarningBold}
        />
        <Card title="Released Vouchers" subtitle="Manage Vouchers" href="#" Icon={FiCheckSquare} />
        <Card
          title="Verified Liquidations"
          subtitle="Manage Liquidations"
          href="#"
          Icon={FiUsers}
        />
        <Card title="Outstanding Balance" subtitle="Manage Balance" href="#" Icon={FiCreditCard} />
      </div>
    </div>
  )
}

const Card = ({ title, subtitle, Icon, href }) => {
  return (
    <a
      href={href}
      className="w-full p-4 rounded border border-slate-300 relative overflow-hidden group bg-white"
    >
      <div className="absolute inset-0 bg-linear-to-r from-rose-600 to-amber-600 translate-y-full group-hover:translate-y-[0%] transition-transform duration-300" />

      <Icon className="absolute z-10 -top-12 -right-12 text-9xl text-rose-100 group-hover:text-rose-800 group-hover:rotate-12 transition-transform duration-300" />
      <Icon className="mb-2 text-2xl text-rose-800 group-hover:text-white transition-colors relative z-10 duration-300" />
      <h3 className="font-medium text-lg text-slate-950 group-hover:text-white relative z-10 duration-300">
        {title}
      </h3>
      <p className="text-slate-400 group-hover:text-white relative z-10 duration-300">{subtitle}</p>
    </a>
  )
}

export default HoverDevCards
