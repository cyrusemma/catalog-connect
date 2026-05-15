import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Product } from '../types'

export function useProducts(filters?: { category?: string; search?: string; featured?: boolean }) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (filters?.category && filters.category !== 'All') {
        query = query.eq('category', filters.category)
      }
      if (filters?.search) {
        query = query.ilike('title', `%${filters.search}%`)
      }
      if (filters?.featured) {
        query = query.eq('is_featured', true)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Product[]
    },
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single()
      if (error) throw error
      return data as Product
    },
    enabled: !!id,
  })
}

export function useNewProducts(days = 7) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return useQuery({
    queryKey: ['products', 'new', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_published', true)
        .gte('created_at', cutoff.toISOString())
        .order('created_at', { ascending: false })
        .limit(8)
      if (error) throw error
      return data as Product[]
    },
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .eq('is_published', true)
      if (error) throw error
      const cats = [...new Set((data as { category: string }[]).map(d => d.category).filter(Boolean))]
      return cats
    },
  })
}
