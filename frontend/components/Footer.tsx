"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Instagram as InstagramIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
} from "lucide-react";

export default function Footer() {
  const [open, setOpen] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggle = (key: string) => {
    setOpen(open === key ? null : key);
  };

  return (
    <footer className="bg-[var(--basho-teal)] text-[var(--basho-sand)]/90">
      <div className="max-w-7xl mx-auto px-10 py-5 mt-10 grid grid-cols-1 md:grid-cols-4 gap-16">

        {/* Brand */}
        <div className="mb-0">
          <h2 className="text-2xl tracking-widest  mb-4">
            芭蕉 <span className="ml-2">BASHO</span>
          </h2>

          <p className="text-0.5xl leading-relaxed text-white/70">
            Japanese-inspired handcrafted pottery, celebrating the beauty of
            imperfection from our studio in Surat, Gujarat.
          </p>

          <div className="flex gap-4 mt-6">
            <a
              href="https://www.instagram.com/bashobyyshivangi/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[var(--basho-sand)]/20 transition"
            >
              <InstagramIcon size={20} />
            </a>
           <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=bashobyshivangi123@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Email Basho"
            className="
              w-12 h-12
              rounded-full
              bg-white/10
              flex items-center justify-center
              text-white
              hover:bg-[var(--basho-sand)]/20
              hover:scale-110
              transition
            "
          >
            <MailIcon size={20} />
          </a>

          </div>
        </div>

        {/* Quick Links */}
        <FooterSection
          title="Quick Links"
          isMobile={isMobile}
          open={open === "links"}
          onClick={() => toggle("links")}
        >
          <FooterLink href="/shop">Shop Collection</FooterLink>
          <FooterLink href="/workshops">Workshops</FooterLink>
          <FooterLink href="/about">About us</FooterLink>
          <FooterLink href="/custom-orders">Custom Orders</FooterLink>
        </FooterSection>

        {/* Support */}
        <FooterSection
          title="Contact us "
          isMobile={isMobile}
          open={open === "support"}
          onClick={() => toggle("support")}
        >
          <p className="flex gap-3 items-center text-white/70">
            <PhoneIcon size={20} className="mt-1 text-[var(--basho-sand)]/80" />
            +91 99999 88888
          </p>
          <p className="flex gap-3 items-center text-white/70">
            <MailIcon size={20} className="mt-1 text-[var(--basho-sand)]/80" />
            bashobyshivangi123@gmail.com
          </p>
        </FooterSection>
        
        {/* Studio */}
        <FooterSection
          title="Visit Our Studio"
          isMobile={isMobile}
          open={open === "studio"}
          onClick={() => toggle("studio")}
        >
          <p className="flex gap-3 items-start text-white/70">
            <MapPinIcon size={isMobile ? 20 : 30}
           className="mt-0 text-[var(--basho-sand)]/80" />
            Basho Studio, City Light Road, Surat, Gujarat 395007
          </p>
          
        </FooterSection>
      </div>

      {/* Bottom Bar */}
      <div className="mt-16  pb-10 border-t border-white/10" >
        <div className="font-serif max-w-7xl mx-auto px-8 py-4 flex flex-col md:flex-row justify-between text-sm text-white/60 items-center gap-4">
          <span>© 2024 Basho by Shivangi. All rights reserved.</span>
          <span className="italic">"Beauty in imperfection"</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Helper Components ---------- */

function FooterSection({
  title,
  children,
  isMobile,
  open,
  onClick,
}: {
  title: string;
  children: React.ReactNode;
  isMobile: boolean;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <div>
      <h3
        className="text-sm uppercase tracking-widest mb-6 flex justify-between items-center cursor-pointer md:cursor-auto"
        onClick={isMobile ? onClick : undefined}
      >
        {title}
        {isMobile &&
          (open ? (
            <ChevronUpIcon size={16} />
          ) : (
            <ChevronDownIcon size={16} />
          ))}
      </h3>

      <div
        className={`space-y-4 text-sm text-[var(--basho-muted)] overflow-hidden transition-all duration-300 ${
          isMobile ? (open ? "max-h-96" : "max-h-0") : "max-h-full"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="text-white/70 hover:text-[var(--basho-sand)] block ">
      {children}
    </Link>
  );
}