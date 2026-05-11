import { Link } from "@tanstack/react-router";
import { ShoppingBag, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCart } from "@/lib/cart-store";
import { useStoreSettings } from "@/hooks/use-store-settings";

export function StoreNavbar() {
  const count = useCart((s) => s.items.reduce((a, b) => a + b.quantity, 0));
  const { settings } = useStoreSettings();

  return (
    <header className="sticky top-0 z-40">
      <div className="glass mx-3 mt-3 rounded-2xl px-4 py-2.5 sm:mx-6 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid size-8 place-items-center rounded-xl gradient-warm raised">
              <Store className="size-4 text-primary-foreground" />
            </span>
            <span className="text-base sm:text-lg">{settings.store_name}</span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm sm:flex">
            <Link to="/" className="rounded-full px-3 py-1.5 hover:bg-accent/60">Home</Link>
            <Link to="/shop" className="rounded-full px-3 py-1.5 hover:bg-accent/60">Shop</Link>
          </nav>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative grid size-9 place-items-center rounded-full hover:bg-accent/60"
            >
              <ShoppingBag className="size-4" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: [1, 1.25, 1], opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
