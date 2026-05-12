import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { StoreNavbar } from "@/components/storefront/store-navbar";
import { StoreFooter } from "@/components/storefront/store-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart-store";
import { useStoreSettings } from "@/hooks/use-store-settings";
import { formatMoney } from "@/lib/format";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const { settings } = useStoreSettings();
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const checkout = async () => {
    if (!items.length) return;
    if (!name.trim() || !phone.trim()) {
      toast.error("Please add your name and phone");
      return;
    }
    const url = buildWhatsAppOrderUrl({
      number: settings.whatsapp_number,
      currency: settings.currency,
      customerName: name,
      customerPhone: phone,
      items: items.map((i) => ({ title: i.title, price: i.price, quantity: i.quantity })),
    });
    // Record order
    const { error: insertError } = await supabase.from("orders").insert({
      customer_name: name,
      customer_phone: phone,
      items: items.map((i) => ({ id: i.id, title: i.title, price: i.price, quantity: i.quantity })),
      total,
      status: "pending",
    });

    if (insertError) {
      toast.error("Failed to record order. Please try again.");
      console.error("Order insert error:", insertError);
      return;
    }

    clear();
    window.open(url, "_blank", "noopener");
    toast.success("Order recorded. Opening WhatsApp…");
  };

  return (
    <div className="min-h-screen">
      <StoreNavbar />
      <main className="mx-auto max-w-4xl px-4 sm:px-6">
        <h1 className="mt-6 text-2xl font-bold tracking-tight">Your cart</h1>

        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-card p-10 text-center raised">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link to="/shop">
              <Button className="mt-4 rounded-full">Start shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
            <ul className="space-y-3">
              {items.map((i) => (
                <li key={i.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 raised">
                  <div className="size-16 overflow-hidden rounded-xl bg-muted">
                    {i.image && (
                      <img src={i.image} alt={i.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/product/$slug"
                      params={{ slug: i.slug }}
                      className="line-clamp-1 text-sm font-medium hover:text-primary"
                    >
                      {i.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {formatMoney(i.price, settings.currency)}
                    </p>
                  </div>
                  <div className="flex items-center rounded-full bg-background">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={() => setQty(i.id, i.quantity - 1)}
                    >
                      <Minus className="size-3.5" />
                    </Button>
                    <span className="w-6 text-center text-sm">{i.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={() => setQty(i.id, i.quantity + 1)}
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(i.id)}
                    aria-label="Remove"
                  >
                    <Trash2 className="size-4 text-muted-foreground" />
                  </Button>
                </li>
              ))}
            </ul>

            <aside className="rounded-2xl bg-card p-4 raised">
              <h2 className="text-sm font-semibold">Order summary</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{formatMoney(total, settings.currency)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                  <dt>Total</dt>
                  <dd>{formatMoney(total, settings.currency)}</dd>
                </div>
              </dl>
              <div className="mt-4 space-y-2">
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <Button
                onClick={checkout}
                className="mt-3 w-full rounded-full bg-whatsapp text-whatsapp-foreground hover:opacity-90 raised"
              >
                <MessageCircle className="mr-1 size-4" /> Checkout via WhatsApp
              </Button>
            </aside>
          </div>
        )}
      </main>
      <StoreFooter />
    </div>
  );
}
