'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { Product, GlazeColor } from '@/types/product';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: GlazeColor;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  isReady: boolean;

  addToCart: (
    product: Product,
    quantity: number,
    selectedColor: GlazeColor
  ) => void;

  removeFromCart: (productId: string, colorCode: string) => void;

  updateQuantity: (
    productId: string,
    colorCode: string,
    newQuantity: number
  ) => void;

  clearCart: () => void;

  getCartTotal: () => number;

  isInCart: (productId: string, colorCode: string) => boolean;

  // ✅ CHECKOUT HELPERS
  buildCheckoutItems: () => {
    id: string;
    qty: number;
  }[];
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  // ---------------- LOAD ----------------

  useEffect(() => {
    try {
      const saved = localStorage.getItem('basho-cart');
      if (saved) setCartItems(JSON.parse(saved));
    } catch {
      localStorage.removeItem('basho-cart');
    } finally {
      setIsReady(true);
    }
  }, []);

  // ---------------- SAVE ----------------

  useEffect(() => {
    if (isReady) {
      localStorage.setItem('basho-cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isReady]);

  // ---------------- CORE LOGIC ----------------

  const addToCart = useCallback(
    (product: Product, quantity: number, selectedColor: GlazeColor) => {
      setCartItems(prev => {
        const existing = prev.find(
          item =>
            item.product.id === product.id &&
            item.selectedColor.code === selectedColor.code
        );

        if (existing) {
          return prev.map(item =>
            item.product.id === product.id &&
            item.selectedColor.code === selectedColor.code
              ? {
                  ...item,
                  quantity: Math.min(
                    item.quantity + quantity,
                    product.stock
                  ),
                }
              : item
          );
        }

        return [...prev, { product, quantity, selectedColor }];
      });
    },
    []
  );

  const removeFromCart = useCallback(
    (productId: string, colorCode: string) => {
      setCartItems(prev =>
        prev.filter(
          item =>
            !(
              item.product.id === productId &&
              item.selectedColor.code === colorCode
            )
        )
      );
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, colorCode: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId, colorCode);
        return;
      }

      setCartItems(prev =>
        prev.map(item =>
          item.product.id === productId &&
          item.selectedColor.code === colorCode
            ? {
                ...item,
                quantity: Math.min(newQuantity, item.product.stock),
              }
            : item
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('basho-cart');
  }, []);

  // ---------------- DERIVED ----------------

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const getCartTotal = () =>
    cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

  const isInCart = (productId: string, colorCode: string) =>
    cartItems.some(
      item =>
        item.product.id === productId &&
        item.selectedColor.code === colorCode
    );

  // ---------------- CHECKOUT FORMAT ----------------

  const buildCheckoutItems = () =>
    cartItems.map(item => ({
      id: item.product.id,
      qty: item.quantity,
    }));

  // ---------------- PROVIDER ----------------

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        isReady,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        isInCart,
        buildCheckoutItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
