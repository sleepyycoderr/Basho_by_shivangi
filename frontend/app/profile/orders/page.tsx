"use client";

import { useEffect, useState } from "react";
import { VAPI_BASE } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.replace("/login?next=/profile/orders");
      return;
    }

    fetch(`${VAPI_BASE}/api/orders/my-orders/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <p className="font-serif text-[#563a13] text-lg">Loading your orders…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] py-16 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-serif text-[#563a13] mb-2">
            My Orders
          </h1>
          <p className="text-[#4A5F55] text-sm">
            Your handcrafted pieces & past purchases
          </p>
        </div>

        {/* Empty state */}
        {orders.length === 0 && (
          <div className="bg-[#FFFDF9] border border-[#A8A29E]/20 rounded-sm p-10 text-center">
            <p className="text-[#4A5F55]">You haven’t placed any orders yet.</p>
          </div>
        )}

        {/* Orders */}
        <div className="space-y-6">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-[#FFFDF9] border border-[#A8A29E]/20 rounded-sm p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <p className="font-serif text-[#563a13] text-lg">
                  Order #{order.id}
                </p>
                <span className="text-sm px-3 py-1 rounded-full bg-[#E7DED3] text-[#563a13]">
                  {order.status}
                </span>
              </div>

              <div className="text-sm text-[#4A5F55] space-y-1 mb-4">
                <p>Total: <span className="text-[#563a13] font-medium">₹{order.total}</span></p>
                <p>Date: {new Date(order.created_at).toDateString()}</p>
              </div>

              {/* Items */}
              <div className="border-t border-[#A8A29E]/20 pt-4 space-y-2">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-[#563a13]">
                      {item.name} × {item.qty}
                    </span>
                    <span className="text-[#4A5F55]">
                      ₹{item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Back */}
        <div className="mt-12">
          <button
            onClick={() => router.push("/profile")}
            className="text-sm text-[#563a13] hover:underline"
          >
            ← Back to profile
          </button>
        </div>

      </div>
    </main>
  );
}
