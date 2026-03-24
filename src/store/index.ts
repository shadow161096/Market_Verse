/**
 * MarketVerse — Zustand Global Store
 *
 * Architecture: Single store composed of typed slices.
 * Each slice is defined in its own file and combined here.
 * Using Zustand v5's new `createStore` pattern with `immer`-style updates.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "@/types/cart";
import type { ProductFilters, ProductCategory } from "@/types/product";
import type { User } from "@/types/user";

// ─── Auth Slice ──────────────────────────────────────────────────────────────

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setAuth: (user: User | null) => void;
    logout: () => void;
}

// ─── Cart Slice ──────────────────────────────────────────────────────────────

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    subtotal: () => number;
    itemCount: () => number;
}

// ─── Filter Slice ────────────────────────────────────────────────────────────

interface FilterState {
    filters: ProductFilters;
    setFilter: <K extends keyof ProductFilters>(
        key: K,
        value: ProductFilters[K]
    ) => void;
    toggleCategory: (category: ProductCategory) => void;
    resetFilters: () => void;
}

// ─── UI Slice ────────────────────────────────────────────────────────────────

interface UIState {
    isSearchOpen: boolean;
    isMobileNavOpen: boolean;
    hasSeenIntro: boolean;
    isIntroStarted: boolean;
    openSearch: () => void;
    closeSearch: () => void;
    toggleSearch: () => void;
    openMobileNav: () => void;
    closeMobileNav: () => void;
    setHasSeenIntro: (seen: boolean) => void;
    setIsIntroStarted: (started: boolean) => void;
}

// ─── Combined Store Type ─────────────────────────────────────────────────────

type StoreState = CartState & FilterState & UIState & AuthState;

const defaultFilters: ProductFilters = {
    categories: [],
    priceMin: 0,
    priceMax: 10000,
    sortBy: "popular",
    inStockOnly: false,
    searchQuery: "",
};

// ─── Store ───────────────────────────────────────────────────────────────────

export const useStore = create<StoreState>()(
    persist(
        (set, get) => ({
            // ── Cart ──────────────────────────────────────────────────────────────
            items: [],
            isOpen: false,

            addItem: (newItem) =>
                set((state) => {
                    const existing = state.items.find(
                        (i) => i.productId === newItem.productId && i.variant === newItem.variant
                    );
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.id === existing.id
                                    ? { ...i, quantity: i.quantity + newItem.quantity }
                                    : i
                            ),
                            isOpen: true,
                        };
                    }
                    return { items: [...state.items, newItem], isOpen: true };
                }),

            removeItem: (id) =>
                set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

            updateQuantity: (id, quantity) =>
                set((state) => ({
                    items:
                        quantity <= 0
                            ? state.items.filter((i) => i.id !== id)
                            : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
                })),

            clearCart: () => set({ items: [] }),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            subtotal: () =>
                get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),

            itemCount: () =>
                get().items.reduce((acc, item) => acc + item.quantity, 0),

            // ── Filters ─────────────────────────────────────────────────────────
            filters: defaultFilters,

            setFilter: (key, value) =>
                set((state) => ({ filters: { ...state.filters, [key]: value } })),

            toggleCategory: (category) =>
                set((state) => {
                    const cats = state.filters.categories;
                    return {
                        filters: {
                            ...state.filters,
                            categories: cats.includes(category)
                                ? cats.filter((c) => c !== category)
                                : [...cats, category],
                        },
                    };
                }),

            resetFilters: () => set({ filters: defaultFilters }),

            // ── UI ───────────────────────────────────────────────────────────────
            isSearchOpen: false,
            isMobileNavOpen: false,
            hasSeenIntro: false,
            isIntroStarted: false,

            openSearch: () => set({ isSearchOpen: true }),
            closeSearch: () => set({ isSearchOpen: false }),
            toggleSearch: () =>
                set((state) => {
                    return { isSearchOpen: !state.isSearchOpen };
                }),

            openMobileNav: () => set({ isMobileNavOpen: true }),
            closeMobileNav: () => set({ isMobileNavOpen: false }),
            setHasSeenIntro: (seen) => set({ hasSeenIntro: seen }),
            setIsIntroStarted: (started) => set({ isIntroStarted: started }),

            // ── Auth ─────────────────────────────────────────────────────────────
            user: null,
            isAuthenticated: false,

            setAuth: (user) =>
                set({
                    user,
                    isAuthenticated: !!user,
                }),

            logout: () =>
                set({
                    user: null,
                    isAuthenticated: false,
                }),
        }),
        {
            // Persist cart and intro status (session storage might be better for intro, but let's stick to local for now or partial)
            name: "marketverse-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                items: state.items,
                hasSeenIntro: state.hasSeenIntro,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
