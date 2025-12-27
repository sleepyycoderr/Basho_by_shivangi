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
    <footer className="bg-[var(--basho-teal)] text-[var(--basho-sand)]">
      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Brand */}
        <div>
          <h2 className="text-2xl tracking-widest mb-4">
            芭蕉 <span className="ml-2">BASHO</span>
          </h2>

          <p className="text-sm leading-relaxed text-[var(--basho-muted)]">
            Japanese-inspired handcrafted pottery, celebrating the beauty of
            imperfection from our studio in Surat, Gujarat.
          </p>

          <div className="flex gap-4 mt-6">
            <a
              href="https://www.instagram.com/bashobyyshivangi/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
            >
              <InstagramIcon size={20} />
            </a>
            <a
              href="mailto:hello@bashobyshivangi.com"
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
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
          <FooterLink href="/">Shop Collection</FooterLink>
          <FooterLink href="/">Workshops</FooterLink>
          <FooterLink href="/">Our Philosophy</FooterLink>
          <FooterLink href="/">Custom Orders</FooterLink>
        </FooterSection>

        {/* Support */}
        <FooterSection
          title="Support"
          isMobile={isMobile}
          open={open === "support"}
          onClick={() => toggle("support")}
        >
          <FooterLink href="/">Shipping & Returns</FooterLink>
          <FooterLink href="/">Care Instructions</FooterLink>
          <FooterLink href="/">FAQ</FooterLink>
          <FooterLink href="/">Contact Us</FooterLink>
        </FooterSection>

        {/* Studio */}
        <FooterSection
          title="Visit Our Studio"
          isMobile={isMobile}
          open={open === "studio"}
          onClick={() => toggle("studio")}
        >
          <p className="flex gap-3 items-start">
            <MapPinIcon size={16} className="mt-1" />
            Basho Studio, City Light Road, Surat, Gujarat 395007
          </p>
          <p className="flex gap-3 items-center">
            <PhoneIcon size={16} />
            +91 99999 88888
          </p>
          <p className="flex gap-3 items-center">
            <MailIcon size={16} />
            hello@bashobyshivangi.com
          </p>
        </FooterSection>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--basho-divider)]">
        <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between text-xs text-[var(--basho-muted)]">
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
    <Link href={href} className="hover:text-white block">
      {children}
    </Link>
  );
}
