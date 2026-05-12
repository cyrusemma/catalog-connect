/**
 * Logo component - displays custom logo from store settings or falls back to icon
 */
import { ShoppingBag } from "lucide-react";

interface LogoProps {
  logoUrl?: string | null;
  storeName?: string;
  className?: string;
  iconOnly?: boolean;
}

export function Logo({
  logoUrl,
  storeName = "Store",
  className = "size-9",
  iconOnly = false,
}: LogoProps) {
  if (logoUrl) {
    return (
      <img src={logoUrl} alt={`${storeName} logo`} className={`${className} object-contain`} />
    );
  }

  // Fallback to shopping bag icon
  return (
    <div className={`grid ${className} place-items-center rounded-xl gradient-warm neu-button`}>
      <ShoppingBag className={`${iconOnly ? "w-full h-full" : "size-4"} text-primary-foreground`} />
    </div>
  );
}
