import { supabase, DbProduct } from '../lib/supabase';
import { Product } from '../data/products';

function dbToProduct(row: DbProduct): Product {
  return {
    id:            row.id,
    name:          row.name,
    category:      row.category,
    price:         row.price,
    image:         row.image,
    description:   row.description   ?? undefined,
    benefits:      row.benefits      ?? undefined,
    ingredients:   row.ingredients   ?? undefined,
    isNew:         row.is_new,
    isActive:      row.is_active,
    isFeatured:    row.is_featured,
    isOnSale:      row.is_on_sale,
    isRecommended: row.is_recommended,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as DbProduct[]).map(dbToProduct);
}

export async function createProduct(p: Omit<Product, 'id'>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert({
      name:           p.name,
      category:       p.category,
      price:          p.price,
      image:          p.image || 'https://images.unsplash.com/photo-1596462502278-27bfad450216?auto=format&fit=crop&q=80&w=600',
      description:    p.description    ?? null,
      benefits:       p.benefits       ?? null,
      ingredients:    p.ingredients    ?? null,
      is_new:         p.isNew          ?? false,
      is_active:      p.isActive       ?? true,
      is_featured:    p.isFeatured     ?? false,
      is_on_sale:     p.isOnSale       ?? false,
      is_recommended: p.isRecommended  ?? false,
      stock:          (p as any).stock ?? 0,
    })
    .select()
    .single();
  if (error) throw error;
  return dbToProduct(data as DbProduct);
}

export async function updateProduct(id: string, changes: Partial<Product>): Promise<Product> {
  const payload: any = { updated_at: new Date().toISOString() };
  if (changes.name          !== undefined) payload.name           = changes.name;
  if (changes.category      !== undefined) payload.category       = changes.category;
  if (changes.price         !== undefined) payload.price          = changes.price;
  if (changes.image         !== undefined) payload.image          = changes.image;
  if (changes.description   !== undefined) payload.description    = changes.description;
  if (changes.benefits      !== undefined) payload.benefits       = changes.benefits;
  if (changes.ingredients   !== undefined) payload.ingredients    = changes.ingredients;
  if (changes.isNew         !== undefined) payload.is_new         = changes.isNew;
  if (changes.isActive      !== undefined) payload.is_active      = changes.isActive;
  if (changes.isFeatured    !== undefined) payload.is_featured    = changes.isFeatured;
  if (changes.isOnSale      !== undefined) payload.is_on_sale     = changes.isOnSale;
  if (changes.isRecommended !== undefined) payload.is_recommended = changes.isRecommended;
  if ((changes as any).stock !== undefined) payload.stock         = (changes as any).stock;

  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select('*')
    .limit(1)
    .single();

  if (error) throw error;
  return dbToProduct(data as DbProduct);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function toggleProductActive(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}