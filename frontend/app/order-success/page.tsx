"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5dc] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-[var(--basho-brown)]/20">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle
            size={64}
            className="text-[var(--basho-terracotta)]"
          />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-[var(--basho-dark)] mb-2">
          Order Placed Successfully 🌿
        </h1>

        {/* Message */}
        <p className="text-sm text-[var(--basho-dark)]/80 mb-4">
          Thank you for supporting handcrafted ceramics.
          Your payment was received and your order is being prepared with care.
        </p>

        {/* Divider */}
        <div className="h-px bg-[var(--basho-brown)]/20 my-4" />

        {/* Info */}
        <p className="text-xs text-[var(--basho-dark)]/70 mb-6">
          You will receive an email confirmation once the order is verified.
          Our artisans will begin crafting your piece shortly.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/shop"
            className="w-full py-2 rounded-lg bg-[var(--basho-brown)] text-white text-sm hover:bg-[var(--basho-terracotta)] transition"
          >
            Continue Shopping
          </Link>

          <Link
            href="/"
            className="w-full py-2 rounded-lg border border-[var(--basho-brown)] text-[var(--basho-brown)] text-sm hover:bg-[var(--basho-sand)] transition"
          >
            Go to Home
          </Link>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-xs text-[var(--basho-dark)]/60">
          – Basho by Shivangi
        </p>
      </div>
    </div>
  );
}
