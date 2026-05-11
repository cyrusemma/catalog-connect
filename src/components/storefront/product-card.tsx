import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { discountPercent, formatMoney } from "@/lib/format";

export function ProductCard({ product, currency }: { product: Product; currency: string }) {
  const img = product.images?.[0];
  const off = discountPercent(product.source_price ?? undefined, product.selling_price);
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="group block overflow-hidden rounded-2xl bg-card raised"
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          {img ? (
            <img
              src={img}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">No image</div>
          )}
          {off > 0 && (
            <span className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-semibold text-destructive-foreground">
              -{off}%
            </span>
          )}
          {product.is_featured && (
            <span className="absolute right-2 top-2 rounded-full gradient-warm px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
              Featured
            </span>
          )}
        </div>
        <div className="p-3">
          {product.brand && <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{product.brand}</p>}
          <h3 className="line-clamp-2 text-sm font-medium leading-snug">{product.title}</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-semibold text-primary">{formatMoney(product.selling_price, currency)}</span>
            {off > 0 && product.source_price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatMoney(product.source_price, currency)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
