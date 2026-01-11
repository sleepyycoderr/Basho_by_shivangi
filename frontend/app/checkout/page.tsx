'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { useRouter } from "next/navigation";
import { VAPI_BASE } from "@/lib/api";
import { loadRazorpay } from "@/lib/loadRazopay";




export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getCartTotal } = useCart();
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    fullName: '',
    addressLine: '',
    apartment: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    shippingMethod: 'standard',
  });

  const subtotal = getCartTotal();
  const shipping = subtotal >= 3000 ? 0 : 100;
  const gst = Math.round((subtotal + shipping) * 0.18);
  const total = subtotal + shipping + gst;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch(
      `${VAPI_BASE}/api/orders/checkout/product/`,
      {
        method: "POST",
        credentials: "include", // 🔥 REQUIRED
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: `${formData.addressLine}, ${formData.apartment || ""}, ${formData.landmark || ""}`,
            city: formData.city,
            pincode: formData.pincode,
          },
          items: cartItems.map((item) => ({
            id: item.product.id,
            qty: item.quantity,
          })),
        }),
      }
    );

    let data;
try {
  data = await response.json();
} catch {
  throw new Error("Backend did not return JSON");
}


    if (!response.ok) {
      alert(data.error || "Order creation failed");
      return;
    }
 const razorpayLoaded = await loadRazorpay();

    if (!razorpayLoaded) {
      alert("Razorpay SDK failed to load");
      return;
    }
    // Razorpay
    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      name: "Basho by Shivangi",
      order_id: data.razorpay_order_id,
      handler: async function (response: any) {
        await fetch(`${VAPI_BASE}/api/orders/payment/verify/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });

        await fetch(`${VAPI_BASE}/api/orders/cart/clear/`, {
          method: "POST",
          credentials: "include",
        });

        router.push("/order-success");
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error(err);
    alert("Checkout failed");
  }
};

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <svg
            className="w-24 h-24 mx-auto mb-6 text-[#A8A29E]"
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
          <h2 className="text-2xl font-serif text-[#563a13] mb-3">
            Your cart is empty
          </h2>
          <p className="text-[#4A5F55] mb-8 leading-relaxed">
            Begin your journey by exploring our collection of handcrafted pottery.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#563a13] text-[#FFFDF9] px-8 py-3 rounded-sm font-medium hover:bg-[#652810] transition-colors"
          >
            Browse Collection
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] py-8 md:py-16">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-serif text-[#563a13] mb-2">
          Complete Your Order
        </h1>
        <p className="text-[#4A5F55] leading-relaxed">
          Each piece will be carefully crafted and packed by hand.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 md:px-8">
        {formError && (
          <div className="mb-6 bg-[#FFF1F1] border border-[#E5B4B4] text-[#7A1F1F] px-4 py-3 rounded-sm text-sm">
            {formError}
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left section */}
          <div className="lg:col-span-3 space-y-8">
            {/* Contact info */}
            <section>
              <h2 className="text-xl font-serif text-[#563a13] mb-5 pb-3 border-b border-[#A8A29E]/20">
                Contact Information
              </h2>
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-[#4A5F55] mb-2 tracking-wide"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-white border border-[#A8A29E]/30 rounded-sm text-[#563a13] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#563a13] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm text-[#4A5F55] mb-2 tracking-wide"
                  >
                    Phone number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    pattern="[6-9][0-9]{9}"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+91 xxxxxxxxxx"
                    className="w-full px-4 py-3 bg-white border border-[#A8A29E]/30 rounded-sm text-[#563a13] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#563a13] transition-colors"
                  />
                </div>
              </div>
            </section>

            {/* Shipping address */}
            <section>
              <h2 className="text-xl font-serif text-[#563a13] mb-5 pb-3 border-b border-[#A8A29E]/20">
                Shipping Address
              </h2>
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm text-[#4A5F55] mb-2 tracking-wide"
                  >
                    Full name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="Your full name"
                    className="w-full px-4 py-3 bg-white border border-[#A8A29E]/30 rounded-sm text-[#563a13] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#563a13] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="addressLine"
                    className="block text-sm text-[#4A5F55] mb-2 tracking-wide"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="addressLine"
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleInputChange}
                    required
                    placeholder="Street address, apartment number"
                    className="w-full px-4 py-3 bg-white border border-[#A8A29E]/30 rounded-sm text-[#563a13] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#563a13] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="apartment"
                    className="block text-sm text-[#4A5F55] mb-2"
                  >
                    Flat, House no., Building, Company, Apartment
                  </label>
                  <input
                    type="text"
                    id="apartment"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    placeholder="e.g. 402, Lotus Residency"
                    className="w-full px-4 py-3 bg-white border border-[#A8A29E]/30 rounded-sm text-[#563a13]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="landmark"
                    className="block text-sm text-[#4A5F55] mb-2"
                  >
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    id="landmark"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="e.g. Near City Light Petrol Pump"
                    className="w-full px-4 py-3 bg-white border border-[#A8A29E]/30 rounded-sm text-[#563a13]"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm text-[#4A5F55] mb-2 tracking-wide"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="City"
                      className="w-full px-4 py-3 bg-white border border-[#A8A29E]/30 rounded-sm text-[#563a13] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#563a13] transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm text-[#4A5F55] mb-2 tracking-wide"
                    >
                      State
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-[#A8A29E]/30 rounded-sm text-[#563a13] focus:outline-none focus:border-[#563a13] transition-colors"
                    >
                      <option value="">Select state</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      {/* Add more states as needed */}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="pincode"
                      className="block text-sm text-[#4A5F55] mb-2 tracking-wide"
                    >
                      Pincode
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      pattern="[1-9][0-9]{5}"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      placeholder="400001"
                      maxLength={6}
                      className="w-full px-4 py-3 bg-white border border-[#A8A29E]/30 rounded-sm text-[#563a13] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#563a13] transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm text-[#4A5F55] mb-2 tracking-wide"
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      readOnly
                      className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#A8A29E]/30 rounded-sm text-[#4A5F55] cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping method */}
            <section>
              <h2 className="text-xl font-serif text-[#563a13] mb-5 pb-3 border-b border-[#A8A29E]/20">
                Shipping Method
              </h2>
              <div className="bg-white border border-[#A8A29E]/30 rounded-sm p-5 cursor-pointer hover:border-[#563a13] transition-colors">
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    id="standard"
                    name="shippingMethod"
                    value="standard"
                    checked={formData.shippingMethod === 'standard'}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 text-[#563a13] border-[#A8A29E] focus:ring-[#563a13]"
                  />
                  <label htmlFor="standard" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-[#563a13]">
                        Standard Delivery
                      </span>
                      <span className="text-[#4A5F55]">
                        {shipping === 0 ? 'Free' : formatPrice(shipping)}
                      </span>
                    </div>
                    <p className="text-sm text-[#4A5F55] leading-relaxed">
                      5-7 business days · Each piece is carefully packed by hand in
                      eco-friendly materials
                    </p>
                  </label>
                </div>
              </div>

              <div className="mt-4 bg-[#FFFDF9] border border-[#A8A29E]/20 rounded-sm p-4">
                <p className="text-sm text-[#4A5F55] leading-relaxed italic">
                  Your pottery will be crafted & packed with care. Natural
                  variations make each piece unique.
                </p>
              </div>
            </section>
          </div>

          {/* Right section */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              {/* Order summary */}
              <div className="bg-[#FFFDF9] border border-[#A8A29E]/20 rounded-sm p-6 shadow-sm">
                <h2 className="text-xl font-serif text-[#563a13] mb-6 pb-4 border-b border-[#A8A29E]/20">
                  Order Summary
                </h2>

                <div className="space-y-5 mb-6">
                  {cartItems.map(item => (
                    <div
                      key={`${item.product.id}-${item.selectedColor.code}`}
                      className="flex gap-4"
                    >
                      <div className="relative w-20 h-20 bg-[#FAF8F5] rounded-sm overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#563a13] text-white text-xs flex items-center justify-center rounded-full font-medium">
                          {item.quantity}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-[#563a13] font-medium mb-1 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-[#4A5F55] mb-2">
                          {item.selectedColor.name}
                        </p>
                        <p className="text-sm text-[#563a13] font-medium">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-5 border-t border-[#A8A29E]/20">
                  <div className="flex justify-between text-[#4A5F55]">
                    <span>Subtotal</span>
                    <span className="text-[#563a13] font-medium">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#4A5F55]">
                    <span>Shipping</span>
                    <span className="text-[#563a13] font-medium">
                      {shipping === 0 ? (
                        <span className="text-[#4A7C59]">Free</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>

                  {subtotal < 3000 && (
                    <p className="text-xs text-[#4A5F55] bg-[#FAF8F5] px-3 py-2 rounded-sm">
                      Add {formatPrice(3000 - subtotal)} more for free shipping
                    </p>
                  )}

                  <div className="flex justify-between text-[#4A5F55]">
                    <span>GST (18%)</span>
                    <span className="text-[#563a13] font-medium">{formatPrice(gst)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pt-5 mt-5 border-t border-[#A8A29E]/20">
                  <span className="text-lg font-serif text-[#563a13]">Total</span>
                  <span className="text-2xl font-serif text-[#563a13]">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Payment / Place order */}
              <div className="mt-6 bg-[#FFFDF9] border border-[#A8A29E]/20 rounded-sm p-6">
                <h3 className="text-lg font-serif text-[#563a13] mb-4">
                  Payment
                </h3>

                <div className="bg-white border border-[#A8A29E]/20 rounded-sm p-4 mb-4">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <svg
                      className="w-5 h-5 text-[#4A7C59]"
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
                    <span className="text-sm text-[#4A5F55]">
                      Secure payment powered by Razorpay
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-4 pt-3 border-t border-[#A8A29E]/10">
                    <div className="text-xs text-[#A8A29E] flex items-center gap-2">
                      <span className="w-8 h-5 bg-[#FAF8F5] border border-[#A8A29E]/20 rounded-sm flex items-center justify-center text-[10px] font-medium">
                        UPI
                      </span>
                      <span className="w-8 h-5 bg-[#FAF8F5] border border-[#A8A29E]/20 rounded-sm flex items-center justify-center">
                        💳
                      </span>
                      <span className="w-8 h-5 bg-[#FAF8F5] border border-[#A8A29E]/20 rounded-sm flex items-center justify-center">
                        🏦
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#563a13] text-[#FFFDF9] py-4 rounded-sm font-medium hover:bg-[#652810] transition-colors focus:outline-none focus:ring-2 focus:ring-[#563a13] focus:ring-offset-2"
                >
                  Place Order
                </button>

                <Link
                  href="/cart"
                  className="block text-center text-sm text-[#4A5F55] hover:text-[#563a13] transition-colors mt-4"
                >
                  ← Return to cart
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-6 space-y-2 text-xs text-[#4A5F55]">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[#4A7C59]"
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
                    className="w-4 h-4 text-[#4A7C59]"
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
                  <span>Eco-friendly packaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[#4A7C59]"
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
                  <span>Each piece is handcrafted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}