"use client";

import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function WorkshopSuccessPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f6f1e7] via-[#f5f0e6] to-[#ede3d2] px-4">

      {/* Ambient clay blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#c97c5d]/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-[#8c5a3c]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#e2b091]/30 rounded-full blur-3xl" />

      {/* Floating dust particles */}
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-[#8c5a3c]/30"
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, -120 - i * 20],
            x: [0, i % 2 === 0 ? 40 : -40],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
          style={{
            left: `${10 + i * 7}%`,
            bottom: "10%",
          }}
        />
      ))}

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)] p-8 text-center border border-[#8c5a3c]/20"
      >

        {/* Golden halo */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#e2b091]/20 via-transparent to-[#8c5a3c]/20 pointer-events-none" />

        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
          className="relative flex justify-center mb-4"
        >
          <div className="absolute w-24 h-24 rounded-full bg-[#e2b091]/30 blur-xl" />
          <CalendarCheck size={72} className="relative text-[#8c5a3c]" />
        </motion.div>

        {/* Heading */}
        <h1 className="text-3xl font-serif text-[#563a13] mb-2 tracking-wide">
          You’re on the wheel
        </h1>

        {/* Message */}
        <p className="text-sm text-[#4A5F55] leading-relaxed mb-4">
          Your seat in our pottery workshop has been reserved.
          We can’t wait to shape, spin, and create together.
        </p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#8c5a3c]/30 to-transparent my-5" />

        {/* Info */}
        <p className="text-xs text-[#4A5F55]/80 mb-7 leading-relaxed">
          A confirmation email with workshop details, timings, and
          preparation notes will arrive shortly.  
          All materials are provided — just bring your curiosity.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/workshops"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8c5a3c] to-[#c97c5d] text-white text-sm font-medium tracking-wide hover:scale-[1.02] transition-transform shadow-md"
          >
            View Upcoming Workshops
          </Link>

          <Link
            href="/"
            className="w-full py-3 rounded-xl border border-[#8c5a3c]/40 text-[#8c5a3c] text-sm hover:bg-[#f5efe6] transition"
          >
            Return to Home
          </Link>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-xs italic text-[#4A5F55]/70">
          — hands in clay, mind at ease
          <br />
          <span className="not-italic font-medium">Basho by Shivangi</span>
        </p>
      </motion.div>
    </div>
  );
}