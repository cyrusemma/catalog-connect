import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Store } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"loading" | "setup" | "login">("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.rpc("admin_exists").then(({ data, error }) => {
      if (error) {
        console.error(error);
        setMode("login");
        return;
      }
      setMode(data ? "login" : "setup");
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "setup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (signInErr) throw signInErr;
        const { error: bootstrapErr } = await supabase.rpc("bootstrap_admin");
        if (bootstrapErr) throw bootstrapErr;
        toast.success("Admin account created");
        nav({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Try bootstrap (no-op if an admin already exists) so the very first
        // login can self-promote if signup happened before role was granted.
        await supabase.rpc("bootstrap_admin");
        const { data: userData } = await supabase.auth.getUser();
        const { data: role } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userData.user?.id ?? "")
          .eq("role", "admin")
          .maybeSingle();
        if (!role) {
          await supabase.auth.signOut();
          throw new Error("This account is not an admin");
        }
        toast.success("Welcome back");
        nav({ to: "/admin" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-4">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-float absolute -top-24 left-1/4 size-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="animate-float absolute bottom-[-3rem] right-1/4 size-80 rounded-full bg-primary-glow/20 blur-3xl" style={{ animationDelay: "1.5s" }} />
      </div>
      <div className="relative w-full max-w-sm rounded-3xl glass-card neu-raised p-7">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl gradient-warm neu-button">
            <Store className="size-5 text-primary-foreground" />
          </span>
          <div>
            <h1 className="font-playfair text-xl font-bold">{mode === "setup" ? "Create admin" : "Admin login"}</h1>
            <p className="text-xs text-muted-foreground">
              {mode === "setup" ? "First-run setup. Locks after this." : "Restricted area."}
            </p>
          </div>
        </div>
        {mode === "loading" ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div>
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Password</Label>
              <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 rounded-xl" />
            </div>
            <Button type="submit" disabled={busy} className="w-full rounded-xl neu-button bg-primary text-primary-foreground hover:bg-primary">
              {busy ? "Working…" : mode === "setup" ? "Create admin" : "Sign in"}
            </Button>
          </form>
        )}
        <Link to="/" className="mt-5 block text-center text-xs text-muted-foreground hover:text-primary">
          ← Back to storefront
        </Link>
      </div>
    </div>
  );
}
