// components/cart/CartDrawer.tsx  (or wherever your drawer lives)

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#FAF8F5] z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-3">
            <svg
              className="w-6 h-6 text-[#8B6F47]"
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
            <h2 className="text-xl font-medium text-[#2C2C2C]">
              Your Cart ({cartCount})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-[#E5E5E5] rounded-full"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-lg text-[#666] mb-6">Your cart is empty</p>
              <Link
                href="/shop"
                onClick={onClose}
                className="bg-[#8B6F47] text-white px-8 py-3 rounded-sm uppercase"
              >
                Browse Collection
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map(item => (
                <div
                  key={`${item.product.id}-${item.selectedColor.code}`}
                  className="flex gap-4"
                >
                  <div className="relative w-24 h-24 bg-[#E8DFD0] rounded-sm overflow-hidden">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-[#2C2C2C]">
                      {item.product.name}
                    </h3>

                    <p className="text-sm text-[#666]">
                      Glaze: {item.selectedColor.name}
                    </p>

                    <p className="text-lg font-semibold text-[#8B6F47] mb-2">
                      {formatPrice(item.product.price)}
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="flex border-2 border-[#272222] text-[#272222]">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedColor.code,
                              item.quantity - 1
                            )
                          }
                          className="px-3 py-1"
                        >
                          −
                        </button>

                        <span className="px-4 py-1 border-x-2">{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedColor.code,
                              item.quantity + 1
                            )
                          }
                          disabled={item.quantity >= item.product.stock}
                          className="px-3 py-1 disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(
                            item.product.id,
                            item.selectedColor.code
                          )
                        }
                        className="text-red-600"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#E5E5E5] p-6 bg-white space-y-3">
            {/* Subtotal */}
            <div className="flex text-[#666] justify-between mb-4">
              <span>Subtotal</span>
              <span className="font-semibold">{formatPrice(getCartTotal())}</span>
            </div>

            {/* View Full Cart */}
            <Link
              href="/cart"
              onClick={onClose}
              className="block w-full bg-[#8B6F47] text-white py-3 text-center uppercase rounded-sm hover:bg-[#cbb48b]"
            >
              View Full Cart
            </Link>

            {/* Proceed to Checkout */}
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full bg-[#8B6F47] text-white py-4 text-center uppercase rounded-sm hover:bg-[#76603e]"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
};