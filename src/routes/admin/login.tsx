import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { useStoreSettings } from "@/hooks/use-store-settings";
import { useLocalAuth } from "@/hooks/use-local-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const nav = useNavigate();
  const { settings } = useStoreSettings();
  const { signIn } = useLocalAuth();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signIn(email, password);
      toast.success("Welcome to admin panel!");
      nav({ to: "/admin" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-4">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-float absolute -top-24 left-1/4 size-72 rounded-full bg-primary/20 blur-3xl" />
        <div
          className="animate-float absolute bottom-[-3rem] right-1/4 size-80 rounded-full bg-primary-glow/20 blur-3xl"
          style={{ animationDelay: "1.5s" }}
        />
      </div>
      <div className="relative w-full max-w-sm rounded-3xl glass-card neu-raised p-7">
        <div className="mb-5 flex items-center gap-3">
          <Logo logoUrl={settings.logo_url} storeName={settings.store_name} className="size-11" />
          <div>
            <h1 className="font-playfair text-xl font-bold">Admin Login</h1>
            <p className="text-xs text-muted-foreground">Enter your credentials to continue</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <Label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 rounded-xl"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <Label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 rounded-xl"
              placeholder="••••••••"
            />
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-2.5">
            <p className="text-xs font-medium text-amber-900">Demo Credentials:</p>
            <p className="mt-1 text-xs text-amber-800">
              Email: <span className="font-mono font-semibold">admin@example.com</span>
            </p>
            <p className="text-xs text-amber-800">
              Password: <span className="font-mono font-semibold">password123</span>
            </p>
          </div>

          <Button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl neu-button bg-primary text-primary-foreground hover:bg-primary"
          >
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <Link
          to="/"
          className="mt-5 block text-center text-xs text-muted-foreground hover:text-primary"
        >
          ← Back to storefront
        </Link>
      </div>
    </div>
  );
}
