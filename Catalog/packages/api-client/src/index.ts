import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth
export const useAuth = () => {
  const login = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      if (error) throw error;
      return data;
    },
  });

  const signup = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signUp(credentials);
      if (error) throw error;
      return data;
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
  });

  return { login, signup, logout };
};

// Products
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('published', true);
      if (error) throw error;
      return data;
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: async (product: any) => {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data;
    },
  });
};

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  });
};

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      if (error) throw error;
      return data;
    },
  });
};

// Orders
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*');
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (order: any) => {
      const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select();
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateOrder = () => {
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data;
    },
  });
};

// Settings
export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateSettings = () => {
  return useMutation({
    mutationFn: async (updates: any) => {
      const { data, error } = await supabase
        .from('settings')
        .update(updates)
        .eq('id', '00000000-0000-0000-0000-000000000000')
        .select();
      if (error) throw error;
      return data;
    },
  });
};
