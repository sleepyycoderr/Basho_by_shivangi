// context/CartContext.tsx  (or /app/context depending on your structure)

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, GlazeColor } from '@/types/product';

interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: GlazeColor;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // LocalStorage sync
  useEffect(() => {
    const savedCart = localStorage.getItem('basho-cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('basho-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Cart logic
  const addToCart = (
    product: Product,
    quantity: number,
    selectedColor: GlazeColor
  ) => {
    setCartItems(prev => {
      const existingItem = prev.find(
        item =>
          item.product.id === product.id &&
          item.selectedColor.code === selectedColor.code
      );

      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id &&
          item.selectedColor.code === selectedColor.code
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, product.stock),
              }
            : item
        );
      }

      return [...prev, { product, quantity, selectedColor }];
    });
  };

  const removeFromCart = (productId: string, colorCode: string) => {
    setCartItems(prev =>
      prev.filter(
        item =>
          !(
            item.product.id === productId &&
            item.selectedColor.code === colorCode
          )
      )
    );
  };

  const updateQuantity = (
    productId: string,
    colorCode: string,
    newQuantity: number
  ) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, colorCode);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId &&
        item.selectedColor.code === colorCode
          ? { ...item, quantity: Math.min(newQuantity, item.product.stock) }
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  // Derived values
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const getCartTotal = () =>
    cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

  const isInCart = (productId: string, colorCode: string) =>
    cartItems.some(
      item =>
        item.product.id === productId &&
        item.selectedColor.code === colorCode
    );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};