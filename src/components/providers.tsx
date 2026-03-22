"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, MOCK_USERS, Listing } from '@/lib/mock-data';
import { INITIAL_CONTENT } from '@/lib/initial-content';

// ─── Theme Context ────────────────────────────────────────────────────────────
export type PrimaryTheme = 'sovereign' | 'midnight' | 'cobalt' | 'royal' | 'crimson' | 'cold-white';
interface ThemeContextType { theme: PrimaryTheme; setTheme: (theme: PrimaryTheme) => void; }
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<PrimaryTheme>('cold-white');
  const setTheme = (newTheme: PrimaryTheme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newTheme);
      newTheme !== 'cold-white'
        ? document.documentElement.classList.add('dark')
        : document.documentElement.classList.remove('dark');
    }
  };
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vault_theme');
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'cold-white');
      setThemeState('cold-white');
    }
  }, []);
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme outside ThemeProvider');
  return ctx;
};

// ─── Content Context ──────────────────────────────────────────────────────────
interface ContentContextType {
  content: typeof INITIAL_CONTENT;
  updatePage: (slug: string, section: string, data: any) => void;
  updateSettings: (data: Partial<typeof INITIAL_CONTENT.settings>) => void;
  resetToDefault: () => void;
}
const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState(INITIAL_CONTENT);
  useEffect(() => {
    const stored = localStorage.getItem('vault_content');
    if (stored) { try { setContent(JSON.parse(stored)); } catch {} }
  }, []);
  const saveContent = (c: typeof INITIAL_CONTENT) => {
    setContent(c);
    if (typeof window !== 'undefined') localStorage.setItem('vault_content', JSON.stringify(c));
  };
  const updatePage = (slug: string, section: string, data: any) => {
    const nc = { ...content };
    if (nc.pages[slug as keyof typeof content.pages]) {
      const page = nc.pages[slug as keyof typeof content.pages];
      (page.sections as any)[section] = { ...(page.sections as any)[section], ...data };
      saveContent(nc);
    }
  };
  const updateSettings = (data: Partial<typeof INITIAL_CONTENT.settings>) =>
    saveContent({ ...content, settings: { ...content.settings, ...data } });
  const resetToDefault = () => saveContent(INITIAL_CONTENT);
  return (
    <ContentContext.Provider value={{ content, updatePage, updateSettings, resetToDefault }}>
      {children}
    </ContentContext.Provider>
  );
}
export const useContent = () => {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent outside ContentProvider');
  return ctx;
};

// ─── Auth Context ─────────────────────────────────────────────────────────────
interface AuthContextType { user: User | null; login: (email: string) => void; logout: () => void; }
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const login = (email: string) => {
    const found = MOCK_USERS.find(u => u.email === email);
    if (found) {
      setUser(found);
      if (typeof window !== 'undefined') localStorage.setItem('vault_user', JSON.stringify(found));
    }
  };
  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') localStorage.removeItem('vault_user');
  };
  useEffect(() => {
    const stored = localStorage.getItem('vault_user');
    if (stored) { try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('vault_user'); } }
  }, []);
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside AuthProvider');
  return ctx;
};

// ─── Search Context ───────────────────────────────────────────────────────────
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setQuery: (q: string) => void;
}
const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQueryState] = useState('');
  const setSearchQuery = (q: string) => setSearchQueryState(q);
  const setQuery = (q: string) => setSearchQueryState(q);
  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
}
export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch outside SearchProvider');
  return ctx;
};

// ─── Currency Context ─────────────────────────────────────────────────────────
export type CurrencyCode = 'GHS' | 'USD' | 'EUR' | 'GBP';
interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (priceGHS: number) => string;
}
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);
const RATES: Record<CurrencyCode, { rate: number; symbol: string }> = {
  GHS: { rate: 1, symbol: 'GH₵' },
  USD: { rate: 0.082, symbol: '$' },
  EUR: { rate: 0.076, symbol: '€' },
  GBP: { rate: 0.064, symbol: '£' },
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>('GHS');
  const formatPrice = (priceGHS: number) => {
    const { rate, symbol } = RATES[currency];
    const converted = priceGHS * rate;
    return `${symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: currency === 'GHS' ? 0 : 2,
      maximumFractionDigits: 2,
    })}`;
  };
  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}
export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency outside CurrencyProvider');
  return ctx;
};

// ─── Cart Context ─────────────────────────────────────────────────────────────
// CRITICAL FIX: startCheckoutSim no longer runs a timer that auto-closes the
// flow. It simply raises isCheckingOut to true and keeps it there.
// The EscrowCheckoutFlow component is solely responsible for calling
// closeSuccess() when it's done, which resets isCheckingOut to false.
// This prevents the race condition where the timer closed the dialog before
// the user had interacted with it.

interface CartItem extends Listing { quantity: number; }
interface CartContextType {
  items: CartItem[];
  addItem: (item: Listing) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
  // isCheckingOut: true = checkout flow is open
  isCheckingOut: boolean;
  // kept for backward compat — not used internally
  checkoutStep: number;
  showSuccess: boolean;
  startCheckoutSim: () => void;
  closeSuccess: () => void;
}
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const addItem = (item: Listing) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Simply opens the escrow flow — no timer, no auto-close, no cart clearing here
  const startCheckoutSim = () => {
    setIsCheckingOut(true);
    setShowSuccess(false);
  };

  // Called by EscrowCheckoutFlow when user closes or completes the flow
  const closeSuccess = () => {
    setIsCheckingOut(false);
    setShowSuccess(false);
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setItems([]);
  const subtotal = items.reduce((acc, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    return acc + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, clearCart, total: subtotal,
      isCheckingOut, checkoutStep: 0, showSuccess,
      startCheckoutSim, closeSuccess,
    }}>
      {children}
    </CartContext.Provider>
  );
}
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart outside CartProvider');
  return ctx;
};

// ─── Root Wrapper ─────────────────────────────────────────────────────────────
export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ContentProvider>
        <AuthProvider>
          <SearchProvider>
            <CurrencyProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </CurrencyProvider>
          </SearchProvider>
        </AuthProvider>
      </ContentProvider>
    </ThemeProvider>
  );
}
