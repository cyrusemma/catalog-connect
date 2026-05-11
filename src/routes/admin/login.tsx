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
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        const userId = data.user?.id;
        if (!userId) throw new Error("Signup failed");
        // Sign in to get session, then insert role
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (signInErr) throw signInErr;
        const { error: roleErr } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
        if (roleErr) throw roleErr;
        toast.success("Admin account created");
        nav({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Verify admin
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
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl bg-card p-6 raised">
        <div className="mb-4 flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl gradient-warm">
            <Store className="size-4 text-primary-foreground" />
          </span>
          <div>
            <h1 className="text-lg font-semibold">{mode === "setup" ? "Create admin account" : "Admin login"}</h1>
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
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" disabled={busy} className="w-full rounded-full raised">
              {busy ? "Working…" : mode === "setup" ? "Create admin" : "Sign in"}
            </Button>
          </form>
        )}
        <Link to="/" className="mt-4 block text-center text-xs text-muted-foreground hover:text-primary">
          ← Back to storefront
        </Link>
      </div>
    </div>
  );
}
