"use client";

import Image from "next/image";
import Link from "next/link";


export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[var(--basho-divider)]">

      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">

        {/* LOGO */}
       <Link href="/" className="flex items-center h-10 overflow-hidden">
  <Image
    src="/images/basho_logo.jpg"
    alt="Basho by Shivangi"
    width={140}
    height={60}
    priority
    className="object-cover object-center"
  />
</Link>


        {/* NAV + ACTIONS WRAPPER */}
        <div className="hidden md:flex items-center gap-6">

          {/* NAV LINKS */}
          <nav className="flex items-center gap-8 text-sm tracking-widest uppercase text-[#652810]">


            
            <Link href="/shop" className="hover:text-[var(--basho-muted)]">SHOP</Link>
            <Link href="/workshops" className="hover:text-[var(--basho-muted)]">WORKSHOPS</Link>
            <Link href="/experiences" className="hover:text-[var(--basho-muted)]">EXPERIENCES</Link>
            <Link href="/studio" className="hover:text-[var(--basho-muted)]">STUDIO</Link>
            <Link href="/gallery" className="hover:text-[var(--basho-muted)]">GALLERY</Link>
            <Link href="/about" className="hover:text-[var(--basho-muted)]">ABOUT US</Link>
            <Link href="/corporate" className="hover:text-[var(--basho-muted)]">CORPORATE</Link>

            </nav>


          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4 ml-4">
            



            <Link
              href="/login"
              className="px-4 py-2 text-sm border border-[#652810] text-[#652810] hover:bg-[#652810] hover:text-white transition"
            >
              Login
            </Link>

            <Link
              href="/register"
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
