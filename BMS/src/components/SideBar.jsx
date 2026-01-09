import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FiChevronsRight, FiChevronRight } from 'react-icons/fi'
import { sidebarOptions } from '../data/sidebarConfig'
import { motion, AnimatePresence } from 'framer-motion'

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
      style={{ position: 'fixed', left: 0, zIndex: 40 }}
    >
      {/* Title */}
      <div className="mb-3 border-b border-slate-300 pb-3">
        <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-rose-100">
          <div className="flex items-center gap-2">
            <div className="grid size-10 shrink-0 place-content-center rounded-md bg-rose-900">
              <svg
                width="24"
                viewBox="0 0 50 39"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-slate-50"
              >
                <path
                  d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
                  stopColor="#000000"
                ></path>
                <path
                  d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
                  stopColor="#000000"
                ></path>
              </svg>
            </div>

            {open && (
              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
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
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-rose">
        {sidebarOptions.map((option) => {
          const isExpanded = expandedItems.includes(option.title)

          if (option.type === 'single') {
            return (
              <NavLink
                key={option.title}
                to={option.path} // <-- use path from your sidebarOptions
                className={({ isActive }) =>
                  `relative flex h-10 w-full items-center rounded-md transition-colors ${
                    isActive ? 'bg-rose-100 text-rose-800' : 'hover:bg-rose-100'
                  }`
                }
              >
                <div className="grid h-full w-10 place-content-center text-lg shrink-0">
                  <option.Icon />
                </div>
                {open && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {option.title}
                  </motion.span>
                )}
              </NavLink>
            )
          }

          return (
            <div key={option.title} className="space-y-1">
              <button
                onClick={() => toggleExpand(option.title)}
                className={`relative flex h-10 w-full items-center rounded-md transition-colors cursor-pointer hover:bg-rose-100 ${
                  selected === option.title ? 'bg-rose-100 text-rose-800' : ''
                }`}
              >
                <div className="relative flex items-center w-full">
                  <div className="grid h-full w-10 place-content-center text-lg shrink-0">
                    <option.Icon />
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
                        {option.title}
                      </motion.span>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid h-full w-6 place-content-center text-xs shrink-0"
                      >
                        <FiChevronRight
                          className={`transition-transform duration-200 ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </motion.div>
                    </>
                  )}
                </div>
              </button>

              <AnimatePresence>
                {open && isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-2 space-y-1 pl-2">
                      {option.items.map((item) => {
                        const isSelected = selected === item.label
                        return (
                          <button
                            key={item.label}
                            onClick={() => setSelected(item.label)}
                            className={`relative flex h-8 w-full items-center rounded-md transition-colors cursor-pointer text-xs ${
                              isSelected
                                ? 'bg-rose-50 text-rose-700 font-medium'
                                : 'hover:bg-rose-50 text-slate-600'
                            }`}
                          >
                            <span className="pl-8 flex-1 text-left whitespace-nowrap">
                              {item.label}
                            </span>
                            {item.notifs && (
                              <span className="mr-2 size-4 rounded-full bg-rose-800 text-[10px] text-white flex items-center justify-center shrink-0">
                                {item.notifs}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Toggle */}
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

            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                {open && (
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
                )}
              </AnimatePresence>
            </div>
          </div>
        </button>
      </div>
    </motion.nav>
  )
}

export default Sidebar
