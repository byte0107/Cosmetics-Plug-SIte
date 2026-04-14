import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  console.warn('[Supabase] Missing env vars. Running in local-only mode.');
}

export const supabase = createClient(
  supabaseUrl  || 'https://placeholder.supabase.co',
  supabaseKey  || 'placeholder-key'
);

export type DbProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string | null;
  benefits: string[] | null;
  ingredients: string[] | null;
  is_new: boolean;
  is_active: boolean;
  is_featured: boolean;
  is_on_sale: boolean;
  is_recommended: boolean;
  stock: number;
  created_at: string;
  updated_at: string;
};