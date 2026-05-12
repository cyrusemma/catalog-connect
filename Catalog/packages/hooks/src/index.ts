import { useState, useEffect } from 'react';

// useCart hook
export const useCart = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setCart(JSON.parse(stored));
  }, []);

  const addItem = (product: any, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      const updated = existing
        ? prev.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          )
        : [...prev, { ...product, quantity }];
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = (productId: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clear = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return { cart, addItem, removeItem, updateQuantity, clear, isLoading };
};

// useWishlist hook
export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  const addItem = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) return prev;
      const updated = [...prev, productId];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = (productId: string) => {
    setWishlist((prev) => {
      const updated = prev.filter((id) => id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const toggle = (productId: string) => {
    if (wishlist.includes(productId)) {
      removeItem(productId);
    } else {
      addItem(productId);
    }
  };

  return { wishlist, addItem, removeItem, toggle };
};

// useTheme hook
export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle('dark', stored === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      return newTheme;
    });
  };

  return { theme, toggleTheme };
};

// usePrevious hook
export const usePrevious = <T,>(value: T): T | undefined => {
  const ref = React.useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

// useMediaQuery hook
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
};

// useInfiniteScroll hook
export const useInfiniteScroll = (callback: () => void, threshold: number = 100) => {
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
        }
      },
      { rootMargin: `${threshold}px` }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [callback, threshold]);

  return ref;
};

// usePagination hook
export const usePagination = (items: any[], itemsPerPage: number = 10) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = items.slice(start, end);

  return {
    page,
    setPage,
    totalPages,
    paginatedItems,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
