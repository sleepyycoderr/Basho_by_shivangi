'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const router = useRouter();

  const {
    cartItems,
    cartCount,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    isReady,
  } = useCart();

  // 🚫 Prevent hydration bugs
  if (!isReady) return null;

  // 🚦 Hard protection
  useEffect(() => {
    if (cartItems.length === 0) {
      router.replace('/shop');
    }
  }, [cartItems, router]);

  const subtotal = getCartTotal();
  const shipping = subtotal >= 3000 ? 0 : 100;
const gst = Math.round((subtotal + shipping) * 0.18 * 100) / 100;

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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div
                key={`${item.product.id}-${item.selectedColor.code}`}
                className="bg-white rounded-sm shadow-md border border-[#E5E5E5] p-6"
              >
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="relative w-32 h-32 bg-[#E8DFD0] rounded-sm overflow-hidden shrink-0">
                    <Image
                      src={
                        item.product.images?.[0] ||
                        '/placeholder.jpg'
                      }
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
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

                        <p className="text-sm text-[#563a13]">
                          Category: {item.product.category}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(
                            item.product.id,
                            item.selectedColor.code
                          )
                        }
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        🗑
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-6 text-[#662619]">
                      {/* Qty */}
                      <div className="flex items-center border-2 border-[#563a13] rounded-sm">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedColor.code,
                              item.quantity - 1
                            )
                          }
                          disabled={
                            item.quantity <=1
                          }
                          className="px-4 py-2"
                        >
                          −
                        </button>

                        <span className="px-6 py-2 font-semibold border-x min-w-[56px] text-center">
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
                          disabled={
                            item.quantity >= item.product.stock
                          }
                          className="px-4 py-2 disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-2xl font-semibold text-[#563a13]">
                          {formatPrice(
                            item.product.price * item.quantity
                          )}
                        </p>
                        <p className="text-sm text-[#563a13]">
                          {formatPrice(item.product.price)} each
                        </p>
                      </div>
                    </div>

                    {/* Stock */}
                    {item.quantity >= item.product.stock && (
                      <p className="text-sm text-red-600 mt-2">
                        Stock limit reached
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[#8B6F47]"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Right */}
          <div className="lg:col-span-1">
            <div className="bg-white text-[#662619] rounded-sm shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-serif mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>{formatPrice(gst)}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span>Total</span>
                <span className="text-2xl font-semibold">
                  {formatPrice(total)}
                </span>
              </div>

              <button
  onClick={() => {
    if (cartItems.length === 0) {
      router.replace('/shop');
    } else {
      router.push('/checkout');
    }
  }}
  className="block w-full bg-[#8B6F47] text-white py-4 rounded-sm text-center uppercase"
>
  Proceed to Checkout
</button>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
