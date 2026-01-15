"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VAPI_BASE } from "@/lib/api";

export default function MyWorkshops() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return router.replace("/login?next=/profile/workshops");

    fetch(`${VAPI_BASE}/api/workshops/my-workshops/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(d => {
        setData(d.workshops || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <p className="font-serif text-[#563a13]">Loading your workshops…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] py-16 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-serif text-[#563a13] mb-2">
            My Workshops
          </h1>
          <p className="text-[#4A5F55] text-sm">
            Your registered pottery & craft workshops
          </p>
        </div>

        {data.length === 0 && (
          <div className="bg-[#FFFDF9] border border-[#A8A29E]/20 rounded-sm p-10 text-center">
            <p className="text-[#4A5F55]">You haven’t joined any workshops yet.</p>
          </div>
        )}

        <div className="space-y-6">
          {data.map(w => (
            <div
              key={w.id}
              className="bg-[#FFFDF9] border border-[#A8A29E]/20 rounded-sm p-6"
            >
              <div className="flex justify-between items-center mb-3">
                <p className="font-serif text-[#563a13] text-lg">
                  Workshop Order #{w.id}
                </p>
                <span className="text-sm px-3 py-1 rounded-full bg-[#E7DED3] text-[#563a13]">
                  Paid
                </span>
              </div>

              <div className="text-sm text-[#4A5F55] space-y-1">
                <p>
                  Amount: <span className="text-[#563a13] font-medium">₹{w.amount}</span>
                </p>
                <p>Date: {new Date(w.date).toDateString()}</p>
              </div>
            </div>
          ))}
        </div>

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
