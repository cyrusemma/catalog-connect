import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/lib/types";

const PRODUCTS_STORAGE_KEY = "products";

const DEFAULT_PRODUCTS: Product[] = [];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProducts(Array.isArray(parsed) ? parsed : []);
      } else {
        setProducts(DEFAULT_PRODUCTS);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setProducts(DEFAULT_PRODUCTS);
    }
    setLoading(false);
  }, []);

  // Add product
  const addProduct = useCallback((product: Product) => {
    try {
      setProducts((prev) => {
        const updated = [...prev, product];
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      console.error("Failed to add product:", err);
    }
  }, []);

  // Update product
  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    try {
      setProducts((prev) => {
        const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      console.error("Failed to update product:", err);
    }
  }, []);

  // Delete product
  const deleteProduct = useCallback((id: string) => {
    try {
      setProducts((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      console.error("Failed to delete product:", err);
    }
  }, []);

  // Get single product by id
  const getProduct = useCallback(
    (id: string) => {
      return products.find((p) => p.id === id);
    },
    [products]
  );

  // Get product by slug
  const getProductBySlug = useCallback(
    (slug: string) => {
      return products.find((p) => p.slug === slug);
    },
    [products]
  );

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProductBySlug,
  };
}
