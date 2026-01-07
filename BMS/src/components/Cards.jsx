import { cardData } from '../data/cardData'

const Cards = () => {
  return (
    <div className="-mt-2 w-full">
      {/* Added w-full */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 w-full">
        {/* Added w-full to grid */}
        {cardData.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            count={card.count}
            total={card.total}
            href={card.href}
            Icon={card.Icon}
            color={card.color}
            isCurrency={card.isCurrency}
          />
        ))}
      </div>
    </div>
  )
}

const Card = ({ title, count, total, Icon, href, color, isCurrency }) => {
  // Color mapping for dynamic styling
  const colorClasses = {
    rose: {
      bg: 'from-rose-600 to-amber-600',
      icon: 'text-rose-800 group-hover:text-white',
      bgIcon: 'text-rose-100 group-hover:text-rose-800',
    },
    emerald: {
      bg: 'from-emerald-600 to-green-600',
      icon: 'text-emerald-800 group-hover:text-white',
      bgIcon: 'text-emerald-100 group-hover:text-emerald-800',
    },
    blue: {
      bg: 'from-blue-600 to-cyan-600',
      icon: 'text-blue-800 group-hover:text-white',
      bgIcon: 'text-blue-100 group-hover:text-blue-800',
    },
    indigo: {
      bg: 'from-indigo-600 to-purple-600',
      icon: 'text-indigo-800 group-hover:text-white',
      bgIcon: 'text-indigo-100 group-hover:text-indigo-800',
    },
  }

  const colors = colorClasses[color] || colorClasses.rose

  // Format the count and total with peso sign if it's currency
  const formatValue = (value) => {
    if (isCurrency) {
      return `₱${value}`
    }
    return value
  }

  return (
    <a
      href={href}
      className="w-full p-4 rounded border border-slate-400 relative overflow-hidden group bg-white hover:shadow-md transition-shadow duration-300"
    >
      <div
        className={`absolute inset-0 bg-linear-to-r ${colors.bg} translate-y-full group-hover:translate-y-[0%] transition-transform duration-300`}
      />

      <Icon
        className={`absolute z-10 -top-12 -right-12 text-9xl ${colors.bgIcon} group-hover:rotate-12 transition-transform duration-300`}
      />

      <div className="relative z-10">
        {/* Top row: Icon and Title side by side */}
        <div className="flex items-start gap-3 mb-3">
          <Icon
            className={`text-2xl ${colors.icon} transition-colors duration-300 shrink-0 mt-1`}
          />
          <h3 className="font-medium text-lg text-slate-950 group-hover:text-white transition-colors duration-300 line-clamp-2">
            {title}
          </h3>
        </div>

        {/* Bottom row: Count and Total */}
        <div className="pl-9">
          {' '}
          {/* Offset to align with title text */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-950 group-hover:text-white transition-colors duration-300">
              {formatValue(count)}
            </span>
            {/* <span className="text-sm text-slate-500 group-hover:text-slate-200 transition-colors duration-300">
              of {formatValue(total)}
            </span> */}
          </div>
          <p className="text-sm text-slate-400 group-hover:text-slate-200 mt-1 transition-colors duration-300">
            {isCurrency ? 'Total amount' : 'Items processed'}
          </p>
        </div>
      </div>
    </a>
  )
}

export default Cards
