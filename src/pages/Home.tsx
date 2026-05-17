import { Link } from 'react-router-dom'
import { ArrowRight, Sparkle, Lightning, ShoppingBagOpen } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import ProductCard from '../components/ui/ProductCard'
import { useProducts, useNewProducts } from '../hooks/useProducts'
import { useStoreSettings } from '../hooks/useStoreSettings'

export default function Home() {
  const { data: featured } = useProducts({ featured: true })
  const { data: newProducts } = useNewProducts(7)
  const settings = useStoreSettings()

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative min-h-[90dvh] flex items-center overflow-hidden">
        {/* Amber glows */}
        <div className="absolute inset-0 bg-amber-glow pointer-events-none" />
        <div className="absolute inset-0 bg-amber-glow-corner pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 glass-amber rounded-full px-4 py-2 mb-8"
          >
            <Sparkle size={14} weight="fill" className="text-brand-400" />
            <span className="text-brand-400 text-sm font-semibold tracking-wide">NEW ARRIVALS AVAILABLE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 max-w-2xl text-dark-800 dark:text-white"
          >
            <span className="text-shimmer">{settings.tagline}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-dark-800/70 dark:text-white/60 text-lg mb-10 max-w-xl leading-relaxed"
          >
            Shop the finest selection, curated just for you. Fast delivery, great prices, premium quality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2 text-base">
              Shop Now <ArrowRight size={18} weight="bold" />
            </Link>
            <Link to="/shop" className="btn-ghost inline-flex items-center gap-2 text-base">
              Browse Categories
            </Link>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals */}
      {newProducts && newProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkle size={14} weight="fill" className="text-brand-400" />
                <span className="text-brand-400 text-xs font-bold uppercase tracking-[0.2em]">Just Dropped</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark-800 dark:text-white underline-gradient inline-block">
                New Arrivals
              </h2>
              <p className="text-dark-800/50 dark:text-white/40 text-sm mt-4">Fresh products added this week</p>
            </div>
            <Link to="/shop" className="text-brand-400 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {newProducts.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      {/* Featured */}
      {featured && featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lightning size={14} weight="fill" className="text-brand-400" />
                <span className="text-brand-400 text-xs font-bold uppercase tracking-[0.2em]">Featured</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark-800 dark:text-white underline-gradient inline-block">
                Featured Products
              </h2>
              <p className="text-dark-800/50 dark:text-white/40 text-sm mt-4">Hand-picked just for you</p>
            </div>
            <Link to="/shop" className="text-brand-400 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {featured.slice(0, 8).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      {/* Empty state */}
      {(!featured || featured.length === 0) && (!newProducts || newProducts.length === 0) && (
        <section className="max-w-7xl mx-auto px-4 py-32 text-center">
          <ShoppingBagOpen size={64} weight="duotone" className="text-brand-400 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-dark-800 dark:text-white mb-2">Coming Soon</h2>
          <p className="text-dark-800/50 dark:text-white/50">Products are being added. Check back soon!</p>
        </section>
      )}
    </main>
  )
}
