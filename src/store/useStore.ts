import { create } from 'zustand';
import { Product, products as seedProducts } from '../data/products';
import {
  fetchProducts,
  createProduct,
  updateProduct as dbUpdateProduct,
  deleteProduct as dbDeleteProduct,
  toggleProductActive,
} from '../services/productService';

export interface CartItem extends Product {
  quantity: number;
}

interface AppState {
  products: Product[];
  productsLoading: boolean;
  productsError: string | null;
  dbConnected: boolean;
  cart: CartItem[];
  isCartOpen: boolean;
  currency: 'LSL' | 'ZAR';
  loadProducts: () => Promise<void>;
  addProduct: (p: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, changes: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleActive: (id: string, isActive: boolean) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  toggleCurrency: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  products: seedProducts,
  productsLoading: false,
  productsError: null,
  dbConnected: false,
  cart: [],
  isCartOpen: false,
  currency: 'LSL',

  loadProducts: async () => {
    set({ productsLoading: true, productsError: null });
    try {
      const data = await fetchProducts();
      set({ products: data, productsLoading: false, dbConnected: true });
    } catch (err: any) {
      console.warn('[Store] DB unavailable, using seed data.', err.message);
      set({ productsLoading: false, dbConnected: false,
            productsError: "Running in offline mode — changes won't persist." });
    }
  },

  addProduct: async (p) => {
    const { dbConnected } = get();
    if (dbConnected) {
      const created = await createProduct(p);
      set(state => ({ products: [created, ...state.products] }));
    } else {
      const offline: Product = { ...p, id: `local-${Date.now()}` } as Product;
      set(state => ({ products: [offline, ...state.products] }));
    }
  },

  updateProduct: async (id, changes) => {
    const { dbConnected } = get();
    if (dbConnected) {
      const updated = await dbUpdateProduct(id, changes);
      set(state => ({ products: state.products.map(p => p.id === id ? updated : p) }));
    } else {
      set(state => ({ products: state.products.map(p => p.id === id ? { ...p, ...changes } : p) }));
    }
  },

  deleteProduct: async (id) => {
    const { dbConnected } = get();
    if (dbConnected) await dbDeleteProduct(id);
    set(state => ({ products: state.products.filter(p => p.id !== id) }));
  },

  toggleActive: async (id, isActive) => {
    const { dbConnected } = get();
    if (dbConnected) await toggleProductActive(id, isActive);
    set(state => ({ products: state.products.map(p => p.id === id ? { ...p, isActive } : p) }));
  },

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  addToCart: (product, quantity = 1) => set(state => {
    const existing = state.cart.find(i => i.id === product.id);
    if (existing) {
      return { cart: state.cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i), isCartOpen: true };
    }
    return { cart: [...state.cart, { ...product, quantity }], isCartOpen: true };
  }),

  removeFromCart: (id) => set(state => ({ cart: state.cart.filter(i => i.id !== id) })),
  updateQuantity: (id, qty) => set(state => ({
    cart: state.cart.map(i => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)
  })),
  clearCart: () => set({ cart: [] }),
  getCartTotal: () => get().cart.reduce((t, i) => t + i.price * i.quantity, 0),
  getCartCount: () => get().cart.reduce((c, i) => c + i.quantity, 0),
  toggleCurrency: () => set(state => ({ currency: state.currency === 'LSL' ? 'ZAR' : 'LSL' })),
}));