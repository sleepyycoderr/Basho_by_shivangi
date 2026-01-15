"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { VAPI_BASE } from "@/lib/api";

type UserProfile = {
  username: string;
  email: string;
  full_name?: string;
  phone?: string;
  date_joined?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login?next=/profile");
      return;
    }

    fetch(`${VAPI_BASE}/api/accounts/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.clear();
          router.replace("/login");
          return;
        }
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <p className="text-[#563a13] font-serif text-lg">Loading your space…</p>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#FAF8F5] py-16 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-5 mb-12">
          <div className="w-20 h-20 rounded-full bg-[#E7DED3] flex items-center justify-center text-3xl font-serif text-[#563a13]">
            {user.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-serif text-[#563a13]">
              {user.full_name || user.username}
            </h1>
            <p className="text-[#4A5F55] text-sm">
              {user.email}
            </p>
          </div>
        </div>

        {/* Info card */}
        <div className="bg-[#FFFDF9] border border-[#A8A29E]/20 rounded-sm p-8 space-y-6">

          <Info label="Username" value={user.username} />
          <Info label="Email" value={user.email} />
          <Info label="Phone" value={user.phone || "Not added"} />
          <Info
            label="Joined"
            value={
              user.date_joined
                ? new Date(user.date_joined).toDateString()
                : "—"
            }
          />

          <div className="pt-6 border-t border-[#A8A29E]/20 flex flex-wrap gap-4">
            <button
              onClick={() => router.push("profile/orders")}
              className="px-6 py-3 bg-[#563a13] text-white rounded-sm hover:bg-[#652810] transition"
            >
              My Orders
            </button>

            <button
              onClick={() => router.push("profile/workshops")}
              className="px-6 py-3 bg-[#563a13] text-white rounded-sm hover:bg-[#652810] transition"
            >
              My Workshops
            </button>
            
            <button
              onClick={() => router.push("profile/experiences")}
              className="px-6 py-3 bg-[#563a13] text-white rounded-sm hover:bg-[#652810] transition"
            >
              My Experiences
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                router.replace("/login");
              }}
              className="ml-auto text-sm text-[#8B3A3A] hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[#4A5F55]">{label}</span>
      <span className="text-[#563a13] font-medium">{value}</span>
    </div>
  );
}
