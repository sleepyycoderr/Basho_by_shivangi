"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-white border-b border-[var(--basho-divider)]">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">

        {/* LOGO */}
        <Link href="#" className="flex items-center">
          <Image
            src="/images/basho_logo.jpg"
            alt="Basho by Shivangi"
            width={140}
            height={40}
            priority
          />
        </Link>

        {/* NAV + ACTIONS WRAPPER */}
        <div className="hidden md:flex items-center gap-6">

          {/* NAV LINKS */}
          <nav className="flex items-center gap-8 text-sm tracking-widest uppercase text-[#652810]">

            <Link href="#" className="hover:text-[var(--basho-muted)]">Shop</Link>
            <Link href="#" className="hover:text-[var(--basho-muted)]">Workshops</Link>
            <Link href="#" className="hover:text-[var(--basho-muted)]">Experiences</Link>
            <Link href="#" className="hover:text-[var(--basho-muted)]">Studio</Link>
            <Link href="#" className="hover:text-[var(--basho-muted)]">Gallery</Link>
            <Link href="#" className="hover:text-[var(--basho-muted)]">Custom Orders</Link>
            <Link href="#" className="hover:text-[var(--basho-muted)]">Corporate</Link>
            </nav>


          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4 ml-4">
            <Link href="#" 
            className="relative text-[#652810] "
>
              <ShoppingBag size={22} />
            </Link>

            <Link
              href="#"
              className="px-4 py-2 text-sm border border-[#652810] text-[#652810] hover:bg-[#652810] hover:text-white transition"
            >
              Login
            </Link>

            <Link
              href="#"
              className="px-4 py-2 text-sm border border-[#652810] text-[#652810] hover:bg-[#652810] hover:text-white transition"
            
            >
              Register
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
