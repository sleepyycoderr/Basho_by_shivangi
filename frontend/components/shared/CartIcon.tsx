'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { CartDrawer } from '@/components/cart/CartDrawer';

export const CartIcon: React.FC = () => {
  const { cartItems } = useCart();   // ✅ only what exists
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // ✅ derived cart count
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="relative p-2 hover:bg-[#F5F5DC] rounded-full transition-colors"
      >
        <svg
          className="w-6 h-6 text-[#2C2C2C]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>

        {/* Badge */}
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#8B6F47] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};
