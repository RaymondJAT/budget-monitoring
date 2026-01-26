const Cards = ({ cardData }) => {
  if (!cardData || !Array.isArray(cardData) || cardData.length === 0) {
    return (
      <div className="-mt-3 w-full mb-3">
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
          <div className="w-full p-8 rounded-lg border border-slate-400 bg-component shadow-xl flex items-center justify-center">
            <p className="text-center text-gray-500">No card data provided</p>
          </div>
        </div>
      </div>
    )
  }

  // Determine grid columns based on number of cards
  const getGridCols = () => {
    const count = cardData.length

    if (count === 1) return 'grid-cols-1'
    if (count === 2) return 'grid-cols-1 md:grid-cols-2'
    if (count === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    if (count >= 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'

    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  // Get span classes for individual cards when there are 2 or 3 cards
  const getCardSpan = (index) => {
    const count = cardData.length

    if (count === 2) {
      // Both cards take half width on medium+ screens
      return ''
    }

    if (count === 3) {
      // First card spans 2 columns on medium, 1 column on large
      if (index === 0) {
        return 'md:col-span-2 lg:col-span-1'
      }
      // Other cards take normal space
      return ''
    }

    return ''
  }

  return (
    <div className="-mt-3 w-full mb-3">
      <div className={`grid gap-3 ${getGridCols()} w-full`}>
        {cardData.map((card, index) => (
          <div key={index} className={getCardSpan(index)}>
            <Card
              title={card.title}
              count={card.count}
              total={card.total}
              Icon={card.Icon}
              color={card.color}
              isCurrency={card.isCurrency}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

const Card = ({ title, count, Icon, color, isCurrency }) => {
  const colorClasses = {
    rose: {
      bg: 'from-rose-600 to-amber-600',
      icon: 'text-rose-800 group-hover:text-white',
      bgIcon: 'text-rose-100 group-hover:text-rose-800',
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
    <div className="w-full h-full p-4 rounded-lg border border-slate-400 relative overflow-hidden group bg-component shadow-xl transition-shadow duration-300 flex flex-col">
      <div
        className={`absolute inset-0 bg-linear-to-r ${colors.bg} translate-y-full group-hover:translate-y-[0%] transition-transform duration-300`}
      />

      <Icon
        className={`absolute z-10 -top-12 -right-12 text-9xl ${colors.bgIcon} group-hover:rotate-12 transition-transform duration-300`}
      />

      <div className="relative z-10 grow">
        <div className="flex items-start gap-3 mb-3">
          <Icon
            className={`text-2xl ${colors.icon} transition-colors duration-300 shrink-0 mt-1`}
          />
          <h3 className="font-medium text-lg text-slate-950 group-hover:text-white transition-colors duration-300 line-clamp-2">
            {title}
          </h3>
        </div>

        {/* Count and Total */}
        <div className="pl-9">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-950 group-hover:text-white transition-colors duration-300">
              {formatValue(count)}
            </span>
          </div>
          <p className="text-sm text-slate-400 group-hover:text-slate-200 mt-1 transition-colors duration-300">
            {isCurrency ? 'Total amount' : 'Items processed'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Cards
