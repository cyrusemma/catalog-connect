import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, X, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { useCart } from "@/lib/cart-store";
import { useStoreSettings } from "@/hooks/use-store-settings";
import { useAuth } from "@/hooks/use-auth";

export function StoreNavbar() {
  const count = useCart((s) => s.items.reduce((a, b) => a + b.quantity, 0));
  const { settings } = useStoreSettings();
  const { isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40">
      <div
        className={`mx-3 mt-3 rounded-2xl px-4 py-2.5 transition-all duration-300 sm:mx-6 sm:px-5 ${
          scrolled ? "glass neu-button" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo logoUrl={settings.logo_url} storeName={settings.store_name} className="size-9" />
            <span className="font-playfair text-lg font-bold tracking-tight sm:text-xl">
              {settings.store_name}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 text-sm font-medium sm:flex">
            <Link
              to="/"
              className="rounded-full px-3 py-1.5 hover:text-primary"
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-primary" }}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="rounded-full px-3 py-1.5 hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              Shop
            </Link>
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            {isAdmin && (
              <Link
                to="/admin"
                aria-label="Admin"
                className="hidden size-9 place-items-center rounded-full hover:text-primary sm:grid"
              >
                <Settings className="size-4" />
              </Link>
            )}
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative grid size-9 place-items-center rounded-full hover:text-primary"
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
            <button
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="grid size-9 place-items-center rounded-full hover:text-primary sm:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-in */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass neu-raised mx-3 mt-2 rounded-2xl p-3 sm:hidden"
          >
            <nav className="flex flex-col text-sm font-medium">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 hover:bg-accent/40"
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 hover:bg-accent/40"
              >
                Shop
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2 hover:bg-accent/40"
                >
                  Admin
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
