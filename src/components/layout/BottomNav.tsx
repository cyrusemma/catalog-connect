import { Link, useLocation } from 'react-router-dom'
import { House, Storefront, ShoppingCart, MagnifyingGlass } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useCartStore } from '../../store/cartStore'

const items = [
  { to: '/', label: 'Home', Icon: House },
  { to: '/shop', label: 'Shop', Icon: Storefront },
  { to: '/shop?focus=search', label: 'Search', Icon: MagnifyingGlass },
  { to: '/cart', label: 'Cart', Icon: ShoppingCart, badge: true },
]

export default function BottomNav() {
  const location = useLocation()
  const totalItems = useCartStore(s => s.totalItems())

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-cream-50/90 dark:bg-dark-900/90 backdrop-blur-xl border-t border-brand-400/15 pb-safe">
      <div className="grid grid-cols-4 max-w-md mx-auto px-2">
        {items.map(({ to, label, Icon, badge }) => {
          const path = to.split('?')[0]
          const active = location.pathname === path
          return (
            <Link
              key={label}
              to={to}
              className="flex flex-col items-center justify-center gap-1 py-3 min-h-[44px] relative"
            >
              <div className="relative">
                <Icon
                  size={22}
                  weight={active ? 'fill' : 'duotone'}
                  className={active ? 'text-brand-400' : 'text-dark-800/60 dark:text-white/60'}
                />
                {badge && totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 600, damping: 18 }}
                    className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 bg-brand-400 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${active ? 'text-brand-400' : 'text-dark-800/60 dark:text-white/60'}`}>
                {label}
              </span>
              {active && (
                <motion.span
                  layoutId="bottom-nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-brand-400"
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
