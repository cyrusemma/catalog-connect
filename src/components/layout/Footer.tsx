import { Link } from 'react-router-dom'
import { Storefront } from '@phosphor-icons/react'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-dark-800 border-t border-cream-200 dark:border-brand-400/10 mt-auto hidden lg:block">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-500 rounded-xl flex items-center justify-center">
              <Storefront size={16} weight="duotone" className="text-white" />
            </div>
            <span className="font-display font-bold text-dark-800 dark:text-white">Catalog</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-dark-800/60 dark:text-white/50">
            <Link to="/" className="hover:text-brand-400 transition-colors">Home</Link>
            <Link to="/shop" className="hover:text-brand-400 transition-colors">Shop</Link>
            <Link to="/cart" className="hover:text-brand-400 transition-colors">Cart</Link>
          </div>
          <p className="text-dark-800/40 dark:text-white/30 text-xs">© {new Date().getFullYear()} Catalog by Cyrus</p>
        </div>
      </div>
    </footer>
  )
}
