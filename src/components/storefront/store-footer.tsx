import { Link } from "@tanstack/react-router";
import { Store } from "lucide-react";
import { useStoreSettings } from "@/hooks/use-store-settings";

export function StoreFooter() {
  const { settings } = useStoreSettings();
  return (
    <footer className="mt-20 border-t border-border/60 px-6 py-10 text-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg gradient-warm">
            <Store className="size-3.5 text-primary-foreground" />
          </span>
          <span className="font-playfair text-base font-bold">{settings.store_name}</span>
        </div>
        <nav className="flex items-center gap-5 text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <Link to="/shop" className="hover:text-primary">
            Shop
          </Link>
          <Link to="/cart" className="hover:text-primary">
            Cart
          </Link>
        </nav>
        <div className="flex items-center gap-3 text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {settings.store_name}
          </p>
          <Link to="/admin/login" className="opacity-50 hover:opacity-100 hover:text-primary">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
