import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink, LayoutDashboard, LogOut, Menu, Package, PlusSquare, Settings, ShoppingCart, Store, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/admin/login" });
    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.session.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!role) throw redirect({ to: "/admin/login" });
  },
  component: AdminLayout,
});

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/products/new", label: "Add product", icon: PlusSquare },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function AdminLayout() {
  const nav = useNavigate();
  const { signOut, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (to: string, exact?: boolean) => (exact ? pathname === to : pathname.startsWith(to));

  const SidebarBody = (
    <div className="flex h-full flex-col gap-2 p-4">
      <Link to="/admin" className="mb-4 flex items-center gap-2.5 px-2">
        <span className="grid size-9 place-items-center rounded-xl gradient-warm neu-button">
          <Store className="size-4 text-primary-foreground" />
        </span>
        <span className="font-playfair text-lg font-bold">Catalog</span>
      </Link>
      <nav className="flex-1 space-y-1.5 text-sm">
        {links.map((l) => {
          const active = isActive(l.to, l.exact);
          return (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition-all ${
                active
                  ? "neu-pressed bg-primary/15 text-primary"
                  : "text-foreground/80 hover:bg-accent/30 hover:text-foreground"
              }`}
            >
              <l.icon className="size-4" /> {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1.5 border-t border-border/60 pt-3 text-sm">
        <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2 text-muted-foreground hover:text-primary">
          <ExternalLink className="size-4" /> View store
        </Link>
        <button
          onClick={async () => { await signOut(); nav({ to: "/admin/login" }); }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-muted-foreground hover:text-destructive"
        >
          <LogOut className="size-4" /> Sign out
        </button>
        {user?.email && <p className="px-3 pt-1 text-[11px] text-muted-foreground/70 truncate">{user.email}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-border/60 bg-sidebar md:block">
        {SidebarBody}
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur md:hidden">
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="grid size-9 place-items-center rounded-xl neu-button">
          <Menu className="size-4" />
        </button>
        <Link to="/admin" className="font-playfair text-lg font-bold">Catalog Admin</Link>
        <ThemeToggle />
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-sidebar shadow-2xl md:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close"
                className="absolute right-3 top-3 grid size-8 place-items-center rounded-full hover:bg-accent/40"
              >
                <X className="size-4" />
              </button>
              {SidebarBody}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="md:pl-60">
        <div className="hidden md:flex sticky top-0 z-20 items-center justify-end gap-2 border-b border-border/60 bg-background/70 px-6 py-3 backdrop-blur">
          <span className="text-xs text-muted-foreground">{user?.email}</span>
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={async () => { await signOut(); nav({ to: "/admin/login" }); }}>
            <LogOut className="size-4" />
          </Button>
        </div>
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
