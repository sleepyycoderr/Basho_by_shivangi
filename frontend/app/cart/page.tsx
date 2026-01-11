// app/cart/page.tsx  (your full cart page)

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const {
    cartItems,
    cartCount,
    updateQuantity,
    removeFromCart,
    getCartTotal,
  } = useCart();

  const subtotal = getCartTotal();
  const shipping = subtotal >= 3000 ? 0 : 100; // Free shipping over ₹3000
  const gst = Math.round((subtotal + shipping) * 0.18);
  const total = subtotal + shipping + gst;

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <div className="bg-[#87582d] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-serif text-[#F5E6D3]">
            Shopping Cart ({cartCount})
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="bg-white rounded-sm shadow-sm p-16 text-center">
            <svg
              className="w-32 h-32 mx-auto mb-6 text-[#D4C5B0]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-2xl font-serif text-[#2C2C2C] mb-4">
              Your cart is empty
            </h2>
            <p className="text-[#563a13] mb-8">
              Start adding some beautiful pottery pieces to your cart!
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#8B6F47] text-white px-8 py-3 rounded-sm font-medium hover:bg-[#6D5836] transition-colors uppercase tracking-wide"
            >
              Browse Collection
            </Link>
          </div>
        ) : (
          // Cart with Items
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div
                  key={`${item.product.id}-${item.selectedColor.code}`}
                  className="bg-white rounded-sm shadow-md border border-[#E5E5E5] p-6"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="relative w-32 h-32 bg-[#E8DFD0] rounded-sm overflow-hidden shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-medium text-[#2C2C2C] mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-[#563a13] mb-1">
                            Glaze:{' '}
                            <span className="font-medium">
                              {item.selectedColor.name}
                            </span>
                          </p>
                          {/* category may be a string */}
                          <p className="text-sm text-[#563a13]">
                            Category: {item.product.category}
                          </p>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() =>
                            removeFromCart(
                              item.product.id,
                              item.selectedColor.code
                            )
                          }
                          className="text-red-600 hover:text-red-700 transition-colors p-2"
                          aria-label="Remove item"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between mt-6">
                        {/* Quantity Controls */}
                        <div className="flex items-center border-2 border-[#563a13] rounded-sm bg-white">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedColor.code,
                                item.quantity - 1
                              )
                            }
                            className="px-4 py-2 text-[#563a13] hover:bg-[#F1ECE3] transition-colors text-lg"
                          >
                            −
                          </button>

                          <span className="px-6 py-2 text-[#2C2C2C] font-semibold border-x border-[#563a13]/30 min-w-[56px] text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedColor.code,
                                item.quantity + 1
                              )
                            }
                            disabled={item.quantity >= item.product.stock}
                            className="px-4 py-2 text-[#563a13] hover:bg-[#F1ECE3] transition-colors text-lg disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-2xl font-semibold text-[#563a13]">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                          <p className="text-sm text-[#563a13]">
                            {formatPrice(item.product.price)} each
                          </p>
                        </div>
                      </div>

                      {/* Stock Warning */}
                      {item.product.stock < 5 && (
                        <p className="text-sm text-orange-600 mt-2">
                          Only {item.product.stock} left in stock
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping Button */}
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-[#8B6F47] hover:text-[#6D5836] transition-colors font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Continue Shopping
              </Link>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-sm shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-serif text-[#2C2C2C] mb-6">
                  Order Summary
                </h2>

                {/* Summary Details */}
                <div className="space-y-3 mb-6 pb-6 border-b border-[#E5E5E5]">
                  <div className="flex justify-between text-[#563a13]">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="text-[#2C2C2C] font-medium">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#563a13]">
                    <span>Shipping</span>
                    <span className="text-[#2C2C2C] font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>

                  {subtotal < 3000 && (
                    <p className="text-xs text-[#563a13] bg-[#F5F5DC] p-2 rounded">
                      Add {formatPrice(3000 - subtotal)} more for free shipping
                    </p>
                  )}

                  <div className="flex justify-between text-[#563a13]">
                    <span>GST (18%)</span>
                    <span className="text-[#2C2C2C] font-medium">
                      {formatPrice(gst)}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-lg font-medium text-[#2C2C2C]">Total</span>
                  <span className="text-3xl font-semibold text-[#8B6F47]">
                    {formatPrice(total)}
                  </span>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="block w-full bg-[#8B6F47] text-white py-4 rounded-sm font-medium hover:bg-[#6D5836] transition-colors text-center uppercase tracking-wide mb-4"
                >
                  Proceed to Checkout
                </Link>

                {/* Security Icons */}
                <div className="space-y-3 text-xs text-[#563a13] pt-4 border-t border-[#E5E5E5]">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>7-day return policy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                      />
                    </svg>
                    <span>Free shipping over ₹3000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* You May Also Like Section */}
      {cartItems.length > 0 && (
        <div className="bg-[#4B3621] py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl font-serif text-white mb-2">
              Complete Your Collection
            </h2>
            <p className="text-[#E5E5E5] mb-8">
              Hand-picked pieces that complement your selections
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#C9B896] text-[#2C2C2C] px-8 py-3 rounded-sm font-medium hover:bg-[#B8A785] transition-colors uppercase tracking-wide"
            >
              Browse More
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}