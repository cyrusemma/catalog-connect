import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, Package, PlusSquare, Settings, ShoppingCart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
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

function AdminLayout() {
  const nav = useNavigate();
  const { signOut, user } = useAuth();
  const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/products/new", label: "Add product", icon: PlusSquare },
    { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ];
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/admin" className="font-semibold">Catalog Admin</Link>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">{user?.email}</span>
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={async () => { await signOut(); nav({ to: "/admin/login" }); }}>
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[200px_1fr]">
        <nav className="hidden md:block">
          <ul className="space-y-1 text-sm">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  activeOptions={{ exact: l.exact }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent"
                  activeProps={{ className: "bg-accent font-medium text-foreground" }}
                >
                  <l.icon className="size-4" /> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main><Outlet /></main>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-background/95 backdrop-blur md:hidden">
        <ul className="grid grid-cols-5">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} activeOptions={{ exact: l.exact }} className="flex flex-col items-center gap-0.5 py-2 text-[10px]" activeProps={{ className: "text-primary" }}>
                <l.icon className="size-4" /> {l.label.split(" ")[0]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
